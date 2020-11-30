import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import "./App.css";

import KnitSketch from "./draw/KnitSketch";
import { DEFAULT_SIZE } from "./draw/constants";
import Pattern from "./pattern/Pattern";
const PATTERN_KEY = "patterns";

function App() {
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [committedPatterns, setCommittedPatterns] = useState([]);
  const [baseSketchProps, setBaseSketchProps] = useState({
    w: DEFAULT_SIZE,
    h: DEFAULT_SIZE,
  });

  const handleSavePattern = (pattern) => {
    if (!pattern) {
      return;
    }
    if (!pattern.id) {
      pattern = {
        ...pattern,
        id: uuid(),
      };
    }
    const existingIndex = committedPatterns.findIndex(
      ({ id }) => id === pattern.id
    );
    setCommittedPatterns(
      existingIndex === -1
        ? [...committedPatterns, pattern]
        : [
            ...committedPatterns.slice(0, existingIndex),
            pattern,
            ...committedPatterns.slice(existingIndex + 1),
          ]
    );
  };
  const handleUpdateAndSaveSelectedPattern = (pattern) => {
    if (pattern !== selectedPattern) {
      setSelectedPattern(pattern);
    }
    handleSavePattern(pattern);
  };
  const handleDeletePattern = (id) => {
    if (!id) {
      return;
    }
    const existingIndex = committedPatterns.findIndex(
      (pattern) => id === pattern.id
    );
    if (existingIndex === -1) {
      return;
    }
    setCommittedPatterns([
      ...committedPatterns.slice(0, existingIndex),
      ...committedPatterns.slice(existingIndex + 1),
    ]);
    setSelectedPattern(null);
  };

  useEffect(() => {
    const rawPrevCommitted = localStorage.getItem(PATTERN_KEY);
    const prevCommitted = rawPrevCommitted ? JSON.parse(rawPrevCommitted) : [];
    setCommittedPatterns(prevCommitted);
  }, []);
  useEffect(() => {
    const rawPrevCommitted = localStorage.getItem(PATTERN_KEY);
    const prevCommitted = rawPrevCommitted ? JSON.parse(rawPrevCommitted) : [];
    let missingPatterns = [];
    if (committedPatterns.length < prevCommitted.length) {
      console.log("new patterns smaller", committedPatterns, prevCommitted);
      prevCommitted.forEach((pattern) => {
        if (committedPatterns.some(({ id }) => id === pattern.id)) {
          return;
        }
        missingPatterns = [...missingPatterns, pattern];
      });
    }

    const nextCommitted = [...committedPatterns, ...missingPatterns];
    if (!nextCommitted.length) {
      return;
    }
    localStorage.setItem(PATTERN_KEY, JSON.stringify(nextCommitted));
  }, [committedPatterns]);

  return (
    <div className="App">
      <header className="App-header">
        <KnitSketch
          baseSketchProps={baseSketchProps}
          handleSavePattern={handleSavePattern}
          selectedPattern={selectedPattern}
          setBaseSketchProps={setBaseSketchProps}
          setSelectedPattern={setSelectedPattern}
        />
        <Pattern
          committedPatterns={committedPatterns}
          selectedPattern={selectedPattern}
          setSelectedPattern={handleUpdateAndSaveSelectedPattern}
          handleDeletePattern={handleDeletePattern}
        />
      </header>
    </div>
  );
}

export default App;
