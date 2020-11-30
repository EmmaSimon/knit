import randomWords from "random-words";

const getPatternName = () => randomWords({ exactly: 3, join: " " });
export { getPatternName };
