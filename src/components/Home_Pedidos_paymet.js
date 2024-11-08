import React, { useEffect, useRef, useState } from 'react'
import Header from './Header'
import Sidenav from './Sidenav'
import { Badge, Button, Modal, Spinner } from 'react-bootstrap'
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { CgCalendarDates } from "react-icons/cg";
import { FiPlus } from "react-icons/fi";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import pic1 from "../img/Image.png"
import pic2 from "../img/Image(1).jpg"
import pic3 from "../img/Image (2).png"
import { Tabs, Tab } from 'react-bootstrap';
import { IoMdCloseCircle, IoMdInformationCircle } from 'react-icons/io';
import img2 from "../Image/addmenu.jpg";
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsCalculatorFill } from 'react-icons/bs';

export default function Home_Pedidos_paymet() {

  const apiUrl = process.env.REACT_APP_API_URL; // Laravel API URL
  const API = process.env.REACT_APP_IMAGE_URL;
  const [token] = useState(localStorage.getItem("token"));
  const admin_id = localStorage.getItem("admin_id");

  const { id } = useParams();

  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // create family
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show12, setShow12] = useState(false);
  const handleClose12 = () => setShow12(false);
  const [errorReason, setReasonError] = useState(null);
  const noteInputRefs = useRef({});
  const handleShow12 = async () => {

    // ----resons----
    // ===change====
    // console.log(reason);
    if (!reason) {
      setReasonError("Ingrese el motivo de validez");
      setShow12(true);
      return;
    }

    try {
      setIsProcessing(true);
      const response = await axios.post(
        `${apiUrl}/order/updateorderreason/${id.toString()}`,
        { reason: reason },
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
    } finally {
      setIsProcessing(false);
    }

    try {
      setIsProcessing(true);
      const response = await axios.post(
        `${apiUrl}/order/updateStatus`,
        { order_id: id, status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getOrderStatus();
      // getOrder();
      console.log("Order Cancle successfully:", response.data);

    } catch (error) {
      console.error(
        "Error adding note:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsProcessing(false);
    }

    // ---End-resons----

    setShow12(true)
    setTimeout(() => {
      setShow12(false)
      getOrder();
      // navigate(`/home_Pedidos/payment_edit/${id}`, { replace: true, state: "profile" });
    }, 2000);
  };

  // =============New BackEnd=========

  const [orderData, setOrderData] = useState(null);
  const [items, setItems] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [sector, setSector] = useState(null);
  const [table, setTable] = useState(null);
  const [reason, setReason] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [visibleInputId, setVisibleInputId] = useState(null);
  const [noteValues, setNoteValues] = useState('');

  const [obj1, setObj1] = useState([]);
  const [parentCheck, setParentCheck] = useState([]);
  const [childCheck, setChildCheck] = useState([]);

  const [searchTermMenu, setSearchTermMenu] = useState(""); // State to hold search term
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [filteredItemsMenu, setFilteredItemsMenu] = useState(obj1);

  // const [filteredMenuItems, setFilteredMenuItems] = useState([]); // State to hold filtered items
  // const [searchTerm, setSearchTerm] = useState(""); // State to hold search term
  // const [menuId, setMenuId] = useState(null);
  // const [itemId, setItemId] = useState([]);


  // Add producttion
  const [show1Prod, setShow1Prod] = useState(false);
  const handleClose1Prod = () => {
    setShow1Prod(false);
    setSelectedItemsMenu([]);
    setSelectedItemsCount(0);
  }
  const handleShow1Prod = () => setShow1Prod(true);
  const [selectedItemsMenu, setSelectedItemsMenu] = useState([]);

  // Add product success
  const [show1AddSuc, setShow1AddSuc] = useState(false);
  const handleClose1AddSuc = () => setShow1AddSuc(false);
  const handleShow1AddSuc = () => {
    setShow1AddSuc(true)
    setTimeout(() => {
      setShow1AddSuc(false)
    }, 2000);
  };

  useEffect(() => {
    getOrder();
    getItems();
    getOrderStatus();
    getRole();
    getFamily();
    getSubFamily();
  }, [show12, show1Prod]);

  useEffect(() => {
    if (orderData && items.length > 0) {
      handleOrderDetails();
      getSector();
    }
    if (orderData?.user_id) {
      getUser();
    }
  }, [orderData, items, show1Prod]);

  useEffect(() => {
    if (user) {
      setUserRole(user.name)
      // getuserRole();
    }
  }, [user]);

  useEffect(() => {
    getPaymentsData();
    fetchCredit()
  }, [admin_id, id]);
  const [creditNote, setCreditNote] = useState(false);

  const fetchCredit = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${apiUrl}/order/getCredit`, { admin_id: admin_id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.data);


      const credit = response.data.data?.some((v) => v.order_id == id);

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


  const [pamentDone, setPaymentDone] = useState(false)

  const getPaymentsData = async () => {
    console.log(admin_id, admin_id);

    try {
      const response = await axios.get(`${apiUrl}/getsinglepayments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Payments Data:", response);
      if (response.data.success) {
        // console.log("true");
        setPaymentDone(true);
      }
    } catch (error) {
      console.error(
        "Error fetching PaymentsData:",
        error.response ? error.response.data : error.message
      );
    }
  }

  const getOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${apiUrl}/order/getSingle/${id}`, { admin_id: admin_id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderData(response.data[0]);
    } catch (error) {
      console.error(
        "Error fetching OrderData:",
        error.response ? error.response.data : error.message
      );
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
      setObj1(response.data.items.filter(v => v.deleted_at == null));
      // setFilteredMenuItems(response.data.items);
      setFilteredItemsMenu(response.data.items.filter(v => v.deleted_at == null));
    } catch (error) {
      console.error(
        "Error fetching Items:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
  };

  const getSector = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${apiUrl}/sector/getWithTable`, { admin_id: admin_id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let sectors = response.data.data;

      const sectorWithTable = sectors.find(v =>
        v.tables.some(a => a.id == orderData.table_id)
      );



      if (sectorWithTable) {
        setSector(sectorWithTable);
        setTable(sectorWithTable.tables.find(a => a.id == orderData.table_id));
      }
    } catch (error) {
      console.error(
        "Error fetching sector and Table Data:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
  };

  const getOrderStatus = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${apiUrl}/order/getLog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderStatus(response.data);
    } catch (error) {
      console.error(
        "Error fetching OrderStatus:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
  };

  const getUser = async () => {
    setIsProcessing(true);
    try {
      console.log(orderData.user_id);

      const response = await axios.get(`${apiUrl}/get-user/${orderData.user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data[0]);

      setUser(response.data[0]);
    } catch (error) {
      console.error(
        "Error fetching user:",
        error.response ? error.response.data : error.message
      );
      setUser(null); // Set user to null if there's an error
    }
    setIsProcessing(false);
  };

  const getRole = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${apiUrl}/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
  };

  // const getuserRole = () => {
  //   if (user && roles.length > 0) {
  //     const role = roles?.find((v) => v.id === user[0]?.role_id);
  //     if (role) {
  //       setUserRole(role.name);
  //     }
  //   }
  // };

  const handleOrderDetails = () => {
    // Check if orderData is not null before accessing its properties
    if (orderData) {
      const details = orderData.order_details.map((orderItem) => {
        const matchingItem = items.find((item) => item.id === orderItem.item_id);
        return {
          ...orderItem,
          image: matchingItem ? matchingItem.image : orderItem.image,
          description: matchingItem ? matchingItem.description : orderItem.description,
        };
      });
      setOrderDetails(details);
    } else {
      console.error("orderData is null, cannot handle order details.");
    }
  };

  const getFamily = async () => {
    try {
      const response = await axios.get(`${apiUrl}/family/getFamily`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setParentCheck(response.data);
    } catch (error) {
      console.error(
        "Error fetching Family",
        error.response ? error.response.data : error.message
      );
    }
  }
  const getSubFamily = async () => {
    try {
      const response = await axios.get(`${apiUrl}/subfamily/getSubFamily`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setChildCheck(response.data);
    } catch (error) {
      console.error(
        "Error fetching SubFamily",
        error.response ? error.response.data : error.message
      );
    }
  }

  // ----resons section -----

  const handlereasons = (event) => {
    let notes = event?.target.value
    setReason(notes)
    if (notes) {
      setReasonError(null)
    }
  }

  // ----resons section  end-----

  // =========Add product Modal ==============

  const [checkedParents, setCheckedParents] = useState({});
  const [checkedChildren, setCheckedChildren] = useState({});

  useEffect(() => {

    const initialParents = {};
    const initialChildren = {};
    parentCheck.forEach(parent => initialParents[parent.id] = false);
    childCheck.forEach(child => initialChildren[child.id] = false);
    setCheckedParents(initialParents);
    setCheckedChildren(initialChildren);
  }, [parentCheck, childCheck]);

  const handleParentChangeMenu = (parentId) => {
    const newCheckedParents = { ...checkedParents, [parentId]: !checkedParents[parentId] };
    setCheckedParents(newCheckedParents);

    const newCheckedChildren = { ...checkedChildren };
    childCheck.forEach(child => {
      if (parentCheck.find(p => p.id === parentId)?.name === child.family_name) {
        newCheckedChildren[child.id] = newCheckedParents[parentId];
      }
    });
    setCheckedChildren(newCheckedChildren);

    filterItems(newCheckedParents, newCheckedChildren, searchTermMenu);
  };

  const handleChildChangeMenu = (childId, parentName) => {
    const newCheckedChildren = { ...checkedChildren, [childId]: !checkedChildren[childId] };
    setCheckedChildren(newCheckedChildren);

    const parentId = parentCheck.find(p => p.name === parentName)?.id;
    const allChildrenUnchecked = childCheck
      .filter(child => child.family_name === parentName)
      .every(child => !newCheckedChildren[child.id]);

    const newCheckedParents = { ...checkedParents, [parentId]: !allChildrenUnchecked };
    setCheckedParents(newCheckedParents);

    filterItems(newCheckedParents, newCheckedChildren, searchTermMenu);
  };

  const filterItems = (parents, children, searchTerm) => {
    const filteredItems = obj1.filter(item => {
      const matchesParent = Object.values(parents).some(checked => checked) ? parents[item.family_id] : true;
      const matchesChild = Object.values(children).some(checked => checked) ? children[item.sub_family_id] : true;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

      return ((matchesParent && matchesChild) || (!Object.values(parents).some(checked => checked) && !Object.values(children).some(checked => checked))) && matchesSearch;
    });

    setFilteredItemsMenu(filteredItems);
  };

  const handleSearchMenu = (event) => {
    const term = event.target.value;
    setSearchTermMenu(term);
    filterItems(checkedParents, checkedChildren, term);
  };


  // // ==== select items section ====
  const handleAddItem = (item) => {
    setSelectedItemsMenu((prevArray) => {
      const itemIndex = prevArray.findIndex((v) => v.item_id === item.id);

      if (itemIndex !== -1) {
        // Item exists, so remove it
        const newArray = [...prevArray];
        newArray.splice(itemIndex, 1);
        setSelectedItemsCount(prevCount => prevCount - 1);
        console.log(`Removed item ${item.id}`);
        return newArray;
      } else {
        // Item doesn't exist, so add it
        const newItem = {
          item_id: item.id,
          quantity: 1,
        };
        setSelectedItemsCount(prevCount => prevCount + 1);
        console.log(`Added item ${item.id}`);
        return [...prevArray, newItem];
      }
    });
  };

  // ==== select items section ====

  /*========= Add menu to Order =======*/
  const handleAddMenu = async () => {

    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/order/addItem`,
        {
          "order_id": id,
          "order_details": selectedItemsMenu,
          "admin_id":admin_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          maxBodyLength: Infinity
        }
      );



      if (!(response.success == "false")) {
        handleClose1Prod();
        handleShow1AddSuc();

        // setItemId([]);
        setSelectedItemsMenu([]);

      } else {
        console.error("Failed to add items to menu");
      }
    } catch (error) {
      console.error(
        "Error adding items to menu:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
    // finally {
    //   setIsProcessing(false);
    // }
  };

  /*========= Add menu to Order =======*/


  // ===============note ========
  const toggleInput = (id) => {
    setVisibleInputId(prevId => prevId === id ? null : id);
  };

  const handleNoteChange = (id, value) => {
    if (noteInputRefs.current[id]) {
      noteInputRefs.current[id].value = value; // Update the input value directly
    }
  };

  const handleNoteKeyDown = async (id) => {
    const finalNote = noteInputRefs.current[id]?.value || "";
    try {
      const response = await axios.post(
        `${apiUrl}/order/addNote/${id}`,
        { notes: finalNote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Note added successfully:", response.data);

      // setSavedNote(noteValues);
      setNoteValues('');
      setVisibleInputId(null);
    } catch (error) {
      console.error(
        "Error adding note:",
        error.response ? error.response.data : error.message
      );
    }
    getOrder();
    handleOrderDetails();
    // Here you can handle saving the note to your state or backend
    console.log("Final Note:", finalNote);
    // Optionally reset the input visibility
    setVisibleInputId(null);
  };

  // New function to handle outside click
  const handleClickOutside = (event) => {
    if (noteInputRefs.current[id] && !noteInputRefs.current[id].contains(event.target)) {
      handleNoteKeyDown(id); // Submit the response
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // =============end note==========

  document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('#pills-tab button');

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
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
  const handleCredit = () => {
    if (orderData?.status == 'delivered' || orderData?.status == "cancelled") {
      navigate(`/home/client/crear/${id}`, { replace: true })
    } else {
      alert('No puedes crear un nuevo pedido si el pedido actual no ha sido entregado')
    }
  }

  const handlePayment = () => {

    console.log(orderDetails, orderData);

    const currentOrder = {
      orderType: orderData?.order_type,
      orderId: orderData?.id,
      name: orderData?.customer_name,
      order: "old"
    }
    let cartItems = [];
    orderDetails?.map((v) => {
      const obj = {
        orderId: orderData?.id,
        id: v.item_id,
        image: v.image,
        name: v.name,
        price: v.amount,
        // "code": "89874934",
        count: v.quantity,
        note: v.notes ? v.notes : "",
        isEditing: false,
        OdId: v.id
      }
      cartItems.push(obj)
    })
    localStorage.setItem("tableId", JSON.stringify(orderData?.table_id));
    localStorage.setItem("currentOrder", JSON.stringify(currentOrder));
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    navigate("/home/usa/bhomedelivery/datos");

  }
  // =============== End ============
  return (
    <div>
      <div className="m_bg_black">
        <Header />
        <div className="d-flex">
          <Sidenav />
          <div className=" flex-grow-1 sidebar overflow-hidden">
            <div className="p-3 m_bgblack text-white  ">
              <Link to="/home_Pedidos" className='d-flex text-decoration-none' >
                <div className='btn btn-outline-primary text-nowrap py-2 d-flex mt-2 ms-3' style={{ borderRadius: "10px" }}> <FaArrowLeft className='me-2 mt-1' />Regresar</div>
              </Link>

              <div className='d-flex justify-content-between align-items-center flex-wrap'>
                <div className='text-white ms-3 my-4' style={{ fontSize: "18px" }}>
                  {/* Pedido : {order} */}
                  Pedido : {id}
                </div>

                <div className='d-flex flex-wrap me-4'>
                  {showCancelOrderButton ? (
                    !(orderData?.status == 'delivered' || orderData?.status == 'finalized' || orderData?.status == "cancelled") &&
                    <div onClick={handleShow} className='btn btn-danger me-2  text-nowrap  me-2 py-2 d-flex align-items-center justify-content-center' style={{ backgroundColor: "#F05252", borderRadius: '10px' }}> <IoMdCloseCircle className='me-2' />Anular pedido</div>
                  ) : (
                    !(orderData?.status == "cancelled" || pamentDone) && <>
                      <Link className='text-decoration-none'
                        to={`/home_Pedidos/payment_edit/${id}`}
                      >
                        <div className='btn btn-primary me-2  text-nowrap  me-2 py-2 d-flex align-items-center justify-content-center' style={{ backgroundColor: "#147BDE", borderRadius: '10px' }}> <MdEditSquare className='me-2' />Editar Pedido</div>
                      </Link>
                      <div className='btn btn-outline-primary b_mar_lef ms-2 py-2 text-nowrap d-flex align-item-center justify-content-center' style={{ borderRadius: "10px" }} onClick={handleShow1Prod}> <FiPlus className='me-2 mt-1' />Agregar Producto</div>
                    </>
                  )}

                  {showCancelOrderButton &&
                    !creditNote &&
                    (<div onClick={handleCredit} className='btn bj-btn-outline-primary me-2  text-nowrap  me-2 py-2 d-flex align-items-center justify-content-center' style={{ borderRadius: '10px' }}> <BsCalculatorFill className='me-2' />Generar nota de crédito</div>)
                  }

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
                    <Modal.Title className="j-tbl-text-10">Anular pedido</Modal.Title>
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
                        placeholder={id}
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
                      {errorReason && <div className="text-danger errormessage">{errorReason}</div>}
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

              </div>
              {/* {showDeliveryButton && (
                <div className='b_borderrr pb-4'>
                  <div className='btn a_btn_lightgreen ms-3 a_mar_delivary py-2' style={{ borderRadius: "10px" }}><span className='text-success fw-bold'>Delivery</span></div>
                </div>
              )} */}
            </div>


            <Tabs
              activeKey={activeTab}
              onSelect={handleTabSelect}
              id="fill-tab-example"
              className="mb-3 m_tabs m_bgblack px-2 border-0 p-3  "
              fill>
              <Tab
                eventKey="home"
                title="Pedidos"
                className="m_in text-white aaaaa  rounded"
              >
                <div className='row'>
                  <div className='col-xl-7 ps-0 col-12 overflow-hidden '>
                    <div className='p-4 m_bgblack text-white mb-3'>
                      <p className='' style={{ fontSize: "18px", marginBottom: "36px" }}>Listado</p>
                      <div className='a_deli_infolist p-4'>
                        {
                          // product.map((item, index) => {
                          orderDetails?.map((v, index) => {
                            // console.log(item)
                            return (
                              <div>
                                <div className=' py-3 '>
                                  <div className='row'>
                                    <div className=' col-sm-8 '>
                                      <div className='d-flex '>
                                        <img src={`${API}/images/${v.image}`} alt='pic' className='ms-4' height={70} width={80} />
                                        <div className='ms-4 '>
                                          <div className='text-nowrap'>{v.name}</div>
                                          <div className='mt-3 a_mar_new '>{v.description}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-sm-2 a_text_price '>
                                      <div className='pe-3 '>{v.quantity}</div>
                                    </div>
                                    <div className='col-sm-2 a_text_price'>
                                      <div className='pe-5 fw-bold '>${v.amount}</div>
                                    </div>
                                  </div>
                                </div>
                                {/* <div style={{ marginBottom: "68px", cursor: "pointer" }}>
                                  {editingNote === index ? (
                                    <input
                                      type="text"
                                      className='ms-4 j-note-input'
                                      value={noteValue}
                                      onChange={(e) => handleNoteChange(index, `Nota: ${e.target.value}`)}
                                      onKeyDown={(e) => handleNoteKeyDown(index, e)}
                                    />
                                  ) : (
                                    <div className='a_home_addnote ms-4' onClick={() => handleEditNoteClick(index, item.note)}>
                                      {item.note}
                                    </div>
                                  )}
                                </div> */}
                                <div style={{ marginBottom: "68px", cursor: "pointer" }}>
                                  {v.notes === null ? (
                                    <div>
                                      {visibleInputId !== v.id ? (
                                        <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => toggleInput(v.id)}>
                                          <span className='j-nota-blue ms-4 text-decoration-underline'>+ Nota</span>
                                        </div>
                                      ) : (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <span className='j-nota-blue ms-4'>Nota:</span>
                                          <input
                                            type="text"
                                            className='j-note-input'
                                            ref={el => noteInputRefs.current[v.id] = el} // Assign ref to the input
                                            onChange={(e) => handleNoteChange(v.id, e.target.value)} // Handle change
                                            onBlur={() => handleNoteKeyDown(v.id)} // Handle blur
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                handleNoteKeyDown(v.id);
                                              }
                                            }}
                                            autoFocus
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div>
                                      {visibleInputId !== v.id ? (
                                        <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => toggleInput(v.id)}>
                                          <span className='j-nota-blue ms-4'>Nota: {v.notes}</span>
                                        </div>
                                      ) : (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <span className='j-nota-blue ms-4'>Nota:</span>
                                          <input
                                            type="text"
                                            className='j-note-input'
                                            ref={el => noteInputRefs.current[v.id] = el} // Assign ref to the input
                                            onChange={(e) => handleNoteChange(v.id, e.target.value)} // Handle change
                                            onBlur={() => handleNoteKeyDown(v.id)} // Handle blur
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                handleNoteKeyDown(v.id);
                                              }
                                            }}
                                            autoFocus
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {/* {editingNote === index ? (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <span className='j-nota-blue ms-4'>Nota:</span>
                                      <input
                                        type="text"
                                        className='j-note-input'
                                        value={noteValue}
                                        onChange={handleNoteChange}
                                        onKeyDown={(e) => handleNoteKeyDown(index, e)}
                                      />
                                    </div>
                                  ) : (
                                    <div className='a_home_addnote ms-4' onClick={() => handleEditNoteClick(index, v.note)}>
                                      {v.note}
                                    </div>
                                  )} */}
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-5 px-0 col-12 overflow-hidden '>
                    <div className='p-3 m_bgblack text-white '>
                      <h5 className='mt-3 ms-2'>Resumen</h5>
                      <div className='deli_infolist p-2'>
                        <div className='d-flex justify-content-end align-items-center ' >
                          <div className='d-flex justify-content-end align-items-center me-3 '>
                            <div className='me-2 fs-4'><FaCalendarAlt className='bj-icon-size-change' /></div>
                            <div className='pt-1 bj-delivery-text-3'>{new Date(orderData?.created_at).toLocaleDateString('en-GB')}</div>
                          </div>
                          <div className='d-flex justify-content-end align-items-center '>
                            <div className='me-2 fs-4 '><MdOutlineAccessTimeFilled /></div>
                            <div className='pt-2 a_time'>{new Date(orderData?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>
                        <div className='fw-bold fs-5'>
                          Datos
                        </div>

                        {/* <div className='btn a_btn_lightjamun my-3 bj-delivery-text-2 ' style={{ borderRadius: "10px" }}><span style={{ fontWeight: "600" }}>{orderData?.order_type}</span></div><br /> */}
                        <div className={`bj-delivery-text-2  b_btn1 mb-2 mt-3 p-0 text-nowrap d-flex  align-items-center justify-content-center 
                              ${pamentDone && orderData?.status.toLowerCase() === 'delivered' ? 'b_blue ' : orderData?.status.toLowerCase() === 'received' ? 'b_indigo' : orderData?.status.toLowerCase() === 'prepared' ? 'b_ora ' : orderData?.status.toLowerCase() === 'delivered' ? 'b_blue' : orderData?.status.toLowerCase() === 'finalized' ? 'b_green' : orderData?.status.toLowerCase() === 'withdraw' ? 'b_indigo' : orderData?.status.toLowerCase() === 'local' ? 'b_purple' : orderData?.status.toLowerCase() === 'cancelled' ? 'b_orange' : 'b_ora text-danger'}`}>
                          {pamentDone && orderData?.status.toLowerCase() === 'delivered' ? 'Pagado' : orderData?.status.toLowerCase() === 'received' ? 'Recibido' : orderData?.status.toLowerCase() === 'prepared' ? 'Preparado ' : orderData?.status.toLowerCase() === 'delivered' ? 'Entregado' : orderData?.status.toLowerCase() === 'finalized' ? 'Finalizado' : orderData?.status.toLowerCase() === 'withdraw' ? 'Retirar' : orderData?.status.toLowerCase() === 'local' ? 'Local' : orderData?.status.toLowerCase() === 'cancelled' ? 'Cancelar' : ' '}
                        </div>

                        <div style={{ fontWeight: "600", borderRadius: "10px" }} className={`bj-delivery-text-2  b_btn1 mb-3  p-0 text-nowrap d-flex  align-items-center justify-content-center 
                        ${orderData?.order_type.toLowerCase() === 'local' ? 'b_indigo' : orderData?.order_type.toLowerCase() === 'order now' ? 'b_ora ' : orderData?.order_type.toLowerCase() === 'delivery' ? 'b_blue' : orderData?.order_type.toLowerCase() === 'uber' ? 'b_ora text-danger' : orderData?.order_type.toLowerCase().includes("with") ? 'b_purple' : 'b_ora text-danger'}`}>
                          {orderData?.order_type.toLowerCase() === 'local' ? 'Local' : orderData?.order_type.toLowerCase().includes("with") ? 'Retiro ' : orderData?.order_type.toLowerCase() === 'delivery' ? 'Entrega' : orderData?.order_type.toLowerCase() === 'uber' ? 'Uber' : orderData?.order_type}
                        </div>

                        <div className='d-flex justify-content-end align-items-center mb-4 mt-3'>
                          <div className='w-50'>
                            <div className='mb-3'>Codigo pedido</div>
                            <div className='w-75 a_bg_order py-2 border-0' style={{ borderRadius: "10px" }}><span className='ps-1'>{id}</span></div>
                          </div>
                          <div className='w-50'>
                            <div className='mb-3'>Cantidad</div>
                            <div className='w-75 a_bg_order py-2 border-0 ' style={{ borderRadius: "10px" }}><span className='ps-1'>{orderDetails.length}</span></div>
                          </div>
                        </div>
                        <div className='p-4 a_deli_infolist  mt-3'>
                          <div className=' a_mar_summary fs-5 fw-bold'>Costo total</div>
                          <div className='d-flex justify-content-between align-items-center my-1 mb-2'>
                            <div>Productos</div>
                            <div>$ {orderDetails.reduce((acc, v) => v.amount * v.quantity + acc, 0)}</div>
                          </div>
                          <div className='d-flex justify-content-between align-items-center my-1'>
                            <div>Descuentos</div>
                            <div>$ {parseInt(orderData?.discount)}</div>
                          </div>
                          <hr></hr>
                          <div>
                            <div className='d-flex justify-content-between align-items-center my-1 fs-5 fw-bold'>
                              <div>Total</div>
                              <div>$ {orderDetails.reduce((acc, v) => v.amount * v.quantity + acc, 0) - parseInt(orderData?.discount)}</div>
                            </div>
                          </div>
                        </div>
                        {!orderData?.reason &&
                          <div className='mx-auto text-center mt-3'>
                            {!pamentDone || (orderData?.status.toLowerCase() !== 'finalized' && orderData?.status.toLowerCase() !== 'delivered') ?
                              <div className='btn text-white j-btn-primary w-100' style={{ padding: "8px 12px", borderRadius: "8px" }} onClick={handlePayment}>Pagar ahora</div> :
                              ""
                            }
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>

              </Tab>

              <Tab eventKey="profile" title="Información del cliente" className='b_border ' style={{ marginTop: "2px" }}>
                <div className='b-bg-color1'>
                  {orderData?.reason &&
                    <div className='text-white ms-4 pt-4' >
                      <h5 className='bj-delivery-text-15'>Nota anulación</h5>
                      <textarea type="text" className="form-control bg-gray border-0 mt-4 py-2" id="inputPassword2" placeholder={orderData?.reason != null ? orderData?.reason : "Estaba sin sal"} style={{ backgroundColor: '#242d38', borderRadius: "10px" }} disabled></textarea>
                    </div>
                  }
                  <div className='text-white ms-4 pt-4' >
                    <h5>Información pedido</h5>
                  </div>

                  <div className='d-flex  flex-grow-1 gap-5 mx-4 m b_inputt b_id_input b_home_field  pt-3 '>
                    <div className='w-100 b_search flex-grow-1  text-white mb-3'>
                      <label htmlFor="inputPassword2" className="mb-2" style={{ fontSize: "14px" }}>Sector</label>
                      <input type="text" className="form-control bg-gray border-0 mt-2 py-2" value={sector?.name} id="inputPassword2" placeholder="-" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} disabled />
                    </div>
                    <div className='w-100 flex-grow-1 b_search text-white mb-3'>
                      <label htmlFor="inputPassword2" className="mb-2">Mesa</label>
                      <input type="text" className="form-control bg-gray border-0 mt-2 py-2 " value={table?.name ? `${table.name} (${table.table_no})` : '-'} id="inputPassword2" placeholder="-" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} disabled />
                    </div>
                  </div>
                  <div className='d-flex  flex-grow-1 gap-5 mx-4 m b_inputt b_id_input b_home_field  pt-3 '>
                    <div className='w-100 b_search flex-grow-1  text-white mb-3'>
                      <label htmlFor="inputPassword2" className="mb-2" style={{ fontSize: "14px" }}>Cliente</label>
                      <input type="text" className="form-control bg-gray border-0 mt-2 py-2" value={orderData?.customer_name} id="inputPassword2" placeholder="-" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} disabled />
                    </div>
                    <div className='w-100 flex-grow-1 b_search text-white mb-3'>
                      <label htmlFor="inputPassword2" className="mb-2">Personas</label>
                      <input type="text" className="form-control bg-gray border-0 mt-2 py-2 " value={orderData?.person} id="inputPassword2" placeholder="-" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} disabled />
                    </div>
                  </div>

                  <div className='b_table1 mx-4 mt-2 w-100' >
                    <div className='text-white mt-4'>
                      <h5 style={{ fontSize: "16px" }}>Historial estados</h5>
                    </div>
                    <table className='b_table '>
                      <thead>
                        <tr className='b_thcolor'>
                          <th>Fecha</th>
                          <th>Hora </th>
                          <th>Usuario</th>
                          <th>Estado</th>

                        </tr>
                      </thead>
                      <tbody className='text-white b_btnn '>
                        {orderStatus.logs?.map((order) => (
                          <tr key={id} className='b_row'>
                            <td className=' mb-4'>{new Date(order?.created_at).toLocaleDateString()}</td>
                            <td className='text-nowrap'>{new Date(order?.created_at).toLocaleTimeString()}</td>
                            <td>{userRole}</td>
                            {/* <td style={{ fontWeight: "500", padding: "8px 12px" }} className={`bj-delivery-text-2 mt-3  mb-3 b_text_w b_btn1 d-flex align-items-center justify-content-center mt-0 ${order.state == 'Anulado' ? 'b_redd' : order.state === 'Recibido' ? 'b_bluee' : order.state === 'Preparado' ? 'b_orr' : order.state === 'Entregado' ? 'b_neww' : order.state === 'Finalized' ? 'b_gree' : order.state === 'Preparado' ? 'b_orr' : 'text-denger'}`}>{order.state}</td> */}
                            <td style={{ fontWeight: "500", padding: "8px 12px" }} className={`bj-delivery-text-2 mt-3  mb-3 b_text_w b_btn1 d-flex align-items-center justify-content-center mt-0 
                               ${order.status.toLowerCase() === 'received' ? 'b_indigo' : order.status.toLowerCase() === 'prepared' ? 'b_ora ' : order.status.toLowerCase() === 'delivered' ? 'b_blue' : order.status.toLowerCase() === 'finalized' ? 'b_green' : order.status.toLowerCase() === 'withdraw' ? 'b_indigo' : order.status.toLowerCase() === 'local' ? 'b_purple' : 'b_ora text-danger'}`}>
                              {order.status.toLowerCase() === 'received' ? 'Recibido' : order.status.toLowerCase() === 'prepared' ? 'Preparado ' : order.status.toLowerCase() === 'delivered' ? 'Entregado' : order.status.toLowerCase() === 'finalized' ? 'Finalizado' : order.status.toLowerCase() === 'withdraw' ? 'Retirar' : order.status.toLowerCase() === 'local' ? 'Local' : order.status.toLowerCase() === 'cancelled' ? 'Cancelar' : ' '}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>


        <Modal
          show={show1Prod}
          onHide={handleClose1Prod}
          backdrop={true}
          keyboard={false}
          className="m_modal m1 jm-modal_jjjj"
        >
          <Modal.Header
            closeButton
            className="m_borbot "
            style={{ backgroundColor: "#111928" }}
          >
            <Modal.Title className="m18">
              Agregar artículos
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            className="border-0 p-0 "
            style={{ backgroundColor: "#111928" }}
          >
            <div className="row ">
              <div
                className="col-sm-2 col-4    m-0 p-0  m_borrig "
                style={{ backgroundColor: "#111928" }}
              >
                <div>
                  <div className="ms-3 pe-3 mt-2">
                    <div className="m_borbot ">
                      <p className="text-white m14 my-2 mb-3">
                        Familias y subfamilias
                      </p>
                    </div>
                  </div>

                  <div className="py-3 m_borbot mx-3  m14 ">
                    {parentCheck?.map((parentItem) => (
                      <div key={parentItem.id}>
                        <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                          <div className="text-nowrap">
                            <label>
                              <input
                                type="checkbox"
                                checked={checkedParents[parentItem.id]}
                                onChange={() => handleParentChangeMenu(parentItem.id)}
                                className="me-2 custom-checkbox"
                              />
                              <span className="text-white">{parentItem.name}</span>
                            </label>
                          </div>
                        </div>
                        {checkedParents[parentItem.id] && (
                          <div style={{ marginLeft: "20px" }}>
                            {childCheck
                              .filter((childItem) => childItem.family_name === parentItem.name)
                              .map((childItem) => (
                                <div key={childItem.id}>
                                  <div className="d-flex align-content-center justify-content-between my-2 m14">
                                    <div>
                                      <label className="text-white ">
                                        <input
                                          type="checkbox"
                                          checked={checkedChildren[childItem.id]}
                                          className="mx-2"
                                          onChange={() => handleChildChangeMenu(childItem.id, parentItem.name)}
                                        />
                                        {childItem.name}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-sm-10 col-8 m-0 p-0">
                <div className="p-3   text-white  flex-wrap">
                  <div className="mb-3">
                    <h6>Bebidas</h6>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <div className="">
                          <div className="m_group">
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="m_icon"
                            >
                              <g>
                                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
                              </g>
                            </svg>
                            <input
                              className="m_input ps-5"
                              type="search"
                              placeholder="Buscar"
                              value={searchTermMenu}
                              onChange={handleSearchMenu}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button
                          className="mgreenbtn pt-2  m14 border-0 text-nowrap"
                          onClick={() => {
                            // handleClose1Prod();
                            handleAddMenu();
                          }}
                        >
                          Añadir nuevos
                          <Badge
                            bg="light"
                            className="ms-2 text-success rounded-circle m12"
                          >
                            {selectedItemsCount}
                          </Badge>
                          <span className="visually-hidden">
                            unread messages
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row p-2">
                  {filteredItemsMenu.map((ele, index) => {
                    const isAdded = selectedItemsMenu.length > 0 ? selectedItemsMenu.some((v) => v.item_id == ele.id) : false;
                    return (
                      <div
                        className="col-md-4 col-xl-3 col-sm-6 col-12 g-3"
                        keys={index}
                      >
                        <div>
                          <div className="card m_bgblack text-white position-relative">
                            {ele.image ? (
                              <img
                                src={`${API}/images/${ele.image}`}
                                className="card-img-top object-fit-cover rounded"
                                alt={ele.name}
                                style={{ height: "162px", objectFit: "cover" }}
                              />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center rounded" style={{ height: "200px", backgroundColor: 'rgb(55 65 81 / 34%)', color: 'white' }}>
                                <p>{ele.name}</p>
                              </div>
                            )}
                            <div className="card-body">
                              <h6 className="card-title">{ele.name}</h6>
                              <h6 className="card-title">${ele.sale_price}</h6>
                              <p className="card-text opacity-50">
                                Codigo: {ele.code}
                              </p>
                              <div className="btn w-100 btn-primary text-white"
                                style={{ backgroundColor: isAdded ? "#063f93" : "#0d6efd" }}
                                onClick={() => handleAddItem(ele)}>
                                <a
                                  href="# "
                                  className="text-white text-decoration-none"
                                  style={{ fontSize: "14px" }}
                                >
                                  <span className="ms-1">
                                    {isAdded ? 'Agregado' : 'Agregar al menú'}
                                  </span>
                                </a>
                              </div>
                            </div>

                            <div
                              className="position-absolute "
                              style={{ cursor: "pointer" }}
                            >
                              <Link
                                to={`/articles/singleatricleproduct/${ele.id}`}
                                state={{ from: location.pathname }}
                                className="text-white text-decoration-none"
                              >
                                <p
                                  className=" px-1  rounded m-2"
                                  style={{ backgroundColor: "#374151" }}
                                >
                                  <IoMdInformationCircle />{" "}
                                  <span style={{ fontSize: "12px" }}>
                                    Ver información
                                  </span>
                                </p>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Modal.Body>

        </Modal>

        {/* add production success */}
        <Modal
          show={show1AddSuc}
          onHide={handleClose1AddSuc}
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
              <p className="mb-0 mt-2 h6">Nuevos platillos</p>
              <p className="opacity-75">
                Han sido agregados exitosamente
              </p>
            </div>
          </Modal.Body>
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
      </div>
    </div >
  );
}
