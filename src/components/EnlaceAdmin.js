import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const EnlaceAdmin = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailSession, setEmailSession] = useState(localStorage.getItem("email"));
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [errors, setErrors] = useState({});

  // Fetch email session on component mount
  useEffect(() => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    setEmailSession(email);
    if (role === "superadmin") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  // Clear errors when input changes
  useEffect(() => {
    setErrors(prev => ({ ...prev, name: "" }));
  }, [name]);

  useEffect(() => {
    setErrors(prev => ({ ...prev, email: "" }));
  }, [email]);

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!emailSession) {
      navigate("/", { state: { from: location } });
    }
  }, [emailSession, navigate, location]);

  if (!emailSession) {
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    if (!email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El correo electrónico no es válido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsProcessing(true);

      try {
        const response = await axios.post(`${apiUrl}/auth/invite`, {
          role_id: 1,
          name: name,
          email: email
        });
        if (response.status === 200 || response.status === 201) {
          setSuccessMessage("Invitación enviada exitosamente");
          setShowSuccessModal(true);
          setName("");
          setEmail("");
          setIsProcessing(false);
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 2000);
        } else {
          setErrorMessage("Error al enviar la invitación");
          setIsProcessing(false);
          setShowModal(true);
        }
      } catch (error) {
        console.error(
          "Error sending invitation:",
          error.response ? error.response.data : error.message
        );
        setErrorMessage("Error al enviar la invitación");
        setShowModal(true);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-content-center flex-wrap" style={{ height: "100vh" }}>
      <div className="text-white d-flex justify-content-center align-content-center">
        <div>
          {isAuthorized ? (
            <>
              <div className="text-center">
                <img src={require("../Image/Group.png")} alt="" />
              </div>
              <div className="rounded-4" style={{ marginTop: "40px", backgroundColor: "#1F2A37", maxWidth: "490px" }}>
                <div className="p-4">
                  <div className="">
                    <h3 className="fw-semibold">Enlace de invitación</h3>
                    <p className="m18 fw-medium">Llena tus datos de cuenta para ingresar</p>
                    <p className="m18 fw-medium opacity-50">Rol: Admin</p>
                  </div>
                  <div className="mt-4">
                    <div>
                      <div className="mb-3 m14">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                          Nombre
                        </label>
                        <div className="m_group" style={{ maxWidth: "360px" }}>
                          <svg className="m_icon" viewBox="0 0 12 16">
                            <path
                              d="M9.65385 3.78947C9.65385 5.56399 8.06216 7.07895 6 7.07895C3.93784 7.07895 2.34615 5.56399 2.34615 3.78947C2.34615 2.01496 3.93784 0.5 6 0.5C8.06216 0.5 9.65385 2.01496 9.65385 3.78947ZM1.69041 10.0251C2.45925 9.32375 3.51068 8.92226 4.61593 8.92105H7.38407C8.48932 8.92226 9.54075 9.32375 10.3096 10.0251C11.0769 10.7252 11.4987 11.6639 11.5 12.6322V15.1579C11.5 15.233 11.4677 15.3155 11.3927 15.384C11.3161 15.4538 11.2032 15.5 11.0769 15.5H0.923077C0.796811 15.5 0.683908 15.4538 0.607344 15.384C0.532311 15.3155 0.5 15.233 0.5 15.1579V12.6319C0.50136 11.6637 0.923181 10.7251 1.69041 10.0251Z"
                              fill="#9CA3AF"
                              stroke="#9CA3AF"
                            />
                          </svg>

                          <input
                            className="m_input w-100"
                            type="text"
                            placeholder="_"
                            id="exampleFormControlInput1"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ paddingLeft: "40px" }}
                          />
                        </div>
                        {errors.name && <div className="text-danger errormessage">{errors.name}</div>}
                      </div>
                      <div className="mb-3 m14">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                          Correo
                        </label>
                        <div className="m_group" style={{ maxWidth: "360px" }}>
                          <svg width="16" height="16" className="m_icon" viewBox="0 0 16 16">
                            <path
                              d="M9.30377 10.3787L9.31474 10.3704L9.32522 10.3614L15.5 5.07365V12.4C15.5 12.6917 15.3841 12.9715 15.1778 13.1778C14.9715 13.3841 14.6917 13.5 14.4 13.5H1.6C1.30826 13.5 1.02847 13.3841 0.822183 13.1778C0.615892 12.9715 0.5 12.6917 0.5 12.4V5.07337L6.71405 10.3926L6.72611 10.403L6.73879 10.4125C7.09877 10.683 7.53711 10.8289 7.98742 10.828L7.98922 10.828C8.46462 10.8253 8.92617 10.6676 9.30377 10.3787ZM14.5019 2.50551L8 8.07294L1.49812 2.50551C1.53229 2.50205 1.56673 2.5002 1.60132 2.5H14.3987C14.4333 2.5002 14.4677 2.50205 14.5019 2.50551Z"
                              fill="#9CA3AF"
                              stroke="#9CA3AF"
                            />
                          </svg>

                          <input
                            className="m_input"
                            type="text"
                            placeholder="_"
                            id="exampleFormControlInput1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ paddingLeft: "40px" }}
                          />
                        </div>
                        {errors.email && <div className="text-danger errormessage">{errors.email}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 d-flex gap-3" style={{ maxWidth: "340px" }}>
                    
                  <div className="btn w-100 bj-btn-outline-primary m14" onClick={() =>{navigate('/dashboard')}}>
                    
                      <FaArrowLeft className="" /> {" "}Regreaser
                   
                    </div>
                    <Button className="w-100" onClick={handleSubmit}>
                      Aceptar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="m12 text-white fw-medium text-center">
                  <span>
                    <a href="#" className="text-white text-decoration-underline">
                      Términos y Condiciones
                    </a>
                  </span>
                  <span className="mx-2">/</span>
                  <span>
                    <a href="#" className="text-white text-decoration-underline">
                      Políticas de privacidad
                    </a>
                  </span>
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
                          data-original="#bcc0c4"
                          className
                        />
                        <path
                          d="M164.998 70c-11.026 0-19.996 8.976-19.996 20.009 0 11.023 8.97 19.991 19.996 19.991 11.026 0 19.996-8.968 19.996-19.991 0-11.033-8.97-20.009-19.996-20.009zM165 140c-8.284 0-15 6.716-15 15v90c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15v-90c0-8.284-6.716-15-15-15z"
                          fill="#f05151"
                          opacity={1}
                          data-original="#bcc0c4"
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
              <Modal
                show={isProcessing}
                keyboard={false}
                backdrop={true}
                className="m_modal m_loginpop"
              >
                <Modal.Body className="text-center">
                  <p></p>
                  <Spinner animation="border" role="status" style={{ height: '85px', width: '85px', borderWidth: '6px' }} />
                  <p className="mt-2">Procesando solicitud...</p>
                </Modal.Body>
              </Modal>
            </>
          ) : (
            <div className="text-center text-white p-4 rounded-4" style={{ backgroundColor: "#1F2A37", maxWidth: "400px" }}>
          
             <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width={85}height={85} x={0} y={0} viewBox="0 0 24 24" style={{enableBackground: 'new 0 0 512 512'}} xmlSpace="preserve" className><g><circle cx={8} cy={4} r={4} fill="#bcc0c4" opacity={1} data-original="#bcc0c4" className /><path d="M14.028 10.57A3.964 3.964 0 0 0 12 10H4a4 4 0 0 0-4 4v6h9zM16 9 8 24h16zm0 14a1 1 0 1 1 0-2 1 1 0 1 1 0 2zm0-3a1 1 0 0 1-1-1v-5a1 1 0 1 1 2 0v5a1 1 0 0 1-1 1z" fill="#bcc0c4" opacity={1} data-original="#bcc0c4" className /></g></svg>

              <h2 className="fw-semibold my-3">No autorizado</h2>
              <p className="opacity-75 mb-4">Usted no tiene permiso para acceder a esta página.</p>
              <Link to={'/dashboard'} className="btn btn-outline-light d-inline-flex align-items-center">
                <FaArrowLeft className="me-2" /> Regresar a la página principal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};