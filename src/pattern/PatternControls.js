import { Button, Select, Space, Row, Col } from "antd";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

import { patternTypes } from "./patternTypes";

const patternOptions = Object.values(patternTypes).sort((a, b) =>
    a.label > b.label ? 1 : -1
);
const getIncompatible = (selectedPattern) =>
    !selectedPattern?.patternType ||
    patternTypes[selectedPattern.patternType].getIncompatible(selectedPattern);

const PatternControls = ({ selectedPattern, savePattern }) =>
    selectedPattern ? (
        <>
            <Row>
                <Col flex="auto">
                    <Select
                        onChange={(patternType) => savePattern({ patternType })}
                        style={{ width: "100%" }}
                        placeholder="Select a pattern type"
                        value={selectedPattern?.patternType || null}
                    >
                        {patternOptions.map(({ label, type }) => (
                            <Select.Option key={type} value={type}>
                                {label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            {selectedPattern?.patternType && (
                <Row>
                    {!selectedPattern.workingRow && (
                        <Col flex="auto">
                            <Button
                                block
                                disabled={getIncompatible(selectedPattern)}
                                onClick={() =>
                                    savePattern({
                                        isFlipped: !selectedPattern.isFlipped,
                                        workingRow: 0,
                                    })
                                }
                            >
                                <Space>
                                    <Icon icon="arrows-alt-v" />
                                    {"Flip Pattern"}
                                </Space>
                            </Button>
                        </Col>
                    )}
                    <Col flex="auto">
                        <Button
                            block
                            disabled={
                                !selectedPattern.workingRow ||
                                getIncompatible(selectedPattern)
                            }
                            onClick={() =>
                                savePattern({
                                    workingRow: Math.max(
                                        0,
                                        (selectedPattern.workingRow || 0) - 1
                                    ),
                                })
                            }
                        >
                            <Space>
                                <Icon
                                    icon={
                                        selectedPattern.isFlipped
                                            ? "arrow-circle-down"
                                            : "arrow-circle-up"
                                    }
                                />
                                {"Previous"}
                            </Space>
                        </Button>
                    </Col>
                    <Col flex="auto">
                        <Button
                            block
                            disabled={
                                selectedPattern.workingRow ===
                                    selectedPattern.h ||
                                getIncompatible(selectedPattern)
                            }
                            onClick={() =>
                                savePattern({
                                    workingRow: Math.min(
                                        selectedPattern.h,
                                        (selectedPattern.workingRow || 0) + 1
                                    ),
                                })
                            }
                        >
                            <Space>
                                <Icon
                                    icon={
                                        selectedPattern.isFlipped
                                            ? "arrow-circle-up"
                                            : "arrow-circle-down"
                                    }
                                />
                                {"Next"}
                            </Space>
                        </Button>
                    </Col>
                </Row>
            )}
        </>
    ) : null;

export default PatternControls;
