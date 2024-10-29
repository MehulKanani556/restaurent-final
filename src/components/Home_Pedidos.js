import React, { useEffect, useState } from 'react';
import Sidenav from './Sidenav';
import Header from './Header';
import { Button, Dropdown, Modal, Spinner } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight, FaFilter } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { Link } from 'react-router-dom';
import axios from 'axios';
import OrderRecipt from './OrderRecipt';

const Home_Pedidos = () => {

    const apiUrl = process.env.REACT_APP_API_URL; // Laravel API URL
    const API = process.env.REACT_APP_IMAGE_URL;
    const [token] = useState(localStorage.getItem("token"));
    // ======Add backEnd Data ====
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderAlldata, setOrderAlldata] = useState([]);
    const [sectordata, setSectordata] = useState([]);
    const [boxes, setboxes] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const admin_id = localStorage.getItem("admin_id");
    const [users, setUsers] = useState([]);
  const [allpayments, setAllpayments] = useState([]);

    // const [selectedFilters, setSelectedFilters] = useState({
    //     All: false,
    //     Received: false,
    //     Prepared: false,
    //     Delivered: false,
    //     finalized: false,
    // });

    const [selectedFilters, setSelectedFilters] = useState({
        Todo: false,
        Recibido: false,
        Preparado: false,
        Entregado: false,
        Finalizado: false,
    });


    useEffect(() => {
        getBox();
        getAllorder();
        getSector();
        getUser();
        fetchAllpayment();

    }, [])

    useEffect(() => {
        // setIsProcessing(true);
        getallData();

        // setIsProcessing(false);
    }, [orderAlldata, sectordata, boxes])
    const fetchAllpayment = async () => {
        setIsProcessing(true);
        try {
          const response = await axios.post(
            `${apiUrl}/get-payments`, { admin_id: admin_id },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setAllpayments(response.data.result);
    
        } catch (error) {
          console.error("Error fetching boxes:", error);
        }
        setIsProcessing(false);
      }

    const getUser = async () => {
        // setIsProcessing(true);

        try {
            const response = await axios.get(`${apiUrl}/get-users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data);
            setUsers(response.data);
        } catch (error) {
            console.error(
                "Error fetching allOrder:",
                error.response ? error.response.data : error.message
            );
        }
        //   setIsProcessing(false);

    }
    const getAllorder = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post(`${apiUrl}/order/getAll`, {admin_id: admin_id},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOrderAlldata(response.data);
        } catch (error) {
            console.error(
                "Error fetching allOrder:",
                error.response ? error.response.data : error.message
            );
        }
        setIsProcessing(false);
    }

    const getSector = async () => {
        // setIsProcessing(true);

        try {
            const response = await axios.post(`${apiUrl}/sector/getWithTable`,{admin_id: admin_id}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSectordata(response.data.data);
        } catch (error) {
            console.error(
                "Error fetching sector and Table Data:",
                error.response ? error.response.data : error.message
            );
        }
        //   setIsProcessing(false);

    }
    const getBox = async () => {
        // setIsProcessing(true);

        try {
            const response = await axios.get(`${apiUrl}/get-boxs`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setboxes(response.data);
        } catch (error) {
            console.error(
                "Error fetching allOrder:",
                error.response ? error.response.data : error.message
            );
        }
        //   setIsProcessing(false);

    }

    const getallData = () => {

        let nsdata = [];
        orderAlldata.map((v) => {
            if (v.status != "cancelled") {
                let obj = { ...v };
                let flages = 0;
                let flageb = 0;
                sectordata.map(s => s.tables.map((a) => {
                    console.log("order", s);

                    if (a.id === v.table_id) { // Changed '==' to '===' for strict equality
                        obj.sector = s.name;
                        obj.table = a.name;
                        obj.table_status = a.status; // Ensure to capture the table status
                        flages = 1;

                    }
                }));
          
                
                users.map((b) => {
                    if (b.id == v.user_id) {
                        obj.box = b.name;
                        flageb = 1;
                    }
                })
                nsdata.push(obj);
            }
        })
        nsdata.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOrderData(nsdata);
    }



    const handlerout = (id) => {
        // console.log("iiddd");
        localStorage.setItem('proId', JSON.stringify(id));
    }

    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // console.log(searchTerm);




    // =========end=========

  



    // new file
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    // ======================
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [name]: checked,
        }));
    };

    const clearFilter = (name) => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [name]: false,
        }));
    };


    let filteredItems = orderData.filter((item) => {

        const matchesSearch = item.box?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.table?.toLowerCase().includes(searchTerm.toLowerCase());

        if (selectedFilters.Todo) {
            return matchesSearch;
        } else {
            const activeFilters = Object.keys(selectedFilters).filter((filter) => selectedFilters[filter]);
            if (activeFilters.length === 0) {
                return matchesSearch;
            }
            return (
                matchesSearch
                &&
                selectedFilters[
                item.status.toLowerCase() === "received" ? "Recibido" :
                    item.status.toLowerCase() === "prepared" ? "Preparado" :
                        item.status.toLowerCase() === "delivered" ? "Entregado" :
                            item.status.toLowerCase() === "finalized" ? "Finalizado" : null
                ]
            );
        }


    });

    // console.log(filteredItems);



    // console.log(selectedFilters);

    // =======new
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    // console.log(isProcessing);

    // =======new
    const [show11, setShow11] = useState(false);
    const handleClose11 = () => {
        setShow11(false);
    };
    const handleShow11 = () => setShow11(true);
    const [paymentData, setPaymentData] = useState();
    const [printOrderData, setPrintOrderData] = useState();

    const handleRecipe = async (order) => {

        if (!(order.status === 'delivered')) {
            console.error('Cannot print a delivered order.');
            return;
        }

        // console.log(order);

        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/getsinglepayments/${order.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
            setIsProcessing(false);
            if (response.data.success) {
                setPaymentData(response.data.data);
                setPrintOrderData(order);
                handleShow11();
            } else {
                setIsProcessing(false);
                alert("El pago está pendiente")
                console.error('Error fetching payment data:', response.data.message);
            }

        } catch (error) {
            console.error(
                "Error fetching allOrders:",
                error.response ? error.response.data : error.message
            );
            setIsProcessing(false);
            // alert("El pago está pendiente")

        } finally {
            setIsProcessing(false);
        }
    };
    const handlePrint = async () => {
        const printContent = document.getElementById("receipt-content");
        if (printContent) {

            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            document.body.appendChild(iframe);


            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write("<html><head><title>Print Receipt</title>");
            iframe.contentWindow.document.write("<style>body { font-family: Arial, sans-serif; }</style>");
            iframe.contentWindow.document.write("</head><body>");
            iframe.contentWindow.document.write(printContent.innerHTML);

            iframe.contentWindow.document.write("</body></html>");
            iframe.contentWindow.document.close();


            iframe.onload = function () {
                try {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                } catch (e) {
                    console.error("Printing failed", e);
                }
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 500);
            };
        } else {
            console.error("Receipt content not found");
        }
    };


    return (
        <div>
            <div className='b_bg_color'>
                <Header />
                <div className='d-flex'>
                    <div>
                        <Sidenav />
                    </div>
                    <div className='flex-grow-1 overflow-hidden sidebar b_bg_table '>
                        <div style={{ padding: "20px" }}>
                            <div className="j-usuarios-h2">
                                <h2 className='text-white'>Pedidos</h2>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className='me-2 '>
                                        <div className="m_group">
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="m_icon">
                                                <g>
                                                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
                                                </g>
                                            </svg>
                                            <input
                                                className="m_input ps-5"
                                                type="search"
                                                placeholder="Buscar"
                                                value={searchTerm}
                                                onChange={handleSearch}
                                            />
                                        </div>
                                    </div>
                                    <Dropdown data-bs-theme="dark" className="m_drop">
                                        <Dropdown.Toggle
                                            id="dropdown-button-dark-example1"
                                            variant="outline-primary"
                                            style={{ fontSize: "12px" }}
                                            className="btn btn-outline-primary b_togllle b_border_out b_ttt"
                                        >
                                            <FaFilter /> &nbsp; <span className="b_ttt text-white">Filtro</span>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="m14  m_filter">
                                            <div className="px-3 py-1 d-flex gap-2 align-items-center fw-500">
                                                <input
                                                    className='j-change-checkbox'
                                                    type="checkbox"
                                                    // name="Todo"
                                                    name="Todo"
                                                    checked={selectedFilters.Todo}
                                                    // checked={selectedFilters.All}
                                                    onChange={handleCheckboxChange}
                                                />{" "}
                                                <span className="fw-500">Todo</span>
                                            </div>
                                            <div className="px-3 py-1 d-flex gap-2 align-items-center">
                                                <input
                                                    className='j-change-checkbox'
                                                    type="checkbox"
                                                    name="Recibido"
                                                    // name="Received"
                                                    checked={selectedFilters.Recibido}
                                                    // checked={selectedFilters.Received}
                                                    onChange={handleCheckboxChange}
                                                />{" "}
                                                <span>Recibido</span>
                                            </div>
                                            <div className="px-3 py-1 d-flex gap-2 align-items-center">
                                                <input
                                                    className='j-change-checkbox'
                                                    type="checkbox"
                                                    name="Preparado"
                                                    //  name="Prepared"
                                                    checked={selectedFilters.Preparado}
                                                    // checked={selectedFilters.Prepared}
                                                    onChange={handleCheckboxChange}
                                                />{" "}
                                                <span>Preparado</span>
                                            </div>
                                            <div className="px-3 py-1 d-flex gap-2 align-items-center">
                                                <input
                                                    className='j-change-checkbox'
                                                    type="checkbox"
                                                    name="Entregado"
                                                    // name="Delivered"
                                                    checked={selectedFilters.Entregado}
                                                    // checked={selectedFilters.Delivered}
                                                    onChange={handleCheckboxChange}
                                                />{" "}
                                                <span>Entregado</span>
                                            </div>
                                            <div className="px-3 py-1 d-flex gap-2 align-items-center">
                                                <input
                                                    className='j-change-checkbox'
                                                    type="checkbox"
                                                    name="Finalizado"
                                                    // name="finalized"
                                                    checked={selectedFilters.Finalizado}
                                                    // checked={selectedFilters.Finalizado}
                                                    onChange={handleCheckboxChange}
                                                />{" "}
                                                <span>Finalizado</span>
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <div className="p-3 ps-0 m_bgblack d-flex align-items-center">
                                    <span className="text-white m14">Filtro:</span>
                                    {Object.keys(selectedFilters).map(
                                        (filter) =>
                                            selectedFilters[filter] && (
                                                <div
                                                    key={filter}
                                                    className="d-inline-block ms-2 d-flex align-items-center  m12"
                                                >
                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        onClick={() => clearFilter(filter)}
                                                        className="rounded-3 m12 "
                                                        style={{ fontWeight: "500" }}
                                                    >
                                                        {filter} &nbsp;{" "}
                                                        <span className="m16">
                                                            <MdClose />
                                                        </span>
                                                    </Button>
                                                </div>
                                            )
                                    )}
                                </div>

                                {/* ======new */}
                                <div className='text-white  d-flex  b_arrow' style={{ alignItems: "baseline", cursor: "pointer" }}>
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
                                            vista <span className='text-white'>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)}</span> de <span className='text-white'>{filteredItems.length}</span>
                                            {/* vista <span className='text-white'>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)}</span> de <span className='text-white'>{data.length}</span> */}
                                        </p>
                                    </div>
                                </div>
                                {/* ======new */}

                            </div>
                        </div>

                        <div className='b_table1'>
                            <table className='b_table mb-4 p-0'>
                                <thead>
                                    <tr className='b_thcolor'>
                                        <th>Pedido</th>
                                        <th className='text-nowrap'>Sector </th>
                                        <th>Mesa</th>
                                        <th>Usuario</th>
                                        <th>Estado</th>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Tipo</th>
                                        <th>Ver</th>
                                        <th>Imprimir</th>
                                    </tr>
                                </thead>
                                <tbody className='text-white b_btnn '>
                                    {/* new========== */}
                                    {console.log(currentItems)}
                                    {currentItems.length > 0 ?
                                         currentItems.map((order) => (
                                             <tr key={order.id} className='b_row'>
                                                {/* <Link to={"/home_Pedidos/paymet"}> */}
                                                <Link to={`/home_Pedidos/paymet/${order.id}`}>
                                                    <td className='b_idbtn bj-delivery-text-2 ms-3' style={{ borderRadius: "10px" }}>{order.id}</td>
                                                </Link>
                                                <td>{order.sector}</td>
                                                {console.log(order.sector)}
                                             
                                                <td className='b_text_w  bj-delivery-text-2'>{order.table}</td>
                                                <td className='b_text_w  bj-delivery-text-2'>{order.box}</td>
                                                {/* <td className={`bj-delivery-text-2  b_btn1 mb-3 ms-3  p-0 text-nowrap d-flex  align-items-center justify-content-center ${order.estado === 'Recibido' ? 'b_indigo' : order.estado === 'Preparado' ? 'b_ora ' : order.estado === 'Entregado' ? 'b_blue' : order.estado === 'Finalizado' ? 'b_green' : order.estado === 'Retirar' ? 'b_indigo' : order.estado === 'Local' ? 'b_purple' : 'text-danger'}`}>{order.estado}</td> */}
                                                <td className={`bj-delivery-text-2  b_btn1 mb-3 ms-3  p-0 text-nowrap d-flex  align-items-center justify-content-center 
                                                        ${allpayments.some(payment => payment.order_master_id === order.id)&& order?.status.toLowerCase() === 'delivered' ? 'b_blue' : 
                                                        order.status.toLowerCase() === 'received' ? 'b_indigo' : order.status.toLowerCase() === 'prepared' ? 'b_ora' : order.status.toLowerCase() === 'delivered' ? 'b_blue' : order.status.toLowerCase() === 'finalized' ? 'b_green' : order.status.toLowerCase() === 'withdraw' ? 'b_indigo' : order.status.toLowerCase() === 'local' ? 'b_purple' : 'text-danger'}`}>
                                                    {allpayments.some(payment => payment.order_master_id === order.id)&& order.status.toLowerCase() === 'delivered' ? 'Pagado' : 
                                                    order.status.toLowerCase() === 'received' ? 'Recibido' : order.status.toLowerCase() === 'prepared' ? 'Preparado ' : order.status.toLowerCase() === 'delivered' ? 'Entregado' : order.status.toLowerCase() === 'finalized' ? 'Finalizado' : order.status.toLowerCase() === 'withdraw' ? 'Retirar' : order.status.toLowerCase() === 'local' ? 'Local' : ' '}
                                                </td>
                                                <td className=' bj-delivery-text-2'>{new Date(order.created_at).toLocaleDateString('en-GB')}</td>
                                                <td className=' bj-delivery-text-2'>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                <td className=' bj-delivery-text-2'> 
                                                {order.order_type.toLowerCase() === 'local' ? 'Local' : order.order_type.toLowerCase().includes("with") ? 'Retiro ' : order.order_type.toLowerCase() === 'delivery' ? 'Entrega' : order.order_type.toLowerCase() === 'uber' ? 'Uber' : order.order_type.toLowerCase().includes("plat") ? "Plataforma" : order.order_type}
                                                    </td>
                                                <Link to={`/home_Pedidos/paymet/${order.id}`}>
                                                    <td className='b_text_w ' onClick={() => handlerout(order.id)}>
                                                        <button className='b_edit bj-delivery-text-2'>Ver detalles</button>
                                                    </td>
                                                </Link>
                                                <td>
                                                    <button className={`b_edit  ${(order.status === 'delivered') ? 'b_Enew' : 'b_Eold'}`} onClick={() => handleRecipe(order)}>
                                                        <svg className="text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                            <path fillRule="evenodd" d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td colSpan="10" className="text-center"> {/* Added colSpan to span all columns */}
                                                <div className="text-center">No hay datos para mostrar</div>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>


                </div>

            </div>

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
                    <OrderRecipt paymentData={paymentData} orderData={printOrderData} />

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
    );
};

export default Home_Pedidos;
