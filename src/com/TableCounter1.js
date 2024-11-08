import React, { useEffect, useRef, useState } from "react";
import Sidenav from "./Sidenav";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCircleCheck, FaMinus, FaPlus, FaXmark } from "react-icons/fa6";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import img1 from "../Image/cheese-soup.png";
import img2 from "../Image/crispy-fry-chicken.png";
import img3 from "../Image/Strawberry-gelatin.png";
import OrderCart from "./OrderCart";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdOutlineAccessTimeFilled, MdRoomService } from "react-icons/md";
import Header from "./Header";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

const TableCounter1 = () => {
  const apiUrl = process.env.REACT_APP_API_URL; // Laravel API URL
  const API = process.env.REACT_APP_IMAGE_URL;

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [ isLoading, setIsLoading ] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [ tId, setTId ] = useState(id);
  const [ parentCheck, setParentCheck ] = useState([]);
  const [ isEditing, setIsEditing ] = useState([]);

  const [ childCheck, setChildCheck ] = useState([]);
  const [ obj1, setObj1 ] = useState([]);
  const [ searchQuery, setSearchQuery ] = useState("");
  const [ date, setDate ] = useState("00 min 00 sg");
  const [ customerNameError, setCustomerNameError ] = useState("");
  const [ personError, setPersonError ] = useState("");
  const [ cartError, setCartError ] = useState("");
  const [ itemToDelete, setItemToDelete ] = useState(null);

  /*   const [ selectedCategory, setSelectedCategory ] = useState(categories[0]); */
  const [ selectedSubCategory, setSelectedSubCategory ] = useState(null);

  const [ selectedCategory, setSelectedCategory ] = useState("Drinks");
  const [ currentSubfamilies, setCurrentSubfamilies ] = useState([]);
  const [ customerName, setCustomerName ] = useState("");
  const [ person, setPerson ] = useState("");
  const [ showEditFamDel, setShowEditFamDel ] = useState(false);
  const handleCloseEditFamDel = () => setShowEditFamDel(false);
  const handleShowEditFamDel = () => setShowEditFamDel(true);

  const [ showEditFam, setShowEditFam ] = useState(false);
  const handleCloseEditFam = () => setShowEditFam(false);
  const handleShowEditFam = () => setShowEditFam(true);

const [tableData,setTableData] = useState([]);

      /* get table data */

  const getTableData = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/table/getStats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data) {
        setTableData(response.data);
        // setTableData(response.data);
        console.log("table Data", response.data);
      } else {
        console.error("Response data is not an array:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching sectors:",
        error.response ? error.response.data : error.message
      );
    }
  };
