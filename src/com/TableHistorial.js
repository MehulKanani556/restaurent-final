import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { HiOutlineArrowLeft } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import Sidenav from './Sidenav'
import Header from './Header'

const TableHistorial = () => {

    const [data, setData] = useState([
        {
            pedido: '01234',
            fecha: '24/05/2023',
            hora: '11:00 AM',
            cliente: 'Damian Gonzales',
            estado: 'Recibido',
        },

        {
            pedido: '01234',
            fecha: '24/05/2023',
            hora: '11:00 AM',
            cliente: 'Damian Gonzales',
            estado: 'Recibido',
        },

        {
            pedido: '01234',
            fecha: '24/05/2023',
            hora: '11:00 AM',
            cliente: 'Damian Gonzales',
            estado: 'Preparado',
        },

        {
            pedido: '01234',
            fecha: '24/05/2023',
            hora: '11:00 AM',
            cliente: 'Damian Gonzales',
            estado: 'Entregado',
        },

        {
            pedido: '01234',
            fecha: '24/05/2023',
            hora: '11:00 AM',
            cliente: 'Damian Gonzales',
            estado: 'Finalizado',
        },
        {
            pedido: '01234',
            fecha: '24/05/2023',
            hora: '11:00 AM',
            cliente: 'Damian Gonzales',
            estado: 'Preparado',
        },
        {
            pedido: '01234',
            fecha: '24/05/2023',
            hora: '11:00 AM',
            cliente: 'Damian Gonzales',
            estado: 'Recibido',
        },

        {
            pedido: '01234',
            fecha: '24/05/2023',
            hora: '11:00 AM',
            cliente: 'Damian Gonzales',
            estado: 'Finalizado',
        },

    ]);

    return (

        <>
            <Header />
            <div className="d-flex">
                <Sidenav />
                <div className=" flex-grow-1 sidebar">
                    <div className="m_bgblack text-white m_borbot j-tbl-font-1">
                        <div className="j-table-datos-btn">
                            <Button variant="outline-primary" className='j-tbl-btn-font-1 '>
                                <HiOutlineArrowLeft className='j-table-datos-icon' />Regresar</Button>
                        </div>
                        <div className='j-table-information-head-buttons'>
                            <h5 className="j-table-information-1 j-table-text-23 ">Datos mesa 1</h5>

                            <div className="j-table-information-btn-1">
                                <Button data-bs-theme="dark"
                                    className="j-canvas-btn2 j-tbl-font-3"
                                    variant="primary"
                                >
                                    <div className="d-flex align-items-center">
                                        <svg className="j-canvas-btn-i" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clip-rule="evenodd" />
                                        </svg>
                                        Generar reporte
                                    </div>
                                </Button>
                                <Button
                                    data-bs-theme="dark"
                                    className="j-canvas-btn2 j-tbl-font-3"
                                    variant="outline-primary"
                                >
                                    <div className="d-flex align-items-center">
                                        <svg className="j-canvas-btn-i" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd" />
                                            <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd" />
                                        </svg>
                                        Editar
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="j-table-information-data">
                        <div className="j-table-border-bottom">
                            <Link to={"/table/information"}>
                                <h4 className='mb-0 j-table-information-data-text-234 j-table-information-text-light'>Información</h4>
                            </Link>
                            <Link to={"/table/historial"}>
                                <h4 className='mb-0 j-table-information-data-text-234  '>Historial</h4>
                            </Link>
                            <Link to={"/table/statistics"}>
                                <h4 className='mb-0 j-table-information-data-text-234 j-table-information-text-light'>Estadísticas</h4>
                            </Link>
                        </div>
                    </div>
                    <div className="j-table-information-body">

                        <form>
                            <div className="d-flex justify-content-between">
                                <div className="mb-3 me-3">
                                    <label
                                        htmlFor="vendidosInput"
                                        className="form-label text-white j-tbl-font-11"
                                    >
                                        Vendidos
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control j-input-width j-tbl-information-input"
                                        id="vendidosInput"
                                        placeholder="60"
                                    />
                                </div>
                                <div className="d-flex justify-content-end gap-3">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="desdeSelect"
                                            className="form-label text-white j-tbl-font-11"
                                        >
                                            Desde
                                        </label>
                                        <select
                                            className="form-select j-input-width2 j-tbl-information-input  b_select border-0 py-2  " style={{ borderRadius: "6px" }}
                                            aria-label="Default select example"
                                        >
                                            <option selected>Enero</option>
                                            <option value="1">February</option>
                                            <option value="2">March</option>
                                            <option value="3">April</option>
                                            <option value="4">May</option>
                                            <option value="5">June</option>
                                            <option value="6">July</option>
                                            <option value="7">Sepetember</option>
                                            <option value="8">Octomber</option>
                                            <option value="9">November</option>
                                            <option value="10">Desember</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="hastaSelect"
                                            className="form-label text-white j-tbl-font-11"
                                        >
                                            Hasta
                                        </label>
                                        <select
                                            className="form-select j-input-width2 j-tbl-information-input  b_select border-0 py-2  " style={{ borderRadius: "6px" }}
                                            aria-label="Default select example"
                                        >
                                            <option selected>Enero</option>
                                            <option value="1">February</option>
                                            <option value="2">March</option>
                                            <option value="3">April</option>
                                            <option value="4">May</option>
                                            <option value="5">June</option>
                                            <option value="6">July</option>
                                            <option value="7">Sepetember</option>
                                            <option value="8">Octomber</option>
                                            <option value="9">November</option>
                                            <option value="10">Desember</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>




                        <div className='b_table1'>
                            <table className='b_table '>
                                <thead>
                                    <tr className='b_thcolor'>
                                        <th>Pedido</th>
                                        <th>Fecha </th>
                                        <th>Hora</th>
                                        <th>Cliente</th>
                                        <th>Estado</th>
                                        <th>Ver</th>
                                    </tr>
                                </thead>
                                <tbody className='text-white b_btnn '>
                                    {data.map((order) => (
                                        <tr key={order.id} className='b_row'>
                                            <td ><div className='b_idbtn' style={{ borderRadius: "10px", fontSize: "12px" }}>{order.pedido}</div></td>
                                            <td >{order.fecha}</td>
                                            <td className='text-nowrap'>{order.hora}</td>
                                            <td className='text-nowrap' >{order.cliente}</td>
                                            <td style={{ width: '108px', height: '40px' }} className={`b_btn1 mb-3 ms-3 text-nowrap d-flex  align-items-center justify-content-center ${order.estado == 'Recibido' ? 'b_bl' : order.estado === 'Preparado' ? 'b_or' : order.estado === 'Entregado' ? 'b_er' : order.estado === 'Finalizado' ? 'b_gr' : 'text-denger'}`}>{order.estado}</td>
                                            <td>
                                                <td className='b_idbtn bg-primary text-nowrap'>ver details</td>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default TableHistorial
