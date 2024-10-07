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
import { Button, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import useAudioManager from "./audioManager";
//import { enqueueSnackbar  } from "notistack";

const TableCounter1 = () => {
  const apiUrl = process.env.REACT_APP_API_URL; // Laravel API URL
  const API = process.env.REACT_APP_IMAGE_URL;

  const [token] = useState(sessionStorage.getItem("token"));
  const [role] = useState(sessionStorage.getItem("role"));
  const userId = sessionStorage.getItem("userId");
  const admin_id = sessionStorage.getItem("admin_id");
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [urlParams, setUrlParams] = useState(
    new URLSearchParams(location.search)
  );
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const tableStatus = queryParams.get("status");
  const { playNotificationSound } = useAudioManager();



  const [tId, setTId] = useState(id);
  const [parentCheck, setParentCheck] = useState([]);
  const [isEditing, setIsEditing] = useState([]);

  const [childCheck, setChildCheck] = useState([]);
  const [obj1, setObj1] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState("00 min 00 sg");
  const [customerNameError, setCustomerNameError] = useState("");
  const [personError, setPersonError] = useState("");
  const [cartError, setCartError] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);

  /*   const [ selectedCategory, setSelectedCategory ] = useState(categories[0]); */
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("Drinks");
  const [currentSubfamilies, setCurrentSubfamilies] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [person, setPerson] = useState("");
  const [showEditFamDel, setShowEditFamDel] = useState(false);
  const handleCloseEditFamDel = () => setShowEditFamDel(false);
  const handleShowEditFamDel = () => setShowEditFamDel(true);

  const [showEditFam, setShowEditFam] = useState(false);
  const handleCloseEditFam = () => setShowEditFam(false);
  const handleShowEditFam = () => setShowEditFam(true);

  const [tableData, setTableData] = useState([]);



  useEffect(() => {
    if (!(role == "admin" || role == "cashier" || role == "waitress")) {
      navigate('/dashboard')
    }
  }, [role])


  useEffect(() => {
    // Store URL parameters in state when component mounts
    setUrlParams(new URLSearchParams(location.search));
  }, []);

  /* get table data */

  const getTableData = async (id) => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${apiUrl}/table/getStats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        const lastRecordArray = [response.data[response.data.length - 1]];
        setTableData(lastRecordArray);
        console.log("Last Record Array:", lastRecordArray);
      } else {
        console.error("Response data is not a non-empty array:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching sectors:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (tableStatus === "busy") {
      if (id) getTableData(id);
    }
  },
    [id]
  );

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
  const [cartItems, setCartItems] = useState([]);
  const [countsoup, setCountsoup] = useState([]);

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
      // localStorage.removeItem("cartItems")
    },
    [cartItems]
  );
  const [showAllItems, setShowAllItems] = useState(false);
  const toggleShowAllItems = () => {
    setShowAllItems(!showAllItems);
  };
  const addItemToCart = async (item) => {
    if (tableData && tableData.length > 0) {
      // If tableData exists, check if the item already exists
      const existingItem = tableData[0].items.find(i => i.item_id === item.id);
      if (existingItem) {
        // If the item exists, increment its quantity
        await increment(existingItem.id, existingItem.item_id, existingItem.quantity, tId);
      } else {
        // If the item doesn't exist, add it as a new item
        await updateExistingOrder(item);
      }
    } else {
      // If tableData doesn't exist, add to cartItems
      addToCartItems(item);
    }

    // Update URL params and navigate
    navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
  };

  const updateExistingOrder = async (item) => {
    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/order/addItem`,
        {
          order_id: tableData[0].id,
          order_details: [
            {
              item_id: item.id,
              quantity: 1
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Item added to existing order:", response.data);
      getTableData(tId);
    } catch (error) {
      console.error(
        "Error adding item to existing order:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const addToCartItems = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    let updatedCartItems;
    if (existingItemIndex !== -1) {
      updatedCartItems = cartItems.map(
        (cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, count: cartItem.count + 1 }
            : cartItem
      );
    } else {
      updatedCartItems = [...cartItems, { ...item, count: 1 }];
    }

    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const updateTableData = (cartItems) => {
    setTableData((prevTableData) => {
      // If there's no previous data, create a new entry
      if (prevTableData.length === 0) {
        return [
          {
            id: tId,
            items: cartItems.map((item) => ({
              id: item.id,
              item_id: item.id,
              quantity: item.count,
              amount: item.price * item.count,
              notes: item.note || ""
            })),
            order_total: cartItems.reduce(
              (total, item) => total + item.price * item.count,
              0
            ),
            discount: discount,
            customer_name: customerName,
            person: person
          }
        ];
      }

      // If there's existing data, merge new items with existing ones
      const existingItems = prevTableData[0].items;
      const updatedItems = [...existingItems];

      cartItems.forEach((cartItem) => {
        const existingItemIndex = updatedItems.findIndex(
          (item) => item.item_id === cartItem.id
        );
        if (existingItemIndex !== -1) {
          // Update existing item
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: cartItem.count,
            amount: cartItem.price * cartItem.count,
            notes: cartItem.note || updatedItems[existingItemIndex].notes
          };
        } else {
          // Add new item
          updatedItems.push({
            id: cartItem.id,
            item_id: cartItem.id,
            quantity: cartItem.count,
            amount: cartItem.price * cartItem.count,
            notes: cartItem.note || ""
          });
        }
      });

      return [
        {
          ...prevTableData[0],
          items: updatedItems,
          order_total: updatedItems.reduce(
            (total, item) => total + item.amount,
            0
          ),
          discount: discount,
          customer_name: customerName,
          person: person
        }
      ];
    });
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
      (total, item) => total + parseInt(item.price) * item.count,
      0
    );
  };

  const totalCost = getTotalCost();
  const discount = 1.0;
  const finalTotal = totalCost - discount;

  /* api */

  useEffect(
    () => {
      if (token) {
        fetchFamilyData();
        fetchSubFamilyData();
        fetchAllItems();
      }
      // Set initial subcategories for "Drinks"
      const relatedSubfamilies = childCheck.filter(
        (subfamily) => subfamily.family_name === "Drinks"
      );
      setCurrentSubfamilies(relatedSubfamilies);
    },
    [apiUrl]
  );

  // get family

  const fetchFamilyData = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${apiUrl}/family/getFamily`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const todoCategory = { id: "todo", name: "Todo" };
      setParentCheck([todoCategory, ...response.data]);
      setSelectedCategory(todoCategory);
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
  };

  // get subfamily
  const fetchSubFamilyData = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${apiUrl}/subfamily/getSubFamily`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
    setIsProcessing(false);
  };

  // get product
  const fetchAllItems = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${apiUrl}/item/getAll`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setObj1(response.data.items);
    } catch (error) {
      console.error(
        "Error fetching items:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
  };
  /*   const [ currentSubfamilies, setCurrentSubfamilies ] = useState([]); */

  const [checkedParents, setCheckedParents] = useState(
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
      notes: item.note ? item.note.replace(/^Nota:\s*/i, "").trim() : "",
      admin_id: admin_id
    }));

    const orderData = {
      order_details: orderDetails,
      admin_id: admin_id,
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
        reason: "",
        transaction_code: false,
      }
    };

    setIsProcessing(true);
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
      // console.log(tId);
      // Call the table/updateStatus API
      try {
        const resTable = await axios.post(
          `${apiUrl}/table/updateStatus`,
          {
            table_id: parseInt(tId),
            status: "busy", // Set the status you need
            admin_id: admin_id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log("Table status updated successfully", resTable.data);
  
        // Clear cart items from local storage
        localStorage.removeItem("cartItems");
  
        // Clear cart items from state
        setCartItems([]);
        setCountsoup([]);
        navigate("/table");
  
        // Handle successful order creation (e.g., show success message, redirect, etc.)
      } catch (error) {
        setIsProcessing(false);
        console.log("Table status  Not updated" + error.message);
      }
 
    } catch (err) {
      console.error("Error creating order:", err);
      //enqueueSnackbar (err?.response?.data?.message, { variant: 'error' })

    } finally {
      setIsProcessing(false);
    }
  };
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
 

  //   other logic
  const [showAll, setShowAll] = useState(false);

  const handleShowMoreClick = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };
  /* get name and image */
  const getItemInfo = (itemId) => {
    const item = obj1.find((item) => item.id === itemId);
    if (item) {
      return { name: item.name, image: item.image };
    } else {
      // If the item is not found in obj1, check tableData
      const tableItem = tableData[0]?.items.find(item => item.item_id === itemId);
      if (tableItem) {
        return { name: `Item ${itemId}`, image: "" }; // You might want to store and use the actual name and image
      }
      return { name: "Unknown Item", image: "" };
    }
  };
  //   add note
  const [addNotes, setAddNotes] = useState(
    Array(tableData.flatMap((t) => t.items).length).fill(false)
  );

  const addNoteToDatabase = async (itemId, note) => {
    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/order/addNote/${itemId}`,
        {
          notes: note
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        return true;
      } else {
        console.error("Failed to add note:", response.data.message);
        return false;
      }
    } catch (error) {
      console.error(
        "Error adding note:",
        error.response ? error.response.data : error.message
      );
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // const handleSubmitNote = async (e, index, oId) => {
  //   e.preventDefault();
  //   const finalNote = e.target.elements[0].value.trim();
  //   if (finalNote) {
  //     const flatIndex = tableData
  //       .flatMap((t) => t.items)
  //       .findIndex((_, i) => i === index);
  //     const tableIndex = tableData.findIndex((t) =>
  //       t.items.includes(tableData.flatMap((t) => t.items)[flatIndex])
  //     );
  //     const itemIndex = tableData[tableIndex].items.findIndex(
  //       (item) => item === tableData.flatMap((t) => t.items)[flatIndex]
  //     );

  //     const tableId = tableData[tableIndex].id;
  //     const itemId = tableData[tableIndex].items[itemIndex].item_id;

  //     const success = await addNoteToDatabase(oId, finalNote);

  //     if (success) {
  //       handleNoteChange(index, finalNote);
  //     } else {
  //       // Handle error - maybe show an error message to the user
  //       console.error("Failed to add note to database");
  //     }
  //   }

  //   const updatedAddNotes = [...addNotes];
  //   updatedAddNotes[index] = false;
  //   setAddNotes(updatedAddNotes);
  // };

  // const handleNoteChange = (index, note) => {
  //   const updatedTableData = [...tableData];
  //   const flatIndex = tableData
  //     .flatMap((t) => t.items)
  //     .findIndex((_, i) => i === index);
  //   const tableIndex = tableData.findIndex((t) =>
  //     t.items.includes(tableData.flatMap((t) => t.items)[flatIndex])
  //   );
  //   const itemIndex = tableData[tableIndex].items.findIndex(
  //     (item) => item === tableData.flatMap((t) => t.items)[flatIndex]
  //   );
  //   updatedTableData[tableIndex].items[itemIndex].notes = note;
  //   setTableData(updatedTableData);
  // };

  // const handleAddNoteClick = (index) => {
  //   const updatedAddNotes = [...addNotes];
  //   updatedAddNotes[index] = true;
  //   setAddNotes(updatedAddNotes);
  // };
  // timer
  const [elapsedTime, setElapsedTime] = useState("");
  const calculateElapsedTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diff = now - created;

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes} min ${seconds} seg`;
  };
  useEffect(
    () => {
      if (tableData.length > 0 && tableData[0].created_at) {
        const timer = setInterval(() => {
          setElapsedTime(calculateElapsedTime(tableData[0].created_at));
        }, 1000);

        return () => clearInterval(timer);
      }
    },
    [tableData]
  );

  const increment = async (proid, item_id, quantity, tableId) => {
    // setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/order/updateItem/${proid}`,
        {
          order_id: tableData[0].id,
          order_details: [
            {
              item_id: item_id,
              quantity: quantity + 1
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Item quantity updated successfully:", response.data);
      getTableData(tableId);
    } catch (error) {
      console.error(
        "Error updating item quantity:",
        error.response ? error.response.data : error.message
      );
    } finally {
      // setIsProcessing(false);
    }
  };

  const decrement = async (proid, item_id, quantity, tableId) => {
    // setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/order/updateItem/${proid}`,
        {
          order_id: tableData[0].id,
          order_details: [
            {
              item_id: item_id,
              quantity: quantity - 1
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Note added successfully:", response.data);
      getTableData(tableId);
    } catch (error) {
      console.error(
        "Error adding note:",
        error.response ? error.response.data : error.message
      );
    } finally {
      // setIsProcessing(false);
    }
  };

  // const handleDeleteConfirmation = (id) => {
  
  //   handleCloseEditFam();
    
  // };

  const handleDeleteClick = async (itemToDelete) => {
    
    if (itemToDelete) {
      removeAllItemFromCart(itemToDelete);
      handleCloseEditFam();
      setIsProcessing(true);
      try {
        const response = await axios.delete(
          `${apiUrl}/order/deleteSingle/${itemToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if(response.data.success){
          setIsProcessing(false);
          handleShowEditFamDel();
          setTimeout(() => {
            setShowEditFamDel(false);
          }, 2000);
          getTableData(tId);
        }
        console.log("Product deleted successfully:", response.data);
        
      } catch (error) {
        console.error(
          "Error Delete OrderData:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setIsProcessing(false);
      }
    }
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
            <div className=" j-counter-header j_counter_header_last_change">
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
              <div className="b-summary-center  align-items-center text-white d-flex justify-content-between">
                <h2 className="mb-0 j-tbl-font-5">Resumen</h2>
                <Link to="/table">
                  <FaXmark className="b-icon x-icon-size" />
                </Link>
              </div>

              <div className="j-counter-price-data mt-4">
                <h3 className="text-white j-tbl-text-13 mb-3">Datos</h3>
                {tableData && Object.keys(tableData).length > 0 ? (
                  // Display table data
                  <div>
                    <h4 className="j-table-co4 j-tbl-text-13">Mesa {tId}</h4>
                    <div className="d-flex align-items-center justify-content-between my-3">
                      <div className="j-busy-table d-flex align-items-center">
                        <div className="j-b-table" />
                        <p className="j-table-color j-tbl-font-6">Ocupado</p>
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
                          {elapsedTime}
                        </p>
                      </div>
                    </div>
                    <div className="j-orders-inputs">
                      <div>
                        <div className="j-orders-inputs">
                          <div className="j-orders-code">
                            <label className="j-label-name text-white mb-2 j-tbl-btn-font-1">
                              Quién registra
                            </label>
                            <input
                              className="j-input-name"
                              type="text"
                              value={tableData[0].customer_name}
                              readOnly
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
                                value={tableData[0].person}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                        <div className="j-counter-order ">
                          <h3 className="text-white j-tbl-pop-1">Pedido </h3>
                          <div className={"j-counter-order-data j_counter_order_width"}>
                            {(tableData && tableData.length > 0
                              ? tableData[0].items
                              : cartItems)
                              .slice(
                                0,
                                showAllItems
                                  ? tableData && tableData.length > 0
                                    ? tableData[0].items.length
                                    : cartItems.length
                                  : 3
                              )
                              .map((item, index) => {
                                const itemInfo = getItemInfo(
                                  item.item_id || item.id
                                );
                                return (
                                  <div
                                    className="j-counter-order-border-fast j_border_width"
                                    key={item.id}
                                  >
                                    <div className="j-counter-order-img j_counter_order_final">
                                      <div className="j_d_flex_aic">
                                        <img
                                          src={`${API}/images/${itemInfo.image}`}
                                          alt=""
                                        />
                                        <h5 className="text-white j-tbl-font-5">
                                          {itemInfo.name}
                                        </h5>
                                      </div>
                                      <div className="d-flex align-items-center">
                                        <div className="j-counter-mix">
                                          <button
                                            className="j-minus-count"
                                            onClick={() =>
                                              tableData && tableData.length > 0
                                                ? decrement(
                                                  item.id,
                                                  item.item_id,
                                                  item.quantity,
                                                  tId
                                                )
                                                : removeItemFromCart(item.id)}
                                          >
                                            <FaMinus />
                                          </button>
                                          <h3> {item.quantity || item.count}</h3>
                                          <button
                                            className="j-plus-count"
                                            onClick={() =>
                                              tableData && tableData.length > 0
                                                ? increment(
                                                  item.id,
                                                  item.item_id,
                                                  item.quantity,
                                                  tId
                                                )
                                                : addItemToCart(item)}
                                          >
                                            <FaPlus />
                                          </button>
                                        </div>

                                        <h4 className="text-white fw-semibold d-flex">
                                          ${parseInt(item.amount) ||
                                            parseInt(item.price) * item.count}
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
                                      {item.notes ? (
                                        <span className="j-nota-blue">
                                          Nota: {item.notes}
                                        </span>
                                      ) : (
                                        <div>
                                          {addNotes[index] ? (
                                            <form
                                              // onSubmit={(e) =>
                                              //   handleSubmitNote(e, index, item.id)}
                                            >
                                              <span className="j-nota-blue">
                                                Nota:{" "}
                                              </span>
                                              <input
                                                className="j-note-input"
                                                type="text"
                                                defaultValue={item.notes || ""}
                                                autoFocus
                                              />
                                            </form>
                                          ) : (
                                            <button
                                              type="button"
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
                                );
                              })}
                            {tableData[0].items.length > 3 && (
                              <Link
                                onClick={toggleShowAllItems}
                                className="sjfs-14"
                              >
                                {showAllItems ? "Ver menos" : "Ver más"}
                              </Link>
                            )}
                          </div>
                          <div className="j-counter-total">
                            <h5 className="text-white j-tbl-text-15 ">
                              Costo total
                            </h5>
                            <div className="j-border-bottom32">
                              <div className="j-total-discount d-flex justify-content-between">
                                <p className="j-tbl-pop-2">Artículos</p>
                                <span className="text-white j-tbl-text-16">
                                  {tableData.map((item) => (
                                    <span key={item.id}>
                                      ${parseFloat(item.order_total).toFixed(2)}
                                    </span>
                                  ))}
                                </span>
                              </div>
                              <div className="j-total-discount mb-2 d-flex justify-content-between">
                                <p className="j-tbl-pop-2">Descuentos</p>
                                <span className="text-white j-tbl-text-16">
                                  {tableData.map((item) => (
                                    <span key={item.id}>
                                      ${parseFloat(item.discount).toFixed(2)}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            </div>
                            <div className="j-total-discount my-2 d-flex justify-content-between">
                              <p className="text-white fw-semibold j-tbl-text-14">
                                Total
                              </p>
                              <span className="text-white fw-semibold j-tbl-text-14">
                                {tableData.map((item) => (
                                  <span key={item.id}>
                                    ${" "}
                                    {parseFloat(
                                      item.order_total - item.discount
                                    ).toFixed(2)}
                                  </span>
                                ))}
                              </span>
                            </div>
                            <Link
                              className="btn w-100 j-btn-primary text-white j-tbl-btn-font-1 mb-3"
                              to={"/table"}
                            >
                              Enviar a Cocina
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : // If tableData is empty, check cartItems
                  cartItems.length === 0 ? (
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
                    // If cartItems is not empty, display cart items
                    <div>
                      {/* Existing cart items display code */}
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
                            {date}
                          </p>
                        </div>
                      </div>
                      <div className="j-orders-inputs">
                        <div>
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
                                              handleNoteChange(
                                                index,
                                                e.target.value
                                              )}
                                            onBlur={() =>
                                              handleFinishEditing(index)}
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
                                            <p className="j-nota-blue">
                                              {item.note}
                                            </p>
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
                                class="btn w-100 j-btn-primary text-white m-articles-text-2"
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
                      onClick={() => handleDeleteClick(itemToDelete)}
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
        </section>
      </div>
    </section>
  );
};

export default TableCounter1;
