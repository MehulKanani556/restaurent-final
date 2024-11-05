import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { Accordion, Button, Modal, Spinner } from "react-bootstrap";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import Sidenav from "./Sidenav";
import Recipt from "./Recipt";
import Counter from "./Counter";
import { MdRoomService } from "react-icons/md";

const Mostrador = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const API = process.env.REACT_APP_IMAGE_URL;
  const [token] = useState(localStorage.getItem("token"));
  const [role] = useState(localStorage.getItem("role"));
  const userName = localStorage.getItem("name");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const [orderType, setOrderType] = useState(
    JSON.parse(localStorage.getItem("currentOrder")) || []
  );

  const navigate = useNavigate();
  const [lastOrder, setLastOrder] = useState('');

  const [showAllItems, setShowAllItems] = useState(false);
  const toggleShowAllItems = () => {
    setShowAllItems(!showAllItems);
  };
  const [countsoup, setCountsoup] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState("1");
  const [activeAccordionItem, setActiveAccordionItem] = useState("1");
  const [itemToDelete, setItemToDelete] = useState(null);

  // note
  const [isEditing, setIsEditing] = useState(
    Array(cartItems.length).fill(false)
  );
  const noteInputRefs = useRef({}); // {{ edit_1 }}

  // Modified note handling functions
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
  }; // {{ edit_2 }}

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
  }; // {{ edit_3 }}

  useEffect(() => {
    if (!(role == "admin" || role == "cashier")) {
      navigate('/dashboard')
    }
  }, [role])

  // cart
  useEffect(() => {
    // Load cart items from localStorage
    const storedCartItems = localStorage.getItem("cartItems");
    const storedCountsoup = localStorage.getItem("countsoup");
    const last = localStorage.getItem("lastOrder");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
      setLastOrder(last);
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
    }, 2000); // 2000 milliseconds = 2 seconds
  };

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

  const handleAccordionSelect = (eventKey) => {
    setActiveAccordionItem(eventKey);
    setSelectedRadio("0");
  };

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
  }; // {{ edit_4 }}

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

  // Add refs for form inputs
  const formRefs = {
    rut1: useRef(),
    rut2: useRef(),
    rut3: useRef(),
    fname: useRef(),
    lname: useRef(),
    tour: useRef(),
    address: useRef(),
    email: useRef(),
    number: useRef(),
    bname: useRef(),
    ltda: useRef()  // Added ltda ref
  };

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
        selectedRadio === "2" ? formRefs.rut2.current.value :
          formRefs.rut3.current.value,
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
        ltda: paymentData.ltda, // This should match the select options value
        tipoEmpresa: paymentData.receiptType === "3" ? paymentData.ltda : "0",
        rut: paymentData.receiptType == "1" ? paymentData.rut :
          paymentData.receiptType == "2" ? paymentData.rut : paymentData.rut,
      });

      // Ensure the select element's value is set after form data is updated
      if (formRefs.ltda.current) {
        formRefs.ltda.current.value = paymentData.ltda;
      }

      setActiveAccordionItem(paymentData.receiptType); // {{ edit_1 }}
      paymentData.receiptType == "1" ? setRut1(paymentData.rut) : paymentData.receiptType == "2" ? setRut2(paymentData.rut) : setRut3(paymentData.rut)
      handleAccordionClick(paymentData.receiptType);
      setSelectedRadio(paymentData.receiptType);
      setActiveA(paymentData.receiptType);
    }
  }, [paymentData]);

  const handleSubmit = () => {
    setIsProcessing(true);
    const collectedData = collectAccordionData();
    const validationErrors = validateForm(collectedData);

    setErrors(validationErrors);
    console.log(collectedData);
    console.log(errors);
    if (Object.keys(validationErrors).length === 0) {
      // No errors, proceed with form submission
      localStorage.setItem("payment", JSON.stringify(collectedData));
      navigate("/counter/payment");
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.text-danger');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    setIsProcessing(false);
  };

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("currentOrder")) || {};
    setOrderType(storedOrder);
  }, []);
  const handleOrderTypeChange = (e) => {
    const newOrderType = e.target.value;
    const updatedOrder = { ...orderType, orderType: newOrderType };
    setOrderType(updatedOrder);
    localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
  };

  // Modified render section for the note input
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
  }; // {{ edit_5 }}

  return (
    <div>
      <Header />
      <div className="s_bg_dark">
        <div className="j-flex">
          <div>
            <Sidenav />
          </div>
          <div className="flex-grow-1 sidebar j-position-sticky text-white">
            <div className="j-counter-header j_counter_header_last_change">
              <h2 className="text-white mb-3 sjfs-18">Mostrador</h2>
              <div className="j-menu-bg-color">
                <div className="j-tracker-mar d-flex justify-content-between ">
                  <div className="line1 flex-grow-1">
                    <Link
                      to={"#"}
                      className="text-decoration-none px-2 sj_text_dark"
                    >
                      <FaCircleCheck className="mx-1" />
                      <span>Artículos</span>
                    </Link>
                  </div>
                  <div className="flex-grow-1 text-center">
                    <Link className="text-decoration-none px-2 j-counter-path-color">
                      <FaCircleCheck className="mx-1" />
                      <span>Datos</span>
                    </Link>
                  </div>
                  <div className="line2 flex-grow-1 text-end">
                    <Link
                      to={"/counter/payment"}
                      className="text-decoration-none px-2 sj_text_dark"
                    >
                      <FaCircleCheck className="mx-1" />
                      <span>Pago</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 mx-2 sj_hwidth">
              <div className="bg_gay p-4">
                <p className="mb-2">Datos cliente</p>
                <p>Tipos de comprobantes</p>
                <hr className="sj_bottom" />
                <Accordion activeKey={activeAccordionItem} className="sj_accordion">
                  <Accordion.Item eventKey="1" className="mb-2">
                    <Accordion.Header>
                      <div
                        onClick={() => handleAccordionClick("1")}
                        className={`sj_bg_dark px-4 py-2 sj_w-75 ${activeAccordionItem ===
                          "1"
                          ? "active"
                          : ""}`}
                      >
                        <input
                          type="radio"
                          name="receiptType"
                          value="1"
                          checked={selectedRadio === "1"}
                          onChange={() => setSelectedRadio("1")}
                          className="me-2 j-radio-checkbox"
                        />
                        <p className="d-inline px-3">Boleta nominativa:</p>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="sj_gay_border px-3 py-4 mt-2 j_mos_size">
                        <form>
                          <div className="row j_col_width">
                            <div className="col-12 mb-2">
                              <label className="mb-2">Rut </label>
                              <input
                                type="text"
                                name="rut1"
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

                  <Accordion.Item eventKey="2" className="mb-2">
                    <Accordion.Header>
                      <div
                        onClick={() => handleAccordionClick("2")}
                        className={`sj_bg_dark px-4 py-2 sj_w-75 ${activeAccordionItem ===
                          "2"
                          ? "active"
                          : ""}`}
                      >
                        <input
                          type="radio"
                          name="receiptType"
                          value="2"
                          checked={selectedRadio === "2"}
                          onChange={() => setSelectedRadio("2")}
                          className="me-2 j-radio-checkbox"
                        />
                        <p className="d-inline px-3">Boleta electrónica:</p>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="sj_gay_border px-3 py-4 mt-2 j_mos_size">
                        <form>
                          <div className="row  j_col_width">
                            <div className="col-12 mb-2">
                              <label className="mb-2">Rut </label>
                              <input
                                type="text"
                                name="rut2"
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

                  <Accordion.Item eventKey="3" className="mb-2">
                    <Accordion.Header>
                      <div
                        className={`sj_bg_dark px-4 py-2 sj_w-75 ${activeAccordionItem ===
                          "3"
                          ? "active"
                          : ""}`}
                        onClick={() => handleAccordionClick("3")}
                      >
                        <input
                          type="radio"
                          name="receiptType"
                          value="4"
                          checked={selectedRadio === "3"}
                          onChange={() => setSelectedRadio("3")}
                          className="me-2 j-radio-checkbox"
                        />
                        <p className="d-inline px-3">Factura:</p>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="sj_gay_border px-3 py-4 mt-2 j_mos_size">
                        <form>
                          <div className="row  j_col_width">
                            <div className="col-6 mb-2">
                              <label className="mb-2">Rut </label>
                              <input
                                type="text"
                                name="rut3"
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
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white form-select"
                                name="ltda"
                                ref={formRefs.ltda}
                                value={formData.ltda} // Add this to control the select value
                                defaultValue={formData.ltda}
                                onChange={handleInputChange}
                              >
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
                </Accordion>
              </div>
            </div>
          </div>
          <div
            className="j-counter-price j_position_sticky"
            style={{ top: "77px" }}
          >
            <div className="j_position_fixed j_b_hd_width ak-position">
              <h2 className="text-white j-kds-body-text-1000">Resumen</h2>
              <div className="j-counter-price-data">
                <h3 className="text-white j-kds-body-text-1000">Datos</h3>
                <div className="j-orders-inputs j_inputs_block ak-w-100">
                  <div className="j-orders-code ak-w-50">
                    <label className="j-label-name text-white mb-2 j-tbl-font-6 ">
                      Código pedido
                    </label>
                    <input
                      className="j-input-name j_input_name2 ak-input"
                      type="text"
                      placeholder={lastOrder ? lastOrder : "01234"}   //change
                      value={lastOrder ? lastOrder : orderType.orderId}
                      disabled
                    />
                  </div>
                  <div className="mb-3 b-input-registers ak-w-50">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label text-white"
                    >Quién lo registra
                    </label>
                    <input
                      type="text"
                      className="form-control b-form-control ak-input"
                      id="exampleFormControlInput1"
                      placeholder=""
                      // onChange={handlename}
                      value={userName}
                      disabled
                    />

                    {/* {orderTypeError && <div className="text-danger errormessage">{orderTypeError}</div>} */}
                  </div>
                  {/* <div className="j-orders-type ak-w-50">
                    <label className="j-label-name  text-white mb-2 j-tbl-font-6 ">
                      Tipo pedido
                    </label>
                    <select
                      className="form-select j-input-name-2 j-input-name-23 ak-input"
                      onChange={handleOrderTypeChange}
                      value={orderType.orderType}
                    >
                      <option value="0">Seleccionar</option>
                      <option value="delivery">Entrega</option>
                      <option value="local">Local</option>
                      <option value="withdraw">Retirar</option>
                    </select>
                  </div> */}
                </div>

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
                  <div className="j-counter-order j_counter_width">
                    <h3 className="text-white j-tbl-font-5">Pedido </h3>

                    <div className={`j-counter-order-data `}>
                      {(showAllItems
                        ? cartItems
                        : cartItems.slice(0, 3)).map((item, index) => (
                          <div className="j-counter-order-border-fast">
                            <div className="j-counter-order-img j_counter_order_final" key={item.id}>
                              <div className="j_d_flex_aic">
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
                    {/* <Modal
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
                      <Modal.Footer className="border-0 justify-content-end">
                        <Button
                          className="j-tbl-btn-font-1 b_btn_close"
                          variant="danger"
                          onClick={() => {
                            removeEntireItem(itemToDelete);
                            handleCloseEditFam();
                            handleShowEditFamDel();
                          }}
                        >
                          Si, seguroaa
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
                    </Modal> */}
                    {/* <Modal
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
                    </Modal> */}
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
                  <Modal.Footer className="border-0 justify-content-end">
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
      </div>
    </div>
  );
};

export default Mostrador;
