import React, { useEffect, useRef, useState } from "react";
import P5Wrapper from "react-p5-wrapper";
import { DEFAULT_SIZE } from "./constants";

import Controls from "./Controls";
import { getPatternName } from "../io/words";
import { playground } from "./sketches";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

export default function KnitSketch({
    handleSavePattern,
    selectedPattern,
    setSelectedPattern,
}) {
    const [baseSketchProps, setBaseSketchProps] = useState({
        w: DEFAULT_SIZE,
        h: DEFAULT_SIZE,
    });
    const [name, setName] = useState(null);
    const [sketchState, setSketchState] = useState({});
    const [sketchType, setSketchType] = useState({
        name: "playground",
        sketch: playground,
    });
    const previousBase = usePrevious(baseSketchProps);

    useEffect(() => {
        if (!selectedPattern) {
            return;
        }
        setName(selectedPattern.name);
        setSketchState(selectedPattern);
        setBaseSketchProps({ w: selectedPattern.w, h: selectedPattern.h });
    }, [selectedPattern]);
    useEffect(() => {
        if (!sketchState.id) {
            setSelectedPattern(null);
        }
    }, [setSelectedPattern, sketchState.id]);
    useEffect(() => {}, [sketchState, sketchType]);
    useEffect(() => {
        if (selectedPattern) {
            return;
        }
        setName(getPatternName());
    }, [sketchState.noiseSeed, selectedPattern]);
    useEffect(() => {
        if (previousBase !== baseSketchProps) {
            setSketchState({ ...sketchState, id: null });
        }
    }, [baseSketchProps, previousBase, sketchState]);

    return (
        <div>
            <Controls
                baseSketchProps={baseSketchProps}
                setBaseSketchProps={setBaseSketchProps}
                setSketchType={setSketchType}
                sketchType={sketchType}
            />
            {sketchType && (
                <>
                    <p>{selectedPattern?.name || name}</p>
                    <P5Wrapper
                        sketch={sketchType.sketch}
                        sketchState={{
                            ...sketchState,
                            ...baseSketchProps,
                            name: selectedPattern?.name || name,
                        }}
                        setSketchState={setSketchState}
                        handleSavePattern={handleSavePattern}
                    />
                </>
            )}
        </div>
    );
}
