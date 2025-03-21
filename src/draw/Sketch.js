import React, { Component, createRef } from "react";
import p5 from "p5";

import "./Sketch.css";

import {
    arrayWeave,
    createArray,
    getCanvasSize,
    getGridMargin,
    getHeavyGridSpacing,
    getRandomColor,
} from "../utils/functions";
import {
    DEFAULT_THUMBNAIL_SIZE,
    MIN_COLORS,
    MAX_COLORS,
} from "../utils/constants";
import * as generators from "./generators";

class Sketch extends Component {
    p5Instance = null;
    p5Node = createRef();
    grid = createRef();
    currentProps = createRef();

    componentDidMount() {
        this.currentProps.current = this.props;
        this.p5Instance = this.props.p5Instance || createRef();
        if (this.p5Instance.current) {
            console.log("rem ", this.props.sketchState);
            this.p5Instance.current.remove();
        }
        this.p5Instance.current = new p5(this.sketch, this.p5Node.current);
    }

    sketch = (p) => {
        if (!this.props.thumb) {
            console.log(
                "Initializing sketch instance:",
                this.currentProps.current
            );
        }
        const solidColor = (det) => {
            const { colors } = this.currentProps.current.sketchState;
            return (
                colors[
                    p.constrain(
                        p.floor(colors.length * det),
                        0,
                        colors.length - 1
                    )
                ] ||
                colors[0] ||
                p.color("#000")
            );
        };
        const draw2DGrid = (x, y, d) => {
            const {
                sketchState: { scale, showGrid },
                thumb,
            } = this.currentProps.current;
            const gridMargin = getGridMargin(showGrid, scale, thumb);
            p.square(gridMargin + x * scale, gridMargin + y * scale, scale);
        };
        const drawCaret = (direction) => {
            const {
                sketchState: { h, w, scale, showGrid },
                thumb,
            } = this.currentProps.current;
            const margin = getGridMargin(showGrid, scale, thumb);
            const isVertical = direction === "up" || direction === "down";

            const midpoint = isVertical ? p.floor(w / 2) : p.floor(h / 2);
            const arrowPoint = midpoint * scale + margin;
            const arrowHeight = (scale * p.sqrt(3)) / 2;

            const pointPositions = [
                arrowPoint,
                arrowPoint - scale / 2,
                arrowPoint + scale / 2,
            ];
            let sidePositions;
            switch (direction) {
                case "up":
                case "left": {
                    const pointSide =
                        (isVertical ? h : w) * scale + margin + scale;
                    const flatSide = pointSide + arrowHeight;
                    sidePositions = [pointSide, flatSide, flatSide];
                    break;
                }
                case "down":
                case "right": {
                    const pointSide = margin - scale;
                    const flatSide = pointSide - arrowHeight;
                    sidePositions = [pointSide, flatSide, flatSide];
                    break;
                }
                default:
                    return;
            }
            isVertical
                ? p.triangle(...arrayWeave(pointPositions, sidePositions))
                : p.triangle(...arrayWeave(sidePositions, pointPositions));
        };
        const drawVerticalRow = (row) => {
            const {
                sketchState: { h, scale, showGrid },
                thumb,
            } = this.currentProps.current;
            const m = getGridMargin(showGrid, scale, thumb);
            p.line(m + row * scale, m, m + row * scale, m + h * scale);
        };
        const drawHorizontalRow = (row) => {
            const {
                sketchState: { w, scale, showGrid },
                thumb,
            } = this.currentProps.current;
            const m = getGridMargin(showGrid, scale, thumb);
            p.line(m, m + row * scale, m + w * scale, m + row * scale);
        };

        const initColors = () => {
            const { colors } = this.currentProps.current.sketchState;
            if (Array.isArray(colors) && colors.length >= MIN_COLORS) {
                return colors.length > MAX_COLORS
                    ? colors.slice(0, MAX_COLORS)
                    : colors;
            }
            let nextColors = Array.isArray(colors) ? [...colors] : [];
            while (nextColors.length < MIN_COLORS) {
                nextColors = [...nextColors, getRandomColor(p)];
            }
            return nextColors;
        };

        p.getGrid = () => this.grid.current;

        p.setup = () => {
            const {
                sketchState: { w, h, noiseSeed, scale, showGrid },
                thumb,
                thumbSize,
            } = this.currentProps.current;
            p.colorMode(p.HSB);
            const gridMargin = getGridMargin(showGrid, scale, thumb);
            const [canvasWidth, canvasHeight] = getCanvasSize(
                w,
                h,
                thumb,
                thumbSize
            ).map((x) => 2 * gridMargin + x * scale);
            p.createCanvas(canvasWidth, canvasHeight);
            p.noLoop();
            p.noiseSeed(noiseSeed);
            if (this.props.thumb) {
                p5.disableFriendlyErrors = true;
            }
            this.grid.current = createArray(h, w);
            this.props.setSketchState({
                ...this.props.sketchState,
                colors: initColors(),
            });
        };
        p.draw = () => {
            const {
                selectedPattern,
                sketchState: {
                    name,
                    colors,
                    generator,
                    h,
                    scale,
                    w,
                    r,
                    noiseSeed,
                    showGrid,
                },
                thumb,
                thumbSize,
            } = this.currentProps.current;
            if (
                !generator ||
                !Array.isArray(colors) ||
                colors.length < MIN_COLORS
            ) {
                console.log(
                    "Invalid state, a generator and color array are required, doing nothing\nBad state:",
                    this.currentProps.current.sketchState
                );
                return;
            }
            let heavyGridSpace = 0;
            if (showGrid) {
                heavyGridSpace = getHeavyGridSpacing(w, h);
            }

            if (showGrid) {
                p.strokeWeight(1);
                p.stroke("#00000066");
                p.fill("white");
                drawCaret("down");
                drawCaret("up");
                drawCaret("left");
                drawCaret("right");
            }

            p.textSize(scale);
            p.strokeWeight(0);
            p.noiseSeed(noiseSeed);

            const [drawWidth, drawHeight] = getCanvasSize(
                w,
                h,
                thumb,
                thumbSize
            );
            const gridMargin = getGridMargin(showGrid, scale, thumb);
            const nextGrid = createArray(drawHeight, drawWidth);

            if (!thumb) {
                console.log(
                    `Drawing${name ? ` "${name}"` : ""}:\n  Colors: ${
                        colors.length
                    }\n  Generator: ${generator}\n  Canvas: ${drawWidth}w x ${drawHeight}h\n  Random: ${r}\n  Noise: ${noiseSeed}`
                );
            }

            for (let y = 0; y < drawHeight; y++) {
                if (thumb && y > drawWidth) {
                    break;
                }
                for (let x = 0; x < drawWidth; x++) {
                    if (thumb && x > drawWidth) {
                        break;
                    }

                    const determinate = generators[generator](
                        p,
                        x,
                        y,
                        this.currentProps.current.sketchState
                    );
                    p.fill(solidColor(determinate));
                    draw2DGrid(x, y, determinate);

                    nextGrid[y][x] = p.constrain(
                        p.floor(colors.length * determinate),
                        0,
                        colors.length - 1
                    );

                    // Write row and column numbers,
                    // spaced apart by the heavy grid space,
                    // always writing the first and last row
                    if (showGrid && !thumb) {
                        p.strokeWeight(1);
                        p.fill("white");

                        // Write column numbers across the top when y is 0
                        if (
                            y === 0 &&
                            (((x + 1) % heavyGridSpace === 0 && x + 2 < w) ||
                                x === 0 ||
                                x + 1 === w)
                        ) {
                            p.textAlign(p.CENTER, p.BOTTOM);
                            p.text(
                                x + 1,
                                gridMargin + 1 + x * scale,
                                0,
                                scale,
                                gridMargin
                            );
                        }
                        // Write row numbers across the side when x is 0
                        if (
                            x === 0 &&
                            (((y + 1) % heavyGridSpace === 0 && y + 2 < h) ||
                                y === 0 ||
                                y + 1 === h)
                        ) {
                            p.textAlign(p.RIGHT, p.CENTER);
                            p.text(
                                y + 1,
                                0,
                                gridMargin + y * scale,
                                gridMargin,
                                scale + 1
                            );
                        }
                        p.strokeWeight(0);
                    }
                }
            }
            this.grid.current = nextGrid;

            if (showGrid && !thumb) {
                p.strokeWeight(1);
                p.stroke("#00000011");

                let verticalRow = 0;
                const heavyVerticals = [];
                while (verticalRow <= w) {
                    if (verticalRow % heavyGridSpace === 0) {
                        heavyVerticals.push(verticalRow);
                    } else {
                        drawVerticalRow(verticalRow);
                    }
                    verticalRow++;
                }
                let horizontalRow = 0;
                const heavyHorizontals = [];
                while (horizontalRow <= h) {
                    if (horizontalRow % heavyGridSpace === 0) {
                        heavyHorizontals.push(horizontalRow);
                    } else {
                        drawHorizontalRow(horizontalRow);
                    }
                    horizontalRow++;
                }
                p.stroke("#00000066");
                heavyVerticals.forEach(drawVerticalRow);
                heavyHorizontals.forEach(drawHorizontalRow);
            }
            if (
                selectedPattern &&
                selectedPattern.workingRow !== null &&
                !thumb
            ) {
                const { isFlipped, workingRow } = selectedPattern;
                const row = !isFlipped ? workingRow : h - workingRow - 1;
                p.stroke(showGrid ? "white" : "black");
                p.strokeWeight(1);
                p.fill("#00000000");
                p.rect(gridMargin, gridMargin + row * scale, w * scale, scale);
                p.strokeWeight(0);
            }
        };

        p.keyPressed = () => {
            const props = this.currentProps.current;
            if (props.thumb) {
                return;
            }
            switch (p.key) {
                case "s":
                    props.savePattern();
                    break;
                case "d":
                    props.saveImage();
                    break;
                case "r":
                    props.rollRandom();
                    break;
                case "n":
                    const { generator } = props.sketchState;
                    if (generators[generator].noNoise) {
                        break;
                    }
                    props.rollNoise();
                    break;
                case "a":
                    console.log(this.grid.current);
                    break;
                case "=":
                    props.addColor();
                    break;
                case "-":
                    props.subtractColor();
                    break;
                default:
                    break;
            }
        };
    };