console.log(tId)
  useEffect(()=>{
    if(id)
        getTableData(id);
  },[id])


  const renderItems = () => {
    let itemsToRender = obj1;

    // Filter by search query

    if (searchQuery) {
      const searchTerms = searchQuery
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 0);
      itemsToRender = itemsToRender.filter((item) =>
        searchTerms.every((term) => item.name.toLowerCase().includes(term))
      );
    }

    // Filter by category and subcategory
    if (selectedCategory && selectedCategory.id !== "todo") {
      if (selectedSubCategory) {
        itemsToRender = itemsToRender.filter(
          (item) =>
            item.family_id === selectedCategory.id &&
            item.sub_family_id === selectedSubCategory.id
        );
      } else {
        itemsToRender = itemsToRender.filter(
          (item) => item.family_id === selectedCategory.id
        );
      }
    }

    return itemsToRender.map((e, index) => (
      <div className="col-4 g-3 mb-3" key={index}>
        <OrderCart
          id={e.id}
          image={e.image}
          name={e.name}
          price={e.sale_price}
          code={e.code}
          addItemToCart={addItemToCart}
        />
      </div>
    ));
  };

  const handleFamilyClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    if (category.id === "todo") {
      setCurrentSubfamilies([]);
    } else {
      const relatedSubfamilies = childCheck.filter(
        (subfamily) => subfamily.family_name === category.name
      );
      setCurrentSubfamilies(relatedSubfamilies);
    }
  };
  const [ cartItems, setCartItems ] = useState([]);
  const [ countsoup, setCountsoup ] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
      setCountsoup(JSON.parse(savedCart).map((item) => item.count));
    }
  }, []);

  useEffect(
    () => {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    },
    [ cartItems ]
  );
  const [ showAllItems, setShowAllItems ] = useState(false);
  const toggleShowAllItems = () => {
    setShowAllItems(!showAllItems);
  };
  const addItemToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      // Item already exists in cart, increment its count
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
      // Item doesn't exist in cart, add it with count 1
      const newItem = { ...item, count: 1 };
      setCartItems([ ...cartItems, newItem ]);
      setCountsoup([ ...countsoup, 1 ]);
      localStorage.setItem(
        "cartItems",
        JSON.stringify([ ...cartItems, newItem ])
      );
    }
  };
  const removeItemFromCart = (itemId) => {
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

    // Update countsoup accordingly
    const updatedCountsoup = updatedCartItems.map((item) => item.count);
    setCountsoup(updatedCountsoup);
  };
  const removeAllItemFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const getTotalCost = () => {
    return cartItems.reduce(
      (total, item, index) => total + parseInt(item.price) * countsoup[index],
      0
    );
  };

  const totalCost = getTotalCost();
  const discount = 1.0;
  const finalTotal = totalCost - discount;

  /* api */

  useEffect(
    () => {
      setIsLoading(true);
      if (token) {
        fetchFamilyData();
        fetchSubFamilyData();
        fetchAllItems();
        setIsLoading(false);
      }

      // Set initial subcategories for "Drinks"
      const relatedSubfamilies = childCheck.filter(
        (subfamily) => subfamily.family_name === "Drinks"
      );
      setCurrentSubfamilies(relatedSubfamilies);
    },
    [ apiUrl ]
  );

  // get family

  const fetchFamilyData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/family/getFamily`);
      const todoCategory = { id: "todo", name: "Todo" };
      setParentCheck([ todoCategory, ...response.data ]);
      setSelectedCategory(todoCategory);
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // get subfamily
  const fetchSubFamilyData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/subfamily/getSubFamily`);
      setChildCheck(response.data);

      // Set initial subcategories for "Drinks"
      const relatedSubfamilies = response.data.filter(
        (subfamily) => subfamily.family_name === "Drinks"
      );
      setCurrentSubfamilies(relatedSubfamilies);
    } catch (error) {
      console.error(
        "Error fetching subfamilies:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // get product
  const fetchAllItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/item/getAll`);
      setObj1(response.data.items);
    } catch (error) {
      console.error(
        "Error fetching items:",
        error.response ? error.response.data : error.message
      );
    }
  };
  /*   const [ currentSubfamilies, setCurrentSubfamilies ] = useState([]); */

  const [ checkedParents, setCheckedParents ] = useState(
    parentCheck.reduce((acc, family) => ({ ...acc, [family.id]: true }), {})
  );
  const handleParentChange = (parentId) => {
    setCheckedParents((prevState) => ({
      ...prevState,
      [parentId]: !prevState[parentId]
    }));
  };

  const handleSubFamilyClick = (subcategory) => {
    setSelectedSubCategory(subcategory);
  };

//   place order

  const handleCreateOrder = async () => {
    // Reset error states
    setCustomerNameError("");
    setPersonError("");
    setCartError("");

    // Validate fields
    let isValid = true;

    if (!customerName.trim()) {
      setCustomerNameError("Por favor, ingrese quién registra");
      isValid = false;
    }

    if (!person.trim()) {
      setPersonError("Por favor ingrese el  persona");
      isValid = false;
    } else if (isNaN(person) || parseInt(person) <= 0) {
      setPersonError("Por favor, ingrese un número válido de personas");
      isValid = false;
    }

    if (cartItems.length === 0) {
      setCartError(
        "El carrito está vacío. Agregue productos antes de continuar."
      );
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    const orderDetails = cartItems.map((item) => ({
      item_id: item.id,
      quantity: item.count,
      notes: item.note ? item.note.replace(/^Nota:\s*/i, "").trim() : ""
    }));

    const orderData = {
      order_details: orderDetails,
      order_master: {
        order_type: "local",
        payment_type: "debit",
        status: "received",
        discount: discount, // Use the discount value from your state
        table_id: parseInt(tId),
        user_id: userId, // You might want to dynamically set this
        delivery_cost: 0, // You might want to dynamically set this
        customer_name: customerName,
        person: person,
        reason: ""
      }
    };

    try {
        const response = await axios.post(
            `${apiUrl}/order/place_new`,
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          console.log("Order created successfully:", response.data);
          console.log(tId)
          // Call the table/updateStatus API
          await axios.post(
            `${apiUrl}/table/updateStatus`,
            {
              table_id: parseInt(tId),
              status: "busy" // Set the status you need
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          console.log("Table status updated successfully");
      
          // Clear cart items from local storage
          localStorage.removeItem("cartItems");
          
          // Clear cart items from state
          setCartItems([]);
          setCountsoup([]);
      navigate('/table')

      // Handle successful order creation (e.g., show success message, redirect, etc.)
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };
  // category drag

  const scrollRef = useRef(null);
  const [ isDragging, setIsDragging ] = useState(false);
  const [ startX, setStartX ] = useState(0);
  const [ scrollLeft, setScrollLeft ] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const handleWheel = (e) => {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      };
      scrollContainer.addEventListener("wheel", handleWheel, {
        passive: false
      });
      return () => {
        if (scrollContainer) {
          scrollContainer.removeEventListener("wheel", handleWheel);
        }
      };
    }
    return () => {}; // Return an empty cleanup function if scrollContainer is null
  }, []);

  //   add note
  const handleNoteChange = (index, newNote) => {
    const updatedCartItems = cartItems.map(
      (item, i) => (i === index ? { ...item, note: newNote } : item)
    );
    setCartItems(updatedCartItems);
  };
  const handleFinishEditing = (index) => {
    const updatedCartItems = cartItems.map(
      (item, i) => (i === index ? { ...item, isEditing: false } : item)
    );
    setCartItems(updatedCartItems);
  };
  const handleAddNoteClick = (index) => {
    const updatedCartItems = cartItems.map(
      (item, i) =>
        i === index
          ? { ...item, isEditing: true, note: item.note || "Nota: " }
          : item
    );
    setCartItems(updatedCartItems);
  };
  const handleDeleteConfirmation = (id) => {
    removeAllItemFromCart(id);
    handleCloseEditFam();
    handleShowEditFamDel();

    setTimeout(() => {
      setShowEditFamDel(false);
    }, 2000);
  };
  return (
    <section>
      <Header />
      <div>
        <section className="j-counter">
          <div className="j-sidebar-nav j-bg-color">
            <Sidenav />
          </div>
          <div className="j-counter-menu sidebar">
            <div className="j-counter-header">
              <h2 className="text-white mb-3 j-counter-text-1">Mostrador</h2>
              <div className="j-menu-bg-color ">
                <div className="j-tracker-mar d-flex justify-content-between ">
                  <div className="line1  flex-grow-1">
                    <Link className="text-decoration-none px-2 j-counter-path-color">
                      <FaCircleCheck className="j-counter-icon-size" />
                      <span className="j-counter-text-2">Productos</span>
                    </Link>
                  </div>
                  <div className="  flex-grow-1 text-center">
                    <Link
                      to={`/table/datos?id=${tId}`}
                      className="text-decoration-none px-2 sj_text_dark"
                    >
                      <FaCircleCheck className="j-counter-icon-size" />
                      <span className="j-counter-text-2">Datos</span>
                    </Link>
                  </div>
                  <div className="line2  flex-grow-1 text-end">
                    <Link className="text-decoration-none px-2 sj_text_dark">
                      <FaCircleCheck className="j-counter-icon-size" />
                      <span className="j-counter-text-2">Pago</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="j-counter-head">
              <div className="j-search-input">
                <FaSearch className="j-table-icon-size" />
                <input
                  type="email"
                  className="form-control j-table_input"
                  id="email"
                  placeholder="Buscar "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="j-show-items">
                <ul
                  className="nav j-nav-scroll"
                  ref={scrollRef}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  style={{
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    cursor: isDragging ? "grabbing" : "grab",
                    userSelect: "none",
                    height: "54px",
                    flexWrap: "nowrap"
                  }}
                >
                  {parentCheck.map((category, index) => (
                    <li
                      className={`nav-item ${selectedCategory === category
                        ? "active"
                        : ""}`}
                      key={category.id}
                      onClick={() => handleFamilyClick(category)}
                    >
                      <a className="nav-link sjfs-12" aria-current="page">
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="j-show-items">
                <ul className="nav j-nav-scroll">
                  {currentSubfamilies.map((subcategory, index) => (
                    <li
                      className={`nav-item ${selectedSubCategory === subcategory
                        ? "active"
                        : ""}`}
                      key={subcategory.id}
                      onClick={() => handleSubFamilyClick(subcategory)}
                    >
                      <a className="nav-link sjfs-12" aria-current="page">
                        {subcategory.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="j-counter-body">
              <div className="j-card-item-1 j-border-bottom">
                <h2 className="text-white j-tbl-text-17 ">
                  {selectedCategory.name}
                </h2>
                <div className="j-counter-card">
                  <div className="row">
                    {renderItems().length > 0 ? (
                      renderItems()
                    ) : (
                      <p className="text-white">No se encontraron artículos.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="j-counter-price position-sticky"
            style={{ top: "77px" }}
          >
            <div className="j_position_fixed j_b_hd_width">
              <div className="b-summary-center mb-4 align-items-center text-white d-flex justify-content-between">
                <h2 className="mb-0 j-tbl-font-5">Resumen</h2>
                <FaXmark className="b-icon x-icon-size" />
              </div>

              <div className="j-counter-price-data mt-4">
                <h3 className="text-white j-tbl-text-13 mb-3">Datos</h3>
                {cartItems.length === 0 ? (
                  <div>
                    <h4 className="j-table-co4 j-tbl-text-13">Mesa {tId}</h4>
                    <div className="d-flex align-items-center justify-content-between my-3">
                      <div className="j-busy-table d-flex align-items-center">
                        <div className="j-a-table" />
                        <p className="j-table-color j-tbl-btn-font-1">
                          Disponible
                        </p>
                      </div>

                      <div className="b-date-time d-flex align-items-center">
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
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <p className="mb-0 ms-2 me-3 text-white j-tbl-btn-font-1">
                          00 min 00 sg
                        </p>
                      </div>
                    </div>
                    <div className="j-orders-inputs">
                      <div className="j-orders-code">
                        <label className="j-label-name text-white j-tbl-btn-font-1 mb-2">
                          Quién registra
                        </label>
                        <input
                          className="j-input-name"
                          type="text"
                          placeholder="Lucia Lopez"
                        />
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
                          />
                        </div>
                      </div>
                    </div>
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
                    <h4 className="j-table-co4 j-tbl-text-13">Mesa 2</h4>
                    <div className="d-flex align-items-center justify-content-between my-3">
                      <div className="j-busy-table d-flex align-items-center">
                        <div className="j-a-table" />
                        <p className="j-table-color j-tbl-btn-font-1">
                          Disponible
                        </p>
                      </div>

                      <div className="b-date-time d-flex align-items-center">
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
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <p className="mb-0 ms-2 me-3 text-white j-tbl-btn-font-1">
                          {date}
                        </p>
                      </div>
                    </div>
                    <div className="j-orders-inputs">
                      <div className="j-orders-code">
                        <label className="j-label-name text-white mb-2 j-tbl-btn-font-1">
                          Quién registra
                        </label>
                        <input
                          className="j-input-name"
                          type="text"
                          placeholder="Lucia Lopez"
                          value={customerName}
                          onChange={(e) => {
                            setCustomerName(e.target.value);
                            setCustomerNameError("");
                          }}
                        />
                        {customerNameError && (
                          <div className="text-danger errormessage">
                            {customerNameError}
                          </div>
                        )}
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
                            value={person}
                            onChange={(e) => {
                              setPerson(e.target.value);
                              setPersonError("");
                            }}
                          />
                          {personError && (
                            <div className="text-danger errormessage">
                              {personError}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="j-counter-order">
                      <h3 className="text-white j-tbl-pop-1">Pedido </h3>
                      <div className="j-counter-order-data j_counter_order_width">
                        {cartItems
                          .slice(0, showAllItems ? cartItems.length : 3)
                          .map((item, index) => (
                            <div
                              className="j-counter-order-border-fast j_border_width"
                              key={item.id}
                            >
                              <div className="j-counter-order-img j_counter_order_final">
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
                                  <div className="j-counter-mix">
                                    <button
                                      className="j-minus-count"
                                      onClick={() =>
                                        removeItemFromCart(item.id)}
                                    >
                                      <FaMinus />
                                    </button>
                                    <h3> {item.count}</h3>
                                    <button
                                      className="j-plus-count"
                                      onClick={() => addItemToCart(item)}
                                    >
                                      <FaPlus />
                                    </button>
                                  </div>
                                  <h4 className="text-white fw-semibold d-flex">
                                    ${parseInt(item.price) * item.count}
                                  </h4>
                                  <button
                                    className="j-delete-btn me-2"
                                    onClick={() => {
                                      setItemToDelete(item.id);
                                      handleShowEditFam();
                                    }}
                                  >
                                    <RiDeleteBin6Fill />
                                  </button>
                                </div>
                              </div>
                              <div className="text-white j-order-count-why">
                                {item.isEditing ? (
                                  <div>
                                    <input
                                      className="j-note-input"
                                      type="text"
                                      value={item.note}
                                      onChange={(e) =>
                                        handleNoteChange(index, e.target.value)}
                                      onBlur={() => handleFinishEditing(index)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                          handleFinishEditing(index);
                                      }}
                                      autoFocus
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    {item.note ? (
                                      <p className="j-nota-blue">{item.note}</p>
                                    ) : (
                                      <button
                                        className="j-note-final-button"
                                        onClick={() =>
                                          handleAddNoteClick(index)}
                                      >
                                        + Agregar nota
                                      </button>
                                    )}
                                  </div>
                                )}
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
                      {cartError && (
                        <div className="text-danger errormessage">
                          {cartError}
                        </div>
                      )}
                      <div className="j-counter-total">
                        <h5 className="text-white j-tbl-text-15">
                          Costo total
                        </h5>
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
                              ${discount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="j-total-discount my-2 d-flex justify-content-between">
                          <p className="text-white bj-delivery-text-153 ">
                            Total
                          </p>
                          <span className="text-white bj-delivery-text-153 ">
                            ${finalTotal.toFixed(2)}
                          </span>
                        </div>
                        <Link
                          to={""}
                          className="btn w-100 j-btn-primary text-white m-articles-text-2"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCreateOrder();
                          }}
                        >
                          Enviar a Cocina
                        </Link>
                      </div>
                    </div>
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
                        className="j-trash-img-late"
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
                        setItemToDelete(null);
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
        </section>
      </div>
    </section>
  );
};

export default TableCounter1;
