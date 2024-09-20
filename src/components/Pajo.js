import React, { useState } from 'react'
import Header from './Header';
import Sidenav from './Sidenav';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { Tab } from 'bootstrap';
import { Accordion, Tabs } from 'react-bootstrap';
import { CgCalendarDates } from 'react-icons/cg';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import pic1 from '../img/Image.png';
import { FaArrowLeft, FaCircleCheck } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import img1 from '../Image/check-circle.png'
import { FaCalendarAlt } from 'react-icons/fa';


function Pajo() {

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [customerData, setCustomerData] = useState();

  const handleCheckboxChange = (value) => {
    if (selectedCheckboxes.includes(value)) {
      setSelectedCheckboxes((prev) => prev.filter((item) => item !== value));
      setCustomerData();
    } else {
      setSelectedCheckboxes((prev) => [...prev, value]);
    }
  };
  const [cartt, setCart] = useState([
    {
      image1: pic1,
      disc: 'Pollo frito crujiente',
      quantity: 1,
      price: '$10.00',
    },
  ]);

  const [date, setDate] = useState("03/17/2024");
  const [time, setTime] = useState("08:00 am");
  const [name, setName] = useState("Damian Gonzales");
  const [order, setOrder] = useState("0123");
  const [email, setEmail] = useState("ejemplo@gmail.com");


  return (
    <div>
      <Header />
      <div className='d-flex'>
        <div>
          <Sidenav />
        </div>
        <div className='sidebar flex-grow-1 '>

          <div style={{ backgroundColor: "#1F2A37" }} className='pb-3'>
            <div className=''>
              <a to="/" className='d-flex text-decoration-none '  >
                <div className='btn btn-outline-primary text-nowrap py-2 d-flex mt-4 ms-3' style={{ borderRadius: "10px", }}> <FaArrowLeft className='me-2 mt-1' />Regresar</div>
              </a>
            </div>
            <div className='ms-4 mt-4'>
              <h5 className='text-white' style={{ fontSize: "18px" }}>Crear nota de credito</h5>
            </div>
            <div className='ms-4 mt-4'>
              <h5 className='text-white' style={{ fontSize: "18px" }}>DNI: 0123456789</h5>
            </div>
          </div>

          <div className='m-1'>
            <div className='row m-0 text-white '>
              <div className="col-xl-7 col-12 p-2">
                <div className='m_bgblack'>
                  <h5 className='ps-3 py-4'>Listado</h5>

                  <div className="d-flex  justify-content-between pb-4 mx-4">

                    <div className="line123 line22 mt-2 flex-grow-1">

                      <Link to={"/home/client/crear"} className="text-decoration-none px-2 b_text_dark">
                        <FaCircleCheck className="mx-1 mb-1" />
                        <span style={{ fontSize: "16px" }}>Productos</span>
                      </Link>
                    </div>
                    <div className="text-center mt-2">

                      <Link
                        to={"/home/client/pajo"}
                        className="text-decoration-none j-icpn-text-color px-2 b_text_dark"
                      >
                        <FaCircleCheck className="mx-1 mb-1" />
                        <span style={{ fontSize: "16px" }}>Nota de crédito</span>
                      </Link>
                    </div>
                  </div>

                  <div className='p-4 '>
                    <div className='b_bborder' style={{ borderRadius: "10px" }}>
                      <div><h5 className='m-4 mb-0 b_fs pb-2 pt-2'>Tipo de nota de credito</h5></div>
                      {/* <div className='b_bborder m-3 p-4 '>
                        <div><input type="checkbox" className='custom-checkbox' /> <span className='b_fs'>Usar para futura compra</span></div>
                      </div>
                      <div className='b_borderrr mx-3'>
                      </div>
                      <div className='b_bborder m-3 p-4 '>
                        <div><input type="checkbox" className='custom-checkbox' /> <span className='b_fs'>Pago de caja</span></div>
                      </div>
                      <div className='b_bborder d-flex  m-3 p-4 '>
                        <div className='col-4 flex-nowrap'>
                          <p className='mb-0 d-flex align-items-center'>
                            <input type="radio" name="cash" id="" className='jm-radio-radio me-2' /> Efectivo
                          </p>
                        </div>
                        <div className='col-4'>
                          <p className='mb-0 d-flex align-items-center'>
                            <input type="radio" name="cash" id="" className='jm-radio-radio me-2' />Tarjeta de debito
                          </p>
                        </div>
                        <div className='col-4 '>
                          <p className='mb-0 d-flex align-items-center'>
                            <input type="radio" name="cash" id="" className='jm-radio-radio me-2' />Tarjeta de credito
                          </p>
                        </div>

                      </div>
                      <div className='ms-4 b_bborder m-3 p-3'>
                        <div>
                          <h5>Cantidad</h5>
                          <div className="mb-3 b_gray">
                            <input type="text" id="disabledTextInput" disabled className="form-control py-3 mt-3 b_gray" placeholder="$20" style={{ borderRadius: "10px" }} />
                          </div>
                        </div>
                      </div> */}
                      <Accordion className="sj_accordion m-4 mt-2" alwaysOpen>
                        <Accordion.Item eventKey="0" className="mb-2">
                          <Accordion.Header>
                            <div
                              onClick={() => handleCheckboxChange("1")}
                              className={`sj_bg_border px-4 py-2 sj_w-75 ${selectedCheckboxes.includes("1") ? "active" : ""}`}
                            >
                              <input
                                type="checkbox"
                                name="receiptType"
                                value="1"
                                checked={selectedCheckboxes.includes("1")}
                                onChange={() => handleCheckboxChange("1")}
                                className="me-2 j-change-checkbox"
                              />
                              <p className="d-inline px-3 caja-pajo-title">Usar para futura compra</p>
                            </div>
                          </Accordion.Header>
                          {/* <Accordion.Body>
                            <div className='mx-0 b_bborder m-3 p-3'>
                              <div
                                className={`sj_bg_border d-flex px-4 py-2 sj_w-75`}
                              >
                                <div className='me-3'>
                                  <input
                                    type="radio"
                                    name="receiptType"
                                    value="1"
                                    className="me-2 j-radio-checkbox"
                                  />
                                  <p className="d-inline px-3 ps-0">Efectivo</p>
                                </div>
                                <div className='me-3'>
                                  <input
                                    type="radio"
                                    name="receiptType"
                                    value="2"
                                    className="me-2 j-radio-checkbox"
                                  />
                                  <p className="d-inline px-3 ps-0">Tarjeta de debito</p>
                                </div>
                                <div className='me-3'>
                                  <input
                                    type="radio"
                                    name="receiptType"
                                    value="3"
                                    className="me-2 j-radio-checkbox"
                                  />
                                  <p className="d-inline px-3 ps-0">Tarjeta de credito</p>
                                </div>
                              </div>
                              <div className='mt-2'>
                                <h5 className='caja-pajo-text'>Cantidad</h5>
                                <div className="mb-3 b_gray">
                                  <input type="text" id="disabledTextInput" disabled className="form-control mt-2 b_gray" placeholder="$20" style={{ borderRadius: "10px" }} />
                                </div>
                              </div>
                            </div>
                          </Accordion.Body> */}
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="mb-2">
                          <Accordion.Header>
                            <div
                              onClick={() => handleCheckboxChange("2")}
                              className={`sj_bg_border px-4 py-2 sj_w-75 ${selectedCheckboxes.includes("2") ? "active" : ""}`}
                            >
                              <input
                                type="checkbox"
                                name="receiptType"
                                value="2"
                                checked={selectedCheckboxes.includes("2")}
                                onChange={() => handleCheckboxChange("2")}
                                className="me-2 j-change-checkbox"
                              />
                              <p className="d-inline px-3 caja-pajo-title">Pago de caja</p>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className='mx-0 b_bborder m-3 p-3'>
                              <div
                                className={`sj_bg_border d-flex px-4 py-2 sj_w-75`}
                              >
                                <div className='me-3'>
                                  <input
                                    type="radio"
                                    name="receiptType"
                                    value="4"
                                    className="me-2 j-radio-checkbox"
                                  />
                                  <p className="d-inline px-3 ps-0">Efectivo</p>
                                </div>
                                <div className='me-3'>
                                  <input
                                    type="radio"
                                    name="receiptType"
                                    value="5"
                                    className="me-2 j-radio-checkbox"
                                  />
                                  <p className="d-inline px-3 ps-0">Tarjeta de debito</p>
                                </div>
                                <div className='me-3'>
                                  <input
                                    type="radio"
                                    name="receiptType"
                                    value="6"
                                    className="me-2 j-radio-checkbox"
                                  />
                                  <p className="d-inline px-3 ps-0">Tarjeta de credito</p>
                                </div>
                              </div>
                              <div className='mt-2'>
                                <h5 className='caja-pajo-text'>Cantidad</h5>
                                <div className="mb-3 b_gray">
                                  <input type="text" id="disabledTextInput" disabled className="form-control mt-2 b_gray" placeholder="$20" style={{ borderRadius: "10px" }} />
                                </div>
                              </div>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>

                  </div>
                </div>

              </div>

              <div className="col-xl-5 col-12 overflow-hidden possition-sticky mt-2">
                <div className="p-3 m_bgblack text-white ">
                  <p>Resumen</p>
                  <div className="deli_infolist p-2">
                    <div className="d-flex justify-content-end align-items-center " >
                      <div className='d-flex justify-content-end align-items-center me-3 '>
                        <div className='me-2 fs-4'><FaCalendarAlt className='bj-icon-size-change' /></div>
                        <div className='pt-1 bj-delivery-text-3'>{date}</div>
                      </div>
                      <div className="d-flex justify-content-end align-items-center ">
                        <div className="me-2 fs-4 "><MdOutlineAccessTimeFilled /></div>
                        <div className="pt-2 a_time">{time}</div>
                      </div>
                    </div>
                    <div className="fw-bold fs-5">Datos</div>
                    <div className="w-100 mt-4">
                      <div>Nombre</div>
                      <div className="w-100 a_bg_order  mt-2 border-0 " style={{ borderRadius: "10px" }}><span className="">{name}</span></div>
                    </div>
                    <div className="d-flex justify-content-end align-items-center mt-4">
                      <div className="w-50">
                        <div className='mb-2'>DNI</div>
                        <div className="w-75 a_bg_order  border-0 " style={{ borderRadius: "10px" }}><span className="">{order}</span></div>
                      </div>
                      <div className="w-50">
                        <div className='mb-2'>Correo electrónico</div>
                        <div className="w-75 a_bg_order  border-0 overflow-auto" style={{ borderRadius: "10px" }}><span className="">{email}</span></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h5>Productos</h5>
                    </div>
                    <div>
                      {cartt.map((ele, index) => (
                        <div key={index} className="mt-5 mx-1 d-flex justify-content-between">
                          <div>
                            <img src={ele.image1} alt="pic" height={50} width={50} className='rounded-3' />
                            <span className='ms-3'>{ele.disc}</span>
                          </div>
                          <div className="ms-3 mt-2">
                            {ele.quantity}
                          </div>
                          <div className="ms-3 mt-2">
                            {ele.price}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='b_borderrr mx-1 mb-4 mt-3'>
                    </div>
                    <div className="p-4 a_deli_infolist  mt-3">
                      <div className=" a_mar_summary fs-5 fw-bold">Costo total</div>
                      <div className="d-flex justify-content-between align-items-center my-1">
                        <div>Productos</div>
                        <div>$13.00</div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2 my-1">
                        <div>Descuentos</div>
                        <div>$1.00</div>
                      </div>
                      <hr></hr>
                      <div>
                        <div className="d-flex justify-content-between align-items-center my-1  fw-bold">
                          <div>Total</div>
                          <div>$12.00</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className='b_bborder my-3 p-4'>
                        <h5>Tipos de pago</h5>
                        <div className='d-flex justify-content-between'>
                          <div className='mt-3'>Efectivo</div>
                          <div>$6.00</div>
                        </div>
                      </div>
                      <div className='b_bborder my-3 p-4'>
                        <h5>Devolución</h5>
                        <div className='d-flex justify-content-between'>
                          <div className='mt-3'>Cantidad</div>
                          <div className='text-danger'>-$20</div>
                        </div>
                      </div>
                    </div>
                    <div className='mx-5'>
                      <div className="btn btn-primary w-100 my-4    border-0" data-bs-toggle="modal" data-bs-target="#staticBackdrop" style={{ borderRadius: "10px", padding: "8px 12px", backgroundColor: "#147BDE" }}>Devolver</div>
                    </div>

                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="true" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                      <div className="modal-dialog" >
                        <div className="modal-content" style={{ backgroundColor: "#1F2A37" }}>
                          <div className="modal-header border-0">
                            <h5 className="modal-title" id="staticBackdropLabel"></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                          </div>
                          <div className='m-auto '>
                            <img src={img1} height={100} width={100} alt="" />
                          </div>
                          <div className="modal-body  text-center">
                            <h4 className='j-tbl-pop-1 mb-0'>Nota de credito</h4>
                            <p className='j-tbl-pop-2'>Devuelta exitosamente</p>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>






          <div>

          </div>








        </div>
      </div>
    </div>
  )
}

export default Pajo;
