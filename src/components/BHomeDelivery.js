import React, { useEffect, useRef, useState } from "react";
import { FaCircleCheck, FaMinus, FaPlus, FaXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Sidenav from "./Sidenav";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import img1 from "../Image/cheese-soup.png";
import img2 from "../Image/crispy-fry-chicken.png";
import img3 from "../Image/Strawberry-gelatin.png";
import OrderCart from "./OrderCart";
import { MdOutlineAccessTimeFilled, MdRoomService } from "react-icons/md";
import Header from "./Header";
import axios from "axios";
import { Button, Modal, Spinner } from "react-bootstrap";
import { RiDeleteBin6Fill } from "react-icons/ri";

const BHomeDelivery = () => {


  const apiUrl = process.env.REACT_APP_API_URL;
  const API = process.env.REACT_APP_IMAGE_URL;
  const [token, setToken] = useState(localStorage.getItem("token"));
  // const [ tId, setTId ] = useState(queryValue);
  const navigate = useNavigate();
  const admin_id = localStorage.getItem("admin_id");

  const [parentCheck, setParentCheck] = useState([]);
  const [childCheck, setChildCheck] = useState([]);
  const [obj1, setObj1] = useState([]);
  const [orderTypeError, setOrderTypeError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentSubfamilies, setCurrentSubfamilies] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [countsoup, setCountsoup] = useState([]);
  const [lastOrder, setLastOrder] = useState([]);
  const [isEditing, setIsEditing] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [orderType, setOrderType] = useState("delivery");
  const [orType, setOrType] = useState([]);
  const [cname, setCName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [orderTypeA, setOrderTypeA] = useState()
  useEffect(() => {

    const fetchData = async () => {
  
      try {
        await fetchFamilyData();
        await fetchAllItems();
        await fetchSubFamilyData();
        await fetchLastOrder();

        if (parentCheck.length > 0) {
          const todoCategory = { id: "todo", name: "Todo" };
          setParentCheck((prevCategories) => [
            todoCategory,
            ...prevCategories
          ]);

          setSelectedCategory(todoCategory);
          setCurrentSubfamilies([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [userId, setUserId] = useState('')

  useEffect(() => {
    // Retrieve the username from localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      setUserId(userId);
    }
  }, []);

  // Initialize isEditing after cartItems has been set
  useEffect(
    () => {
      setIsEditing(Array(cartItems.length).fill(false));
    },
    [cartItems]
  );

  const [showAllItems, setShowAllItems] = useState(false);
  const toggleShowAllItems = () => {
    setShowAllItems(!showAllItems);
  };

  const calculateDiscount = () => {
    return cartItems.length > 0 ? 1.0 : 0;
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

  // const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  // const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const handleNoteChange = (index, newNote) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], note: newNote }; // Update the note
      return updatedItems;
  });
  };
  const handleFinishEditing = (index) => {
    const updatedCartItems = cartItems.map(
      (item, i) => (i === index ? { ...item, isEditing: false } : item)
    );
    setCartItems(updatedCartItems);
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Enter") {
      const updatedIsEditing = [...isEditing];
      updatedIsEditing[index] = false;
      setIsEditing(updatedIsEditing);
    }
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
  const handleDeleteConfirmation = (index) => {
    removeItemFromCart(index);
    handleCloseEditFam();
    handleShowEditFamDel();

    setTimeout(() => {
      setShowEditFamDel(false);
    }, 2000);
  };

  const increment = (index) => {
    setCountsoup((prevCounts) =>
      prevCounts.map((count, i) => (i === index ? count + 1 : count))
    );
  };

  const decrement = (index) => {
    setCountsoup((prevCounts) =>
      prevCounts.map(
        (count, i) => (i === index ? (count > 1 ? count - 1 : 1) : count)
      )
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
  // category drag

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
    return () => { }; // Return an empty cleanup function if scrollContainer is null
  }, []);

  // api

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
      <div className="col-4 g-3 mb-3" key={e.id}>
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
      const currentOrder = JSON.parse(localStorage.getItem("currentOrder"));
      setOrType(currentOrder);
      setCName(currentOrder?.name);
    },
    [cartItems]
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

  const handleSubFamilyClick = (subcategory) => {
    setSelectedSubCategory(subcategory);
  };

  // get family
  const fetchFamilyData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/family/getFamily`,{headers: {
        Authorization: `Bearer ${token}`
      }});
      const todoCategory = { id: "todo", name: "Todo" };
      setParentCheck([todoCategory, ...response.data]);
      setSelectedCategory(todoCategory); // Set "Todo" as initial category
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error.response ? error.response.data : error.message
      );
    }
  };
  // get product
  const fetchAllItems = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${apiUrl}/item/getAll`,{headers: {
        Authorization: `Bearer ${token}`
      }});
      setObj1(response.data.items);
    } catch (error) {
      console.error(
        "Error fetching items:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
  };

  // get subfamily
  const fetchSubFamilyData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/subfamily/getSubFamily`,{headers: {
        Authorization: `Bearer ${token}`
      }});
      setChildCheck(response.data);
    } catch (error) {
      console.error(
        "Error fetching subfamilies:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // get last order of order master

  const fetchLastOrder = async () => {
    try {
      const response = await axios.post(`${apiUrl}/orders/last`,{admin_id: admin_id}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLastOrder(response.data.order.id + 1);
    } catch (error) {
      console.error(
        "Error fetching subfamilies:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // place new order

  const placeNewOrder = async () => {
    console.log(orderType, cname);

    if (!orderType || !cname) {
      console.log("Dgd");

      setOrderTypeError("Por favor ingrese su nombre");
      // setOrderTypeError("Por favor seleccione un tipo de pedido");
      return;
    }

    setOrderTypeError("");
    try {
      saveOrderToLocalStorage();
      const orderData = {
        order_master: {
          order_type: orderType,
          payment_type: "debit",
          status: "finalized",
          discount: calculateDiscount(),
          user_id: 25,
          delivery_cost: 0,
          customer_name: cname
        },
        order_details: cartItems.map((item) => ({
          item_id: item.id,
          quantity: item.count,
          notes: item.note ? item.note.replace(/^Nota:\s*/i, "").trim() : ""
        }))
      };

      navigate("/home/usa/bhomedelivery/datos", { state: { lastOrder } });

      // Handle successful order placement (e.g., clear cart, show confirmation)
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response ? error.response.data : error.message
      );
      // Handle error (e.g., show error message to user)
    }
  };
  // store other information
  const saveOrderToLocalStorage = () => {
    const orderInfo = {
      orderType: orderType,
      orderId: lastOrder,
      name: cname
    };
    localStorage.setItem("currentOrder", JSON.stringify(orderInfo));
  };



  const [categories, setCategories] = useState([
    "Todo",
    "Bebidas",
    "Snacks",
    "Postres",
    "Almuerzos",
    "Desayunos",
    "Cenas",
    "Gelatinas",
    "Pasteles",
    "Frutas con crema",
  ]);

  const [subcategories, setSubCategories] = useState({
    "Bebidas": ["Soda", "Juice", "Water"],
    "Snacks": ["Chips", "Nuts", "Popcorn"],
    "Postres": ["Soda", "Juice", "Water"],
    "Almuerzos": ["Chips", "Nuts", "Popcorn"],
    "Desayunos": ["Soda", "Juice", "Water"],
    "Cenas": ["Chips", "Nuts", "Popcorn"],
    "Gelatinas": ["Soda", "Juice", "Water"],
    "Pasteles": ["Chips", "Nuts", "Popcorn"],
    "Frutas con crema": ["Soda", "Juice", "Water"],

  });

  // const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  // const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // const renderItems = () => {
  //   let itemsToRender;
  //   if (selectedCategory === "Todo") {
  //     itemsToRender = [...item1, ...item2];
  //   } else if (selectedCategory === "Bebidas") {
  //     itemsToRender = item1;
  //   } else if (selectedCategory === "Snacks") {
  //     itemsToRender = item2;
  //   } else if (selectedCategory === "Postres") {
  //     itemsToRender = item1;
  //   } else if (selectedCategory === "Almuerzos") {
  //     itemsToRender = item2;
  //   } else if (selectedCategory === "Desayunos") {
  //     itemsToRender = item2;
  //   } else if (selectedCategory === "Cenas") {
  //     itemsToRender = item1;
  //   } else if (selectedCategory === "Gelatinas") {
  //     itemsToRender = item2;
  //   } else if (selectedCategory === "Pasteles") {
  //     itemsToRender = item1;
  //   } else if (selectedCategory.startsWith("Frutas con crema")) {
  //     itemsToRender = item2;
  //   } else {
  //     itemsToRender = [];
  //   }

  //   if (selectedSubCategory) {
  //     itemsToRender = itemsToRender.filter(item => item.subcategory === selectedSubCategory);
  //   }

  //   return itemsToRender.map((e, index) => (
  //     <div className="col-4 g-3 mb-3" key={index}>
  //       <OrderCart
  //         image={e.image}
  //         name={e.name}
  //         price={e.price}
  //         code={e.code}
  //         addItemToCart={addItemToCart}
  //       />
  //     </div>
  //   ));
  // };
  // const [cartItems, setCartItems] = useState([]);



  const item1 = [
    {
      image: img1,
      name: "Sopa de queso",
      price: "2.00",
      code: "01234",
      note: 'Nota: Al clima',
      subcategory: "Soda"
    },
    {
      image: img1,
      name: "Sopa de queso",
      price: "2.00",
      code: "01234",
      note: 'Nota: Al clima',
      subcategory: "Juice"
    },
    {
      image: img1,
      name: "Sopa de queso",
      price: "2.00",
      code: "01234",
      note: 'Nota: Al clima',
      subcategory: "Water"
    }
  ];

  const item2 = [
    {
      image: img2,
      name: "Pollo frito crujiente",
      price: "2.00",
      code: "01234",
      note: '+ Agregar nota',
      subcategory: "Chips"
    },
    {
      image: img2,
      name: "Pollo frito crujiente",
      price: "2.00",
      code: "01234",
      note: '+ Agregar nota',
      subcategory: "Chips"
    },
    {
      image: img2,
      name: "Pollo frito crujiente",
      price: "2.00",
      code: "01234",
      note: '+ Agregar nota',
      subcategory: "Nuts"
    },
    {
      image: img3,
      name: "Gelatina fresa",
      price: "2.00",
      code: "01234",
      note: 'Con fresas',
      subcategory: "Nuts"
    },
    {
      image: img3,
      name: "Gelatina fresa",
      price: "2.00",
      code: "01234",
      note: 'Con fresas',
      subcategory: "Popcorn"
    },
    {
      image: img3,
      name: "Gelatina fresa",
      price: "2.00",
      code: "01234",
      note: 'Con fresas',
      subcategory: "Popcorn"
    },
    {
      image: img3,
      name: "Gelatina fresa",
      price: "2.00",
      code: "01234",
      note: 'Con fresas',
      subcategory: "chip"
    },
    {
      image: img3,
      name: "Gelatina fresa",
      price: "2.00",
      code: "01234",
      note: 'Con fresas',
      subcategory: "Nuts"
    },
    {
      image: img3,
      name: "Gelatina fresa",
      price: "2.00",
      code: "01234",
      note: 'Con fresas',
      subcategory: "Popcorn"
    },
  ];

  const handlename = (e) => {
    const value = e.target.value
    setCName(value)
    if (value) {
      setOrderTypeError("")
    }
  }

  // console.log(cname);


  // const addItemToCart = (item) => {
  //   setCartItems([...cartItems, item]);
  // };
  return (
    <div>
      <Header />
      <section className="j-counter">
        <div className="j-sidebar-nav j-bg-color">
          <Sidenav />
        </div>
        <div className="j-counter-menu sidebar">
          <div className="j-counter-header j_counter_header_last_change">
            <h2 className="text-white mb-3 sjfs-18">Mostrador</h2>
            <div className="j-menu-bg-color ">
              <div className="j-tracker-mar d-flex justify-content-between ">
                <div className="line1  flex-grow-1">
                  <Link className="text-decoration-none px-2 ">
                    <FaCircleCheck className="mx-1" />
                    <span>Productos</span>
                  </Link>
                </div>
                <div className="  flex-grow-1 text-center" onClick={placeNewOrder}>
                  <Link
                    // to={"/home/usa/bhomedelivery/datos"}
                    className="text-decoration-none px-2 sj_text_dark"

                  >
                    <FaCircleCheck className="mx-1" />
                    <span>Datos</span>
                  </Link>
                </div>
                <div className="line2  flex-grow-1 text-end">
                  <Link className="text-decoration-none px-2 sj_text_dark">
                    <FaCircleCheck className="mx-1" />
                    <span>Pago</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="j-counter-head">
            <div className="j-search-input">
              <FaSearch className="i" />
              <input
                type="search"
                className="form-control j-table_input"
                // id="email"
                placeholder="Buscar "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="j-show-items">
              <ul className="nav j-nav-scroll"
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
                  // flexWrap: "nowrap"
                }}
              >
                {parentCheck.map((category, index) => (
                  <li
                    className={`nav-item ${selectedCategory === category ? "active" : ""}`}
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

            {/* {subcategories[selectedCategory] && ( */}
            <div className="j-show-items">
              <ul className="nav j-nav-scroll">
                {currentSubfamilies.map((subcategory, index) => (
                  <li
                    className={`nav-item ${selectedSubCategory === subcategory ? "active" : ""}`}
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
            {/* )} */}
          </div>
          <div className="j-counter-body">
            {renderItems().length > 0 ? (
              <div className="j-card-item-1 j-border-bottom">
                <h2 className="text-white sjfs-18">
                  {selectedCategory?.id === 'todo' ? 'Todos los artículos' : selectedCategory?.name}
                </h2>
                <div className="j-counter-card">
                  <div className="row">
                    {renderItems()}
                  </div>
                </div>
              </div>
            ) : (
              <p className="no-products-found text-white text-center">No se encontró ningún producto</p>
            )}
          </div>
        </div>
        <div className="j-counter-price position-sticky" style={{ top: '77px' }}>
          <div className="b-summary-center mb-4 align-items-center text-white d-flex justify-content-between">
            {/* <div className="j_position_fixed j_b_hd_width"> */}
            <h2 class="text-white j-kds-body-text-1000 mb-0">Resumen</h2>
            <FaXmark className="b-icon" />
          </div>

          <div className="b-date-time d-flex align-items-center justify-content-end text-white">
            <FaCalendarAlt />
            <p className="mb-0 ms-2 me-3">{new Date().toLocaleDateString('en-GB')}</p>
            <MdOutlineAccessTimeFilled />
            <p className="mb-0 ms-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="b-delivery-button">
            <button className="bj-delivery-text-2">Delivery</button>
          </div>

          <div className="j-counter-price-data mt-4">
            <h3 className="text-white j-kds-body-text-1000">Datos</h3>
            <form>
              <div className="mb-3 b-input-registers">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label text-white"
                >Quién lo registra
                </label>
                <input
                  type="text"
                  className="form-control b-form-control"
                  id="exampleFormControlInput1"
                  placeholder=""
                  onChange={handlename}
                  value={cname}
                />
                {orderTypeError && <div className="text-danger errormessage">{orderTypeError}</div>}

              </div>
            </form>
            {/* <div className="b-product-order text-center">
              <MdRoomService className="i-product-order" />
              <h6 className="h6-product-order text-white">Empezar pedido</h6>
              <p className="p-product-order">Agregar producto para empezar <br />
                con el pedido</p>
            </div> */}
            {cartItems.length === 0 ? (
              <div>
                <div className="b-product-order text-center">
                <svg class="w-6 h-6 text-gray-800 dark:text-white i-product-order" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M20.337 3.664c.213.212.354.486.404.782.294 1.711.657 5.195-.906 6.76-1.77 1.768-8.485 5.517-10.611 6.683a.987.987 0 0 1-1.176-.173l-.882-.88-.877-.884a.988.988 0 0 1-.173-1.177c1.165-2.126 4.913-8.841 6.682-10.611 1.562-1.563 5.046-1.198 6.757-.904.296.05.57.191.782.404ZM5.407 7.576l4-.341-2.69 4.48-2.857-.334a.996.996 0 0 1-.565-1.694l2.112-2.111Zm11.357 7.02-.34 4-2.111 2.113a.996.996 0 0 1-1.69-.565l-.422-2.807 4.563-2.74Zm.84-6.21a1.99 1.99 0 1 1-3.98 0 1.99 1.99 0 0 1 3.98 0Z" clipRule="evenodd" />
      </svg>
                  {/* <MdRoomService className="i-product-order" /> */}
                  <h6 className="h6-product-order text-white">Empezar pedido </h6>
                  <p className="p-product-order">Agregar producto para empezar <br />
                    con el pedido</p>
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
                              <h3 className="j-tbl-btn-font-1">{item.count}</h3>
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
                                // handleShowEditFam();
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
                                <p className="j-nota-blue" style={{cursor: "pointer"}} onClick={() => handleAddNoteClick(index)}>{item.note}</p>
                              ) : (
                                <button
                                  className="j-note-final-button"
                                  onClick={() => handleAddNoteClick(index)}
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
                    <Link onClick={toggleShowAllItems} className="sjfs-14">
                      {showAllItems ? "Ver menos" : "Ver más"}
                    </Link>
                  )}
                </div>
                <div className="j-counter-total">
                  <h5 className="text-white j-tbl-text-15">Costo total</h5>
                  <div className="j-total-discount d-flex justify-content-between">
                    <p className="j-counter-text-2">Artículos</p>
                    <span className="text-white">${totalCost.toFixed(2)}</span>
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
                    <p className="text-white bj-delivery-text-153 ">Total</p>
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
                    onClick={placeNewOrder}
                  >
                    Continuar
                  </div>
                </div>
              </div>
            )}
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
              <img src={require("../Image/trash-outline.png")} alt="" />
              <p className="mb-0 mt-3 h6 j-tbl-pop-1">
                Pedido eliminado
              </p>
              <p className="opacity-75 j-tbl-pop-2">
                El pedido ha sido eliminado correctamente
              </p>
            </div>
          </Modal.Body>
        </Modal>

      </section>
    </div>
  );
};

export default BHomeDelivery;
