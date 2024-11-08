import React, { useState } from "react";
import Header from "./Header";
import icon5 from "../Image/icon_6.png";
import home1 from "../Image/home1.svg";
import home2 from "../Image/home2.svg";
import home3 from "../Image/home3.svg";
import { IoMdPrint } from "react-icons/io";
import { Link } from "react-router-dom";
import fing from "../Image/figura.png";
import checkbox from "../Image/checkbox1.png";
import Sidenav from "./Sidenav";


const Movimientos = () => {
    const users = [
        { pedido: "01234", sector: '4', mesa: '1', fecha: "22/03/2024", codigo: "0135", Estado: "Recibido", Acción: "Ver detalles", Imprimir: "" },
        // { id: 2, name: 'Imrudeu', email: 'Bdrospira@gmail.com', role: 'User' }
        // { horario: "07/12/2003", cierre: '08:00 am', inicial: '$100', final: '$0', Estado: "Abierta", Acción: "Ver detalles", Imprimir: "" },
        // More users...
        { pedido: "01234", sector: '4', mesa: '1', fecha: "22/03/2024", codigo: "0135", Estado: "Recibido", Acción: "Ver detalles", Imprimir: "" },
        { pedido: "01234", sector: '4', mesa: '1', fecha: "22/03/2024", codigo: "0135", Estado: "Preparado", Acción: "Ver detalles", Imprimir: "" },
        { pedido: "01234", sector: '4', mesa: '1', fecha: "22/03/2024", codigo: "0135", Estado: "Entregado", Acción: "Ver detalles", Imprimir: "" },
        { pedido: "01234", sector: '4', mesa: '1', fecha: "22/03/2024", codigo: "0135", Estado: "Finalizado", Acción: "Ver detalles", Imprimir: "" },
        { pedido: "01234", sector: '4', mesa: '1', fecha: "22/03/2024", codigo: "0135", Estado: "Preparado", Acción: "Ver detalles", Imprimir: "" },
        { pedido: "01234", sector: '4', mesa: '1', fecha: "22/03/2024", codigo: "0135", Estado: "Recibido", Acción: "Ver detalles", Imprimir: "" },
        { pedido: "01234", sector: '4', mesa: '1', fecha: "22/03/2024", codigo: "0135", Estado: "Finalizado", Acción: "Ver detalles", Imprimir: "" },
        { pedido: "01234", sector: '4', mesa: '1', fecha: "22/03/2024", codigo: "0135", Estado: "Entregado", Acción: "Ver detalles", Imprimir: "" },
        { pedido: "01234", sector: '4', mesa: '1', fecha: "22/03/2024", codigo: "0135", Estado: "Entregado", Acción: "Ver detalles", Imprimir: "" },


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
                        {/* <!-- Button trigger modal --> */}
                        <div className="py-2 px-2 sjbg_gay sj_border">
                            <button className="sj_btn"><img src={icon5} className="px-2" /> <Link to="/" className="sj_A">Regresar</Link></button>
                            <div className="d-flex justify-content-between text-white sjd-flex pt-4">
                                <p className="mb-0 pt-2">Información caja 1</p>
                                <div className="d-flex justify-content-end gap-3 sjd-flex">
                                    <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" className="sjSky px-2 j-tbl-font-3">
                                        <img src={home3} className="px-2" /> Abrir Caja
                                    </button>
                                    <button
                                        data-bs-toggle="modal" data-bs-target="#model1staticBackdrop"
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
                                    <button className="sjredbtn px-2" data-bs-toggle="modal" data-bs-target="#modelstaticBackdrop">Cerrar caja</button>

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
                            <div className="d-flex justify-content-around p-2 pb-0 sj_border mx-4">
                                <div>
                                    <p className=" py-2 sj_line mb-0 "><Link to="/caja/informacira" className="sj_textgray text-decoration-none">Historial</Link></p>
                                </div>
                                <div>
                                    <p className=" py-2 sj_line mb-0"><Link to="/caja/historial" className="sj_textgray  text-decoration-none">Información</Link></p>
                                </div>
                                <div>
                                    <p className=" py-2 sj_line mb-0"> <Link to="/caja/movimientos" className="text-white text-decoration-none">Movimientos</Link></p>
                                </div>
                            </div>
                            <div className="text-white sj_overflow mt-4 py-3">
                                <table className="sj_table">
                                    <thead>
                                        <tr className="sjtable_dark">
                                            <th className="p-3">Pedido</th>
                                            <th>Sector</th>
                                            <th>Mesa</th>
                                            <th>Fecha</th>
                                            <th>Código transacción</th>
                                            <th>Estado</th>
                                            <th>Ver</th>
                                            <th>Imprimir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user} className="sjbordergray">
                                                <td className="p-2 "><button className="sjtablegeern j-tbl-font-3 ">{user.pedido}</button></td>
                                                <td className="j-caja-text-2 ">{user.sector}</td>
                                                <td className="j-caja-text-2 ">{user.mesa}</td>
                                                <td className="j-caja-text-2 ">{user.fecha}</td>
                                                <td className="j-caja-text-2 ">{user.codigo}</td>
                                                <td><button className={`j-btn-caja-final j-tbl-font-3  ${user.Estado === 'Recibido' ? 'b_indigo' : user.Estado === 'Preparado' ? 'b_ora ' : user.Estado === 'Entregado' ? 'b_blue' : user.Estado === 'Finalizado' ? 'b_green' : user.Estado === 'Retirar' ? 'b_indigo' : user.Estado === 'Local' ? 'b_purple' : 'text-danger'}`}>{user.Estado}</button></td>
                                                <td><button className="sjSky px-2 j-tbl-font-3">{user.Acción}</button></td>
                                                <td>
                                                    <svg className={` ${user.Estado === 'Entregado' ? 'sj-button-xise' : 'sjtablewhite'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                        <path fillRule="evenodd" d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z" clipRule="evenodd" />
                                                    </svg> {user.Imprimir}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Modal 1--> */}
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="sjmodel">
                            <div className="modal-header j-caja-border-bottom p-0 m-3 mb-0 pb-3">
                                <h1 className="modal-title j-caja-pop-up-text-1" id="staticBackdropLabel">Abrir caja</h1>
                                <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <label htmlFor="sj" className="j-tbl-font-2 mb-1 mt-0">Monto inicial</label>
                                <input type="text" className="sj_modelinput" value={100} />
                            </div>
                            <div className="modal-footer sjmodenone">
                                {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                                <button type="button" data-bs-toggle="modal" data-bs-target="#sjstaticBackdrop" className="btn j-btn-primary text-white j-tbl-font-2">Abrir caja</button>

                            </div>
                        </div>
                    </div>
                </div>
                {/* sect */}
                {/* <!-- Modal 2--> */}
                <div className="modal fade" id="sjstaticBackdrop" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="sjmode2">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Detalles caja</h1>
                                <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <img src={fing} alt="" />
                                    <p className="d-inline ps-2 sjtext">Caja cerrada</p>
                                </div>
                                <div className="row pt-3">
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="quien-abrio" className="sjtext">Quién abrió caja</label>
                                        <input type="text" id="quien-abrio" className="sj_modelinput mt-2 w-100" placeholder="Daniel Lopez" />
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="quien-cerro" className="sjtext">Quién cerró caja</label>
                                        <input type="text" id="quien-cerro" className="sj_modelinput mt-2 w-100" placeholder="17/03/2024" />
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="fecha-apertura" className="sjtext">Fecha apertura</label>
                                        <input type="text" id="fecha-apertura" className="sj_modelinput mt-2 w-100" placeholder="08:00 am" />
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="hora-apertura" className="sjtext">Hora apertura</label>
                                        <input type="text" id="hora-apertura" className="sj_modelinput mt-2 w-100" placeholder="Damian Gonzales" />
                                    </div>
                                </div>
                                <div className="row pt-3">
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="fecha-cierre" className="sjtext">Fecha cierre</label>
                                        <input type="text" id="fecha-cierre" className="sj_modelinput mt-2 w-100" placeholder="20/03/2024" />
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="hora-cierre" className="sjtext">Hora cierre</label>
                                        <input type="text" id="hora-cierre" className="sj_modelinput mt-2 w-100" placeholder="03:00 pm" />
                                    </div>
                                </div>
                                <div className="row pt-3">
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="monto inicial" className="sjtext">Monto inicial</label>
                                        <input type="text" id="monto inicial" className="sj_modelinput mt-2 w-100" placeholder="$100" />
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="monto final" className="sjtext">Monto final</label>
                                        <input type="text" id="monto final" className="sj_modelinput mt-2 w-100" placeholder="$200" />
                                    </div>
                                </div>
                                <div className="row pt-3">
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="ingreso" className="sjtext">Ingreso</label>
                                        <input type="text" id="ingreso" className="sj_modelinput mt-2 w-100" placeholder="$100" />
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                        <label htmlFor="efectivo" className="sjtext">Registro efectivo</label>
                                        <input type="text" id="efectivo" className="sj_modelinput mt-2 w-100" placeholder="$300" />
                                    </div>
                                </div>
                                <label htmlFor=" sjtext">Irregularidades</label>
                                <input type="text" className="sj_modelinput mt-2" placeholder="$-50" />
                            </div>
                            <div className="modal-footer sjmodenone">
                                {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                                <button type="button" className="btn sjbtnskylight" data-bs-toggle="modal" data-bs-target="#modelstaticBackdrop">Imprimir reporte</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Modal 3--> */}
                <div className="modal fade" id="modelstaticBackdrop" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="sjmodel">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Cierre caja</h1>
                                <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Completa el “Registro de efectivo” para comparar y detectar cualquier irregularidad en el cierre de caja</p>
                                <label htmlFor="final">Monto final</label>
                                <input type="text" id="final" className="sj_modelinput" placeholder="$200" /> <br />
                                <label htmlFor="final">Monto efectivo</label>
                                <input type="text" id="final" className="sj_modelinput" placeholder="$ 0.00" />
                            </div>
                            <div className="modal-footer sjmodenone">
                                <button type="button" className="btn sjredbtn" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" data-bs-toggle="modal" data-bs-target="#model1staticBackdrop" className="btn btn-primary">Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Modal 4--> */}
                <div className="modal fade" id="model1staticBackdrop" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="sjmodel">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Generar reporte cajas</h1>
                                <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Selecciona las fechas para generar el reporte</p>
                                <div className="row pt-3">
                                    <div className="col-12 col-md-6 mb-3">
                                        {/* <label htmlFor="desde" className="sjtext">Desde</label>
                                        <input type="text" id="desde" className="sj_modelinput mt-2 w-100" placeholder="Enero" /> */}
                                        <label className="mb-1 sjtext">Desde</label>
                                        <select className="d-block sj_modelinput ">
                                            <option value="0">Enero</option>
                                            <option value="1">Sin seleccionar</option>
                                            <option value="2">Delivery</option>
                                            <option value="3">Local</option>
                                            <option value="3">Retirar</option>
                                        </select>
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                        {/* <label htmlFor="hasta" className="sjtext">Hasta</label>
                                        <input type="text" id="hasta" className="sj_modelinput mt-2 w-100" placeholder="03:00 pm" /> */}
                                        <label className="mb-1 sjtext">Hasta</label>
                                        <select className="d-block sj_modelinput ">
                                            <option value="0">Marzo</option>
                                            <option value="1">Sin seleccionar</option>
                                            <option value="2">Delivery</option>
                                            <option value="3">Local</option>
                                            <option value="3">Retirar</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer sjmodenone">
                                <button type="button" className="btn sjredbtn" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" data-bs-toggle="modal" data-bs-target="#model2staticBackdrop" className="btn btn-primary">Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Modal 5--> */}
                <div className="modal fade" id="model2staticBackdrop" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="sjmodel">
                            <div className="sj_modal-header">
                                {/* <h1 className="modal-title fs-5" id="staticBackdropLabel">Cierre caja</h1> */}
                                <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex justify-content-center">
                                    <a href="#">
                                        <img src={checkbox} alt="#" className="" data-bs-toggle="modal" data-bs-target="#model4staticBackdrop" />
                                    </a>
                                </div>
                                <p className="text-center pt-2 mb-0">Caja abierta</p>
                                <p className="text-center">exitosamente</p>
                            </div>
                            {/* <div className="modal-footer sjmodenone">
                                <button type="button" className="btn sjredbtn" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" data-bs-toggle="modal" data-bs-target="" className="btn btn-primary">Confirmar</button>
                            </div> */}
                        </div>
                    </div>
                </div>
                {/* <!-- Modal 7--> */}
                <div className="modal fade" id="model4staticBackdrop" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="sjmodel">
                            <div className="sj_modal-header">
                                {/* <h1 className="modal-title fs-5" id="staticBackdropLabel">Cierre caja</h1> */}
                                <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex justify-content-center">
                                    <a href="#">
                                        <img src={checkbox} alt="" data-bs-toggle="modal" data-bs-target="#model5staticBackdrop" />
                                    </a>
                                </div>
                                <p className="text-center pt-2 mb-0">Caja</p>
                                <p className="text-center">Los cambios han sido guardados exitosamente</p>
                            </div>
                            {/* <div className="modal-footer sjmodenone">
                                <button type="button" className="btn sjredbtn" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" data-bs-toggle="modal" data-bs-target="" className="btn btn-primary">Confirmar</button>
                            </div> */}
                        </div>
                    </div>
                </div>
                {/* <!-- Modal 8--> */}
                <div className="modal fade" id="model5staticBackdrop" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="sjmodel">
                            <div className="sj_modal-header">
                                {/* <h1 className="modal-title fs-5" id="staticBackdropLabel">Cierre caja</h1> */}
                                <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex justify-content-center">
                                    <a href="#">
                                        <img src={checkbox} alt="" data-bs-toggle="modal" data-bs-target="#model6staticBackdrop" />
                                    </a>
                                </div>
                                <p className="text-center pt-2 mb-0">Caja</p>
                                <p className="text-center">Cierre de caja exitosamente</p>
                            </div>
                            {/* <div className="modal-footer sjmodenone">
                                <button type="button" className="btn sjredbtn" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" data-bs-toggle="modal" data-bs-target="" className="btn btn-primary">Confirmar</button>
                            </div> */}
                        </div>
                    </div>
                </div>
                {/* <!-- Modal 9--> */}
                <div className="modal fade" id="model6staticBackdrop" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="sjmodel">
                            <div className="sj_modal-header">
                                {/* <h1 className="modal-title fs-5" id="staticBackdropLabel">Cierre caja</h1> */}
                                <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex justify-content-center">
                                    <a href="#">
                                        <img src={checkbox} alt="" />
                                    </a>
                                </div>
                                <p className="text-center pt-2 mb-0">Caja</p>
                                <p className="text-center">Creada exitosamente</p>
                            </div>
                            {/* <div className="modal-footer sjmodenone">
                                <button type="button" className="btn sjredbtn" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" data-bs-toggle="modal" data-bs-target="" className="btn btn-primary">Confirmar</button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Movimientos;