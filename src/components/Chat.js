import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Image, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import Echo from "laravel-echo";

import Header from "./Header";
import Sidenav from "./Sidenav";
import ChatBubble from "./ChatBubble";
import Home_ChatBubble from "./Home_ChatBubble";
import useSocket from "../hooks/useSocket";
import avatar from '../img/Avatar.png';

// Styles
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
        marginTop: "10px"
    },
    button: {
        backgroundColor: "transparent",
        border: "1px solid #d1d5db",
        borderRadius: "9999px",
        padding: "6px 11px",
        color: "white",
        cursor: "pointer",
    },
    inputField: {
        backgroundColor: "#1f2a37",
        padding: "12px 16px",
        width: "100%",
    },
    sendButton: {
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
    },
    sendButtonDiv: {
        position: "relative",
        fontSize: "12px",
        lineHeight: "150%",
        fontWeight: "500",
        fontFamily: "Inter",
        color: "#fff",
        textAlign: "left",
        display: "inline-block",
        minWidth: "87px",
    },
    date: {
        fontWeight: "bold",
        color: "#9ca3af",
        margin: "10px 0",
        textAlign: "center",
    },
    dateSpan: {
        backgroundColor: "#374152",
        padding: "2px 6px",
        borderRadius: "4px",
        fontWeight: "500",
    }
};

