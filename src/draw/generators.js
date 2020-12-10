const inwardSymmetry = (p, max) => (p > (max - 1) / 2 ? max - 1 - p : p);
const outwardSymmetry = (p, max) =>
    p < (max - 1) / 2 ? (max - 1) / 2 - p : p - (max - 1) / 2;
const reverseInwardSymmetry = (p, max) => (p < (max - 1) / 2 ? max - 1 - p : p);
const reverseOutwardSymmetry = (p, max) =>
    p < (max - 1) / 2 ? p + 1 + (max - 1) / 2 : max - p + (max - 1) / 2;

export const biDissolve = (p, x, y, { r, w }) => {
    const flipX = inwardSymmetry(x, w);
    let v = (r * 0.001) / p.cos((y * flipX) / p.pow(2, p.noise(flipX) * y));
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -3, 3);
};

export const quadDissolve = (p, x, y, { h, w }) => {
    const flipX = inwardSymmetry(x, w);
    const symY = outwardSymmetry(y, h);
    let v = 1 / p.cos((symY * flipX) / p.pow(2, p.noise(flipX) * symY));
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -3, 3);
};

export const quadTexture = (p, x, y, { r, h, w }) => {
    const flipX = inwardSymmetry(x, w);
    const symY = outwardSymmetry(y, h);
    let v = 1 / p.cos((r * p.noise(flipX) * symY) / flipX);
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -3, 3);
};

export const mirrorCos = (p, x, y, { r, w, h }) =>
    p.norm(p.cos(r * outwardSymmetry(x, w) * outwardSymmetry(y, h)), -1, 1);
mirrorCos.noNoise = true;

export const flipCos = (p, x, y, { r, w, h }) =>
    p.norm(p.cos(r * inwardSymmetry(x, w) * inwardSymmetry(y, h)), -1, 1);
flipCos.noNoise = true;

export const reversePowCos = (p, x, y, { r, w, h }) => {
    const symX = reverseInwardSymmetry(x, w);
    const symY = reverseInwardSymmetry(y, h);
    let v =
        0.00000000000005 *
        r *
        p.pow(symX * symY, 3) *
        p.cos(1000 * r * (2 / symY) * (2 / symX));
    if (Number.isNaN(v)) {
        v = 0;
    }
    return v;
};
reversePowCos.noNoise = true;

export const powCos = (p, x, y, { r, w, h }) => {
    const symY = reverseOutwardSymmetry(y, h);
    const symX = reverseOutwardSymmetry(x, w);
    let v =
        0.00000000000005 *
        r *
        p.pow(symX * symY, 3) *
        p.cos(1000 * r * (2 / symY) * (2 / symX));
    if (Number.isNaN(v)) {
        v = 0;
    }
    return v;
};
powCos.noNoise = true;

export const powNoise = (p, x, y, { r, w, h }) => {
    const symY = reverseOutwardSymmetry(y, h);
    const symX = reverseOutwardSymmetry(x, w);
    let v =
        0.00000000000005 *
        r *
        p.pow(symX * symY, 3) *
        p.cos(p.noise(symX) * p.noise(symY) * 100000 * (2 / symY) * (2 / symX));
    if (Number.isNaN(v)) {
        v = 0;
    }
    return v;
};

// export const playground = (p, x, y, { r, h, w }) => {
//     const flipX = inwardSymmetry(x, w);
//     let v = (r * 0.001) / p.cos((y * flipX) / p.pow(2, p.noise(flipX) * y));
//     if (Number.isNaN(v)) {
//         v = 0;
//     }
//     return p.norm(v, -3, 3);
// };
//
// export const playground2 = (p, x, y, { r, h, w }) => {
//     const flipX = x > (w - 1) / 2 ? x : x - w;
//
//     const symX = x > (w - 1) / 2 ? (w - 1) / 2 - x : x - (w - 1) / 2;
//     const symY = y > (h - 1) / 2 ? (h - 1) / 2 - y : y - (h - 1) / 2;
//     let v = p.noise(r * symX, symY * symX);
//     if (Number.isNaN(v)) {
//         v = 0;
//     }
//     return p.norm(v, 0, 1);
// };

const ff = (p) => (x, y) => {
    const flipX = x > 50 ? 100 - x : x;
    let v = 1 / p.cos((y * flipX) / p.pow(2, p.noise(flipX) * y)); // weird tree
    // let v = p.cos(2 * x * (666 * y)); // so much potential!!!
    // let v = p.cos(11 * x * (6969 * y));
    // let v = p.cos(118 * x * (6969 * y)); // square in diamond grid
    // let v = p.cos(11 * x * (88 * y));
    // let v = p.cos(11 * x * (6969 * y)); // symmetrical grid
    // let v = p.cos(2 * x * (666 * y)); // 179 square canvas
    // let v = p.cos(2 * x * (666 * y)); // so much potential!!!
    // let v = p.cos((3.01 * x) / p.pow(0.36 * x, (0.051 * x) / (y * 1))); // swirly moire
    // let v = p.cos((y * p.pow(6, 66)) / p.pow(2, x)); // weird tree
    // let v = p.sin((1 * x) / (4 * (y / (2 * x)))); // parallel curves
    // let v = p.sin(x * p.pow(2, y)); // lumpy tree
    // let v = p.sin(p.cos(x) * y); // flamey-ghouly grid
    // let v = p.cos((x / 2) * y); // cuboid grid
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -1, 1);
};

const ffff = (p) => (x, y) => {
    let v = p.fract(10000 * p.pow(x, p.cos(p.noise(x, y))));
    // let v = 0.000000002 * p.pow(x * y, 0.1) * p.cos(499999 * (2 / y) * (2 / x)); // concentring demon!!
    // let v = 0.000000002 * p.pow(x * y, 0.1) * p.cos(999999 * (2 / y) * (2 / x)); // concentrings
    // let v = 0.000000002 * p.pow(x * y, 0.01) * p.cos(99999999 * (2 / y) * (2 / x)); // demon
    // let v = 0.000000002 * p.pow(x * y, 3) * p.cos(9999999 * (2 / y) * (2 / x)); // machine elf
    // let v = 0.00000000002 * p.pow(x * y, 3) * p.cos(2.2 * y * x); // symmetric dissolve
    // let v = 0.00007 * p.pow(x, 3) * p.cos(2.2 * y * x); // dissolve mosaic

    if (Number.isNaN(v)) {
        v = 0;
    }
    return v;
    // return norm(v, -1, 1);
};
