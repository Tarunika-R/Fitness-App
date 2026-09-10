// Single source of truth for color values that need to exist as raw
// hex/rgb (not just Tailwind class names) — e.g. Recharts fills, strokes,
// and gradients, which read colors as props rather than CSS classes.
//
// tailwind.config.js imports THEME_COLORS from this same file, so the
// Tailwind palette and these JS constants can never drift apart: change a
// color here and both the utility classes (bg-track, text-gold, etc.) and
// every chart that imports these constants pick it up together.

export const THEME_COLORS = {
    track: '#0D0B1E',
    trackSurface: '#181530',
    trackSurfaceLight: '#282149',
    gold: '#00F5D4',
    goldDark: '#00BFA5',
    goldLight: '#6FFFE9',
    cinder: '#FF3D81',
    cinderDark: '#D91E63',
    cinderLight: '#FF7AAE',
    chalk: '#F2EFFB',
    chalkMuted: '#9C93C7',
}

// One consistent color per sport, used by the sport-breakdown donut, the
// legend, and anywhere else a sport needs a color swatch.
export const SPORT_COLORS = {
    running: '#00F5D4',
    walking: '#9C93C7',
    cycling: '#4FA3FF',
    gym: '#FF3D81',
    swimming: '#3FE0B6',
    daily_steps: '#B57EFF',
}

export const SPORT_LABELS = {
    running: 'Running',
    walking: 'Walking',
    cycling: 'Cycling',
    gym: 'Gym',
    swimming: 'Swimming',
    daily_steps: 'Daily Steps',
}

// Shared chart tooltip styling, built from the theme tokens above rather
// than repeated as separate hardcoded hex strings in every chart.
export const CHART_TOOLTIP_STYLE = {
    background: THEME_COLORS.trackSurface,
    border: `1px solid ${THEME_COLORS.trackSurfaceLight}`,
    borderRadius: '8px',
    color: THEME_COLORS.chalk,
}
