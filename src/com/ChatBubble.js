import PropTypes from "prop-types";
import avatar from '../img/Avatar.png'
const ChatBubble= ({ className = "j-left-padding" }) => {
    return (
        <div
            style={{
                alignSelf: "stretch",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                padding: "0px 10px 0px 668px",
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
                            minWidth: "98px",
                        }}
                    >
                        Joseph McFall
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
                    <div className="j-remove-padding-box"
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
                        <div
                            style={{
                                borderRadius: "8px",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                padding: "8px",
                                gap: "16px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    justifyContent: "center",
                                    gap: "8px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        gap: "8px",
                                    }}
                                >
                                    <img
                                        style={{
                                            height: "20px",
                                            width: "20px",
                                            position: "relative",
                                            overflow: "hidden",
                                            flexShrink: "0",
                                            display: "none",
                                        }}
                                        alt=""
                                        src="/pdf.svg"
                                    />
                                    <div className="j-font-size-chat-final"
                                        style={{
                                            position: "relative",
                                            lineHeight: "150%",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Bien llegando al trabajo
                                    </div>
                                </div>
                                <div
                                    style={{
                                        width: "149px",
                                        display: "none",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        gap: "8px",
                                        fontSize: "12px",
                                        color: "#6b7280",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "18px",
                                            flex: "1",
                                            position: "relative",
                                            lineHeight: "150%",
                                            display: "inline-block",
                                        }}
                                    >
                                        12 Pages
                                    </div>
                                    <div
                                        style={{
                                            height: "3px",
                                            width: "3px",
                                            position: "relative",
                                            borderRadius: "50%",
                                            backgroundColor: "#6b7280",
                                        }}
                                    />
                                    <div style={{ position: "relative", lineHeight: "150%" }}>
                                        18 MB
                                    </div>
                                    <div
                                        style={{
                                            height: "3px",
                                            width: "3px",
                                            position: "relative",
                                            borderRadius: "50%",
                                            backgroundColor: "#6b7280",
                                        }}
                                    />
                                    <div style={{ position: "relative", lineHeight: "150%" }}>
                                        PDF
                                    </div>
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
                                src="/download.svg"
                            />
                        </div>
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
        </div>
    );
};

ChatBubble.propTypes = {
    className: PropTypes.string,
};

export default ChatBubble;