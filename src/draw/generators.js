export const biDissolve = (p, x, y, { w }) => {
    const flipX = x > (w - 1) / 2 ? w - 1 - x : x;
    let v = 1 / p.cos((y * flipX) / p.pow(2, p.noise(flipX) * y)); // weird tree
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -1, 1);
};

export const quadDissolve = (p, x, y, { h, w }) => {
    const flipX = x > (w - 1) / 2 ? w - 1 - x : x;
    const symY = y < (h - 1) / 2 ? (h - 1) / 2 - y : y - (h - 1) / 2;
    let v = 1 / p.cos((symY * flipX) / p.pow(2, p.noise(flipX) * symY)); // weird tree
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -1, 1);
};

export const quadTexture = (p, x, y, { r, h, w }) => {
    const flipX = x < (w - 1) / 2 ? w - 1 - x : x;
    const symY = y > (h - 1) / 2 ? (h - 1) / 2 - y : y - (h - 1) / 2;
    let v = 1 / p.cos((r * p.noise(flipX) * symY) / flipX);
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -1, 1);
};

export const playground = (p, x, y, { r, h, w }) => {
    const flipX = x > (w - 1) / 2 ? x : x - w;
    const symX = x > (w - 1) / 2 ? (w - 1) / 2 - x : x - (w - 1) / 2;
    const symY = y > (h - 1) / 2 ? (h - 1) / 2 - y : y - (h - 1) / 2;
    let v = p.noise(r * symX, symY * symX);
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, 0, 1);
};

const ff = (p) => (x, y) => {
    const flipX = x > 50 ? 100 - x : x;
    let v = 1 / p.cos((y * flipX) / p.pow(2, p.noise(flipX) * y)); // weird tree
    // let v = cos(2 * x * (666 * y)); // so much potential!!!
    // let v = cos(11 * x * (6969 * y));
    // let v = cos(118 * x * (6969 * y)); // square in diamond grid
    // let v = cos(11 * x * (88 * y));
    // let v = cos(11 * x * (6969 * y)); // symmetrical grid
    // let v = cos(2 * x * (666 * y)); // 179 square canvas
    // let v = cos(2 * x * (666 * y)); // so much potential!!!
    // let v = cos((3.01 * x) / pow(0.36 * x, (0.051 * x) / (y * 1))); // swirly moire
    // let v = cos((y * pow(6, 66)) / pow(2, x)); // weird tree
    // let v = sin((1 * x) / (4 * (y / (2 * x)))); // parallel curves
    // let v = sin(x * pow(2, y)); // lumpy tree
    // let v = sin(cos(x) * y); // flamey-ghouly grid
    // let v = cos((x / 2) * y); // cuboid grid
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -1, 1);
};

const ffff = (p) => (x, y) => {
    let v = p.fract(10000 * p.pow(x, p.cos(p.noise(x, y))));
    // let v = 0.000000002 * pow(x * y, 0.1) * cos(499999 * (2 / y) * (2 / x)); // concentring demon!!
    // let v = 0.000000002 * pow(x * y, 0.1) * cos(999999 * (2 / y) * (2 / x)); // concentrings
    // let v = 0.000000002 * pow(x * y, 0.01) * cos(99999999 * (2 / y) * (2 / x)); // demon
    // let v = 0.000000002 * pow(x * y, 3) * cos(9999999 * (2 / y) * (2 / x)); // machine elf
    // let v = 0.00000000002 * pow(x * y, 3) * cos(2.2 * y * x); // symmetric dissolve
    // let v = 0.00007 * pow(x, 3) * cos(2.2 * y * x); // dissolve mosaic

    if (Number.isNaN(v)) {
        v = 0;
    }
    return v;
    // return norm(v, -1, 1);
};
