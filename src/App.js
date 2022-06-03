import "./App.css";
import { Head } from "./header.component";
import { Answer } from "./answer.component";
import { Annotation } from "./annotation.component";

function App() {
  return (
    <div className="App">
      <div className="wrapper">
        <Head />
        <div className="content">
          <Answer />
          <Annotation />
        </div>
      </div>
    </div>
  );
}

export default App;
