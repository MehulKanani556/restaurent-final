import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Image, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import Echo from "laravel-echo";

import Header from "./Header";
import Sidenav from "./Sidenav";
import ChatBubble from "./ChatBubble";
import Home_ChatBubble from "./Home_ChatBubble";
import useSocket from "../hooks/useSocket";
import avatar from '../img/Avatar.png';
import { useChat } from "../contexts/ChatContext";

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
        height: "calc(100vh - 320px)",
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
    },
    messageSubgroup: {
        marginBottom: '8px',
    }
};

const Chat = () => {
    const [selectedContact, setSelectedContact] = useState(null);
    const [userId] = useState(localStorage.getItem('userId'));
    const admin_id = localStorage.getItem('admin_id');
    const [token] = useState(localStorage.getItem('token'));
    const [messages, setMessages] = useState([]); // Ensure messages state is defined
    const [searchTerm, setSearchTerm] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    // const [allUser, setAllUser] = useState([]);
    // const [groups, setGroups] = useState([]);
    // const [groupChats, setgroupChats] = useState([]);
    const echo = useSocket();
    const apiUrl = process.env.REACT_APP_API_URL;
    const chatContainerRef = useRef(null);
    const [connection, setConnection] = useState(0)
    const [length, setLength] = useState(null);
    // const [onlineUsers, setOnlineUsers] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const inputTextRef = useRef(''); // Create a ref for the input text
    const inputFieldRef = useRef(null); // Create a ref for the input field
    const { allUser, groups, groupChats, onlineUsers, fetchOnlineUsers, fetchAllUsers,updateToken } = useChat();
    useEffect(() => {
        if (token) {
            setIsProcessing(true);
            updateToken(token);
            fetchAllUsers();
            fetchOnlineUsers();
            setIsProcessing(false);
        }
    }, [token]);

    // const fetchOnlineUsers = async () => {
    //     // setIsProcessing(true);
    //     try {
    //         const response = await axios.get(`${apiUrl}/get-users`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         setOnlineUsers(response.data.filter((v) => v.activeStatus == '1'));
    //     } catch (error) {
    //         console.error("Error fetching users:", error);
    //     }
    //     // setIsProcessing(false);
    // }

    // Add a separate useEffect for fetching online users periodically
    useEffect(() => {
        if (token) {
            // Initial fetch
            fetchOnlineUsers();

            // Set up interval for periodic updates
            // const intervalId = setInterval(() => {
            //     fetchOnlineUsers();
            // }, 10000); // Fetch every 10 seconds

            // Cleanup interval on unmount
            // return () => clearInterval(intervalId);
        }
    }, [token]);

    useEffect(() => {
        setupEchoListeners();
        return () => {
            if (echo && selectedContact) {
                // console.log("SS");
                echo.leaveChannel(`chat.${userId}`);
            }
        };
    }, [echo, selectedContact, userId]);

    const setupEchoListeners = () => {
        if (echo) {
            // echo.channel(`chat.${selectedContact?.id}.${userId}`)
            // console.log(userId)
            echo.channel(`chat.${userId}`)
                .listen('Chat', (data) => {
                    console.log("chat message received", data);
                    fetchAllUsers();
                    fetchMessages();
                    fetchOnlineUsers();
                });
            console.log("Socket connection established")
        }
    };
    const groupListeners = () => {
        if (echo && selectedContact?.hasOwnProperty('pivot')) {
            console.log(selectedContact.pivot.group_id);
            // echo.channel(`chat.${selectedContact?.id}.${userId}`)
            echo.channel(`group.${selectedContact.pivot.group_id}`)
                .listen('Chat', (data) => {
                    console.log("Groupchat message received", data);
                    fetchAllUsers();
                    fetchMessages();
                    fetchOnlineUsers();
                });
            // console.log("Socket connection established")
        }
    }
    // const fetchAllUsers = async () => {
    //     try {
    //         const response = await axios.post(`${apiUrl}/chat/user`, { admin_id: admin_id }, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         setAllUser(response.data.users);
    //         setGroups(response.data.groups);
    //         setgroupChats(response.data.groupChats);
    //     } catch (error) {
    //         console.error("Error fetching users:", error);
    //     } finally {
    //         setIsProcessing(false);
    //     }
    // };

    const fetchMessages = async () => {
        setIsLoading(true); // Set loading state
        if (!selectedContact) return;

        try {
            const response = await axios.post(`${apiUrl}/chat/messages`, {
                receiver_id: selectedContact.id,
                group_id: selectedContact?.pivot?.group_id || null,
                admin_id: admin_id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsLoading(false);
            setMessages(response.data);
            setLength(response.data.length)
            return response.data;
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };
    const sendMessage = async () => {
        if (!selectedContact || !inputTextRef.current.trim()) return;

        try {
            await axios.post(`${apiUrl}/chat/broadcast`, {
                username: selectedContact.name,
                receiver_id: selectedContact.id || null,
                msg: inputTextRef.current,
                group_id: selectedContact?.pivot?.group_id || null,
                admin_id: admin_id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Clear both the ref value and the input field
            inputTextRef.current = '';
            if (inputFieldRef.current) {
                inputFieldRef.current.value = '';
            }

            fetchMessages();
            fetchAllUsers();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        if (selectedContact) {
            // console.log("SS")
            fetchMessages().then((messages) => markAsRead(messages));
            fetchOnlineUsers();
            fetchAllUsers();
            groupListeners();
        }
    }, [selectedContact]);

    const markAsRead = async (messages) => {
        //  console.log("object",messages);
        const cardIds = messages?.filter(msg => msg.read_by == "no").map(msg => msg.id);
        // Assuming card_id is a property in allUser
        if (cardIds.length > 0) {

            try {
                await axios.post(`${apiUrl}/mark-as-read`, {
                    chat_id: cardIds,
                    admin_id: admin_id
                });
                fetchAllUsers();
                // console.log('Marked as read successfully');
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        } else {
            console.log("not select ")
        }
    };

    const handleContactClick = (contact) => {
        console.log("Selected contact:", contact); // Debugging line
        setSelectedContact(contact);
        
        // Use setTimeout to ensure the input field is focused after rendering
        setTimeout(() => {
            if (inputFieldRef.current) {
                inputFieldRef.current.focus();
            }
        }, 0); // Delay of 0 milliseconds
    };

    const handleInputChange = (event) => {
        inputTextRef.current = event.target.value; // Update the ref value
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

        // Group messages by date first
        const messageGroups = messages.reduce((acc, message) => {
            const date = getMessageDate(message.created_at);
            if (!acc[date]) acc[date] = [];
            acc[date].push(message);
            return acc;
        }, {});

        return Object.entries(messageGroups).map(([date, dateGroup]) => {
            // Group messages by sender and consecutive timing
            let currentSender = null;
            let currentTime = null;
            let messageSubgroups = [];
            let currentSubgroup = [];

            dateGroup.forEach((message) => {
                const messageTime = new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });

                // Start a new subgroup if:
                // 1. Different sender
                // 2. Same sender but time difference > 5 minutes
                const shouldStartNewGroup =
                    currentSender !== message.sender_id ||
                    (currentTime && getTimeDifferenceInMinutes(currentTime, messageTime) > 5);

                if (shouldStartNewGroup && currentSubgroup.length > 0) {
                    messageSubgroups.push([...currentSubgroup]);
                    currentSubgroup = [];
                }

                currentSubgroup.push({
                    ...message,
                    showTime: shouldStartNewGroup // Only show time for first message in group
                });

                currentSender = message.sender_id;
                currentTime = messageTime;
            });

            // Push the last subgroup
            if (currentSubgroup.length > 0) {
                messageSubgroups.push(currentSubgroup);
            }

            return (
                <div key={date} className="overflow-hidden">
                    <p style={styles.date}><span style={styles.dateSpan}>{date}</span></p>
                    {messageSubgroups.map((subgroup, groupIndex) => (
                        <div key={`${date}-${groupIndex}`} className="message-subgroup">
                            {subgroup.map((message, messageIndex) => (
                                <div key={message.id}>
                                    {message.sender_id == userId ? (
                                        <ChatBubble
                                            details={{
                                                ...message,
                                                showTime: message.showTime
                                            }}
                                        />
                                    ) : (
                                        message.receiver_id == userId ||
                                            message.group_id == selectedContact?.pivot?.group_id ? (
                                            <Home_ChatBubble
                                                details={{
                                                    ...message,
                                                    showTime: message.showTime
                                                }}
                                                receiver={selectedContact}
                                            />
                                        ) : null
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            );
        });
    };

    // Helper function to calculate time difference in minutes
    const getTimeDifferenceInMinutes = (time1, time2) => {
        const [hours1, minutes1] = time1.split(':').map(Number);
        const [hours2, minutes2] = time2.split(':').map(Number);
        return Math.abs((hours2 * 60 + minutes2) - (hours1 * 60 + minutes1));
    };

    const getMessageDate = (createdAt) => {
        const messageDate = new Date(createdAt);
        const today = new Date();
        const isToday = messageDate.toDateString() === today.toDateString();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1); // Calculate yesterday's date

        if (isToday) {
            return "Hoy";
        }
        // Add check for yesterday
        if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Ayer"; // Return "Ayer" for yesterday's date
        }

        const weekDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
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
                            onlineUsers={onlineUsers}
                        />
                    </Col>
                    <Col xs={7} className="p-0">
                        {selectedContact ? (
                            <ChatWindow
                                selectedContact={selectedContact}
                                inputTextRef={inputTextRef}
                                inputFieldRef={inputFieldRef}
                                handleInputChange={handleInputChange}
                                handleKeyPress={handleKeyPress}
                                sendMessage={sendMessage}
                                renderMessageGroups={renderMessageGroups}
                                onlineUsers={onlineUsers}
                                isLoading={isLoading}
                                messages={messages} // Pass messages to ChatWindow
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

const ContactsList = ({ groups, allUser = [], userId, handleContactClick, selectedContact, searchTerm, setSearchTerm, groupChats, onlineUsers }) => {
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
            return 'Ayer';
        } else if (currentDate - messageDate < 7 * 24 * 60 * 60 * 1000) {
            // const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            return days[messageDate.getDay()];
        } else {
            return messageDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) ;
        }
    };

    const sortedContacts = [...allUser]
        .filter(user => user.id != userId && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const aLastMessageDate = a.messages.length ? new Date(a.messages[0].created_at) : 0;
            const bLastMessageDate = b.messages.length ? new Date(b.messages[0].created_at) : 0;
            return bLastMessageDate - aLastMessageDate; // Sort by last message date
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
                {/* {console.log(groups,userId)}  */}
                {groups && groups.map((group) => (
                    <div className={`sjcontacts-list ${selectedContact?.id === group.id ? 'jchat-active' : ''}`} onClick={() => handleContactClick(group)} key={group.id} style={{ cursor: 'pointer' }}>
                        <div className={`sjcontact-item  `}>
                            <div>
                                <div className="sjavatar me-1" roundedCircle width="32px" height="32px" style={{ backgroundColor: "#ab7171", textAlign: "center", alignContent: "center", fontWeight: "bold" }}>
                                    {/* <div className="sjonline-status"></div> */}
                                    {group.name.split(' ')
                                        .map((word, i) => i < 2 ? word.charAt(0).toUpperCase() : "")
                                        .join('')}
                                </div>
                            </div>
                            <div className="sjcontact-info"style={{ minWidth: '35px' }}>
                                <div className="sjcontact-name text-nowrap" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.name}</div>
                                <div className="sjcontact-message" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {group?.messages[0]?.message}
                                        </div>
                               
                            </div>
                            <div style={{ flexGrow: 1, textAlign: 'end', fontSize: '12px', color: '#9CA3AF' }}>
                                <p> {group.messages[0]?.created_at ? formatDateTime(group.messages[0]?.created_at) : null}</p>
                            </div>
                            {/* {groups.filter(group => 
                                group.messages.some(message => message.sender_id !== userId && message.read_by === "no")
                            ).length > 0 && (
                                <div className="chat-circle">
                                    <p className='mb-0'>
                                        {groups.filter(group => 
                                            group.messages.some(message => message.sender_id !== userId && message.read_by === "no")
                                        ).length}
                                    </p>
                                </div>
                            )} */}
                        </div>
                    </div>
                ))}
                <div className="j-chats-meaasges" style={{ borderTop: "1px solid #374151" }}>

                    {sortedContacts.map((ele) => {
                        const messagesWithReadByNo = ele.messages.filter(message => message.receiver_id == userId && message.read_by === "no");
                        const numberOfMessagesWithReadByNo = messagesWithReadByNo.length;
                        // console.log("aa",selectedContact.email , ele.email)
                        return (
                            <div key={ele.id} className={`sjcontacts-list ${selectedContact?.email === ele.email ? 'jchat-active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleContactClick(ele)} >
                                <div className={`sjcontact-item `}>
                                    <div>

                                        <div className="sjavatar me-1" roundedCircle width="32px" height="32px" style={{ backgroundColor: "#ab7171", textAlign: "center", alignContent: "center", fontWeight: "bold" }}>
                                            {onlineUsers?.map((v) => v.id == ele.id && <div className="sjonline-status"></div>)}
                                            {ele.name.split(' ')
                                                .map(word => word.charAt(0).toUpperCase())
                                                .join('')}
                                        </div>
                                    </div>
                                    <div className="sjcontact-info" style={{ minWidth: '35px' }}>
                                        <div className="sjcontact-name text-nowrap" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ele.name}</div>
                                        <div className="sjcontact-message" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {ele.messages[0]?.message}
                                        </div>
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

const ChatWindow = ({
    selectedContact,
    inputTextRef,
    inputFieldRef,
    handleInputChange,
    handleKeyPress,
    sendMessage,
    renderMessageGroups,
    onlineUsers,
    isLoading,
    messages // Receive messages as a prop
}) => {
    const messagesEndRef = useRef(null);
    // console.log("aisss",messages)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    };


    useEffect(() => {
        scrollToBottom();
        renderMessageGroups()
    }, [messages, selectedContact]);

    const getUserStatus = (userId) => {
        return onlineUsers?.some(user => user.id === userId) ? 'En línea' : 'desconectado';
    };

    return (
        <div style={styles.container} className="j-chat-margin ">
            <div className="m_borbot jchat-padding-2 px-3 d-flex align-items-center j-chat-position-fixed" style={{ zIndex: "1" }}>
                <div className="sjavatar me-2" roundedCircle width="35px" height="35px" style={{ backgroundColor: "#ab7171", textAlign: "center", alignContent: "center", fontWeight: "bold" }}>
                    {selectedContact.name.split(' ').map((word, i) => i < 2 ? word.charAt(0).toUpperCase() : "").join('')}
                </div>
                <div>
                    <div className="fw-bold j-chat-bold-size m16">{selectedContact.name}</div>
                    {/* <div className="d-flex align-items-center text-success small j-chat-bold-size-2">
                        <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                        <span className="ms-2">Online</span>
                    </div> */}
                    {!selectedContact?.hasOwnProperty('pivot') &&
                        <div className={`d-flex align-items-center small j-chat-bold-size-2 ${getUserStatus(selectedContact.id) === 'En línea' ? 'text-success' : 'text-secondary'}`}>
                            <div className={`rounded-circle`} style={{ width: '8px', height: '8px', backgroundColor: getUserStatus(selectedContact.id) === 'En línea' ? 'green' : 'gray' }}></div>
                            <span className="ms-2">{getUserStatus(selectedContact.id)}</span>
                        </div>
                    }
                </div>
            </div>

            <div className="w-100 " style={{ overflowY: 'auto' }}>
                {isLoading && <p>Loading messages...</p>}
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
                        <button
                            onClick={() => {
                                inputTextRef.current = 'Hola ¿Cómo estas?';
                                if (inputFieldRef.current) {
                                    inputFieldRef.current.value = 'Hola ¿Cómo estas?';
                                }
                            }}
                            className="j_chat_default_button"
                            style={styles.button}
                        >
                            Hola ¿Cómo estas?
                        </button>
                        <button
                            onClick={() => {
                                inputTextRef.current = 'Corregir pedido';
                                if (inputFieldRef.current) {
                                    inputFieldRef.current.value = 'Corregir pedido';
                                }
                            }}
                            style={styles.button}
                        >
                            Corregir pedido
                        </button>
                    </div>
                    <input
                        type="text"
                        ref={inputFieldRef}
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
            height: "100%",
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
