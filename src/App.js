import "./App.css";
import { Head } from "./header.component";
import { Chat } from "./chat.component";

function App() {
  return (
    <div className="App">
      <div className="wrapper">
        <Head />
        <div className="content">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default App;
