import PropTypes from "prop-types";
import Home_ChatBubble from "./Home_ChatBubble";
import ChatBubble from "./ChatBubble";
import avatar from '../Image/usuario 1.png'

import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import echo from "../echo";
import Echo from "laravel-echo";
import { io } from 'socket.io-client';
import useSocket from "../hooks/useSocket";
import axios from "axios";

const Home_Messages = ({ contact }) => {

  // const [displayText, setDisplayText] = useState('Escribir ...');

  // const handleButtonClick = (text) => {
  //   setDisplayText(text);
  // };
const apiUrl = 'http://127.0.0.1:8000/api' ; 
  const [inputText, setInputText] = useState('');
  const echo = useSocket();

  const handleButtonClick = (text) => {
    setInputText(text);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    console.log(inputText)
  };
  // alert(contact)
  useEffect(() => {
    if (echo) {
      echo.connector.pusher.connection.bind('connected', () => {
        console.log("chat message "); // Update state when connected
      });
      echo.connector.pusher.connection.bind('error', (error) => {
        console.error("Connection error:", error);
      });
    }
  }, [echo]);
  const sendMessage = async () => {
    if (!contact) { // Adjust this condition based on your logic
      alert('Please select a user or a group to send a message.');
      return;
    }

    try {
      await axios.post(`${apiUrl}/brodcast`, {
        username: contact.name, // Adjust based on your data structure
        receiver_id: contact.id || null, // Adjust based on your data structure
        msg: inputText
      });

      // Add logic to update the message list if needed
      setInputText(''); // Clear input after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const styles = {
    container: {
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
      overflowY: "auto",
      textAlign: "left",
      fontSize: "14px",
      color: "#fff",
      fontFamily: "Inter",
    },
    footer: {
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
    },
    // ... other styles
  };

  return (
    <div style={styles.container} className="j-chat-margin">
      {/* <div className="m_borbot jchat-padding-2 px-3 d-flex align-items-center j-chat-position-fixed" style={{ zIndex: "0" }}>
        <img src={avatar} alt="avatar" className="me-2" style={{ borderRadius: "50%", width: "32px", height: "32px" }} />
        <div>
          <div className="fw-bold j-chat-bold-size">Roberta Casas</div>
          <div className="d-flex align-items-center text-success small j-chat-bold-size-2">
            <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
            <span className="ms-2">Online</span>
          </div>
        </div>
      </div> */}
      <div className="m_borbot jchat-padding-2 px-3 d-flex align-items-center j-chat-position-fixed" style={{ zIndex: "0" }}>
        <Image src={avatar} roundedCircle width="32" height="32" className="me-2" />
        <div>
          <div className="fw-bold j-chat-bold-size m16">{contact.name}</div>
          <div className="d-flex align-items-center text-success small j-chat-bold-size-2">
            <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
            <span className="ms-2">Online</span>
          </div>
        </div>
      </div>

      <div className="w-100 ">

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
        <ChatBubble details={contact} />
        <Home_ChatBubble details={contact} />
        <ChatBubble details={contact} />
        <Home_ChatBubble details={contact} />
        <ChatBubble details={contact} />
        <Home_ChatBubble details={contact} />
        <ChatBubble details={contact} />
        <Home_ChatBubble details={contact} />
      </div>
      <footer
        className="j-footer-set-left"
        style={styles.footer}
      >
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
          onClick={sendMessage}
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



export default Home_Messages;