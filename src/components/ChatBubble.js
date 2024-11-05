import PropTypes from "prop-types";
import avatar from '../Image/usuario 1.png'

const ChatBubble = ({ className = "j-left-padding", details }) => {

    // console.log("sds",details)

    return (
        <div
            style={{
                alignSelf: "stretch",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                padding: "0px ",
                gap: "10px",
                textAlign: "left",
                fontSize: "14px",
                color: "#fff",
                fontFamily: "Inter",
            }}
            className={className}
        >
            <div
                style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    gap: "4px",
                    maxWidth: "60%",
                    minWidth: "133px",
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
                            // minWidth: "98px",
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
                        // display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "6px",
                    }}
                >
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
                    <div className="j-remove-padding-box text-break"
                        style={{
                            flex: "1",
                            borderRadius: "20px 0px 20px 20px",
                            backgroundColor: "#374151",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            padding: "16px",
                        }}
                    >
                        <p className="m-0 p-2">

                            {details.message}
                        </p>

                    </div>
                </div>
                <div
                    style={{
                        width: "34px",
                        position: "relative",
                        lineHeight: "150%",
                        color: "#6b7280",
                        display: "none",
                    }}
                >
                    Seen
                </div>
            </div>
           
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
            {/* <img
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
            /> */}
        </div>
    );
};

ChatBubble.propTypes = {
    className: PropTypes.string,
};

export default ChatBubble;
