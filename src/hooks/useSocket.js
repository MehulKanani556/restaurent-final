import { useEffect, useState } from "react";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const useSocket = () => {
    const [echo, setEcho] = useState(null);

    useEffect(() => {
        window.Pusher = Pusher;

        const newEcho = new Echo({
            broadcaster: "pusher",
            key: "7ae046560a0ed83ad8c7",
            cluster: "mt1",
            wsHost: window.location.hostname,
            forceTLS: true, // Ensure this is true for wss
            disableStats: false,
            wsPort: 6001, // Ensure this port is correct
            // wssPort: 6001, // Ensure this port is correct
            // encrypted: false,
            // enabledTransports: ['ws', 'wss'],
            auth: {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        });

        // Add connection error logging
        newEcho.connector.pusher.connection.bind('error', (error) => {
            console.error('WebSocket connection error:', error);
        });

        // Log successful connection
        newEcho.connector.pusher.connection.bind('connected', () => {
            console.log('WebSocket connected successfully');
        });

        setEcho(newEcho);

        return () => {
            newEcho.disconnect(); // Clean up on unmount
        };
    }, []);

    return echo;
};

export default useSocket;

// import { useEffect } from "react";
// import Echo from "laravel-echo";

// const useSocket = () => {
//     useEffect(() => {
//         window.Echo = new Echo({
//             broadcaster: "pusher",
//             key: "7ae046560a0ed83ad8c7",
//             //  key: "GoofNBCH",
//             cluster: "mt1",
//             wsHost: window.location.hostname,
//             wsPort: 6001,
//             forceTLS: false, 
//             disableStats: false,
//             useTls: true, 
//             auth: {
//                 headers: {
//                     'Authorization': 'Bearer ' + localStorage.getItem('token')
//                 }
//             }
//         });

//         // Optional: Add any event listeners or additional setup here

//         return () => {
//             // Optional: Clean up if necessary
//             window.Echo.disconnect();
//         };
//     }, []);

//     return null; // This component does not render anything
// };

// export default useSocket;
