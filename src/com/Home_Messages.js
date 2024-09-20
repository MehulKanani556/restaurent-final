// import ChatBubble from "./chat-bubble";
// import ChatBubble from "./chat-bubble";
import PropTypes from "prop-types";
import Home_ChatBubble from "./Home_ChatBubble";
import ChatBubble from "./ChatBubble";
import avatar from '../img/Avatar.png'
import { useState } from "react";

const Home_Messages = () => {

  // const [displayText, setDisplayText] = useState('Escribir ...');

  // const handleButtonClick = (text) => {
  //   setDisplayText(text);
  // };

  const [inputText, setInputText] = useState('');

  const handleButtonClick = (text) => {
    setInputText(text);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div
      style={{
        alignSelf: "stretch",
        backgroundColor: "#111928",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "16px 0px 0px 16px",
        boxSizing: "border-box",
        position: "absolute",
        top: "140px",
        gap: "16px",
        left: "621px",
        width: "67%",
        height: "612px",
        // minHeight: "917px",
        overflowY: "auto",
        textAlign: "left",
        fontSize: "14px",
        color: "#fff",
        fontFamily: "Inter",
      }}
      className="j-chat-margin"
    >
      <div className="w-100 " >

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: "0px 732px 0px 0px",
            boxSizing: "border-box",
            gap: "10px",
            maxWidth: "100%",
          }}
          className="j-padding-right"
        >
          <img
            style={{
              height: "32px",
              width: "32px",
              position: "relative",
              borderRadius: "100px",
              objectFit: "cover",
            }}
            loading="lazy"
            alt=""
            src={avatar}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: "6px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  lineHeight: "150%",
                  fontWeight: "600",
                  display: "inline-block",
                  minWidth: "100px",
                }}
              >
                Roberta Casas
              </div>
              <div
                style={{
                  position: "relative",
                  lineHeight: "150%",
                  color: "#6b7280",
                  display: "inline-block",
                  minWidth: "35px",
                  whiteSpace: "nowrap",
                }}
              >
                11:46
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "6px",
              }}
            >
              <div className="j-padding-first"
                style={{
                  borderRadius: "0px 20px 20px 20px",
                  backgroundColor: "#374151",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  padding: "16px",
                }}
              >
                <div className="j-font-size-chat-final" style={{ position: "relative", lineHeight: "150%" }}>
                  <p style={{ margin: "0" }}>Hola</p>
                  <p style={{ margin: "0" }}>¿Cómo estas?</p>
                </div>
              </div>
              <img
                style={{
                  height: "16px",
                  width: "16px",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: "0",
                  display: "none",
                }}
                alt=""
                src="/dotsvertical.svg"
              />
            </div>
            <div
              style={{
                width: "63px",
                position: "relative",
                lineHeight: "150%",
                color: "#6b7280",
                display: "none",
              }}
            >
              Delivered
            </div>
          </div>
        </div>
        <ChatBubble />
        <Home_ChatBubble />
        <ChatBubble />
        <Home_ChatBubble />
        <ChatBubble />
        <Home_ChatBubble />
        <ChatBubble />
        <Home_ChatBubble />
      </div>
      <footer
        className="j-footer-set-left"
        style={{
          width: "68%",
          margin: "0",
          position: "fixed",
          bottom: "0px",
          left: "621px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          maxWidth: "100%",
          textAlign: "left",
          fontSize: "14px",
          color: "#9ca3af",
          fontFamily: "Inter",
        }}
      >
        {/* <div className="j-chat-input-empty-oke"
          style={{
            alignSelf: "stretch",
            backgroundColor: "#1f2a37",
            borderBottom: "1px solid #374151",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            padding: "12px 16px",
            position: "relative",
            gap: "10px",
            minHeight: "103px",
            maxWidth: "100%",
          }}
        >
          <div style={{
            display: "flex",
            gap: "12px",
            marginBottom: "12px",
          }}>
            <button onClick={() => handleButtonClick('Hola ¿Cómo estas?')}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #d1d5db",
                borderRadius: "9999px",
                padding: "6px 11px",
                color: "white",
                cursor: "pointer",
              }}>
              Hola ¿Cómo estas?
            </button>
            <button onClick={() => handleButtonClick('Corregir pedido')}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #d1d5db",
                borderRadius: "9999px",
                padding: "6px 11px",
                color: "white",
                cursor: "pointer",
              }}>
              Corregir pedido
            </button>
          </div>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Escribir ..."
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#374151",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          />
          </div>
        </div> */}
        <div style={{
          backgroundColor: "#1f2a37",
          padding: "12px 16px",
          borderBottom: "1px solid #374151",
          width: "100%",
        }}>
          <div className="j_chat_footer" style={{
            gap: "12px",
            marginBottom: "12px",
          }}>
            <button onClick={() => handleButtonClick('Hola ¿Cómo estas?')}
              className="j_chat_default_button"
              style={{
                backgroundColor: "transparent",
                border: "1px solid #d1d5db",
                borderRadius: "9999px",
                padding: "6px 11px",
                color: "white",
                cursor: "pointer",
              }}>
              Hola ¿Cómo estas?
            </button>
            <button onClick={() => handleButtonClick('Corregir pedido')}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #d1d5db",
                borderRadius: "9999px",
                padding: "6px 11px",
                color: "white",
                cursor: "pointer",
              }}>
              Corregir pedido
            </button>
          </div>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Escribir ..."
            className="j_chat_inputfield"
          />
        </div>
        <div
          style={{
            alignSelf: "stretch",
            backgroundColor: "#1f2a37",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "12px 16px",
          }}
        >
          <button
            style={{
              cursor: "pointer",
              border: "none",
              padding: "8px 12px",
              backgroundColor: "#147bde",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "8px",
            }}
          >
            <img
              style={{
                height: "12px",
                width: "12px",
                position: "relative",
                overflow: "hidden",
                flexShrink: "0",
                display: "none",
              }}
              alt=""
              src="/cartplus.svg"
            />
            <div
              style={{
                position: "relative",
                fontSize: "12px",
                lineHeight: "150%",
                fontWeight: "500",
                fontFamily: "Inter",
                color: "#fff",
                textAlign: "left",
                display: "inline-block",
                minWidth: "87px",
              }}
            >
              Enviar mensaje
            </div>
            <img
              style={{
                height: "12px",
                width: "12px",
                position: "relative",
                overflow: "hidden",
                flexShrink: "0",
                display: "none",
              }}
              alt=""
              src="/cartplus.svg"
            />
          </button>
        </div>
      </footer>
    </div>
  );
};

// Home_Messages.propTypes = {
//   className: PropTypes.string,
// };

export default Home_Messages;