import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Sidenav from './Sidenav';
import { FaPrint } from 'react-icons/fa';
import { Button, Modal, Spinner, Tab, Tabs } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Home_detail_no2 from './Home_detail_no2';
import Home_detail_no from './Home_detail_no';
import axios from 'axios';
import TableLastRecipt from './TableLastRecipt';
import OrderRecipt from './OrderRecipt';
import CreditRecipt from './CreditRecipt';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Home_detail() {

    const apiUrl = process.env.REACT_APP_API_URL;
    const API = process.env.REACT_APP_IMAGE_URL;
    const token = localStorage.getItem("token");
    const [isProcessing, setIsProcessing] = useState(false);
    const admin_id = localStorage.getItem("admin_id");
    // const {id} = useParams();
    // console.log(id);

    const { state } = useLocation();
    console.log(state);
    const navigate = useNavigate()


    const [activeTab, setActiveTab] = useState("home");

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


    // =========================API====================

    const [user, setUser] = useState(state?.user);
    const [orderAlldata, setOrderAlldata] = useState([]);
    const [orderId, setOrderId] = useState('');
    const [reason, setReason] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id, status) => {
        if (status == 'delivered' || status == 'finalized' || status == "cancelled") {
            alert(`No se puede Anular la venta porque el pedido actual aún no se ha preparado ni recibido.`)
        } else {
            setOrderId(id)
            setShow(true);
        }
    }


    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);

    const [showEditFamfinal, setShowEditFamfinal] = useState(false);
    const handleCloseEditFamfinal = () => setShowEditFamfinal(false);
    const handleShowEditFamfinal = () => {
        setShowEditFamfinal(true);
        setTimeout(() => {
            setShowEditFamfinal(false);
        }, 2000);
    };

    const [show12, setShow12] = useState(false);
    const handleClose12 = () => setShow12(false);
    const [reasonError, setResonError] = useState(null);
    const [credits, setCredits] = useState('');

    console.log(user);



    useEffect(() => {
        getAllOrder();

        // fetchUser();
    }, [show12, user, showEditFamfinal]);




    useEffect(() => {
        fetchCredit();
    }, [orderAlldata, user, showEditFamfinal])


    const getAllOrder = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post(`${apiUrl}/order/getAll`, { admin_id: admin_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const filteredOrders = response.data.filter((order) =>
                state.user?.orderIds.includes(order.id)
            );

            setOrderAlldata(filteredOrders);
            console.log(filteredOrders);

        } catch (error) {
            console.error(
                "Error fetching allOrders:",
                error.response ? error.response.data : error.message
            );
        }
        setIsProcessing(false);
    };


    const fetchCredit = async () => {
        try {
            const response = await axios.post(`${apiUrl}/order/getCredit`, { admin_id: admin_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data.data);


            const filterecredit = response.data.data.filter((v) =>
                state.user?.orderIds.includes(v.order_id)
            );

            setCredits(filterecredit);
            console.log(filterecredit);

        } catch (error) {
            console.error(
                "Error fetching allOrder:",
                error.response ? error.response.data : error.message
            );
        }
    }





    // ----resons section -----

    const handlereasons = (event) => {
        let notes = event?.target.value
        setReason(notes)
        setResonError(null)
    }

    const handleShow12 = async () => {

        if (!reason) {
            setResonError('Ingrese la razón');
            setShow(true);
            return;
        } else {

        }

        // ----resons----
        // ===change====

        try {
            setIsProcessing(true);
            const response = await axios.post(
                `${apiUrl}/order/updateorderreason/${orderId.toString()}`,
                { reason: reason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Note added successfully:", response.data);
            setIsProcessing(false);

        } catch (error) {
            console.error(
                "Error adding note:",
                error.response ? error.response.data : error.message
            );
        } finally {
            setIsProcessing(false);
        }

        try {
            setIsProcessing(true);
            const response = await axios.post(
                `${apiUrl}/order/updateStatus`,
                { order_id: orderId, status: "cancelled" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            //   getOrderStatus();
            console.log("Order Cancle successfully:", response.data);
            setIsProcessing(false);

        } catch (error) {
            console.error(
                "Error adding note:",
                error.response ? error.response.data : error.message
            );
        } finally {
            setIsProcessing(false);
        }

        // ---End-resons----
        setIsProcessing(false);
        setShow12(true)

        setTimeout(() => {
            setShow12(false)
            setOrderId('')
            setReason(null)
            setResonError(null)
            //   navigate(`/home_Pedidos/payment_edit/${id}`, { replace: true, state: "profile" });
        }, 2000);
    };

    const handleCredit = (id, status) => {
        if (status === "delivered") {
           console.log("Navigating to credit creation page");
           navigate(`/home/client/crear/${id}`, { replace: true, state: { user } });
       } else {
           alert(`No se puede generar una nota de crédito si el pedido actual no ha sido entregado`)
       }
   };
    const handleCreditDetails = (status, orderId) => {

        if (status == "pending") {
            navigate(`/home/client/detail_no/${orderId}`, { replace: true, state: { user } });
        } else if (status == "completed") {
            navigate(`/home/client/detail_no2/${orderId}`, { replace: true, state: { user } });
        }
    }

    // print recipt

    const [paymentData, setPaymentData] = useState();
    const [printOrderData, setPrintOrderData] = useState();

    const handleRecipe = async (order) => {
        // console.log(order);

        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/getsinglepayments/${order.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setPaymentData(response.data.data);
                setPrintOrderData(order);
                handleShow11();
            }
            setIsProcessing(false);


        } catch (error) {
            console.error(
                "Error fetching allOrders:",
                error.response ? error.response.data : error.message
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCreditRecipe = async (credit) => {
        // console.log(order);
        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/getsinglepayments/${credit.order_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setPaymentData(response.data.data);
                setPrintOrderData(credit);
                handleShow11();
            setIsProcessing(false);

            }
        } catch (error) {
            console.error(
                "Error fetching allOrders:",
                error.response ? error.response.data : error.message
            );
        } finally {
            setIsProcessing(false);
        }

    }


    const [show11, setShow11] = useState(false);
    const handleClose11 = () => {
        setShow11(false);
        // navigate("/table"); // Navigate to the desired page after closing the modal
    };
    const handleShow11 = () => setShow11(true);
    const qrCodeRef = useRef()
    const handlePrint = async () => {
        const printContent = document.getElementById("receipt-content") || document.getElementById("printCredit");
        // const qrCodeCanvas = qrCodeRef?.current?.toDataURL();
        // const creditReciptContent = document.getElementById("printCredit");

        if (printOrderData?.code) {
            // Use the CreditRecipt content for printing

            if (printContent) {
                // Use html2canvas to capture the content
                const canvas = await html2canvas(printContent, { backgroundColor: null }); // Set backgroundColor to null for transparency
                const imgData = canvas.toDataURL("image/png");
                const iframe = document.createElement("iframe");
                iframe.style.display = "none";
                document.body.appendChild(iframe);
                // Open the print dialog
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(`
                    <html>
                        <head>
                            <title>Print Receipt</title>
                            <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    background: transparent;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    // height: 100vh;
                                }
                                img {
                                    display: block;
                                    // max-width: 100%;
                                    // max-height: 100%;
                                }
                            </style>
                        </head>
                        <body>
                            <img src="${imgData}" />
                        </body>
                    </html>
                `);
                iframe.contentWindow.document.close();
                iframe.onload = function () {
                    try {
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                    } catch (e) {
                        console.error("Printing failed", e);
                    }

                    // Remove the iframe after printing
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 500);
                };
            } else {
                console.error("Receipt content not found");
            }
        } else {
            // Existing print logic for other content
            if (printContent) {
                // Create a new iframe
                const iframe = document.createElement("iframe");
                iframe.style.display = "none";
                document.body.appendChild(iframe);

                // Write the receipt content into the iframe
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write("<html><head><title>Print Receipt</title>");
                iframe.contentWindow.document.write("<style>body { font-family: Arial, sans-serif; }</style>");
                iframe.contentWindow.document.write("</head><body>");
                iframe.contentWindow.document.write(printContent.innerHTML);

                // if (qrCodeCanvas) {
                //     iframe.contentWindow.document.write(`<img src="${qrCodeCanvas}" />`);
                // }

                iframe.contentWindow.document.write("</body></html>");
                iframe.contentWindow.document.close();

                // Wait for the iframe to load before printing
                iframe.onload = function () {
                    try {
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                    } catch (e) {
                        console.error("Printing failed", e);
                    }

                    // Remove the iframe after printing
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 500);
                };
            } else {
                console.error("Receipt content not found");
            }
        }
    };

    const handleCreditDelete = async () => {
        try {
            setShowDeleteConfirmation(false);
            setIsProcessing(true);
            const response = await axios.delete(`${apiUrl}/order/creditnotes/${deleteProductId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response);
            if (!(response.success == "false")) {
                setDeleteProductId(null);
                setIsProcessing(false);
                setShowDeleteConfirmation(false);
                handleShowEditFamfinal();
            }
            console.log("Credit deleted successfully:", response.data);

        }
        catch (error) {
            console.log("Credit not deleted:", error);
        }
        setIsProcessing(false);
    }


    const deleteProductModal = (id) => {
        setShowDeleteConfirmation(true);
        setDeleteProductId(id);
    }

    return (
        <div className='b_bg_color'>
            <Header />

            <div className='d-flex '>
                <div>
                    <Sidenav />
                </div>
                <div className='flex-grow-1 sidebar w-50 ' style={{ backgroundColor: "#1F2A37" }}>
                    <Link to={"/home/client"} className='d-flex text-decoration-none bj-delivery-text-3 ' style={{ backgroundColor: "#1F2A37" }} >
                        <div className='btn bj-btn-outline-primary text-nowrap py-2 d-flex mt-4 ms-4' style={{ borderRadius: "10px", }}> <FaArrowLeft className='me-2 mt-1' />Regresar</div>
                    </Link>
                    <div className=' mt-4 b_borderrr pb-3 ' >
                        <h4 className='text-white ms-4 bj-delivery-text-1'>{user?.name}</h4>
                    </div>

                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        id="fill-tab-example"
                        className="mb-3 m_tabs m_bgblack px-2 border-0 p-4"
                        fill>
                        <Tab
                            eventKey="home"
                            title="Historial"
                            className=" text-white m_bgblack rounded"
                        >
                            <div className='b_table1 w-100'>
                                <table className='b_table '>
                                    <thead>
                                        <tr className='b_thcolor'>
                                            <th>Pedido</th>
                                            <th>Estado </th>
                                            <th>Nota de credito</th>
                                            <th>Accion</th>
                                            <th>Imprimir</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-white b_btnn '>
                                        {orderAlldata.length > 0 ? (
                                            orderAlldata.map((order) => (
                                                <tr key={order.id} className='b_row'>

                                                    {/* <td onClick={() => handleCredit(order.id, order.status)}><div className='b_idbtn bj-delivery-text-2' style={{ borderRadius: "10px" }}>{order.id}</div></td> */}
                                                    <td><Link to={`/home_Pedidos/paymet/${order.id}`}><div className='b_idbtn bj-delivery-text-2' style={{ borderRadius: "10px" }}>{order.id}</div></Link></td>
                                                    

                                                    <td >
                                                        <div style={{ borderRadius: "10px" }} className={`b_idbtn bj-delivery-text-2 b_idbtn_s m-0 ${order.status.toLowerCase() === 'received' ? 'b_indigo' : order.status.toLowerCase() === 'prepared' ? 'b_ora ' : order.status.toLowerCase() === 'delivered' ? 'b_blue' : order.status.toLowerCase() === 'finalized' ? 'b_green' : order.status.toLowerCase() === 'withdraw' ? 'b_indigo' : order.status.toLowerCase() === 'local' ? 'b_purple' : 'text-danger'}`}>
                                                            {order.status.toLowerCase() === 'received' ? 'Recibido' : order.status.toLowerCase() === 'prepared' ? 'Preparado ' : order.status.toLowerCase() === 'Entregado' ? 'b_blue' : order.status.toLowerCase() === 'finalized' ? 'Finalizado' : order.status.toLowerCase() === 'withdraw' ? 'Retirar' : order.status.toLowerCase() === 'local' ? 'Local' : order.status.toLowerCase() === 'delivered' ? 'Entregar' : order.status.toLowerCase() === 'cancelled' ? 'Cancelar' : ' '}</div></td>

                                                    <td>
                                                        {credits && credits?.some(v => v.order_id === order.id) ? (
                                                            <div className='b_text_w bj-delivery-text-2 b_idbtn b_idbtn_c m-0' style={{ borderRadius: "10px", width: "145px", background:"#2f5dadbd"}}>  crédito generado   </div>
                                                        ) : (
                                                            <div
                                                                onClick={() => handleCredit(order.id, order.status)}
                                                                className='b_text_w bj-delivery-text-2 b_idbtn b_idbtn_c m-0'
                                                                style={{ borderRadius: "10px", width: "145px" }}>
                                                                Crear nota de crédito
                                                            </div>
                                                        )}
                                                    </td>



                                                    <td >
                                                    {order.status.toLowerCase() != 'cancelled' ? 
                                                        <div className='b_text_w bj-delivery-text-2 b_idbtn b_idbtn_a  ' style={{ borderRadius: "10px" }} onClick={() => handleShow(order.id, order.status)} >Anular venta</div>
                                                        : " "}
                                                    </td>
                                                    <td>
                                                        <button className='b_edit sj-button-xise' style={{ backgroundColor: "#0694A2" }} onClick={() => handleRecipe(order)}>
                                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                                <path fillRule="evenodd" d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center"> {/* Added colSpan to span all columns */}
                                                    <div className="text-center">No hay datos para mostrar</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </Tab>
                        <Tab eventKey="profile" title="Información" style={{ backgroundColor: "#1F2A37" }} className='py-2 mt-2'>
                            <div className='text-white ms-4 pt-2'>
                                <h4 className='j-kds-body-text-1000'>informacion cliente</h4>
                            </div>
                            <div>
                                <form action="">
                                    <div className='d-flex gap-5 mx-4 mb-4 mt-4 b_inputt flex-grow-1' >
                                        <div className=' b_search text-white a_input_size'>
                                            <label htmlFor="inputPassword2" className="">Nombre</label>
                                            <input type="text" className="form-control bg-gray border-0 bj-slimilar-class-why mt-2" id="inputPassword2" placeholder="4" style={{ backgroundColor: '#374151', borderRadius: "10px" }}
                                                value={(user?.firstname ? user?.firstname : user?.business_name) + " " + (user?.lastname)}  disabled/>
                                        </div>
                                        <div className=' b_search text-white a_input_size'>
                                            <label htmlFor="inputPassword2" className="">DNI</label>
                                            <input type="text" className="form-control bg-gray border-0 mt-2 bj-slimilar-class-why " id="inputPassword2" placeholder="-" value={user?.rut} style={{ backgroundColor: '#374151', borderRadius: "10px" }} />
                                        </div>

                                    </div>
                                </form>
                            </div>
                            <div>
                                <div className='d-flex gap-5 mx-4 b_inputt mb-5 '>
                                    <div className=' b_search text-white a_input_size' >
                                        <label htmlFor="inputPassword2" className="">Correo</label>
                                        <input type="text" className="form-control bg-gray border-0 bj-slimilar-class-why mt-2" id="inputPassword2" placeholder="-" style={{ backgroundColor: '#374151', borderRadius: "10px" }} value={user?.email} disabled/>
                                    </div>
                                    <div className=' b_search text-white a_input_size'>
                                        <label htmlFor="inputPassword2" className=" ">Pedidos</label>
                                        <input type="text" className="form-control bg-gray border-0 bj-slimilar-class-why mt-2" id="inputPassword2" placeholder="-" style={{ backgroundColor: '#374151', borderRadius: "10px" }} value={orderAlldata.length} disabled/>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        {/* <Tab eventKey="longer-tab" title="Nota de credito">

                            <div className='b_table1'>
                                <table className='b_table '>
                                    <thead>
                                        <tr className='b_thcolor'>
                                            <th>Order</th>
                                            <th>State </th>
                                            <th>Credit Note</th>
                                            <th>Action</th>
                                            <th>Print</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-white b_btnn '>
                                        {data.map((order) => (
                                            <tr key={order.id} className='b_row'>
                                                <td className='b_idbtn'>{order.id}</td>
                                                <td ><div className='b_idbtn b_text_w b_idbtn_s m-0'>{order.state1}</div></td>
                                                <td> <div className='b_text_w b_idbtn b_idbtn_c m-0'>{order.credit_note}</div> </td>
                                                <td className='b_text_w b_idbtn b_idbtn_a mb-3 '>
                                                    {order.action1}
                                                </td>
                                                <td>
                                                    <button className='b_edit ' style={{ backgroundColor: "#0694A2" }}><FaPrint /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Tab> */}
                        <Tab
                            eventKey="longer-tab"
                            title="Nota de credito"
                            className=" text-white m_bgblack rounded"
                        >
                            <div className='b_table1 w-100'>
                                <table className='b_table '>
                                    <thead>
                                        <tr className='b_thcolor'>
                                            <th>Pedido</th>
                                            <th>Estado </th>
                                            <th>Nota de credito</th>
                                            <th>Accion</th>
                                            <th>Imprimir</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-white b_btnn '>
                                        {credits.length > 0 ?
                                            credits?.map((order) => (
                                                // console.log(order),

                                                <tr key={order.id} className='b_row'>
                                                    {/* <td ><div className='b_idbtn bj-delivery-text-2' style={{ borderRadius: "10px" }}>{order.order_id}</div></td> */}
                                                    <td><Link to={`/home_Pedidos/paymet/${order.order_id}`}><div className='b_idbtn bj-delivery-text-2' style={{ borderRadius: "10px" }}>{order.order_id}</div></Link></td>

                                                    <td ><div className={`b_idbtn bj-delivery-text-2 b_idbtn_s m-0 ${order.status === 'pending' ? 'b_ora' : order.status === "completed" ? 'b_greena' : 'text-danger'}`} style={{ borderRadius: "10px" }}>{order.status === "completed" ? "Devolucion completada " : "Devolucion pendiente"}</div></td>

                                                    <td onClick={() => handleCreditDetails(order.status, order.order_id)}>
                                                        <div className='b_text_w bj-delivery-text-2 b_idbtn b_idbtn_c m-0' style={{ borderRadius: "10px" }}>
                                                            Ver detalles
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {order.status == 'pending' ? <div className='b_text_w bj-delivery-text-2 b_idbtn b_idbtn_a  ' style={{ borderRadius: "10px" }} onClick={() => deleteProductModal(order.id)}> Anular credito</div> : " " }    
                                                    </td>
                                                    <td onClick={() => handleCreditRecipe(order)}>
                                                        <button className='b_edit sj-button-xise' style={{ backgroundColor: "#0694A2" }}>
                                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                                <path fillRule="evenodd" d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                            :
                                            <tr>
                                                <td colSpan="5" className="text-center"> {/* Added colSpan to span all columns */}
                                                    <div className="text-center">No hay datos para mostrar</div>
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>

                        </Tab>
                    </Tabs>
                </div>
            </div>

            {/* cancel order modal */}

            <Modal
                show={show}
                onHide={handleClose}
                backdrop={true}

                keyboard={false}
                className="m_modal"
            >
                <Modal.Header closeButton className="m_borbot b_border_bb mx-3 ps-0">
                    <Modal.Title className="j-tbl-text-10">Anular Venta</Modal.Title>
                </Modal.Header>
                <Modal.Body className="border-0 pb-0 ">
                    <div className="mb-3">
                        <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label j-tbl-font-11"
                        >
                            Pedido
                        </label>
                        <input
                            type="text"
                            className="form-control j-table_input"
                            id="exampleFormControlInput1"
                            // placeholder="01234"
                            placeholder={orderId}
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label j-tbl-font-11"
                        >
                            Motivo de la anulación
                        </label>
                        <input
                            type="text"
                            className="form-control j-table_input py-3"
                            id="exampleFormControlInput1"
                            placeholder="-"
                            onKeyUp={handlereasons}
                            required
                        />
                        {reasonError && <div className="text-danger errormessage">{reasonError}</div>}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button
                        className="j-tbl-btn-font-1"
                        variant="danger"
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="j-tbl-btn-font-1"
                        variant="primary"
                        onClick={() => {
                            handleClose();
                            handleShow12();
                        }}
                    >
                        Anular pedido
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={show12}
                onHide={handleClose12}
                backdrop={true}

                keyboard={false}
                className="m_modal"
            >
                <Modal.Header closeButton className="border-0" />
                <Modal.Body>
                    <div className="text-center">
                        <img
                            src={require("../Image/check-circle.png")}
                            alt=""
                        />
                        <p className="mb-0 mt-2 h6">Pedido anulado</p>
                        <p className="opacity-75">
                            Su pedido ha sido anulado exitosamente
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

            {/* ===recipe modal==== */}

            <Modal
                show={show11}
                onHide={handleClose11}
                backdrop="static"
                keyboard={false}
                className="m_modal j_topmodal"
            >
                <Modal.Header
                    closeButton
                    className="j-caja-border-bottom p-0 m-3 mb-0 pb-3"
                >
                    <Modal.Title
                        className="modal-title j-caja-pop-up-text-1"
                        id="staticBackdropLabel"
                    >
                        Comprobante de venta
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: printOrderData?.code ? '80vh' : 'auto', overflowY: printOrderData?.code ? 'auto' : 'visible' }}>
                    {/* <Recipt
                              // payment={paymentData}
                              item={cartItems}
                              discount={discount}
                              paymentAmt={customerData}
                              paymentType={selectedCheckboxes}
                            /> */}

                    {printOrderData?.code ?
                        <CreditRecipt ref={qrCodeRef} paymentData={paymentData} creditData={printOrderData} id="credit-receipt-content" />
                        : <OrderRecipt paymentData={paymentData} orderData={printOrderData} />}

                </Modal.Body>
                <Modal.Footer className="sjmodenone">
                    <Button
                        className="btn sjbtnskylight border-0 text-white j-caja-text-1"
                        onClick={() => {
                            handleClose11();
                            handlePrint();
                        }}
                    >
                        <svg
                            className="me-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        Imprimir
                    </Button>
                </Modal.Footer>
            </Modal>


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

                            ¿Estás segura de que quieres eliminar este crédito?
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 ">
                    <Button
                        className="j-tbl-btn-font-1 b_btn_close"
                        variant="danger"
                        onClick={handleCreditDelete}
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


            <Modal
                show={showEditFamfinal}
                onHide={handleCloseEditFamfinal}
                backdrop={true}
                keyboard={false}
                className="m_modal"
            >
                <Modal.Header closeButton className="border-0" />
                <Modal.Body>
                    <div className="text-center">
                        <img src={require("../Image/trash-outline-secondary.png")} alt="" />
                        <p className="mb-0 mt-3 h6">
                            {" "}

                            El crédito se ha eliminado correctamente.
                        </p>
                    </div>
                </Modal.Body>
            </Modal>


        </div>
    )
}

export default Home_detail;
