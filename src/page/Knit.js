import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Form, Layout, Row, Typography } from "antd";
import { v4 as uuid } from "uuid";

import Controls from "./Controls";
import Sketch from "../draw/Sketch";
import Pattern from "../pattern/Pattern";

import {
    DEFAULT_SCALE,
    DEFAULT_SIZE,
    INITIAL_COLOR_NAMES,
    MAX_COLORS,
    MAX_SCALE,
    MIN_COLORS,
    MIN_SCALE,
    PALETTE_KEY,
    PATTERN_KEY,
} from "../utils/constants";
import {
    createArray,
    getBoundedRandom,
    getPatternName,
    getRandomColor,
} from "../utils/functions";
import {
    useIdSelectableLocalStorageRecencyArray,
    usePrevious,
} from "../utils/hooks";

const Knit = () => {
    const p5Instance = useRef();
    const [sketchForm] = Form.useForm();
    const [sketchState, setSketchState] = useState({
        scale: DEFAULT_SCALE,
        w: DEFAULT_SIZE,
        h: DEFAULT_SIZE,
        name: getPatternName(),
        generator: "flipCos",
        r: getBoundedRandom(),
        noiseSeed: getBoundedRandom(),
    });

    const [
        selectedPalette,
        committedPalettes,
        handleSavePalette,
        handleDeletePaletteById,
    ] = useIdSelectableLocalStorageRecencyArray(PALETTE_KEY);
    const [currentPaletteColors, setCurrentPaletteColors] = useState(
        selectedPalette?.colors
    );
    const mergePattern = (pattern) => {
        if (!pattern.id) {
            window.gtag("event", "pattern", { action: "create", pattern });
        }
        // Add an ID and default color display names to any new patterns
        return pattern.id
            ? pattern
            : {
                  ...pattern,
                  id: uuid(),
                  colorDisplayNames: createArray(pattern.colors.length).map(
                      (_, i) =>
                          selectedPalette?.displayNames?.[i] ||
                          INITIAL_COLOR_NAMES[i]
                  ),
              };
    };
    const [
        selectedPattern,
        committedPatterns,
        handleSavePattern,
        handleDeletePatternById,
    ] = useIdSelectableLocalStorageRecencyArray(PATTERN_KEY, mergePattern);
    const prevSelectedPalette = usePrevious(selectedPalette);
    const prevSelectedPattern = usePrevious(selectedPattern);
    const prevSketchState = usePrevious(sketchState);

    // When the canvas colors change, update the current palette
    useEffect(() => {
        if (!sketchState.colors) {
            return;
        }
        // Set the current canvas palette to the changed colors
        setCurrentPaletteColors((prev = []) =>
            prev?.length > sketchState.colors.length
                ? [
                      ...sketchState.colors,
                      ...prev.slice(sketchState.colors.length),
                  ]
                : sketchState.colors
        );
    }, [sketchState.colors]);

    // When the selected palette changes, update the canvas colors
    useEffect(() => {
        if (
            !selectedPalette?.colors ||
            selectedPalette === prevSelectedPalette
        ) {
            return;
        }
        const nextPalette =
            currentPaletteColors.length > selectedPalette.colors.length
                ? [
                      ...selectedPalette.colors,
                      ...currentPaletteColors.slice(
                          selectedPalette.colors.length
                      ),
                  ]
                : selectedPalette.colors;
        // Set the current palette to the selected one
        setCurrentPaletteColors(nextPalette);
        // Then set the same number of canvas colors from the palette
        setSketchState((prev) => ({
            ...prev,
            colors: nextPalette.slice(0, prev?.colors?.length || MIN_COLORS),
        }));
    }, [selectedPalette, prevSelectedPalette, currentPaletteColors]);

    // When the sketch state's noise or random changes,
    // rename the canvas and clear the selected pattern
    useEffect(() => {
        const resetKeys = ["generator", "r", "noiseSeed"];
        if (
            sketchState &&
            (selectedPattern
                ? prevSelectedPattern === selectedPattern &&
                  resetKeys.some(
                      (key) => selectedPattern[key] !== sketchState[key]
                  )
                : resetKeys.some(
                      (key) => prevSketchState?.[key] !== sketchState[key]
                  ))
        ) {
            setSketchState((prev) => ({ ...prev, name: getPatternName() }));
            handleSavePattern(null);
        }
    }, [
        sketchState,
        prevSketchState,
        handleSavePattern,
        selectedPattern,
        prevSelectedPattern,
    ]);

    useEffect(() => {
        sketchForm.setFieldsValue(sketchState);
    }, [sketchForm, sketchState]);

    // When the selected pattern changes, update the sketch state and palette
    // with the pattern's saved values
    useEffect(() => {
        if (
            !selectedPattern ||
            selectedPattern?.id === prevSelectedPattern?.id
        ) {
            return;
        }
        const {
            id,
            workingRow,
            isFlipped,
            ...strippedCanvas
        } = selectedPattern;
        setSketchState((prev) => ({ ...prev, ...strippedCanvas }));
        setCurrentPaletteColors((prev) =>
            prev && prev.length > selectedPattern.colors.length
                ? [
                      ...selectedPattern.colors,
                      prev.slice(selectedPattern.colors.length),
                  ]
                : selectedPattern.colors
        );
        handleSavePalette(null);
    }, [selectedPattern, prevSelectedPattern, handleSavePalette]);

    const addColor = (nextColor = null) => {
        if (selectedPattern) {
            handleSavePattern(null);
        }
        if (
            selectedPalette &&
            sketchState.colors.length === selectedPalette.colors.length
        ) {
            handleSavePalette(null);
        }
        setSketchState(({ colors, ...prev }) => ({
            ...prev,
            colors:
                colors.length === MAX_COLORS
                    ? colors
                    : [
                          ...colors,
                          nextColor ||
                              currentPaletteColors[colors.length] ||
                              getRandomColor(p5Instance.current),
                      ],
        }));
        window.gtag("event", "color", { action: "add" });
    };
    const subtractColor = () => {
        if (selectedPattern) {
            handleSavePattern(null);
        }
        setSketchState(({ colors, ...prev }) => ({
            ...prev,
            colors:
                colors.length === MIN_COLORS
                    ? colors
                    : colors.slice(0, colors.length - 1),
        }));
        window.gtag("event", "color", { action: "subtract" });
    };
    const changeColor = (i, nextColor = null) => {
        const color = nextColor || getRandomColor(p5Instance.current);
        if (selectedPalette) {
            handleSavePalette(null);
        }
        setSketchState(({ colors, ...prev }) => ({
            ...prev,
            colors:
                !selectedPattern ||
                selectedPattern.colors.length <= colors.length
                    ? [...colors.slice(0, i), color, ...colors.slice(i + 1)]
                    : colors,
        }));
        window.gtag("event", "color", { action: "change", color });
    };

    const rollNoise = () => {
        const noiseSeed = getBoundedRandom();
        setSketchState((prev) => ({ ...prev, noiseSeed }));
        window.gtag("event", "canvas", { action: "roll noise", noiseSeed });
    };

    const rollRandom = () => {
        const r = getBoundedRandom();
        setSketchState((prev) => ({ ...prev, r }));
        window.gtag("event", "canvas", { action: "roll multiplier", r });
    };

    const saveImage = () => {
        p5Instance.current.saveCanvas(sketchState.name);
        window.gtag("event", "canvas", { action: "download image" });
    };
    const clearPattern = () => handleSavePattern(null);
    const savePattern = (mergePattern = null) => {
        const grid = p5Instance.current.getGrid();
        let nextPattern = {
            ...selectedPattern,
            ...sketchState,
            ...mergePattern,
            grid,
        };
        nextPattern = {
            ...nextPattern,
            scale: p5Instance.current.constrain(
                nextPattern.scale,
                MIN_SCALE,
                MAX_SCALE
            ),
        };
        console.log(nextPattern);
        handleSavePattern(nextPattern);
        if (nextPattern.id) {
            window.gtag("event", "pattern", {
                action: "update",
                pattern: nextPattern,
            });
        }
    };

    return (
        <Row
            style={{
                height: "100%",
            }}
        >
            <Layout
                style={{
                    height: "100vh",
                    overflow: "hidden",
                }}
            >
                <Col>
                    <Layout.Sider
                        width={300}
                        style={{
                            height: "100%",
                            overflow: "auto",
                        }}
                    >
                        <Controls
                            addColor={addColor}
                            changeColor={changeColor}
                            clearPattern={clearPattern}
                            committedPalettes={committedPalettes}
                            committedPatterns={committedPatterns}
                            currentPaletteColors={currentPaletteColors}
                            handleDeletePaletteById={handleDeletePaletteById}
                            handleDeletePatternById={handleDeletePatternById}
                            handleSavePalette={handleSavePalette}
                            savePattern={savePattern}
                            p5Instance={p5Instance}
                            rollNoise={rollNoise}
                            rollRandom={rollRandom}
                            selectedPattern={selectedPattern}
                            selectedPalette={selectedPalette}
                            setSketchState={setSketchState}
                            sketchForm={sketchForm}
                            sketchState={sketchState}
                            subtractColor={subtractColor}
                        />
                    </Layout.Sider>
                </Col>
                <Col flex="auto">
                    <Layout.Content
                        style={{
                            height: "100%",
                            width: "100%",
                            overflow: "auto",
                            left: 300,
                            top: 0,
                            textAlign: "center",
                        }}
                    >
                        <Layout.Header>{sketchState.name}</Layout.Header>
                        <Layout.Content>
                            <Card>
                                <Sketch
                                    addColor={addColor}
                                    changeColor={changeColor}
                                    savePattern={savePattern}
                                    p5Instance={p5Instance}
                                    rollNoise={rollNoise}
                                    rollRandom={rollRandom}
                                    selectedPattern={selectedPattern}
                                    setSketchState={setSketchState}
                                    sketchState={sketchState}
                                    saveImage={saveImage}
                                    subtractColor={subtractColor}
                                />
                            </Card>
                            <Pattern
                                savePattern={savePattern}
                                selectedPattern={selectedPattern}
                            />
                        </Layout.Content>
                        <Layout.Footer>
                            <Typography.Text type="secondary">
                                Icons from{" "}
                                <Typography.Link
                                    href="https://fontawesome.com/"
                                    title="Font Awesome"
                                    type="secondary"
                                >
                                    Font Awesome
                                </Typography.Link>
                                , favicon by{" "}
                                <Typography.Link
                                    href="https://www.flaticon.com/authors/dimitry-miroliubov"
                                    title="Dimitry Miroliubov"
                                    type="secondary"
                                >
                                    Dimitry Miroliubov
                                </Typography.Link>{" "}
                                from{" "}
                                <Typography.Link
                                    href="https://www.flaticon.com/"
                                    title="Flaticon"
                                    type="secondary"
                                >
                                    flaticon
                                </Typography.Link>
                            </Typography.Text>
                        </Layout.Footer>
                    </Layout.Content>
                </Col>
            </Layout>
        </Row>
    );
};
export default Knit;
