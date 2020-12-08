import { Alert } from "antd";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

import { INITIAL_COLOR_NAMES } from "../utils/constants";

const PREVIOUS_ROWS = 1;
const NEXT_ROWS = 3;
const getRowNumber = (i, workingRow) =>
    workingRow +
    i -
    (PREVIOUS_ROWS -
        (workingRow < PREVIOUS_ROWS ? PREVIOUS_ROWS - workingRow : 0));
const getDisplayedRows = (workingRow, grid, isFlipped) => {
    const start = Math.max(0, workingRow - PREVIOUS_ROWS);
    const end = Math.min(grid.length + 1, workingRow + NEXT_ROWS + 1);
    return isFlipped
        ? grid.slice(-end, -start || undefined).reverse()
        : grid.slice(start, end);
};

export const DoubleKnit = ({
    colors,
    colorDisplayNames,
    isFlipped,
    grid,
    workingRow = 0,
    w,
}) => {
    if (colors.length > 2) {
        return (
            <Alert
                message="Too Many Colors"
                description="Double knitting can only be done with two colors"
                type="error"
                showIcon
                icon={<Icon icon="exclamation-circle" />}
            />
        );
    }
    return (
        <>
            {workingRow === 0 && (
                <Alert
                    message="Getting started"
                    description={`Cast on ${
                        w * 2 + 4
                    } stitches using double knit cast on, that's one stitch in each color for every column in the grid, plus 4 extra to slip for the border on each side.\nEach listed color stitch represents a pair, repeat the second stitch in the opposite color.`}
                    type="info"
                    showIcon
                    icon={<Icon icon="compass" />}
                    style={{ textAlign: "left" }}
                />
            )}
            {getDisplayedRows(workingRow, grid, isFlipped).map((row, i) => {
                let stitches = [];
                const rowNumber = getRowNumber(i, workingRow);
                const isRightSide = !(rowNumber % 2);
                const getStitchCountString = (color, count) =>
                    `${
                        colorDisplayNames?.[color] || INITIAL_COLOR_NAMES[color]
                    }${count}`;

                let currentColorCount = 0;
                let currentColor = row[0];
                row.forEach((stitch) => {
                    if (stitch === currentColor) {
                        currentColorCount++;
                    } else {
                        stitches.push(
                            getStitchCountString(
                                currentColor,
                                currentColorCount
                            )
                        );
                        currentColorCount = 1;
                        currentColor = stitch;
                    }
                });
                stitches.push(
                    getStitchCountString(currentColor, currentColorCount)
                );
                stitches = ["Slip2", ...stitches, "K2Tog"];

                return (
                    <p
                        key={rowNumber}
                        className={
                            rowNumber === workingRow
                                ? "Pattern-currentRow"
                                : null
                        }
                    >{`Row ${rowNumber + 1} [${
                        isRightSide ? "← RS" : "→ WS"
                    }]: ${stitches.join(", ")}`}</p>
                );
            })}
        </>
    );
};

export const CrossStitch = ({
    colorDisplayNames,
    isFlipped,
    grid,
    workingRow = 0,
}) => {
    return getDisplayedRows(workingRow, grid, isFlipped).map((row, i) => {
        let stitches = [];
        const rowNumber = getRowNumber(i, workingRow);
        const getStitchCountString = (color, count) =>
            `${
                colorDisplayNames?.[color] || INITIAL_COLOR_NAMES[color]
            }${count}`;

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
            >{`Row ${rowNumber + 1}: ${stitches.join(", ")}`}</p>
        );
    });
};

export const patternTypes = {
    doubleKnit: {
        type: "doubleKnit",
        component: DoubleKnit,
        label: "Double Knit",
        getIncompatible: ({ colors }) => colors.length > 2,
    },
    crossStitch: {
        type: "crossStitch",
        component: CrossStitch,
        label: "Cross Stitch",
        getIncompatible: () => false,
    },
};
