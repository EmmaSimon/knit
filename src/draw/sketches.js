import { DEFAULT_SIZE } from "./constants";
import { xor } from "../utils";

const MIN_COLORS = 2;
const MAX_COLORS = 10;

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function getBgColor(p) {
    return p.color(
        p.random(360),
        p.constrain(p.randomGaussian(50, 20), 25, 75),
        p.constrain(p.randomGaussian(40, 10), 15, 70)
    );
}
function getFgColor(p) {
    return p.color(
        p.random(360),
        p.constrain(p.randomGaussian(80, 20), 50, 100),
        p.constrain(p.randomGaussian(70, 30), 15, 95)
    );
}

function getBoundedRandom(p) {
    return p.random(-1000, 1000);
}

const IDENTIFYING_PROPS = {
    id: null,
    name: null,
    workingRow: null,
    isFlipped: null,
};

const getSketchWith = (getF, initialProps = null) => (p) => {
    if (!p) {
        console.error("Missing p5 object, bailing");
        return;
    }
    let props = {
        w: DEFAULT_SIZE,
        h: DEFAULT_SIZE,
        scale: 6,
        colors: [],
        numColors: 2,
        r: getBoundedRandom(p),
        noiseSeed: getBoundedRandom(p),
        ...initialProps,
    };
    props.f = getF(p, props);
    if (props?.colors?.length) {
        props.colors = props.colors.map((color) =>
            typeof color === "string" ? p.color(color) : color
        );
    }
    let setSketchState = () => {};
    let handleSavePattern = () => {};

    let xRot = 0;
    let yRot = 0;
    let zRot = 0;

    let gridArr = createArray(props.h, props.w);

    const getBoundedNumColors = (numColors = null, prevColors = []) =>
        !numColors || Number.isNaN(numColors)
            ? MIN_COLORS
            : p.constrain(
                  numColors || prevColors.length,
                  MIN_COLORS,
                  MAX_COLORS
              );
    const initColors = (props) => {
        let colors = [...props.colors];
        let numColors = getBoundedNumColors(props.numColors, colors);
        for (let i = 0; i < numColors; i++) {
            colors[i] = i === 0 ? getBgColor(p) : getFgColor(p);
        }
        colors = colors.slice(0, numColors);
        return { colors, numColors };
    };
    const addColor = (props, color) => {
        let numColors = getBoundedNumColors(props.numColors + 1, props.colors);
        if (props.colors.length >= numColors) {
            return { numColors };
        }

        let colors = [...props.colors, color || getFgColor(p)];
        numColors = colors.length;
        return { colors, numColors };
    };
    const subtractColor = (props) => {
        let numColors = getBoundedNumColors(props.numColors - 1, props.colors);
        return { numColors };
    };
    const changeColor = ({ colors: prevColors }, i, nextColor = null) => {
        let colors = [
            ...prevColors.slice(0, i),
            nextColor || i === 0 ? getBgColor(p) : getFgColor(p),
            ...prevColors.slice(i + 1),
        ];
        return { colors };
    };

    p.setup = () => {
        p.colorMode(p.HSB);
        p.createCanvas(props.w * props.scale, props.h * props.scale);
        p.noLoop();

        const nextState = {
            ...initColors(props),
            r: getBoundedRandom(p),
        };
        setSketchState(nextState);
    };

    p.myCustomRedrawAccordingToNewPropsHandler = (nextProps) => {
        props = {
            ...props,
            ...(nextProps.sketchState.id &&
            nextProps.sketchState.id !== props.id
                ? IDENTIFYING_PROPS
                : null),
            ...nextProps.sketchState,
        };
        if (props?.colors?.length) {
            props.colors = props.colors.map((color) =>
                typeof color === "string" ? p.color(color) : color
            );
        }
        p.resizeCanvas(props.w * props.scale, props.h * props.scale);
        if (gridArr.length !== props.h || gridArr[0].length !== props.w) {
            gridArr = createArray(props.h, props.w);
        }
        p.noiseSeed(props.noiseSeed);
        setSketchState = (mergeState) => {
            const nextState = { ...props, ...mergeState };
            nextProps.setSketchState({ ...nextState, f: getF(p, nextState) });
        };
        handleSavePattern = nextProps.handleSavePattern;
        p.redraw();
    };

    const solidColor = ({ colors, numColors }, det) => {
        const colorIndex = p.constrain(
            p.floor((numColors - 1) * det),
            0,
            numColors - 1
        );
        return colors[colorIndex] || colors[numColors] || p.color("#000");
    };

    const blendColor = ({ colors, numColors }, det) => {
        let i = p.constrain(p.floor(colors.length * det), 0, numColors - 1);
        if (i === 0) {
            return p.lerpColor(colors[i], colors[i + 1], det);
        } else if (i === colors.length - 1) {
            return p.lerpColor(colors[i], colors[i - 1], det);
        }
        return p.lerpColor(
            p.lerpColor(colors[i], colors[i + 1], det),
            colors[i - 1],
            det
        );
        // const c1 = p.lerpColor(fgC1, bgC1, det);
        // const c2 = p.lerpColor(fgC2, bgC2, det);
        // const lerper =
        //     det > 0.5
        //         ? norm(p.dist(0, 0, x, y), 0, maxDist)
        //         : norm(p.dist(w, h, x, y), 0, maxDist);
        // return p.lerpColor(c1, c2, lerper);
    };

    const draw3DCenterSquare = (x, y, d) => {
        p.beginShape();
        const sX = x - props.w / 2;
        const sY = y - props.h / 2;
        p.vertex(sX, sY, d);
        p.vertex(sX + props.scale, sY, d);
        p.vertex(sX + props.scale, sY + props.scale, d);
        p.vertex(sX, sY + props.scale, d);
        p.endShape(p.CLOSE);
    };

    const draw2DGrid = (scale, x, y, d) => {
        p.square(x * scale, y * scale, scale);
    };

    const modder = (x, y, determinate) => {
        const modder = p.floor(props.h / 2);
        let fillC = props.colors[1];
        if (
            x % modder !== 0 &&
            y % modder !== 0 &&
            x % modder !== p.ceil(modder / 2) + 1 &&
            y % modder !== p.ceil(modder / 2) + 1
        ) {
        }
        return xor(
            x % modder > p.ceil(modder / 2),
            y % modder > p.ceil(modder / 2)
        )
            ? blendColor(determinate)
            : solidColor(props, determinate);
    };

    const rotate3D = () => {
        p.rotateX(xRot * 0.00001);
        p.rotateY(yRot * 0.00001);
        p.rotateZ(zRot * 0.00001);
    };

    p.draw = () => {
        p.strokeWeight(0);
        for (let y = 0; y < props.h; y++) {
            for (let x = 0; x < props.w; x++) {
                const determinate = props.f(x, y);

                p.fill(solidColor(props, determinate));
                draw2DGrid(props.scale, x, y, determinate);
                // p.translate(xTrans * 0.001, yTrans * 0.001, zTrans * 0.001);

                gridArr[y][x] = p.constrain(
                    p.floor(props.w * determinate),
                    0,
                    props.numColors - 1
                );
            }
        }
        if (props.workingRow !== null) {
            const row = !props.isFlipped
                ? props.workingRow
                : props.h - props.workingRow - 1;
            p.strokeWeight(1);
            p.fill("#00000000");
            console.log("rect - wr:", props.workingRow, "cr:", row);
            p.rect(0, row * props.scale, props.w * props.scale, props.scale);
            p.strokeWeight(0);
        }
    };

    function writePattern(grid) {}

    p.keyTyped = () => {
        let nextState = props;
        switch (p.key) {
            case "p":
                writePattern(gridArr);
                props.handleGridWrite(gridArr);
                break;
            case "s":
                p.saveCanvas(
                    `${props.name} in ${props.colors
                        .map((color) => color.toString("#rrggbb"))
                        .join(" ")}`
                );
                handleSavePattern({
                    ...props,
                    colors: props.colors.map((color) =>
                        color.toString("#rrggbbaa")
                    ),
                    gridArr,
                });
                break;
            case "r":
                nextState = { ...nextState, r: getBoundedRandom(p) };
                break;
            case "n":
                nextState = { ...nextState, noiseSeed: getBoundedRandom(p) };
                break;
            case "a":
                console.log(gridArr);
                break;
            case "=":
                nextState = { ...nextState, ...addColor(nextState) };
                break;
            case "-":
                nextState = { ...nextState, ...subtractColor(nextState) };
                break;
            default:
                break;
        }
        if (nextState !== props) {
            nextState = { ...nextState, name: null, id: null };
        }
        setSketchState(nextState);
    };

    p.keyPressed = () => {
        let nextState = { ...props };
        if (p.keyCode >= 48 && p.keyCode <= 57) {
            if (p.keyCode - 48 >= props.numColors) {
                return;
            }
            nextState = {
                ...nextState,
                ...changeColor(nextState, p.keyCode - 48),
            };
        }
        setSketchState(nextState);
    };
};

