import React, { useEffect, useState } from "react";
import { debounce } from "debounce";

import {
    Card,
    Row,
    Col,
    Button,
    Collapse,
    Form,
    Popover,
    Input,
    InputNumber,
    Select,
    Space,
    Switch,
} from "antd";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { ChromePicker } from "react-color";

import Sketch from "../draw/Sketch";

import {
    DEFAULT_THUMBNAIL_SIZE,
    INITIAL_COLOR_NAMES,
    MAX_COLORS,
    MAX_SCALE,
    MAX_SIZE,
    MIN_COLORS,
    MIN_SCALE,
    MIN_SIZE,
} from "../utils/constants";
import { createArray } from "../utils/functions";
import * as generators from "../draw/generators";

const generatorArray = Object.entries(generators);

const Colors = ({ colors, height }) => (
    <Row wrap={false}>
        {colors.map((color) => (
            <Col
                flex="auto"
                key={color}
                style={{
                    height: height,
                    backgroundColor: color,
                }}
            ></Col>
        ))}
    </Row>
);
Colors.defaultProps = { colors: [], height: 40 };

export default function Controls({
    addColor,
    changeColor,
    clearPattern,
    committedPalettes,
    committedPatterns,
    currentPaletteColors,
    handleDeletePaletteById,
    handleDeletePatternById,
    handleSavePalette,
    rollNoise,
    rollRandom,
    savePattern,
    selectedPalette,
    selectedPattern,
    setSketchState,
    sketchForm,
    sketchState,
    subtractColor,
}) {
    const [shouldDeletePalette, setShouldDeletePalette] = useState(false);
    useEffect(() => setShouldDeletePalette(false), [
        selectedPalette,
        committedPalettes,
    ]);

    const [shouldDeletePattern, setShouldDeletePattern] = useState(false);
    useEffect(() => setShouldDeletePattern(false), [
        selectedPattern,
        committedPatterns,
    ]);

    const currentColors = sketchState.colors;
    const debouncedSetSketch = debounce(setSketchState, 200);
    return (
        <Collapse>
            <Collapse.Panel header="Canvas">
                <Form
                    form={sketchForm}
                    layout="vertical"
                    onValuesChange={(values) => {
                        if (
                            Number.isNaN(values?.r) ||
                            Number.isNaN(values?.noiseSeed)
                        ) {
                            return;
                        }
                        debouncedSetSketch((prev) => ({ ...prev, ...values }));
                    }}
                    initialValues={sketchState}
                    size="large"
                >
                    <Form.Item label="Generator" name="generator">
                        <Select>
                            {generatorArray.map(([name, generator], i) => (
                                <Select.Option value={name} key={name}>
                                    {name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Multiplier">
                        <Row gutter={8} align="bottom">
                            <Col span={18}>
                                <Form.Item name="r" noStyle>
                                    <InputNumber style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Button block onClick={rollRandom}>
                                    <Icon icon="dice" />
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item label="Noise Seed">
                        <Row gutter={8} align="bottom">
                            <Col span={18}>
                                <Form.Item name="noiseSeed" noStyle>
                                    <InputNumber
                                        disabled={
                                            generators?.[sketchState?.generator]
                                                ?.noNoise
                                        }
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Button
                                    block
                                    disabled={
                                        generators?.[sketchState?.generator]
                                            ?.noNoise
                                    }
                                    onClick={rollNoise}
                                >
                                    <Icon icon="dice" />
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="Width" name="w">
                        <InputNumber
                            max={MAX_SIZE}
                            min={MIN_SIZE}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item label="Height" name="h">
                        <InputNumber
                            max={MAX_SIZE}
                            min={MIN_SIZE}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item label="Scale" name="scale">
                        <InputNumber
                            max={MAX_SCALE}
                            min={MIN_SCALE}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item label="Show Grid" style={{ minHeight: "0" }}>
                        <Row>
                            <Col>
                                <Form.Item
                                    name="showGrid"
                                    noStyle
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Collapse.Panel>
            <Collapse.Panel header="Colors">
                <Row gutter={8}>
                    <Col span={12}>
                        <Button
                            block
                            disabled={currentColors?.length === MIN_COLORS}
                            onClick={() => subtractColor()}
                        >
                            <Icon icon="minus-square" />
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Button
                            block
                            disabled={currentColors?.length === MAX_COLORS}
                            onClick={() => addColor()}
                        >
                            <Icon icon="plus-square" />
                        </Button>
                    </Col>
                </Row>
                {currentColors &&
                    currentColors.map((color, i) => (
                        <Card size="small" key={`color-${i}`}>
                            <Row gutter={8} align="middle" justify="center">
                                <Col span={5}>
                                    <Popover
                                        content={
                                            <ChromePicker
                                                color={color}
                                                onChangeComplete={(color) =>
                                                    changeColor(i, color.hex)
                                                }
                                            />
                                        }
                                        title={`Color ${i}`}
                                    >
                                        <Card
                                            style={{
                                                backgroundColor: color,
                                            }}
                                        />
                                    </Popover>
                                </Col>
                                {selectedPattern && (
                                    <Col span={6}>
                                        <Input
                                            onChange={({ target: { value } }) =>
                                                savePattern({
                                                    colorDisplayNames: [
                                                        ...selectedPattern.colorDisplayNames.slice(
                                                            0,
                                                            i
                                                        ),
                                                        value,
                                                        ...selectedPattern.colorDisplayNames.slice(
                                                            i + 1
                                                        ),
                                                    ],
                                                })
                                            }
                                            value={
                                                selectedPattern
                                                    .colorDisplayNames[i]
                                            }
                                        />
                                    </Col>
                                )}
                                <Col span={selectedPattern ? 7 : 13}>
                                    {typeof color === "string"
                                        ? color
                                        : color.toString("#rrggbbaa")}
                                </Col>
                                <Col span={6}>
                                    <Button
                                        block
                                        onClick={() => changeColor(i)}
                                        size="large"
                                    >
                                        <Icon icon="dice" />
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                {currentPaletteColors &&
                    currentColors &&
                    currentPaletteColors.length > currentColors.length && (
                        <Colors
                            colors={currentPaletteColors.slice(
                                currentColors.length
                            )}
                            height={10}
                        />
                    )}
                <Button
                    block
                    onClick={() =>
                        handleSavePalette({
                            ...selectedPalette,
                            colors: currentPaletteColors,
                            displayNames: createArray(
                                currentPaletteColors.length
                            ).map(
                                (_, i) =>
                                    selectedPattern?.colorDisplayNames?.[i] ||
                                    selectedPalette?.displayNames?.[i] ||
                                    INITIAL_COLOR_NAMES[i]
                            ),
                        })
                    }
                >
                    <Space>
                        <Icon icon="save" />
                        <span>Save Palette</span>
                    </Space>
                </Button>
                {committedPalettes && (
                    <Select
                        onChange={(paletteId) => {
                            const selectedPalette =
                                committedPalettes.find(
                                    ({ id }) => id === paletteId
                                ) || null;
                            console.log("select pal", selectedPalette);
                            handleSavePalette(selectedPalette);
                            if (!selectedPalette || !selectedPattern) {
                                return;
                            }
                            savePattern({
                                colorDisplayNames: createArray(
                                    currentPaletteColors.length
                                ).map((_, i) => {
                                    const cn =
                                        selectedPalette?.displayNames?.[i] ||
                                        INITIAL_COLOR_NAMES[i];
                                    console.log(cn);
                                    return cn;
                                }),
                            });
                        }}
                        placeholder="Load palette"
                        size="large"
                        style={{ width: "100%" }}
                        value={selectedPalette?.id || null}
                    >
                        {committedPalettes.map(({ colors, id }) => (
                            <Select.Option value={id} key={id}>
                                <Colors colors={colors} />
                            </Select.Option>
                        ))}
                    </Select>
                )}
                {selectedPalette && (
                    <Button
                        block
                        onClick={() =>
                            shouldDeletePalette
                                ? handleDeletePaletteById(selectedPalette.id)
                                : setShouldDeletePalette(true)
                        }
                    >
                        <Space>
                            <Icon icon="trash" />
                            {shouldDeletePalette
                                ? "You sure?"
                                : `Delete selected palette`}
                        </Space>
                    </Button>
                )}
            </Collapse.Panel>
            <Collapse.Panel header="Pattern">
                <Button
                    block
                    onClick={() =>
                        savePattern({ ...selectedPattern, ...sketchState })
                    }
                >
                    <Space>
                        <Icon icon="save" />
                        <span>
                            {selectedPattern
                                ? "Overwrite Pattern"
                                : "Save Pattern"}
                        </span>
                    </Space>
                </Button>
                <Select
                    onChange={(patternId) =>
                        patternId
                            ? savePattern(
                                  committedPatterns.find(
                                      ({ id }) => id === patternId
                                  )
                              )
                            : clearPattern()
                    }
                    onClear={clearPattern}
                    placeholder="Load pattern"
                    size="large"
                    style={{ width: "100%" }}
                    value={selectedPattern?.id || null}
                    listHeight={420}
                    listItemHeight={DEFAULT_THUMBNAIL_SIZE}
                    allowClear
                >
                    {committedPatterns.map((pattern, i) => (
                        <Select.Option value={pattern.id} key={pattern.id}>
                            <Space align="center">
                                <Sketch
                                    sketchState={{
                                        ...pattern,
                                        scale: 2,
                                        showGrid: false,
                                    }}
                                    thumb
                                />
                                {pattern.name}
                            </Space>
                        </Select.Option>
                    ))}
                </Select>
                {selectedPattern && (
                    <Button
                        block
                        onClick={() =>
                            shouldDeletePattern
                                ? handleDeletePatternById(selectedPattern.id)
                                : setShouldDeletePattern(true)
                        }
                    >
                        <Space>
                            <Icon icon="trash" />
                            {shouldDeletePattern
                                ? "You sure?"
                                : `Delete ${selectedPattern.name}`}
                        </Space>
                    </Button>
                )}
            </Collapse.Panel>
        </Collapse>
    );
}
