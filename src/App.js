import "./App.css";
import { Chat } from "./chat.component";
import { Head } from "./header.component";
import { Title } from "./title.component";
import { Answer } from "./answer.component";
import { Annotation } from "./annotation.component";

function App() {
  // const content = document.getElementsByClassName("wrapper");
  // if (content.style.maxHeight) {
  //   content.style.maxHeight = null;
  // } else {
  //   content.style.maxHeight = content.scrollHeight + "px";
  // }
  return (
    <div className="App">
      <div className="wrapper">
        <Head />
        <div className="content">
          {/* <Title /> */}
          <Chat />
          <Answer />
          <Annotation />
        </div>
      </div>
    </div>
  );
}

export default App;
