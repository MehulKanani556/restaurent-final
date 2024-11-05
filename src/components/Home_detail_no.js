import React, { useEffect, useState } from 'react';
import Header from './Header';
import Sidenav from './Sidenav';
import { IoIosArrowBack, IoIosArrowForward, IoMdArrowRoundBack } from 'react-icons/io';
import { MdDateRange, MdEditSquare } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaPrint } from 'react-icons/fa';
import img1 from '../Image/Image.jpg'
import img2 from '../Image/check-circle.png'
import { FiClock } from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Spinner } from 'react-bootstrap';

function Home_detail_no() {

    const { id } = useParams();
    const apiUrl = process.env.REACT_APP_API_URL;
    const API = process.env.REACT_APP_IMAGE_URL;
    const token = localStorage.getItem("token");
    const admin_id = localStorage.getItem("admin_id");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate()
    const { state } = useLocation();
    const [paymentData, setPaymentData] = useState();
    console.log(state);
    console.log(id);


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

    const [creditNote, setCreditNote] = useState();
    const [items, setItems] = useState([]);
    const [returnDetails, setReturnDetail] = useState();
    const [destination, setDestination] = useState();
    const [error, setError] = useState(null);
    const [orderAlldata, setOrderAlldata] = useState([]);
    const [showcreditfinal, setShowcreditfinal] = useState(false)

    useEffect(() => {
        fetchCredit();
        getItems();
        getAllOrder();
    }, [id])

    const getAllOrder = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post(`${apiUrl}/order/getAll`, { admin_id: admin_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrderAlldata(response.data);
        } catch (error) {
            console.error(
                "Error fetching allOrders:",
                error.response ? error.response.data : error.message
            );
        }
        setIsProcessing(false);
    };


    const fetchCredit = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post(`${apiUrl}/order/getCredit`, { admin_id: admin_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data.data);


            const credit = response.data.data?.find((v) => v.order_id == id);

            setCreditNote(credit);
            // console.log(credit);

        } catch (error) {
            console.error(
                "Error fetching allOrder:",
                error.response ? error.response.data : error.message
            );
        }
        setIsProcessing(false);
    }

    const getItems = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/item/getAllDeletedAt`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setItems(response.data.items);
            // setObj1(response.data.items);
            // setFilteredItemsMenu(response.data.items);
        } catch (error) {
            console.error(
                "Error fetching Items:",
                error.response ? error.response.data : error.message
            );
        }
        setIsProcessing(false);
    };

    useEffect(() => {
        handleReturnDetails();
    }, [items, creditNote])


    const handleReturnDetails = () => {
        const details = creditNote?.return_items?.map((v) => {
            console.log(v);

            const matchingItem = items?.find((item) => item.id === v.item_id);
            console.log(matchingItem, v);

            return {
                ...v,
                image: matchingItem ? matchingItem.image : v.image,
                description: matchingItem ? matchingItem.description : v.description,
                name: matchingItem ? matchingItem.name : v.name,
                notes: v.notes
            };
        });
        setReturnDetail(details);
    };

    // console.log(returnDetails);

    const handleDestination = (event) => {
        let notes = event.target.value
        console.log(notes);

        setDestination(notes)
        setError(null)
    }

    console.log(destination);



    // const handleReturn = () => {
    //     if (!destination) {
    //         setError('Ingrese la dirección de retorno');
    //         return;
    //     }

    //     if (!(orderAlldata.some((v) => v.id == destination))) {
    //         setError('No se encontró la orden de compra');
    //         return;
    //     }


    //     setIsProcessing(true);
    //     axios
    //         .post(
    //             `${apiUrl}/order/getCreditUpdate/${creditNote.id}`,
    //             {
    //                 status: "Completed",
    //                 destination: destination
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         )
    //         .then((response) => {
    //             console.log(response.data);
    //             setIsProcessing(false);
    //             navigate('/home/client/detail', {
    //                 replace: true,
    //                 state,
    //             }); 
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //             setIsProcessing(false);
    //             setError('Hubo un error al intentar realizar el retorno');
    //         });

    //         setError(null)
    // }
    const handleReturn = () => {

        localStorage.setItem('credit', JSON.stringify(creditNote.id))

        const payment = {
            rut: paymentData?.rut,
            firstname: paymentData?.firstname || "",
            lastname:paymentData?.lastname || "",
            tour:paymentData?.tour || "",
            address:paymentData?.address || "",
            email:paymentData?.email || "",
            phone:paymentData?.phone || "",
            business_name:paymentData?.business_name || "",
            ltda:paymentData?.ltda,
            receiptType: paymentData?.firstname? "1" : "3"
        }
        localStorage.setItem("payment", JSON.stringify(payment));
        navigate("/counter");
        setError(null)
    }





    const obj1 = {
        name: "Damian Gonzales",
        credCode: "01234",
        id: "01234",
        email: "ejemplo@gmail.com",
        image: img1,
        pName: "Pollo frito crujiente",
        note: "Nota: Sin salsa de tomate",
        pPrice: "5.00",
        pQty: "1",
        totalPrice: "5.00",
        sCode: "0012",
        destination: "-"
    }

    const handleNavigate = () => {

        navigate("/home/client/detail", { state });

    }


    useEffect(() => {
        if (creditNote)
            fetchpayment();
    }, [creditNote])

    const fetchpayment = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/getsinglepayments/${creditNote?.order_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setPaymentData(response.data.data);
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
    return (
        <div className='b_bg_color'>
            <Header />

            <div className='d-flex'>
                <div>
                    <Sidenav />
                </div>
                <div className='flex-grow-1  sidebar overflow-y-scroll '>
                    <div style={{ backgroundColor: "#1F2A37" }} className='pb-3'>
                        <div className=''>
                            <div className='d-flex text-decoration-none ' onClick={handleNavigate} >
                                <div className='btn btn-outline-primary text-nowrap py-2 d-flex mt-4 ms-3' style={{ borderRadius: "10px", }}> <FaArrowLeft className='me-2 mt-1' />Regresar</div>
                            </div>
                        </div>
                        <div className='ms-4 mt-4'>
                            <h5 className='text-white' style={{ fontSize: "18px" }}>Detalles nota de credito</h5>
                        </div>
                        <div className='ms-4 mt-4'>
                            <h5 className='text-white' style={{ fontSize: "18px" }}>DNI: {paymentData?.rut}</h5>
                        </div>
                    </div>

                    <div style={{ backgroundColor: "#1F2A37" }} className='m-3 pb-3' >
                        <div className='mx-4 py-4 text-white b_fs '>
                            Nota de credito
                        </div>
                        <div className='d-flex justify-content-end mx-4 gap-4 text-white '>
                            <div className='fs-6'> <MdDateRange style={{ height: "20px", width: "20px" }} /> <span>{new Date(creditNote?.created_at).toLocaleDateString('en-GB')}</span></div>
                            <div className='fs-6'> <FiClock style={{ height: "20px", width: "20px" }} /> <span>{new Date(creditNote?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                        </div>
                        <div className='mx-4 text-white'>
                            <h5 className='b_fs mb-4'>Datos</h5>
                            <div><button className='b_idbtn  b_orange_b mb-2' style={{ borderRadius: "10px", fontWeight: "600" }}>Devolucion pendiente</button></div>
                        </div>

                        <div>


                        <form action="">
                                <div className=' mx-4 mt-4 b_inputt b_home_field'>
                                    <div className='w-100 b_search text-white mb-3'>
                                        <label htmlFor="inputPassword2 " className="">Nombre</label>
                                        <input type="text" className="form-control bg-gray border-0 mt-2 py-3" value={creditNote?.name} id="inputPassword2" placeholder="-" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} />
                                    </div>
                                    <div className='w-100 b_search text-white mb-3'>
                                        <label htmlFor="inputPassword2" className="">Código nota de credito</label>
                                        <input type="text" className="form-control bg-gray  border-0 mt-2 py-3" value={creditNote?.code} id="inputPassword2" placeholder="-" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} />
                                    </div>
                                </div>
                                <div className='d-flex gap-5 mx-4 m b_inputt b_id_input b_home_field'>
                                    <div className='w-100 b_search  text-white mb-3'>
                                        <label htmlFor="inputPassword2" className="">DNI</label>
                                        <input type="text" className="form-control bg-gray  border-0 mt-2 py-3 " value={paymentData?.rut} id="inputPassword2" placeholder="-" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} />
                                    </div>
                                    <div className='w-100 b_search text-white mb-3'>
                                        <label htmlFor="inputPassword2" className="">Correo electrónico</label>
                                        <input type="text" className="form-control bg-gray  border-0 mt-2 py-3 " value={creditNote?.email} id="inputPassword2" placeholder="-" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} />
                                    </div>
                                </div>
                            </form>

                            <div className='ms-4'>
                                <h6 className='text-white my-4 '>Productos</h6>

                            </div>
                            {returnDetails &&
                                returnDetails?.map((item, index) => (
                                    console.log(item),


                                    <div className='ms-4 d-flex text-white b_borderrr py-3 '>
                                        <div>
                                            <img src={`${API}/images/${item.image}`} alt="" height={50} width={75} className='rounded-3' />
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center w-100'>
                                            <div className='ms-3'>
                                                <div className='b_fs'>{item.name}</div>
                                                <div className='b_fs1' style={{ color: "#16BDCA" }}>{item.notes ? item.notes : "No hay notas"}</div>

                                            </div>
                                            <div className='me-5 '>
                                                <div className=''>
                                                    <span className='me-5'>${item.amount}</span>
                                                    <span>{item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            {/* <div className='ms-4 d-flex text-white b_borderrr pb-3 '>
                                <div>
                                    <img src={obj1.image} alt="" height={50} className='rounded-3' />
                                </div>
                                <div className='d-flex justify-content-between align-items-center w-100'>
                                    <div className='ms-3'>
                                        <div className='b_fs'>{obj1.pName}</div>
                                        <div className='b_fs1' style={{ color: "#16BDCA" }}>{obj1.note}</div>
                                    </div>
                                    <div className='me-5 '>
                                        <div className=''>
                                            <span className='me-5'>${obj1.pPrice}</span>
                                            <span>{obj1.pQty}</span>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className='my-4 mx-4 py-3 p-2 ' style={{ backgroundColor: "#374151", borderRadius: "10px" }}>
                                <div className='text-white'>
                                    <div className=' ms-4 my-3 '>
                                        <div className='my-3  fw-bold' style={{ fontSize: "20px" }}>Costo total</div>
                                        <div className='d-flex justify-content-between'>
                                            <div>Productos</div>
                                            <div className='me-5'>${returnDetails?.reduce((acc, v) => acc + v.amount * v.quantity, 0)}</div>
                                        </div>
                                        <div className='d-flex justify-content-between mt-2'>
                                            <div>IVA 19.00%</div>
                                            <div className='me-5'>${(returnDetails?.reduce((acc, v) => acc + v.amount * v.quantity, 0) * 0.19).toFixed(2)}</div>
                                        </div>
                                        <hr className='w-100' />
                                        <div className='d-flex justify-content-between'>
                                            <div>Total</div>
                                            <div className='me-5 fw-bold'>${returnDetails?.reduce((acc, v) => acc + v.amount * v.quantity, 0) + parseFloat((returnDetails?.reduce((acc, v) => acc + v.amount * v.quantity, 0) * 0.19).toFixed(2))}</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='text-white ms-4'>
                                <h5 className='b_fs'>Pedido</h5>
                            </div>
                            <div className=' mx-4 mt-4 b_inputt b_home_field'>
                                <div className='w-100 b_search text-white mb-3'>
                                    <label htmlFor="inputPassword2" className="">Código origen</label>
                                    <input type="text" className="form-control bg-gray mt-2 border-0 py-3" value={creditNote?.order_id} id="inputPassword2" placeholder="4" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} />
                                </div>
                                <div className='w-100 b_search text-white mb-3'>
                                    <label htmlFor="inputPassword2" className="">Destino</label>
                                    <input type="text" className="form-control bg-gray border-0 py-3 mt-2 " value={destination} id="inputPassword2" placeholder="-" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} onChange={handleDestination} />
                                </div>
                                {error && <div className="text-danger errormessage">{error}</div>}
                            </div>
                            <div className='mx-5'>
                                <div className=' mx-auto mb-4 mt-5' >
                                    <button className='btn btn-primary w-100 ' style={{ backgroundColor: "#147BDE", borderRadius: "10px" }} onClick={handleReturn}>Aplicar nuevo pedido</button>
                                </div>
                            </div>
                        </div>

                    </div>
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
                    {/* {====== credit modal =======} */}

                    <Modal
                        show={showcreditfinal}
                        onHide={() => setShowcreditfinal(false)}
                        backdrop="static"
                        keyboard={false}
                        className="m_modal"
                    >
                        <Modal.Header closeButton className="border-0" />
                        <Modal.Body className="text-center" style={{ backgroundColor: "#1F2A37" }}>
                            <div className='m-auto'>
                                <img src={img2} height={100} width={100} alt="" />
                            </div>
                            <h4 className='j-tbl-pop-1 mb-0'>nota de crédito atualizada</h4>
                            <p className='j-tbl-pop-2'>crédito aplicado con éxito al {destination} pedido</p>
                        </Modal.Body>
                    </Modal>

                </div>
            </div>
        </div>
    )
}

export default Home_detail_no;