import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import { FaCalendarAlt, FaMinus, FaPlus } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { Accordion, Button, Modal } from "react-bootstrap";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import Sidenav from "./Sidenav";
import Recipt from "./Recipt";
import Counter from "./Counter";
import { MdOutlineAccessTimeFilled, MdRoomService } from "react-icons/md";
import { HiOutlineArrowLeft } from "react-icons/hi2";

const DeliveryDots = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const API = process.env.REACT_APP_IMAGE_URL;
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("name");
    const noteInputRefs = useRef({});
    const [cartItems, setCartItems] = useState(
        JSON.parse(localStorage.getItem("cartItems")) || []
    );

    const [orderType, setOrderType] = useState(
        JSON.parse(localStorage.getItem("currentOrder")) || []
    );
    const [orderTypeError, setOrderTypeError] = useState("")

    const navigate = useNavigate();
    // const { state} = useLocation();
    // console.log(state);

    const [showAllItems, setShowAllItems] = useState(false);
    const toggleShowAllItems = () => {
        setShowAllItems(!showAllItems);
    };
    const [countsoup, setCountsoup] = useState(1);
    const [selectedRadio, setSelectedRadio] = useState("1");
    const [activeAccordionItem, setActiveAccordionItem] = useState("1");
    const [itemToDelete, setItemToDelete] = useState(null);
    const [lastOrder, setLastOrder] = useState('');

    // note
    const [isEditing, setIsEditing] = useState(
        Array(cartItems.length).fill(false)
    );
    const handleNoteChange = (index, newNote) => {
        // Update the input value directly using ref
        if (noteInputRefs.current[index]) {
            noteInputRefs.current[index].value = newNote;
        }

        // Debounce the state update to reduce re-renders
        const timeoutId = setTimeout(() => {
            setCartItems(prevItems => {
                const updatedItems = [...prevItems];
                updatedItems[index] = { ...updatedItems[index], note: newNote };
                return updatedItems;
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Enter") {
            const updatedIsEditing = [...isEditing];
            updatedIsEditing[index] = false;
            setIsEditing(updatedIsEditing);
        }
    };

    const handleAddNoteClick = (index) => {
        const updatedCartItems = cartItems.map((item, i) =>
            i === index
                ? { ...item, isEditing: true, note: item.note || "Nota: " }
                : item
        );
        setCartItems(updatedCartItems);

        // Focus the input after state update
        setTimeout(() => {
            if (noteInputRefs.current[index]) {
                noteInputRefs.current[index].focus();
            }
        }, 0);
    };

    // cart
    useEffect(() => {
        // Load cart items from localStorage
        const storedCartItems = localStorage.getItem("cartItems");
        const storedCountsoup = localStorage.getItem("countsoup");
        const last = localStorage.getItem("lastOrder");                   //change
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
            setLastOrder(last);                     //change
        }
        if (storedCountsoup) {
            setCountsoup(JSON.parse(storedCountsoup));
        }
    }, []); // Empty dependency array to run once on component mount

    useEffect(
        () => {
            // Save cart items to localStorage whenever cartItems or countsoup change
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            localStorage.setItem("countsoup", JSON.stringify(countsoup));
        },
        [cartItems, countsoup]
    );
    const addItemToCart = (item) => {
        const existingItemIndex = cartItems.findIndex(
            (cartItem) => cartItem.id === item.id
        );

        if (existingItemIndex !== -1) {
            const updatedCartItems = cartItems.map(
                (cartItem, index) =>
                    index === existingItemIndex
                        ? { ...cartItem, count: cartItem.count + 1 }
                        : cartItem
            );
            setCartItems(updatedCartItems);
            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
            setCountsoup(updatedCartItems.map((item) => item.count));
        } else {
            const newItem = { ...item, count: 1, note: "", isEditing: false };
            setCartItems([...cartItems, newItem]);
            localStorage.setItem(
                "cartItems",
                JSON.stringify([...cartItems, newItem])
            );
        }
    };
    const handleDeleteClick = (itemId) => {
        setItemToDelete(itemId);
        handleShowEditFam();
    };
    const removeItemFromCart = (itemId) => {
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);

        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

        // Update countsoup to match the new cart items
        const updatedCountsoup = updatedCartItems.map((item) => item.count);
        setCountsoup(updatedCountsoup);
    };
    const decrementItem = (itemId) => {
        const updatedCartItems = cartItems
            .map((item) => {
                if (item.id === itemId) {
                    return { ...item, count: Math.max(0, item.count - 1) };
                }
                return item;
            })
            .filter((item) => item.count > 0);

        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        setCountsoup(updatedCartItems.map((item) => item.count));
    };
    const removeEntireItem = (itemId) => {
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        setCountsoup(updatedCartItems.map((item) => item.count));
    };

    const handleAccordionClick = (value) => {
        setSelectedRadio(value);
        setActiveAccordionItem(value)
    };
    const [showEditFamDel, setShowEditFamDel] = useState(false);
    const handleCloseEditFamDel = () => setShowEditFamDel(false);
    const handleShowEditFamDel = () => {
        setShowEditFamDel(true);
        setTimeout(() => {
            setShowEditFamDel(false);
        }, 2000);
    }

    const [showEditFam, setShowEditFam] = useState(false);
    const handleCloseEditFam = () => setShowEditFam(false);
    const handleShowEditFam = () => setShowEditFam(true);

    const handleDeleteConfirmation = (id) => {
        removeItemFromCart(id);
        handleCloseEditFam();
        handleShowEditFamDel();

        setTimeout(() => {
            setShowEditFamDel(false);
        }, 2000);
    };

    //   const handleAccordionSelect = (eventKey) => {
    //     setActiveAccordionItem(eventKey);
    //     setSelectedRadio("0");
    //   };

    const handleFinishEditing = (index) => {
        // Get final value from ref
        const finalNote = noteInputRefs.current[index]?.value || "";

        setCartItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = {
                ...updatedItems[index],
                isEditing: false,
                note: finalNote
            };
            return updatedItems;
        });
    };
    const renderNoteInput = (item, index) => {
        if (item.isEditing) {
            return (
                <div>
                    <input
                        className="j-note-input"
                        type="text"
                        defaultValue={item.note}
                        ref={el => noteInputRefs.current[index] = el}
                        onChange={e => handleNoteChange(index, e.target.value)}
                        onBlur={() => handleFinishEditing(index)}
                        onKeyDown={e => {
                            if (e.key === "Enter") handleFinishEditing(index);
                        }}
                    />
                </div>
            );
        }

        return (
            <div>
                {item.note ? (
                    <p
                        className="j-nota-blue"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleAddNoteClick(index)}
                    >
                        {item.note}
                    </p>
                ) : (
                    <button
                        className="j-note-final-button"
                        onClick={() => handleAddNoteClick(index)}
                    >
                        + Agregar nota
                    </button>
                )}
            </div>
        );
    };

    const getTotalCost = () => {
        return cartItems.reduce(
            (total, item) => total + parseInt(item.price) * item.count,
            0
        );
    };
    const totalCost = getTotalCost();
    const discount = 1.0;
    const finalTotal = totalCost - discount;

    const [rut1, setRut1] = useState("");
    const [rut2, setRut2] = useState("");
    const [rut3, setRut3] = useState("");

    // Create refs for form inputs
    const formRefs = {
        fname: useRef(),
        lname: useRef(),
        tour: useRef(),
        address: useRef(),
        email: useRef(),
        number: useRef(),
        bname: useRef(),
        rut1: useRef(),
        rut2: useRef(),
        rut3: useRef(),
        ltda: useRef()  // Added ltda ref
    };

    // Create a ref to store errors without causing re-renders
    const errorsRef = useRef({});
    const [errors, setErrors] = useState({});

    // Update handleInputChange to properly handle select elements
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update formData state for select elements
        if (name === 'ltda') {
            setFormData(prevData => ({
                ...prevData,
                ltda: value
            }));
        }

        // Check if the ref exists before accessing current
        if (formRefs[name]) {
            formRefs[name].current.value = value;

            // Clear errors for the specific field
            if (errors[name] || (name === 'bname' && errors.business_name)) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: undefined,
                    business_name: name === 'bname' ? undefined : prevErrors.business_name
                }));
            }
        }
    };

    // Update handleRutChange to only clear RUT error
    const handleRutChange = (e, rutRef) => {
        let value = e.target.value.replace(/[^0-9]/g, "");
        if (value.length > 6) {
            value = value.slice(0, 6) + "-" + value.slice(6);
        }
        rutRef.current.value = value;

        // Only clear RUT error if it exists
        if (errors.rut) {
            setErrors(prevErrors => ({
                ...prevErrors,
                rut: undefined
            }));
        }
    };

    console.log("sasdasd");


    // ***************************************************API**************************************************
    // form

    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        tour: "",
        address: "",
        email: "",
        number: "",
        bname: "",
        tipoEmpresa: "0"
    });

    const collectAccordionData = () => {
        const commonData = {
            receiptType: selectedRadio,
            rut: selectedRadio === "1" ? formRefs.rut1.current.value :
                selectedRadio === "2" ? formRefs.rut2.current.value : formRefs.rut3.current.value,
            firstname: formRefs.fname.current.value,
            lastname: formRefs.lname.current.value,
            tour: formRefs.tour.current.value,
            address: formRefs.address.current.value,
            email: formRefs.email.current.value,
            phone: formRefs.number.current.value,
            // ltda: formRefs.ltda.current.value  // Added ltda ref
        };

        let specificData = {};
        if (selectedRadio === "3") {
            specificData = {
                business_name: formRefs.bname.current.value,
                ltda: formRefs.ltda.current.value  // Keep this in state since it's a select
            };
        }

        return { ...commonData, ...specificData };
    };

    const validateForm = () => {
        const data = collectAccordionData();
        const newErrors = {};
        if (data.receiptType !== "4") {
            // RUT validation
            if (!data.rut || data.rut.length < 7) {
                newErrors.rut = "El RUT debe tener al menos 7 caracteres";
            }

            // Name validation
            if (data.receiptType !== "3") {
                if (!data.firstname || data.firstname.trim() === "") {
                    newErrors.fname = "Se requiere el primer nombre";
                }
            }
            // console.log(data)
            // Business name validation for receipt type 4
            if (data.receiptType === "3") {
                if (!data.business_name || data.business_name.trim() === "") {
                    newErrors.business_name = "Se requiere el nombre de la empresa";
                }
                if (!data.ltda || data.ltda === "0") {
                    newErrors.ltda = "Seleccione una opción";
                }
            }

            // Last name validation
            if (!data.lastname || data.lastname.trim() === "") {
                newErrors.lname = "El apellido es obligatorio";
            }

            // Tour validation
            if (!data.tour || data.tour.trim() === "") {
                newErrors.tour = "Se requiere tour";
            }

            // Address validation
            if (!data.address || data.address.trim() === "") {
                newErrors.address = "La dirección es necesaria";
            }

        }

        setErrors(newErrors);
        return newErrors;
        // return errors;
    };
    const handleSubmit = () => {
        if (!orderType || orderType?.orderType == 0) {
            // console.log("Dgd");
            // setOrderTypeError("Por favor seleccione tipo de pedido");
            setOrderTypeError("Por favor seleccione un tipo de pedido");
            return;
        }
        const collectedData = collectAccordionData();
        const validationErrors = validateForm(collectedData);

        setErrors(validationErrors);
        console.log(collectedData);
        console.log(errors);
        if (Object.keys(validationErrors).length === 0) {
            // No errors, proceed with form submission
            localStorage.setItem("payment", JSON.stringify(collectedData));
            navigate(`/home/usa/bhomedelivery/pago`);
        } else {
            // Scroll to the first error
            const firstErrorField = document.querySelector('.text-danger');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    useEffect(() => {
        const storedOrder = JSON.parse(localStorage.getItem("currentOrder")) || {};
        setOrderType(storedOrder);
    }, []);
    const handleOrderTypeChange = (e) => {

        if (e.target.value == 0) {
            setOrderTypeError("Por favor seleccione un tipo de pedido");
        } else {
            setOrderTypeError("");
        }
        const newOrderType = e.target.value;
        const updatedOrder = { ...orderType, orderType: newOrderType };
        setOrderType(updatedOrder);
        localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
    };
    const [paymentData, setPaymentData] = useState(null);

    const [activeA, setActiveA] = useState(null)

    useEffect(() => {
        const storedPayment = JSON.parse(localStorage.getItem("payment"));
        if (storedPayment) {
            setPaymentData(storedPayment);
        }
    }, [])


    useEffect(() => {
        if (paymentData) {
            setFormData({
                fname: paymentData.firstname,
                lname: paymentData.lastname,
                tour: paymentData.tour,
                address: paymentData.address,
                email: paymentData.email,
                number: paymentData.phone,
                bname: paymentData.business_name,
                ltda: paymentData.ltda,
                tipoEmpresa: paymentData.receiptType === "3" ? paymentData.ltda : "0",
                rut: paymentData.receiptType == "1" ? paymentData.rut : paymentData.receiptType == "2" ? paymentData.rut : paymentData.rut,
            })
            setActiveAccordionItem(paymentData.receiptType); // {{ edit_1 }}
            paymentData.receiptType == "1" ? setRut1(paymentData.rut) : paymentData.receiptType == "2" ? setRut2(paymentData.rut) : setRut3(paymentData.rut)
            //   handleAccordionClick(paymentData.receiptType);
            setSelectedRadio(paymentData.receiptType);
            setActiveA(paymentData.receiptType);
            setActiveAccordionItem(paymentData.receiptType);
        }
    }, [paymentData])
    return (
        <div>
            <Header />
            <div className="s_bg_dark">
                <div className="j-flex">
                    <div>
                        <Sidenav />
                    </div>
                    <div className="flex-grow-1 sidebar j-position-sticky text-white">
                        <div className="j-counter-header">
                            <Link to={`/home/usa`}>
                                <div className="j-table-datos-btn">
                                    <button className="bj-btn-outline-primary j-tbl-btn-font-1 btn">
                                        <HiOutlineArrowLeft className="j-table-datos-icon" />Regresar
                                    </button>
                                </div>
                            </Link>
                            <h2 className="text-white j-table-font-1 mb-0"></h2>
                            <div className="j-menu-bg-color">
                                <div className="j-table-cart-2 d-flex justify-content-between ">
                                    <div className="line1  flex-grow-1">
                                        <Link to={"#"} className="text-decoration-none px-2 sj_text_medium">
                                            <FaCircleCheck className="mx-1" />
                                            <span>Productos</span>
                                        </Link>
                                    </div>
                                    <div className="flex-grow-1 text-center">
                                        <Link className="text-decoration-none px-2 sj_text_blue">
                                            <FaCircleCheck className="mx-1" />
                                            <span>Datos</span>
                                        </Link>
                                    </div>
                                    <div className="line2  flex-grow-1 text-end">
                                        <Link
                                            // to={`/home/usa/bhomedelivery/pago`}
                                            className="text-decoration-none px-2 sj_text_medium"
                                            onClick={handleSubmit}
                                        >
                                            <FaCircleCheck className="mx-1" />
                                            <span>Pago</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" mt-4 mx-4 sj_hwidth">
                            <div className="bg_gay p-4">
                                <p className="mb-2">Datos cliente</p>
                                <p>Tipos de comprobantes</p>
                                <hr className="sj_bottom" />
                                <Accordion className="sj_accordion" activeKey={activeAccordionItem}>
                                    <Accordion.Item eventKey="1" className="mb-3">
                                        <Accordion.Header>
                                            {" "}
                                            {/* <div className="sj_bg_dark px-4 py-2 sj_w-75">
                                                <img src={box} alt="" />
                                                <p className="d-inline px-3 ">
                                                    Boleta Electrónica Impersonal
                                                </p>
                                            </div> */}
                                            <div
                                                onClick={() => handleAccordionClick("1")}
                                                className={`sj_bg_dark j_td_mp sj_w-75 ${activeAccordionItem ===
                                                    "1"
                                                    ? "active"
                                                    : ""}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="receiptType"
                                                    value="1"
                                                    checked={selectedRadio == "1"}
                                                    onChange={() => setSelectedRadio("1")}
                                                    className="me-2 j-radio-checkbox"
                                                />
                                                <p className="d-inline px-3">Boleta nominativa:</p>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="sj_gay_border px-3 py-4 mt-2 j_tb_size ">
                                                <form>
                                                    <div className="row j_col_width">
                                                        <div className="col-12 mb-2">
                                                            <label className="mb-2">Rut </label>
                                                            <input
                                                                type="text"
                                                                name="rut"
                                                                ref={formRefs.rut1}
                                                                defaultValue={rut1}
                                                                onChange={(e) => handleRutChange(e, formRefs.rut1)}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.rut && <div className="text-danger errormessage">{errors.rut}</div>}

                                                        </div>
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Nombre </label>
                                                            <input
                                                                type="text"
                                                                id="fname"
                                                                name="fname"
                                                                ref={formRefs.fname}
                                                                defaultValue={formData.fname}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.fname && <div className="text-danger errormessage">{errors.fname}</div>}

                                                        </div>
                                                        <div className="col-6">
                                                            <label className="mb-2">Apellido Paterno </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="lname"
                                                                ref={formRefs.lname}
                                                                defaultValue={formData.lname}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.lname && <div className="text-danger errormessage">{errors.lname}</div>}

                                                        </div>
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Giro </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="tour"
                                                                ref={formRefs.tour}
                                                                defaultValue={formData.tour}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.tour && <div className="text-danger errormessage">{errors.tour}</div>}

                                                        </div>
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Dirección </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="address"
                                                                ref={formRefs.address}
                                                                defaultValue={formData.address}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.address && <div className="text-danger errormessage">{errors.address}</div>}

                                                        </div>
                                                        <div className="col-6 ">
                                                            <label className="mb-2">E-mail (opcional) </label>
                                                            <input
                                                                type="text"
                                                                id="id" name="email"
                                                                ref={formRefs.email}
                                                                defaultValue={formData.email}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                        </div>
                                                        <div className="col-6 ">
                                                            <label className="mb-2">
                                                                Teléfono móvil (opcional){" "}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="number"
                                                                ref={formRefs.number}
                                                                defaultValue={formData.number}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2" className="mb-3">
                                        <Accordion.Header>
                                            {" "}
                                            {/* <div className="sj_bg_dark px-4 py-2 mt-3 sj_w-75">
                                                <img src={box4} alt="#" />
                                                <p className="d-inline px-3">
                                                    Boleta Electrónica Nominativa
                                                </p>
                                            </div> */}
                                            <div
                                                onClick={() => handleAccordionClick("2")}
                                                className={`sj_bg_dark j_td_mp sj_w-75 ${activeAccordionItem ===
                                                    "2"
                                                    ? "active"
                                                    : ""}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="receiptType"
                                                    value="1"
                                                    checked={selectedRadio == "2"}
                                                    onChange={() => setSelectedRadio("2")}
                                                    className="me-2 j-radio-checkbox"
                                                />
                                                <p className="d-inline px-3">Boleta electrónica:</p>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="sj_gay_border px-3 py-4 mt-2 j_tb_size ">
                                                <form>
                                                    <div className="row j_col_width">
                                                        <div className="col-12 mb-2">
                                                            <label className="mb-2">Rut </label>
                                                            <input
                                                                type="text"
                                                                name="rut"
                                                                ref={formRefs.rut2}
                                                                defaultValue={rut2}
                                                                onChange={(e) => handleRutChange(e, formRefs.rut2)}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.rut && <div className="text-danger errormessage">{errors.rut}</div>}

                                                        </div>
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Nombre </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="fname"
                                                                ref={formRefs.fname}
                                                                defaultValue={formData.fname}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.fname && <div className="text-danger errormessage">{errors.fname}</div>}

                                                        </div>
                                                        <div className="col-6">
                                                            <label className="mb-2">Apellido Paterno </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="lname"
                                                                ref={formRefs.lname}
                                                                defaultValue={formData.lname}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.lname && <div className="text-danger errormessage">{errors.lname}</div>}

                                                        </div>
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Giro </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="tour"
                                                                ref={formRefs.tour}
                                                                defaultValue={formData.tour}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.tour && <div className="text-danger errormessage">{errors.tour}</div>}

                                                        </div>
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Dirección </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="address"
                                                                ref={formRefs.address}
                                                                defaultValue={formData.address}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.address && <div className="text-danger errormessage">{errors.address}</div>}

                                                        </div>
                                                        <div className="col-6 ">
                                                            <label className="mb-2">E-mail (opcional) </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="email"
                                                                ref={formRefs.email}
                                                                defaultValue={formData.email}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                        </div>
                                                        <div className="col-6 ">
                                                            <label className="mb-2">
                                                                Teléfono móvil (opcional){" "}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="number"
                                                                ref={formRefs.number}
                                                                defaultValue={formData.number}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="3" className="mb-3">
                                        <Accordion.Header>
                                            {" "}
                                            {/* <div className="sj_bg_dark px-4 py-2 mt-3 sj_w-75">
                                                <img src={box4} alt="#" />
                                                <p className="d-inline px-3">
                                                    Boleta personal
                                                </p>
                                            </div> */}
                                            <div
                                                onClick={() => handleAccordionClick("3")}
                                                className={`sj_bg_dark j_td_mp sj_w-75 ${activeAccordionItem ===
                                                    "2"
                                                    ? "active"
                                                    : ""}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="receiptType"
                                                    value="1"
                                                    checked={selectedRadio == "3"}
                                                    onChange={() => setSelectedRadio("3")}
                                                    className="me-2 j-radio-checkbox"
                                                />
                                                <p className="d-inline px-3">Factura:</p>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="sj_gay_border px-3 py-4 mt-2 j_tb_size ">
                                                <form>
                                                    <div className="row j_col_width">
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Rut </label>
                                                            <input
                                                                type="text"
                                                                name="rut"
                                                                ref={formRefs.rut3}
                                                                defaultValue={rut3}
                                                                onChange={(e) => handleRutChange(e, formRefs.rut3)}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.rut && <div className="text-danger errormessage">{errors.rut}</div>}

                                                        </div>
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Razón Social </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="bname"
                                                                ref={formRefs.bname}
                                                                defaultValue={formData.bname}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.business_name && <div className="text-danger errormessage">{errors.business_name}</div>}

                                                        </div>
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Sa, Ltda, Spa </label>
                                                            <select
                                                                name="ltda"
                                                                defaultValue={formData.ltda}// Add fallback to "0"
                                                                ref={formRefs.ltda}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white form-select">
                                                                <option value="0">Seleccionar opción</option>
                                                                <option value="sa">Sa</option>
                                                                <option value="ltda">Ltda</option>
                                                                <option value="spa">Spa</option>
                                                            </select>
                                                            {errors.ltda && <div className="text-danger errormessage">{errors.ltda}</div>}

                                                        </div>
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Apellido Paterno</label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="lname"
                                                                ref={formRefs.lname}
                                                                defaultValue={formData.lname}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.lname && <div className="text-danger errormessage">{errors.lname}</div>}

                                                        </div>
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Giro </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="tour"
                                                                ref={formRefs.tour}
                                                                defaultValue={formData.tour}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.tour && <div className="text-danger errormessage">{errors.tour}</div>}

                                                        </div>
                                                        <div className="col-6 mb-2">
                                                            <label className="mb-2">Dirección </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="address"
                                                                ref={formRefs.address}
                                                                defaultValue={formData.address}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                            {errors.address && <div className="text-danger errormessage">{errors.address}</div>}

                                                        </div>
                                                        <div className="col-6 ">
                                                            <label className="mb-2">E-mail (opcional) </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="email"
                                                                ref={formRefs.email}
                                                                defaultValue={formData.email}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                        </div>
                                                        <div className="col-6 ">
                                                            <label className="mb-2">
                                                                Teléfono móvil (opcional){" "}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="number"
                                                                ref={formRefs.number}
                                                                defaultValue={formData.number}
                                                                onChange={handleInputChange}
                                                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="4" className="mb-3">
                                        <Accordion.Header>
                                            {" "}
                                            <div
                                                onClick={() => handleAccordionClick("4")}
                                                className={`sj_bg_dark j_td_mp sj_w-75 ${activeAccordionItem ===
                                                    "4"
                                                    ? "active"
                                                    : ""}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="receiptType"
                                                    value="1"
                                                    checked={selectedRadio === "4"}
                                                    onChange={() => setSelectedRadio("4")}
                                                    className="me-2 j-radio-checkbox"
                                                />
                                                <p className="d-inline px-3">Recibo personal</p>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {/* <div className="sj_gay_border px-3 py-4 mt-2 j_tb_size ">
                                            </div> */}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    {/* <Accordion.Item eventKey="3" >
                                        <Accordion.Header>
                                            <div onClick={() => handleAccordionClick("4")}
                                                className={`sj_bg_dark j_td_mp sj_w-75 ${activeAccordionItem === "2" ? "active" : ""
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="receiptType"
                                                    value="1"
                                                    checked={selectedRadio === "4"}
                                                    onChange={() => setSelectedRadio("4")}
                                                    className="me-2 j-radio-checkbox"
                                                />
                                                <p className="d-inline px-3">Factura (Rut) (Iva 19%)</p>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="sj_gay_border px-3 py-4 mt-2">
                                                <form>
                                                    <label htmlFor="id">DNI </label>
                                                    <br />
                                                    <input
                                                        type="text"
                                                        id="id"
                                                        name="id"
                                                        onChange={handleChange}
                                                        value={customerData.id}
                                                        className="sj_bg_dark sj_width_input  px-4 py-2 text-white "
                                                    />
                                                    <br />
                                                    <label htmlFor="name" className="pt-3">
                                                        Nombre
                                                    </label>
                                                    <br />
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={customerData.name}
                                                        onChange={handleChange}
                                                        className="sj_bg_dark sj_width_input  px-4 py-2 text-white "
                                                    />
                                                    <br />
                                                    <label htmlFor="email" className="pt-3">
                                                        Correo electrónico{" "}
                                                    </label>
                                                    <br />
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={customerData.email}
                                                        onChange={handleChange}
                                                        className="sj_bg_dark sj_width_input  px-4 py-2 text-white "
                                                    />
                                                </form>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item> */}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                    <div
                        className="j-counter-price position-sticky"
                        style={{ top: "77px" }}
                    >
                        <div className="j_position_fixed j_b_hd_width ak-position">
                            {/* <h2 className="text-white j-tbl-text-13">Resumen</h2> */}
                            <div className="j-counter-price-data ak-w-100">
                                <div className="b-summary-center mb-4 align-items-center text-white d-flex justify-content-between">
                                    {/* <div className="j_position_fixed j_b_hd_width"> */}
                                    <h2 className="text-white j-kds-body-text-1000 mb-0">Resumen</h2>
                                    {/* <FaXmark className="b-icon" /> */}
                                </div>
                                <div className="b-date-time d-flex flex-wrap column-gap-3 align-items-center justify-content-end text-white">
                                    <div>
                                        <FaCalendarAlt className="mb-1" />
                                        <p className="mb-0 ms-2 d-inline-block">{new Date().toLocaleDateString('en-GB')}</p>
                                    </div>
                                    <div>
                                        <MdOutlineAccessTimeFilled className="mb-1" />
                                        <p className="mb-0 ms-2 d-inline-block">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <h3 className="text-white j-kds-body-text-1000 ak-w-100">Datos</h3>
                                {/* <h3 className="text-white mt-3 j-tbl-text-13 ak-w-100">Datos</h3> */}
                                {/* <div className="b-date-time b_date_time2 d-flex flex-wrap column-gap-3 me-2 justify-content-end text-white">
                                    <div>
                                        <FaCalendarAlt className="mb-2" />
                                        <p className="mb-0 ms-2 d-inline-block">{new Date().toLocaleDateString('en-GB')}</p>
                                    </div>
                                    <div>
                                        <MdOutlineAccessTimeFilled className="mb-2" />
                                        <p className="mb-0 ms-2 d-inline-block">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div> */}
                                {/* <div className="j_td_center ak-w-100">
                                    <div className="j-busy-table j_busy_table_last d-flex align-items-center">
                                        <div className=''>
                                            <div style={{ fontWeight: "600", borderRadius: "10px" }} className={`bj-delivery-text-2  b_btn1 mb-3  p-0 text-nowrap d-flex  align-items-center justify-content-center 
                                                ${orderType?.orderType.toLowerCase() === 'local' ? 'b_indigo' : orderType?.orderType?.toLowerCase() === 'order now' ? 'b_ora ' : orderType?.orderType?.toLowerCase() === 'delivery' ? 'b_blue' : orderType?.orderType?.toLowerCase() === 'uber' ? 'b_ora text-danger' : orderType?.orderType?.toLowerCase().includes("with") ? 'b_purple' : 'b_ora text-danger'}`}>
                                                {orderType?.orderType?.toLowerCase() === 'local' ? 'Local' : orderType?.orderType?.toLowerCase().includes("with") ? 'Retiro ' : orderType?.orderType?.toLowerCase() === 'delivery' ? 'Entrega' : orderType?.orderType?.toLowerCase() === 'uber' ? 'Uber' : orderType?.orderType}
                                            </div>
                                        </div>
                                        <div className="j-b-table" />
                                        <p className="j-table-color j-tbl-font-6">Ocupado</p>
                                    </div>
                                    <div className="b-date-time b_date_time2  d-flex align-items-center">
                                        <svg
                                            className="j-canvas-svg-i"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>

                                        <p className="mb-0 ms-2 me-3 text-white j-tbl-font-6">
                                            {elapsedTime}
                                        </p>
                                    </div>

                                </div> */}
                                <div className="j-counter-price-data">
                                    <form className="d-flex flex-wrap w-100">
                                        <div className="j-orders-type ak-w-50">
                                            <label className="j-label-name  text-white mb-2 j-tbl-font-6 ">
                                                Tipo pedido
                                            </label>
                                            <select
                                                className="form-select j-input-name-2 j-input-name-23 ak-input"
                                                onChange={handleOrderTypeChange}
                                                value={orderType.orderType}
                                            // value={orType.orderType}
                                            >
                                                <option value="0">Seleccionar</option>
                                                <option value="delivery">Entrega</option>
                                                <option value="local">Local</option>
                                                <option value="withdraw">Retirar</option>
                                            </select>
                                            {orderTypeError && (
                                                <div className="text-danger errormessage">{orderTypeError}</div>
                                            )}
                                        </div>
                                        <div className="align-content-end mt-2 ak-w-50">
                                            {/* {console.log(orderType)} */}

                                            {(orderType && orderType.orderType != 0) && <div
                                                className={`bj-delivery-text-2  b_btn1 m-1 p-2 ${orderType.orderType?.toLowerCase() === 'local'
                                                    ? 'b_indigo'
                                                    : orderType.orderType?.toLowerCase() === 'delivery'
                                                        ? 'b_blue'
                                                        : orderType.orderType?.toLowerCase().includes("with")
                                                            ? 'b_purple'
                                                            : 'b_ora text-danger'
                                                    }`}
                                            >
                                                {orderType.orderType?.toLowerCase() === 'local'
                                                    ? 'Local'
                                                    : orderType.orderType?.toLowerCase().includes("with")
                                                        ? 'Retirar'
                                                        : orderType.orderType?.toLowerCase() === 'delivery'
                                                            ? 'Entrega'
                                                            : orderType.orderType}
                                            </div>}

                                        </div>
                                    </form>
                                    {/* <div className="j-orders-inputs j_td_inputs ak-w-100">
                                        <div className="j-orders-code ak-w-100">
                                            <label className="j-label-name text-white mb-2 j-tbl-btn-font-1">
                                                Quién registra
                                            </label>
                                            <div>
                                                <input
                                                    className="j-input-name j_input_name520 ak-w-100"
                                                    type="text"
                                                    value={userName}
                                                    disabled
                                                // placeholder={orderType?.name}
                                                // value={orderType?.name}
                                                />
                                            </div>
                                        </div>
                                        <div className="j-orders-code">
                                            <label className="j-label-name j-tbl-btn-font-1 text-white mb-2">
                                            Personas
                                            </label>
                                            <div>
                                                <input
                                                    className="j-input-name630"
                                                    type="text"
                                                    placeholder="5"
                                                    value={tableData[0]?.person}

                                                />
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="j-counter-order ak-w-100">
                                        {cartItems.length === 0 ? (
                                            <div>
                                                <div className="b-product-order text-center">
                                                    <MdRoomService className="i-product-order" />
                                                    <h6 className="h6-product-order text-white j-tbl-pop-1">
                                                        Mesa disponible
                                                    </h6>
                                                    <p className="p-product-order j-tbl-btn-font-1">
                                                        Agregar producto para empezar<br />
                                                        con el pedido de la mesa
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="j-counter-order j_counter_width ak-w-100">
                                                <h3 className="text-white j-tbl-font-5">Pedido </h3>

                                                <div className={`j-counter-order-data `}>
                                                    {(showAllItems
                                                        ? cartItems
                                                        : cartItems.slice(0, 3)).map((item, index) => (
                                                            <div className="j-counter-order-border-fast">
                                                                <div className="j-counter-order-img" key={item.id}>
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <img src={`${API}/images/${item.image}`} alt="" />
                                                                        <h5 className="text-white j-tbl-pop-1">
                                                                            {item.name}
                                                                        </h5>
                                                                    </div>
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="j-counter-mix">
                                                                            <button
                                                                                className="j-minus-count"
                                                                                onClick={() => decrementItem(item.id)}
                                                                            >
                                                                                <FaMinus />
                                                                            </button>
                                                                            <h3 className="j-tbl-btn-font-1">
                                                                                {item.count}
                                                                            </h3>
                                                                            <button
                                                                                className="j-plus-count"
                                                                                onClick={() => addItemToCart(item)}
                                                                            >
                                                                                <FaPlus />
                                                                            </button>
                                                                        </div>
                                                                        <h4 className="text-white fw-semibold j-tbl-text-14">
                                                                            ${parseInt(item.price)}
                                                                        </h4>
                                                                        <button
                                                                            className="j-delete-btn"
                                                                            onClick={() => {
                                                                                handleDeleteClick(item.id);
                                                                                handleShowEditFam();
                                                                            }}
                                                                        >
                                                                            <RiDeleteBin6Fill />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="text-white j-order-count-why">
                                                                    {renderNoteInput(item, index)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    {cartItems.length > 3 && (
                                                        <Link onClick={toggleShowAllItems} className="sjfs-14">
                                                            {showAllItems ? "Ver menos" : "Ver más"}
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="j-counter-total ak-counter-total">
                                                    <h5 className="text-white j-tbl-text-15">Costo total</h5>
                                                    <div className="j-total-discount d-flex justify-content-between">
                                                        <p className="j-counter-text-2">Artículos</p>
                                                        <span className="text-white">
                                                            ${totalCost.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="j-border-bottom-counter">
                                                        <div className="j-total-discount d-flex justify-content-between">
                                                            <p className="j-counter-text-2">Descuentos</p>
                                                            <span className="text-white">
                                                                {cartItems.length > 0 ? (
                                                                    `$${discount.toFixed(2)}`
                                                                ) : (
                                                                    "$0.00"
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="j-total-discount my-2 d-flex justify-content-between">
                                                        <p className="text-white bj-delivery-text-153 ">
                                                            Total
                                                        </p>
                                                        <span className="text-white bj-delivery-text-153 ">
                                                            {cartItems.length > 0 ? (
                                                                `$${finalTotal.toFixed(2)}`
                                                            ) : (
                                                                "$0.00"
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="btn w-100 j-btn-primary text-white m-articles-text-2"
                                                        onClick={handleSubmit}
                                                    >
                                                        Continuar
                                                    </div>
                                                </div>
                                                <Modal
                                                    show={showEditFam}
                                                    onHide={handleCloseEditFam}
                                                    backdrop={true}
                                                    keyboard={false}
                                                    className="m_modal jay-modal"
                                                >
                                                    <Modal.Header closeButton className="border-0" />
                                                    <Modal.Body className="border-0">
                                                        <div className="text-center">
                                                            <img
                                                                // className="j-trash-img-late"
                                                                src={require("../Image/trash-outline-secondary.png")}
                                                                alt=""
                                                            />
                                                            <p className="mb-0 mt-2 j-kds-border-card-p">
                                                                Seguro deseas eliminar este pedido
                                                            </p>
                                                        </div>
                                                    </Modal.Body>
                                                    <Modal.Footer className="border-0 justify-content-center">
                                                        <Button
                                                            className="j-tbl-btn-font-1 b_btn_close"
                                                            variant="danger"
                                                            onClick={() => {
                                                                removeEntireItem(itemToDelete);
                                                                handleCloseEditFam();
                                                                handleShowEditFamDel();
                                                            }}
                                                        >
                                                            Si, seguro
                                                        </Button>
                                                        <Button
                                                            className="j-tbl-btn-font-1 "
                                                            variant="secondary"
                                                            onClick={() => {
                                                                handleCloseEditFam();
                                                            }}
                                                        >
                                                            No, cancelar
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>
                                                <Modal
                                                    show={showEditFamDel}
                                                    onHide={handleCloseEditFamDel}
                                                    backdrop={true}
                                                    keyboard={false}
                                                    className="m_modal jay-modal"
                                                >
                                                    <Modal.Header closeButton className="border-0" />
                                                    <Modal.Body>
                                                        <div className="j-modal-trash text-center">
                                                            <img
                                                                src={require("../Image/trash-outline.png")}
                                                                alt=""
                                                            />
                                                            <p className="mb-0 mt-3 h6 j-tbl-pop-1">
                                                                Order eliminado
                                                            </p>
                                                            <p className="opacity-75 j-tbl-pop-2">
                                                                El Order ha sido eliminado correctamente
                                                            </p>
                                                        </div>
                                                    </Modal.Body>
                                                </Modal>
                                            </div>
                                        )}
                                        <Modal
                                            show={showEditFam}
                                            onHide={handleCloseEditFam}
                                            backdrop={true}
                                            keyboard={false}
                                            className="m_modal jay-modal"
                                        >
                                            <Modal.Header closeButton className="border-0" />
                                            <Modal.Body className="border-0">
                                                <div className="text-center">
                                                    <img
                                                        // className="j-trash-img-late"
                                                        src={require("../Image/trash-outline-secondary.png")}
                                                        alt=""
                                                    />
                                                    <p className="mb-0 mt-2 j-kds-border-card-p">
                                                        Seguro deseas eliminar este pedido
                                                    </p>
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer className="border-0 justify-content-center">
                                                <Button
                                                    className="j-tbl-btn-font-1 b_btn_close"
                                                    variant="danger"
                                                    onClick={() => handleDeleteConfirmation(itemToDelete)}
                                                >
                                                    Si, seguro
                                                </Button>
                                                <Button
                                                    className="j-tbl-btn-font-1 "
                                                    variant="secondary"
                                                    onClick={() => {
                                                        handleCloseEditFam();
                                                    }}
                                                >
                                                    No, cancelar
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                        <Modal
                                            show={showEditFamDel}
                                            onHide={handleCloseEditFamDel}
                                            backdrop={true}
                                            keyboard={false}
                                            className="m_modal jay-modal"
                                        >
                                            <Modal.Header closeButton className="border-0" />
                                            <Modal.Body>
                                                <div className="j-modal-trash text-center">
                                                    <img src={require("../Image/trash-outline.png")} alt="" />
                                                    <p className="mb-0 mt-3 h6 j-tbl-pop-1">
                                                        Pedido eliminado
                                                    </p>
                                                    <p className="opacity-75 j-tbl-pop-2">
                                                        El Pedido ha sido eliminado correctamente
                                                    </p>
                                                </div>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDots;
