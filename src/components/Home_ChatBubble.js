import PropTypes from "prop-types";
import avatar from '../Image/usuario 1.png'


const Home_ChatBubble = ({ details, receiver }) => {
  // console.log("recive", details,receiver)
  return (
    <div
      style={{
        width: "915px",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        // padding: "0px 680px 0px 0px",
        boxSizing: "border-box",
        gap: "10px",
        maxWidth: "100%",
        textAlign: "left",
        fontSize: "14px",
        color: "#fff",
        fontFamily: "Inter",
      }}
      className="j-right-padding"
    >
      <div 
                className={`sjavatar me-2 ${details.showTime ? 'roundedCircle' : ''}`} 
                style={{ 
                    backgroundColor: details.showTime ? "#ab7171" : "transparent", 
                    textAlign: "center", 
                    alignContent: "center", 
                    fontWeight: "bold", 
                    width: "35px", 
                    height: "35px" 
                }}
            >
                {details.showTime && details.sender_name.split(' ').map((word, i) => i < 2 ? word.charAt(0).toUpperCase() : "").join('')}
            </div>
      <div
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: "4px",
          minWidth: "125px",
          maxWidth: "60%",
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


            }}
            
          >
            {details.showTime && details.sender_name}
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
            {details.showTime && (
                <div className="message-time">
                    {new Date(details.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                </div>
            )}
          </div>
        </div>
        <div
          style={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "6px",
          }}
        >
          <div className="j-chat-whitespace j-padding-first"
            style={{
              flex: "1",
              borderRadius: "0px 20px 20px 20px",
              backgroundColor: "#374151",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <p className="p-2 m-0" style={{ position: "relative", lineHeight: "150%" }}>
              {details.message}
            </p>
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
            src="/dotsvertical1.svg"
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
  );
};

// Home_ChatBubble.propTypes = {
//   className: PropTypes.string,
// };

export default Home_ChatBubble;
