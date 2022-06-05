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
  let [state, setState] = useState("input");
  let [person, setPerson] = useState("meet");
  let [botMsg, setBotMsg] = useState(0);
  const [desicion, setDesicion] = useState("");
  const [username, setUsername] = useState("");
  const [vars, setVars] = useState(-1);
  const [btnState, setBtnState] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [textareaChange, setTextareaChange] = useState(false);
  let inp;
  let chat;
  const messageEndRef = createRef();
  const textareaRef = useRef(null);
  const [currentValue, setCurrentValue] = useState("");
  const [currentTipId, setCurrentTipId] = useState(0);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    console.log("useEffect setDesicion", desicion);
  }, [desicion]);

  useEffect(() => {
    console.log("useEffect setCV", currentValue);
    if (currentValue.includes("$")) {
      console.log("useEffect setCV if $ in CV");
      setCurrentValue("");
      document.getElementById("#inpt").disabled = false;
      setBtnState(true);
      setDisabledBtn(false);
    }
    if (currentValue.includes("/v/")) {
      console.log("useEffect setCV if /v/ in CV");
      setDesicion(currentValue);
      setCurrentValue(currentValue.replace("/v/", ""));
      setDisabledBtn(false);
    }
    if (currentValue.includes("/e/")) {
      console.log("useEffect setCV if /e/ in CV");
      // setDesicion(currentValue);
      console.log(desicion);
      setCurrentValue(currentValue.replace("/e/", ""));
      setDisabledBtn(false);
    }
    // if (currentValue.includes("/t/")) {
    //   console.log("useEffect setCV if /e/ in CV");
    //   setDesicion(currentValue);
    //   setCurrentValue(currentValue.replace("/t/", ""));
    //   setDisabledBtn(false);
    // }
  }, [currentValue]);

  useEffect(() => {
    console.log("useEffect next=>sendByBot");
    sendByBot(botMsg);
    scrollToBottom();
  }, [botMsg]);

  useEffect(() => {
    console.log("useEffect setPerson");
    scrollToBottom();
  }, [person]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight - 15;
      textareaRef.current.style.height = scrollHeight + "px";
      if (!textareaRef.current.value) {
        // console.log("VALUE", textareaRef.current.value);
        // document.getElementById("snd").disabled = true;
      }
    }
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
    console.log('botMessageHTML setState("input")');
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
      console.log("setState choose");
      setVars(vars + 1);
      scrollToBottom();
    }

    if (value.includes("/e/")) {
      value = value.replace("/e/", "");
      setCurrentValue(desicion);
      setDisabledBtn(false);
      console.log("value includes /e/, setCurrentValue(desicion)");
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
        // scrollToBottom();
        console.log("sendChosen send tip");
        setCurrentTipId(currentTipId + 1);
      }, 500);
      scrollToBottom();
    }

    // if (value.includes("/>/")) {
    //   value = value.replace("/>/", "");
    //   person === "meet" ? setPerson("sobes") : setPerson("meet");
    //   setVars(-1);
    //   setDesicion("");
    //   setCurrentValue("");
    //   setBotMsg(0);
    //   scrollToBottom();
    // }
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
    if (
      json[person].org[botMsg] === json[person].org[json[person].org.length - 1]
    ) {
      console.log("Strannaya usloviya");
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
      console.log(
        "sendByBot setTimeout send botMessageHTML(json[person].org[botMSG])"
      );
      scrollToBottom();
      setTimeout(() => {
        if (botMsg === 0) {
          setCurrentValue(json[person].userMessage[0]);
          setDisabledBtn(false);
        }
        if (
          !json[person].userMessage[
            json[person].userMessage.indexOf(desicion) + 1
          ]
        ) {
          console.log(
            "sendByBot setTimeout^^ no next userMessage index of desicion"
          );
        } else {
          if (!json[person].org[botMsg].includes("/&/")) {
            console.log(
              "sendByBot setTimeout^^ json[person].org[botMsg] no includes /&/"
            );
            if (!json[person].org[botMsg - 1].includes("/@/")) {
              console.log(
                "sendByBot setTimeout^^ json[person].org[botMsg - 1] no includes /@/",
                state
              );
              if (state === "input") {
                setCurrentValue(
                  json[person].userMessage[
                    json[person].userMessage.indexOf(desicion) + 1
                  ]
                );
                setDisabledBtn(false);
              }

              console.log(
                "sendByBot setTimeout^^ setCurrentValue json[person].userMessage[desicion + 1]"
              );
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
    console.log('sendAnswer setState("input")');
    inp = document.getElementById("#inpt");
    if (!inp.disabled) {
      inp.disabled = true;
      setCurrentValue("");
      setBtnState(false);
      setUsername(inp.value + "Аноним");
      setDesicion("$");
      console.log('sendAnswer disabled input setDesicion("$")');
    } else {
      console.log();
      if (desicion.includes("/v/")) {
        setCurrentValue("");
        console.log('sendAnswer enabled desicion includes /v/ setCV("")');
      } else {
        setDesicion(inp.value);
        setCurrentValue("");
        console.log(
          "sendAnswer enabled desicion !includes /v/ setDesicion(inp.value)"
        );
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
          // console.log("sendChosen send tip");
          // if (currentTipId === json[person].referredTips.length - 1) {
          //   chat.insertAdjacentHTML(
          //     "beforeend",
          //     primingHTML(json[person].priming[0])
          //   );
          // } else {

          // }
          setCurrentTipId(currentTipId + 1);
        }, 500);
      } else {
        chat.insertAdjacentHTML("beforeend", messageHTML(inp.value));
        scrollToBottom();
      }
    }

    console.log("sendAnswer send inp.value");
    scrollToBottom();

    setBotMsg(botMsg + 1);
    console.log("sendAnswer setBotMsg(botmsg + 1)");
    scrollToBottom();
  };

  const sendChosen = function () {
    setDisabledBtn(true);
    document.getElementById("snd").disabled = true;
    inp = document.querySelector('input[name="name"]:checked');
    const tip = json[person].tips[vars][inp.id - 1];
    console.log("sendChosen set tip to json[person].tips[vars][idChosen]");
    setState("input");
    setCurrentValue("");
    chat = document.getElementById("#chat");
    chat.insertAdjacentHTML("beforeend", messageHTML(inp.value));
    console.log("sendChosen send messageHTML(chosenValue)");
    scrollToBottom();
    if (!json[person].user[0].includes(inp.value)) {
      setTimeout(() => {
        chat.insertAdjacentHTML("beforeend", tipHTML(tip));
        scrollToBottom();
        console.log("sendChosen send tip");
      }, 1000);
      setTimeout(() => {
        if (vars === json[person].tips.length - 1) {
          setVars(-1);
          console.log("sendChosen setTimeout last vars setVars-1");
          setBotMsg(botMsg + 1);
          console.log("sendChosen setTimeout last vars setBotMsg+1");
          scrollToBottom();
          // setState("input");
        } else {
          console.log("sendChosen setTimeout !last vars");
          setBotMsg(botMsg + 1);
          scrollToBottom();
        }
      }, 1000);
    } else {
      setBotMsg(botMsg + 1);
      scrollToBottom();
    }

    scrollToBottom();
    // setState("input");
    // console.log('sendChosen setState("input")');
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
                  console.log("e target", textareaChange);
                }}
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
