import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import useSocket from '../hooks/useSocket';
import useAudioManager from '../components/audioManager';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [token,setToken] = useState(localStorage.getItem("token"));
    const admin_id = localStorage.getItem("admin_id");
    const user_id = localStorage.getItem("userId");
    const apiUrl = process.env.REACT_APP_API_URL;
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const echo = useSocket();
  const { playNotificationSound } = useAudioManager();
  const [prevNotificationCount, setPrevNotificationCount] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('prevNotificationCount')) || [];
    return storedData;
  });
  const fetchNotifications = useCallback(async () => {
    if (isFetching) return;
    // console.log("ddv",prevNotificationCount);    
    setIsFetching(true);
    try {
      const response = await axios.post(`${apiUrl}/notification/getAll`, 
        { admin_id, user_id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newCount = response.data.length;
      setNotifications(response.data.reverse());
      // setNotificationCount(newCount);
      
      const existingUser = prevNotificationCount.find(item => item.id === user_id);
      if (existingUser) {
        setNotificationCount(newCount - existingUser.count); 
        // if (newCount > existingUser.count) {
        //   existingUser.count = newCount;
        //   // localStorage.setItem('prevNotificationCount', JSON.stringify(prevNotificationCount));
        // }
      } else {
        setNotificationCount(newCount); 
        const updatedCounts = [...prevNotificationCount, { id: user_id, count: newCount }];
        setPrevNotificationCount(updatedCounts);
        localStorage.setItem('prevNotificationCount', JSON.stringify(updatedCounts));
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsFetching(false);
    }
  }, [prevNotificationCount,token,user_id]);
  const debounceFetchNotifications = useRef(null);
  if (echo) {
    echo.channel('notifications')
      .listen('NotificationMessage', (event) => {
        if (debounceFetchNotifications.current) clearTimeout(debounceFetchNotifications.current); 
        debounceFetchNotifications.current = setTimeout(fetchNotifications, 1000);
      });
  }
   const updateToken = useCallback((newToken) => {
    console.log(token,newToken);
    if(!token){
    setToken(newToken);
  }
}, []);
  const handleRead = useCallback(() => {
    const updatedData = prevNotificationCount.map(item => 
      item.id == user_id ? { ...item, count: notifications.length } : item 
    );
    setPrevNotificationCount(updatedData);
    localStorage.setItem('prevNotificationCount', JSON.stringify(updatedData));
    setNotificationCount(0);
}, [notificationCount, prevNotificationCount, user_id]);
  useEffect(() => {
    fetchNotifications();
  }, [token]);
  return (
    <NotificationContext.Provider value={{ notifications, notificationCount, fetchNotifications, updateToken,handleRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
export const useNotifications = () => useContext(NotificationContext);