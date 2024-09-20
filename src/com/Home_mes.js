import { useCallback } from "react";
// import Navbar from "../components/navbar";
// import Contacts from "../components/contacts";
// import Messages from "../components/messages";
import { Container, Row, Col, Image, Badge, ListGroup } from "react-bootstrap";
import Home_contMes from "./Home_contMes";
import Home_Messages from "./Home_Messages";
import Header from "./Header";
import Sidenav from "./Sidenav";
import avatar from '../img/Avatar.png'

const Home_mes = () => {
    const onNavItemContainerClick = useCallback(() => {
        // Please sync "Home - Pedidos" to the project
    }, []);

    return (
        <Container fluid className="p-0" style={{ backgroundColor: "#111928", minHeight: "100vh", color: "#fff" }}>
            {/* <Navbar /> */}
            <Header />
            <div className="j-sidebar-nav">
                <Sidenav />
            </div>

            <div className="jay-chat-column">
                <Row className="flex-nowrap" >
                    <Col xs={2} className="j-bg-dark-500 j-final-border-end p-0 jc-position-fixed sidebar">
                        {/* <Contacts /> */}
                        <Home_contMes />
                    </Col>
                    <Col xs={7} className="p-0">
                        <div className="m_borbot jchat-padding-2 px-3 d-flex align-items-center j-chat-position-fixed " style={{ zIndex: "0" }}>
                            <Image src={avatar} roundedCircle width="32" height="32" className="me-2" />
                            <div>
                                <div className="fw-bold j-chat-bold-size">Roberta Casas</div>
                                <div className="d-flex align-items-center text-success small j-chat-bold-size-2">
                                    <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                    <span className="ms-2">Online</span>
                                </div>
                            </div>
                        </div>
                        {/* <Messages /> */}
                        <Home_Messages />
                    </Col>
                </Row>
            </div>

        </Container>
    );
};

export default Home_mes;
