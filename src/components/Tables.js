import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Sidenav from "./Sidenav";
import { BsThreeDots } from "react-icons/bs";
import TableCard from "./TableCard";
import { Offcanvas, Spinner } from "react-bootstrap";
import { MdRoomService } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { FaL, FaMinus, FaPlus } from "react-icons/fa6";

import TableRecipt from "./TableRecipt";
import axios from "axios";
import Loader from "./Loader";
import { debounce } from 'lodash'; // Import lodash for debouncing
import echo from "../echo";
import Echo from "laravel-echo";
import { io } from 'socket.io-client';
import useAudioManager from "./audioManager";
import ElapsedTimeDisplay from "./ElapsedTimeDisplay";
//import { enqueueSnackbar  } from "notistack";

const Tables = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const API = process.env.REACT_APP_IMAGE_URL;
  const [token] = useState(localStorage.getItem("token"));
  const [role] = useState(localStorage.getItem("role"));
  const [isProcessing, setIsProcessing] = useState(false);
  const admin_id = localStorage.getItem("admin_id");
  const [secTab, setSecTab] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState({});
  const [sectors, setsectors] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteOrderConfirm, setShowDeleteOrderConfirm] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const { playNotificationSound } = useAudioManager();
  const [selectedTabNo,setSelectedTabNo] = useState('');

  const [newTable, setNewTable] = useState({
    sectorName: "",
    noOfTables: ""
  });
  const [addsector, setAddsector] = useState({
    name: "",
    noOfTables: ""
  });
  const [tableData, setTableData] = useState([]);
  const [obj1, setObj1] = useState([]);
  const [createErrors, setCreateErrors] = useState({
    name: "",
    noOfTables: ""
  });
  const [paymentData, setPaymentData] = useState([]);
  const [editErrors, setEditErrors] = useState({ name: "", noOfTables: "" });
  const [addTableErrors, setAddTableErrors] = useState({
    sectorName: "",
    noOfTables: ""
  });
  const [tableStatus, setTableStatus] = useState(null); // State for table status

  useEffect(() => {
    if (!(role == "admin" || role == "cashier" || role == "waitress")) {
      navigate('/dashboard')
    }
  }, [role])

  // Debounce function for API calls
  const debouncedFetchData = useRef(
    debounce(async () => {
      try {
        await Promise.all([
          getSector(),
          getSectorTable(),
          fetchAllItems(),
          fetchUser(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      }
    }, 500) // 500ms debounce
  ).current;

  useEffect(() => {
    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel(); // Cleanup on unmount
    };
  }, [apiUrl, debouncedFetchData]);





  /* get sector */

  const getSector = async () => {
    setIsProcessing(true)
    try {
      const response = await axios.post(`${apiUrl}/sector/getAll`, { admin_id: admin_id });
      if (response.data.success) {
        setCheckboxes(response.data.sectors);
        setsectors(response.data.sectors);
      } else {
        console.error("Response data is not an array:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching sectors:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false)
  };
  // get product
  const fetchAllItems = async () => {
    setIsProcessing(true)
    try {
      const response = await axios.get(`${apiUrl}/item/getAll`, {
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
    setIsProcessing(false)
  };

  /* get table data */
  const getTableData = async (id) => {
    setIsProcessing(true)
    try {
      const response = await axios.post(`${apiUrl}/table/getStats/${id}`, { admin_id: admin_id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        const lastRecordArray = [response.data[response.data.length - 1]];
        setTableData(lastRecordArray);
        // console.log("Last Record Array:", lastRecordArray);
      } else {
        console.error("Response data is not a non-empty array:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching sectors:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false)
  };

  // get payment data
  const getPaymentData = async (id) => {
    setIsProcessing(true)
    try {
      const response = await axios.get(`${apiUrl}/getsinglepayments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {

        setPaymentData(response.data.data);
      } else {
        console.error("Response data is not an array:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching sectors:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false)
  };

  const getSectorTable = async () => {
    setIsProcessing(true)
    try {
      const response = await axios.post(`${apiUrl}/sector/getWithTable`, { admin_id: admin_id });
      if (response.data) {
        setSecTab(response.data.data);
      } else {
        console.error("Response data is not an array:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching sectors:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false)
  };

  // Get sectors
  // Modify handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;


    addsector[name] = value;
    // setAddsector({
    //   ...addsector,
    //   [name]: value
    // });
    // Clear error when user types
    if(createErrors[name]){
      setCreateErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleNewTableChange = (e) => {
    const { name, value } = e.target;
    setNewTable((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    setAddTableErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  //add table to sector

  const handleAddTableSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setAddTableErrors({ sectorName: "", noOfTables: "" });

    let hasErrors = false;

    if (!newTable.sectorName) {
      setAddTableErrors((prev) => ({
        ...prev,
        sectorName: "Por favor seleccione un sector"
      }));
      hasErrors = true;
    }

    if (isNaN(newTable.noOfTables) || newTable.noOfTables <= 0) {
      setAddTableErrors((prev) => ({
        ...prev,
        noOfTables:
          "Por favor ingrese un número válido de tablas (debe ser mayor a 0)"
      }));
      hasErrors = true;
    }

    if (hasErrors) return;
    handleClose1();
    setIsProcessing(true)
    try {
      const response = await axios.post(
        `${apiUrl}/sector/addTables`,
        {
          sector_id: newTable.sectorName,
          noOfTables: newTable.noOfTables,
          admin_id: admin_id

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        handleShowCreSuc2();
        getSector();
        getSectorTable();
        setIsProcessing(false);
        setNewTable({ sectorName: "", noOfTables: "" });
        if (response.data && response.data.notification) {
          //enqueueSnackbar (response.data.notification, { variant: 'success' });
        } else {
          //enqueueSnackbar (`número de tabla ${newTable.noOfTables} agregado exitosamente`, { variant: 'success' });
        }
        // playNotificationSound();;
      } else {
        console.error("Error updating sector:", response.data);
      }
    } catch (error) {
      console.error("Error updating sector:", error);
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;
    }
    setIsProcessing(false);
  };
  // edit sector
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setEditErrors({ name: "", noOfTables: "" });

    let hasErrors = false;

    if (!selectedFamily.name.trim()) {
      setEditErrors((prev) => ({
        ...prev,
        name: "Introduzca un nombre de sector"
      }));
      hasErrors = true;
    }

    if (isNaN(selectedFamily.noOfTables) || selectedFamily.noOfTables <= 0) {
      setEditErrors((prev) => ({
        ...prev,
        noOfTables:
          "Por favor ingrese un número válido de tablas (debe ser mayor a 0)"
      }));
      hasErrors = true;
    }

    if (hasErrors) return;
    handleCloseEditFam();
    setIsProcessing(true)
    try {
      const response = await axios.post(
        `${apiUrl}/sector/update/${selectedFamily.id}`,
        selectedFamily,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (response.status === 200) {
        handleShowEditFamSuc();
        getSector();
        getSectorTable();
        setIsProcessing(false);
        if (response.data && response.data.notification) {
          //enqueueSnackbar (response.data.notification, { variant: 'success' });
        } else {
          //enqueueSnackbar (`Sector ${selectedFamily.name} actualizado exitosamente`, { variant: 'success' });
        }
        // playNotificationSound();;
      }
    } catch (error) {
      console.error("Error updating sector:", error);
      // alert("Failed to update sector. Please try again.");
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;
    }
  };
  const handleEditSector = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/sector/update/${selectedFamily.id}`,
        {
          name: selectedFamily.name,
          noOfTables: selectedFamily.noOfTables
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        handleCloseEditFam();
        handleShowEditFamSuc();
        getSector();
        getSectorTable();
      } else {
        throw new Error("Failed to update sector");
      }
    } catch (error) {
      console.error("Error updating sector:", error);
      alert("Failed to update sector. Please try again.");
    }
  };

  //create sector
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setCreateErrors({ name: "", noOfTables: "" });

    let hasErrors = false;

    if (!addsector.name.trim()) {
      setCreateErrors((prev) => ({
        ...prev,
        name: "Introduzca un nombre de sector"
      }));
      hasErrors = true;
    }

    if (isNaN(addsector.noOfTables) || addsector.noOfTables <= 0) {
      setCreateErrors((prev) => ({
        ...prev,
        noOfTables:
          "Por favor ingrese un número válido de tablas (debe ser mayor a 0)"
      }));
      hasErrors = true;
    }

    if (hasErrors) return;
    handleClose();
    setIsProcessing(true)
    try {
      const response = await axios.post(`${apiUrl}/sector/create`, { ...addsector, admin_id: admin_id }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        maxBodyLength: Infinity
      });
      if (response.status === 200) {
        handleShowCreSuc();
        getSector();
        getSectorTable();
        setIsProcessing(false)
        setAddsector({ name: "", noOfTables: "" }); // Reset form
        if (response.data && response.data.notification) {
          //enqueueSnackbar (response.data.notification, { variant: 'success' });
        } else {
          //enqueueSnackbar (`Sector ${addsector.name} creado exitosamente`, { variant: 'success' });
        }
        // playNotificationSound();;
      }
    } catch (error) {
      console.error("Error creating sector:", error);
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;
    }
  };

  //delete sector

  const handleDeleteFamily = (sectorId) => {
    axios
      .delete(`${apiUrl}/sector/delete/${sectorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        handleCloseEditFam();
        handleShowEditFamDel();
        setCheckboxes((prevCheckboxes) =>
          prevCheckboxes.filter((sector) => sector.id !== sectorId)
        );
        getSector();
        getSectorTable();
      })
      .catch((error) => {
        console.error(
          "Error deleting family:",
          error.response ? error.response.data : error.message
        );
      });
  };

  //edit sector
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    selectedFamily[name] = value;

    // setSelectedFamily((prevFamily) => ({
    //   ...prevFamily,
    //   [name]: value
    // }));
  };

  const hundleEditDeletePop = (sector) => {
    setSelectedFamily(sector);
    setSelectedFamily((prev) => ({
      ...prev,
      noOfTables: sector.noOfTables || "", // Fill noOfTables if available
    }));

    handleShowEditFam();
  };
  const [selectedSectors, setSelectedSectors] = useState([]);

  const handleCheckboxChange = (index) => {
    setSelectedSectors(
      (prevSelectedSectors) =>
        prevSelectedSectors?.includes(index)
          ? prevSelectedSectors.filter((i) => i !== index)
          : [...prevSelectedSectors, index]
    );
  };

  const [filterStatus, setFilterStatus] = useState("");

  const filteredTables = () => {
    let tables = secTab.flatMap((ele) => ele.tables);
    if (selectedSectors.length !== 0) {
      tables = secTab.flatMap(
        (ele, index) => (selectedSectors?.includes(index) ? ele.tables : [])
      );
    }
    if (filterStatus) {
      tables = tables.filter((table) => table.status === filterStatus);
    }
    return tables;
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  // Add product
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => {
    setShow1(false);
    setAddTableErrors({ sectorName: "", noOfTables: "" });
  };
  const handleShow1 = () => setShow1(true);

  // create family
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setCreateErrors({ name: "", noOfTables: "" });
  };
  const handleShow = () => setShow(true);

  // create family success
  const [showCreSuc, setShowCreSuc] = useState(false);
  const handleCloseCreSuc = () => setShowCreSuc(false);
  const handleShowCreSuc = () => {
    setShowCreSuc(true);
    setTimeout(() => {
      setShowCreSuc(false);
    }, 2000);
  };
  // create recipe
  const [show250, setShow250] = useState(false);
  const handleClose250 = () => {
    setShow250(false);
    setPaymentData([]);
  };
  const handleShow250 = () => {
    setShow250(true);
    // getPaymentData(tableData[0].id);
  };

  const [showCreSuc2, setShowCreSuc2] = useState(false);
  const handleCloseCreSuc2 = () => setShowCreSuc2(false);
  const handleShowCreSuc2 = () => {
    setShowCreSuc2(true);
    setTimeout(() => {
      setShowCreSuc2(false);
    }, 2000);
  };

  const [show16, setShow16] = useState(false);

  const handleClose16 = () => setShow16(false);
  const handleShow16 = () => setShow16(true);

  // create subfamily success
  const [showCreSubSuc, setShowCreSubSuc] = useState(false);
  const handleCloseCreSubSuc = () => setShowCreSubSuc(false);
  const handleShowCreSubSuc = () => setShowCreSubSuc(true);

  // edit family
  const [showEditFam, setShowEditFam] = useState(false);
  const handleCloseEditFam = () => setShowEditFam(false);
  const handleShowEditFam = () => setShowEditFam(true);

  // edit family Success
  const [showEditFamSuc, setShowEditFamSuc] = useState(false);
  const handleCloseEditFamSuc = () => setShowEditFamSuc(false);
  const handleShowEditFamSuc = () => {
    setShowEditFamSuc(true);
    setTimeout(() => {
      setShowEditFamSuc(false);
    }, 2000);
  };

  // edit family Eliminat
  const [showEditFamDel, setShowEditFamDel] = useState(false);
  const handleCloseEditFamDel = () => setShowEditFamDel(false);
  const handleShowEditFamDel = () => {
    setShowEditFamDel(true);
    setTimeout(() => {
      setShowEditFamDel(false);
    }, 2000);
  };

  const [countsoup, setCountsoup] = useState([]);
  const [cartItems, setCartItems] = useState([]);


  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const [selectedTable, setSelectedTable] = useState(null);
  const [showAvailableModal, setShowAvailableModal] = useState(false);
  const [showOcupadoModal, setShowOcupadoModal] = useState(false);


  // const handleCloseAvailableModal = async (tid) => {
  //   setShowAvailableModal(false);
  //   setIsOffcanvasOpen(false);
  //   setSelectedTable(null); // for socket

  //   const updatedCards = selectedCards.filter(card => card !== tid);
  //   setSelectedCards(updatedCards);

  //   const response1 = await axios.post(`http://127.0.0.1:8000/api/brodcastCardClicked`, {
  //     card_id: updatedCards // Pass the updatedCards instead of selectedTable
  //   });

  //   // console.log("card1", response1.data.card_id);
  //   // console.log("dvsdcv", selectedCards);

  //   setSelectedCards(response1.data.card_id);

  //   // console.log("response", response.data.card_id);
  //   // setSelectedTable(null); // for socket 
  // };



  const sUrl = process.env.REACT_APP_API_URL;


  const handleCloseAvailableModal = async (tid) => {
    setShowAvailableModal(false);
    setIsOffcanvasOpen(false);

    const response = await axios.post(`${sUrl}/brodcastCardClicked`, {
      card_id: selectedTable,
      selected: 0
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      }
    });
    console.log("response", response)

    setCardSelect(response.data);
    // Check if the card_id matches and set the table color
    if (response.data.card_id === selectedCards) {
      setTableColor("blue"); // Replace "desiredColor" with your color
    } else {
      setTableColor(""); // Reset color if it doesn't match
    }

    // setSelectedTable(null); // for socket

    // // Remove the table ID from selectedCards
    // const updatedCards = selectedCards.filter(card => card !== tid);
    // setSelectedCards(updatedCards);

    // // Remove the table ID from the socket broadcast
    // await axios.post(`http://127.0.0.1:8000/api/brodcastCardClicked`, {
    //   card_id: updatedCards // Pass the updatedCards
    // });
    // console.log("Updated Cards:", updatedCards);
  };
  const handleShowAvailableModal = (id,no) => {
    setSelectedTable(id);
    setShowAvailableModal(true);
    setShowOcupadoModal(false);
    setIsOffcanvasOpen(true);
    setSelectedTabNo(no);
  };

  const handleCloseOcupadoModal = async () => {
    setShowOcupadoModal(false);
    setIsEditing(false);
    const response = await axios.post(`${sUrl}/brodcastCardClicked`, {
      card_id: selectedTable,
      selected: 0
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      }
    });
    console.log("response", response)

    setCardSelect(response.data);
    // Check if the card_id matches and set the table color
    if (response.data.card_id === selectedCards) {
      setTableColor("blue"); // Replace "desiredColor" with your color
    } else {
      setTableColor(""); // Reset color if it doesn't match
    }
    setIsOffcanvasOpen(false);
    setSelectedCards(null);
    setSelectedTable(null); // for socket 
  };

  const handleShowOcupadoModal = (id,no) => {
    setSelectedTable(id);
    setShowOcupadoModal(true);
    setShowAvailableModal(false);
    setIsOffcanvasOpen(true);
    setSelectedTabNo(no);
  };

  /* get name and image */
  const getItemInfo = (itemId) => {
    const item = obj1.find((item) => item.id === itemId);
    return item
      ? { name: item.name, image: item.image }
      : { name: "Unknown Item", image: "" };
  };
  const [addNotes, setAddNotes] = useState(
    Array(tableData.flatMap((t) => t.items).length).fill(false)
  );


  /* add note */
  const addNoteToDatabase = async (itemId, note) => {
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
    }
  };

  const handleSubmitNote = async (e, index, oId) => {
    e.preventDefault();
    
    // Get the note value, handling both form submit and blur events
    let finalNote;
    if (e.target.elements) {
        // Form submit event
        finalNote = e.target.elements[0]?.value.trim();
    } else if (e.target.value) {
        // Direct input blur event
        finalNote = e.target.value.trim();
    } else {
        // Fallback
        return;
    }

    if (finalNote) {
        const success = await addNoteToDatabase(oId, finalNote);

        if (success) {
            handleNoteChange(index, finalNote);
        } else {
            console.error("Failed to add note to database");
        }
    }

    const updatedAddNotes = [...addNotes];
    updatedAddNotes[index] = false;
    setAddNotes(updatedAddNotes);
  };
  const handleNoteChange = (index, note) => {
    const updatedTableData = [...tableData];
    const flatIndex = tableData
      .flatMap((t) => t.items)
      .findIndex((_, i) => i === index);
    const tableIndex = tableData.findIndex((t) =>
      t.items.includes(tableData.flatMap((t) => t.items)[flatIndex])
    );
    const itemIndex = tableData[tableIndex].items.findIndex(
      (item) => item === tableData.flatMap((t) => t.items)[flatIndex]
    );
    updatedTableData[tableIndex].items[itemIndex].notes = note;
    setTableData(updatedTableData);
  };

  const handleAddNoteClick = (index) => {
    const updatedAddNotes = [...addNotes];
    updatedAddNotes[index] = true;
    setAddNotes(updatedAddNotes);
  };
  const [showAll, setShowAll] = useState(false);

  const handleShowMoreClick = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };
  /* navigate to other page */
  const navigate = useNavigate();
  const handleInfoMesaClick = () => {
    navigate("/table/information", { state: { selectedTable } });
  };
  // timer
  // const [elapsedTime, setElapsedTime] = useState("");
  // const calculateElapsedTime = (createdAt) => {
  //   const now = new Date();
  //   const created = new Date(createdAt);
  //   const diff = now - created;

  //   const minutes = Math.floor(diff / 60000);
  //   const seconds = Math.floor((diff % 60000) / 1000);

  //   return `${minutes} min ${seconds} seg`;
  // };
  // useEffect(
  //   () => {
  //     if (tableData.length > 0 && tableData[0].created_at) {
  //       const timer = setInterval(() => {
  //         setElapsedTime(calculateElapsedTime(tableData[0].created_at));
  //       }, 1000);

  //       return () => clearInterval(timer);
  //     }
  //   },
  //   [tableData]
  // );
  //pass data to Datos
  const handleCobrarClcik = () => {
    navigate(`/table/datos?id=${selectedTable}`, { state: { tableData } });
  };

  // increment and decrement at edit cart

  const increment = async (proid, item_id, quantity, tableId) => {
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
      console.log("Note added successfully:", response.data);
      getTableData(tableId);
    } catch (error) {
      console.error(
        "Error adding note:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const decrement = async (proid, item_id, quantity, tableId) => {
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
    }
  };

  const [show18, setShow18] = useState(false);

  const handleClose18 = () => setShow18(false);
  const handleShow18 = () => {
    setShow18(true);
    setTimeout(() => {
      setShow18(false);
    }, 2000);
  };
  const handleEditSave = () => {
    setIsEditing(false);
    handleCloseOcupadoModal();
  };
  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteConfirm(true); // Show confirmation modal
    handleCloseEditFam();
  };
  const handleDeleteOrderClick = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteOrderConfirm(true); // Show confirmation modal
    handleCloseEditFam();
  };
  // delete sector
  const handleDeleteConfirmation = async () => {
    console.log(itemToDelete)

    if (itemToDelete) {
      try {
        const response = await axios.delete(
          // `${apiUrl}/order/deleteSingle/${itemToDelete}`,
          `${apiUrl}/sector/delete/${itemToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // getTableData(selectedTable);
        setCheckboxes((prevCheckboxes) =>
          prevCheckboxes.filter((sector) => sector.id !== itemToDelete)
        );
        getSector();
        getSectorTable();
        getTableData(selectedTable)
        handleShowEditFamDel();
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        if (response.data && response.data.notification) {
          //enqueueSnackbar (response.data.notification, { variant: 'success' });
        } else {
          //enqueueSnackbar (`Sector ${itemToDelete} eliminado exitosamente`, { variant: 'success' });
        }
        // playNotificationSound();;
      } catch (error) {
        console.error(
          "Error Delete OrderData:",
          error.response ? error.response.data : error.message
        );
        //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
        // playNotificationSound();;
      }
    }
  };
  const handleDeleteOrderConfirmation = async () => {
    console.log(itemToDelete)

    if (itemToDelete) {
      try {
        const response = await axios.delete(
          `${apiUrl}/order/deleteSingle/${itemToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // getTableData(selectedTable);
        setCheckboxes((prevCheckboxes) =>
          prevCheckboxes.filter((sector) => sector.id !== itemToDelete)
        );
        getSector();
        getSectorTable();
        getTableData(selectedTable)
        handleShowEditFamDel();
        setShowDeleteOrderConfirm(false);
        setItemToDelete(null);
      } catch (error) {
        console.error(
          "Error Delete OrderData:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };



  // redirect to new page
  const handleLinkClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    localStorage.removeItem("cartItems"); // Clear only cart items from local storage

    navigate(`/table1?id=${selectedTable}&status=${tableStatus}`); // Navigate to the new page
  };





  // get user name

  const fetchUser = async () => {
    await axios
      .get(`${apiUrl}/get-users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };
  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Unknown User"; // Return 'Unknown User' if not found
  };
  // socket
  const [tableColor, setTableColor] = useState("");
  const [cardSelect, setCardSelect] = useState([]);
  const [selectedCards, setSelectedCards] = useState('');

  useEffect(() => {
    const postCardClick = async (selectedTable) => {
      console.log(selectedCards);
      try {
        const response = await axios.post(`${sUrl}/brodcastCardClicked`, {
          card_id: selectedTable,
          selected: 1
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          }
        });
        console.log(response);
        setCardSelect(response.data);
        // Check if the card_id matches and set the table color
        if (response.data.card_id === selectedCards) {
          setTableColor("blue"); // Replace "desiredColor" with your color
        } else {
          setTableColor(""); // Reset color if it doesn't match
        }
      } catch (error) {
        console.error("Error posting card click", error);
      }
    };

    postCardClick(selectedTable);
  }, [selectedTable]);

  const [cards, setCards] = useState([]);

  useEffect(() => {
    window.Pusher = require('pusher-js');

    const socket = new Echo({
      // broadcaster: 'pusher',
      // key: "7ae046560a0ed83ad8c7", // Replace with your actual Pusher key
      // cluster: "mt1", // Ensure this matches your Pusher cluster
      // wsHost: window.location.hostname, // Automatically use the current hostname
      // wsPort: 6001, // Ensure this is the port your WebSocket server is using
      // forceTLS: false, // Set to true for HTTPS
      // encrypted: false, // Ensures connection is encrypted
      // disableStats: true, // Enable stats for production
      // enabledTransports: ['ws', 'wss'], // Allow both unencrypted and encrypted WebSocket connections



      broadcaster: "pusher",
      key: "7ae046560a0ed83ad8c7",
      cluster: "mt1",
      wsHost: window.location.hostname,
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws', 'wss'], // Allow both unencrypted and encrypted WebSocket connections

    });



    socket.connector.pusher.connection.bind('connected', () => {
      console.log("hello ")// Update state when connected
    });
    socket.connector.pusher.connection.bind('error', (error) => {
      console.error("Connection error:", error);
    });
    // const channel = echo.channel('chatMessage');

    // channel.listen('CardClick', (e) => {
    //   console.log("BoxClicked event received:", e);
    //   if (e.card_id && !selectedCards.includes(e.card_id)) {
    //     console.log("Adding card id:", e.card_id);
    //     setSelectedCards(prevCards => [...new Set([...pre vCards, e.card_id])]);
    //   }
    // });
    echo.channel('box-channel').listen('.CardClick', (event) => {
      // console.log(event);
      if (event.selected) {
        setSelectedCards(prev => [...prev ? prev : [], event.card_id]);

      } else {
        setSelectedCards(prev => prev?.filter(id => id !== event.card_id));
      }
    });
  }, [selectedCards]);

  // Get CSRF token
  const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : '';

  // fetch(`${sUrl}/brodcastCardClicked`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-CSRF-TOKEN': csrfToken,
  //   },
  //   body: JSON.stringify({ card_id: selectedTable, }),

  // });



  return (
    <section>
      <Header />
      <div className="d-flex">
        <Sidenav />

        <div className=" flex-grow-1 sidebar">

          <div>
            <div className="p-3 m_bgblack text-white m_borbot j-tbl-font-1 jay-table-fixed-kya">
              <h5 className="mb-0 j-tbl-font-1">Mesas</h5>
            </div>
            <div className="row ">
              <div
                className="col-3 j-card-width1 m_bgblack j-table-position j-border-right m-0 p-0  m_borrig "
                style={{ minHeight: "100vh" }}
              >
                <div className="j-articals-sticky pt-1">
                  <div className="ms-3 pe-3">
                    <div className="m_borbot ">
                      <p className="text-white j-tbl-font-2">Sectores</p>
                      <div className="d-flex align-items-center">
                        <Button
                          data-bs-theme="dark"
                          className="j_drop b_btn_pop j_t_sector_button j-tbl-font-3 mb-3"
                          onClick={handleShow}
                        >
                          <FaPlus className="j-icon-font-1" />
                          Crear sector
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* create family */}
                  <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop={true}
                    keyboard={false}
                    className="m_modal"
                  >
                    <Modal.Header closeButton className="b_border_bb1 px-0">
                      <Modal.Title className="j-tbl-text-10">
                        Crear sector
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="border-0 pb-0">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label j-tbl-font-11"
                        >
                          Nombre
                        </label>
                        <input
                          type="text"
                          className="form-control j-table_input"
                          id="exampleFormControlInput1"
                          placeholder="Eje. Sector 1"
                          // value={addsector.name}
                          name="name"
                          onChange={handleChange}
                        />
                        {createErrors.name && (
                          <div className="text-danger errormessage">
                            {createErrors.name}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label j-tbl-font-11"
                        >
                          Número de mesas
                        </label>
                        <input
                          type="text"
                          className="form-control j-table_input"
                          id="exampleFormControlInput1"
                          placeholder="0"
                          name="noOfTables"
                          // value={addsector.noOfTables}
                          onChange={handleChange}
                        />
                        {createErrors.noOfTables && (
                          <div className="text-danger errormessage">
                            {createErrors.noOfTables}
                          </div>
                        )}
                      </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                      <Button
                        className="j-tbl-btn-font-1 b_btn_pop"
                        variant="primary"
                        onClick={handleSubmit}
                      >
                        Crear
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  {/* subfamily success */}
                  <Modal
                    show={showCreSubSuc}
                    onHide={handleCloseCreSubSuc}
                    backdrop={true}
                    keyboard={false}
                    className="m_modal"
                  >
                    <Modal.Header closeButton className="border-0" />
                    <Modal.Body>
                      <div className="text-center">
                        <img src={require("../Image/check-circle.png")} alt="" />
                        <p className="mb-0 mt-2 h6">Subfamilia</p>
                        <p className="opacity-75">creada exitosamente</p>
                      </div>
                    </Modal.Body>
                  </Modal>

                  {/* family success */}
                  <Modal
                    show={showCreSuc}
                    onHide={handleCloseCreSuc}
                    backdrop={true}
                    keyboard={false}
                    className="m_modal"
                  >
                    <Modal.Header closeButton className="border-0" />
                    <Modal.Body>
                      <div className="text-center">
                        <img src={require("../Image/check-circle.png")} alt="" />
                        <p className="mb-0 mt-2 h6 j-tbl-pop-1">Sector</p>
                        <p className="opacity-75 j-tbl-pop-2">
                          Se ha creado exitosamente
                        </p>
                      </div>
                    </Modal.Body>
                  </Modal>

                  <Modal
                    show={showCreSuc2}
                    onHide={handleCloseCreSuc2}
                    backdrop={true}
                    keyboard={false}
                    className="m_modal"
                  >
                    <Modal.Header closeButton className="border-0" />
                    <Modal.Body>
                      <div className="text-center">
                        <img src={require("../Image/check-circle.png")} alt="" />
                        <p className="mb-0 mt-2 h6 j-tbl-pop-1">Mesas</p>
                        <p className="opacity-75 j-tbl-pop-2">
                          La mesas han sido agregadas exitosamente
                        </p>
                      </div>
                    </Modal.Body>
                  </Modal>

                  <div className="py-3 m_borbot ms-3 pe-3 me-3 ">
                    {Array.isArray(checkboxes) ? (
                      checkboxes.map((item, index) => (
                        // console.log(item),
                        <div key={item.id}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-nowrap">
                              <label className="d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="me-2 custom-checkbox"
                                  checked={selectedSectors?.includes(index)}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                                <p className="mb-0 j-tbl-font-4">{item.name}</p>
                              </label>
                            </div>
                            <div
                              className="text-white"
                              style={{ cursor: "pointer" }}
                              onClick={() => hundleEditDeletePop(item)}
                            >
                              <BsThreeDots className="j-tbl-dot-color" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No checkboxes available</p>
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{ flexGrow: "1", width: "min-content" }}
                className=" col-9 j-card-width2 j-table-position-second m-0 p-0"
              >
                <div className="m_bgblack j-tbl-font-5 j-block text-white">
                  <h6 className="mb-0">Mesas</h6>
                  <div>
                    <Button
                      className="j-blue-button b_btn_pop   j-tbl-font-3"
                      variant="primary"
                      onClick={handleShow1}
                    >
                      <FaPlus className="j-icon-font-1" />
                      Agregar mesa
                    </Button>
                    <Modal
                      show={show1}
                      onHide={handleClose1}
                      backdrop={true}
                      keyboard={false}
                      className="m_modal"
                    >
                      <Modal.Header closeButton className="m_borbot b_border_bb1">
                        <Modal.Title className="j-tbl-text-10">
                          Agregar mesa
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="border-0">
                        <div className="mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label j-tbl-font-11"
                          >
                            Sector
                          </label>
                          <select
                            className="form-select form-control j-table_input"
                            name="sectorName"
                            value={newTable.sectorName}
                            onChange={handleNewTableChange}
                          >
                            <option value="0">Seleccionar sector</option>
                            {sectors.map((sector) => (
                              <option key={sector.name} value={sector.id}>
                                {sector.name}
                              </option>
                            ))}
                          </select>
                          {addTableErrors.sectorName && (
                            <div className="text-danger errormessage">
                              {addTableErrors.sectorName}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label j-tbl-font-11"
                          >
                            Número de mesas nuevas
                          </label>
                          <input
                            type="text"
                            className="form-control j-table_input"
                            id="exampleFormControlInput1"
                            placeholder="5"
                            name="noOfTables"
                            value={newTable.noOfTables}
                            onChange={handleNewTableChange}
                          />
                          {addTableErrors.noOfTables && (
                            <div className="text-danger errormessage">
                              {addTableErrors.noOfTables}
                            </div>
                          )}
                        </div>
                      </Modal.Body>
                      <Modal.Footer className="border-0">
                        <Button
                          className="j-tbl-font-11 b_btn_pop "
                          variant="primary"
                          onClick={handleAddTableSubmit}
                        >
                          Agregar
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
                <Modal
                  // show={show16}
                  show={showDeleteOrderConfirm}
                  // onHide={handleClose16}
                  onHide={() => setShowDeleteOrderConfirm(false)}
                  backdrop={true}
                  keyboard={false}
                  className="m_modal jay-modal"
                >
                  <Modal.Header
                    closeButton
                    className="j-caja-border-bottom p-0 m-3 mb-0 pb-3" />


                  <Modal.Body className="border-0">
                    <div className="text-center">
                      <img

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
                      onClick={handleDeleteOrderConfirmation}
                    >
                      Si, seguro
                    </Button>
                    <Button
                      className="j-tbl-btn-font-1 "
                      variant="secondary"
                      // onClick={() => {
                      //   handleClose16();
                      // }}
                      onClick={() => setShowDeleteOrderConfirm(false)}
                    >
                      No, cancelar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <div className="j-show-table pb-3 ak-show-table">
                  <div className="j_tables_center ak-show-table">
                    <div
                      onClick={() => handleFilterChange("available")}
                      className="j-available-table d-flex align-items-center"
                    >
                      <div className="j-a-table" />
                      <p className="j-table-color j-tbl-font-6">Disponible</p>
                    </div>
                    <div
                      onClick={() => handleFilterChange("busy")}
                      className="j-busy-table d-flex align-items-center"
                    >
                      <div className="j-b-table" />
                      <p className="j-table-color  j-tbl-font-6">Ocupado</p>
                    </div>
                  </div>
                  <button
                    data-bs-theme="dark"
                    className="j-canvas-btn2 j-tbl-font-3  btn bj-btn-outline-primary"
                  >
                    <p
                      className="j-tbl-font-6 mb-0"
                      onClick={() => handleFilterChange("")}
                    >
                      Reiniciar
                    </p>
                  </button>
                </div>

                <div className="j-table-bgcolor row p-4">
                  {filteredTables().map((ele, index) => (
                    <div className="j-table-width" key={ele.id}>
                      <TableCard
                        isOffcanvasOpen={isOffcanvasOpen}
                        onShowAvailableModal={() =>
                          handleShowAvailableModal(ele.id,ele.table_no)}
                        onShowOcupadoModal={() => handleShowOcupadoModal(ele.id,ele.table_no)}
                        name={ele.name}
                        no={ele.id}
                        code={ele.code}
                        status={ele.status}
                        selectedTable={selectedTable}
                       
                        tId={ele.id}
                        tableId={ele.table_no}
                        userId={ele.user_id} // Access user_id from tableData
                        oId={ele.order_id}
                        selectedCards={selectedCards}
                        handleData={() => {
                          getTableData(ele.id);
                        }}
                        handleGet={() => {
                          // getPaymentData(ele.order_id);
                        }}
                        getUserName={getUserName}
                        setSelectedTable={setSelectedTable}
                        setTableStatus={setTableStatus}
                        tableColor={tableColor} // Pass the tableColor prop
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* {/ Edit family /} */}
        <Modal
          show={showEditFam}
          onHide={handleCloseEditFam}
          backdrop={true}
          keyboard={false}
          className="m_modal jay-modal"
        >
          <Modal.Header
            closeButton
            className="j-caja-border-bottom p-0 m-3 mb-0 pb-3"
          >
            <Modal.Title className="j-tbl-text-12">Editar sector</Modal.Title>
          </Modal.Header>
          <Modal.Body className="border-0">
            <div className="mb-3">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label j-tbl-btn-font-1"
              >
                Nombre
              </label>
              <input
                type="text"
                className="form-control j-table_input"
                id="exampleFormControlInput1"
                placeholder="Sector 1"
                defaultValue={selectedFamily.name}
                name="name"
                onChange={handleEditChange}
              />
              {editErrors.name && (
                <div className="text-danger errormessage">
                  {editErrors.name}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label j-tbl-btn-font-1"
              >
                Número de mesas
              </label>
              <input
                type="text"
                className="form-control j-table_input"
                id="exampleFormControlInput1"
                placeholder="10"
                name="noOfTables"
                defaultValue={selectedFamily.noOfTables}
                onChange={handleEditChange}
                disabled
              />
              {editErrors.noOfTables && (
                <div className="text-danger errormessage">
                  {editErrors.noOfTables}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button
              className="j-tbl-btn-font-1 b_btn_close  "
              variant="danger"
              onClick={() => {
                handleDeleteClick(selectedFamily.id);
              }}
            >
              Eliminar
            </Button>
            <Button
              className="j-tbl-btn-font-1 b_btn_pop"
              variant="primary"
              onClick={handleEditSubmit}
            >
              Guardar cambios
            </Button>
          </Modal.Footer>
        </Modal>
        {/* {/ edit family success /}  */}
        <Modal
          show={showEditFamSuc}
          onHide={handleCloseEditFamSuc}
          backdrop={true}
          keyboard={false}
          className="m_modal jay-modal"
        >
          <Modal.Header closeButton className="border-0" />
          <Modal.Body>
            <div className="text-center">
              <img src={require("../Image/check-circle.png")} alt="" />
              <p className="mb-0 mt-2 h6 j-tbl-pop-1">Cambios sector</p>
              <p className="opacity-75 j-tbl-pop-2">
                Se ha modificado exitosamente
              </p>
            </div>
          </Modal.Body>
        </Modal>
        {/* delete confirm */}
        <Modal
          show={showDeleteConfirm}
          onHide={() => setShowDeleteConfirm(false)}
          backdrop={true}
          keyboard={false}
          className="m_modal jay-modal"
        >
          <Modal.Header closeButton className="border-0" />
          <Modal.Body className="border-0">
            <div className="text-center">
              <img
                src={require("../Image/trash-outline-secondary.png")}
                alt=" "
              />
              <p className="mb-0 mt-3 h6">
                {" "}
                ¿Seguro deseas eliminar este Sector?
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 ">
            <Button
              className="j-tbl-btn-font-1 b_btn_close"
              variant="danger"
              onClick={handleDeleteConfirmation} // Confirm deletion
            >
              Sí, seguro
            </Button>
            <Button
              className="j-tbl-btn-font-1"
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)} // Cancel deletion
            >
              No, cancelar
            </Button>
          </Modal.Footer>
        </Modal>
        {/* {/ edit family eliminate /} */}
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
              <p className="mb-0 mt-3 h6 j-tbl-pop-1">Sector eliminado</p>
              <p className="opacity-75 j-tbl-pop-2">
                El sector ha sido eliminado correctamente
              </p>
            </div>
          </Modal.Body>
        </Modal>

        <Offcanvas
          placement="end"
          className="j-offcanvas"
          show={showAvailableModal}
          onHide={handleCloseAvailableModal}
        >
          <Offcanvas.Header closeButton className="j-close-btn">
            <Offcanvas.Title className="j-offcanvas-title text-white j-tbl-font-5">
              Mesa {selectedTabNo}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="j-canvas-buttons">
            <div className="j_offcanavs_button">
              <div className="d-flex align-items-center">
                <Link
                  to={`/table1?id=${selectedTable}&status=${tableStatus}`}
                  data-bs-theme="dark"
                  onClick={handleLinkClick}
                  className="j-canvas-btn j-tbl-font-3"
                >
                  <FaPlus className="j-icon-font-1" />
                  Empezar pedido
                </Link>
              </div>
              <button
                data-bs-theme="dark"
                className="j-canvas-btn2 j-tbl-font-3  btn bj-btn-outline-primary"
              >
                <div className="d-flex align-items-center">
                  <svg
                    className="j-canvas-btn-i"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                      clip-rule="evenodd"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Editar
                </div>
              </button>

              <button
                data-bs-theme="dark"
                className="j-canvas-btn2 btn bj-btn-outline-primary"
                onClick={handleInfoMesaClick}
              >
                <div className="d-flex align-items-center">
                  <svg
                    className="j-canvas-btn-i"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Información mesa
                </div>
              </button>
            </div>
            <div className="j-available-table d-flex align-items-center mt-3">
              <div className="j-a-table" />
              <p className="j-table-color j-tbl-btn-font-1">Disponible</p>
            </div>

            <div className="b-product-order text-center">
            <svg className="w-6 h-6 text-gray-800 dark:text-white mb-2" style={{color:"white"}} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z" clipRule="evenodd" />
                        </svg>
              <h6 className="h6-product-order text-white j-tbl-pop-1">
              Empezar Pedido
              </h6>
              <p className="p-product-order j-tbl-btn-font-1 ">
              Agregar producto para comenzar el pedido
              </p>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        <Offcanvas
          placement="end"
          className="j-offcanvas"
          show={showOcupadoModal}
          onHide={handleCloseOcupadoModal}
        >
          <Offcanvas.Header closeButton className="j-close-btn">
            <Offcanvas.Title className="j-offcanvas-title text-white j-tbl-font-5">
              Mesa {selectedTabNo}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="j-canvas-buttons">
            <div className="j_offcanavs_button">
              <div className="d-flex align-items-center">
                <Link
                  to={`/table1?id=${selectedTable}&status=${tableStatus}`}
                  data-bs-theme="dark"
                  className="j-canvas-btn j-tbl-font-3"
                >
                  <FaPlus className="j-icon-font-1" />
                  Agregar producto
                </Link>
              </div>
              <button
                data-bs-theme="dark"
                className="j-canvas-btn2 j-tbl-font-3 btn bj-btn-outline-primary"
                onClick={handleEditClick}
              >
                <div className="d-flex align-items-center">
                  {!isEditing && <svg
                    className="j-canvas-btn-i"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                      clip-rule="evenodd"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                      clip-rule="evenodd"
                    />
                  </svg>}
                  {isEditing ? "Guardar" : "Editar"}
                </div>
              </button>

              <Button
                className="j-canvas-btn2 j-tbl-font-3 j_secondary_delete"
                onClick={handleInfoMesaClick}
              >
                <div className="d-flex align-items-center">
                  <svg
                    className="j-canvas-btn-i"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Información mesa
                </div>
              </Button>
            </div>

            {isEditing ? (
              <div>
                <div className="j_Table_canvas_Time mt-3">
                  <div className="j-busy-table d-flex align-items-center">
                    <div className="j-b-table" />
                    <p className="j-table-color j-tbl-font-6">Ocupado</p>
                  </div>
                  <div className="b-date-time d-flex align-items-center j_date_time">
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
                    {tableData && tableData.length > 0 ? (
                      <ElapsedTimeDisplay createdAt={tableData[0].created_at} />
                    ) : (
                      <p className="mb-0 ms-2 me-3 text-white j-tbl-btn-font-1">
                        00 min 00 sg
                      </p>
                    )}
                  </div>
                </div>
                <div className="j-counter-price-data">
                  <h3 className="text-white mt-3 j-tbl-text-13">Datos</h3>
                  <div className="j-orders-inputs">
                    <div className="j-orders-code">
                      <label className="j-label-name text-white mb-2 j-tbl-btn-font-1">
                        Código pedido
                      </label>
                      <input
                        className="j-input-name j-table_input"
                        type="text"
                        placeholder="01234"
                        value={tableData[0]?.id}
                        readOnly
                      />
                    </div>
                    <div className="j-orders-code">
                      <label className="j-label-name d-block text-white mb-2 j-tbl-btn-font-1">
                        Personas
                      </label>
                      <input
                        className="j-input-name j-table_input w-100"
                        type="text"
                        placeholder="5"
                        value={tableData[0]?.person}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="j-counter-order">
                    <h3 className="text-white j-tbl-pop-1">Pedido </h3>
                    <div className={"j-counter-order-data"}>
                      {tableData.map((tableItem) =>
                        tableItem.items
                          .slice(0, showAll ? tableItem.items.length : 3)
                          .map((item, index) => {
                            const itemInfo = getItemInfo(item.item_id);
                            return (
                              <div
                                className="j-counter-order-border-fast j-counter-order-border-fast-margin"
                                key={`${tableItem.id}-${index}`}
                              >
                                <div className="j-counter-order-img">
                                  <div className="j_inquary_data">
                                    <img
                                      src={`${API}/images/${itemInfo.image}`}
                                      alt={itemInfo.name}
                                    />
                                    <h5 className="text-white mb-0 j-tbl-font-5">
                                      {itemInfo.name}
                                    </h5>
                                  </div>
                                  <div className="j_Table_price_quantity">
                                    <div className="j-counter-mix m-0">
                                      <button
                                        className="j-minus-count"
                                        onClick={() =>
                                          decrement(
                                            item.id,
                                            item.item_id,
                                            item.quantity,
                                            selectedTable
                                          )}
                                      >
                                        <FaMinus />
                                      </button>
                                      <h3> {item.quantity}</h3>
                                      <button
                                        className="j-plus-count"
                                        onClick={() =>
                                          increment(
                                            item.id,
                                            item.item_id,
                                            item.quantity,
                                            selectedTable
                                          )}
                                      >
                                        <FaPlus />
                                      </button>
                                    </div>
                                    <h4 className="text-white fw-semibold mb-0 j_last_width">
                                      ${Math.floor(item.amount)}
                                    </h4>
                                    <button
                                      className="j-delete-btn me-2 mb-0"
                                      onClick={() => handleDeleteOrderClick(item.id)}
                                    >
                                      <RiDeleteBin6Fill />
                                    </button>
                                  </div>
                                </div>
                                <div className="text-white j-order-count-why ">
                                  {item.notes ? (
                                    addNotes[index] ? (
                                      <form
                                        onSubmit={(e) =>
                                          handleSubmitNote(e, index, item.id)}
                                      >
                                        <span className="j-nota-blue">
                                          Nota:{" "}
                                        </span>
                                        <input
                                          className="j-note-input"
                                          type="text"
                                          defaultValue={item.notes || ""}
                                          autoFocus
                                          onBlur={(e) => handleSubmitNote(e, index, item.id)}    
                                        />
                                      </form>
                                    ) : (
                                      <span  className="j-nota-blue" onClick={() =>
                                        handleAddNoteClick(index)}
                                        style={{cursor: "pointer"}}>
                                        Nota: {item.notes}
                                      </span>
                                    )

                                  ) : (
                                    <div>
                                      {addNotes[index] ? (
                                        <form
                                          onSubmit={(e) =>
                                            handleSubmitNote(e, index, item.id)}
                                        >
                                          <span className="j-nota-blue">
                                            Nota:{" "}
                                          </span>
                                          <input
                                            className="j-note-input"
                                            type="text"
                                            defaultValue={item.notes || ""}
                                            autoFocus
                                            onBlur={(e) => handleSubmitNote(e, index, item.id)}
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
                          })
                      )}

                      {tableData[0]?.items.length >= 4 &&
                        <a
                          href="#"
                          onClick={handleShowMoreClick}
                          className="j-tbl-pop-2"
                        >
                          {showAll ? "Ver menos" : "Ver más"}
                        </a>
                      }
                    </div>
                    <div className="j-counter-total-2">
                      <h5 className="text-white j-tbl-text-15 ">Costo total</h5>
                      <div className="j-border-bottom32">
                        <div className="j-total-discount d-flex justify-content-between">
                          <p className="j-tbl-pop-2">Artículos</p>
                          <span className="text-white j-tbl-text-16">
                            {tableData.map((item) => (
                              <span key={item.id}>$ {item.order_total}</span>
                            ))}
                          </span>
                        </div>
                        <div className="j-total-discount mb-2 d-flex justify-content-between">
                          <p className="j-tbl-pop-2">Descuentos</p>
                          <span className="text-white j-tbl-text-16">
                            {tableData.map((item) => (
                              <span key={item.id}>$ {item.discount}</span>
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
                              $ {item.order_total - item.discount}
                            </span>
                          ))}
                        </span>
                      </div>
                      <div
                        onClick={handleEditSave}
                        className="btn w-100 j-btn-primary text-white j-tbl-btn-font-1"
                      >
                        Cobrar
                      </div>
                    </div>
                  </div>
                </div>


                <Modal
                  show={show18}
                  onHide={handleClose18}
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
            ) : (
              <div>
                <div className="j_canvas_table_date mt-3">
                  <div className="j-busy-table j-busy-table2 d-flex align-items-center">
                    <div className="j-b-table" />
                    <p className="j-table-color j-tbl-font-6">Ocupado</p>
                  </div>
                  <div className="b-date-time d-flex align-items-center j_canvas_date_time">
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
                    {tableData && tableData.length > 0 ? (
                      <ElapsedTimeDisplay createdAt={tableData[0].created_at} />
                    ) : (
                      <p className="mb-0 ms-2 me-3 text-white j-tbl-btn-font-1">
                        00 min 00 sg
                      </p>
                    )}
                    {/* <p className="mb-0 ms-2 me-3 text-white j-tbl-font-6">
                      {elapsedTime}
                    </p> */}
                  </div>
                </div>
                <div className="j-counter-price-data">
                  <h3 className="text-white mt-3 j-tbl-text-13">Datos</h3>
                  <div className="j-orders-inputs">
                    <div className="j-orders-code">
                      <label className="j-label-name text-white mb-2 j-tbl-btn-font-1">
                        Código pedido
                      </label>
                      <input
                        className="j-input-name j-table_input"
                        type="text"
                        placeholder="01234"
                        value={tableData[0]?.id}
                        readOnly
                      />
                    </div>
                    <div className="j-orders-code">
                      <label className="j-label-name d-block text-white mb-2 j-tbl-btn-font-1">
                        Personas
                      </label>
                      <input
                        className="j-input-name j-table_input w-100"
                        type="text"
                        placeholder="5"
                        value={tableData[0]?.person}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="j-counter-order">
                    <h3 className="text-white j-tbl-pop-1">Pedido</h3>
                    <div className={"j-counter-order-data"}>
                      {tableData.map((tableItem) =>
                        tableItem.items
                          .slice(0, showAll ? tableItem.items.length : 3)
                          .map((item, index) => {
                            const itemInfo = getItemInfo(item.item_id);
                            return (
                              <div
                                className="j-counter-order-border-fast j-counter-order-border-fast-margin"
                                key={`${tableItem.id}-${index}`}
                              >
                                <div className="j-counter-order-img">
                                  <div className="j_inquary_data">
                                    <img
                                      src={`${API}/images/${itemInfo.image}`}
                                      alt={itemInfo.name}
                                    />
                                    <h5 className="text-white mb-0 j-tbl-font-5">
                                      {itemInfo.name}
                                    </h5>
                                  </div>
                                  <div className="j_Table_price_quantity">
                                    <p className="text-white fw-semibold mb-0">
                                      {item.quantity}
                                    </p>
                                    <h4 className="text-white fw-semibold mb-0">
                                      ${Math.floor(item.amount)}
                                    </h4>
                                  </div>
                                </div>
                                <div className="text-white j-order-count-why">
                                  {item.notes ? (
                                    addNotes[index] ? (
                                      <form
                                        onSubmit={(e) =>
                                          handleSubmitNote(e, index, item.id)}
                                        onBlur={(e) => handleSubmitNote(e, index, item.id)}
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
                                      <span className="j-nota-blue" onClick={() =>
                                        handleAddNoteClick(index)}
                                        style={{cursor: "pointer"}}>
                                        Nota: {item.notes}
                                      </span>
                                    )
                                  ) : (
                                    <div>
                                      {addNotes[index] ? (
                                        <form
                                          onSubmit={(e) =>
                                            handleSubmitNote(e, index, item.id)}
                                          onBlur={(e) => handleSubmitNote(e, index, item.id)}
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
                          })
                      )}
                      {tableData[0]?.items.length >= 4 &&
                        <a
                          href="#"
                          onClick={handleShowMoreClick}
                          className="j-tbl-pop-2"
                        >
                          {showAll ? "Ver menos" : "Ver más"}
                        </a>
                      }
                    </div>
                    <div className="j-counter-total-2">
                      <h5 className="text-white j-tbl-text-15 ">Costo total</h5>
                      <div className="j-border-bottom32">
                        <div className="j-total-discount d-flex justify-content-between">
                          <p className="j-tbl-pop-2">Artículos</p>
                          <span className="text-white j-tbl-text-16">
                            {tableData.map((item) => (
                              <span key={item.id}>$ {item.order_total}</span>
                            ))}
                          </span>
                        </div>
                        <div className="j-total-discount mb-2 d-flex justify-content-between">
                          <p className="j-tbl-pop-2">Descuentos</p>
                          <span className="text-white j-tbl-text-16">
                            {tableData.map((item) => (
                              <span key={item.id}>$ {item.discount}</span>
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
                              $ {item.order_total - item.discount}
                            </span>
                          ))}
                        </span>
                      </div>
                      <div
                        className="btn w-100 j-btn-primary text-white j-tbl-btn-font-1 mb-3"
                        onClick={handleCobrarClcik}
                      >
                        Cobrar
                      </div>
                      <div
                        onClick={handleShow250}
                        className="btn j_table_print w-100 j-tbl-btn-font-1"
                      >
                        Imprimir precuenta
                      </div>
                      <Modal
                        show={show250}
                        onHide={handleClose250}
                        backdrop="static"
                        keyboard={false}
                        className="jay_TableRecipt"
                      >
                        <Modal.Header closeButton className="border-0" />
                        <Modal.Body className="border-0">
                          <TableRecipt
                            payment={paymentData}
                            tableData={tableData}
                            productData={obj1}
                          />
                        </Modal.Body>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </div>
      {/* processing */}
      <Modal
        show={isProcessing}
        keyboard={false}
        backdrop={true}
        className="m_modal  m_user "
      >
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status" style={{ height: '85px', width: '85px', borderWidth: '6px' }} />
          <p className="mt-2">Procesando solicitud...</p>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Tables;
