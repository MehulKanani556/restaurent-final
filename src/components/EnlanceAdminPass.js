import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoMdLock } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

export const EnlanceAdminPass = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [pass, setPass] = useState("");
  const [conPass, setConPass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  // Clear errors when input changes
  useEffect(
    () => {
      setErrors((prev) => ({ ...prev, pass: "" }));
    },
    [pass]
  );

  useEffect(
    () => {
      setErrors((prev) => ({ ...prev, conPass: "" }));
    },
    [conPass]
  );

  const validatePass = () => {
    if (pass.length < 8) {
      setErrors(prev => ({ ...prev, pass: "La contraseña debe tener al menos 8 caracteres" }));
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      setErrors(prev => ({ ...prev, pass: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial" }));
      return false;
    }

    setErrors(prev => ({ ...prev, pass: "" }));
    return true;
  };
  const validateConPass = () => {
    if (pass !== conPass) {
      setErrors(prev => ({ ...prev, conPass: "Las contraseñas no coinciden" }));
      return false;
    }

    setErrors(prev => ({ ...prev, conPass: "" }));
    return true;
  };

  const validatePassword = () => {
    const isPassValid = validatePass();
    const isConPassValid = validateConPass();
    return isPassValid && isConPassValid;
  };

  const handleSubmit = async () => {

    if (validatePassword()) {
      try {
        const response = await axios.post(`${apiUrl}/set-password/${id}`, {
          password: pass,

        });
        if (response.data.success) {
          setSuccessMessage("Contraseña establecida con éxito");
          setShowSuccessModal(true);
          setPass("");
          setConPass("");
          // Set a timeout to close the modal and navigate after 2 seconds
          setTimeout(() => {
            setShowSuccessModal(false);
            navigate("/");
          }, 2000);
        } else {
          setErrorMessage(response.data.message || "Credenciales inválidas");

          setShowModal(true);
        }
      } catch (error) {
        console.error(
          "Error adding note:",
          error.response ? error.response.data : error.message
        );
        setErrorMessage(
          error.response && error.response.data.message
            ? error.response.data.message
            : "Error al configurar la contraseña. Por favor, inténtelo de nuevo."
        );
        setShowModal(true);
      }
      finally {
        setPass("");
        setConPass("");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-content-center flex-wrap "
      style={{ height: "100vh" }}
    >
      <div className="text-white d-flex justify-content-center align-content-center">
        <div>
          <div className="text-center">
            <img src={require("../Image/Group.png")} alt="" />
          </div>
          <div
            className="rounded-4 "
            style={{
              marginTop: "40px",
              backgroundColor: "#1F2A37",
              maxWidth: "490px"
            }}
          >
            <div className="p-4">
              <div className="">
                <h3 className="fw-semibold">Enlace de invitación</h3>
                <p className="m18 fw-medium">
                  {" "}
                  Llena tus datos de cuenta para ingresar
                </p>
                <p className="m18 fw-medium opacity-50">Rol: Admin</p>
              </div>
              <div className="mt-4">
                <div>
                  <div className="mb-3 m14 ">
                    <label
                      htmlFor="password"
                      className="form-label  text-white"
                    >
                      Contraseña
                    </label>
                    <div className="m_group " style={{ maxWidth: "360px" }}>
                      <div className="icon-input w-100">
                        <IoMdLock className="i m18" style={{ color: "#9ca3af" }} />
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control m_input w-100"
                          id="password"
                          placeholder="Contraseña . . ."
                          value={pass}
                          onChange={(e) => setPass(e.target.value)}
                          onBlur={validatePass}
                          style={{ paddingLeft: '10px' }}
                        />

                        <button
                          type="button"
                          className="border-0 bg-transparent"
                          onClick={() =>
                            setShowPassword((prevState) => !prevState)}
                        >
                          {showPassword ? (
                            <FaEye className="i" style={{ color: "#9ca3af" }} />
                          ) : (
                            <FaEyeSlash
                              className="i"
                              style={{ color: "#9ca3af" }}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.pass && (
                      <div className="text-danger errormessage" style={{ maxWidth: '360px' }}>
                        {errors.pass}
                      </div>
                    )}
                  </div>
                  <div className="mb-3 m14 ">
                    <label
                      htmlFor="conpassword"
                      className="form-label text-white"
                    >
                      Confirmar Contraseña
                    </label>

                    <div className="m_group " style={{ maxWidth: "360px" }}>
                      <div className="icon-input w-100">
                        <IoMdLock className="i m18" style={{ color: "#9ca3af" }} />
                        <input
                          type={showPassword1 ? "text" : "password"}
                          className="form-control m_input w-100"
                          id="conpassword"
                          placeholder="Confirmar Contraseña . . ."
                          value={conPass}
                          onChange={(e) => setConPass(e.target.value)}
                          onBlur={validateConPass}
                          style={{ paddingLeft: '10px' }}

                        />

                        <button
                          type="button"
                          className="border-0 bg-transparent"
                          onClick={() =>
                            setShowPassword1((prevState) => !prevState)}
                        >
                          {showPassword1 ? (
                            <FaEye className="i" style={{ color: "#9ca3af" }} />
                          ) : (
                            <FaEyeSlash
                              className="i"
                              style={{ color: "#9ca3af" }}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.conPass && (
                      <div className="text-danger errormessage" style={{ maxWidth: '360px' }}>
                        {errors.conPass}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 " style={{ maxWidth: "340px" }}>
                <Button className="w-100" onClick={handleSubmit}>
                  Aceptar{" "}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div>
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
          </div>

          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            backdrop={true}
            keyboard={false}
            className="m_modal m_loginpop"
            onShow={() => setTimeout(() => setShowModal(false), 2000)}
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
        </div>
      </div>
    </div>
  );
};
