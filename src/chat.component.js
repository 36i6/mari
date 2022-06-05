import {
  createRef,
  React,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import ReactDOMServer from "react-dom/server";
const parse = require("html-react-parser");
const json = require("./aa.json");

export const Chat = () => {
  let inp;
  let chat;
  let [state, setState] = useState("input");
  let [person, setPerson] = useState("meet");
  let [botMsg, setBotMsg] = useState(0);
  const [desicion, setDesicion] = useState("");
  const [username, setUsername] = useState("");
  const [vars, setVars] = useState(-1);
  const [btnState, setBtnState] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const messageEndRef = createRef();
  const textareaRef = useRef(null);
  const [currentValue, setCurrentValue] = useState("");
  const [currentTipId, setCurrentTipId] = useState(0);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      if (document.getElementById("snd")) {
        document.getElementById("snd").click();
      }
    }
  }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (textareaRef.current) {
      if (textareaRef.current.placeholder) {
        textareaRef.current.placeholder = "";
      }
    }
  }, [desicion]);

  useEffect(() => {
    if (textareaRef.current) {
      if (!textareaRef.current.disabled) {
        textareaRef.current.value
          ? (() => {
              document.getElementById("snd").disabled = false;
              textareaRef.current.placeholder = "";
            })()
          : (() => {
              document.getElementById("snd").disabled = true;
              textareaRef.current.placeholder = "Например, Андрей";
            })();
      }
    }

    if (currentValue.includes("$")) {
      setCurrentValue("");
      document.getElementById("#inpt").disabled = false;
      setBtnState(true);
      setDisabledBtn(false);
    }
    if (currentValue.includes("/v/")) {
      setDesicion(currentValue);
      setCurrentValue(currentValue.replace("/v/", ""));
      setDisabledBtn(false);
    }
    if (currentValue.includes("/e/")) {
      // setDesicion(currentValue);
      setCurrentValue(currentValue.replace("/e/", ""));
      setDisabledBtn(false);
    }
  }, [currentValue]);

  useEffect(() => {
    sendByBot(botMsg);
    scrollToBottom();
  }, [botMsg]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight - 15;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [currentValue]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return (() => {
      document.removeEventListener("keydown", handleKeyPress);
    })();
  }, [handleKeyPress]);

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
    const avatarClass = "message_botAvatar avatar";
    const messageClass = "message_botMessage";
    if (value.includes("/$/")) {
      value = value.replace("/$/", username);
    }
    if (value.includes("/</")) {
      value = value.replace("/</", "");
      document.getElementById("#inpt").disabled = true;
      setBtnState(false);
      scrollToBottom();
    }

    if (value.includes("/&/")) {
      value = value.replace("/&/", "");
      setCurrentValue("");
      setDisabledBtn(false);
      scrollToBottom();
    }

    if (value.includes("/@/")) {
      value = value.replace("/@/", "");
      setState("choose");
      setVars(vars + 1);
      scrollToBottom();
    }

    if (value.includes("/e/")) {
      value = value.replace("/e/", "");
      setCurrentValue(desicion);
      setDisabledBtn(false);
      scrollToBottom();
    }

    if (value.includes("/p/")) {
      return primingHTML(json[person].priming[0]);
    }

    if (value.includes("/t/")) {
      value = value.replace("/t/", "");
      setTimeout(() => {
        chat.insertAdjacentHTML(
          "beforeend",
          tipHTML(json[person].referredTips[currentTipId])
        );
        setCurrentTipId(currentTipId + 1);
      }, 500);
      scrollToBottom();
    }

    if (value.includes("<strong>")) {
      value = parse(value);
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

  const primingHTML = function (value) {
    return ReactDOMServer.renderToString(
      <div className="priming">
        <p className="priming_title">«Примечания»</p>
        <p className="priming_body">{value}</p>
      </div>
    );
  };

  const sendByBot = function (botMsg) {
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
      setTimeout(() => {
        if (botMsg === 0) {
          setCurrentValue(json[person].userMessage[0]);
          setDisabledBtn(false);
        }
        if (
          json[person].userMessage[
            json[person].userMessage.indexOf(desicion) + 1
          ]
        ) {
          if (!json[person].org[botMsg].includes("/&/")) {
            if (!json[person].org[botMsg - 1].includes("/@/")) {
              if (state === "input") {
                setCurrentValue(
                  json[person].userMessage[
                    json[person].userMessage.indexOf(desicion) + 1
                  ]
                );
                setDisabledBtn(false);
              }
            }
          }
        }
      }, 500);
    }, 500);
    scrollToBottom();
  };

  const sendAnswer = function () {
    setDisabledBtn(true);
    document.getElementById("snd").disabled = true;
    setState("input");
    inp = document.getElementById("#inpt");
    if (!inp.disabled) {
      inp.disabled = true;
      setCurrentValue("");
      setBtnState(false);

      setUsername(inp.value);
      setDesicion("$");
    } else {
      if (desicion.includes("/v/")) {
        setCurrentValue("");
      } else {
        setDesicion(inp.value);
        setCurrentValue("");
      }
    }

    chat = document.getElementById("#chat");
    if (inp.value) {
      if (inp.value.includes("/t/")) {
        inp.value = inp.value.replace("/t/", "");
        chat.insertAdjacentHTML("beforeend", messageHTML(inp.value));
        scrollToBottom();
        setTimeout(() => {
          chat.insertAdjacentHTML(
            "beforeend",
            tipHTML(json[person].referredTips[currentTipId])
          );
          scrollToBottom();
          setCurrentTipId(currentTipId + 1);
        }, 500);
      } else {
        chat.insertAdjacentHTML("beforeend", messageHTML(inp.value));
        scrollToBottom();
      }
    }
    setBotMsg(botMsg + 1);
    scrollToBottom();
  };

  const sendChosen = function () {
    setDisabledBtn(true);
    document.getElementById("snd").disabled = true;
    inp = document.querySelector('input[name="name"]:checked');
    const tip = json[person].tips[vars][inp.id - 1];
    setState("input");
    setCurrentValue("");
    chat = document.getElementById("#chat");
    chat.insertAdjacentHTML("beforeend", messageHTML(inp.value));
    scrollToBottom();
    if (!json[person].user[0].includes(inp.value)) {
      setTimeout(() => {
        chat.insertAdjacentHTML("beforeend", tipHTML(tip));
        scrollToBottom();
      }, 1000);
      setTimeout(() => {
        if (vars === json[person].tips.length - 1) {
          setVars(-1);
          setBotMsg(botMsg + 1);
          scrollToBottom();
        } else {
          setBotMsg(botMsg + 1);
          scrollToBottom();
        }
      }, 1000);
    } else {
      setBotMsg(botMsg + 1);
      scrollToBottom();
    }
    scrollToBottom();
  };

  const theNext = function () {
    person === "meet" ? setPerson("sobes") : setPerson("meet");
    setVars(-1);
    setDesicion("");
    setCurrentValue("");
    setBotMsg(0);
    scrollToBottom();
  };

  const inputOrChoice = (state) => {
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
            disabled={false}
            onClick={!json["meet"].org[botMsg + 1] ? theNext : sendChosen}
            onKeyDown={(e) => {
              console.log(e);
            }}
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
              />
            )}
          </div>
          <button
            className="send"
            id="snd"
            onClick={!json[person].org[botMsg + 1] ? theNext : sendAnswer}
            disabled={
              disabledBtn ? !!json[person].org[botMsg + 1] : disabledBtn
            }
          >
            {btnState ? "Отправить" : "Продолжить"}
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
