# Fitness Challenge — Design Document

## a. System Architecture & Data Flow

### High-level architecture

```mermaid
flowchart TB
    subgraph Client["Browser"]
        UI["React SPA (Vite)\nRegister / Log Activity / Leaderboard / Dashboard"]
    end

    subgraph Server["Backend — FastAPI (Python)"]
        R1["Users Router\nPOST /users"]
        R2["Activities Router\nPOST /activities"]
        R3["Leaderboard/Dashboard Router\nGET /leaderboard, GET /dashboard/{id}"]
        SC["Scoring Engine\n(scoring.py)"]
        CR["CRUD Layer\n(crud.py)"]
    end

    subgraph DB["SQLite (Relational DB)"]
        T1[("users table")]
        T2[("activities table")]
    end

    UI -- "JSON over REST (axios)" --> R1
    UI -- "JSON over REST (axios)" --> R2
    UI -- "JSON over REST (axios)" --> R3

    R1 --> CR
    R2 --> SC
    SC --> CR
    R3 --> CR

    CR --> T1
    CR --> T2
```

**Stack:**
- **Frontend:** React (Vite), React Router, Tailwind CSS, Recharts, Axios.
- **Backend:** Python, FastAPI, Pydantic (validation), SQLAlchemy (ORM).
- **Database:** SQLite (single-file relational DB — trivially portable, zero setup, sufficient for this scope; the ORM abstraction means swapping to Postgres later is a one-line connection-string change).

The frontend never talks to the database directly — every read/write goes through the FastAPI REST layer, which validates input via Pydantic schemas before it reaches business logic.

### Request/response flow — User Registration

1. User submits the registration form (`first_name`, `last_name`, optional `email`) from the React app.
2. `POST /users` request hits the **Users Router**.
3. Pydantic (`UserCreate` schema) validates the shape/types of the payload — malformed JSON is rejected automatically with `422`.
4. The router queries the DB (case-insensitive match on `first_name` + `last_name`).
   - If a match exists → respond `409 Conflict`, no row written.
   - If no match → insert a new `users` row (DB-level `UNIQUE` constraint is the final safety net against race conditions), and return `201 Created` with the generated `userId`.
5. Frontend stores the returned user object (in `localStorage`) to keep the user "signed in" across page refreshes, and redirects to the leaderboard.

### Request/response flow — Activity Data Ingestion

1. User fills in the activity form (sport + sport-specific value) from the React app. The frontend maps the selected sport to its required `metric_type` automatically (e.g. selecting "Running" locks in `distance_km`), so a well-behaved client can't send a mismatched pair — but the backend re-validates independently since it must never trust the client.
2. `POST /activities` hits the **Activities Router** with `{ userId, sport, metric_type, value }`.
3. Pydantic validates types/enum membership (`sport` and `metric_type` must be one of the defined enum values, `value` must be `> 0`) — invalid shapes get `422` automatically.
4. The router checks, in order:
   - **User exists?** → `404 Not Found` if not.
   - **Does `metric_type` match what this `sport` requires** (via `SPORT_METRIC_MAP`)? → `400 Bad Request` if not (e.g. `sport: running` with `metric_type: steps`).
5. If valid, the **Scoring Engine** computes `points` from the raw value using the flooring rules (see section d).
6. The CRUD layer persists a new `activities` row (raw value **and** computed points, so history stays auditable if scoring rules ever change).
7. Response: `201 Created` with the full activity record including computed `points`.
8. The Leaderboard and Dashboard endpoints (`GET /leaderboard`, `GET /dashboard/{userId}`) are pure read/aggregation operations over the `activities` table — no separate leaderboard table is maintained (see section b).

---

## b. Database Schema & Data Model

### `users` table

| Column       | Type     | Constraints                              |
|--------------|----------|-------------------------------------------|
| `id`         | String (UUID) | Primary Key                          |
| `first_name` | String   | Not Null                                  |
| `last_name`  | String   | Not Null                                  |
| `email`      | String   | Nullable                                  |
| `created_at` | DateTime | Default: current UTC time                 |

**Duplicate-user enforcement strategy:** a composite `UNIQUE(first_name, last_name)` constraint at the database level (`uq_user_first_last_name`), combined with an application-level case-insensitive pre-check before insert. The DB constraint is the source of truth — it protects against race conditions (two simultaneous registration requests for the same name) that an application-level check alone could miss; the pre-check exists purely to return a clean `409` with a helpful message instead of a raw DB integrity error.

### `activities` table

| Column         | Type          | Constraints                                          |
|----------------|---------------|-------------------------------------------------------|
| `id`           | String (UUID) | Primary Key                                           |
| `user_id`      | String (UUID) | Foreign Key → `users.id`, Not Null, Indexed           |
| `sport`        | Enum          | Not Null (`running`, `walking`, `cycling`, `gym`, `swimming`, `daily_steps`) |
| `metric_type`  | Enum          | Not Null (`distance_km`, `duration_sec`, `steps`)     |
| `raw_value`    | Float         | Not Null — the value as submitted (km, seconds, or step count) |
| `points`       | Integer       | Not Null — computed, floored points for this entry    |
| `activity_date`| DateTime      | Indexed, defaults to submission time if not provided  |
| `created_at`   | DateTime      | Default: current UTC time                             |

**Why store `raw_value` *and* `points`, instead of recomputing on read:** this makes historical activity records auditable and immune to silent corruption if the scoring formula changes later — old entries keep the points they were awarded at logging time, while new entries use the current formula.

