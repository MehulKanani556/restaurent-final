import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Sidenav from "./Sidenav";
import { BsThreeDots } from "react-icons/bs";

import img2 from "../Image/addmenu.jpg";
import { Link } from "react-router-dom";
import SingleMenu from "./SingleMenu";
import { Badge } from "react-bootstrap";
import { IoMdInformationCircle } from "react-icons/io";
import axios from "axios";
import Loader from "./Loader";

export default function A() {
  const API = process.env.REACT_APP_IMAGE_URL; // Laravel Image URL
  const apiUrl = process.env.REACT_APP_API_URL;
  const [ token ] = useState(localStorage.getItem("token"));
  const [ isLoading, setIsLoading ] = useState(true);
  const [ createMenuError, setCreateMenuError ] = useState("");
  const [ editMenuError, setEditMenuError ] = useState("");
  const [ menuName, setmenuName ] = useState("");
  const [ menu, setMenu ] = useState([]);
  const [ item, setItem ] = useState([]);
  const [ items, setItems ] = useState([]);
  const [ selectedMenu, setSelectedMenu ] = useState(null);
  const [ selectedMenus, setSelectedMenus ] = useState([]);
  const [ parentCheck, setParentCheck ] = useState([]);
  const [ childCheck, setChildCheck ] = useState([]);
  const [ obj1, setObj1 ] = useState([]);
  const [ selectedItemsCount, setSelectedItemsCount ] = useState(0);
  const [ selectedItems, setSelectedItems ] = useState(new Set());
  const [ filteredItems, setFilteredItems ] = useState([]); // State to hold filtered items
  const [ filteredMenuItems, setFilteredMenuItems ] = useState([]); // State to hold filtered items
  const [ searchTerm, setSearchTerm ] = useState(""); // State to hold search term
  const [ selectedParentNames, setSelectedParentNames ] = useState([]); // State to hold selected parent names
  const [ selectedItemsMenu, setSelectedItemsMenu ] = useState(new Set());
  const [ previousFilteredItems, setPreviousFilteredItems ] = useState([]);
  /*  const [ filteredItems, setFilteredItems ] = useState([]); // State to hold filtered items */
  const [ searchTermMenu, setSearchTermMenu ] = useState(""); // State to hold search term
  const [ filteredItemsMenu, setFilteredItemsMenu ] = useState(obj1);
  const [ menuId, setMenuId ] = useState(null);
  const [ itemId, setItemId ] = useState([]);

  // Add product
  const [ show1, setShow1 ] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => {
    setShow1(true);
    setCount(0);
  };

  // create family
  const [ show, setShow ] = useState(false);
  const handleClose = () => {
    setShow(false);
    setCreateMenuError("");
    setmenuName(""); // Reset the input field
  };
  const handleShow = () => setShow(true);

  // create family success
  const [ showCreSuc, setShowCreSuc ] = useState(false);
  const handleCloseCreSuc = () => setShowCreSuc(false);
  const handleShowCreSuc = () => {
    setShowCreSuc(true);
    setTimeout(() => {
      setShowCreSuc(false);
    }, 2000);
  };

  // edit family
  const [ showEditFam, setShowEditFam ] = useState(false);
  const handleCloseEditFam = () => {
    setShowEditFam(false);
    setEditMenuError("");
  };

  // edit family Success
  const [ showEditFamSuc, setShowEditFamSuc ] = useState(false);
  const handleCloseEditFamSuc = () => setShowEditFamSuc(false);
  const handleShowEditFamSuc = () => {
    setShowEditFamSuc(true);
    setTimeout(() => {
      setShowEditFamSuc(false);
    }, 2000);
  };

  // edit family Eliminat
  const [ showEditFamDel, setShowEditFamDel ] = useState(false);
  const handleCloseEditFamDel = () => setShowEditFamDel(false);
  const handleShowEditFamDel = () => {
    setShowEditFamDel(true);
    setTimeout(() => {
      setShowEditFamDel(false);
    }, 2000);
  };

  // add product success
  const [ show1AddMenuSuc, setShow1AddMenuSuc ] = useState(false);
  const handleClose1AddMenuSuc = () => setShow1AddMenuSuc(false);
  const handleShow1AddMenuSuc = () => {
    setShow1AddMenuSuc(true);
    setTimeout(() => {
      setShow1AddMenuSuc(false);
    }, 2000);
  };

  // file upload function
  const [ selectedFile, setSelectedFile ] = useState(null);
  const [ errorMessage, setErrorMessage ] = useState(null);
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

  const [ showRetirar, setShowRetirar ] = useState(false);
  // const handleRetirar = (index) => {
  //   setItems(items.filter((_, i) => i !== index));
  // };
  const [ show500, setShow500 ] = useState(false);
  const handleclose500 = () => setShow500(false);

  const [ count, setCount ] = useState(0);

  const handleAddClick = () => {
    setCount(count + 1);
  };

  const isCategorySelected = (category) => {
    return (
      selectedCategories.length === 0 || selectedCategories.includes(category)
    );
  };

  const [ selectedCategories, setSelectedCategories ] = useState([]);

  const handleCheckboxChange = (menu) => {
    if (selectedCategories.includes(menu)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== menu));
    } else {
      setSelectedCategories([ ...selectedCategories, menu ]);
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
      setSelectedItemsMenu(new Set(selectedItemsMenu).add(item));
      setSelectedItemsCount(selectedItemsCount + 1);
      setItemId((prevArray) => [ ...prevArray, item ]);

      // Perform any other action here when adding an item
      console.log(`Added item ${item.id}`);
    } else {
      console.log(`Item ${item.id} already added`);
    }
  };

  const handleShowEditFam = (menu) => {
    setSelectedMenu(menu);
    setShowEditFam(true);
  };

  // get menu
  const fetchMenuData = async () => {
    try {
      const response = await axios.post(`${apiUrl}/menu/get`, {});
      setMenu(response.data.menus);
      /* console.log(response.data.menus); */
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // get menu item
  const fetchMenuItemData = async () => {
    try {
      const response = await axios.post(`${apiUrl}/menu/get`, {});
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
      : [ ...selectedMenus, menu ];

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
              ele.name.toLowerCase().includes(searchTerm) ||
              menu.name.toLowerCase().includes(searchTerm)
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
      const response = await axios.get(`${apiUrl}/family/getFamily`);
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
      const response = await axios.get(`${apiUrl}/subfamily/getSubFamily`);
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
      const response = await axios.get(`${apiUrl}/item/getAll`);
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

  const [ famName, setFamName ] = useState("");
  // const [checkedParents, setCheckedParents] = useState({});
  const [ checkedParents, setCheckedParents ] = useState(
    parentCheck.reduce((acc, family) => ({ ...acc, [family.id]: true }), {})
  );
  const handleParentChange = (parentId) => {
    setCheckedParents((prevState) => ({
      ...prevState,
      [parentId]: !prevState[parentId]
    }));
  };

  useEffect(() => {
    setIsLoading(true);
    if (token) {
      fetchMenuData();
      fetchMenuItemData();
      fetchFamilyData();
      fetchSubFamilyData();
      fetchAllItems();
      setIsLoading(false);
    }
  }, []);

  // create menu
  const handleCreateMenu = async () => {
    // Reset error message
    setCreateMenuError("");

    // Validate menu name
    if (!menuName.trim()) {
      setCreateMenuError("El nombre del menú no puede estar vacío");
      return;
    }

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
      handleClose();
      fetchMenuData();
    } catch (error) {
      console.error(
        "Error creating menu:",
        error.response ? error.response.data : error.message
      );
      setCreateMenuError(
        "Error al crear el menú. Por favor, inténtelo de nuevo."
      );
    }
  };

  // EDIT MENU
  const handleSaveEditFam = async () => {
    setEditMenuError("");

    if (!selectedMenu.name.trim()) {
      setEditMenuError("El nombre del menú no puede estar vacío");
      return;
    }

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
      handleCloseEditFam();
    } catch (error) {
      console.error(
        "Error updating menu:",
        error.response ? error.response.data : error.message
      );
      setEditMenuError(
        "Error al actualizar el menú. Por favor, inténtelo de nuevo."
      );
    }
  };
  // delete menu
  const handleDeleteFam = async () => {
    await axios
      .delete(`${apiUrl}/menu/delete/${selectedMenu.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        maxBodyLength: Infinity
      })
      .then(function(response) {
        console.log(response.data, "delete menu");
        handleShowEditFamDel();
        handleCloseEditFam();
        fetchMenuData();
      })
      .catch(function(error) {
        console.error(
          "Error deleting menu:",
          error.response ? error.response.data : error.message
        );
      });
  };

  /* add menu */
  const handleAddMenu = async () => {
    try {
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
        handleClose1();
        handleShow1AddMenuSuc();

        // Clear item IDs
        setItemId([]);

        window.location.reload();
      } else {
        console.error("Failed to add items to menu");
      }
    } catch (error) {
      console.error(
        "Error adding items to menu:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const filterItems = (searchTerm, checkedParents, childCheck) => {
    return obj1.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
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
        setSelectedParentNames((prev) => [ ...prev, parentItem.name ]);
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

  const [ removedItems, setRemovedItems ] = useState([]);
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
    [ removedItems ]
  );
  return (
    <div className="m_bg_black">
      <Header />
      <div className="d-flex">
        <div>
        </div>
        <div className=" flex-grow-1 sidebar">
         
            <div>
              <div className="p-3 m_bgblack text-white m_borbot jay-table-fixed-kya">
                <h5 className="mb-0 m18">Menú digital</h5>
              </div>

              <div className="row ">
          
                <div className="col-sm-10 col-8 m-0 p-0">
                  <div className="p-3 m_bgblack  text-white  flex-wrap">
                    <div className="mb-3">
                      <h6 className="mb-0 ">Entradas</h6>
                    </div>

                    <div>
                      <div className="d-flex justify-content-between m_property">
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
                                id="search"
                                value={searchTerm}
                                onChange={handleSearch}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <button
                            className="btn j-btn-primary j_editor_menu text-white text-nowrap m12 me-2"
                            onClick={() => setShowRetirar(!showRetirar)}
                          >
                            + Editar
                          </button>

                          <button
                            className="btn j-btn-primary text-white text-nowrap m12 "
                            onClick={handleShow1}
                          >
                            + Agregar
                          </button>
                        </div>
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
                                  <h6 >
                                    {selectedParentNames.length > 0 && (
                                      <div className="selected-parents-list ">
                                       {selectedParentNames.join(" , ")}
                                      </div>
                                    )}
                                  </h6>
                                </div>
                                <div>
                                  <div className="m_property">
                                    <div>
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
                                  filteredItemsMenu.map((ele, index) => (
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
                                            <div className="d-flex justify-content-center align-items-center rounded" style={{ height: "200px", backgroundColor: '#374151', color: 'white' }}>
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
                                              onClick={() =>
                                                handleAddItem(ele.id)}
                                              className="btn w-100 btn-primary text-white"
                                            >
                                              <Link
                                                className="text-white text-decoration-none"
                                                style={{ fontSize: "14px" }}
                                              >
                                                <span className="ms-1">
                                                  Añadir{" "}
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
                                  ))
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

                    </div>
                  </div>

           
                </div>
              </div>
            </div>
      
        </div>
      </div>
    </div>
  );
}
