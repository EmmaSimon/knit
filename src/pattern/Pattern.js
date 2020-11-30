import React, { useEffect, useState } from "react";
import { xor } from "../utils";
import "./Pattern.css";

const PREVIOUS_ROWS = 1;
const NEXT_ROWS = 3;
const getRowNumber = (i, workingRow) =>
    workingRow +
    i -
    (PREVIOUS_ROWS -
        (workingRow < PREVIOUS_ROWS ? PREVIOUS_ROWS - workingRow : 0));

const DoubleKnit = ({
    colorDisplayNames,
    isFlipped,
    patternGrid,
    workingRow = 0,
}) => {
    const start = Math.max(0, workingRow - PREVIOUS_ROWS);
    const end = Math.min(patternGrid.length + 1, workingRow + NEXT_ROWS + 1);
    const displayedRows = isFlipped
        ? patternGrid.slice(-end, -start || undefined).reverse()
        : patternGrid.slice(start, end);

    const getColorName = (isPrimary) =>
        isPrimary ? colorDisplayNames[0] : colorDisplayNames[1];
    return displayedRows.map((row, i) => {
        const stitches = [];
        const rowNumber = getRowNumber(i, workingRow);
        const isRightSide = !(rowNumber % 2);
        const getStitchCountString = (color, count) =>
            `${getColorName(xor(color, isRightSide))}${count}`;
        let currentColorCount = 0;
        let currentColor = row[0];
        row.forEach((stitch) => {
            if (stitch === currentColor) {
                currentColorCount++;
            } else {
                stitches.push(
                    getStitchCountString(currentColor, currentColorCount)
                );
                currentColorCount = 1;
                currentColor = stitch;
            }
        });
        stitches.push(getStitchCountString(currentColor, currentColorCount));

        return (
            <p
                key={rowNumber}
                className={
                    rowNumber === workingRow ? "Pattern-currentRow" : null
                }
            >{`Row ${rowNumber + 1} [${
                isRightSide ? "← RS" : "→ WS"
            }]: ${stitches.join(", ")}`}</p>
        );
    });
};

function Pattern({
    committedPatterns,
    handleDeletePattern,
    selectedPattern,
    setSelectedPattern,
}) {
    const [colorDisplayNames, setColorDisplayNames] = useState(["M", "C"]);
    const [shouldDelete, setShouldDelete] = useState(false);
    useEffect(() => setShouldDelete(false), [
        selectedPattern,
        committedPatterns,
    ]);

    return (
        <div>
            {selectedPattern &&
                selectedPattern.colors.map((color, i) => {
                    const colorString =
                        typeof color === "string"
                            ? color
                            : color.toString("#rrggbbaa");
                    return (
                        <div key={colorString}>
                            <span
                                className="Pattern-colorSwatch"
                                style={{ backgroundColor: colorString }}
                            />{" "}
                            <input
                                name={`color-${i}`}
                                type="text"
                                value={colorDisplayNames[i]}
                                onChange={({ target: { value } }) =>
                                    setColorDisplayNames([
                                        ...colorDisplayNames.slice(0, i),
                                        value,
                                        ...colorDisplayNames.slice(i + 1),
                                    ])
                                }
                            />
                        </div>
                    );
                })}
            <select
                name="pattern"
                onChange={({ target: { value } }) => {
                    const pattern = committedPatterns.find(
                        ({ id }) => id === value
                    );
                    setSelectedPattern(pattern);
                }}
                defaultValue={null}
                value={selectedPattern?.id}
            >
                <option value={null}>none</option>
                {committedPatterns.map((pattern) => (
                    <option key={pattern.id} value={pattern.id}>
                        {`${pattern.name}${
                            pattern.workingRow
                                ? ` (on row ${pattern.workingRow + 1})`
                                : ""
                        }`}
                    </option>
                ))}
            </select>
            {selectedPattern && (
                <>
                    <DoubleKnit
                        isFlipped={selectedPattern.isFlipped}
                        patternGrid={selectedPattern.gridArr}
                        workingRow={selectedPattern.workingRow}
                        colorDisplayNames={colorDisplayNames}
                    />
                    <button
                        onClick={() =>
                            shouldDelete
                                ? handleDeletePattern(selectedPattern.id)
                                : setShouldDelete(true)
                        }
                    >
                        {shouldDelete ? "you sure?" : "del"}
                    </button>
                    {!selectedPattern.workingRow && (
                        <button
                            onClick={() =>
                                setSelectedPattern({
                                    ...selectedPattern,
                                    isFlipped: !selectedPattern.isFlipped,
                                })
                            }
                        >
                            flip
                        </button>
                    )}
                    <button
                        disabled={!selectedPattern.workingRow}
                        onClick={() =>
                            setSelectedPattern({
                                ...selectedPattern,
                                workingRow: Math.max(
                                    0,
                                    (selectedPattern.workingRow || 0) - 1
                                ),
                            })
                        }
                    >
                        previous
                    </button>
                    <button
                        disabled={
                            selectedPattern.workingRow === selectedPattern.h
                        }
                        onClick={() =>
                            setSelectedPattern({
                                ...selectedPattern,
                                workingRow: Math.min(
                                    selectedPattern.h,
                                    (selectedPattern.workingRow || 0) + 1
                                ),
                            })
                        }
                    >
                        next
                    </button>
                </>
            )}
        </div>
    );
}
export default Pattern;