### "Leaderboards" — deliberately not a stored table

The leaderboard is **computed on read** from `activities` (grouped `SUM(points)` per user), not persisted as its own table. Rationale: a stored leaderboard table would need to be kept in sync with every activity insert/update/delete, introducing a second source of truth that can drift. Computing it on read from the single source of truth (`activities`) trades a small amount of read-time aggregation cost for correctness-by-construction — and at this data scale, that aggregation is inexpensive. The 7-day trend is computed the same way, by re-running the aggregation with a `activity_date <= now - 7 days` filter and comparing the resulting rank to the current one.

### Entity relationship

```
users (1) ────< (many) activities
   id  ────────────────  user_id (FK)
```

---

## c. API Specifications

### `POST /users` — User Registration

**Request body:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com"
}
```

**Validation rules:**
- `first_name`, `last_name`: required, string, 1–50 characters.
- `email`: optional, must be a valid email format if provided.
- Combination of `first_name` + `last_name` (case-insensitive) must not already exist.

**Responses:**

| Status | When | Body |
|--------|------|------|
| `201 Created` | Registration succeeds | `{ userId, first_name, last_name, email, created_at }` |
| `409 Conflict` | Name already registered | `{ "detail": "A user named 'Jane Doe' is already registered." }` |
| `422 Unprocessable Entity` | Missing/malformed fields (e.g. missing `last_name`, invalid email format) | FastAPI's standard validation-error body |

### `POST /activities` — Activity Data Ingestion

**Request body:**
```json
{
  "userId": "a1b2c3d4-...",
  "sport": "walking",
  "metric_type": "distance_km",
  "value": 1.55,
  "activity_date": "2026-09-01T10:00:00Z"
}
```

| Field | Type | Notes |
|---|---|---|
| `userId` | string | Must reference an existing user |
| `sport` | enum | `running` \| `walking` \| `cycling` \| `gym` \| `swimming` \| `daily_steps` |
| `metric_type` | enum | `distance_km` \| `duration_sec` \| `steps` |
| `value` | float | Must be `> 0`. Meaning depends on `metric_type`: kilometers, seconds, or step count respectively |
| `activity_date` | datetime | Optional — defaults to submission time |

**Validation rules:**
- `sport` and `metric_type` must each be a recognized enum value → otherwise `422`.
- `metric_type` **must match** the sport's expected metric (via a fixed sport→metric map) → otherwise `400 Bad Request`. Example: `sport: running` requires `metric_type: distance_km`; sending `metric_type: steps` for running is rejected.
- `value` must be greater than 0 → otherwise `422`.
- `userId` must correspond to an existing, registered user → otherwise `404 Not Found`.

**Responses:**

| Status | When | Body |
|--------|------|------|
| `201 Created` | Activity logged successfully | `{ id, userId, sport, metric_type, raw_value, points, activity_date }` |
| `400 Bad Request` | `metric_type` doesn't match `sport` | `{ "detail": "Invalid metric_type 'steps' for sport 'running'. Expected 'distance_km'." }` |
| `404 Not Found` | `userId` doesn't exist | `{ "detail": "No user found with userId '...'." }` |
| `422 Unprocessable Entity` | Malformed schema (bad enum value, missing field, non-positive value) | FastAPI's standard validation-error body |

### Supporting read endpoints (for the frontend)

- **`GET /leaderboard`** → array of `{ rank, userId, first_name, last_name, total_points, points_7_days_ago, rank_7_days_ago, trend, rank_change }`, sorted by `total_points` descending.
- **`GET /dashboard/{userId}`** → `{ userId, first_name, last_name, total_points, current_rank, activity_history[], points_over_time[], sport_breakdown[] }`. Returns `404` if the `userId` doesn't exist.

---

## d. Scoring & Normalization Logic

Implemented in `backend/app/scoring.py` as pure, dependency-free functions (no DB or HTTP calls), so the rules can be unit-tested in isolation.

### Conversion rates

| Sport | Metric | Rate |
|---|---|---|
| Running | 1 km | 100 points |
| Walking | 1 km | 50 points |
| Cycling | 1 km | 25 points |
| Swimming | 1 minute | 15 points |
| Gym | 1 minute | 5 points |
| Daily Steps | 100 steps | 1 point |

### Flooring rules (implemented exactly as specified)

**Distance sports (running / walking / cycling):** points scale linearly with distance; the **final points value** is floored (the distance itself is not floored first).
```
points = floor(distance_km × rate_per_km)
```
Example: 1.55 km walking → `1.55 × 50 = 77.5` → floored → **77 points**.

**Duration sports (gym / swimming):** only fully completed minutes count. The duration (submitted in seconds) is floored to whole minutes **before** multiplying by the rate.
```
whole_minutes = floor(duration_seconds / 60)
points = whole_minutes × rate_per_minute
```
Example: 1 minute 55 seconds (115s) of gym → `floor(115/60) = 1` whole minute → `1 × 5 = 5 points`.

**Daily Steps:** only fully completed blocks of 100 steps count. Steps are floored to the nearest hundred **before** dividing by 100 and applying the rate.
```
whole_hundreds = floor(steps / 100) × 100
points = (whole_hundreds / 100) × rate_per_100_steps
```
Example: 399 steps → `floor(399/100)×100 = 300` → `300/100 = 3` → **3 points**.

All three rules were verified against the exact worked examples given in the assignment spec before integration into the API (1.55 km walking → 77, 399 steps → 3), and again end-to-end through the live API during manual testing.
