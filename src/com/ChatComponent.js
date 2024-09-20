import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const ChatComponent = () => {
    const currentUser = { id: 1, username: 'CurrentUser', email: 'current@example.com' };
    const users = [
      { id: 30, username: 'User2', email: 'user2@example.com' },
      { id: 31, username: 'User3', email: 'user3@example.com' },
      { id: 121, username: 'User4', email: 'user4@example.com' },
    ];
    const groups = [
      { id: 1, name: 'Group 1' },
      { id: 2, name: 'Group 2' },
      { id: 3, name: 'Group 3' },
    ];
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const storedReceiverId = localStorage.getItem('receiverId');
    const storedGroupId = localStorage.getItem('groupId');
    
    if (storedReceiverId) {
      const receiver = users.find(u => u.id === parseInt(storedReceiverId));
      if (receiver) selectUser(receiver);
    } else if (storedGroupId) {
      const group = groups.find(g => g.id === parseInt(storedGroupId));
      if (group) selectGroup(group);
    }

    initializeEcho();
  }, []);

  const initializeEcho = () => {
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'GoofNBCH',
      cluster: 'mt1',
      wsHost: window.location.hostname,
      wsPort: 6001,
      forceTLS: false,
      disableStats: false,
      enabledTransports: ['ws', 'wss']
    });
    window.Echo.connector.pusher.connection.bind('connected', () => {
        console.log("chat message "); // Update state when connected
    });
    subscribeToChat();
  };

  const subscribeToChat = () => {
    if (selectedGroup) {
      window.Echo.join(`group.${selectedGroup.id}`)
        .listen('Chat', (data) => {
          addNewMessage(data);
        });
    } else if (selectedReceiver) {
      window.Echo.public(`chat.${selectedReceiver.id}.${currentUser.id}`)
        .listen('Chat', (data) => {
          addNewMessage(data);
        });
    }
  };

  const addNewMessage = (data) => {
    setMessages(prevMessages => [...prevMessages, {
      sender_id: data.sender_id,
      sender_name: data.username,
      message: data.message
    }]);
  };

  const selectUser = (user) => {
    setSelectedReceiver(user);
    setSelectedGroup(null);
    localStorage.setItem('receiverId', user.id);
    localStorage.setItem('receiverName', user.username);
    localStorage.removeItem('groupId');
    localStorage.removeItem('groupName');
    // loadMessages(user.id, null);
  };

  const selectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedReceiver(null);
    localStorage.setItem('groupId', group.id);
    localStorage.setItem('groupName', group.name);
    localStorage.removeItem('receiverId');
    localStorage.removeItem('receiverName');
    // loadMessages(null, group.id);
  };

//   const loadMessages = async (receiverId, groupId) => {
//     try {
//       const response = await axios.get('/chat/messages', {
//         params: { receiver_id: receiverId, group_id: groupId }
//       });
//       setMessages(response.data);
//     } catch (error) {
//       console.error('Error loading messages:', error);
//     }
//   };

  const sendMessage = async () => {
    if (!selectedReceiver && !selectedGroup) {
      alert('Please select a user or a group to send a message.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/brodcast', {
        username: currentUser.username,
        receiver_id: selectedReceiver?.id || null,
        group_id: selectedGroup?.id || null,
        msg: newMessage
      });

      if (!selectedGroup) {
        addNewMessage({
          sender_id: currentUser.id,
          username: currentUser.username,
          message: newMessage
        });
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container content">
      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
            {users.map(user => (
              <a
                key={user.id}
                href="#"
                className={`list-group-item list-group-item-action ${selectedReceiver?.id === user.id ? 'user-selected' : ''}`}
                onClick={() => selectUser(user)}
              >
                {user.email}
              </a>
            ))}
          </div>
          <div className="list-group" style={{ marginTop: '50px' }}>
            {groups.map(group => (
              <a
                key={group.id}
                href="#"
                className={`list-group-item list-group-item-action ${selectedGroup?.id === group.id ? 'group-selected' : ''}`}
                onClick={() => selectGroup(group)}
              >
                {group.name}
              </a>
            ))}
          </div>
        </div>

        <div className="col-xl-9 col-lg-12 col-md-6 col-sm-12 col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <p className="mb-0">Receiver: {selectedReceiver?.username || selectedGroup?.name || 'None'}</p>
              <p className="mb-0">Sender: {currentUser.username}</p>
            </div>
            <div className="card-body height3">
              <ul className="chat-list" id="chat-section">
                {messages.map((message, index) => (
                  <li key={index} className={message.sender_id === currentUser.id ? 'out' : 'in'}>
                    <div className="chat-img">
                      <img alt="Avatar" width={75} className='rounded-circle' src="https://bootdey.com/img/Content/avatar/avatar1.png" />
                    </div>
                    <div className="chat-body">
                      <div className="chat-message">
                        <h5>{message.sender_name}</h5>
                        <p>{message.message}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="row mt-3 justify-content-between">
            <div className="col-lg-11">
              <input
                type="text"
                className="form-control"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a text message..."
              />
            </div>
            <div className="col-lg-1 justify-content-center">
              <button onClick={sendMessage} className="btn btn-primary rounded w-100">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;