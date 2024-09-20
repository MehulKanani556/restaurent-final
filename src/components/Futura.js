import React, { useState } from 'react'
import Header from './Header';
import Sidenav from './Sidenav';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { CgCalendarDates } from 'react-icons/cg';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import pic1 from '../img/Image.png';
import img1 from '../Image/check-circle.png'
import { FaArrowLeft, FaCircleCheck } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
function Futura() {

    const [cartt, setCart] = useState([
        {
            image1: pic1,
            disc: 'Crispy fried chicken',
            quantity: 1,
            price: '$10.00',
        },
    ]);

    const [date, setDate] = useState("03/17/2024");
    const [time, setTime] = useState("08:00 am");
    const [name, setName] = useState("Damian Gonzales");
    const [order, setOrder] = useState("0123");
    const [email, setEmail] = useState("example@gmail.com");


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

                                            <Link className="text-decoration-none  px-2 b_text_dark">
                                                <FaCircleCheck className="mx-1 mb-1" />
                                                <span style={{ fontSize: "16px" }}>Productos</span>
                                            </Link>
                                        </div>
                                        <div className="text-center mt-2">

                                            <Link
                                                to={"/mostrador"}
                                                className="text-decoration-none j-icpn-text-color px-2 b_text_dark"
                                            >
                                                <FaCircleCheck className="mx-1 mb-1" />
                                                <span style={{ fontSize: "16px" }}>Nota de crédito</span>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className='p-4 '>
                                        <div className='b_bborder' style={{ borderRadius: "10px" }}>
                                            <div><h5 className='m-4 b_fs pb-4 pt-2'>Tipo de nota de credito</h5></div>

                                            <div className='b_bborder m-3 p-3 '>
                                                <div className='py-1'><input type="checkbox" /> <span>Usar para futura compra</span></div>
                                            </div>
                                            <div className='b_borderrr mx-3'>
                                            </div>
                                            <div className='b_bborder m-3 p-3 '>
                                                <div className='py-1'><input type="checkbox" /> <span>Pago caja</span></div>
                                            </div>


                                        </div>

                                    </div>
                                </div>

                            </div>

                            <div className="col-xl-5 col-12 overflow-hidden possition-sticky mt-2">
                                <div className="p-3 m_bgblack text-white ">
                                    <p>Resumen</p>
                                    <div className="deli_infolist p-2">
                                        <div className="d-flex justify-content-end align-items-center " >
                                            <div className="d-flex justify-content-end align-items-center me-3 " >
                                                <div className="me-2 fs-4"><CgCalendarDates /></div>
                                                <div className="pt-2">{date}</div>
                                            </div>
                                            <div className="d-flex justify-content-end align-items-center ">
                                                <div className="me-2 fs-4 "><MdOutlineAccessTimeFilled /></div>
                                                <div className="pt-2 a_time">{time}</div>
                                            </div>
                                        </div>
                                        <div className="fw-bold fs-5">Datos</div>
                                        <div className="w-100 mt-4">
                                            <div>Nombre</div>
                                            <div className="w-100 a_bg_order py-3 mt-2 border-0 " style={{ borderRadius: "10px" }}><span className="ps-3">{name}</span></div>
                                        </div>
                                        <div className="d-flex justify-content-end align-items-center mt-4">
                                            <div className="w-50">
                                                <div>DNI</div>
                                                <div className="w-75 a_bg_order py-3 border-0 " style={{ borderRadius: "10px" }}><span className="ps-3">{order}</span></div>
                                            </div>
                                            <div className="w-50">
                                                <div>Correo electrónico</div>
                                                <div className="w-75 a_bg_order py-3 border-0 overflow-auto" style={{ borderRadius: "10px" }}><span className="ps-3">{email}</span></div>
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
                                            <div className="btn btn-primary w-100 my-4   border-0" data-bs-toggle="modal" data-bs-target="#staticBackdrop" style={{ borderRadius: "10px", padding: "14px", backgroundColor: "#147BDE" }}>Devolver</div>
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
                                                        <h4>Credit Note</h4>
                                                        <p>Successfuly Returned</p>
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

export default Futura;