export const biDissolve = getSketchWith((p, { w }) => (x, y) => {
    const flipX = x > (w - 1) / 2 ? w - 1 - x : x;
    let v = 1 / p.cos((y * flipX) / p.pow(2, p.noise(flipX) * y)); // weird tree
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -1, 1);
});

export const quadDissolve = getSketchWith((p, { h, w }) => (x, y) => {
    const flipX = x > (w - 1) / 2 ? w - 1 - x : x;
    const symY = y < (h - 1) / 2 ? (h - 1) / 2 - y : y - (h - 1) / 2;
    let v = 1 / p.cos((symY * flipX) / p.pow(2, p.noise(flipX) * symY)); // weird tree
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -1, 1);
});

export const quadTexture = getSketchWith((p, { r, h, w }) => (x, y) => {
    const flipX = x < (w - 1) / 2 ? w - 1 - x : x;
    const symY = y > (h - 1) / 2 ? (h - 1) / 2 - y : y - (h - 1) / 2;
    let v = 1 / p.cos((r * p.noise(flipX) * symY) / flipX);
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -1, 1);
});

export const playground = getSketchWith((p, { r, h, w }) => (x, y) => {
    const flipX = x < (w - 1) / 2 ? w - 1 - x : x;
    const symY = y > (h - 1) / 2 ? (h - 1) / 2 - y : y - (h - 1) / 2;
    let v = 1 / p.cos((r * p.noise(flipX) * symY) / flipX);
    if (Number.isNaN(v)) {
        v = 0;
    }
    return p.norm(v, -1, 1);
});

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
