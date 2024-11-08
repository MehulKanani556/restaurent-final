import { useState, useCallback, useEffect } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import Home_contMes from "./Home_contMes";
import Home_Messages from "./Home_Messages";
import Header from "./Header";
import Sidenav from "./Sidenav";
import avatar from '../img/Avatar.png';
import Echo from "laravel-echo";
import useSocket from "../hooks/useSocket"; // Adjust the path as necessary

const Home_mes = () => {
    const [selectedContact, setSelectedContact] = useState(null);
    const echo = useSocket();

    const onNavItemContainerClick = useCallback(() => {
        // Please sync "Home - Pedidos" to the project
    }, []);

    useEffect(() => {
        if (echo) {
            echo.connector.pusher.connection.bind('connected', () => {
                console.log("chat ss "); // Update state when connected
            });
            echo.connector.pusher.connection.bind('error', (error) => {
                console.error("Connection error:", error);
            });
        }
    }, [echo]);

    return (
        <Container fluid className="p-0" style={{ backgroundColor: "#111928", minHeight: "100vh", color: "#fff" }}>
            <Header />
            <div className="j-sidebar-nav">
                <Sidenav />
            </div>

            <div className="jay-chat-column">
                <Row className="flex-nowrap">
                    <Col xs={2} className="j-bg-dark-500 j-final-border-end p-0 jc-position-fixed sidebar">
                        <Home_contMes setSelectedContact={setSelectedContact} />
                    </Col>
                    <Col xs={7} className="p-0">
                        {selectedContact ? (
                            <Home_Messages contact={selectedContact} />
                        ) : (
                            <div style={{
                                alignSelf: "stretch",
                                backgroundColor: "#111928",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
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
                                color: "#ffffff2e",
                                fontFamily: "Inter",
                            }}
                                className="j-chat-margin">
                                <div>
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z" clip-rule="evenodd"></path></svg>
                                    <h2 className="text-center">Mensajes</h2>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        </Container>
    );
};
export default Home_mes;
