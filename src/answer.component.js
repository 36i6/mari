import {
  Component,
  createRef,
  React,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOMServer from "react-dom/server";
const parse = require("html-react-parser");
const json = require("./aa.json");

export const Answer = (props) => {
  let title;
  let [state, setState] = useState("input");
  let [person, setPerson] = useState("meet");
  let [botMsg, setBotMsg] = useState(0);
  const [desicion, setDesicion] = useState("");
  const [username, setUsername] = useState("");
  const [vars, setVars] = useState(0);
  let inpId;
  let inp;
  let chat;
  const messageEndRef = createRef();
  const textareaRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(json[person].userMessage[0]);
  const [referred, setReferred] = useState(-1);
  const [currentValueId, setCurrentValueId] = useState(0);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    console.log("Current", currentValue);
    if (currentValue.includes("$")) {
      setCurrentValue(
        json[person].userMessage[
          json[person].userMessage.indexOf(currentValue) + 1
        ]
      );
      document.getElementById("#inpt").disabled = false;
      scrollToBottom();
    }
    if (currentValue.includes("/v/")) {
      setCurrentValue(currentValue.replace("/v/", ""));
      scrollToBottom();
    }
  }, [currentValue, person]);

  useEffect(() => {
    if (json[person].userMessage.includes(currentValue)) {
      setCurrentValueId(json[person].userMessage.indexOf(currentValue));
    }
  }, [currentValue, person]);

  useEffect(() => {
    sendByBot(botMsg);
    scrollToBottom();
  }, [botMsg]);

  useEffect(() => {
    setCurrentValueId(0);
    setCurrentValue(json[person].userMessage[0]);
    scrollToBottom();
  }, [person]);

  useEffect(() => {
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight - 15;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [currentValue]);

  const messageHTML = function (value) {
    const avatarClass = "message_userAvatar avatar";
    const messageClass = "message_userMessage";
    return ReactDOMServer.renderToString(
      <div className="message">
        <div className={avatarClass}>
          <img src="userAvatar.png" alt="" />
        </div>
        <div className={messageClass}>
          <div className="msg msg_user">{value}</div>
        </div>
        <div className="avatar"></div>
      </div>
    );
  };

  const botMessageHTML = function (value) {
    setState("input");
    if (!value) {
      setBotMsg(0);
      scrollToBottom();
      return;
    }
    const avatarClass = "message_botAvatar avatar";
    const messageClass = "message_botMessage";
    if (value.includes("/$/")) {
      value = value.replace("/$/", username);
      scrollToBottom();
    }
    if (value.includes("/</")) {
      value = value.replace("/</", "");
      setCurrentValue(
        json[person].userMessage[json[person].userMessage.indexOf("") + 1]
      );
      document.getElementById("#inpt").disabled = true;
      scrollToBottom();
    }
    if (value.includes("/v/")) {
      value = value.replace("/v/", "");
      setCurrentValue(json[person].userMessage[currentValueId + 1]);
      scrollToBottom();
    }
    if (value.includes("/&/")) {
      value = value.replace("/&/", "");
      setBotMsg(botMsg + 1);
      scrollToBottom();
    }

    if (value.includes("/@/")) {
      value = value.replace("/@/", "");
      setState("choose");
      setVars(vars + 1);
      scrollToBottom();
    }
    if (value.includes("/>/")) {
      value = value.replace("/>/", "");
      console.log("DAAAAA BLYATG");
      person === "meet" ? setPerson("sobes") : setPerson("meet");
      setVars(0);
      setDesicion("");
      setBotMsg(0);
      console.log(person, vars, botMsg, state);
      scrollToBottom();
    }
    if (value.includes("<strong>")) {
      value = parse(value);
      scrollToBottom();
      console.log(value);
    }

    return ReactDOMServer.renderToString(
      <div className="message">
        <div className={avatarClass}>
          <img
            src={person === "meet" ? "Marina.png" : "orgAvatar.png"}
            alt=""
          />
        </div>
        <div className={messageClass}>
          <div className="msg-bot msg">{value}</div>
        </div>
        <div className="avatar"></div>
      </div>
    );
  };

  const tipHTML = function (value) {
    return ReactDOMServer.renderToString(
      <div className="tip">
        <p>{value}</p>
      </div>
    );
  };

  const sendByBot = function (botMsg) {
    if (
      json[person].org[botMsg] === json[person].org[json[person].org.length - 1]
    ) {
      console.log("SLEDUJUSCHSIY");
    }
    chat = document.getElementById("#chat");
    if (botMsg === 0) {
      chat.innerHTML = "";
      scrollToBottom();
    }
    setTimeout(() => {
      chat.insertAdjacentHTML(
        "beforeend",
        botMessageHTML(json[person].org[botMsg])
      );
      scrollToBottom();
    }, 500);
    scrollToBottom();
  };

  const sendAnswer = function () {
    setState("input");
    inp = document.getElementById("#inpt");
    chat = document.getElementById("#chat");
    if (inp.value.includes("/t/")) {
      inp.value = inp.value.replace("/t/", "");
      chat.insertAdjacentHTML("beforeend", messageHTML(inp.value));
    } else {
      chat.insertAdjacentHTML("beforeend", messageHTML(inp.value));
    }

    scrollToBottom();

    setDesicion(inp.value);

    if (json[person].org[botMsg + 1].includes("$")) {
      if (username === "") {
        setUsername(inp.value);
        scrollToBottom();
      }
    }
    setBotMsg(botMsg + 1);
    scrollToBottom();

    if (!json[person].userMessage.includes(currentValue)) {
      console.log(currentValue);
      if (!document.getElementById("#inpt").disabled) {
        console.log("Here is not disabled");
        setCurrentValue(
          json[person].userMessage[json[person].userMessage.indexOf("") + 1]
        );
        scrollToBottom();
      } else {
        setCurrentValue(json[person].userMessage[currentValueId]);
        scrollToBottom();
      }
    } else {
      setCurrentValue(
        json[person].userMessage[
          json[person].userMessage.indexOf(currentValue) + 1
        ]
      );
      scrollToBottom();
    }
  };

  const sendChosen = function () {
    inp = document.querySelector('input[name="name"]:checked');
    if (currentValueId === json[person].userMessage.length - 1) {
      setCurrentValueId(0);
      setCurrentValue("");
      scrollToBottom();
    }
    console.log(inp.id, person, vars);
    const tip = json[person].tips[vars][inp.id - 1];
    setDesicion(inp.id);
    setState("input");
    chat = document.getElementById("#chat");
    chat.insertAdjacentHTML("beforeend", messageHTML(inp.value));
    scrollToBottom();
    setTimeout(() => {
      chat.insertAdjacentHTML("beforeend", tipHTML(tip));
      scrollToBottom();
    }, 1000);
    setTimeout(() => {
      if (vars === json[person].tips.length - 1) {
        setVars(0);
        setBotMsg(botMsg + 1);
        scrollToBottom();
      } else {
        setBotMsg(botMsg + 1);
        scrollToBottom();
      }
    }, 1000);
    scrollToBottom();

    console.log(state, vars);
  };

  const theNext = function () {
    console.log("HERE", vars, desicion, botMsg);
    setCurrentValueId(0);
    setCurrentValue(json[person].userMessage[0]);
    setVars(0);
    setDesicion("");
    setBotMsg(0);
    scrollToBottom();
  };

  const inputOrChoice = (state) => {
    console.log(state, desicion, vars, botMsg);
    if (!(state === "input")) {
      return (
        <div className="input_variants">
          <div className="variants_title">
            <span>
              <strong>Выберите, пожалуйста, один ответ:</strong>
            </span>
          </div>
          <div className="variants_values">
            {json[person].user[vars].map((v, i) => {
              console.log(i, v);
              return (
                <div className="value">
                  <input type="radio" id={i + 1} name="name" value={v} />
                  <label htmlFor={i + 1}>{v}</label>
                </div>
              );
            })}
          </div>
          <button
            className="send"
            id="snd"
            onClick={!json[person].org[botMsg + 1] ? theNext : sendChosen}
          >
            Отправить
          </button>
        </div>
      );
    } else {
      return (
        <>
          <div className="input_input">
            {!json[person].org[botMsg + 1] ? null : (
              <textarea
                id="#inpt"
                className="a"
                value={currentValue}
                ref={textareaRef}
                disabled={true}
                onChange={(e) => {
                  setCurrentValue(e.target.value);
                }}
              />
            )}
          </div>
          <button
            className="send"
            id="snd"
            onClick={!json[person].org[botMsg + 1] ? theNext : sendAnswer}
          >
            {!json[person].org[botMsg + 1] ? "Продолжить" : "Отправить"}
          </button>
        </>
      );
    }
  };

  return (
    <>
      <div className="title">
        <h1>
          <strong>{person === "meet" ? "Знакомство" : "Собеседование"}</strong>
        </h1>
      </div>
      <div id="windowChat" className="chat">
        <div className="chat-container" id="#chat">
          <div className="message"></div>
        </div>
        <div ref={messageEndRef} />
      </div>
      <div id="answer" className="input">
        {inputOrChoice(state)}
      </div>
    </>
  );
};
