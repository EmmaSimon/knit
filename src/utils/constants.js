import { createArray } from "./functions";

// Canvas constants
export const DEFAULT_SCALE = 8;
export const DEFAULT_SIZE = 51;
export const DEFAULT_THUMBNAIL_SIZE = 18;
export const GRID_PADDING = 3;
export const MAX_SCALE = 12;
export const MAX_SIZE = 200;
export const MIN_SCALE = 4;
export const MIN_SIZE = 10;

// Color constants
export const MAX_COLORS = 10;
export const MIN_COLORS = 2;
export const INITIAL_COLOR_NAMES = createArray(MAX_COLORS).map((_, i) =>
    String.fromCharCode("A".charCodeAt(0) + i)
);

// Local storage keys
export const PALETTE_KEY = "palettes";
export const PATTERN_KEY = "patterns2";
