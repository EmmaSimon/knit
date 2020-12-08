import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import "./App.css";

// import KnitSketch from "./draw/KnitSketch";
import Knit from "./page/Knit";

library.add(fas);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Knit />
      </header>
    </div>
  );
}

export default App;
