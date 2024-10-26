import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Sidenav from './Sidenav';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { MdEditSquare, MdOutlineAccessTimeFilled } from 'react-icons/md';
import { CgCalendarDates } from 'react-icons/cg';
import { FiPlus } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import pic1 from '../img/Image.png';
import pic2 from '../img/Image(1).jpg';
import pic3 from '../img/Image (2).png';
import { FaCircleCheck } from 'react-icons/fa6';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import img1 from '../Image/check-circle.png'
import { Nav, Tab, Container, Row, Col, Accordion, Modal, Spinner, Button } from 'react-bootstrap';
import axios from 'axios';


export default function Home_crear({ item }) {
    const { id } = useParams();
    const apiUrl = process.env.REACT_APP_API_URL;
    const API = process.env.REACT_APP_IMAGE_URL;
    const admin_id = localStorage.getItem("admin_id");

    const token = localStorage.getItem("token");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate()
    const { state } = useLocation();
    console.log(state);
    const [orderUser, setOrderUser] = useState([]);
    console.log(id);
    // const [counts, setCounts] = useState(item ? { [item.id]: 0 } : {});
    // const [counts, setCounts] = useState(item ? { [item.id]: 0 } : {});
    const [customerData, setCustomerData] = useState();

    const [visibleInputId, setVisibleInputId] = useState(null);
    const [noteValues, setNoteValues] = useState('');

    const noteInputRefs = useRef({}); // Create a ref to store note input references
    const inputRef = useRef(null); // Ref for the input element

    // const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    // const handleCheckboxChange = (value) => {
    //     if (selectedCheckboxes.includes(value)) {
    //         setSelectedCheckboxes((prev) => prev.filter((item) => item !== value));
    //         setCustomerData();
    //     } else {
    //         setSelectedCheckboxes((prev) => [...prev, value]);
    //     }
    // };

    const [selectedCheckbox, setSelectedCheckbox] = useState('1');
    const [selectedPaytype, setSelectedPaytype] = useState(null);
    const [activeKey, setActiveKey] = useState('0');
    const handleCheckboxChange = (value) => {
        if (selectedCheckbox === value) {
            setSelectedCheckbox(null);
            setActiveKey(null);
            setCustomerData();
        } else {
            setSelectedCheckbox(value);
            setActiveKey(value === "2" ? "1" : null); // Open second accordion if "Pago de caja" is selected
        }
    };

    const handleradiobox = (data) => {
        setSelectedPaytype(data)
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

    const [showcreditfinal, setShowcreditfinal] = useState(false)


    const [price, setPrice] = useState('20');
    const handleprice = (event) => {
        let value = event.target.value;
        if (value.startsWith('$')) {
            value = value.substring(1);
        }

        setPrice(value);
    };
    const [product, setProduct] = useState([
        {
            id: 1,
            image: pic1,
            name: 'Pollo frito crujiente',
            description: 'Las especialidad de la casa',
            price: '$10.00',
            quantity: 1,
            note: '+ Agregar nota'
        },
        {
            id: 2,
            image: pic2,
            name: 'Guitig',
            description: 'con gas',
            price: '$2.00',
            quantity: 2,
            note: 'Nota: Al clima'
        },
        {
            id: 3,
            image: pic3,
            name: 'Gelatina',
            description: 'con gas',
            price: '$2.00',
            quantity: 2,
            note: 'Nota :Con cerezas a los lados'
        }
    ]);
    // const initialCounts = product.reduce((acc, item) => {
    //     acc[item.id] = item.quantity;
    //     return acc;
    // }, {});

    // const [counts, setCounts] = useState(item ? { [item.id]: 0 } : initialCounts);
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
    const [order1, setOrder1] = useState("01234");
    const [order2, setOrder2] = useState("0123456789");
    const [email, setEmail] = useState("ejemplo@gmail.com");

    // Event handlers
    // const increment = (id) => {
    //     setCounts(prevCounts => ({
    //         ...prevCounts,
    //         [id]: prevCounts[id] + 1
    //     }));
    // };

    // const decrement = (id) => {
    //     setCounts(prevCounts => ({
    //         ...prevCounts,
    //         [id]: prevCounts[id] > 0 ? prevCounts[id] - 1 : 0
    //     }));
    // };

    // const deleteProduct = (id) => {
    //     setProduct(prevProducts => prevProducts.filter(product => product.id !== id));
    // };


    useEffect(() => {
        const tabs = document.querySelectorAll('#pills-tab button');

        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                tabs.forEach(button => {
                    button.classList.remove('bg-primary', 'text-light');
                    button.classList.add('bg-light', 'text-dark');
                });

                tab.classList.remove('bg-light', 'text-dark');
                tab.classList.add('bg-primary', 'text-light');
            });
        });

        return () => {
            tabs.forEach(tab => {
                tab.removeEventListener('click', () => { });
            });
        };
    }, []);


    const [activeTab, setActiveTab] = useState("home");
    const [showDeliveryButton, setShowDeliveryButton] = useState(true);
    const [showCancelOrderButton, setShowCancelOrderButton] = useState(false);
    const handleTabSelect = (selectedTab) => {
        setActiveTab(selectedTab);
        if (selectedTab === "profile") {
            setShowDeliveryButton(false);
            setShowCancelOrderButton(true);
        } else {
            setShowDeliveryButton(true);
            setShowCancelOrderButton(false);
        }
    };

    const [navactiveTab, setNavactiveTab] = useState('productos');

    const handleTabChange = (key) => {
        setNavactiveTab(key);
    };



    // =========================API====================

    const [user, setUser] = useState([]);
    const [orderAlldata, setOrderAlldata] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [items, setItems] = useState([]);
    const [userPayment, setUserPayment] = useState();
    const [originalCounts, setOriginalCounts] = useState({});
    const [itemsError, setItemsError] = useState('');

    const [payError, setPayError] = useState('');


    console.log(userPayment);

    useEffect(() => {
        // setIsProcessing(true);
        const initialCounts = orderDetails?.reduce((acc, item) => {
            acc[item.id] = item.quantity; // Store original quantity
            return acc;
        }, {});
        setOriginalCounts(initialCounts);
    }, [orderDetails]);


    useEffect(() => {
        getAllorder();
        getItems();
        fetchUserPayment();
        fetchPaymentUser();

    }, [id, deleteProductId]);

    useEffect(() => {
        fetchUser();
        handleOrderDetails();
    }, [orderAlldata, items, deleteProductId]);

    //    -------- Edite order Qyt ----
    const initialCounts = orderDetails?.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
    }, {});

    const [counts, setCounts] = useState(item ? { [item.id]: 0 } : initialCounts)

    useEffect(() => {

        console.log(orderDetails);
        if (orderDetails) {
            const initialCounts = {};
            orderDetails.forEach(item => {
                initialCounts[item.id] = item.quantity;
            });
            setCounts(initialCounts);
        }
    }, [orderDetails, deleteProductId]);


    const getAllorder = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post(`${apiUrl}/order/getAll`, { admin_id: admin_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrderAlldata(response.data.find((v) => v.id == id));
            console.log(response.data.find((v) => v.id == id));

        } catch (error) {
            console.error(
                "Error fetching allOrder:",
                error.response ? error.response.data : error.message
            );
        }
        setIsProcessing(false);
    }

    const fetchUserPayment = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/getsinglepayments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserPayment(response.data.data);
            //   console.log(response.data.data);  
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setIsProcessing(false);
    };

    const fetchUser = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/get-user/${orderAlldata.user_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data[0]);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setIsProcessing(false);
    };

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



    // console.log(user,orderAlldata);

    const handleOrderDetails = () => {
        const details = orderAlldata?.order_details?.map((orderItem) => {
            const matchingItem = items?.find((item) => item.id === orderItem.item_id);
            return {
                ...orderItem,
                image: matchingItem ? matchingItem.image : orderItem.image,
                description: matchingItem ? matchingItem.description : orderItem.description,
            };
        });
        setOrderDetails(details);
    };


    const increment = async (proid, item_id, quantity) => {
        const originalQuantity = originalCounts[proid]; // Get the original quantity

        if (originalQuantity < quantity + 1) { // Check if incrementing exceeds original quantity
            return; // Prevent increment if it exceeds original quantity
        }
        try {
            const response = await axios.post(
                `${apiUrl}/order/updateItem/${proid}`,
                {
                    "order_id": id,
                    "order_details": [
                        {
                            "item_id": item_id,
                            "quantity": quantity + 1
                        }
                    ]
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Note added successfully:", response.data);
        } catch (error) {
            console.error(
                "Error adding note:",
                error.response ? error.response.data : error.message
            );
        }

        const index = orderDetails.findIndex((item) => item.id === proid);
        if (index !== -1) {
            orderDetails[index].quantity++;
        }

        setCounts(prevCounts => ({
            ...prevCounts,
            [proid]: prevCounts[proid] + 1
        }));

    };

    const decrement = async (proid, item_id, quantity) => {

        if (quantity <= 1) {
            return;
        }

        try {
            const response = await axios.post(
                `${apiUrl}/order/updateItem/${proid}`,
                {
                    "order_id": id,
                    "order_details": [
                        {
                            "item_id": item_id,
                            "quantity": quantity - 1
                        }
                    ]
                },
                {
                    headers: {
                        Authorization: `Bearer 2816|ojbPri4TvtQKBLMDfMp3wnCaYrpUf5tpEv1UZ3dp07d9f3e0`,
                    },
                }
            );
            console.log("Note added successfully:", response.data);
        } catch (error) {
            console.error(
                "Error adding note:",
                error.response ? error.response.data : error.message
            );
        }

        const index = orderDetails.findIndex((item) => item.id === proid);
        console.log(index);

        if (index !== -1) {
            if (orderDetails[index].quantity > 1) {
                orderDetails[index].quantity--;
            }
        }
        setCounts(prevCounts => ({
            ...prevCounts,
            [proid]: prevCounts[proid] > 1 ? prevCounts[proid] - 1 : 1
        }));
    };


    // =====Delete Item ======

    const deleteProductModal = (id) => {
        setShowDeleteConfirmation(true);
        setDeleteProductId(id);
    }

    const deleteProduct = async () => {
        try {
            const response = await axios.delete(`${apiUrl}/order/deleteSingle/${deleteProductId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!(response.success == "false")) {
                setDeleteProductId(null);
                setShowDeleteConfirmation(false);
                handleShowEditFamfinal();
            }

        } catch (error) {
            console.error(
                "Error Delete OrderData:",
                error.response ? error.response.data : error.message
            );
        }


        setOrderDetails(prevProducts => prevProducts.filter(product => product.id !== id));
    };

    const [selectedItems, setSelectedItems] = useState([]); // State to hold selected items




    const handleReturnItems = (item) => {
        console.log(item);
        if (selectedItems.some(cartItem => cartItem.id === item.id)) {

            setSelectedItems(prevCart => prevCart.filter(cartItem => cartItem.id !== item.id));
        } else {

            setSelectedItems(prevCart => [...prevCart, item]);
        }
    };

    console.log(selectedItems);


    // ===============note ========


    // console.log(noteValues);


    const toggleInput = (id) => {
        const item = orderDetails.find(item => item.id === id); // Find the item based on the id
        if (item) {
            setVisibleInputId(visibleInputId === id ? null : id);
            if (visibleInputId !== id) {
                noteInputRefs.current[id] = item.notes || ''; // Set the current note value when toggling
            }
        } else {
            console.error(`Item with id ${id} not found`); // Log an error if the item is not found
        }
    };

    const handleNoteChange = (id, e) => {
        noteInputRefs.current[id] = e.target.value; // Store the value in the ref
    };

    const handleNoteSubmit = async (id) => {
        try {
            const response = await axios.post(
                `${apiUrl}/order/addNote/${id}`,
                { notes: noteInputRefs.current[id] }, // Use the value from the ref
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Note added successfully:", response.data);

            // Reset the input value in the ref
            noteInputRefs.current[id] = '';
            setVisibleInputId(null);
            getAllorder();
            handleOrderDetails();
        } catch (error) {
            console.error(
                "Error adding note:",
                error.response ? error.response.data : error.message
            );
        }
    };

    const handleNoteKeyDown = (id) => async (e) => {
        if (e.key === 'Enter') {
            await handleNoteSubmit(id);
        }
    };

    const handleInputBlur = (id) => {
        handleNoteSubmit(id); // Submit the note when input loses focus
    };

    // =============end note==========

    const handleContinuarClick = () => {

        if (selectedItems.length > 0) {
            setNavactiveTab('nota-de-credito');
        } else {
            setItemsError('Seleccione cualquier Productos')
        }

    };

    useEffect(() => {
        if (selectedItems.length > 0) {
            setItemsError('');
        }
        if (selectedCheckbox) {
            setPayError('');
        }

    }, [selectedItems, selectedCheckbox, selectedPaytype])

    const generateUniqueCreditNoteNumber = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };

    // Example usage
    // const creditNoteNumber = generateUniqueCreditNoteNumber();
    // console.log(creditNoteNumber);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const newCreditNoteNumber = generateUniqueCreditNoteNumber();
    //         console.log(newCreditNoteNumber); 
    //     }, 1000);
    //     return () => clearInterval(interval); 
    // }, []);

    // console.log(orderAlldata);



    // ===========  Generate  credit ========

    const handleCreditNote = async () => {
        // Check if selectedCheckbox is null
        if (!selectedCheckbox) {
            setPayError('Seleccione el tipo de pago'); // Set error message
            return; // Exit the function
        }


        // Check if selectedCheckbox is 2 and selectedPaytype is null
        if (selectedCheckbox == 2 && selectedPaytype == null) {
            console.log("vascas");

            setPayError('Seleccione el tipo de pago'); // Set error message
            return; // Exit the function
        } else if (selectedCheckbox === 1) {
            setPayError(''); // Clear error if checkbox 1 is selected
        }

        // Show the staticBackdrop modal if there is no pay error
        if (payError === '') {
            const creditNote = {
                admin_id: admin_id,
                credit_note: {
                    order_id: orderAlldata.id,                  // Assuming `order_id` should be an integer
                    payment_id: userPayment.id,
                    admin_id: admin_id,
                    status: selectedPaytype ? "completed" : "Pending",
                    name: `${userPayment?.firstname || userPayment?.business_name || ''} ${userPayment?.lastname || ''}`.trim(),
                    email: userPayment.email,
                    delivery_cost: orderAlldata.delivery_cost,
                    code: generateUniqueCreditNoteNumber(),
                    destination: null,
                    payment_status: selectedPaytype || "futura compra",
                    credit_method: `${selectedCheckbox == 1 ? "future purchase" :
                        selectedCheckbox == 2 && selectedPaytype == "Efectivo" ? "cash" :
                            selectedCheckbox == 2 && selectedPaytype == "Tarjeta de debito" ? " debit" :
                                selectedCheckbox == 2 && selectedPaytype == "Tarjeta de credito" ? "credit" : null
                        }`,
                },
                return_items: selectedItems,

            };

            console.log(creditNote);

            try {
                const response = await axios.post(`${apiUrl}/order/creditNote`, creditNote, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log(response);

                if (response.data.success) {
                    setShowcreditfinal(true);
                    setTimeout(() => {
                        setShowcreditfinal(false);
                        let use = { user: { ...orderUser } }; // if you need to modify user later
                        navigate("/home/client/detail", {
                            state: state ? state : use
                        });
                    }, 2000);
                } else {
                    console.error("Error: The request was successful, but the response indicates a failure.");
                }
            } catch (error) {
                console.error("Error creating order:", error);
            }
        }
    };
    const fetchPaymentUser = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post(`${apiUrl}/get-payments`, { admin_id: admin_id }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(response.data.result);

            // Group users and collect their order_master_ids
            const groupedUsers = groupUsersByDetails(response.data.result);
            console.log(groupedUsers);

            //   console.log(id);
            setOrderUser(groupedUsers.find(v => v.orderIds.some(a => a == id)));
            //   console.log(groupedUsers.find(v => v.orderIds.some(a=>a == id)));

        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setIsProcessing(false);
    }
    //   console.log(orderUser);


    const groupUsersByDetails = (users) => {
        
        setIsProcessing(true);
        const groupedUsers = {};
    
        users.forEach(user => {
          const displayName = user.firstname || user.business_name;
        const fullName = `${displayName} ${user.lastname || ''}`.trim();
        const key = `${fullName}|${user.rut}`;
    
          if (!groupedUsers[key]) {
            groupedUsers[key] = {
              ...user,
              orderIds: [user.order_master_id]
            };
          } else {
            groupedUsers[key].orderIds.push(user.order_master_id);
          }
        //   console.log(groupedUsers);
          
        });
        setIsProcessing(false);
        // console.log(Object.values(groupedUsers));
    
        return Object.values(groupedUsers);
      }

    return (
        <div className="m_bg_black">
            <Header />
            <div className="d-flex">
                <Sidenav />
                <div className="flex-grow-1 sidebar overflow-hidden">
                    <div className="p-3 m_bgblack text-white">
                        <Link to={`/home/client`} className='d-flex text-decoration-none' >
                            <div className='btn bj-btn-outline-primary text-nowrap py-2 d-flex mt-2 ms-3' style={{ borderRadius: "10px", }}> <FaArrowLeft className='me-2 mt-1' />Regresar</div>
                        </Link>
                        <div className="mt-3 ms-3">
                            <h5 style={{ fontSize: "18px" }}>Crear nota de credito</h5>
                        </div>
                        <div className='d-flex flex-wrap me-4'>
                            {showCancelOrderButton ? (
                                <div className="d-flex justify-content-between align-items-center flex-wrap ms-3">
                                    <div className="text-white  my-2">
                                        DNI :- {userPayment?.rut}
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-between align-items-center flex-wrap ms-3">
                                    <div className="text-white  my-2">
                                        DNI :- {userPayment?.rut}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <Container className='p-0' fluid style={{ backgroundColor: "#111928" }}>
                        <Row className='p-0'>
                            <Col className='p-0'>
                                <Tab.Container defaultActiveKey="productos" activeKey={navactiveTab} onSelect={handleTabChange}>
                                    <Tab.Content>
                                        <div className='row'>
                                            <div className="col-xl-7 col-12 overflow-hidden px-0">
                                                <div className="p-3 m_bgblack text-white m-3 p-3 me-2">
                                                    <p className='p-3' style={{ fontSize: "18px" }}>Listado</p>
                                                    <Nav className="custom-nav-pills">
                                                        <div className="line123 line333  flex-grow-1">
                                                            <div className="text-decoration-none j-icpn-text-color px-2 b_text_dark">
                                                                <Nav.Item>
                                                                    <Nav.Link eventKey="productos" className="nav-link-custom p-0">
                                                                        <FaCircleCheck className="mx-1" /> Productos
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-decoration-none px-2 b_text_dark">
                                                                <Nav.Item>
                                                                    <Nav.Link eventKey="nota-de-credito" className="nav-link-custom p-0">
                                                                        <FaCircleCheck className="mx-1" /> Nota de crédito
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                            </div>
                                                        </div>
                                                    </Nav>

                                                    <Tab.Pane eventKey="productos">
                                                        {navactiveTab === 'productos' && (
                                                            <div className="a_deli_infolist p-5 mt-5 mx-2 mb-3">
                                                                {orderDetails?.map((item) => (

                                                                    <div key={item.id}>
                                                                        <div className="py-3 ">
                                                                            <div className="row">
                                                                                <div className="col-sm-6">
                                                                                    <div className="d-flex align-content-center">
                                                                                        <input type="checkbox"
                                                                                            className="me-4  custom-checkbox"
                                                                                            style={{ marginTop: "22px" }}
                                                                                            onClick={() => handleReturnItems(item)}
                                                                                            checked={selectedItems.some((v) => v.id == item.id)}
                                                                                        />
                                                                                        <img src={`${API}/images/${item.image}`} alt="pic" height={60} width={60} />
                                                                                        <div className="ms-4">
                                                                                            <div className="text-nowrap">{item.name}</div>
                                                                                            <div className="mt-3 a_mar_new">{item.description}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-3 a_text_price">
                                                                                    <button className="b_count11 btn btn-secondary" onClick={() => decrement(item.id, item.item_id, item.quantity)}>-</button>
                                                                                    <span className="pe-3 ms-2">{counts[item.id]}</span>
                                                                                    <button
                                                                                        className="b_count btn btn-secondary"
                                                                                        onClick={() => increment(item.id, item.item_id, item.quantity)}
                                                                                        disabled={!originalCounts || originalCounts[item.id] === undefined || originalCounts[item.id] === item.quantity}
                                                                                    >+</button>
                                                                                </div>
                                                                                <div className="col-sm-2 a_text_price">
                                                                                    <div className="pe-5 fw-bold">${item.amount}</div>
                                                                                </div>
                                                                                <div className="col-sm-1">
                                                                                    <button className="b_bg_red btn" onClick={() => deleteProductModal(item.id)}>
                                                                                        <RiDeleteBinLine />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ marginBottom: "68px", cursor: "pointer" }}>
                                                                            {item.notes === null ? (
                                                                                <div key={item.id}>
                                                                                    {visibleInputId !== item.id && (
                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                            <span
                                                                                                className='j-nota-blue ms-4 text-decoration-underline'
                                                                                                onClick={() => toggleInput(item.id)}
                                                                                            >
                                                                                                + Nota
                                                                                            </span>
                                                                                        </div>
                                                                                    )}

                                                                                    {visibleInputId === item.id && (
                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                            <span className='j-nota-blue ms-4'>Nota:</span>
                                                                                            <input
                                                                                                type="text"
                                                                                                className='j-note-input'
                                                                                                defaultValue={noteInputRefs.current[item.id] || item.notes || ''} // Show existing note value
                                                                                                onChange={(e) => handleNoteChange(item.id, e)}
                                                                                                onKeyDown={handleNoteKeyDown(item.id)}
                                                                                                onBlur={() => handleInputBlur(item.id)} // Handle blur event
                                                                                                ref={inputRef} // Attach ref to the input
                                                                                                autoFocus
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                < div key={item.id}>
                                                                                    {visibleInputId !== item.id ? (
                                                                                        <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => toggleInput(item.id)}>
                                                                                            <span className='j-nota-blue ms-4'>Nota : {item.notes}</span>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                            <span className='j-nota-blue ms-4'>Nota:</span>
                                                                                            <input
                                                                                                type="text"
                                                                                                className='j-note-input'
                                                                                                defaultValue={noteInputRefs.current[item.id] || item.notes || ''} // Show existing note value
                                                                                                onChange={(e) => handleNoteChange(item.id, e)}
                                                                                                onKeyDown={handleNoteKeyDown(item.id)}
                                                                                                onBlur={() => handleInputBlur(item.id)} // Handle blur event
                                                                                                ref={inputRef} // Attach ref to the input
                                                                                                autoFocus
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </Tab.Pane>
                                                    <Tab.Pane eventKey="nota-de-credito">
                                                        {navactiveTab === 'nota-de-credito' && (
                                                            <Accordion className="sj_accordion mx-2 mt-5" activeKey={activeKey} onSelect={setActiveKey}>
                                                                <Accordion.Item eventKey="0" className="mb-2">
                                                                    <Accordion.Header>
                                                                        <div
                                                                            onClick={() => handleCheckboxChange("1")}
                                                                            className={`sj_bg_border px-4 py-2 sj_w-75 ${selectedCheckbox === "1" ? "active" : ""}`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                name="receiptType"
                                                                                value="1"
                                                                                checked={selectedCheckbox === "1"}
                                                                                onChange={() => handleCheckboxChange("1")}
                                                                                className="me-2 j-change-checkbox"
                                                                                defaultChecked
                                                                            />
                                                                            <p className="d-inline px-3 caja-pajo-title">Usar para futura compra</p>
                                                                        </div>
                                                                    </Accordion.Header>
                                                                </Accordion.Item>
                                                                <Accordion.Item eventKey="1" className="mb-2">
                                                                    <Accordion.Header>
                                                                        <div
                                                                            onClick={() => handleCheckboxChange("2")}
                                                                            className={`sj_bg_border px-4 py-2 sj_w-75 ${selectedCheckbox === "2" ? "active" : ""}`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                name="receiptType"
                                                                                value="2"
                                                                                checked={selectedCheckbox === "2"}
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
                                                                                        onClick={() => handleradiobox("Efectivo")}
                                                                                    />
                                                                                    <p className="d-inline px-3 ps-0">Efectivo</p>
                                                                                </div>
                                                                                <div className='me-3'>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name="receiptType"
                                                                                        value="5"
                                                                                        className="me-2 j-radio-checkbox"
                                                                                        onClick={() => handleradiobox("Tarjeta de debito")}
                                                                                    />
                                                                                    <p className="d-inline px-3 ps-0">Tarjeta de debito</p>
                                                                                </div>
                                                                                <div className='me-3'>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name="receiptType"
                                                                                        value="6"
                                                                                        className="me-2 j-radio-checkbox"
                                                                                        onClick={() => handleradiobox("Tarjeta de credito")}
                                                                                    />
                                                                                    <p className="d-inline px-3 ps-0">Tarjeta de credito</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className='mt-2'>
                                                                                <h5 className='caja-pajo-text'>Cantidad</h5>
                                                                                <div className="mb-3 b_gray">
                                                                                    <input type="text" id="disabledTextInput" className="form-control mt-2 text-white b_gray" value={`$${selectedItems?.reduce((total, v) => total + v.amount * v.quantity, 0)}`}
                                                                                        onChange={handleprice} style={{ borderRadius: "10px" }} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                                {payError && <div className="text-danger errormessage">{payError}</div>}
                                                            </Accordion>
                                                        )}
                                                    </Tab.Pane>
                                                </div>
                                            </div>
                                            <div className="col-xl-5 col-12 overflow-hidden px-0">
                                                <Tab.Pane eventKey="productos" onSelect={handleTabChange}>
                                                    {navactiveTab === 'productos' && (
                                                        <div className="p-3 m_bgblack text-white m-3">
                                                            <p>Resumen</p>
                                                            <div className="deli_infolist p-2">
                                                                <div className="d-flex justify-content-end align-items-center">
                                                                    <div className='d-flex justify-content-end align-items-center me-3'>
                                                                        <div className='me-2 fs-4'><FaCalendarAlt className='bj-icon-size-change' /></div>
                                                                        <div className='pt-1 bj-delivery-text-3'>{new Date(orderAlldata?.created_at).toLocaleDateString('en-GB')}</div>
                                                                    </div>
                                                                    <div className="d-flex justify-content-end align-items-center">
                                                                        <div className="me-2 fs-4"><MdOutlineAccessTimeFilled /></div>
                                                                        <div className="a_time">{new Date(orderAlldata?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="fw-bold fs-5">Datos</div>
                                                                <div className="w-100 mt-4">
                                                                    <div>Nombre</div>
                                                                    <div className="w-100 a_bg_order mt-2 border-0" style={{ borderRadius: "10px" }}><span className="">{userPayment?.firstname ? userPayment.firstname : userPayment?.business_name} {userPayment?.lastname}</span></div>
                                                                </div>
                                                                <div className="d-flex justify-content-end align-items-center mt-4">

                                                                    <div className="w-50">
                                                                        <div>DNI</div>
                                                                        <div className="w-75 a_bg_order border-0 mt-2" style={{ borderRadius: "10px" }}><span className="">{userPayment?.rut}</span></div>
                                                                    </div>
                                                                    <div className="w-50">
                                                                        <div>Correo electrónico</div>
                                                                        <div className="w-75 a_bg_order border-0 mt-2" style={{ borderRadius: "10px" }}><span className="">{userPayment?.email ? userPayment.email : "-"}</span></div>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4">
                                                                    <h5>Productos</h5>
                                                                </div>
                                                                <div>
                                                                    {selectedItems.map((ele, index) => (
                                                                        <div key={index} className="mt-5 mx-1 d-flex justify-content-between">
                                                                            <div>
                                                                                <img src={`${API}/images/${ele.image}`} alt="pic" height={50} width={50} className='rounded-3' />
                                                                                <span className='ms-3'>{ele.disc}</span>
                                                                            </div>
                                                                            <div className="ms-3 mt-2">
                                                                                {ele.quantity}
                                                                            </div>
                                                                            <div className="ms-3 mt-2">
                                                                                $ {ele.amount}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {itemsError && <div className="text-danger errormessage">{itemsError}</div>}
                                                                <div className='b_borderrr mx-1 mb-4 mt-3'>
                                                                </div>
                                                                <div className="p-4 a_deli_infolist mt-3">
                                                                    <div className="a_mar_summary fs-5 fw-bold">Costo total</div>
                                                                    <div className="d-flex justify-content-between align-items-center my-1">
                                                                        <div>Productos</div>
                                                                        <div>${selectedItems?.reduce((total, v) => total + v.amount * v.quantity, 0)}</div>
                                                                    </div>
                                                                    <hr />
                                                                    <div>
                                                                        <div className="d-flex justify-content-between align-items-center my-1 fw-bold">
                                                                            <div>Total</div>
                                                                            <div>${selectedItems?.reduce((total, v) => total + v.amount * v.quantity, 0)}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='mx-5'>

                                                                    <div className="btn btn-primary w-100 my-4 border-0" style={{ borderRadius: "10px", padding: "8px 12px", backgroundColor: "#147BDE" }} onClick={handleContinuarClick}>Continuar</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Tab.Pane>

                                                <Tab.Pane eventKey="nota-de-credito" onSelect={handleTabChange}>
                                                    {navactiveTab === 'nota-de-credito' && (
                                                        <div className="p-3 m_bgblack text-white m-3 ">
                                                            <p>Resumen</p>
                                                            <div className="deli_infolist p-2">
                                                                <div className="d-flex justify-content-end align-items-center " >
                                                                    <div className='d-flex justify-content-end align-items-center me-3 '>
                                                                        <div className='me-2 fs-4'><FaCalendarAlt className='bj-icon-size-change' /></div>
                                                                        <div className='pt-1 bj-delivery-text-3'>{new Date(orderAlldata?.created_at).toLocaleDateString('en-GB')}</div>
                                                                    </div>
                                                                    <div className="d-flex justify-content-end align-items-center ">
                                                                        <div className="me-2 fs-4 "><MdOutlineAccessTimeFilled /></div>
                                                                        <div className="a_time">{new Date(orderAlldata?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="fw-bold fs-5">Datos</div>
                                                                <div className="w-100 mt-4">
                                                                    <div>Nombre</div>
                                                                    <div className="w-100 a_bg_order  mt-2 border-0 " style={{ borderRadius: "10px" }}><span className="">{userPayment?.firstname ? userPayment.firstname : userPayment?.business_name} {userPayment?.lastname}</span></div>
                                                                </div>
                                                                <div className="d-flex justify-content-end align-items-center mt-4">
                                                                    <div className="w-50">
                                                                        <div className='mb-2'>DNI</div>
                                                                        <div className="w-75 a_bg_order  border-0 " style={{ borderRadius: "10px" }}><span className="">{userPayment?.rut}</span></div>
                                                                    </div>
                                                                    <div className="w-50">
                                                                        <div className='mb-2'>Correo electrónico</div>
                                                                        <div className="w-75 a_bg_order  border-0 overflow-auto" style={{ borderRadius: "10px" }}><span className="">{userPayment?.email ? userPayment.email : "-"}</span></div>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4">
                                                                    <h5>Productos</h5>
                                                                </div>
                                                                <div>
                                                                    {selectedItems.map((ele, index) => (
                                                                        <div key={index} className="mt-5 mx-1 d-flex justify-content-between">
                                                                            <div>
                                                                                <img src={`${API}/images/${ele.image}`} alt="pic" height={50} width={50} className='rounded-3' />
                                                                                <span className='ms-3'>{ele.disc}</span>
                                                                            </div>
                                                                            <div className="ms-3 mt-2">
                                                                                {ele.quantity}
                                                                            </div>
                                                                            <div className="ms-3 mt-2">
                                                                                ${ele.amount}
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
                                                                        <div>${selectedItems?.reduce((total, v) => total + v.amount * v.quantity, 0)}</div>
                                                                    </div>
                                                                    <hr></hr>
                                                                    <div>
                                                                        <div className="d-flex justify-content-between align-items-center my-1  fw-bold">
                                                                            <div>Total</div>
                                                                            <div>${selectedItems?.reduce((total, v) => total + v.amount * v.quantity, 0)}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    {/* <div className='b_bborder my-3 p-4'>
                                                                        <h5>Tipos de pago</h5>
                                                                        <div className='d-flex justify-content-between'>
                                                                            <div className='mt-3'>
                                                                                {orderAlldata.payment_type == "cash" ? "Efectivo" :
                                                                                    orderAlldata.payment_type == "dabit" ? "Débito" : "crédito"}
                                                                            </div>
                                                                            <div>${selectedItems?.reduce((total, v) => total + v.amount * v.quantity, 0)}</div>
                                                                        </div>
                                                                    </div> */}
                                                                    <div className='b_bborder my-3 p-4'>
                                                                        <h5>Tipos de pago</h5>
                                                                        <div className='d-flex justify-content-between'>
                                                                            <div className='mt-3'>
                                                                                {selectedCheckbox == "1" ? "Futura Compra" :
                                                                                    selectedCheckbox == "2" && selectedPaytype ? selectedPaytype : ""}
                                                                            </div>
                                                                            <div>${selectedItems?.reduce((total, v) => total + v.amount * v.quantity, 0)}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='b_bborder my-3 p-4'>
                                                                        <h5>Devolución</h5>
                                                                        <div className='d-flex justify-content-between'>
                                                                            <div className='mt-3'>Cantidad</div>
                                                                            <div className='text-danger'>-${selectedItems?.reduce((total, v) => total + v.amount * v.quantity, 0)}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='mx-5'>
                                                                    <div className="btn btn-primary w-100 my-4    border-0" style={{ borderRadius: "10px", padding: "8px 12px", backgroundColor: "#147BDE" }} onClick={handleCreditNote}>Devolver</div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    )}
                                                </Tab.Pane>
                                            </div>
                                        </div>
                                    </Tab.Content>
                                </Tab.Container>
                            </Col>
                        </Row>
                    </Container>

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
                                <img src={img1} height={100} width={100} alt="" />
                            </div>
                            <h4 className='j-tbl-pop-1 mb-0'>Nota de credito</h4>
                            <p className='j-tbl-pop-2'>Devuelta exitosamente</p>
                        </Modal.Body>
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
                                    ¿Estás seguro de que quieres eliminar este menú?
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
                                    menú Ha sido eliminada correctamente
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
    );
}
