import React, { useEffect, useState } from "react";
import { Button, Dropdown, Offcanvas, Toast } from "react-bootstrap";
import { FaUserLarge } from "react-icons/fa6";
import { IoCloudUpload, IoNotifications } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {

  const [email] = useState(sessionStorage.getItem("email"));
  const [role] = useState(sessionStorage.getItem("role"));
  const [token] = useState(sessionStorage.getItem("token"));

  const [name] = useState(sessionStorage.getItem("name"));
  const [show, setShow] = useState(false);
  const [showA, setShowA] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate('/', { state: { from: location } });
    }
  }, [token, navigate, location]);
  if (!token) {
    return null;
  }


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const toggleShowA = () => setShowA(!showA);
  const handleLogout = () => {
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("name");
    window.location.href = "/";
  };
  const roleTranslations = {
    admin: "Admin",
    cashier: "Cajero",
    waitress: "Garzón",
    kitchen: "Cocina"
  };
  const translatedRole = roleTranslations[role] || role;
  return (
    <section className="m_bgblack m_borbot position-sticky top-0 z-3">
      <div className=" p-3 d-flex align-items-center justify-content-between ">
        <div>
          <img src={require("../Image/logo.png")} alt="" />
        </div>
        <div className="m_header d-flex align-items-center ">
          <div className="m_bell">
            <span
              className="m_grey "
              onClick={handleShow}
              style={{ cursor: "pointer" }}
            >
              <IoNotifications />
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
              <p className="j-canvas-text">Hoy</p>
              <div className="offcanvas-box-1 mb-3">
                <div className="j-canvas-icon-data mb-2">
                  <svg
                    class="j-canvas-icon-small me-1"
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
                  <h5 className="j-canvas-data-h2 mb-0">Pedido actulizado</h5>
                </div>
                <p className="j-canvas-data-p ms-1">
                  El pedido de la mesa 4, con el codigo 0123 a sido actualizado
                  exitosamente
                </p>
                <div className="j-canvas-date-time">
                  <div className="j-time me-4">
                    <svg
                      class="j-date-icon me-1"
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
                    hace 5 min
                  </div>
                  <div className="j-time">
                    <svg
                      class="j-date-icon me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 5V4a1 1 0 1 1 2 0v1h3V4a1 1 0 1 1 2 0v1h3V4a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v2H3V7a2 2 0 0 1 2-2h1ZM3 19v-8h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm5-6a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    23/032024
                  </div>
                </div>
                <div className="j-canvas-var-button mt-2">
                  <button>
                    <svg
                      class="j-data-icon3 me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Ver cambio
                  </button>
                </div>
              </div>
              <div className="offcanvas-box-1 mb-3">
                <div className="j-canvas-icon-data mb-2">
                  <svg
                    class="j-canvas-icon-small me-1"
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
                  <h5 className="j-canvas-data-h2 mb-0">Pedido actulizado</h5>
                </div>
                <p className="j-canvas-data-p ms-1">
                  El pedido de la mesa 4, con el codigo 0123 a sido actualizado
                  exitosamente
                </p>
                <div className="j-canvas-date-time">
                  <div className="j-time me-4">
                    <svg
                      class="j-date-icon me-1"
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
                    hace 5 min
                  </div>
                </div>
                <div className="j-canvas-var-button mt-2">
                  <button>
                    <svg
                      class="j-data-icon3 me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Ver cambio
                  </button>
                </div>
              </div>
              <div className="offcanvas-box-2 mb-3">
                <div className="j-canvas-icon-data text-white mb-2">
                  <svg
                    class="j-canvas-icon-small me-1"
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
                  <h5 className="j-canvas-data-h2  mb-0">Pedido actulizado</h5>
                </div>
                <p className="j-canvas-data-p ms-1 text-white">
                  El pedido de la mesa 4, con el codigo 0123 a sido actualizado
                  exitosamente
                </p>
                <div className="j-canvas-date-time-3">
                  <div className="j-time-3 me-4">
                    <svg
                      class="j-date-icon me-1"
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
                    hace 5 min
                  </div>
                </div>
                <div className="j-canvas-var-button mt-2">
                  <button>
                    <svg
                      class="j-data-icon3 me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Ver cambio
                  </button>
                </div>
              </div>

              <p className="j-canvas-text mb-3">Ayer</p>

              <div className="offcanvas-box-2 mb-3">
                <div className="j-canvas-icon-data text-white mb-2">
                  <svg
                    class="j-canvas-icon-small me-1"
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
                  <h5 className="j-canvas-data-h2  mb-0">Pedido actulizado</h5>
                </div>
                <p className="j-canvas-data-p ms-1 text-white">
                  El pedido de la mesa 4, con el codigo 0123 a sido actualizado
                  exitosamente
                </p>
                <div className="j-canvas-date-time-3">
                  <div className="j-time-3 me-4">
                    <svg
                      class="j-date-icon me-1"
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
                    hace 5 min
                  </div>
                </div>
                <div className="j-canvas-var-button mt-2">
                  <button>
                    <svg
                      class="j-data-icon3 me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Ver cambio
                  </button>
                </div>
              </div>

              <div className="offcanvas-box-2 mb-3">
                <div className="j-canvas-icon-data text-white mb-2">
                  <svg
                    class="j-canvas-icon-small me-1"
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
                  <h5 className="j-canvas-data-h2  mb-0">Pedido actulizado</h5>
                </div>
                <p className="j-canvas-data-p ms-1 text-white">
                  El pedido de la mesa 4, con el codigo 0123 a sido actualizado
                  exitosamente
                </p>
                <div className="j-canvas-date-time-3">
                  <div className="j-time-3 me-4">
                    <svg
                      class="j-date-icon me-1"
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
                    hace 5 min
                  </div>
                </div>
                <div className="j-canvas-var-button mt-2">
                  <button>
                    <svg
                      class="j-data-icon3 me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Ver cambio
                  </button>
                </div>
              </div>
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
