import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Offcanvas, Toast } from "react-bootstrap";
import { FaUserLarge } from "react-icons/fa6";
import { IoCloudUpload, IoNotifications } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import { useNotifications } from "../contexts/NotificationContext";

export default function Header() {
  const [email] = useState(localStorage.getItem("email"));
  const [role] = useState(localStorage.getItem("role"));
  const [token] = useState(localStorage.getItem("token"));
  const user_id = localStorage.getItem("userId");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [name] = useState(localStorage.getItem("name"));
  const [show, setShow] = useState(false);
  const [showA, setShowA] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const echo = useSocket();
  const { notifications, notificationCount, handleRead } = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState(100);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/', { state: { from: location } });
    }
  }, [token, navigate, location]);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (showA) {
      const timer = setTimeout(() => {
        setShowA(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showA]);

  if (!token) {
    return null;
  }
  if (role == "superadmin") {
    navigate('/enlaceAdmin');
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toggleShowA = () => setShowA(!showA);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/update-user/${user_id}`,
        { activeStatus: "0", name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status == 200) {
        echo.leaveChannel(`chat.${user_id}`);
        ["email", "role", "token", "name", "admin_id", "userId", "tableId", "lastOrder", "countsoup", "tablePayment", "selectedTable", "removedItems"].forEach((item) =>
          localStorage.removeItem(item)
        );
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error updating user status:", error.message);
    }
  };

  const roleTranslations = {
    admin: "Admin",
    cashier: "Cajero",
    waitress: "Garzón",
    kitchen: "Cocina"
  };
  const translatedRole = roleTranslations[role] || role;

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const groupNotificationsByDate = (notifications) => {
    const grouped = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Only process the visible number of notifications
    notifications.slice(0, visibleNotifications).forEach(notification => {
      const notificationDate = new Date(notification.created_at);
      notificationDate.setHours(0, 0, 0, 0);
      const dateKey = notificationDate.getTime();

      let dateString;
      if (notificationDate.getTime() === today.getTime()) {
        dateString = 'Hoy';
      } else if (notificationDate.getTime() === tomorrow.getTime()) {
        dateString = 'Mañana';
      } else {
        dateString = formatDate(notificationDate);
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          dateString: dateString,
          notifications: []
        };
      }
      grouped[dateKey].notifications.push(notification);
    });
    return Object.entries(grouped).sort(([a], [b]) => b - a);
  };

  const handleNotification = () => {
    handleShow();
    setTimeout(() => {
      handleRead();
    }, 300);
  };

  const loadMoreNotifications = () => {
    setVisibleNotifications(prev => prev + 50);
  };

  const hasMoreNotifications = notifications && notifications.length > visibleNotifications;

  return (
    <section className="m_bgblack m_borbot position-sticky top-0 z-3">
      <div className="p-3 d-flex align-items-center justify-content-between">
        <div>
          <img src={require("../Image/logo.png")} alt="" />
        </div>
        <div className="m_header d-flex align-items-center">
          <div className="m_bell position-relative" style={{ cursor: "pointer" }} onClick={handleNotification}>
            <span className="m_grey">
              <IoNotifications />
              {notificationCount > 0 && (
                <span
                  className="position-absolute translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: '0.6rem',
                    padding: '0.25em 0.4em',
                    top: '7px',
                    left: '95%',
                    border: '2px solid #282828',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {notificationCount}
                  <span className="visually-hidden">new notifications</span>
                </span>
              )}
            </span>
          </div>
          <Offcanvas
            className="j-offcanvas-position"
            placement="end"
            show={show}
            onHide={handleClose}
            style={{ width: "34%" }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="text-white">
                <h2 className="j-canvas-title-text mb-0">Notificaciones</h2>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {notifications && groupNotificationsByDate(notifications).map(([dateKey, { dateString, notifications }]) => (
                <React.Fragment key={dateKey}>
                  <p className="j-canvas-text mb-3">{dateString}</p>
                  {notifications.map(notification => (
                    <Link
                      key={notification.id}
                      to={notification.path || `${location.pathname}${location.search}`}
                      state={location.state}
                      className="text-decoration-none"
                    >
                      <div
                        className={`offcanvas-box-1 w-100 mb-3 ${notification.notification_type === "notification" ? "bg-notification" : "bg-alert"}`}
                        style={{ height: "auto" }}
                      >
                        <div className="j-canvas-icon-data mb-2">
                          <svg
                            className="j-canvas-icon-small me-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <h5 className="j-canvas-data-h2 mb-0">
                            {notification.notification_type === "notification" ? "Notificación" : "Alerta"}
                          </h5>
                        </div>
                        <p className="j-canvas-data-p ms-1">{notification.notification}</p>
                        <div className="j-canvas-date-time">
                          <div className="j-time me-4">
                            <svg
                              className="j-date-icon me-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </React.Fragment>
              ))}
              {hasMoreNotifications && (
                <div className="text-center mt-3 mb-3">
                  <Button
                    onClick={loadMoreNotifications}
                    variant="outline-primary"
                    className="w-75"
                  >
                    Cargar más notificaciones
                  </Button>
                </div>
              )}
            </Offcanvas.Body>
          </Offcanvas>

          <Button
            onClick={toggleShowA}
            className={isOnline ? "m_btn toast-button" : "m_btn_red toast-button"}
            style={{ backgroundColor: isOnline ? 'initial' : '' }}
          >
            <span className="fs-4" >
              <IoCloudUpload />
            </span>
            <span style={{ paddingLeft: "3px" }}>{isOnline ? "Sincronizado " : "Sin señal"}</span>
          </Button>

          <Toast
            className={isOnline ? "j-toast-bgcolor" : "j-toast-bgcolor-red"}
            style={{
              position: "fixed",
              top: "85px",
              width: "31%",
              left: "80%",
              transform: "translateX(-50%)"
            }}
            show={showA}
            onClose={toggleShowA}
          >
            <Toast.Header className={`${isOnline ? "j-toast-bgcolor" : "j-toast-bgcolor-red"} border-0`}>
              <span className="">
                <IoCloudUpload className={` ${isOnline ? 'j-toast-size' : 'j-toast-size-red'} `} />
              </span>
              <strong className={`me-auto ${isOnline ? 'j-toast-text' : 'j-toast-text-red'} `}>{isOnline ? 'Datos' : 'Datos sin señal'}</strong>
            </Toast.Header>
            <Toast.Body className={`pt-0 ${isOnline ? 'j-toast-title' : 'j-toast-title-red'} `}>
              {isOnline ? 'Sus datos están sincronizados correctamente con la nube' : 'Sus datos no es están siendo sincronizados'}

            </Toast.Body>
          </Toast>

          <Dropdown>
            <Dropdown.Toggle className="no-caret" id="dropdown-basic">
              <span className="m_grey">
                <FaUserLarge />
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="j-profile-style">
              <Dropdown.Item>
                <div className="d-flex align-items-center">
                  <div className="no-caret2">
                    <span className="m_grey j-chat-fixed">
                      <FaUserLarge />
                    </span>
                  </div>
                  <div className="j-profile-dataa ms-3">
                    <p className="mb-0">{name}</p>
                    <span>{translatedRole}</span>
                  </div>
                </div>
              </Dropdown.Item>
              <Dropdown.Item className="j-profile-email">{email}</Dropdown.Item>
              <Dropdown.Item
                onClick={handleLogout}
                className="j-profile-logout mt-2"
              >
                <svg
                  className="me-1 j-profile-icons"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                  />
                </svg>
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </section>
  );
}