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
export const PRESET_PALETTES = [
    // Popular palettes taken from colors.muz.li
    ["#8a00d4", "#d527b7", "#f782c2", "#f9c46b", "#e3e3e3"],
    ["#e74645", "#fb7756", "#facd60", "#fdfa66", "#1ac0c6"],
    ["#454d66", "#309975", "#58b368", "#dad873", "#efeeb4"],
    ["#272643", "#ffffff", "#e3f6f5", "#bae8e8", "#2c698d"],
    ["#361d32", "#543c52", "#f55951", "#edd2cb", "#f1e8e6"],
    ["#072448", "#54d2d2", "#ffcb00", "#f8aa4b", "#ff6150"],
    ["#12492f", "#0a2f35", "#f56038", "#f7a325", "#ffca7a"],
    ["#122c91", "#2a6fdb", "#48d6d2", "#81e9e6", "#fefcbf"],
    ["#27104e", "#64379f", "#9854cb", "#ddacf5", "#75e8e7"],
    ["#f7a400", "#3a9efd", "#3e4491", "#292a73", "#1a1b4b"],
    ["#343090", "#5f59f7", "#6592fd", "#44c2fd", "#8c61ff"],
    ["#1f306e", "#553772", "#8f3b76", "#c7417b", "#f5487f"],
    ["#e0f0ea", "#95adbe", "#574f7d", "#503a65", "#3c2a4d"],
    ["#f9b4ab", "#fdebd3", "#264e70", "#679186", "#bbd4ce"],
    ["#492b7c", "#301551", "#ed8a0a", "#f6d912", "#fff29c"],
    ["#ffa822", "#134e6f", "#ff6150", "#1ac0c6", "#dee0e6"],
    // Popular colors from ColourLovers.com API
    ["#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900"],
    ["#fe4365", "#fc9d9a", "#f9cdad", "#c8c8a9", "#83af9b"],
    ["#ecd078", "#d95b43", "#c02942", "#542437", "#53777a"],
    ["#556270", "#4ecdc4", "#c7f464", "#ff6b6b", "#c44d58"],
    ["#774f38", "#e08e79", "#f1d4af", "#ece5ce", "#c5e0dc"],
    ["#e8ddcb", "#cdb380", "#036564", "#033649", "#031634"],
    ["#490a3d", "#bd1550", "#e97f02", "#f8ca00", "#8a9b0f"],
    ["#594f4f", "#547980", "#45ada8", "#9de0ad", "#e5fcc2"],
    ["#00a0b0", "#6a4a3c", "#cc333f", "#eb6841", "#edc951"],
    ["#e94e77", "#d68189", "#c6a49a", "#c6e5d9", "#f4ead5"],
    ["#3fb8af", "#7fc7af", "#dad8a7", "#ff9e9d", "#ff3d7f"],
    ["#d9ceb2", "#948c75", "#d5ded9", "#7a6a53", "#99b2b7"],
    ["#ffffff", "#cbe86b", "#f2e9e1", "#1c140d", "#cbe86b"],
    ["#efffcd", "#dce9be", "#555152", "#2e2633", "#99173c"],
    ["#343838", "#005f6b", "#008c9e", "#00b4cc", "#00dffc"],
    ["#413e4a", "#73626e", "#b38184", "#f0b49e", "#f7e4be"],
    ["#ff4e50", "#fc913a", "#f9d423", "#ede574", "#e1f5c4"],
    ["#99b898", "#fecea8", "#ff847c", "#e84a5f", "#2a363b"],
    ["#655643", "#80bca3", "#f6f7bd", "#e6ac27", "#bf4d28"],
    ["#00a8c6", "#40c0cb", "#f9f2e7", "#aee239", "#8fbe00"],
    // 36 best palettes from coolors.co
    ["#fe938c", "#e6b89c", "#ead2ac", "#9cafb7", "#4281a4"],
    ["#5bc0eb", "#fde74c", "#9bc53d", "#e55934", "#fa7921"],
    ["#ed6a5a", "#f4f1bb", "#9bc1bc", "#5ca4a9", "#e6ebe0"],
    ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"],
    ["#0b132b", "#1c2541", "#3a506b", "#5bc0be", "#6fffe9"],
    ["#003049", "#d62828", "#f77f00", "#fcbf49", "#eae2b7"],
    ["#bce784", "#5dd39e", "#348aa7", "#525174", "#513b56"],
    ["#000000", "#14213d", "#fca311", "#e5e5e5", "#ffffff"],
    ["#9c89b8", "#f0a6ca", "#efc3e6", "#f0e6ef", "#b8bedd"],
    ["#114b5f", "#028090", "#e4fde1", "#456990", "#f45b69"],
    ["#f2d7ee", "#d3bcc0", "#a5668b", "#69306d", "#0e103d"],
    ["#dcdcdd", "#c5c3c6", "#46494c", "#4c5c68", "#1985a1"],
    ["#22223b", "#4a4e69", "#9a8c98", "#c9ada7", "#f2e9e4"],
    ["#114b5f", "#1a936f", "#88d498", "#c6dabf", "#f3e9d2"],
    ["#ff9f1c", "#ffbf69", "#ffffff", "#cbf3f0", "#2ec4b6"],
    ["#3d5a80", "#98c1d9", "#e0fbfc", "#ee6c4d", "#293241"],
    ["#06aed5", "#086788", "#f0c808", "#fff1d0", "#dd1c1a"],
    ["#011627", "#f71735", "#41ead4", "#fdfffc", "#ff9f1c"],
    ["#f6511d", "#ffb400", "#00a6ed", "#7fb800", "#0d2c54"],
    ["#d8dbe2", "#a9bcd0", "#58a4b0", "#373f51", "#1b1b1e"],
    ["#7bdff2", "#b2f7ef", "#eff7f6", "#f7d6e0", "#f2b5d4"],
    ["#2d3142", "#4f5d75", "#bfc0c0", "#ffffff", "#ef8354"],
    ["#13293d", "#006494", "#247ba0", "#1b98e0", "#e8f1f2"],
    ["#ffb997", "#f67e7d", "#843b62", "#0b032d", "#74546a"],
    ["#3d315b", "#444b6e", "#708b75", "#9ab87a", "#f8f991"],
    ["#cfdbd5", "#e8eddf", "#f5cb5c", "#242423", "#333533"],
    ["#083d77", "#ebebd3", "#f4d35e", "#ee964b", "#f95738"],
    ["#20bf55", "#0b4f6c", "#01baef", "#fbfbff", "#757575"],
    ["#05668d", "#427aa1", "#ebf2fa", "#679436", "#a5be00"],
    ["#ffbf00", "#e83f6f", "#2274a5", "#32936f", "#ffffff"],
    ["#292f36", "#4ecdc4", "#f7fff7", "#ff6b6b", "#ffe66d"],
    ["#540d6e", "#ee4266", "#ffd23f", "#3bceac", "#0ead69"],
    ["#c9cba3", "#ffe1a8", "#e26d5c", "#723d46", "#472d30"],
    ["#ffa69e", "#faf3dd", "#b8f2e6", "#aed9e0", "#5e6472"],
    ["#1be7ff", "#6eeb83", "#e4ff1a", "#e8aa14", "#ff5714"],
    ["#1b998b", "#2d3047", "#fffd82", "#ff9b71", "#e84855"],
];

// Local storage keys
export const PALETTE_KEY = "palettes";
export const PATTERN_KEY = "patterns2";
