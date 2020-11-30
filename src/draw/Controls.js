import React from "react";

import { Button } from "@rmwc/button";
import { MenuItem, SimpleMenu } from "@rmwc/menu";
import { MAX_SIZE, MIN_SIZE } from "./constants";
import * as sketches from "./sketches";

const sketchArray = Object.entries(sketches);

export default function Controls({
    baseSketchProps,
    setBaseSketchProps,
    setSketchType,
    sketchType,
}) {
    console.log(sketchType);
    return (
        <>
            <SimpleMenu
                handle={
                    <Button>
                        {sketchType
                            ? `Generator: ${
                                  sketchArray.find(
                                      ([name]) => name === sketchType.name
                                  )?.[0] || "???"
                              }`
                            : "Select generator"}
                    </Button>
                }
                onSelect={({ detail: { index } }) => {
                    console.log(
                        "selected",
                        index,
                        sketchArray[index],
                        sketchArray[index][1]
                    );
                    setSketchType({
                        name: sketchArray[index][0],
                        sketch: sketchArray[index][1],
                    });
                }}
            >
                {sketchArray.map(([name, sketch], i) => (
                    <MenuItem key={name} selected={sketchType.name === name}>
                        {name}
                    </MenuItem>
                ))}
            </SimpleMenu>
            <label htmlFor="width">stitch count: {baseSketchProps.w}</label>
            <input
                max={MAX_SIZE}
                min={MIN_SIZE}
                type="range"
                name="width"
                value={baseSketchProps.w}
                onChange={({ target: { value } }) =>
                    setBaseSketchProps({ ...baseSketchProps, w: value })
                }
            />
            <label htmlFor="height">row count: {baseSketchProps.h}</label>
            <input
                max={MAX_SIZE}
                min={MIN_SIZE}
                type="range"
                name="height"
                value={baseSketchProps.h}
                onChange={({ target: { value } }) =>
                    setBaseSketchProps({ ...baseSketchProps, h: value })
                }
            />
        </>
    );
}
