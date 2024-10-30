import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import useSocket from '../hooks/useSocket';
import useAudioManager from '../components/audioManager';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [token,setToken] = useState(sessionStorage.getItem("token"));
    const admin_id = sessionStorage.getItem("admin_id");
    const user_id = sessionStorage.getItem("userId");
    const apiUrl = process.env.REACT_APP_API_URL;
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const echo = useSocket();
  const { playNotificationSound } = useAudioManager();
  const [prevNotificationCount, setPrevNotificationCount] = useState(() => {
    return parseInt(sessionStorage.getItem('prevNotificationCount') || '0');
  });

  const fetchNotifications = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const admin_id = sessionStorage.getItem("admin_id");
      const user_id = sessionStorage.getItem("userId");
    //   const token = sessionStorage.getItem("token");
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/notification/getAll`, 
        { admin_id, user_id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const newCount = response.data.length;
      setNotifications(response.data.reverse());
      setNotificationCount(newCount);

      if (newCount > prevNotificationCount) {
        playNotificationSound();
        setPrevNotificationCount(newCount);
        sessionStorage.setItem('prevNotificationCount', newCount.toString());
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsFetching(false);
    }
  }, [prevNotificationCount,token]);

  const debounceFetchNotifications = useRef(null); // Create a ref for debounce

  if (echo) {
    echo.channel('notifications')
      .listen('NotificationMessage', (event) => {
        // console.log('New notification received:', event.notification);
        if (debounceFetchNotifications.current) clearTimeout(debounceFetchNotifications.current); // Clear previous timeout
        debounceFetchNotifications.current = setTimeout(fetchNotifications, 1000); // Set a new timeout
        // playNotificationSound();; // Play sound when a new notification is received
      });
    // console.log("Socket connection established")
  }

   // Add a function to update the token
   const updateToken = useCallback((newToken) => {
    setToken(newToken);
}, []);

//   useEffect(() => {
//     // fetchNotifications();

//     if (echo) {
//       echo.channel('notifications')
//         .listen('NotificationMessage', () => {
//           fetchNotifications();
//         });
//     }
//   }, [echo, fetchNotifications]);

  return (
    <NotificationContext.Provider value={{ notifications, notificationCount, fetchNotifications, updateToken }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

