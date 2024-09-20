import PropTypes from "prop-types";
import avatar from "../img/Avatar.png"

const Home_ChatBubble = () => {
  return (
    <div
      style={{
        width: "915px",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "0px 680px 0px 0px",
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
          flex: "1",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: "4px",
          minWidth: "125px",
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
            <div style={{ position: "relative", lineHeight: "150%" }}>
              Igualmente ya estoy aca
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
