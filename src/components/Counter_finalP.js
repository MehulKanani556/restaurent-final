import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import { FaCircleCheck, FaMinus, FaPlus } from "react-icons/fa6";
import { Accordion, Button, Modal, Spinner } from "react-bootstrap";
import Sidenav from "./Sidenav";
import { Link, useNavigate } from "react-router-dom";
import Recipt from "./Recipt";
import { MdRoomService } from "react-icons/md";
import axios from "axios";

const Counter_finalP = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [token] = useState(localStorage.getItem("token"));
  const [role] = useState(localStorage.getItem("role"));
  const [creditId] = useState(localStorage.getItem("credit"));
  const userName = localStorage.getItem("name");
  const API = process.env.REACT_APP_IMAGE_URL;
  const userId = localStorage.getItem("userId");
  const admin_id = localStorage.getItem("admin_id");
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(sessionStorage.getItem("orderId"));



  console.log("orderId: ", orderId);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const [payment, setPayment] = useState(
    JSON.parse(localStorage.getItem("payment"))
  );

  const [orderType, setOrderType] = useState(
    JSON.parse(localStorage.getItem("currentOrder")) || []
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [show11, setShow11] = useState(false);
  const [creditData, setCreditData] = useState({})
  const handleClose11 = () => {
    setShow11(false)
    if (creditId) {
      localStorage.removeItem("credit");
      navigate(`/home/client/detail_no2/${creditData?.order_id}`);
    }
    navigate('/counter');
    // setTimeout(() => {
    //   setShow11(false)
    //   navigate('/counter')
    // }, 2000);
  }
  const handleShow11 = () => setShow11(true);

  const [price, setPrice] = useState("");

  const validateNumericInput = (value, allowDecimal = true) => {
    const regex = allowDecimal ? /^\d*\.?\d{0,2}$/ : /^\d*$/;
    return regex.test(value) ? value : "";
  };

  const handleprice = (event) => {
    let value = event.target.value.replace("$", "");
    value = validateNumericInput(value);
    const numericValue = parseFloat(value) || 0;

    // Assuming a maximum tip of 100% of the total cost
    const maxTip = getTotalCost();
    if (numericValue > maxTip) {
      value = maxTip.toFixed(2);
    }
    setPrice(value);
    setTipAmount(parseFloat(value));
  };

  const [showAllItems, setShowAllItems] = useState(false);
  const toggleShowAllItems = () => {
    setShowAllItems(!showAllItems);
  };

  const [countsoup, setCountsoup] = useState(1);
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCreSuc, setShowCreSuc] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("1");
  const [activeAccordionItem, setActiveAccordionItem] = useState("0");
  const [formErrors, setFormErrors] = useState({});
  const [show, setShow] = useState(false);
  const [tipError, setTipError] = useState("");


  const handleClose = () => {
    setShow(false);
    setTipError("");
  };
  const handleShow = () => setShow(true);
  const [lastOrder, setLastOrder] = useState('');

  const [showCreSubSuc, setShowCreSubSuc] = useState(false);
  const handleCloseCreSubSuc = () => setShowCreSubSuc(false);
  const handleShowCreSubSuc = () => {
    setShowCreSubSuc(true);
    setTipAmount(parseFloat(price) || 0);
    setTimeout(() => {
      handleCloseCreSubSuc();
    }, 2000);
  };

  const [isEditing, setIsEditing] = useState(
    Array(cartItems.length).fill(false)
  );
  // Add ref for note inputs
  const noteInputRefs = useRef({});

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

  // const handleFinishEditing = (index) => {
  //   // Get final value from ref
  //   const finalNote = noteInputRefs.current[index]?.value || "";

  //   setCartItems(prevItems => {
  //     const updatedItems = [...prevItems];
  //     updatedItems[index] = {
  //       ...updatedItems[index],
  //       isEditing: false,
  //       note: finalNote
  //     };
  //     return updatedItems;
  //   });
  // };

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
  };

  useEffect(() => {
    if (!(role == "admin" || role == "cashier")) {
      navigate('/dashboard')
    }
  }, [role])

  useEffect(() => {
    // Load cart items from localStorage
    setIsProcessing(true);
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
    setIsProcessing(false);
  }, []); // Empty dependency array to run once on component mount

  useEffect(
    () => {
      // Save cart items to localStorage whenever cartItems or countsoup change
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("countsoup", JSON.stringify(countsoup));
    },
    [cartItems, countsoup]
  );

  const handleAccordionClick = (value) => {
    setSelectedRadio(value);
  };

  const initialCustomerData = {
    cashAmount: "",      // Amount for cash payment
    debitAmount: "",     // Amount for debit payment
    creditAmount: "",    // Amount for credit payment
    transferAmount: "",  // Amount for transfer payment
    turn: ""
  };

  const getTotalCost = () => {
    return (
      cartItems.reduce(
        (total, item, index) => total + parseInt(item.price) * item.count,
        0
      )
    );
  };

  const totalCost = getTotalCost();
  const discount = 1.0;
  const finalTotal = totalCost - discount - (creditId ? creditData?.creditTotal : 0);
  const taxAmount = finalTotal * 0.19;

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [customerData, setCustomerData] = useState(initialCustomerData);
  // console.log(selectedCheckboxes);

  const handleCheckboxChange = (value) => {
    // console.log(value);
    if (selectedCheckboxes.includes(value)) {

      if (customerData?.[value + "Amount"]) {
        setCustomerData((prevData) => ({
          ...prevData,
          turn: customerData?.[value + "Amount"] ? parseFloat(customerData?.turn || 0) + parseFloat(-customerData?.[value + "Amount"]) : 0
        }));
      }
      setSelectedCheckboxes((prev) => prev.filter((item) => item !== value));

      setCustomerData((prevData) => ({
        ...prevData,
        [value + "Amount"]: ""
      }));
    } else {
      setSelectedCheckboxes((prev) => [...prev, value]);
      setCustomerData({
        ...customerData,
        [value + "Amount"]: customerData?.turn && customerData.turn < 0 ?
          (Math.abs(customerData.turn.toFixed(2))).toString() : '',
        turn: customerData?.turn && customerData.turn > 0 ? customerData.turn : 0
      });
    }
    // Clear the payment type error when a type is selected
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      paymentType: undefined
    }));
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    value = value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
    // console.log(name);
    const otherbox = selectedCheckboxes.filter(item => !name.includes(item))
    // console.log(otherbox);
    setCustomerData((prevState) => {

      const currentValue = parseFloat(value) || 0;
      const totalDue = finalTotal + taxAmount + tipAmount;
      const otherAmount = Math.max(totalDue - currentValue, 0);

      // console.log(otherAmount);

      const updatedState = {
        ...prevState,
        [name]: value,
      };

      // console.log(updatedState);
      if (otherbox.length > 0) {
        const otherPaymentType = otherbox[0] + 'Amount';
        updatedState[otherPaymentType] = otherAmount.toFixed(2);
      }
      // console.log(updatedState);

      // New calculation for turn
      const totalAmount = parseFloat(updatedState.cashAmount || 0) + parseFloat(updatedState.debitAmount || 0) + parseFloat(updatedState.creditAmount || 0) + parseFloat(updatedState.transferAmount || 0);
      updatedState.turn = totalAmount - (finalTotal + taxAmount + tipAmount); // Update turn based on total amounts
      return updatedState;

    });
    // console.log("Payment", customerData);
    setFormErrors((prevState) => ({
      ...prevState,
      amount: undefined
    }));
  };

  useEffect(
    () => {
      if (showCreSuc) {
        setShowLoader(true);
        const timer = setTimeout(() => {
          setShowLoader(false);
          setShowSuccess(true);
        }, 2000);

        return () => clearTimeout(timer);
      }
    },
    [showCreSuc]
  );

  useEffect(
    () => {
      let successTimer;
      if (showSuccess) {
        successTimer = setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      }

      return () => clearTimeout(successTimer);
    },
    [showSuccess]
  );

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handleCloseCreSuc = () => {
    setShowCreSuc(false);
  };

  const handleAccordionSelect = (eventKey) => {
    setActiveAccordionItem(eventKey);
    setSelectedRadio("0");
  };
  useEffect(
    () => {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    },
    [cartItems]
  );
  // cart
  const handleFinishEditing = (index) => {
    const updatedCartItems = cartItems.map(
      (item, i) => (i === index ? { ...item, isEditing: false } : item)
    );
    setCartItems(updatedCartItems);
  };

  //===Get CreditData======-

  useEffect(() => {
    if (creditId) {
      fetchCredit()
    }
  }, [creditId])

  const fetchCredit = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${apiUrl}/order/getCredit`, { admin_id: admin_id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(response.data.data);

      const credit = response.data.data?.find((v) => v.id == creditId);
      // console.log(credit);

      const Total = credit.return_items?.reduce((acc, v) => acc + v.amount * v.quantity, 0);
      const creditTotal = parseFloat((Total + Total * 0.19).toFixed(2))

      // console.log(Total,creditTotal);

      setCreditData({ ...credit, creditTotal: creditTotal });
      // console.log(credit);

    } catch (error) {
      console.error(
        "Error fetching allOrder:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
  }

  // console.log(creditData);


  // ==== Get BOX Data =====

  const [boxId, setBoxId] = useState('')

  const fetchBoxData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-boxs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setBoxId(data.find((v) => v.user_id == userId));
    } catch (error) {
      console.error(
        "Error fetching box:",
        error.response ? error.response.data : error.message
      );
    }
  }



  // data
  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("currentOrder")) || {};
    setOrderType(storedOrder);
    fetchBoxData();
  }, []);


  const handleOrderTypeChange = (e) => {
    const newOrderType = e.target.value;
    const updatedOrder = { ...orderType, orderType: newOrderType };
    setOrderType(updatedOrder);
    localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
  };

  const paymentData = {
    ...payment,
    amount: customerData.amount,
    type: selectedCheckboxes,
    order_master_id: orderType.orderId,
    return: customerData.turn,
    tax: taxAmount // Added tax amount to payment data
  };

  const validateForm = () => {
    let errors = {};

    // Validate payment type selection
    if (selectedCheckboxes.length === 0) {
      errors.paymentType = "Por favor seleccione un tipo de pago";
    }

    const totalWithTax = finalTotal + taxAmount + tipAmount;

    const totalPaymentAmount = parseFloat(customerData.cashAmount || 0) + parseFloat(customerData.debitAmount || 0) + parseFloat(customerData.creditAmount || 0) + parseFloat(customerData.transferAmount || 0);
    // console.log(totalPaymentAmount < totalWithTax, totalPaymentAmount <= 0)
    // Validate payment amount
    if (!totalPaymentAmount || totalPaymentAmount <= 0) {
      errors.amount = "Por favor, introduzca un importe de pago válido";
      // } else if (parseFloat(customerData.amount) < totalWithTax.toFixed(2)) {

    } else if (totalPaymentAmount < totalWithTax.toFixed(2)) {
      errors.amount = "El monto del pago debe cubrir el costo total";
    }
    return errors;
    // // Validate payment amount
    // if (!customerData.amount || parseFloat(customerData.amount) <= 0) {
    //   errors.amount = "Por favor, introduzca un importe de pago válido";
    // } else if (parseFloat(customerData.amount) < totalWithTax.toFixed(2)) {
    //   errors.amount = "El monto del pago debe cubrir el costo total";
    // }

    // return errors;
  };
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [navigationPath, setNavigationPath] = useState('');

  const navigationPage = () => {
    // console.log(navigationPath, "asgaysg ");
    if (navigationPath) {
      navigate(navigationPath);
    }
    // Replace with the actual path you want to navigate to
  };

  const handleLinkNavigation = (path) => {
    // console.log("sbhdj", isSubmitted)
    if (!isSubmitted) {
      setNavigationPath(path); // Store the path to navigate after confirmation
      setShowDeleteConfirmation(true); // Show confirmation modal
    } else {
      navigate(path); // Navigate directly if submitted
    }
  };

  // submit
  const handleSubmit = async () => {
    // if (role !== "cashier") {
    //   alert("Solo los cajeros pueden realizar pedidos.");
    //   return;
    // }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      // Display errors to user
      setFormErrors(errors);
      return;
    }

    const orderDetails = cartItems.map((item) => ({
      item_id: item.id,
      quantity: item.count,
      notes: item.note ? item.note.replace(/^Nota:\s*/i, "").trim() : "",
      admin_id: admin_id
    }));

    const totalPaymentAmount = parseFloat(customerData.cashAmount || 0) + parseFloat(customerData.debitAmount || 0) + parseFloat(customerData.creditAmount || 0) + parseFloat(customerData.transferAmount || 0);
    // console.log("payment", payment);
    const orderData = {
      order_details: orderDetails,
      admin_id: admin_id,
      order_master: {
        order_type: orderType.orderType,
        payment_type: selectedCheckboxes[0],
        status: "received",
        discount: discount, // Use the discount value from your state
        user_id: userId, // You might want to dynamically set this
        delivery_cost: 0, // You might want to dynamically set this
        customer_name:
          payment.firstname && payment.firstname.trim() !== ""
            ? payment.firstname
            : payment.business_name || "",
        reason: "",
        person: "",
        tip: tipAmount,
        box_id: boxId?.id != 'undefined' ? boxId?.id : '',
        transaction_code: true,
      }
    };
    let order_master_id;

    setIsProcessing(true);
    try {
      if (!orderId) {

        const response = await axios.post(`${apiUrl}/order/place_new`, orderData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!response.data.success) {
          alert(response.data.message)
        }
        console.log(response.data);
        order_master_id = response.data.kdsOrder.order_id;
        sessionStorage.setItem('orderId', order_master_id);
        setOrderId(order_master_id);
      }
      // console.log("order_master_id", response.data.kdsOrder.id);
      // alert("sdv");
      if (order_master_id || orderId) {
        const paymentData = {
          ...payment,
          amount: totalPaymentAmount,
          type: selectedCheckboxes,
          order_master_id: order_master_id,
          return: customerData.turn,
          admin_id: admin_id,
        };
        try {
          const responsePayment = await axios.post(
            `${apiUrl}/payment/insert`,
            paymentData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )


          // console.log("payemnt suc", responsePayment.data);

          if (creditId) {
            setIsProcessing(true);
            axios
              .post(
                `${apiUrl}/order/getCreditUpdate/${creditId}`,
                {
                  status: "Completed",
                  destination: orderType.orderId
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                // console.log(response.data);
                setIsProcessing(false);
                // setShowcreditfinal(true);
                // setTimeout(() => {
                //   setShowcreditfinal(false);
                //   navigate('/home/client/detail', {
                //     replace: true,
                //     state,
                //   });
                // }, 2000);
              })
              .catch((error) => {
                console.error(error);
                setIsProcessing(false);
                // setError('Hubo un error al intentar realizar el retorno');
              });
          }
          localStorage.removeItem("cartItems");
          localStorage.removeItem("currentOrder");
          localStorage.removeItem("payment");
          sessionStorage.removeItem("orderId");
          setOrderId('');
          setIsSubmitted(true);
          handleShow11();
          // handleClose11();

          setIsProcessing(false);

        } catch (error) {
          console.log(error, "payment Not Done");

        }
        // handlePrint();
      }
    } catch (error) {
      console.error("Error creating order : ", error);

      //enqueueSnackbar (error?.response?.data?.message, { variant: 'error' })
      setIsProcessing(false);
      setIsSubmitted(false);
    }

  };
  // print recipt
  const handlePrint = () => {
    setIsProcessing(true);
    const printContent = document.getElementById("receipt-content");
    if (printContent) {
      // Create a new iframe
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // Write the receipt content into the iframe
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(
        "<html><head><title>Print Receipt</title>"
      );
      iframe.contentWindow.document.write(
        "<style>body { font-family: Arial, sans-serif; }</style>"
      );
      iframe.contentWindow.document.write("</head><body>");
      iframe.contentWindow.document.write(printContent.innerHTML);
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

        // Remove the iframe after printing (or if printing fails)
        setTimeout(() => {
          document.body.removeChild(iframe);
          navigate("/counter");
          setIsProcessing(false);
        }, 500);
      };
    } else {
      console.error("Receipt content not found");
    }
  };
  return (
    <div>
      <Header />
      <div className="s_bg_dark">
        <div className="j-flex">
          <div>
            <Sidenav onNavigate={handleLinkNavigation} />
          </div>
          <div className="flex-grow-1 sidebar j-position-sticky text-white">
            <div className="j-counter-header j_counter_header_last_change" >
              <h2 className="text-white mb-3 sjfs-18">Mostrador</h2>
              <div className="j-menu-bg-color ">
                <div className="j-tracker-mar d-flex justify-content-between ">
                  <div className="line1  flex-grow-1">
                    <Link className="text-decoration-none px-2 sj_text_dark">
                      <FaCircleCheck className="mx-1" />
                      <span>Artículos</span>
                    </Link>
                  </div>
                  <div className="  flex-grow-1 text-center">
                    <Link
                      to={"/counter/mostrador"}
                      className="text-decoration-none px-2 sj_text_dark"
                    >
                      <FaCircleCheck className="mx-1" />
                      <span>Datos</span>
                    </Link>
                  </div>
                  <div className="line2  flex-grow-1 text-end">
                    <Link className="text-decoration-none px-2 j-counter-path-color">
                      <FaCircleCheck className="mx-1" />
                      <span>Pago</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className=" mt-2 mx-2 sj_hwidth">
              <div className="bg_gay p-4">
                <div className="j-final-stage">
                  <h5 className="mb-2 sjfs-18">Tipos de pago</h5>
                  <button className="sj_bg_sky j_bg_sky" onClick={handleShow}>
                    <FaPlus className="j-icon-font-1" />
                    Agregar propina
                  </button>
                </div>

                <Modal
                  show={show}
                  onHide={handleClose}
                  backdrop={true}
                  keyboard={false}
                  className="m_modal jay-modal"
                >
                  <Modal.Header
                    closeButton
                    className="m_borbot b_border_bb mx-3 ps-0"
                  >
                    <Modal.Title className="j-tbl-text-10">
                      Agregar propina
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="border-0 pb-0 ">
                    <div className="mb-3">
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="form-label j-tbl-font-11"
                      >
                        Cantidad
                      </label>
                      <input
                        type="text"
                        className="form-control j-table_input"
                        id="exampleFormControlInput1"
                        value={`$${price}`}
                        onChange={handleprice}
                      />
                      {tipError && <p className="text-danger mt-2 errormessage">{tipError}</p>}
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="border-0 pt-0">
                    <Button
                      className="j-tbl-btn-font-1 b_btn_pop"
                      variant="primary"
                      onClick={() => {
                        if (!price || parseFloat(price) <= 0) {
                          setTipError("Por favor, ingrese una cantidad válida para la propina.");
                        } else {
                          setTipError("");
                          handleShowCreSubSuc();
                          handleClose();
                        }
                      }}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>


                <Modal
                  show={showCreSubSuc}
                  onHide={handleCloseCreSubSuc}
                  backdrop={true}
                  keyboard={false}
                  className="m_modal jay-modal"
                >
                  <Modal.Header closeButton className="border-0" />
                  <Modal.Body>
                    <div className="text-center">
                      <img src={require("../Image/check-circle.png")} alt="" />
                      <p className="mb-0 mt-2 h6">Propina agregada</p>
                      <p className="opacity-75">
                        Su propina ha sido agregada exitosamente
                      </p>
                    </div>
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
                      {/* <img
                        src={require("../Image/trash-outline-secondary.png")}
                        alt=" "
                      /> */}
                      <p className="mb-0 mt-3 h6">
                        {" "}

                        ¿Estás segura de que quieres abandonar este pedido?
                      </p>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="border-0 ">
                    <Button
                      className="j-tbl-btn-font-1 b_btn_close"
                      variant="danger"
                      onClick={() => {
                        setShowDeleteConfirmation(false);
                        navigationPage()
                      }}
                    >
                      Si, seguro
                    </Button>
                    <Button
                      className="j-tbl-btn-font-1 "
                      variant="secondary"
                      onClick={() => setShowDeleteConfirmation(false)}
                    >
                      No, abandonar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <p className="j-final-p sjfs-14 pb-3">
                  Puedes seleccionar uno o mas
                </p>

                {formErrors.paymentType && (
                  <p className="errormessage text-danger">
                    {formErrors.paymentType}
                  </p>
                )}
                <Accordion className="sj_accordion" alwaysOpen>
                  <Accordion.Item eventKey="0" className="mb-2">
                    <Accordion.Header>
                      <div
                        onClick={() => handleCheckboxChange("cash")}
                        className={`sj_bg_dark px-4 py-2 sj_w-75 ${selectedCheckboxes.includes(
                          "cash"
                        )
                          ? "active"
                          : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="receiptType"
                          value="cash"
                          checked={selectedCheckboxes.includes("cash")}
                          // onChange={() => handleCheckboxChange("cash")}
                          className="me-2 j-change-checkbox"
                        />

                        <p className="d-inline px-3">Efectivo</p>
                      </div>
                    </Accordion.Header>
                    {selectedCheckboxes.includes("cash") && (
                      <Accordion.Body>
                        <div className="sj_gay_border px-3 py-4 mt-2">
                          <form className="j_payment_flex">
                            <div className="flex-grow-1 j_paymemnt_margin">
                              <label className="mb-2">Cantidad</label>
                              <br />
                              <input
                                type="text"
                                id="cashAmount" // change
                                name="cashAmount" // change
                                value={`$${customerData.cashAmount || ""}`} // change
                                onChange={handleChange}
                                className="input_bg_dark w-full px-4 py-2 text-white sj_width_mobil"
                              />
                              {formErrors.amount && (
                                <p className="errormessage text-danger">
                                  {formErrors.amount}
                                </p>
                              )}
                            </div>
                            <div className="flex-grow-1">
                              <label className="mb-2">Vuelto</label>
                              <br />
                              <input
                                type="email"
                                id="email"
                                name="turn"
                                value={`$${customerData.turn ? customerData.turn.toFixed(2) : ""}`}
                                onChange={handleChange}
                                className="input_bg_dark px-4 py-2 text-white sj_width_mobil"
                              />
                            </div>
                          </form>
                        </div>
                      </Accordion.Body>
                    )}
                  </Accordion.Item>
                  <Accordion.Item eventKey="1" className="mb-2">
                    <Accordion.Header>
                      <div
                        onClick={() => handleCheckboxChange("debit")}
                        className={`sj_bg_dark px-4 py-2 sj_w-75 ${selectedCheckboxes.includes(
                          "debit"
                        )
                          ? "active"
                          : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="receiptType"
                          value="debit"
                          checked={selectedCheckboxes.includes("debit")}
                          // onChange={() => handleCheckboxChange("debit")}
                          className="me-2 j-change-checkbox"
                        />

                        <p className="d-inline px-3">Tarjeta de debito</p>
                      </div>
                    </Accordion.Header>
                    {selectedCheckboxes.includes("debit") && (
                      // <Accordion.Body>
                      //   <div className="sj_gay_border px-3 py-4 mt-2">
                      //     <form>
                      //       <label className="mb-2 sjfs-16">Cantidad</label>
                      //       <br />
                      //       <input
                      //         type="text"
                      //         id="name"
                      //         name="amount"
                      //         value={`$${customerData.amount || ""}`}
                      //         onChange={handleChange}
                      //         className="sj_bg_dark sj_width_input px-4 py-2 text-white"
                      //       />
                      //       {formErrors.amount && (
                      //         <p className="errormessage text-danger">
                      //           {formErrors.amount}
                      //         </p>
                      //       )}
                      //     </form>
                      //   </div>
                      // </Accordion.Body>
                      <Accordion.Body>
                        <div className="sj_gay_border px-3 py-4 mt-2">
                          <form className="j_payment_flex">
                            <div className=" flex-grow-1 j_paymemnt_margin">
                              <label className="mb-2">Cantidad</label>
                              <br />
                              <input
                                type="text"
                                id="debitAmount" // Ensure this ID is unique
                                name="debitAmount" // Ensure this name matches the state
                                value={`$${customerData.debitAmount || ""}`} // Ensure correct binding
                                onChange={handleChange}
                                className="sj_bg_dark sj_width_input px-4 py-2 text-white"
                              />
                              {formErrors.amount && (
                                <p className="errormessage text-danger">
                                  {formErrors.amount}
                                </p>
                              )}
                            </div>
                          </form>
                        </div>
                      </Accordion.Body>
                    )}
                  </Accordion.Item>
                  <Accordion.Item eventKey="2" className="mb-2">
                    <Accordion.Header>
                      <div
                        onClick={() => handleCheckboxChange("credit")}
                        className={`sj_bg_dark px-4 py-2 sj_w-75 ${selectedCheckboxes.includes(
                          "credit"
                        )
                          ? "active"
                          : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="receiptType"
                          value="credit"
                          checked={selectedCheckboxes.includes("credit")}
                          // onChange={() => handleCheckboxChange("credit")}
                          className="me-2 j-change-checkbox"
                        />
                        <p className="d-inline px-3">Tarjeta de credito</p>
                      </div>
                    </Accordion.Header>
                    {selectedCheckboxes.includes("credit") && (
                      <Accordion.Body>
                        <div className="sj_gay_border px-3 py-4 mt-2">
                          <form className="j_payment_flex">
                            <div className=" flex-grow-1 j_paymemnt_margin">
                              <label className="mb-2">Cantidad</label>
                              <br />
                              <input
                                type="text"
                                id="creditAmount"
                                name="creditAmount"
                                value={`$${customerData.creditAmount || ""}`}
                                onChange={handleChange}
                                className="input_bg_dark w-full px-4 py-2 text-white sj_width_mobil"
                              />
                              {formErrors.amount && (
                                <p className="errormessage text-danger">
                                  {formErrors.amount}
                                </p>
                              )}
                            </div>
                          </form>
                        </div>
                      </Accordion.Body>
                    )}
                  </Accordion.Item>
                  <Accordion.Item eventKey="3" className="mb-2">
                    <Accordion.Header>
                      <div
                        onClick={() => handleCheckboxChange("transfer")}
                        className={`sj_bg_dark px-4 py-2 sj_w-75 ${selectedCheckboxes.includes(
                          "transfer"
                        )
                          ? "active"
                          : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="receiptType"
                          value="4"
                          checked={selectedCheckboxes.includes("transfer")}
                          // onChange={() => handleCheckboxChange("transfer")}
                          className="me-2 j-change-checkbox"
                        />
                        <p className="d-inline px-3">Transferencia</p>
                      </div>
                    </Accordion.Header>
                    {selectedCheckboxes.includes("transfer") && (
                      <Accordion.Body>
                        <div className="sj_gay_border px-3 py-4 mt-2">
                          <form>
                            <label className="mb-2 sjfs-16">Cantidad</label>
                            <br />
                            <input
                              type="text"
                              id="transferAmount"
                              name="transferAmount"
                              value={`$${customerData.transferAmount || ""}`}
                              onChange={handleChange}
                              className="sj_bg_dark sj_width_input px-4 py-2 text-white"
                            />
                            {formErrors.amount && (
                              <p className="errormessage text-danger">
                                {formErrors.amount}
                              </p>
                            )}
                          </form>
                        </div>
                      </Accordion.Body>
                    )}
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </div>
          <div
            className="j-counter-price bg_gay bg_margin position-sticky"
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
                      placeholder={lastOrder ? lastOrder : "01234"}          //change
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
                  {/* <div className="j-orders-type  ak-w-50">
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
                      <p className="p-product-order j-tbl-btn-font-1 ">
                        Agregar producto para empezar<br />
                        con el pedido de la mesa
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="j-counter-order">
                      <h3 className="text-white j-tbl-font-5">Pedido </h3>
                      <div
                        className={`j-counter-order-data ${cartItems.length ===
                          0
                          ? "empty"
                          : "filled"}`}
                      >
                        {cartItems
                          .slice(0, showAllItems ? cartItems.length : 3)
                          .map((item, index) => (
                            <div
                              className="j-counter-order-border-fast"
                              key={item.id}
                            >
                              <div className="j-counter-order-img j_payment_final">
                                <div className="j_d_flex_aic">
                                  <img
                                    src={`${API}/images/${item.image}`}
                                    alt=""
                                  />
                                  <h5 className="text-white j-tbl-font-5">
                                    {item.name}
                                  </h5>
                                </div>
                                <div className="d-flex align-items-center">
                                  <div className="j-counter-mix j-counter-mix-remove">
                                    <h3 className="m-0">{item.count}</h3>
                                  </div>
                                  <h4 className="text-white fw-semibold j_item_price d-flex">
                                    ${parseInt(item.price) * item.count}
                                  </h4>
                                </div>
                              </div>
                              <div
                                key={index}
                                className="text-white j-order-count-why"
                              >
                                {renderNoteInput(item, index)}
                              </div>
                            </div>
                          ))}
                        {cartItems.length > 3 && (
                          <Link
                            onClick={toggleShowAllItems}
                            className="sjfs-14"
                          >
                            {showAllItems ? "Ver menos" : "Ver más"}
                          </Link>
                        )}
                      </div>
                      <div className="j-counter-total ak-counter-total">
                        <h5 className="text-white j-tbl-text-15">
                          Costo total
                        </h5>
                        <div className="j-total-discount d-flex justify-content-between">
                          <p className="j-counter-text-2">Artículos</p>
                          <span className="text-white">
                            ${totalCost.toFixed(2)}
                          </span>
                        </div>
                        {tipAmount > 0 && (
                          <div className="j-total-discount d-flex justify-content-between">
                            <p className="j-counter-text-2">Propina</p>
                            <span className="text-white">
                              ${tipAmount.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {creditId &&
                          <div className="j-total-discount d-flex justify-content-between">
                            <p className="j-counter-text-2">credito</p>
                            <span className="text-white">
                              ${creditData.creditTotal}
                            </span>
                          </div>
                        }

                        <div className="j-total-discount d-flex justify-content-between">
                          <p className="j-counter-text-2">Descuentos</p>
                          <span className="text-white">
                            ${discount.toFixed(2)}
                          </span>
                        </div>

                        <div className="j-border-bottom-counter">
                          <div className="j-total-discount d-flex justify-content-between">
                            <p className="j-counter-text-2">IVA 19.00%</p>
                            <span className="text-white">${taxAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="j-total-discount my-2 d-flex justify-content-between">
                          <p className="text-white bj-delivery-text-153">
                            Total
                          </p>
                          <span className="text-white bj-delivery-text-153">
                            ${(finalTotal + taxAmount + tipAmount).toFixed(2)}
                          </span>
                        </div>
                        <div className="btn w-100 j-btn-primary text-white">
                          <div
                            className="text-white text-decoration-none btn-primary m-articles-text-2"
                            onClick={handleSubmit}
                          >
                            Continuar
                          </div>
                        </div>
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
                            onClick={handleClose11}
                          >
                            <Modal.Title
                              className="modal-title j-caja-pop-up-text-1"
                              id="staticBackdropLabel"
                            >
                              Comprobante de venta
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Recipt
                              payment={paymentData}
                              item={cartItems}
                              discount={discount}
                              paymentAmt={customerData}
                              paymentType={selectedCheckboxes}
                              creditTotal={creditId && creditData.creditTotal}
                            />
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
                        <Modal
                          show={showLoader}
                          backdrop={true}
                          keyboard={false}
                          className="m_modal jay-modal"
                        >
                          <Modal.Header
                            closeButton={false}
                            className="border-0"
                          />
                          <Modal.Body>
                            <div className="text-center">
                              <div className="j-loader" aria-label="loading" />
                              <p className="opacity-75 mt-3">Procesando pago</p>
                            </div>
                          </Modal.Body>
                        </Modal>

                        <Modal
                          show={showSuccess}
                          onHide={handleCloseSuccess}
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
                              <p className="opacity-75 mt-3">
                                Venta realizada exitosamente
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter_finalP;
