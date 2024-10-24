import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button, Dropdown, Offcanvas, Toast } from "react-bootstrap";
import { FaUserLarge } from "react-icons/fa6";
import { IoCloudUpload, IoNotifications } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import useAudioManager from "./audioManager";

export default function Header() {

  const [email] = useState(localStorage.getItem("email"));
  const [role] = useState(localStorage.getItem("role"));
  const [token] = useState(localStorage.getItem("token"));
  const admin_id = localStorage.getItem("admin_id");
  const user_id = localStorage.getItem("userId");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [name] = useState(localStorage.getItem("name"));
  const [show, setShow] = useState(false);
  const [showA, setShowA] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const echo = useSocket();
  const { playNotificationSound } = useAudioManager();
  const [prevNotificationCount, setPrevNotificationCount] = useState(() => {
    return parseInt(sessionStorage.getItem('prevNotificationCount') || '0');
  });
  const [isFetching, setIsFetching] = useState(false); // Add a state to track fetching status

  const fetchNotifications = useCallback(async () => {
    if (isFetching) return; // Prevent multiple fetches
    setIsFetching(true); // Set fetching status to true
    try {
      const response = await axios.post(`${apiUrl}/notification/getAll`, { admin_id: admin_id, user_id: user_id }, { headers: { Authorization: `Bearer ${token}` } });
      // console.log(response.data);
      const newCount = response.data.length;
      setNotifications(response.data.reverse());
      setNotificationCount(newCount);

      // Check if the notification count has increased
      if (newCount > prevNotificationCount) {
        // console.log(newCount,prevNotificationCount);
        // playNotificationSound(); // Play sound if count increased
        setPrevNotificationCount(newCount);
        sessionStorage.setItem('prevNotificationCount', newCount.toString());
      }
      // Update previous count
      // console.log(newCount, prevNotificationCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return null;
    } finally {
      setIsFetching(false); // Reset fetching status
    }
  }, [apiUrl, admin_id, user_id, token, prevNotificationCount]);

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
  useEffect(() => {
    fetchNotifications();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/', { state: { from: location } });
    }
  }, [token, navigate, location]);


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
      const responce = await axios.post(
        `${apiUrl}/update-user/${user_id}`,
        {
          activeStatus: "0",
          name: name,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (responce.status == 200) {
        echo.leaveChannel(`chat.${user_id}`);
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        window.location.href = "/";
      }
    } catch (error) {
      console.log("not updating user", + error.message);
    }
  };
  const roleTranslations = {
    admin: "Admin",
    cashier: "Cajero",
    waitress: "Garzón",
    kitchen: "Cocina"
  };
  const translatedRole = roleTranslations[role] || role;

  // Function to format date as DD/MM/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  // New function to group notifications by date
  const groupNotificationsByDate = (notifications) => {
    const grouped = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight for date comparison
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    notifications.forEach(notification => {
      const notificationDate = new Date(notification.created_at);
      notificationDate.setHours(0, 0, 0, 0); // Set to midnight for comparison
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
    return Object.entries(grouped).sort(([a], [b]) => b - a); // Sort by date, most recent first
  };
// console.log(location.pathname+location.search,location.state,location)
  return (
    <section className="m_bgblack m_borbot position-sticky top-0 z-3">
      <div className=" p-3 d-flex align-items-center justify-content-between ">
        <div>
          <img src={require("../Image/logo.png")} alt="" />
        </div>
        <div className="m_header d-flex align-items-center ">
          <div className="m_bell position-relative">
            <span
              className="m_grey"
              onClick={handleShow}
              style={{ cursor: "pointer" }}
            >
              <IoNotifications />
              {notificationCount > 0 && (
                <span
                  className="position-absolute translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: '0.6rem',
                    padding: '0.25em 0.4em',
                    top: '7px',
                    right: '-15px',
                    border: '2px solid #282828', // Adjust the color to match your background
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {notificationCount}
                  <span className="visually-hidden">unread notifications</span>
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
                <h2 className="j-canvas-title-text mb-0 ">Notificaciones</h2>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {notifications && groupNotificationsByDate(notifications).map(([dateKey, { dateString, notifications }]) => (
                <React.Fragment key={dateKey}>
                  <p className="j-canvas-text mb-3">{dateString}</p>
                  {notifications.map(notification => (
                    <div
                      className={`offcanvas-box-1 mb-3 ${notification.notification_type === "notification" ? "bg-notification" : "bg-alert"}`}
                      style={{ height: "auto" }}
                      key={notification.id}
                    >
                      <Link to={notification.path || `${location.pathname}${location.search}`} state={location.state} className="text-decoration-none">

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
                          <h5 className="j-canvas-data-h2 mb-0">{notification.notification_type == "notification" ? "Notificación" : "Alerta"}</h5>

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
                      </Link>

                    </div>
                  ))}
                </React.Fragment>
              ))}
            </Offcanvas.Body>
          </Offcanvas>

          <Button onClick={toggleShowA} className="m_btn toast-button">
            <span className="fs-4">
              <IoCloudUpload />
            </span>
            <span style={{ paddingLeft: "3px" }}>Sincronizado</span>
          </Button>

          <Toast
            className="j-toast-bgcolor"
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
            <Toast.Header className="j-toast-bgcolor border-0">
              <span className="">
                <IoCloudUpload className="j-toast-size " />
              </span>
              <strong className="me-auto j-toast-text">Datos</strong>
            </Toast.Header>
            <Toast.Body className="pt-0 j-toast-title">
              Sus datos están sincronizados correctamente con la nube
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
                  class="me-1 j-profile-icons"
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
