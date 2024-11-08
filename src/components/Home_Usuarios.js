import React, { useEffect, useState } from 'react';
import Header from './Header';
import Sidenav from './Sidenav';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdEditSquare } from "react-icons/md";
import { RiCloseLargeFill, RiDeleteBin5Fill } from "react-icons/ri";
import { BiSolidFoodMenu } from 'react-icons/bi';
import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi';
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Button, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import * as XLSX from "xlsx-js-style";

function Home_Usuarios() {

    // const API_URL = "https://shreekrishnaastrology.com/api"; // Laravel API URL
    // const API = "https://shreekrishnaastrology.com/public";

    // const [token, setToken] = useState(
    //     "2647|bkAORMNJS6ite9xHPiGmApoi78Dfz9tV8Bzbyb6a1ca62063"
    // );

    const API_URL = process.env.REACT_APP_API_URL;
    const API = process.env.REACT_APP_IMAGE_URL;
    const token = localStorage.getItem("token");
    const admin_id = localStorage.getItem("admin_id");

    const [filterData, setFilterData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [orderAlldata, setOrderAlldata] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showEditFamDel, setShowEditFamDel] = useState(false);
    const itemsPerPage = 20;

    // generate report
    const [data, setData] = useState([]);
    const [show15, setShow15] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleClose15 = () => setShow15(false);
    const handleShow15 = () => setShow15(true);

    const [showModal12, setShowModal12] = useState(false);

    const handleClose12 = () => setShowModal12(false);
    const handleShow12 = () => {
        setShowModal12(true);
        handleClose15();

        setTimeout(() => {
            setShowModal12(false);
        }, 2000);
    };

    const [errorReport, setErrorReport] = useState("");
    const [selectedDesdeMonthReport, setSelectedDesdeMonthReport] = useState(1);
    const [selectedHastaMonthReport, setSelectedHastaMonthReport] = useState(
        new Date().getMonth() + 1
    );

    useEffect(
        () => {
            if (selectedDesdeMonthReport > selectedHastaMonthReport) {
                setErrorReport("Hasta el mes debe ser mayor o igual que Desde el mes.");
                setData([]);
            } else {
                setErrorReport("");
            }
        },
        [selectedDesdeMonthReport, selectedHastaMonthReport]
    );

    const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];

    const generateExcelReport = async () => {
        setIsProcessing(true);
        try {
            const filteredOrderData = orderAlldata.filter((order) => {
                const orderDate = new Date(order.created_at);
                const orderMonth = orderDate.getMonth() + 1; // Months are 0-indexed
                return orderMonth >= selectedDesdeMonthReport && orderMonth <= selectedHastaMonthReport;
            }).map((order) => {
                const date = new Date(order.created_at);
                const formattedDate = date.toLocaleDateString('en-GB'); // Format date
                const formattedTime = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                }); // Format time

                return {
                    Pedido: order.id, // Changed to Spanish
                    Fecha: formattedDate, // Only date
                    Hora: formattedTime, // Add time
                    Cliente: order.customer_name, // Changed to Spanish
                    Pago: "$" + order.total, // Changed to Spanish
                    Metodo: order.payment_type == 'cash' ? 'Efectivo' :
                        order.payment_type == 'debit' ? 'Débito' :
                            order.payment_type == 'credit' ? 'Crédito' :
                                order.payment_type == 'transfer' ? 'Transferencia' : " ",
                    Vuelto: "$" + order.total, // Changed to Spanish
                    Tipo: order.order_type.toLowerCase() === 'local' ? 'Local' :
                        order.order_type.toLowerCase().includes("with") ? 'Retiro ' :
                            order.order_type.toLowerCase() === 'delivery' ? 'Entrega' :
                                order.order_type.toLowerCase() === 'uber' ? 'Uber' :
                                    order.order_type.toLowerCase() === 'rappi' ? 'Rappi' :
                                        order.order_type // Changed to Spanish
                };
            });

            // Create a worksheet
            const ws = XLSX.utils.json_to_sheet(filteredOrderData, { origin: "A2" });

            // Add a heading "Reporte de Entrega"
            XLSX.utils.sheet_add_aoa(ws, [["Reporte de Entrega"]], { origin: "A1" });
            ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }]; // Merge cells for the heading

            // Add column names only if there is data
            if (filteredOrderData.length > 0) {
                const columnNames = ["Pedido", "Fecha", "Hora", "Cliente", "Pago", "Metodo", "Vuelto", "Tipo"];
                XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" });

                columnNames.forEach((_, index) => {
                    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: index }); // Row 2 (index 1)
                    ws[cellAddress].s = {
                        font: { bold: true, sz: 12 },
                        alignment: { horizontal: "center", vertical: "center" }
                    };
                });// Add column names starting from row 2
            }

            // Apply styles to the heading
            ws["A1"].s = {
                font: { name: "Aptos Narrow", bold: true, sz: 16 },
                alignment: { horizontal: "center", vertical: "center" }
            };

            // Set row height for the heading
            if (!ws["!rows"]) ws["!rows"] = [];
            ws["!rows"][0] = { hpt: 30 };
            ws["!rows"][1] = { hpt: 25 }; // Set height for column names

            // Auto-size columns
            const colWidths = [{ wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 30 }];
            ws["!cols"] = colWidths;

            // Add sorting functionality
            ws['!autofilter'] = { ref: `A2:H${filteredOrderData.length + 2}` }; // Enable autofilter for the range

            // Create a workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Reporte de Entrega");

            // Generate Excel file
            const desdeMonthName = monthNames[selectedDesdeMonthReport - 1];
            const hastaMonthName = monthNames[selectedHastaMonthReport - 1];
            XLSX.writeFile(wb, `Reporte de Entrega ${desdeMonthName}-${hastaMonthName}.xlsx`);
            setIsProcessing(false)
            handleShow12();
        } catch (error) {
            console.error("Error generating report:", error);
            setErrorReport("No se pudo generar el informe. Por favor inténtalo de nuevo.");
        }
    };


    useEffect(() => {
        getAllorder();
    }, []);

    const getAllorder = async () => {
        setIsProcessing(true)
        try {
            const response = await axios.post(`${API_URL}/order/getAll`, { admin_id: admin_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFilterData(response.data);
            setOrderAlldata(response.data);
            console.log(response.data);

        } catch (error) {
            console.error(
                "Error fetching allOrder:",
                error.response ? error.response.data : error.message
            );
        }
        setIsProcessing(false);
    }

    const handleType = (type) => {
        console.log(type);
        if (type.toLowerCase() === "todo") {
            setFilterData(orderAlldata);
        } else {
            const filteredData = orderAlldata.filter((v) => v.order_type.toLowerCase().includes(type.toLowerCase()));
            setFilterData(filteredData);
        }
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        console.log("asfas");

        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filterData.length / itemsPerPage)));
    };

    const handlePrevPage = () => {
        console.log("qewq");
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const getCurrentItems = () => {

        const filteredItems = filterData.filter(order =>
            (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.payment_type && order.payment_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.order_type && order.order_type.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const sortedItems = filteredItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));


        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        return sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    };

    const totalPages = Math.ceil(filterData.filter(order =>
        (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.id && order.id.toString().includes(searchTerm))
    ).length / itemsPerPage);



    document.addEventListener('DOMContentLoaded', function () {
        const tabs = document.querySelectorAll('#pills-tab button');

        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                // Remove 'bg-primary', 'text-light', 'bg-light', 'text-dark' from all tabs
                tabs.forEach(button => {
                    button.classList.remove('bg-primary', 'text-light');
                    button.classList.add('bg-light', 'text-dark');
                });

                // Add 'bg-primary' and 'text-light' to the clicked tab
                tab.classList.remove('bg-light', 'text-dark');
                tab.classList.add('bg-primary', 'text-light');
            });
        });
    });

    const [deleteProductId, setDeleteProductId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const deleteProductModal = (id) => {
        setShowDeleteConfirmation(true);
        setDeleteProductId(id);
    }

    const deleteProduct = async () => {
        // setIsProcessing(true);
        try {
            const response = await axios.delete(`${API_URL}/order/delete/${deleteProductId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!(response.success == "false")) {
                setDeleteProductId(null);
                setShowDeleteConfirmation(false);
                handleShowEditFamDel();
            }

        } catch (error) {
            console.error(
                "Error Delete OrderData:",
                error.response ? error.response.data : error.message
            );
        } finally {
            // setIsProcessing(false);
        }

    };


    const handleCloseEditFamDel = () => setShowEditFamDel(false);

    const handleShowEditFamDel = async () => {
        setShowEditFamDel(true)
        setTimeout(() => {
            setShowEditFamDel(false)
            getAllorder();
        }, 2000);
    };

    // const handleType = (type)=>{
    //     const filterData = orderAlldata.filter((v)=>v.type == type.tolowerCase())
    //     setFilterData(filterData)
    // }



    // const handleEditClick = (id) => {
    //     // Implement edit functionality here
    //     console.log('Edit button clicked for order:', id);
    // };

    // const handleStatusChange = (id, newStatus) => {
    //     // Update order status
    //     const newData = data.map((order) => {
    //         if (order.id === id) {
    //             return { ...order, status: newStatus };
    //         }
    //         return order;
    //     });
    //     setData(newData);
    // };










    return (
        <div className='b_bg_color'>
            <Header />

            <div className='d-flex '>
                <div>
                    <Sidenav />
                </div>

                <div className='flex-grow-1 overflow-hidden sidebar b_bg_table '>
                    <div className='ms-4' style={{ marginTop: "20px", marginBottom: "16px" }}>
                        <h4 className='text-white bj-delivery-text-1'>Delivery</h4>
                    </div>
                    <div className='d-flex b_main_search ms-4 justify-content-between mt-3'>
                        <div>
                            <div className="">
                                <div className="m_group">
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="m_icon">
                                        <g>
                                            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
                                        </g>
                                    </svg>
                                    <input
                                        className="bm_input"
                                        type="search"
                                        placeholder="Buscar"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='b_marg'>
                            <div className='me-4'>
                                <Link to={"/home/usa/bhomedelivery"}>
                                    <button type="submit" className="btn text-white bj-delivery-text-3 j-btn-primary mb-3 me-3 py-2" style={{ backgroundColor: "#147BDE", borderRadius: '10px' }}>+ Crear pedido</button>
                                </Link>
                                <button type="submit" className="btn bj-delivery-text-3  bj-btn-outline-primary mb-3 py-2  " style={{ borderRadius: "10px" }} onClick={handleShow15}><BiSolidFoodMenu /> Generar reporte</button>
                            </div>
                        </div>
                    </div>
                    <div className='justify-content-between  b_btn_main'>

                        <div>
                            <div className='row d-flex justify-content-between'>
                                <div className='col-md-6 d-flex justify-content-between align-items-center flex-wrap'>
                                    <ul className="nav nav-pills  b_nav ms-4 mb-3 gap-3 " id="pills-tab" role="tablist" >
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active rounded-pill bj-delivery-text-2 " id="pills-home-tab1" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true" onClick={() => handleType("Todo")} >Todo</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill bj-delivery-text-2 " id="pills-profile-tab2" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false" onClick={() => handleType("delivery")}>Delivery</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill bj-delivery-text-2 " id="pills-contact-tab3" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false" onClick={() => handleType("with")} >Retiro</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill bj-delivery-text-2 " id="pills-local-tab4" data-bs-toggle="pill" data-bs-target="#pills-local" type="button" role="tab" aria-controls="pills-local" aria-selected="false" onClick={() => handleType("local")} >Local</button>
                                        </li>
                                        {/* <li className="nav-item" role="presentation">
                                        <button className="nav-link rounded-pill bj-delivery-text-2 " id="pills-paltform-tab5" data-bs-toggle="pill" data-bs-target="#pills-paltform" type="button" role="tab" aria-controls="pills-paltform" aria-selected="false" onClick={() => handleType("Plat")} >Plataforma</button>
                                    </li> */}
                                    </ul>
                                    {/* <div className='text-white fs-5 fw- d-flex b_arrow align-item-center justify-content-center'>
                                    <div className='text-white  d-flex  b_arrow' style={{ alignItems: "baseline" }}>
                                        <div className='pe-3 mt-2 b_svg ' style={{ color: "#9CA3AF" }}>
                                            <FaAngleLeft
                                                className='bj-right-icon-size-2'
                                                onClick={handlePrevPage}
                                                disabled={currentPage === 1}
                                            />
                                        </div>
                                        <span className='mt-2' style={{ color: "#9CA3AF" }}>
                                            <FaAngleRight
                                                className='bj-right-icon-size-2'
                                                onClick={handleNextPage}
                                                disabled={currentPage === totalPages}
                                            />
                                        </span>
                                        <div className='text-white bj-delivery-text-3  d-flex  pt-1 ms-5'>
                                            <p className='b_page_text me-4' style={{ color: "#9CA3AF" }}>
                                                vista <span className='text-white'>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, data.length)}</span> de <span className='text-white'>{currentItems.length}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div> */}

                                </div>
                                <div className='col-md-6 text-white  d-flex  b_arrow justify-content-end' style={{ alignItems: "baseline", cursor: "pointer", top: "200px", right: "0" }}>
                                    <div className='j-right-left-arrow'>
                                        <div className='pe-3 mt-2 b_svg ' style={{ color: "#9CA3AF" }}>
                                            <FaAngleLeft
                                                className='bj-right-icon-size-2'
                                                onClick={() => handlePrevPage()}
                                                disabled={currentPage === 1}
                                            />
                                        </div>
                                        <span className='mt-2' style={{ color: "#9CA3AF" }}>
                                            <FaAngleRight
                                                className='bj-right-icon-size-2'
                                                onClick={() => handleNextPage()}
                                                disabled={currentPage === Math.ceil(filterData.length / itemsPerPage)}
                                            />
                                        </span>
                                    </div>
                                    <div className='text-white bj-delivery-text-3  d-flex  pt-1 ms-5'>
                                        <p className='b_page_text me-4' style={{ color: "#9CA3AF" }}>
                                            vista <span className='text-white'>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filterData.length)}</span> de <span className='text-white'>{filterData.length}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="tab-content text-white" id="pills-tabContent">
                                <div className="tab-pane fade show active text-white" id="" role="tabpanel" aria-labelledby="">

                                    <div className='b_table1'>
                                        <table className='b_table bj-table mb-4'>
                                            <thead>
                                                <tr className='b_thcolor'>
                                                    <th>Pedido</th>
                                                    <th className='text-nowrap'>Hora pedido </th>
                                                    <th></th>
                                                    <th>Cliente</th>
                                                    <th>Pago</th>
                                                    <th>Metodo</th>
                                                    <th>Vuelto</th>
                                                    <th >Tipo</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-white b_btnn '>
                                                {getCurrentItems().length > 0 ?
                                                    getCurrentItems().map((order) => (
                                                        // console.log(order),

                                                        <tr key={order.id} className='b_row'>
                                                            <Link to={`/home/usa/information/${order.id}`}>
                                                                <td className='b_idbtn bj-delivery-text-2 ms-3' style={{ borderRadius: "10px" }}>{order.id}</td>
                                                            </Link>
                                                            <td className='b_text_w'>{new Date(order?.created_at).toLocaleDateString('en-GB')}</td>
                                                            <td className='b_text_w'>{new Date(order?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                            <td className='b_text_w'>{order.customer_name}</td>
                                                            <td className='b_text_w'>${order.order_details.reduce((acc, v) => acc + parseInt(v.amount) * parseInt(v.quantity), 0) - parseFloat(order.discount).toFixed(2)}</td>
                                                            {/* <td className='b_text_w'>{order.payment_type}</td> */}
                                                            <td className='b_text_w'>
                                                                {
                                                                    order.payment_type == 'cash' ? 'Efectivo' :
                                                                        order.payment_type == 'debit' ? 'Débito' :
                                                                            order.payment_type == 'credit' ? 'Crédito' :
                                                                                order.payment_type == 'transfer' ? 'Transferencia' : " "
                                                                }
                                                            </td>
                                                            <td className='b_text_w'>${order.order_details.reduce((acc, v) => acc + parseInt(v.amount) * parseInt(v.quantity), 0) - parseFloat(order.discount).toFixed(2)}</td>
                                                            {/* <td className='b_btn1 bj-delivery-text-2 mb-3 ms-3 d-flex align-items-center justify-content-center'>{order.order_type}</td> */}
                                                            <td className={`bj-delivery-text-2  b_btn1 mb-3 ms-3  p-0 text-nowrap d-flex  align-items-center justify-content-center 
                                                            ${order.order_type.toLowerCase() === 'local' ? 'b_indigo' : order.order_type.toLowerCase() === 'order now' ? 'b_ora ' : order.order_type.toLowerCase() === 'delivery' ? 'b_blue' : order.order_type.toLowerCase() === 'uber' ? 'b_ora text-danger' : order.order_type.toLowerCase().includes("with") ? 'b_purple' : 'b_ora text-danger'}`}>
                                                                {order.order_type.toLowerCase() === 'local' ? 'Local' : order.order_type.toLowerCase().includes("with") ? 'Retiro ' : order.order_type.toLowerCase() === 'delivery' ? 'Entrega' : order.order_type.toLowerCase() === 'uber' ? 'Uber' : order.order_type}
                                                            </td>

                                                            <td className='b_text_w'>
                                                                <Link to={`/home/usa/information/${order.id}`}>
                                                                    <button className='b_edit me-5'><MdEditSquare /></button>
                                                                </Link>
                                                                <button className='b_edit b_delete' onClick={() => deleteProductModal(order.id)}><RiDeleteBin5Fill /></button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                    :
                                                    <tr>
                                                        <td colSpan="9" className="text-center"> {/* Added colSpan to span all columns */}
                                                            <div className="text-center">No hay datos para mostrar</div>
                                                        </td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                                {/* <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab2">
                                    <div className='text-white j-delivery-position-final d-flex  b_arrow' style={{ alignItems: "baseline", cursor: "pointer", position: "absolute", top: "200px", right: "0" }}>
                                        <div className="j-right-left-arrow">
                                            <div className='pe-3 mt-2 b_svg ' style={{ color: "#9CA3AF" }}>
                                                <FaAngleLeft
                                                    className='bj-right-icon-size-2'
                                                    onClick={() => handlePrevPage('data1')}
                                                    disabled={currentPage.data1 === 1}
                                                />
                                            </div>
                                            <span className='mt-2' style={{ color: "#9CA3AF" }}>
                                                <FaAngleRight
                                                    className='bj-right-icon-size-2'
                                                    onClick={() => handleNextPage('data1')}
                                                    disabled={currentPage.data1 === Math.ceil(data1.length / itemsPerPage)}
                                                />
                                            </span>
                                        </div>
                                        <div className='text-white bj-delivery-text-3  d-flex  pt-1 ms-5'>
                                            <p className='b_page_text me-4' style={{ color: "#9CA3AF" }}>
                                                vista <span className='text-white'>{(currentPage.data1 - 1) * itemsPerPage + 1}-{Math.min(currentPage.data1 * itemsPerPage, data1.length)}</span> de <span className='text-white'>{data1.length}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className='b_table1'>
                                        <table className='b_table bj-table mb-4'>
                                            <thead>
                                                <tr className='b_thcolor'>
                                                    <th>Pedido</th>
                                                    <th>Hora Pedido </th>
                                                    <th></th>
                                                    <th>Cliente</th>
                                                    <th className='text-nowrap'>Direccion entrega</th>
                                                    <th>Delivery</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-white b_btnn '>
                                                {getCurrentItems('data1').map((order) => (
                                                    <tr key={order.id1} className='b_row'>
                                                        <td className='b_idbtn bj-delivery-text-2 ms-3' style={{ borderRadius: "10px" }}>{order.id1}</td>
                                                        <td>{order.order1}</td>
                                                        <td className='b_text_w '>{order.time1}</td>
                                                        <td className='b_text_w'>{order.customer1}</td>
                                                        <td className='b_text_w'>{order.Delivery_address1}</td>
                                                        <td className={`b_btn1 bj-delivery-text-2 mb-3 ms-3 text-nowrap d-flex  align-items-center justify-content-center ${order.guy1 == 'Uber' ? 'b_green' : order.guy1 === 'Rappi' ? 'b_red' : order.guy1 === 'Padidos Ya' ? 'b_ora' : 'text-denger'}`}>{order.guy1}</td>
                                                        <td className='b_text_w'>
                                                            <Link to={"/home/usa/information"}>
                                                                <button className='b_edit me-5' onClick={() => handleEditClick(order.id1)}><MdEditSquare /></button>
                                                            </Link>
                                                            <button className='b_edit b_delete' onClick={() => handleShowEditFamDel(order.no)}><RiDeleteBin5Fill /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div> */}

                                {/* <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab3">

                                    <div className='text-white j-delivery-position-final  d-flex  b_arrow' style={{ alignItems: "baseline", cursor: "pointer", position: "absolute", top: "200px", right: "0" }}>
                                        <div className="j-right-left-arrow">
                                            <div className='pe-3 mt-2 b_svg ' style={{ color: "#9CA3AF" }}>
                                                <FaAngleLeft
                                                    className='bj-right-icon-size-2'
                                                    onClick={() => handlePrevPage('data2')}
                                                    disabled={currentPage.data2 === 1}
                                                />
                                            </div>
                                            <span className='mt-2' style={{ color: "#9CA3AF" }}>
                                                <FaAngleRight
                                                    className='bj-right-icon-size-2'
                                                    onClick={() => handleNextPage('data2')}
                                                    disabled={currentPage.data2 === Math.ceil(data2.length / itemsPerPage)}
                                                />
                                            </span>
                                        </div>
                                        <div className='text-white bj-delivery-text-3  d-flex  pt-1 ms-5'>
                                            <p className='b_page_text me-4' style={{ color: "#9CA3AF" }}>
                                                vista <span className='text-white'>{(currentPage.data2 - 1) * itemsPerPage + 1}-{Math.min(currentPage.data2 * itemsPerPage, data2.length)}</span> de <span className='text-white'>{data2.length}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className='b_table1'>
                                        <table className='b_table bj-table mb-4'>
                                            <thead>
                                                <tr className='b_thcolor'>
                                                    <th>Pedido</th>
                                                    <th>Hora Pedido </th>
                                                    <th></th>
                                                    <th>Cliente</th>
                                                    <th className='text-nowrap'>Direccion retiro</th>
                                                    <th>Retiro</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-white b_btnn'>
                                                {getCurrentItems('data2').map((order) => (
                                                    <tr key={order.id} className='b_row'>
                                                        <td className='b_idbtn ms-3 bj-delivery-text-2' style={{ borderRadius: "10px" }}>{order.id}</td>
                                                        <td>{order.order}</td>
                                                        <td className='b_text_w'>{order.time}</td>
                                                        <td className='b_text_w'>{order.customer}</td>
                                                        <td className='b_text_w'>{order.withdrawal_address}</td>
                                                        <td className='b_btn1 bj-delivery-text-2 b_btn_w mb-3  ms-3 d-flex  align-items-center justify-content-center'>{order.guy}</td>
                                                        <td className='b_text_w'>
                                                            <Link to={"/home/usa/information"}>
                                                                <button className='b_edit me-5' onClick={() => handleEditClick(order.id)}><MdEditSquare /></button>
                                                            </Link>
                                                            <button className='b_edit b_delete' onClick={() => handleShowEditFamDel(order.no)}><RiDeleteBin5Fill /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div> */}
                                {/* <div className="tab-pane fade" id="pills-local" role="tabpanel" aria-labelledby="pills-contact-tab4">
                                    <div className='text-white j-delivery-position-final   d-flex  b_arrow' style={{ alignItems: "baseline", cursor: "pointer", position: "absolute", top: "200px", right: "0" }}>
                                        <div className="j-right-left-arrow">
                                            <div className='pe-3 mt-2 b_svg ' style={{ color: "#9CA3AF" }}>
                                                <FaAngleLeft
                                                    className='bj-right-icon-size-2'
                                                    onClick={() => handlePrevPage('data3')}
                                                    disabled={currentPage.data3 === 1}
                                                />
                                            </div>
                                            <span className='mt-2' style={{ color: "#9CA3AF" }}>
                                                <FaAngleRight
                                                    className='bj-right-icon-size-2'
                                                    onClick={() => handleNextPage('data3')}
                                                    disabled={currentPage.data3 === Math.ceil(data3.length / itemsPerPage)}
                                                />
                                            </span>
                                        </div>

                                        <div className='text-white bj-delivery-text-3  d-flex  pt-1 ms-5'>
                                            <p className='b_page_text me-4' style={{ color: "#9CA3AF" }}>
                                                vista <span className='text-white'>{(currentPage.data3 - 1) * itemsPerPage + 1}-{Math.min(currentPage.data3 * itemsPerPage, data3.length)}</span> de <span className='text-white'>{data3.length}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className='b_table1'>
                                        <table className='b_table bj-table mb-4'>
                                            <thead>
                                                <tr className='b_thcolor'>
                                                    <th>Pedido</th>
                                                    <th>Hora pedido </th>
                                                    <th></th>
                                                    <th>Cliente</th>
                                                    <th>Direccion</th>
                                                    <th>Local</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-white b_btnn'>
                                                {getCurrentItems('data3').map((order) => (
                                                    <tr key={order.id} className='b_row'>
                                                        <td className='b_idbtn ms-3 bj-delivery-text-2' style={{ borderRadius: "10px" }}>{order.id}</td>
                                                        <td>{order.order}</td>
                                                        <td className='b_text_w'>{order.time}</td>
                                                        <td className='b_text_w'>{order.customer}</td>
                                                        <td className='b_text_w'>{order.withdrawal_address}</td>
                                                        <td className='b_btn1 b_btn_w ms-3 mb-3 bj-delivery-text-2  d-flex align-items-center justify-content-center'>{order.guy}</td>
                                                        <td className='b_text_w'>
                                                            <Link to={"/home/usa/information"}>
                                                                <button className='b_edit me-5' onClick={() => handleEditClick(order.id)}><MdEditSquare /></button>
                                                            </Link>
                                                            <button className='b_edit b_delete' onClick={() => handleShowEditFamDel(order.no)}><RiDeleteBin5Fill /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div> */}
                                {/* <div className="tab-pane fade" id="pills-paltform" role="tabpanel" aria-labelledby="pills-contact-tab5">
                                    <div className='text-white j-delivery-position-final  d-flex  b_arrow' style={{ alignItems: "baseline", cursor: "pointer", position: "absolute", top: "200px", right: "0" }}>
                                        <div className="j-right-left-arrow">
                                            <div className='pe-3 mt-2 b_svg ' style={{ color: "#9CA3AF" }}>
                                                <FaAngleLeft
                                                    className='bj-right-icon-size-2'
                                                    onClick={() => handlePrevPage('data4')}
                                                    disabled={currentPage.data4 === 1}
                                                />
                                            </div>
                                            <span className='mt-2' style={{ color: "#9CA3AF" }}>
                                                <FaAngleRight
                                                    className='bj-right-icon-size-2'
                                                    onClick={() => handleNextPage('data4')}
                                                    disabled={currentPage.data4 === Math.ceil(data4.length / itemsPerPage)}
                                                />
                                            </span>
                                        </div>
                                        <div className='text-white bj-delivery-text-3  d-flex  pt-1 ms-5'>
                                            <p className='b_page_text me-4' style={{ color: "#9CA3AF" }}>
                                                vista <span className='text-white'>{(currentPage.data4 - 1) * itemsPerPage + 1}-{Math.min(currentPage.data4 * itemsPerPage, data4.length)}</span> de <span className='text-white'>{data4.length}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className='b_table1'>
                                        <table className='b_table bj-table mb-4'>
                                            <thead>
                                                <tr className='b_thcolor'>
                                                    <th>Pedio</th>
                                                    <th>Hora pedio </th>
                                                    <th></th>
                                                    <th>Cliente</th>
                                                    <th>Direccion envio</th>
                                                    <th>Plataforma</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-white b_btnn'>
                                                {getCurrentItems('data4').map((order) => (
                                                    <tr key={order.id} className='b_row'>
                                                        <td className='b_idbtn bj-delivery-text-2 ms-3' style={{ borderRadius: "10px" }}>{order.id}</td>
                                                        <td>{order.order}</td>
                                                        <td className='b_text_w'>{order.time}</td>
                                                        <td className='b_text_w'>{order.customer}</td>
                                                        <td className='b_text_w'>{order.shipping_add}</td>
                                                        <td className='b_btn1 b_btn_p ms-3 mb-3 d-flex align-items-center bj-delivery-text-2 justify-content-center' >{order.guy}</td>
                                                        <td className='b_text_w'>
                                                            <Link to={"/home/usa/information"}>
                                                                <button className='b_edit me-5' onClick={() => handleEditClick(order.id)}><MdEditSquare /></button>
                                                            </Link>
                                                            <button className='b_edit b_delete' onClick={() => handleShowEditFamDel(order.no)}><RiDeleteBin5Fill /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div> */}
                            </div>

                            {/* ========= Delete confirmation Modal =========== */}
                            <Modal
                                show={showDeleteConfirmation}
                                onHide={() => setShowDeleteConfirmation(false)}
                                backdrop={true}
                                keyboard={false}
                                className="m_modal jay-modal"
                            >
                                <Modal.Header closeButton className="border-0" />

                                <Modal.Body>
                                    <div className="text-center">
                                        <img
                                            src={require("../Image/trash-outline-secondary.png")}
                                            alt=" "
                                        />
                                        <p className="mb-0 mt-3 h6">
                                            {" "}
                                            ¿Está seguro de que desea eliminar este pedido?
                                        </p>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer className="border-0 ">
                                    <Button
                                        className="j-tbl-btn-font-1 b_btn_close"
                                        variant="danger"
                                        onClick={deleteProduct}
                                    >
                                        Si, seguro
                                    </Button>
                                    <Button
                                        className="j-tbl-btn-font-1 "
                                        variant="secondary"
                                        onClick={() => setShowDeleteConfirmation(false)}
                                    >
                                        No, cancelar
                                    </Button>
                                </Modal.Footer>
                            </Modal>


                            {/* {/ edit family eliminate /} */}
                            <Modal
                                show={showEditFamDel}
                                onHide={handleCloseEditFamDel}
                                backdrop={true}
                                keyboard={false}
                                className="m_modal jay-modal"
                            >
                                <Modal.Header
                                    closeButton
                                    className="border-0"
                                ></Modal.Header>
                                <Modal.Body>
                                    <div className="j-modal-trash text-center">
                                        <img
                                            src={require("../Image/trash-outline.png")}
                                            alt=""
                                        />
                                        <p className="mb-0 mt-3 h6 j-tbl-pop-1">eliminado</p>
                                        <p className="opacity-75 j-tbl-pop-2">
                                            eliminado correctamente
                                        </p>
                                    </div>
                                </Modal.Body>
                            </Modal>

                            {/* generat report  */}
                            <Modal
                                show={show15}
                                onHide={handleClose15}
                                backdrop={true}
                                keyboard={false}
                                className="m_modal jay-modal"
                            >
                                <Modal.Header
                                    closeButton
                                    className="j-caja-border-bottom p-0 m-3 mb-0 pb-3"
                                >
                                    <Modal.Title className="modal-title j-caja-pop-up-text-1">
                                        Generar reporte de entrega
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <div className="col-6">
                                            <label className="mb-1 j-caja-text-1">
                                                Desde
                                            </label>

                                            <select
                                                className="form-select  b_select border-0 py-2  "
                                                style={{ borderRadius: "8px" }}
                                                aria-label="Default select example"
                                                value={selectedDesdeMonthReport}
                                                onChange={(e) =>
                                                    setSelectedDesdeMonthReport(e.target.value)}
                                            >
                                                <option selected value="1">Enero</option>
                                                <option value="2">Febrero</option>
                                                <option value="3">Marzo</option>
                                                <option value="4">Abril</option>
                                                <option value="5">Mayo</option>
                                                <option value="6">Junio</option>
                                                <option value="7">Julio</option>
                                                <option value="8">Agosto</option>
                                                <option value="9">Septiembre</option>
                                                <option value="10">Octubre </option>
                                                <option value="11">Noviembre</option>
                                                <option value="12">Diciembre</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="mb-1 j-caja-text-1">
                                                Hasta
                                            </label>
                                            <select
                                                className="form-select  b_select border-0 py-2  "
                                                style={{ borderRadius: "8px" }}
                                                aria-label="Default select example"
                                                value={selectedHastaMonthReport}
                                                onChange={(e) =>
                                                    setSelectedHastaMonthReport(e.target.value)}
                                            >
                                                <option selected value="1">Enero</option>
                                                <option value="2">Febrero</option>
                                                <option value="3">Marzo</option>
                                                <option value="4">Abril</option>
                                                <option value="5">Mayo</option>
                                                <option value="6">Junio</option>
                                                <option value="7">Julio</option>
                                                <option value="8">Agosto</option>
                                                <option value="9">Septiembre</option>
                                                <option value="10">Octubre </option>
                                                <option value="11">Noviembre</option>
                                                <option value="12">Diciembre</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="d-flex w-auto justify-content-end gap-5 row m-2">
                                        {errorReport && (
                                            <div className="alert alert-danger d-flex justify-content-between pointer flex-grow-1 p-2">
                                                {errorReport}{" "}
                                                <div
                                                    className="text-black d-flex align-items-center "
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => {
                                                        setErrorReport("");
                                                        setSelectedDesdeMonthReport(1);
                                                    }}
                                                >
                                                    <RiCloseLargeFill />{" "}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer className="sjmodenone">
                                    <Button
                                        variant="secondary"
                                        className="btn sjredbtn b_btn_close j-caja-text-1"
                                        onClick={handleClose15}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="btn j-btn-primary text-white j-caja-text-1"
                                        onClick={() => {
                                            generateExcelReport();
                                        }}
                                    >
                                        Generar reporte
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal
                                show={showModal12}
                                onHide={handleClose12}
                                backdrop={true}
                                keyboard={false}
                                className="m_modal jay-modal"
                            >
                                <Modal.Header closeButton className="border-0" />
                                <Modal.Body>
                                    <div className="text-center">
                                        <img
                                            src={require("../Image/check-circle.png")}
                                            alt=""
                                        />

                                        <p className="opacity-75 j-tbl-pop-2">
                                            generar informe descargar con éxito
                                        </p>
                                    </div>
                                </Modal.Body>
                            </Modal>
                            {/* processing */}
                            <Modal
                                show={isProcessing}
                                keyboard={false}
                                backdrop={true}
                                className="m_modal  m_user "
                            >
                                <Modal.Body className="text-center">
                                    <p></p>
                                    <Spinner animation="border" role="status" style={{ height: '85px', width: '85px', borderWidth: '6px' }} />
                                    <p className="mt-2">Procesando solicitud...</p>
                                </Modal.Body>
                            </Modal>


                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Home_Usuarios;
