"""
Scoring engine.

Pure functions with no DB/HTTP dependency, so they're trivial to unit test
in isolation. Implements the exact conversion + flooring rules from the spec:

- Distance sports (running/walking/cycling): points scale linearly with
  distance, then the FINAL points value is floored (not the distance).
- Duration sports (gym/swimming): only fully completed minutes count, so
  the duration is floored to whole minutes BEFORE multiplying by rate.
- Steps: only fully completed blocks of 100 steps count, so steps are
  floored to the nearest hundred BEFORE dividing by 100 and multiplying.
"""
import math
from app.models import SportType

# Points per unit, per sport.
DISTANCE_RATE_PER_KM = {
    SportType.RUNNING: 100,
    SportType.WALKING: 50,
    SportType.CYCLING: 25,
}

DURATION_RATE_PER_MIN = {
    SportType.SWIMMING: 15,
    SportType.GYM: 5,
}

STEPS_RATE_PER_100 = 1


def calculate_points(sport: SportType, raw_value: float) -> int:
    """
    raw_value meaning depends on sport:
      - distance sports -> kilometers (float)
      - duration sports  -> seconds (int/float)
      - daily steps      -> step count (int)
    Returns integer points (already floored per spec).
    """
    if sport in DISTANCE_RATE_PER_KM:
        rate = DISTANCE_RATE_PER_KM[sport]
        raw_points = raw_value * rate
        return math.floor(raw_points)

    if sport in DURATION_RATE_PER_MIN:
        rate = DURATION_RATE_PER_MIN[sport]
        whole_minutes = math.floor(raw_value / 60)  # raw_value is seconds
        return whole_minutes * rate

    if sport == SportType.DAILY_STEPS:
        whole_hundreds = math.floor(raw_value / 100) * 100
        return (whole_hundreds // 100) * STEPS_RATE_PER_100

    raise ValueError(f"Unsupported sport: {sport}")
