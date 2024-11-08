import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import avatar from '../Image/usuario 1.png'
import axios from 'axios';
import { Modal, Spinner } from 'react-bootstrap';

const Home_contMes = ({ className = "" }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [token] = useState(localStorage.getItem('token'));


  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data)
      setAllUser(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    setIsProcessing(true);
    fetchAllUsers();
    setIsProcessing(false);
  }, [token])

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSendMessage = (event) => {
    if (event.key === 'Enter' && newMessage.trim() !== "") {
      setMessages([...messages, newMessage]);
      setNewMessage("");
    }
  };

  return (
    <div className={`sjcontacts-container ${className}`}>
      {/* chat title */}
      <div className="j-chat-size345 d-flex jchat-padding-1 px-3  m_borbot">
        {/* <svg className=" text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z" clip-rule="evenodd" />
          <path fill-rule="evenodd" d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z" clip-rule="evenodd" />
        </svg> */}
        <h4 className='j-chat-size345 mb-0 ps-2'>Mensajes</h4>
      </div>



      {/* Search Bar */}
      <div className="m_group jay-message-padding mt-2">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mmj_icon"
        >
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
          </g>
        </svg>
        <input
          className="m_input ps-5  "
          type="search"
          placeholder="Buscar"
        />
      </div>

      <div className='j-chat-sidevar-height' style={{ height: "750px", overflowY: "auto" }}>
        {/* Group Chat Header */}
        <div className="sjgroup-chat-header p-3 d-flex justify-content-between align-items-center">
          <div className="sjheader-title">Chat grupal</div>
        </div>

        {/* Contacts List */}
        <div className="sjcontacts-list">
          <div className="sjcontact-item justify-content-between ">
            <div className='d-flex align-items-center'>
              <div className="sjavatar " style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info ms-2">
                <div className="sjcontact-name">Grupo empresa</div>
                <div className="sjcontact-message">Mensajes</div>
              </div>
            </div>
            <div className="chat-circle">
              <p className='mb-0'>4</p>
            </div>
          </div>
        </div>


        <div className="j-chats-meaasges">
          {allUser.map((ele)=>(
             <div className="sjcontacts-list mt-2">
             <div className="sjcontact-item">
               <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                 <div className="sjonline-status"></div>
               </div>
               <div className="sjcontact-info">
                 <div className="sjcontact-name">{ele.name}</div>
                 <div className="sjcontact-message">Escribiendo...</div>
               </div>
             </div>
           </div>
          ))}
          <div className="sjcontacts-list jchat-active mt-4">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Roberta Casas</div>
                <div className="sjcontact-message">Escribiendo...</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Neil Sims</div>
                <div className="sjcontact-message">Hola, ¿Cómo estas?</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Micheal Gough</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Helene Engels</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Helene Engels</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Helene Engels</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Helene Engels</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Helene Engels</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Helene Engels</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Helene Engels</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Helene Engels</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Helene Engels</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Helene Engels</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
          <div className="sjcontacts-list mt-2">
            <div className="sjcontact-item">
              <div className="sjavatar" style={{ backgroundImage: `url(${avatar})` }}>
                <div className="sjonline-status"></div>
              </div>
              <div className="sjcontact-info">
                <div className="sjcontact-name">Helene Engels</div>
                <div className="sjcontact-message">Orden entregada</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* processing */}
      <Modal
        show={isProcessing}
        keyboard={false}
        backdrop={true}
        className="m_modal  m_user "
      >
        <Modal.Body className="text-center">
          <p></p>
          <Spinner animation="border" role="status" style={{ height: '85px', width: '85px', borderWidth: '6px' }} />
          <p className="mt-2">Procesando solicitud...</p>
        </Modal.Body>
      </Modal>

    </div>
  );
};

Home_contMes.propTypes = {
  className: PropTypes.string,
};
export default Home_contMes;
