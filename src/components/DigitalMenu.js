import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Sidenav from "./Sidenav";
import { BsThreeDots } from "react-icons/bs";

import img2 from "../Image/addmenu.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SingleMenu from "./SingleMenu";
import { Badge, Spinner } from "react-bootstrap";
import { IoMdInformationCircle } from "react-icons/io";
import axios from "axios";
import Loader from "./Loader";
import useAudioManager from "./audioManager";
//import { enqueueSnackbar  } from "notistack";

export default function Articles() {
  const API = process.env.REACT_APP_IMAGE_URL; // Laravel Image URL
  const apiUrl = process.env.REACT_APP_API_URL;
  const [token] = useState(localStorage.getItem("token"));
  const [role]= useState(localStorage.getItem("role"));
  const admin_id=localStorage.getItem("admin_id");
  const [createMenuError, setCreateMenuError] = useState("");
  const [editMenuError, setEditMenuError] = useState("");
  const [menuName, setmenuName] = useState("");
  const [menu, setMenu] = useState([]);
  const [item, setItem] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [parentCheck, setParentCheck] = useState([]);
  const [childCheck, setChildCheck] = useState([]);
  const [obj1, setObj1] = useState([]);
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filteredItems, setFilteredItems] = useState([]); // State to hold filtered items
  const [filteredMenuItems, setFilteredMenuItems] = useState([]); // State to hold filtered items
  const [searchTerm, setSearchTerm] = useState(""); // State to hold search term
  const [selectedParentNames, setSelectedParentNames] = useState([]); // State to hold selected parent names
  const [selectedItemsMenu, setSelectedItemsMenu] = useState(new Set());
  const [previousFilteredItems, setPreviousFilteredItems] = useState([]);
  const { playNotificationSound } = useAudioManager();
  const location = useLocation();

  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate()
  /*  const [ filteredItems, setFilteredItems ] = useState([]); // State to hold filtered items */
  const [searchTermMenu, setSearchTermMenu] = useState(""); // State to hold search term
  const [filteredItemsMenu, setFilteredItemsMenu] = useState(obj1);
  const [menuId, setMenuId] = useState(null);
  const [itemId, setItemId] = useState([]);

  // Add product
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => { 
    // console.log("close");
   setSelectedItemsCount(0);
   setItemId([]); 
   setSelectedMenus([]);
   setItemId([]);
   setMenuId(null); 
   setShow1(false);
  };
  const handleShow1 = () => {
    setShow1(true);
    setCount(0);
  };

  // create family
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setCreateMenuError("");
    setmenuName(""); // Reset the input field
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

  // edit family
  const [showEditFam, setShowEditFam] = useState(false);
  const handleCloseEditFam = () => {
    setShowEditFam(false);
    setEditMenuError("");
  };

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

  // add product success
  const [show1AddMenuSuc, setShow1AddMenuSuc] = useState(false);
  const handleClose1AddMenuSuc = () => setShow1AddMenuSuc(false);
  const handleShow1AddMenuSuc = () => {
    setShow1AddMenuSuc(true);
    setTimeout(() => {
      setSelectedMenus([]);
      setItemId([]);
      setMenuId(null);
      // fetchMenuData(); 
      fetchMenuItemData();
      fetchAllItems();
      setShow1AddMenuSuc(false);
    }, 2000);
  };

  // file upload function
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const img = new Image();
      img.onload = () => {
        if (img.width > 800 || img.height > 400) {
          setErrorMessage("Image dimensions should be at most 800x400 pixels");
          setSelectedFile(null);
        } else {
          setErrorMessage(null);
          setSelectedFile(file);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const [showRetirar, setShowRetirar] = useState(false);
  // const handleRetirar = (index) => {
  //   setItems(items.filter((_, i) => i !== index));
  // };
  const [show500, setShow500] = useState(false);
  const handleclose500 = () => setShow500(false);

  const [count, setCount] = useState(0);

  const handleAddClick = () => {
    setCount(count + 1);
  };

  const isCategorySelected = (category) => {
    return (
      selectedCategories.length === 0 || selectedCategories.includes(category)
    );
  };

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (menu) => {
    if (selectedCategories.includes(menu)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== menu));
    } else {
      setSelectedCategories([...selectedCategories, menu]);
    }
  };
  // const handleCheckboxChange = (category) => {
  //   setSelectedMenu(category);
  //   if (selectedCategories.includes(category)) {
  //     setSelectedCategories(selectedCategories.filter(cat => cat !== category));
  //   } else {
  //     setSelectedCategories([...selectedCategories, category]);
  //   }
  // };
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // ********************************************API*************************
  // Function to handle adding an item
  const handleAddItem = (item) => {
    if (!selectedItemsMenu.has(item)) {
      // Add item if it's not already selected
      setSelectedItemsMenu(new Set(selectedItemsMenu).add(item));
      setSelectedItemsCount(selectedItemsCount + 1);
      setItemId((prevArray) => [...prevArray, item]);

      // Perform any other action here when adding an item
      console.log(`Added item ${item}`);
    } else {
      // Remove item if it's already selected
      const updatedSelectedItemsMenu = new Set(selectedItemsMenu);
      updatedSelectedItemsMenu.delete(item);
      setSelectedItemsMenu(updatedSelectedItemsMenu);
      setSelectedItemsCount(selectedItemsCount - 1);
      setItemId((prevArray) => prevArray.filter((i) => i !== item));

      // Perform any other action here when removing an item
      console.log(`Removed item ${item}`);
    }
  };

  const handleShowEditFam = (menu) => {
    setSelectedMenu(menu);
    setShowEditFam(true);
  };

  // get menu
  const fetchMenuData = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${apiUrl}/menu/get`, {admin_id: admin_id},{headers:{Authorization:`Bearer ${token}`}});
      setMenu(response.data.menus);
      /* console.log(response.data.menus); */
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
  };

  // get menu item
  const fetchMenuItemData = async () => {
    try {
      const response = await axios.post(`${apiUrl}/menu/get`, {admin_id: admin_id},{headers:{Authorization:`Bearer ${token}`}});
      setItem(response.data.menus);
      setFilteredItems(response.data.menus);
      /* console.log(response.data.menus); */
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // handle change data
  const handleChangeData = (menu) => {
    const updatedSelectedMenus = selectedMenus.includes(menu)
      ? selectedMenus.filter((selected) => selected !== menu)
      : [...selectedMenus, menu];

    setSelectedMenus(updatedSelectedMenus);

    if (updatedSelectedMenus.length > 0) {
      const updatedItems = updatedSelectedMenus.flatMap((menu) => menu.items);
      setItems(updatedItems);
    } else {
      setItems(item.flatMap((menu) => menu.items));
    }
  };
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    if (searchTerm.trim() === "") {
      setFilteredItems(item); // Reset to all items if search is empty
    } else {
      const filteredResults = item
        .map((menu) => {
          const filteredItems = menu.items.filter(
            (ele) =>
              ele.name.toLowerCase().includes(searchTerm) || // Search by name
              menu.name.toLowerCase().includes(searchTerm) || // Search by menu name
              ele.code.toLowerCase().includes(searchTerm) // {{ edit_1 }}: Added search by code
          );
          return {
            ...menu,
            items: filteredItems
          };
        })
        .filter(
          (menu) =>
            menu.items.length > 0 ||
            menu.name.toLowerCase().includes(searchTerm)
        );

      setFilteredItems(filteredResults);
    }
  };
  // get family
  const fetchFamilyData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/family/getFamily`,{headers:{Authorization:`Bearer ${token}`}});
      setParentCheck(response.data);
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
      const response = await axios.get(`${apiUrl}/subfamily/getSubFamily`,{headers:{Authorization:`Bearer ${token}`}});
      setChildCheck(response.data);
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // get product
  const fetchAllItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/item/getAll`,{headers:{Authorization:`Bearer ${token}`}});
      setObj1(response.data.items);
      setFilteredMenuItems(response.data.items);
      setFilteredItemsMenu(response.data.items);
    } catch (error) {
      console.error(
        "Error fetching items:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const [famName, setFamName] = useState("");
  // const [checkedParents, setCheckedParents] = useState({});
  const [checkedParents, setCheckedParents] = useState(
    parentCheck.reduce((acc, family) => ({ ...acc, [family.id]: true }), {})
  );
  const handleParentChange = (parentId) => {
    setCheckedParents((prevState) => ({
      ...prevState,
      [parentId]: !prevState[parentId]
    }));
  };

  useEffect(() => {
    if (!(role == "admin" || role == "cashier" || role == "waitress")) {
      navigate('/dashboard')
    } else {
      if (token) {
        setSelectedMenus([]);
        setItemId([]);
        setMenuId(null);
        fetchMenuData();
        fetchMenuItemData();
        fetchFamilyData();
        fetchSubFamilyData();
        fetchAllItems();
      }
    }
  }, [role, token,show1AddMenuSuc]);

  // create menu
  const handleCreateMenu = async () => {
    // Reset error message
    setCreateMenuError("");

    // Validate menu name
    if (!menuName.trim()) {
      setCreateMenuError("El nombre del menú no puede estar vacío");
      return;
    }

    // Close the modal first
    handleClose();

    // Show loader
    setIsProcessing(true);

    // Proceed with API call if validation passes
    try {
      const response = await axios.post(
        `${apiUrl}/menu/create`,
        { name: menuName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          maxBodyLength: Infinity
        }
      );
      console.log(response.data, "create menu");
      handleShowCreSuc();
      fetchMenuData();
      if (response.data && response.data.notification) {
        //enqueueSnackbar (response.data.notification, { variant: 'success' });
        // playNotificationSound();;
      } else {
        //enqueueSnackbar (`Menú ${menuName} creado exitosamente`, { variant: 'success' });
      // playNotificationSound();;

      }
    } catch (error) {
      console.error(
        "Error creating menu:",
        error.response ? error.response.data : error.message
      );
      setCreateMenuError(
        "Error al crear el menú. Por favor, inténtelo de nuevo."
      );
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;
    } finally {
      setIsProcessing(false);
    }
  };

  // EDIT MENU
  const handleSaveEditFam = async () => {
    setEditMenuError("");

    if (!selectedMenu.name.trim()) {
      setEditMenuError("El nombre del menú no puede estar vacío");
      return;
    }

    handleCloseEditFam(); // Close the modal first

    setIsProcessing(true); // Then show the loader
    try {
      const response = await axios.post(
        `${apiUrl}/menu/update/${selectedMenu.id}`,
        { name: selectedMenu.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          maxBodyLength: Infinity
        }
      );
      console.log(response.data, "update menu");

      // Update the menu state
      setMenu((prevMenu) =>
        prevMenu.map(
          (m) =>
            m.id === selectedMenu.id ? { ...m, name: selectedMenu.name } : m
        )
      );

      // Update the filteredItems state
      setFilteredItems((prevItems) =>
        prevItems.map(
          (item) =>
            item.id === selectedMenu.id
              ? { ...item, name: selectedMenu.name }
              : item
        )
      );

      // Update the item state (which is used for search)
      setItem((prevItem) =>
        prevItem.map(
          (i) =>
            i.id === selectedMenu.id ? { ...i, name: selectedMenu.name } : i
        )
      );

       handleShowEditFamSuc();
      if (response.data && response.data.notification) {
        //enqueueSnackbar (response.data.notification, { variant: 'success' });
        // playNotificationSound();;
      } else {
        //enqueueSnackbar (`El menú ${selectedMenu.name} ha sido actualizado con éxito`, { variant: 'success' });
      // playNotificationSound();;

      }
    } catch (error) {
      console.error(
        "Error updating menu:",
        error.response ? error.response.data : error.message
      );
      setEditMenuError(
        "Error al actualizar el menú. Por favor, inténtelo de nuevo."
      );
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;
    } finally {
      setIsProcessing(false);
    }
  };
  // delete menu
  // const handleDeleteFam = async () => {
  //   await axios
  //     .delete(`${apiUrl}/menu/delete/${selectedMenu.id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json"
  //       },
  //       maxBodyLength: Infinity
  //     })
  //     .then(function(response) {
  //       console.log(response.data, "delete menu");
  //       handleShowEditFamDel();
  //       handleCloseEditFam();
  //       fetchMenuData();
  //     })
  //     .catch(function(error) {
  //       console.error(
  //         "Error deleting menu:",
  //         error.response ? error.response.data : error.message
  //       );
  //     });
  // };

  /* add menu */
  // const handleAddMenu = async () => {
  //   try {
  //     handleClose1(); // Close the modal first
  //     setIsProcessing(true); // Then show the loader

  //     const response = await axios.post(
  //       `${apiUrl}/item/addToMenu`,
  //       {
  //         item_ids: itemId,
  //         menu_id: menuId
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json"
  //         },
  //         maxBodyLength: Infinity
  //       }
  //     );

  //     console.log("API Response:", response.data);

  //     if (response.data.success) {
  //       // Handle UI updates
  //       handleShow1AddMenuSuc();

  //       // Clear item IDs
  //       setItemId([]);

  //       window.location.reload();
  //       if (response.data && response.data.notification) {
  //         //enqueueSnackbar (response.data.notification, { variant: 'success' });
  //         // playNotificationSound();;
  //       } else {
  //         //enqueueSnackbar (`Elementos añadidos al menú con éxito`, { variant: 'success' });
  //         // playNotificationSound();;
  //       }
  //     } else {
  //       console.error("Failed to add items to menu");
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error adding items to menu:",
  //       error.response ? error.response.data : error.message
  //     );
  //     //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
  //     // playNotificationSound();;
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };
  const handleAddMenu = async () => {
    try {
      handleClose1(); // Close the modal first
      setIsProcessing(true); // Then show the loader
  
      const response = await axios.post(
        `${apiUrl}/item/addToMenu`,
        {
          item_ids: itemId,
          menu_id: menuId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          maxBodyLength: Infinity
        }
      );
  
      console.log("API Response:", response.data);
  
      if (response.data.success) {
        // Handle UI updates
        handleShow1AddMenuSuc();
  
        // Update the menu state directly
        setMenu(prevMenu => {
          const updatedMenu = prevMenu.map(menu => {
            if (menu.id === menuId) {
              // Find the newly added items
              const newItems = obj1.filter(item => itemId.includes(item.id));
              // Add the new items to the menu
              return {
                ...menu,
                items: [...menu.items, ...newItems]
              };
            }
            return menu;
          });
          console.log('Updated menu:', updatedMenu);
          return updatedMenu;
        });
  
        // Update filteredItems state
        setFilteredItems(prevFilteredItems => {
          const updatedFilteredItems = prevFilteredItems.map(menu => {
            if (menu.id === menuId) {
              const newItems = obj1.filter(item => itemId.includes(item.id));
              return {
                ...menu,
                items: [...menu.items, ...newItems]
              };
            }
            return menu;
          });
          console.log('Updated filteredItems:', updatedFilteredItems);
          return updatedFilteredItems;
        });
  
        // Show all menus by clearing the selectedMenus
        setSelectedMenus([]);
  
        // Clear item IDs
        setItemId([]);
  
        if (response.data && response.data.notification) {
          //enqueueSnackbar (response.data.notification, { variant: 'success' });
        } else {
          //enqueueSnackbar (`Elementos añadidos al menú con éxito`, { variant: 'success' });
        }
        // playNotificationSound();;
      } else {
        console.error("Failed to add items to menu");
      }
    } catch (error) {
      console.error(
        "Error adding items to menu:",
        error.response ? error.response.data : error.message
      );
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;
    } finally {
      setIsProcessing(false);
    }
  };

  const filterItems = (searchTerm, checkedParents, childCheck) => {
    return obj1.filter((item) => {
      const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()); 
      const matchesCheckbox =
        checkedParents[item.family_id] ||
        (childCheck &&
          Object.keys(childCheck).some(
            (key) =>
              Array.isArray(childCheck[key]) &&
              childCheck[key].some(
                (child) =>
                  child.id === item.child_id &&
                  child.family_name === item.family.name
              )
          ));

      return (
        matchesSearch &&
        (Object.keys(checkedParents).every((key) => !checkedParents[key]) ||
          matchesCheckbox)
      );
    });
  };
  const handleSearchMenu = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTermMenu(term);
    setFilteredItemsMenu(filterItems(term, checkedParents, childCheck));
  };

  const handleParentChangeMenu = (parentId) => {
    const newCheckedParents = {
      ...checkedParents,
      [parentId]: !checkedParents[parentId]
    };
    setCheckedParents(newCheckedParents);

    // Update selected parent names
    const parentItem = parentCheck.find((item) => item.id === parentId);
    if (parentItem) {
      if (newCheckedParents[parentId]) {
        // Add the parent name if checked
        setSelectedParentNames((prev) => [...prev, parentItem.name]);
      } else {
        // Remove the parent name if unchecked
        setSelectedParentNames((prev) =>
          prev.filter((name) => name !== parentItem.name)
        );
      }
    }

    // Update filtered items based on checked parents
    const updatedFilteredItems = filterItems(
      searchTermMenu,
      newCheckedParents,
      childCheck
    );
    setFilteredItemsMenu(updatedFilteredItems);
  };
  // New function to handle child checkbox changes
  const handleChildCheckboxChange = (childId) => {
    // Check if items are available

    const selectedChildItems = obj1.filter(
      (item) => item.sub_family_id === childId
    );

    // If the child is checked, show its items and save the current items to previousFilteredItems
    if (selectedItems.has(childId)) {
      setPreviousFilteredItems(filteredItemsMenu); // Save current items
      setFilteredItemsMenu(selectedChildItems);
    } else {
      // If unchecked, restore previous items
      setFilteredItemsMenu(previousFilteredItems);
    }
  };
  // Update the checkbox change logic to toggle the selected state
  const toggleChildSelection = (childId) => {
    if (selectedItems.has(childId)) {
      selectedItems.delete(childId);
    } else {
      selectedItems.add(childId);
    }
    handleChildCheckboxChange(childId);
  };

  const [removedItems, setRemovedItems] = useState([]);

  const handleshow500 = (menuId, itemId) => {
    setRemovedItems((prevRemovedItems) => [
      ...prevRemovedItems,
      { menuId, itemId }
    ]);
    setShow500(true);
    setTimeout(() => {
      setShow500(false);
    }, 2000);
  };
  useEffect(() => {
    // Load removed items from local storage
    const storedRemovedItems = localStorage.getItem("removedItems");
    if (storedRemovedItems) {
      setRemovedItems(JSON.parse(storedRemovedItems));
    }
  }, []);

  useEffect(
    () => {
      // Save removed items to local storage
      localStorage.setItem("removedItems", JSON.stringify(removedItems));
    },
    [removedItems]
  );
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("removedItems");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // detele
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const handleDeleteFam = () => {
    setShowDeleteConfirmation(true);
  };

  // delete menuitems

  const confirmDeleteFam = async () => {
    handleCloseEditFam(); // Close the modal first
    setIsProcessing(true); // Then show the loader
    try {
      const response = await axios.delete(
        `${apiUrl}/menu/delete/${selectedMenu.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          maxBodyLength: Infinity
        }
      );
      console.log(response.data, "delete menu");

      // Update state to remove the deleted menu
      setMenu(prevMenu => prevMenu.filter(m => m.id !== selectedMenu.id));
      setFilteredItems(prevItems => prevItems.filter(m => m.id !== selectedMenu.id));
      setSelectedMenus(prevSelected => prevSelected.filter(m => m.id !== selectedMenu.id));

      handleShowEditFamDel();
      setShowDeleteConfirmation(false);
      if (response.data && response.data.notification) {
        //enqueueSnackbar (response.data.notification, { variant: 'success' });
        // playNotificationSound();;
      } else {
        //enqueueSnackbar (`El menú ${selectedMenu.name} ha sido eliminado con éxito`, { variant: 'success' });
        // playNotificationSound();;
      }
    } catch (error) {
      console.error(
        "Error deleting menu:",
        error.response ? error.response.data : error.message
      );
      if(error.response.data){

        //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
        // playNotificationSound();;
      }
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(()=>{
    if(!showRetirar){
        //  console.log("update");
      setSelectedMenus([]);
      setItemId([]);
      setMenuId(null);
      fetchMenuData(); 
      fetchMenuItemData();
      fetchAllItems();
    }
  },[showRetirar])

  const handlesaveEdit = () => {
    if(showRetirar){
      setSelectedMenus([]);
      setItemId([]);
    }
    setShowRetirar(!showRetirar)
  }
  return (
    <div className="m_bg_black">
      <Header />
      <div className="d-flex">
        <div>
          <Sidenav />
        </div>
        <div className=" flex-grow-1 sidebar">

          <div>
            <div className="p-3 m_bgblack text-white m_borbot jay-table-fixed-kya">
              <h5 className="mb-0 m18">Menú digital</h5>
            </div>

            <div className="row ">
              <div className="col-sm-2 col-4 m_bgblack   m-0 p-0  m_borrig " style={{ minHeight: "100vh" }}>
                <div className="j-articals-sticky">
                  <div className="ms-3 pe-3 mt-2 j-table-position-sticky">
                    <div className="m_borbot ">
                      <div>
                        <div>
                          <p className="text-white  my-2 m14">Menús</p>
                        </div>
                        <div>
                          <div>
                            <button
                              className="btn mb-3 text-white m12 j-btn-primary"
                              onClick={handleShow}
                            >
                              + Crear menú
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* CRAETE product */}
                  {/* .............................BRIJESH ............................... */}
                  <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop={true}
                    keyboard={false}
                    className="m_modal"
                  >
                    <Modal.Header
                      closeButton
                      className="m_borbot b_border_bb mx-3 ps-0"
                    >
                      <Modal.Title>
                        <Link className="text-white text-decoration-none ">
                          Crear menú
                        </Link>{" "}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="border-0 pb-0">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                          Nombre
                        </label>
                        <input
                          type="text"
                          className="form-control m_input ps-3"
                          id="exampleFormControlInput1"
                          placeholder="Eje.Desayuno"
                          onChange={(e) => {
                            setmenuName(e.target.value);
                            if (createMenuError) setCreateMenuError("");
                          }}
                        />
                        {createMenuError && (
                          <div className="text-danger errormessage">
                            {createMenuError}
                          </div>
                        )}
                      </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                      <Button
                        variant="primary"
                        className="b_btn_pop"
                        onClick={() => {
                          handleCreateMenu();
                        }}
                      >
                        Crear
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  {/* .............................BRIJESH ............................... */}
                  {/* product success */}
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
                        <img
                          src={require("../Image/check-circle.png")}
                          alt=""
                        />
                        <p className="mb-0 mt-2 h6">Menú</p>
                        <p className="opacity-75">Creado exitosamente</p>
                      </div>
                    </Modal.Body>
                  </Modal>
                  <div className="py-3 m_borbot mx-3  m14 j-table-position-sticky-sector">
                    {menu.map((item, index) => (
                      <div key={item.id}>
                        <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                          <div className="d-flex align-items-center flex-grow-1">
                           
                              <input
                                type="checkbox"
                                className="me-2 custom-checkbox"
                                checked={selectedMenus.includes(item)}
                                onChange={() => {
                                  handleChangeData(item);
                                  setMenuId(item.id);
                                }}
                              />
                              <p className="text-white mb-0 text-wrap">{item.name}</p>
                           
                          </div>
                          { (role == "admin" || role == "cashier") &&
                          <div
                            className="text-white ms-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleShowEditFam(item)}
                          >
                            <BsThreeDots className="j-tbl-dot-color" />
                          </div>
                          }
                        </div>
                      </div>
                    ))}

                    {/* Edit product */}
                    {/* ................. BRIJESh................................ */}
                    <Modal
                      show={showEditFam}
                      onHide={handleCloseEditFam}
                      backdrop={true}
                      keyboard={false}
                      className="m_modal"
                    >
                      <Modal.Header
                        closeButton
                        className="m_borbot b_border_bb mx-3 ps-0"
                      >
                        <Modal.Title>
                          <Link
                            className="text-white text-decoration-none"
                            to="/singleatricleproduct"
                          >
                            Editar menú
                          </Link>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="border-0 pb-0">
                        <div className="mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Nombre
                          </label>
                          <input
                            type="text"
                            className="form-control m_input ps-3"
                            id="exampleFormControlInput1"
                            placeholder="Desayuno"
                            value={selectedMenu ? selectedMenu.name : ""}
                            onChange={(e) => {
                              setSelectedMenu({
                                ...selectedMenu,
                                name: e.target.value
                              });
                              if (editMenuError) setEditMenuError("");
                            }}
                          />
                          {editMenuError && (
                            <div className="text-danger errormessage">
                              {editMenuError}
                            </div>
                          )}
                        </div>
                      </Modal.Body>
                      <Modal.Footer className="border-0 pb-4 pt-2 ">
                        <Button
                          variant="danger"
                          className="b_btn_close"
                          onClick={() => {
                            handleCloseEditFam();
                            handleDeleteFam();
                          }}
                        >
                          Eliminar
                        </Button>
                        <Button
                          variant="primary"
                          className="b_btn_pop"
                          onClick={() => {
                            handleSaveEditFam();
                          }}
                        >
                          Guardar cambios
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    {/* ................. BRIJESh................................ */}
                    {/* delete confime message */}

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
                          onClick={confirmDeleteFam}
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
                    {/* edit product success  */}
                    <Modal
                      show={showEditFamSuc}
                      onHide={handleCloseEditFamSuc}
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
                          <p className="mb-0 mt-2 h6">Familia</p>
                          <p className="opacity-75">
                            Ha sido modificada exitosamente
                          </p>
                        </div>
                      </Modal.Body>
                    </Modal>
                    {/* edit product eliminate  */}
                    <Modal
                      show={showEditFamDel}
                      onHide={handleCloseEditFamDel}
                      backdrop={true}
                      keyboard={false}
                      className="m_modal"
                    >
                      <Modal.Header closeButton className="border-0" />
                      <Modal.Body>
                        <div className="text-center">
                          <img
                            src={require("../Image/trash-check 1.png")}
                            alt=""
                          />
                          <p className="mb-0 mt-2 h6">Menú</p>
                          <p className="opacity-75">
                            Se ha eliminado con éxito
                          </p>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                </div>
              </div>
              <div className="col-sm-10 col-8 m-0 p-0">
                <div className="p-3 m_bgblack  text-white  flex-wrap">
                  <div className="mb-3">
                    <h6 className="mb-0 ">Entradas</h6>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between m_property">
                      <div className="me-2">
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
                              id="search"
                              value={searchTerm}
                              onChange={handleSearch}
                            />
                          </div>
                        </div>
                      </div>
                      {
                          (role == "admin" || role == "cashier") && 
                      <div>
                        <button
                          className="btn j-btn-primary j_editor_menu text-white text-nowrap m12 me-2"
                          onClick={handlesaveEdit}
                        >
                          {showRetirar ? "Guardar"  : "+ Editar"}
                        </button>
                        {(selectedMenus.length == 1 && !showRetirar)  && 
                            <button
                              className="btn j-btn-primary text-white text-nowrap m12 "
                              onClick={handleShow1}
                            >
                              + Agregar
                            </button>
                          }
                      </div>
                        }
                    </div>
                    {/* add product*/}

                    <Modal
                      show={show1}
                      onHide={handleClose1}
                      backdrop={true}
                      keyboard={false}
                      className="m_modal jm-modal_jjjj m1"
                    >
                      <Modal.Header
                        closeButton
                        className="m_borbot"
                        style={{ backgroundColor: "#111928" }}
                      >
                        <Modal.Title className="m18">
                          Agregar artículos
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body
                        className="border-0 p-0"
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
                                  <p className="text-white m14 my-2">
                                    Familias y subfamilias
                                  </p>
                                </div>
                              </div>

                              <div className="py-3 m_borbot mx-3  m14 ">
                                {Array.isArray(parentCheck) &&
                                  parentCheck.map((parentItem) => (
                                    <div key={parentItem.id}>
                                      <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                                        <div className="text-nowrap">
                                          <label>
                                            <input
                                              type="checkbox"
                                              checked={
                                                !!checkedParents[
                                                parentItem.id
                                                ]
                                              }
                                              onChange={() =>
                                                handleParentChangeMenu(
                                                  parentItem.id
                                                )}
                                              className="me-2 custom-checkbox"
                                            />
                                            <span className="text-white">
                                              {parentItem.name}
                                            </span>
                                          </label>
                                        </div>
                                      </div>

                                      {checkedParents[parentItem.id] && (
                                        <div style={{ marginLeft: "20px" }}>
                                          {Array.isArray(childCheck) &&
                                            childCheck
                                              .filter(
                                                (childItem) =>
                                                  childItem.family_name ===
                                                  parentItem.name
                                              )
                                              .map((childItem) => (
                                                <div key={childItem.id}>
                                                  <div className="d-flex align-content-center justify-content-between my-2 m14">
                                                    <div>
                                                      <label className="text-white">
                                                        <input
                                                          type="checkbox"
                                                          className="mx-2 custom-checkbox"
                                                          onChange={() => {
                                                            toggleChildSelection(
                                                              childItem.id
                                                            );
                                                          }}
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
                                <h6>
                                  {selectedParentNames.length > 0 && (
                                    <div className="selected-parents-list ">
                                      {selectedParentNames.join(" , ")}
                                    </div>
                                  )}
                                </h6>
                              </div>
                              <div>
                                <div className="m_property">
                                  <div className="me-2">
                                    <div className="m_margin_bottom">
                                      <div className="m_group ">
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
                              {filteredItemsMenu.length > 0 ? (
                                filteredItemsMenu
                                  .filter(ele =>
                                    !selectedMenus[0]?.items.some(item => item.id === ele.id)
                                  )
                                  .map((ele, index) => {
                                    const isAdded = itemId.length > 0 ? itemId.some((item) => item == ele.id) : false;
                                    // console.log(isAdded);
                                    return (
                                      <div
                                        className="col-md-4 col-xl-3 col-sm-6 col-12 g-3"
                                        key={ele.id} // Corrected from 'keys' to 'key'
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
                                              <h6 className="card-title">
                                                {ele.name}
                                              </h6>
                                              <h6 className="card-title">
                                                ${ele.sale_price}
                                              </h6>
                                              <p className="card-text opacity-50">
                                                Codigo: {ele.code}
                                              </p>
                                              <div
                                                style={{ backgroundColor: isAdded ? "#063f93" : "#0d6efd" }}
                                                onClick={() =>
                                                  handleAddItem(ele.id)}
                                                className="btn w-100 btn-primary text-white"

                                              >
                                                <Link
                                                  className="text-white text-decoration-none"
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  <span className="ms-1">
                                                    {isAdded ? 'Agregado' : 'Agregar al menú'}
                                                  </span>
                                                </Link>
                                              </div>
                                            </div>
                                            <div
                                              className="position-absolute"
                                              style={{ cursor: "pointer" }}
                                            >
                                              <Link
                                                to={`/articles/singleatricleproduct/${ele.id}`}
                                                state={{ from: location.pathname }}
                                                className="text-white text-decoration-none"
                                              >
                                                <p
                                                  className="px-1 rounded m-2"
                                                  style={{
                                                    backgroundColor: "#374151"
                                                  }}
                                                >
                                                  <IoMdInformationCircle />{" "}
                                                  <span
                                                    style={{ fontSize: "12px" }}
                                                  >
                                                    Ver información
                                                  </span>
                                                </p>
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })
                              ) : (
                                <div className="col-12 text-center text-white mt-5">
                                  <h5 className="opacity-75 m-0">
                                    No hay productos disponibles
                                  </h5>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>

                    <div>
                      {/* add product success */}
                      <Modal
                        show={show1AddMenuSuc}
                        onHide={handleClose1AddMenuSuc}
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
                    </div>
                  </div>
                </div>

                <div className="p-2 row">
                  {filteredItems.length > 0 ? (
                    (selectedMenus.length === 0
                      ? filteredItems
                      : selectedMenus).filter(menu => menu && menu.id).map((menu) => {
                        const hasItems = menu.items.length > 0;
                        const shouldShow =
                          selectedMenus.length === 0 ||
                          selectedMenus.includes(menu);

                        if (shouldShow) {
                          return (
                            <div key={menu.id}>
                              {(hasItems || selectedMenus.includes(menu)) && (
                                <div className="text-white flex-wrap">
                                  <div className="">
                                    <h6 className="mb-0 mt-3 ps-2">
                                      {menu.name}
                                    </h6>
                                  </div>
                                </div>
                              )}
                              {hasItems ? (
                                <div className="row">
                                  {menu.items
                                    .filter(
                                      (item) =>
                                        !removedItems.some(
                                          (removedItem) =>
                                            removedItem.menuId === menu.id &&
                                            removedItem.itemId === item.id
                                        )
                                    )
                                    .map((ele, index) => (
                                      <div
                                        className="col-md-4 col-xl-3 col-sm-6 col-12 g-3"
                                        key={index}
                                      >
                                        <SingleMenu
                                          image={ele.image}
                                          name={ele.name}
                                          price={ele.cost_price}
                                          code={ele.code}
                                          menuId={menu.id}
                                          itemId={ele.id}
                                          showRetirar={showRetirar}
                                          onRetirar={() =>
                                            handleshow500(menu.id, ele.id)}
                                        />
                                      </div>
                                    ))}
                                </div>
                              ) : selectedMenus.includes(menu) ? (
                                <div className="col-12 text-center text-white mt-3">
                                  <p className="opacity-75">
                                    No hay productos disponibles en este menú
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          );
                        }
                        return null;
                      })
                  ) : (
                    <div className="col-12 text-center text-white mt-5">
                      <h5 className="opacity-75 m-0">
                        No hay productos disponibles
                      </h5>
                    </div>
                  )}
                </div>
                <Modal
                  show={show500}
                  onHide={handleclose500}
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
                        Menú digital eliminado
                      </p>
                      <p className="opacity-75 j-tbl-pop-2">
                        Menú digital eliminado correctamente
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
}
