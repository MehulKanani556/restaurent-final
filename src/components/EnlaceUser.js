import React from "react";
import { Button } from "react-bootstrap";

export const EnlaceUser = () => {
  return (
    <div
      className="d-flex justify-content-center align-content-center flex-wrap "
      style={{ height: "100vh" }}
    >
      <div className="text-white d-flex justify-content-center align-content-center">
        <div >
          <div className="text-center">
            <img src={require("../Image/Group.png")} alt="" />
          </div>
          <div
            className="rounded-4 "
            style={{ marginTop: "40px", backgroundColor: "#1F2A37", maxWidth: '490px' }}
          >
            <div className="p-4">
              <div className="">
                <h3 className="fw-semibold">Enlace de invitación</h3>
                <p className="m18 fw-medium">
                  {" "}
                  Llena tus datos de cuenta para ingresar
                </p>
                <p className="m18 fw-medium opacity-50">Rol: Cocina </p>
              </div>
              <div className="mt-4">
                <div>
                  <div className="mb-3 m14 ">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Nombre
                    </label>
                    <div className="m_group " style={{ maxWidth: "360px" }}>
                      <svg className="m_icon" viewBox="0 0 12 16">
                        <path
                          d="M9.65385 3.78947C9.65385 5.56399 8.06216 7.07895 6 7.07895C3.93784 7.07895 2.34615 5.56399 2.34615 3.78947C2.34615 2.01496 3.93784 0.5 6 0.5C8.06216 0.5 9.65385 2.01496 9.65385 3.78947ZM1.69041 10.0251C2.45925 9.32375 3.51068 8.92226 4.61593 8.92105H7.38407C8.48932 8.92226 9.54075 9.32375 10.3096 10.0251C11.0769 10.7252 11.4987 11.6639 11.5 12.6322V15.1579C11.5 15.233 11.4677 15.3155 11.3927 15.384C11.3161 15.4538 11.2032 15.5 11.0769 15.5H0.923077C0.796811 15.5 0.683908 15.4538 0.607344 15.384C0.532311 15.3155 0.5 15.233 0.5 15.1579V12.6319C0.50136 11.6637 0.923181 10.7251 1.69041 10.0251Z"
                          fill="#9CA3AF"
                          stroke="#9CA3AF"
                        />
                      </svg>

                      <input
                        className=" m_input w-100"
                        type="text"
                        placeholder="_"
                        id="exampleFormControlInput1"
                      />
                    </div>
                  </div>
                  <div className="mb-3 m14 ">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Correo
                    </label>
                    <div className="m_group " style={{ maxWidth: '360px' }}>
                      <svg
                        width="16"
                        height="16"
                        className="m_icon"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M9.30377 10.3787L9.31474 10.3704L9.32522 10.3614L15.5 5.07365V12.4C15.5 12.6917 15.3841 12.9715 15.1778 13.1778C14.9715 13.3841 14.6917 13.5 14.4 13.5H1.6C1.30826 13.5 1.02847 13.3841 0.822183 13.1778C0.615892 12.9715 0.5 12.6917 0.5 12.4V5.07337L6.71405 10.3926L6.72611 10.403L6.73879 10.4125C7.09877 10.683 7.53711 10.8289 7.98742 10.828L7.98922 10.828C8.46462 10.8253 8.92617 10.6676 9.30377 10.3787ZM14.5019 2.50551L8 8.07294L1.49812 2.50551C1.53229 2.50205 1.56673 2.5002 1.60132 2.5H14.3987C14.4333 2.5002 14.4677 2.50205 14.5019 2.50551Z"
                          fill="#9CA3AF"
                          stroke="#9CA3AF"
                        />
                      </svg>

                      <input
                        className=" m_input"
                        type="text"
                        placeholder="_"
                        id="exampleFormControlInput1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 " style={{ maxWidth: "340px" }}>
                <Button className="w-100">Aceptar </Button>
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
        </div>
      </div>
    </div>
  );
};
