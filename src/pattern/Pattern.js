import React from "react";

import PatternControls from "./PatternControls";
import { patternTypes } from "./patternTypes";
import "./Pattern.css";

function Pattern({ selectedPattern, savePattern }) {
    const PatternType = patternTypes[selectedPattern?.patternType]?.component;

    return (
        selectedPattern && (
            <>
                <PatternControls
                    selectedPattern={selectedPattern}
                    savePattern={savePattern}
                />
                {selectedPattern.grid && PatternType && (
                    <PatternType {...selectedPattern} />
                )}
            </>
        )
    );
}
export default Pattern;
