import React, { useState } from "react";
import Header from "./Header";
import icon5 from "../Image/icon_6.png";
import home1 from "../Image/home1.svg";
import home2 from "../Image/home2.svg";
import home3 from "../Image/home3.svg";
import { IoMdPrint } from "react-icons/io";
import { Link } from "react-router-dom";
import Sidenav from "./Sidenav";


const Historial = () => {
    const users = [
        { horario: "07/12/2003", cierre: '08:00 am', inicial: '$100', final: '$0', Estado: "Abierta", Acción: "Ver detalles", Imprimir: "" },
        // { id: 2, name: 'Imrudeu', email: 'Bdrospira@gmail.com', role: 'User' }
        { horario: "07/12/2003", cierre: '08:00 am', inicial: '$100', final: '$0', Estado: "Abierta", Acción: "Ver detalles", Imprimir: "" },
        // More users...
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="s_bg_dark">
                <Header />
                <div className="d-flex flex-column flex-lg-row">
                    <div>
                        <Sidenav />
                    </div>
                    <div className="flex-grow-1 sidebar">
                        <div className="py-2 px-2 sjbg_gay sj_border">
                            <button className="sj_btn"><img src={icon5} className="px-2" /> <Link to="/" className="sj_A">Regresar</Link></button>
                            <div className="d-flex justify-content-between text-white sjd-flex pt-4">
                                <p className="mb-0 pt-2">Información caja 1</p>
                                <div className="d-flex justify-content-end gap-3 sjd-flex">
                                    <button type="button" className="sjSky px-2 j-tbl-font-3">
                                        <img src={home3} className="px-2" /> Abrir Caja
                                    </button>
                                    <button

                                        data-bs-theme="dark"
                                        className="j-canvas-btn2 btn bj-btn-outline-primary"

                                    >
                                        <div className="d-flex align-items-center">
                                            <svg className="j-canvas-btn-i" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clipRule="evenodd" />
                                            </svg>
                                            Información mesa
                                        </div>
                                    </button>

                                    <button
                                        data-bs-theme="dark"
                                        className="j-canvas-btn2 j-tbl-font-3  btn bj-btn-outline-primary"
                                    >
                                        <div className="d-flex align-items-center" >
                                            <svg className="j-canvas-btn-i" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clipRule="evenodd" />
                                                <path fillRule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clipRule="evenodd" />
                                            </svg>
                                            Editar
                                        </div>
                                    </button>
                                    <button className="sjredbtn px-2"   >Cerrar caja</button>

                                    {isModalOpen && (
                                        <div className="modal text-white">
                                            <div className="modal-content">
                                                <span className="close" onClick={closeModal}>&times;</span>
                                                <p>Modal Content Goes Here</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div className="sjbg_gay sjm-2">
                            <div className="d-flex justify-content-around  sj_border mx-4 p-2 pb-0">
                                <div>
                                    <p className=" py-2 sj_line mb-0 "><Link to="/caja/informacira" className="sj_textgray text-decoration-none">Historial</Link></p>
                                </div>
                                <div>
                                    <p className=" py-2 sj_line mb-0"><Link to="/caja/historial" className=" text-white text-decoration-none">Información</Link></p>
                                </div>
                                <div>
                                    <p className=" py-2 sj_line mb-0"> <Link to="/caja/movimientos" className="sj_textgray text-decoration-none">Movimientos</Link></p>
                                </div>
                            </div>
                            <div className="text-white px-3 py-3">
                                <div>
                                    <label htmlFor="caja" className="w-50 mx-2">Nombre caja</label>
                                    <label htmlFor="caja" className="ms-2">Fecha creación</label>
                                </div>
                                <br />
                                <div>
                                    <input type="text" className="w-50 ms-2 me-3 sjw-50" value={4} />
                                    <input type="text" className="sjw-full" width={48} value={1} />
                                </div>
                            </div>
                            <div className="text-white px-3 py-2">
                                <div >
                                    <label htmlFor="caja" className="w-50 mx-2">Cuantas aperturas</label>
                                    <label htmlFor="caja" className="ms-2">Cuantos cierres</label>
                                </div>
                                <br />
                                <div>
                                    <input type="text" className="w-50 ms-2 me-3 sjw-50" value={12} />
                                    <input type="text" className="sjw-full" width={48} value={11} />
                                </div>
                            </div>

                            {/* <div className="d-flex justify-content-between px-3  py-3 text-white sjd-flex">
                                <div>
                                    <p className="mb-1">Cantidad de pedidos</p>
                                    <input type="number" value={60} className="sjinput" />
                                </div>
                                <div className="d-flex justify-content-end gap-4">
                                    <div>
                                        <label className="mb-1">Desde</label>
                                        <select className="d-block sjinput">
                                            <option value="0">Enero</option>
                                            <option value="1">Sin seleccionar</option>
                                            <option value="2">Delivery</option>
                                            <option value="3">Local</option>
                                            <option value="3">Retirar</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1">Hasta</label>
                                        <select className="d-block sjinput">
                                            <option value="0">Marzo</option>
                                            <option value="1">Sin seleccionar</option>
                                            <option value="2">Delivery</option>
                                            <option value="3">Local</option>
                                            <option value="3">Retirar</option>
                                        </select>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div className="text-white sj_overflow">
                                <table className="sj_table">
                                    <thead>
                                        <tr className="sjtable_dark">
                                            <th className="p-2">Horario de aperturta</th>
                                            <th>Horario de cierre</th>
                                            <th>Monto inicial</th>
                                            <th>Monto final</th>
                                            <th>Estado</th>
                                            <th>Acción</th>
                                            <th>Imprimir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user} className="sjbordergray">
                                                <td className="p-2">{user.horario}</td>
                                                <td>{user.cierre}</td>
                                                <td>{user.inicial}</td>
                                                <td>{user.final}</td>
                                                <td><button className="sjtableborder">{user.Estado}</button></td>
                                                <td><button className="sjSky px-2">{user.Acción}</button></td>
                                                <td><IoMdPrint className="sjtablewhite" /> {user.Imprimir}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div> */}
                        </div>
                    </div>
                </div>
                {/* <div>
                    {isModalOpen && (
                        <div className="modal text-white bg-warning">
                            <div className="modal-content">
                                <span className="close" onClick={closeModal}>&times;</span>
                                <p>Modal Content Goes Here</p>
                            </div>
                        </div>
                    )}
                </div> */}
            </div>

        </>
    )
}
export default Historial;