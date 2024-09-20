import { useEffect, useState } from "react";
import Echo from "laravel-echo";

const useSocket = () => {
    const [echo, setEcho] = useState(null);

    useEffect(() => {
        window.Pusher = require('pusher-js');
        const newEcho = new Echo({
            broadcaster: "pusher",
            key: "7ae046560a0ed83ad8c7",
            cluster: "mt1",
            wsHost: window.location.hostname,
            wsPort: 6001,
            forceTLS: true,
            disableStats: true,
            enabledTransports: ['ws','wss'], // Allow both unencrypted and encrypted WebSocket connections
        });

        setEcho(newEcho);

        return () => {
            newEcho.disconnect(); // Clean up on unmount
        };
    }, []);

    return echo;
};

export default useSocket;