const Chat = () => {
    const [selectedContact, setSelectedContact] = useState(null);
    const [userId, setUserId] = useState(sessionStorage.getItem('userId'));
    const admin_id = sessionStorage.getItem('admin_id');
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupChats, setgroupChats] = useState([]);
    const echo = useSocket();
    const apiUrl = process.env.REACT_APP_API_URL;
    const chatContainerRef = useRef(null);


    useEffect(() => {
        if (token) {
            setIsProcessing(true);
            fetchAllUsers();
        }
    }, [token]);

    useEffect(() => {
        setupEchoListeners();
        return () => {
            if (echo) {
                echo.leaveChannel(`chat.${selectedContact?.id}.${userId}`);
            }
        };
    }, [echo, selectedContact, userId]);


    const setupEchoListeners = () => {
        if (echo) {
            // echo.channel(`chat.${selectedContact?.id}.${userId}`)
            console.log(userId)
            echo.channel(`chat.${userId}`)
                .listen('Chat', (data) => {
                    console.log("chat message received", data);
                    fetchAllUsers();
                    fetchMessages();
                });
                console.log("Socket connection established")
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.post(`${apiUrl}/chat/user`,{admin_id:admin_id}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllUser(response.data.users);
            setGroups(response.data.groups);
            setgroupChats(response.data.groupChats);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchMessages = async () => {
        if (!selectedContact) return;

        try {
            const response = await axios.post(`${apiUrl}/chat/messages`, {
                receiver_id: selectedContact.id,
                group_id: selectedContact?.pivot?.group_id || null,
                admin_id:admin_id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
            fetchAllUsers();
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    const sendMessage = async () => {
        if (!selectedContact || !inputText.trim()) return;

        try {
            await axios.post(`${apiUrl}/chat/broadcast`, {
                username: selectedContact.name,
                receiver_id: selectedContact.id || null,
                msg: inputText,
                group_id: selectedContact?.pivot?.group_id || null,
                admin_id:admin_id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInputText('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    useEffect(() => {
        if (selectedContact) {
            fetchMessages().then(() => markAsRead());
            // console.log(messages)
        }
    }, [selectedContact]);

    const markAsRead = async () => {
        //  console.log("object",messages);
        const cardIds = messages.map(user => user.id);
        // Assuming card_id is a property in allUser
        if (cardIds.length > 0) {

            try {
                await axios.post(`${apiUrl}/mark-as-read`, {
                    chat_id: cardIds
                });
                // console.log('Marked as read successfully');
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        } else {
            console.log("not select ")
        }
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        fetchMessages();

    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };


    const renderMessageGroups = () => {
        if (!Array.isArray(messages) || messages.length === 0) {
            return <div style={{ display: 'grid', placeItems: 'center' }}><p>No hay mensajes disponibles.</p></div>;
        }

        const messageGroups = messages.reduce((acc, message) => {
            const date = getMessageDate(message.created_at);
            if (!acc[date]) acc[date] = [];
            acc[date].push(message);
            return acc;
        }, {});

        return Object.entries(messageGroups).map(([date, dateGroup]) => (
            <div key={date}>
                <p style={styles.date}><span style={styles.dateSpan}>{date}</span></p>
                {dateGroup.map((message, index) => renderMessage(message, index))}
            </div>
        ));
    };

    const renderMessage = (message, index) => {
        if (message.sender_id == userId) {
            return <ChatBubble key={index} details={message} />;
        } else if (message.receiver_id == userId || message.group_id == selectedContact?.pivot?.group_id) {
            return <Home_ChatBubble key={index} details={message} receiver={selectedContact} />;
        }
        return null;
    };

    const getMessageDate = (createdAt) => {
        const messageDate = new Date(createdAt);
        const today = new Date();
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const daysAgo = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24));

        if (daysAgo < 7) {
            return weekDays[messageDate.getDay()];
        }
        return messageDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <Container fluid className="p-0" style={{ backgroundColor: "#111928", minHeight: "100vh", color: "#fff" }}>
            <Header />
            <div className="j-sidebar-nav">
                <Sidenav />
            </div>

            <div className="jay-chat-column">
                <Row className="flex-nowrap">
                    <Col xs={2} className="j-bg-dark-500 j-final-border-end p-0 jc-position-fixed sidebar">
                        <ContactsList
                            groups={groups}
                            allUser={allUser}
                            userId={userId}
                            handleContactClick={handleContactClick}
                            selectedContact={selectedContact}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            groupChats={groupChats}
                        />
                    </Col>
                    <Col xs={7} className="p-0">
                        {selectedContact ? (
                            <ChatWindow
                                selectedContact={selectedContact}
                                messages={messages}
                                inputText={inputText}
                                handleInputChange={handleInputChange}
                                handleKeyPress={handleKeyPress}
                                sendMessage={sendMessage}
                                renderMessageGroups={renderMessageGroups}
                            />
                        ) : (
                            <EmptyChatWindow />
                        )}
                    </Col>
                </Row>
            </div>

            <Modal show={isProcessing} keyboard={false} backdrop={true} className="m_modal m_user">
                <Modal.Body className="text-center">
                    <Spinner animation="border" role="status" style={{ height: '85px', width: '85px', borderWidth: '6px' }} />
                    <p className="mt-2">Procesando solicitud...</p>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

const ContactsList = ({ groups, allUser, userId, handleContactClick, selectedContact, searchTerm, setSearchTerm, groupChats }) => {
    const formatDateTime = (createdAt) => {
        const messageDate = new Date(createdAt);
        const currentDate = new Date();
        const isToday = messageDate.toDateString() === currentDate.toDateString();
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        const isYesterday = messageDate.toDateString() === yesterday.toDateString();

        if (isToday) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        } else if (isYesterday) {
            return 'Yesterday';
        } else if (currentDate - messageDate < 7 * 24 * 60 * 60 * 1000) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[messageDate.getDay()];
        } else {
            return messageDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        }
    };

    const sortedContacts = [...allUser]
        .filter(user => user.id != userId && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (!a.messages.length || !b.messages.length) return 0;
            return new Date(b.messages[0].created_at) - new Date(a.messages[0].created_at);
        });

    return (
        <div className={`sjcontacts-container`}>
            <div className="j-chat-size345 d-flex jchat-padding-1 px-3  m_borbot">
                <h4 className='j-chat-size345 mb-0 ps-2'>Mensajes</h4>
            </div>

            <div className="m_group jay-message-padding mt-2">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="mmj_icon">
                    <g>
                        <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
                    </g>
                </svg>
                <input
                    className="m_input ps-5"
                    type="search"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className='j-chat-sidevar-height' style={{ height: "750px", overflowY: "auto" }}>
                <div className="sjgroup-chat-header p-3 d-flex justify-content-between align-items-center">
                    <div className="sjheader-title">Chat grupal</div>
                </div>

                {/* {groups.map((group) => (
                    <div className="sjcontacts-list" onClick={() => handleContactClick(group)} key={group.id} style={{ cursor: 'pointer' }}>
                        <div className="sjcontact-item justify-content-between ">
                            <div className='d-flex align-items-center'>
                                <div className="sjavatar " style={{ backgroundImage: `url(${avatar})` }}>
                                    <div className="sjonline-status"></div>
                                </div>
                                <div className="sjcontact-info ms-2">
                                    <div className="sjcontact-name">{group.name}</div>
                                    <div className="sjcontact-message">{groupChats?.[0]?.message}</div>
                                    {console.log(groupChats)}
                                </div>
                            </div>
                            <div className="chat-circle">
                                <p className='mb-0'>4</p>
                            </div>
                        </div>
                    </div>
                ))} */}
                {groups.map((group) => (
                    <div className="sjcontacts-list" onClick={() => handleContactClick(group)} key={group.id} style={{ cursor: 'pointer' }}>
                        <div className="sjcontact-item justify-content-between ">
                            <div className='d-flex align-items-center'>
                                <div className="sjavatar " style={{ backgroundImage: `url(${avatar})` }}>
                                    <div className="sjonline-status"></div>
                                </div>
                                <div className="sjcontact-info ms-2">
                                    <div className="sjcontact-name">{group.name}</div>
                                    <div className="sjcontact-message">{groupChats?.[0]?.message}</div>                                   
                                </div>
                            </div>
                            {groupChats.filter(message => message.sender_id != userId && message.read_by === "no").length > 0 && (
                                <div className="chat-circle">
                                    <p className='mb-0'>{groupChats.filter(message => message.sender_id != userId && message.read_by === "no").length}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className="j-chats-meaasges">
                    {sortedContacts.map((ele) => {
                        const messagesWithReadByNo = ele.messages.filter(message => message.receiver_id == userId && message.read_by === "no");
                        const numberOfMessagesWithReadByNo = messagesWithReadByNo.length;

                        return (
                            <div key={ele.id} className={`sjcontacts-list  ${selectedContact === ele ? 'jchat-active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleContactClick(ele)} >
                                <div className="sjcontact-item" >
                                    <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                                        <div className="sjonline-status"></div>
                                    </div>
                                    <div className="sjcontact-info">
                                        <div className="sjcontact-name">{ele.name}</div>
                                        <div className="sjcontact-message">{ele.messages[0]?.message} </div>
                                    </div>
                                    <div style={{ flexGrow: 1, textAlign: 'end', fontSize: '12px', color: '#9CA3AF' }}>
                                        <p className='m-0'>
                                            {ele.messages[0]?.created_at ? formatDateTime(ele.messages[0]?.created_at) : null}
                                        </p>
                                        <p className='m-0 d-flex justify-content-end' style={{ textAlign: "end" }}>
                                            {numberOfMessagesWithReadByNo > 0 && (
                                                <div className="chat-circle ">
                                                    <p className='mb-0'>{numberOfMessagesWithReadByNo}</p>
                                                </div>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const ChatWindow = ({ selectedContact, messages, inputText, handleInputChange, handleKeyPress, sendMessage, renderMessageGroups }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    };


    useEffect(() => {
        scrollToBottom();
        renderMessageGroups()
    }, [messages, selectedContact]);

    return (
        <div style={styles.container} className="j-chat-margin">
            <div className="m_borbot jchat-padding-2 px-3 d-flex align-items-center j-chat-position-fixed" style={{ zIndex: "0" }}>
                <Image src={avatar} roundedCircle width="32" height="32" className="me-2" />
                <div>
                    <div className="fw-bold j-chat-bold-size m16">{selectedContact.name}</div>
                    <div className="d-flex align-items-center text-success small j-chat-bold-size-2">
                        <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                        <span className="ms-2">Online</span>
                    </div>
                </div>
            </div>

            <div className="w-100" style={{ overflowY: 'auto' }}>
                {renderMessageGroups()}
                <div ref={messagesEndRef} />
            </div>

            <footer className="j-footer-set-left" style={styles.footer}>
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
                        <button onClick={() => handleInputChange({ target: { value: 'Hola ¿Cómo estas?' } })} className="j_chat_default_button" style={styles.button}>
                            Hola ¿Cómo estas?
                        </button>
                        <button onClick={() => handleInputChange({ target: { value: 'Corregir pedido' } })} style={styles.button}>
                            Corregir pedido
                        </button>
                    </div>
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribir ..."
                        className="j_chat_inputfield"
                        style={styles.inputField}
                    />
                </div>
                <div style={{
                    alignSelf: "stretch",
                    backgroundColor: "#1f2a37",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "12px 16px",
                }}>
                    <button onClick={sendMessage} style={styles.sendButton}>
                        <div style={styles.sendButtonDiv}>
                            Enviar mensaje
                        </div>
                    </button>
                </div>
            </footer>
        </div>
    );
};

const EmptyChatWindow = () => {
    return (
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
            overflowY: "auto",
            textAlign: "left",
            fontSize: "14px",
            color: "#ffffff2e",
            fontFamily: "Inter",
        }}
            className="j-chat-margin">
            <div>
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z" clipRule="evenodd"></path>
                    <path fillRule="evenodd" d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z" clipRule="evenodd"></path>
                </svg>
                <h2 className="text-center">Mensajes</h2>
            </div>
        </div>
    );
};

export default Chat;