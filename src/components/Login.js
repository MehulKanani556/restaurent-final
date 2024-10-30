import React, { useState, useEffect, useRef } from "react";
// import login from "../Image/login.jpg";
import login from "../Image/loginLarge1.jpeg";
import loginlarge from "../Image/login_n1.png";
import { IoMdLock, IoMdMail } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../Image/Group.png";
import { Modal } from "react-bootstrap";
//import { enqueueSnackbar  } from "notistack";
import useAudioManager from "./audioManager";
import useSocket from "../hooks/useSocket";
import { useNotifications } from "../contexts/NotificationContext";

const Login = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [notificationMessage, setNotificationMessage] = useState([]);
  const { playNotificationSound } = useAudioManager();
  const echo = useSocket();
  const { updateToken } = useNotifications(); // Use the context

  const location = useLocation();
 
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prevErrors => ({ ...prevErrors, email: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prevErrors => ({ ...prevErrors, password: '' }));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1441) {
        setImageSrc(login);
      } else if (window.innerWidth >= 1441) {
        setImageSrc(loginlarge);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = "El correo es requerido";
    } else if (!emailRegex.test(email)) {
      errors.email = "El correo no es válido";
    }

    if (!password) {
      errors.password = "La contraseña es requerida";
    }

    return errors;
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password
      });
      if (response.data.access_token) {
        const { email, name, access_token, role, id, admin_id } = response.data;
        localStorage.setItem("email", email);
        localStorage.setItem("name", name);
        localStorage.setItem("token", access_token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", id);
        localStorage.setItem("admin_id", admin_id || id);
        setSuccessMessage("iniciar sesión exitosamente");
        setShowSuccessModal(true);
        updateActiveStatus(id,name,email,access_token);
        updateToken(access_token)
        // Play notification sound
        // playNotificationSound();;

        if(role=="superadmin"){
          setShowSuccessModal(false);
          navigate('/enlaceAdmin');
        }

        setTimeout(() => {
          setShowSuccessModal(false);
          const redirectPath = location?.state?.from || '/dashboard';
          navigate(redirectPath);
        }, 2000);
      } else {
        setErrorMessage(response?.data?.message || "Credenciales inválidas")
    
        setShowModal(true);
      }
    } catch (error) {      
      setErrorMessage(error.response?.data?.message || "An error occurred");
      // playNotificationSound();;
      setShowModal(true);
    }
  };
  const updateActiveStatus = async (id, name, email, access_token) => {
    try {
      const responce = await axios.post(
        `${apiUrl}/update-user/${id}`,
        {
          activeStatus: "1",
          name: name,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      console.log(responce);
      socket();
      fetchAllUsers(access_token);
      // setupEchoListeners(userId);
    } catch (error) {
      console.log("not updating user", + error.message);
    }
  }
  
  const socket = (id) => {
    setupEchoListeners(id);
    // console.log("QWQW");
    return () => {
      if (echo) {
        // console.log("SS");
        echo.leaveChannel(`chat.${id}`);
      }
    };
  }
  const setupEchoListeners = (id) => {
    if (echo) {
      // echo.channel(`chat.${selectedContact?.id}.${userId}`)
      echo.channel(`chat.${id}`)
        .listen('Chat', (data) => {
          console.log("chat message received", data);
          // fetchAllUsers();
          // fetchMessages();
        });
    }
  };
  const fetchAllUsers = async (access_token) => {
    try {
      const response = await axios.get(`${apiUrl}/chat/user`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      console.log(response.data.users);
      // setAllUser(response.data.users);
      // setGroups(response.data.groups);
      // setgroupChats(response.data.groupChats);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      // setIsProcessing(false);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      handleLogin();
    }
  };
  useEffect(() => {
    if (showModal) {
      setTimeout(() => setShowModal(false), 2000);
    }
  }, [showModal]);
  return (
    <div>
      <div className="j-login-page">
        <div className="login-container">
          <div className="row j-row-width">
            <div className="col-6  login-img-col">
              <div className="login-img position-relative">
                <div className="a_loginImg">
                  <img src={imageSrc} alt="login" />
                </div>
                <img src={logo} alt="login" className="logo_position" />
              </div>
            </div>
            <div className="col-6 j-form-center">
              <div className="login-form">
                <form onSubmit={handleSubmit}>
                  <div className="j-form-head">
                    <h2 className="text-white">Bienvenido a Cypro</h2>
                    <p className="text-white">
                      Llena tus datos de cuenta para ingresar
                    </p>
                  </div>
                  <div className="j-form-body">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label text-white">
                        Correo
                      </label>
                      <div className="icon-input">
                        <IoMdMail className="i" />
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Escribir . . ."
                          value={email}
                          onChange={handleEmailChange}
                        />
                      </div>
                      {errors.email && (
                        <div className="text-danger">{errors.email}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="password"
                        className="form-label text-white"
                      >
                        Contraseña
                      </label>
                      <div className="icon-input">
                        <IoMdLock className="i" />
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="password"
                          placeholder="Escribir . . ."
                          value={password}
                          onChange={handlePasswordChange}
                        />

                        <button
                          type="button"
                          className="border-0 bg-transparent"
                          onClick={() =>
                            setShowPassword((prevState) => !prevState)}
                        >
                          {showPassword ? (
                            <FaEye className="i" />
                          ) : (
                            <FaEyeSlash className="i" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <div className="text-danger">{errors.password}</div>
                      )}
                    </div>

                    <button type="submit" className="j-login-btn text-white">
                      Ingresar
                    </button>
                  </div>
                </form>

                <div className="j-login-last text-white text-center">
                  <a href="" className="me-2">
                    <span>Términos y Condiciones</span>{" "}
                  </a>
                  /
                  <a href="" className="ms-2">
                    <span>Políticas de privacidad</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop={true}
        keyboard={false}
        className="m_modal m_loginpop"
      >
        <Modal.Header closeButton className="border-0" />
        <Modal.Body>
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width={85}
              height={85}
              x={0}
              y={0}
              viewBox="0 0 330 330"
              style={{ enableBackground: "new 0 0 512 512" }}
              xmlSpace="preserve"
              className
            >
              <g>
                <path
                  d="M165 0C74.019 0 0 74.02 0 165.001 0 255.982 74.019 330 165 330s165-74.018 165-164.999S255.981 0 165 0zm0 300c-74.44 0-135-60.56-135-134.999S90.56 30 165 30s135 60.562 135 135.001C300 239.44 239.439 300 165 300z"
                  fill="#f05151"
                  opacity={1}
                  data-original="#000000"
                  className
                />
                <path
                  d="M164.998 70c-11.026 0-19.996 8.976-19.996 20.009 0 11.023 8.97 19.991 19.996 19.991 11.026 0 19.996-8.968 19.996-19.991 0-11.033-8.97-20.009-19.996-20.009zM165 140c-8.284 0-15 6.716-15 15v90c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15v-90c0-8.284-6.716-15-15-15z"
                  fill="#f05151"
                  opacity={1}
                  data-original="#000000"
                  className
                />
              </g>
            </svg>

            <p className="mb-0 mt-3 h6">{errorMessage}</p>
            <p className="opacity-75" />
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        backdrop={true}
        keyboard={false}
        className="m_modal m_loginpop"
      >
        <Modal.Header closeButton className="border-0" />
        <Modal.Body>
          <div className="text-center">
            <img src={require("../Image/check-circle.png")} alt="" />
            <p className="mb-0 mt-2 h6">{successMessage}</p>
            <p className="opacity-75" />
          </div>
        </Modal.Body>
      </Modal>
      {/* <audio ref={notificationSound} src={require("../Image/notification-sound.mp3")} /> */}
    </div>
  );
};

export default Login;