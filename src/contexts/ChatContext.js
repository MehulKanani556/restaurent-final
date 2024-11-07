import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from 'axios';


const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const admin_id = localStorage.getItem("admin_id");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [allUser, setAllUser] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupChats, setgroupChats] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState();
    const [msgCount, setMsgCout] = useState(0)
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        if (token) {
            fetchOnlineUsers();
            fetchAllUsers();
        }
    }, [admin_id, apiUrl, token]);
    const fetchOnlineUsers = async () => {
        // setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/get-users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOnlineUsers(response.data.filter((v) => v.activeStatus == '1'));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        // setIsProcessing(false);
    }

    const fetchAllUsers = async () => {
        try {
            const response = await axios.post(`${apiUrl}/chat/user`, { admin_id: admin_id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllUser(response.data.users);
            setGroups(response.data.groups);
            setgroupChats(response.data.groupChats);
            let count = 0;
            response.data.users.forEach(user => {
                count += user.messages.filter(message => message.receiver_id == userId && message.read_by == "no").length;
            });
            setMsgCout(count);

        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            // setIsProcessing(false);
        }
    };
    const updateToken = useCallback((newToken) => {
        console.log(token, newToken);
        if (!token) {
            setToken(newToken);
        }
    });

    return (
        <ChatContext.Provider value={{
            allUser,
            groups,
            groupChats,
            onlineUsers,
            msgCount,
            fetchOnlineUsers,
            fetchAllUsers,
            updateToken,

        }}>
            {children}
        </ChatContext.Provider>
    )

}

export const useChat = () => useContext(ChatContext)