    componentDidUpdate(prevProps) {
        const prevSketch = prevProps.sketchState;
        const {
            p5Instance,
            selectedPattern,
            sketchState,
            thumb,
            thumbSize,
        } = this.props;

        if (p5Instance && p5Instance !== this.p5Instance) {
            this.p5Instance = p5Instance;
        }

        if (
            !sketchState ||
            (sketchState === prevSketch &&
                selectedPattern === prevProps.selectedPattern)
        ) {
            return;
        }
        const { w, h, scale, showGrid } = sketchState;

        this.currentProps.current = this.props;
        const [drawWidth, drawHeight] = getCanvasSize(w, h, thumb, thumbSize);
        const [prevDrawWidth, prevDrawHeight] = getCanvasSize(
            prevSketch?.w || 0,
            prevSketch?.h || 0,
            prevSketch?.thumb,
            prevSketch?.thumbSize
        );

        if (
            w !== prevDrawWidth ||
            h !== prevDrawHeight ||
            scale !== prevSketch?.scale ||
            showGrid !== prevSketch?.showGrid
        ) {
            this.grid.current = createArray(drawWidth, drawHeight);
            const gridMargin = getGridMargin(showGrid, scale, thumb);
            this.p5Instance.current.resizeCanvas(
                gridMargin * 2 + drawWidth * scale,
                gridMargin * 2 + drawHeight * scale
            );
        } else if (
            selectedPattern !== prevProps.selectedPattern ||
            sketchState !== prevSketch
        ) {
            this.p5Instance.current.redraw();
        }
    }

    render() {
        return (
            <span className="Sketch-container">
                <span id="canvas" className="Sketch-canvas" ref={this.p5Node} />
            </span>
        );
    }
}

Sketch.defaultProps = {
    thumb: false,
    thumbSize: DEFAULT_THUMBNAIL_SIZE,
    p5Instance: null,
    selectedPattern: null,
    sketchState: {},
    savePattern: () => {},
    addColor: () => {},
    subtractColor: () => {},
    setSketchState: () => {},
    changeColor: () => {},
};
export default Sketch;
