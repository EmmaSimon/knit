import randomWords from "random-words";

import { DEFAULT_THUMBNAIL_SIZE, GRID_PADDING } from "./constants";

export const xor = (a, b) => {
    return a ? !b : b;
};

export function createArray(length) {
    const arr = [...new Array(length || 0)];
    let i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}

export const getBoundedRandom = (min = -1000, max = 1000) =>
    Math.random() * (max - min) + min;

export const getPatternName = () => randomWords({ exactly: 3, join: " " });

export const getRandomColor = (p) =>
    p
        .color(
            p.random(360),
            p.constrain(p.randomGaussian(90, 10), 50, 100),
            p.constrain(p.randomGaussian(80, 30), 15, 95)
        )
        .toString("#rrggbbaa");

export const getCanvasSize = (
    x,
    y,
    thumb = false,
    thumbSize = DEFAULT_THUMBNAIL_SIZE
) => (thumb ? [thumbSize, thumbSize] : [x, y]);

export const getGridMargin = (showGrid, scale) =>
    showGrid ? scale * 2 + GRID_PADDING : 0;

const IDEAL_SPACING = 5;
const spacingReducer = (a, b) =>
    Math.abs(b - IDEAL_SPACING) < Math.abs(a - IDEAL_SPACING) ? b : a;

export const getHeavyGridSpacing = (w, h) => {
    let modder = 3;
    const widthFactors = [];
    const heightFactors = [];
    while (modder < 8) {
        if (w % modder === 0) {
            widthFactors.push(modder);
        }
        if (h % modder === 0) {
            heightFactors.push(modder);
        }
        modder++;
    }
    if (!widthFactors.length && !heightFactors.length) {
        return IDEAL_SPACING;
    } else if (!widthFactors.length) {
        return heightFactors.reduce(spacingReducer);
    } else if (!heightFactors.length) {
        return widthFactors.reduce(spacingReducer);
    }
    const sharedFactors = widthFactors.filter((s) => heightFactors.includes(s));
    return sharedFactors.length
        ? sharedFactors.reduce(spacingReducer)
        : widthFactors.reduce(spacingReducer);
};

export const arrayWeave = (a, b) =>
    (a.length > b.length ? a : b).reduce(
        (acc, cur, i) => (a[i] && b[i] ? [...acc, a[i], b[i]] : [...acc, cur]),
        []
    );
