import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Sidenav from "./Sidenav";
import { BsThreeDots } from "react-icons/bs";
import SingProd from "./SingProd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function Articles() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [token] = useState(localStorage.getItem("token"));
  const [role] = useState(localStorage.getItem("role"));
  const [admin_id] = useState(localStorage.getItem("admin_id"));
  const [familyError, setFamilyError] = useState("");
  const [subFamilyError, setSubFamilyError] = useState("");
  const [subFamilySelectionError, setSubFamilySelectionError] = useState("");
  const [selectedFamilyNames, setSelectedFamilyNames] = useState([]);
  const [selectedSubFamilies, setSelectedSubFamilies] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  // Add product
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => {
    console.log("vsvzsv");
    setShow1(false);
    // resetForm();
  };
  const handleShow1 = () => setShow1(true);



  // Add product success
  const [show1AddSuc, setShow1AddSuc] = useState(false);
  const handleClose1AddSuc = () => setShow1AddSuc(false);
  const handleShow1AddSuc = () => {
    setShow1AddSuc(true);
    setTimeout(() => {
      setShow1AddSuc(false);
    }, 2000);
  };

  // create family
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setFamilyError("");
  };
  const handleShow = () => setShow(true);

  // create subfamily
  const [showCreSub, setShowCreSub] = useState(false);
  const handleCloseCreSub = () => {
    setShowCreSub(false);
    setSubFamName("");
    setSubSelectName("");
    setSubFamilyError("");
    setSubFamilySelectionError("");
  };
  const handleShowCreSub = () => setShowCreSub(true);

  // create family success
  const [showCreSuc, setShowCreSuc] = useState(false);
  const handleCloseCreSuc = () => setShowCreSuc(false);
  const handleShowCreSuc = () => {
    setShowCreSuc(true);
    setTimeout(() => {
      setShowCreSuc(false);
    }, 2000);
  };

  // create subfamily success
  const [showCreSubSuc, setShowCreSubSuc] = useState(false);
  const handleCloseCreSubSuc = () => setShowCreSubSuc(false);
  const handleShowCreSubSuc = () => {
    setShowCreSubSuc(true);
    setTimeout(() => {
      setShowCreSubSuc(false);
    }, 2000);
  };

  // edit family
  const [showEditFam, setShowEditFam] = useState(false);
  const handleCloseEditFam = () => setShowEditFam(false);
  const handleShowEditFam = (family) => {
    setSelectedFamily(family);
    setShowEditFam(true);
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
  const handleShowEditFamDel = () => setShowEditFamDel(true);

  const [showEditFamfinal, setShowEditFamfinal] = useState(false);
  const handleCloseEditFamfinal = () => setShowEditFamfinal(false);
  const handleShowEditFamfinal = () => {
    setShowEditFamfinal(true);
    setTimeout(() => {
      setShowEditFamfinal(false);
    }, 2000);
  };

  // edit subfamily
  const [showEditSubFam, setShowEditSubFam] = useState(false);
  const handleCloseEditSubFam = () => {
    setShowEditSubFam(false);
    setSubFamilyError("");
    setSubFamilySelectionError("");
    // setSelectedSubFamily(null);
  };

  // edit subfamily Success
  const [showEditSubFamSuc, setShowEditSubFamSuc] = useState(false);
  const handleCloseEditSubFamSuc = () => setShowEditSubFamSuc(false);
  const handleShowEditSubFamSuc = () => {
    setShowEditSubFamSuc(true);
    setTimeout(() => {
      setShowEditSubFamSuc(false);
    }, 2000);
  };

  // edit subfamily Eliminat
  const [showEditSubFamDel, setShowEditSubFamDel] = useState(false);
  const handleCloseEditSubFamDel = () => setShowEditSubFamDel(false);
  const handleShowEditSubFamDel = () => {
    setShowEditSubFamDel(true);
    setTimeout(() => {
      setShowEditSubFamDel(false);
    }, 2000);
  };

  const [showEditSubFamDelfinal, setShowEditSubFamDelfinal] = useState(false);
  const handleCloseEditSubFamDelfinal = () => setShowEditSubFamDelfinal(false);
  const handleShowEditSubFamDelfinal = () => setShowEditSubFamDelfinal(true);

  // api
  const [parentCheck, setParentCheck] = useState([]);
  const [childCheck, setChildCheck] = useState([]);
  const [productionSel, setProductionSel] = useState([]);

  const [subFamName, setSubFamName] = useState("");
  const [subSelectName, setSubSelectName] = useState("");
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedSubFamily, setSelectedSubFamily] = useState(null);
  const [obj1, setObj1] = useState([]);
  const navigate = useNavigate();
  useEffect(
    () => {
      if (!(role == "admin" || role == "cashier")) {
        navigate('/dashboard')
        console.log("Role type:", role)
      } else {


        fetchFamilyData();
        fetchSubFamilyData();
        fetchAllItems();

        if (token) {
          fetchProductionCenters();
        }
      }
    },
    [apiUrl, token, role]
  );

  // get family

  const fetchFamilyData = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${apiUrl}/family/getFamily`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setParentCheck(response.data);
      setFamilies(response.data);
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
  };
  // get production id
  const fetchProductionCenters = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${apiUrl}/production-centers`, { admin_id: admin_id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProductionSel(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching production centers:",
        error.response ? error.response.data : error.message
      );
    }
    setIsProcessing(false);
  };

  // get subfamily
  const fetchSubFamilyData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/subfamily/getSubFamily`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
    setIsProcessing(true);
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
    setIsProcessing(false);
  };
  // filter family
  const [families, setFamilies] = useState([]);
  const [subFamilies, setSubFamilies] = useState([]);

  // useEffect(
  //   () => {
  //     let config = {
  //       method: "get",
  //       maxBodyLength: Infinity,
  //       url: apiUrl + "/family/getFamily",
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     };

  //     axios
  //       .request(config)
  //       .then((response) => {
  //         setFamilies(response.data);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   },
  //   [apiUrl, token]
  // );

  const getSubFamilies = () => {
    let family = [];
    family.push(document.getElementById("family").value);
    let data = JSON.stringify({
      families: family,
      admin_id: admin_id
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: apiUrl + "/subfamily/getMultipleSubFamily",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setSubFamilies(response.data.data[0].sub_family);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [famName, setFamName] = useState("");
  // const [checkedParents, setCheckedParents] = useState({});
  const [checkedParents, setCheckedParents] = useState(
    parentCheck?.reduce((acc, family) => ({ ...acc, [family.id]: true }), {})
  );

  const handleParentChange = (parentId) => {
    setCheckedParents((prevState) => {
      const newCheckedState = {
        ...prevState,
        [parentId]: !prevState[parentId]
      };

      const updatedSelectedNames = Object.keys(newCheckedState)
        .filter((key) => newCheckedState[key])
        .map((key) => {
          const family = parentCheck?.find(
            (family) => family.id === parseInt(key)
          );
          return family ? family.name : "";
        });

      setSelectedFamilyNames(updatedSelectedNames);
      setIsFiltered(updatedSelectedNames.length > 0);
      return newCheckedState;
    });
  };
  // create fam
  const handleCreateFam = () => {
    if (!famName.trim()) {
      setFamilyError("El nombre de la familia es obligatorio");
      return;
    }
    handleClose();

    setIsProcessing(true);
    axios
      .post(
        `${apiUrl}/family/create`,
        {
          name: famName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          maxBodyLength: Infinity
        }
      )
      .then(function (response) {
        handleShowCreSuc();
        fetchFamilyData(); // Ensure this is awaited
        fetchSubFamilyData();
        setFamName("");
        setFamilyError("");
        //enqueueSnackbar (response.data?.notification, { variant: 'success' })
        // playNotificationSound();;
        setIsProcessing(false);
      })
      .catch(function (error) {
        console.error(
          "Error creating family:",
          error.response ? error.response.data : error.message
        );
        setFamilyError(
          "Error al crear la familia. Por favor, inténtelo de nuevo."
        );
        //enqueueSnackbar (error?.response?.data?.alert || errorMessage, { variant: 'error' })
        // playNotificationSound();;
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  // create sub fam
  const handleCreateSubFam = () => {
    if (!subSelectName) {
      setSubFamilySelectionError("Debe seleccionar una familia");
      return;
    }
    if (!subFamName.trim()) {
      setSubFamilyError("El nombre de la subfamilia es obligatorio");
      return;
    }
    handleCloseCreSub();
    setIsProcessing(true);

    axios
      .post(
        `${apiUrl}/subfamily/create`,
        {
          name: subFamName,
          family_id: subSelectName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          maxBodyLength: Infinity
        }
      )
      .then(function (response) {
        handleShowCreSubSuc();
        fetchFamilyData(); // Ensure this is awaited
        fetchSubFamilyData();  // Refresh family data
        setIsProcessing(false);
        setSubFamName("");
        setSubSelectName("");

      })
      .catch(function (error) {
        console.error(
          "Error creating sub family:",
          error.response ? error.response.data : error.message
        );
        setSubFamilyError(
          "Error al crear la subfamilia. Por favor, inténtelo de nuevo."
        );

      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  // edit family
  const handleUpdateFamily = (family) => {
    if (!family.name.trim()) {
      setFamilyError("El nombre de la familia es obligatorio");
      return;
    }
    handleCloseEditFam();

    setIsProcessing(true);
    axios
      .post(
        `${apiUrl}/family/update/${family.id}`,
        {
          name: family.name
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          maxBodyLength: Infinity
        }
      )
      .then(function (response) {
        handleShowEditFamSuc();
        fetchFamilyData();
        fetchSubFamilyData();
        setFamilyError("");
        // fetchProductionCenters();
      })
      .catch(function (error) {
        console.error(
          "Error updating family:",
          error.response ? error.response.data : error.message
        );
        setFamilyError(
          "Error al actualizar la familia. Por favor, inténtelo de nuevo."
        );
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  // edit subfamily
  const handleUpdateSubFamily = () => {
    if (!selectedSubFamily.name.trim()) {
      setSubFamilyError("El nombre de la subfamilia es obligatorio");
      return;
    }
    handleCloseEditSubFam();
    setIsProcessing(true);
    if (!selectedSubFamily.family_id) {
      setSubFamilySelectionError("Debe seleccionar una familia");
      return;
    }

    axios
      .post(
        `${apiUrl}/subfamily/update/${selectedSubFamily.id}`,
        {
          name: selectedSubFamily.name,
          family_id: selectedSubFamily.family_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          maxBodyLength: Infinity
        }
      )
      .then(function (response) {
        handleShowEditSubFamSuc();
        fetchSubFamilyData();
      })
      .catch(function (error) {
        console.error(
          "Error updating sub family:",
          error.response ? error.response.data : error.message
        );
        setSubFamilyError(
          "Error al actualizar la subfamilia. Por favor, inténtelo de nuevo."
        );
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  // Method to initiate family deletion
  const handleDeleteFamily = (familyId) => {
    setIsProcessing(true);
    axios
      .delete(`${apiUrl}/family/delete/${familyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(function (response) {
        handleCloseEditFam(); // Close edit family modal after deletion
        handleShowEditFamDel(); // Show success modal for family deletion
        fetchFamilyData();
        handleCloseEditFamDel();
        // Optionally, update state or refresh data after deletion
      })
      .catch(function (error) {
        console.error(
          "Error deleting family:",
          error.response ? error.response.data : error.message
        );
      })
      .finally(() => {
        setIsProcessing(false);
      });
    setCheckedParents((prev) => {
      const newCheckedParents = { ...prev };
      delete newCheckedParents[familyId];
      setIsFiltered(Object.values(newCheckedParents).some((value) => value));
      return newCheckedParents;
    });
  };

  const handleDeleteSubFamily = (subFamilyId) => {
    setIsProcessing(true);
    axios
      .delete(`${apiUrl}/subfamily/delete/${subFamilyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(function (response) {
        handleCloseEditSubFam(); // Close edit subfamily modal after deletion
        handleShowEditSubFamDel(); // Show success modal for subfamily deletion
        fetchSubFamilyData(); // Fetch updated subfamily data
        handleCloseEditSubFamDelfinal(); // Close final confirmation modal
      })
      .catch(function (error) {
        console.error(
          "Error deleting sub family:",
          error.response ? error.response.data : error.message
        );
      })
      .finally(() => {
        setIsProcessing(false);
      });
    setSelectedSubFamilies((prev) => {
      const newSelectedSubFamilies = prev.filter((id) => id !== subFamilyId);
      setIsFiltered(newSelectedSubFamilies.length > 0);
      return newSelectedSubFamilies;
    });
  };

  // Add Product
  // Replace formData state with refs
  const formRef = useRef({
    name: "",
    code: "",
    production_center_id: "",
    cost_price: "",
    sale_price: "",
    family_id: "",
    sub_family_id: "",
    description: ""
  });
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});

  // Update the handleInputChange function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    formRef.current[name] = value;

    // Clear error for this field
    if (errorMessages[name]) {
      setErrorMessages(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // // Clear sale price error when cost price or sale price changes
    // if (name === "cost_price" || name === "sale_price") {
    //   setErrorMessages(prev => ({
    //     ...prev,
    //     sale_price: ""
    //   }));
    // }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif', 'image/jpg'];
      const fileType = file.type;

      if (!allowedTypes.includes(fileType)) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          image: "El tipo de archivo debe ser SVG, PNG, JPG o GIF"
        }));
        setSelectedFile(null);
      } else if (file.size > 2 * 1024 * 1024) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          image: "El tamaño de la imagen no puede superar los 2 MB"
        }));
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          image: ""
        }));
      }
    }
    setUploadedFile(null);
  };

  // Update the validate function
  const validate = () => {
    const formData = formRef.current;
    let errors = {};

    if (!formData.name.trim()) {
      errors.name = "El nombre es obligatorio";
    }

    if (!formData.production_center_id) {
      errors.production_center_id = "El centro de producción es obligatorio";
    }

    if (!formData.cost_price.trim() || isNaN(parseFloat(formData.cost_price)) || parseFloat(formData.cost_price) <= 0) {
      errors.cost_price = "El precio de costo debe ser un número mayor que 0";
    }

    if (!formData.sale_price.trim() || isNaN(parseFloat(formData.sale_price)) || parseFloat(formData.sale_price) <= 0) {
      errors.sale_price = "El precio de venta debe ser un número mayor que 0";
    } else {
      const costPrice = parseFloat(formData.cost_price);
      const salePrice = parseFloat(formData.sale_price);
      // Ensure cost_price is less than sale_price
      if (salePrice <= costPrice) {
        errors.sale_price = "El precio de venta debe ser mayor que el precio de costo";
      }
    }

    if (!formData.family_id) {
      errors.family_id = "La familia es obligatoria";
    }

    if (!formData.sub_family_id) {
      errors.sub_family_id = "La subfamilia es obligatoria";
    }

    // if (!selectedFile) {
    //   errors.image = "Se requiere una imagen";
    // }

    // Set errors if any
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return false;
    }

    return true;
  };

  // Update form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate();

    if (!isValid) return;

    handleClose1();
    setIsProcessing(true);

    // Create FormData object
    const formData = new FormData();
    console.log(formRef.current);

    // Append all form fields to FormData
    Object.keys(formRef.current).forEach(key => {
      if (formRef.current[key]) { // Only append if value exists
        formData.append(key, formRef.current[key]);
      }
    });
    console.log(formData);
    // Append image file if selected
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    // Log FormData entries for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await axios.post(`${apiUrl}/item/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUploadedFile(response.data.file);
        handleShow1AddSuc();
        fetchAllItems();

        // Reset form
        formRef.current = {
          name: "",
          code: "",
          production_center_id: "",
          cost_price: "",
          sale_price: "",
          family_id: "",
          sub_family_id: "",
          description: ""
        };
        setSelectedFile(null);
        setErrorMessages({});
      }
    } catch (error) {
      setErrorMessages({
        general: error.response?.data?.errors?.code || "Error creating item"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle family selection change

  // Handle family selection change
  const handleFamilyChange = (event) => {
    // const { name, value } = e.target;
    const familyName = event.target.value;
    setSelectedFamily(familyName);
    handleInputChange(event);
  };

  // Filter sub-family options based on selected family name
  const filteredSubFamilies = childCheck?.filter(
    (childItem) => childItem.family_name === selectedFamily
  );
  // **********************************************

  const handleshowEditSubFamDel2 = (subFamily) => {
    const familyId = parentCheck?.find(family => family.name === subFamily.family_name)?.id;
    setSelectedSubFamily({
      ...subFamily,
      family_id: familyId || "" // Set to empty string if familyId is undefined
    });
    setShowEditSubFam(true);
    setSubFamilyError("");
    setSubFamilySelectionError("");
  };

  const handleCheckedInput = (id) => {
    setSelectedSubFamilies((prevSelected) => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter((subFamilyId) => subFamilyId !== id)
        : [...prevSelected, id];
      setIsFiltered(newSelected.length > 0);
      return newSelected;
    });
  };
  // delete issue
  const [isFiltered, setIsFiltered] = useState(false);
  return (
    <div className="m_bg_black">
      <Header />
      <div className="d-flex">
        <div>
          <Sidenav />
        </div>
        <div className=" flex-grow-1 sidebar">

          <div>
            <div className="p-3 m_bgblack text-white  b_borderrr jay-table-fixed-kya  ">
              <h5 className="mb-0" style={{ fontSize: "18px" }}>
                Artículos
              </h5>
            </div>

            <div className="row ">
              <div className="col-sm-2 col-4 m_bgblack m-0 p-0 b_bring " style={{ minHeight: "100vh" }}>
                <div className="j-articals-sticky">
                  <div className="ms-3 pe-3 mt-2">
                    <div className="b_bring_b  ">
                      <p
                        className="text-white  my-2 "
                        style={{ fontSize: "14px" }}
                      >
                        Familias y subfamilias
                      </p>
                      <div>
                        <Dropdown
                          data-bs-theme="dark"
                          className="m_drop pb-3 "
                        >
                          <Dropdown.Toggle
                            id="dropdown-button-dark-example1"
                            className="b_blue_new11 b_togllle"
                            variant="primary"
                            style={{ fontSize: "12px" }}
                          >
                            + crear
                          </Dropdown.Toggle>

                          <Dropdown.Menu
                            className="m14"
                            style={{ backgroundColor: "#374151" }}
                          >
                            <Dropdown.Item onClick={handleShow}>
                              Familia
                            </Dropdown.Item>
                            <Dropdown.Item onClick={handleShowCreSub}>
                              Subfamilia
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                  {/* create family */}

                  {/* .............BRIJESH ............................. */}

                  <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop={true}
                    keyboard={false}
                    className="m_modal"
                  >
                    <Modal.Header
                      closeButton
                      className="m_borbot  b_border_bb mx-3 ps-0"
                    >
                      <Modal.Title>Crear familia</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="border-0 pb-0">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                          Nombre familia
                        </label>
                        <input
                          type="text"
                          className="form-control m_input ps-3"
                          id="exampleFormControlInput1"
                          placeholder="Eje.Bebidas"
                          onChange={(e) => {
                            setFamName(e.target.value);
                            setFamilyError("");
                          }}
                        />
                        {familyError && (
                          <div className="text-danger errormessage">
                            {familyError}
                          </div>
                        )}
                      </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                      <Button
                        variant="primary"
                        className="b_btn_pop"
                        onClick={() => {
                          // handleShowCreSuc();
                          // handleClose();
                          handleCreateFam();
                        }}
                      >
                        Crear
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  {/* .............BRIJESH ............................. */}

                  {/* create subfamily */}
                  <Modal
                    show={showCreSub}
                    onHide={handleCloseCreSub}
                    backdrop={true}
                    keyboard={false}
                    className="m_modal"
                  >
                    <Modal.Header
                      closeButton
                      className="m_borbot b_border_bb mx-3 ps-0"
                    >
                      <Modal.Title>Crear Subfamilia</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="border-0 pb-0">
                      <div className="mb-3">
                        <label
                          htmlFor="createSubFamilyFamily"
                          className="form-label"
                        >
                          Seleccionar familia
                        </label>
                        <select
                          id="createSubFamilyFamily"
                          className="form-select m_input"
                          aria-label="Default select example"
                          value={subSelectName}
                          onChange={(e) => {
                            setSubSelectName(e.target.value);
                            setSubFamilySelectionError("");
                          }}
                        >
                          <option value="">Seleccionar</option>
                          {parentCheck?.map((ele) => (
                            <option key={ele.id} value={ele.id}>
                              {ele.name}
                            </option>
                          ))}
                        </select>
                        {subFamilySelectionError && (
                          <div className="text-danger errormessage">
                            {subFamilySelectionError}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="createSubFamilyName"
                          className="form-label"
                        >
                          Nombre subfamilia
                        </label>
                        <input
                          type="text"
                          className="form-control m_input"
                          id="createSubFamilyName"
                          placeholder="Eje.Agua"
                          value={subFamName}
                          onChange={(e) => {
                            setSubFamName(e.target.value);
                            setSubFamilyError("");
                          }}
                        />
                        {subFamilyError && (
                          <div className="text-danger errormessage">
                            {subFamilyError}
                          </div>
                        )}
                      </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                      <Button
                        variant="primary"
                        className="b_btn_pop"
                        onClick={handleCreateSubFam}
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
                        <img
                          src={require("../Image/check-circle.png")}
                          alt=""
                        />
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
                        <img
                          src={require("../Image/check-circle.png")}
                          alt=""
                        />
                        <p className="mb-0 mt-2 h6">Familia</p>
                        <p className="opacity-75">creada exitosamente</p>
                      </div>
                    </Modal.Body>
                  </Modal>
                  <div className="py-3 b_bring_b mx-3">
                    {Array.isArray(parentCheck) &&
                      parentCheck?.map((parentItem) => (
                        <div key={parentItem.id}>
                          <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                            <div
                              className="text-nowrap"
                              style={{ fontSize: "14px" }}
                            >
                              <label>
                                <input
                                  type="checkbox"
                                  checked={!!checkedParents[parentItem.id]}
                                  onChange={() =>
                                    handleParentChange(parentItem.id)}
                                  className="me-2 custom-checkbox"
                                />

                                <span className="text-white">
                                  {parentItem.name}
                                </span>
                              </label>
                            </div>
                            <div
                              className="text-white  "
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                handleShowEditFam(parentItem);
                              }}
                            >
                              <BsThreeDots className="j-tbl-dot-color" />
                            </div>
                            {/* Edit family */}
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
                                  ?.map((childItem) => (
                                    <div key={childItem.id}>
                                      <div className="d-flex align-content-center justify-content-between my-2">
                                        <div style={{ fontSize: "14px" }}>
                                          <label className="text-white ">
                                            <input
                                              type="checkbox"
                                              className="mx-2 custom-checkbox"
                                              onChange={() =>
                                                handleCheckedInput(
                                                  childItem.id
                                                )}
                                              checked={selectedSubFamilies.includes(
                                                childItem.id
                                              )}
                                              value={childItem.id}
                                            />
                                            {childItem.name}
                                          </label>
                                        </div>
                                        <div
                                          className="text-white"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            handleshowEditSubFamDel2(
                                              childItem
                                            );
                                          }}
                                        >
                                          <BsThreeDots className="j-tbl-dot-color" />
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
              {/* ....................BRIJESH ...................... */}
              {/* Edit family */}

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
                      Editar familia
                    </Link>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="border-0 pb-0">
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Nombre familia
                    </label>
                    <input
                      type="text"
                      className="form-control m_input ps-3"
                      id="exampleFormControlInput1"
                      placeholder="Bebidas"
                      value={selectedFamily ? selectedFamily.name : ""}
                      onChange={(e) => {
                        setSelectedFamily({
                          ...selectedFamily,
                          name: e.target.value
                        });
                        setFamilyError("");
                      }}
                    />
                    {familyError && (
                      <div className="text-danger errormessage">
                        {familyError}
                      </div>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                  <Button
                    variant="danger"
                    className="b_btn_close"
                    onClick={() => {
                      handleCloseEditFam();
                      handleShowEditFamDel();
                    }}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="primary"
                    className="b_btn_pop"
                    onClick={() => {
                      handleCloseEditFam();
                      handleUpdateFamily(selectedFamily);
                    }}
                  >
                    Guardar cambios
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* ....................BRIJESH ...................... */}

              {/* edit family success */}
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
                    <img src={require("../Image/check-circle.png")} alt="" />
                    <p className="mb-0 mt-2 h6">Sus cambios</p>
                    <p className="opacity-75">
                      Han sido guardados correctamente
                    </p>
                  </div>
                </Modal.Body>
              </Modal>

              {/* edit family eliminate */}
              <Modal
                show={showEditFamDel}
                onHide={handleCloseEditFamDel}
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
                    <p className="mb-0 mt-2 h6">
                      {" "}
                      Deseas eliminar esta familia
                    </p>
                  </div>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-end">
                  <Button
                    className="j-tbl-btn-font-1 b_btn_close"
                    variant="danger"
                    onClick={() => {
                      handleDeleteFamily(selectedFamily.id);
                      handleCloseEditFamDel();
                      handleShowEditFamfinal();
                    }}
                  >
                    Si, seguro
                  </Button>
                  <Button
                    className="j-tbl-btn-font-1 "
                    variant="secondary"
                    onClick={() => {
                      handleCloseEditFamDel();
                    }}
                  >
                    No, cancelar
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={showEditFamfinal}
                onHide={handleCloseEditFamfinal}
                backdrop={true}
                keyboard={false}
                className="m_modal"
              >
                <Modal.Header closeButton className="border-0" />
                <Modal.Body>
                  <div className="text-center">
                    <img src={require("../Image/trash-check 1.png")} alt="" />
                    <p className="mb-0 mt-2 h6">Familia</p>
                    <p className="opacity-75">
                      Ha sido eliminada correctamente
                    </p>
                  </div>
                </Modal.Body>
              </Modal>

              {/* Edit Subfamily */}
              <Modal
                show={showEditSubFam}
                onHide={handleCloseEditSubFam}
                backdrop={true}
                keyboard={false}
                className="m_modal"
              >
                <Modal.Header closeButton className="m_borbot">
                  <Modal.Title>Editar subfamilia</Modal.Title>
                </Modal.Header>
                <Modal.Body className="border-0">
                  <div className="mb-3">
                    <label
                      htmlFor="editSubFamilyFamily"
                      className="form-label"
                    >
                      Seleccionar familia
                    </label>
                    <select
                      id="editSubFamilyFamily"
                      className="form-select m_input"
                      value={
                        selectedSubFamily ? selectedSubFamily.family_id : ""
                      }
                      onChange={(e) => {
                        setSelectedSubFamily({
                          ...selectedSubFamily,
                          family_id: e.target.value
                        });
                        setSubFamilySelectionError("");
                      }}
                    >
                      <option value="">Seleccionar</option>
                      {parentCheck?.map((family) => (
                        <option key={family.id} value={family.id}>
                          {family.name}
                        </option>
                      ))}
                    </select>
                    {subFamilySelectionError && (
                      <div className="text-danger errormessage">
                        {subFamilySelectionError}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editSubFamilyName" className="form-label">
                      Nombre subfamilia
                    </label>
                    <input
                      type="text"
                      className="form-control m_input"
                      id="editSubFamilyName"
                      placeholder="Nombre de la subfamilia"
                      value={selectedSubFamily ? selectedSubFamily.name : ""}
                      onChange={(e) => {
                        setSelectedSubFamily({
                          ...selectedSubFamily,
                          name: e.target.value
                        });
                        setSubFamilyError("");
                      }}
                    />
                    {subFamilyError && (
                      <div className="text-danger errormessage">
                        {subFamilyError}
                      </div>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                  <Button
                    variant="danger"
                    className="b_btn_close"
                    onClick={() => {
                      handleCloseEditSubFam();
                      handleShowEditSubFamDelfinal();
                    }}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleCloseEditSubFam();
                      handleUpdateSubFamily(selectedSubFamily);
                    }}
                  >
                    Guardar cambios
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* edit subfamily success */}
              <Modal
                show={showEditSubFamSuc}
                onHide={handleCloseEditSubFamSuc}
                backdrop={true}
                keyboard={false}
                className="m_modal"
              >
                <Modal.Header closeButton className="border-0" />
                <Modal.Body>
                  <div className="text-center">
                    <img src={require("../Image/check-circle.png")} alt="" />
                    <p className="mb-0 mt-2 h6">Sus cambios</p>
                    <p className="opacity-75">
                      Han sido guardados correctamente
                    </p>
                  </div>
                </Modal.Body>
              </Modal>

              {/* edit subfamily eliminate */}
              <Modal
                show={showEditSubFamDelfinal}
                onHide={handleCloseEditSubFamDelfinal}
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
                    <p className="mb-0 mt-2 h6">
                      {" "}
                      Desar eliminar esta Subfamilia
                    </p>
                  </div>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-end">
                  <Button
                    className="j-tbl-btn-font-1 b_btn_close"
                    variant="danger"
                    onClick={() => {
                      handleDeleteSubFamily(selectedSubFamily.id);
                      handleCloseEditSubFamDelfinal();
                      handleShowEditSubFamDel();
                    }}
                  >
                    Si, seguro
                  </Button>
                  <Button
                    className="j-tbl-btn-font-1 "
                    variant="secondary"
                    onClick={() => {
                      handleCloseEditSubFamDelfinal();
                    }}
                  >
                    No, cancelar
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={showEditSubFamDel}
                onHide={handleCloseEditSubFamDel}
                backdrop={true}
                keyboard={false}
                className="m_modal"
              >
                <Modal.Header closeButton className="border-0" />
                <Modal.Body>
                  <div className="text-center">
                    <img src={require("../Image/trash-check 1.png")} alt="" />
                    <p className="mb-0 mt-2 h6">SubFamilia</p>
                    <p className="opacity-75">
                      Ha sido eliminada Subfamilia correctamente
                    </p>
                  </div>
                </Modal.Body>
              </Modal>

              <div className="col-sm-10 col-8 m-0 p-0">
                <div className="p-3 m_bgblack  text-white d-flex justify-content-between align-items-center flex-wrap">
                  {/* <h6 className="">Bebidas</h6> */}
                  <h6 className="">
                    {selectedFamilyNames.length > 0 ? (
                      selectedFamilyNames.join(" , ")
                    ) : (
                      ""
                    )}
                  </h6>
                  <div>
                    {/* add product */}
                    <Button
                      className="b_blue_new11"
                      variant="primary text-nowrap"
                      style={{ fontSize: "14px" }}
                      onClick={handleShow1}
                    >
                      + Agregar producto
                    </Button>

                    <Modal
                      show={show1}
                      onHide={handleClose1}
                      backdrop={true}
                      keyboard={false}
                      className="m_modal j_topmodal"
                    >
                      <Modal.Header closeButton className="m_borbot">
                        <Modal.Title>Agregar artículo</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="border-0">
                        <form action="" onSubmit={(e) => e.preventDefault()}>
                          <div className="row">
                            <div className="col-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleFormControlInput1"
                                  className="form-label"
                                >
                                  Nombre
                                </label>
                                <input
                                  type="text"
                                  className="form-control m_input"
                                  id="exampleFormControlInput1"
                                  placeholder="-"
                                  name="name"
                                  defaultValue={formRef.current.name}
                                  onChange={handleInputChange}
                                />
                                {errorMessages.name && (
                                  <div className="text-danger errormessage">
                                    {errorMessages.name}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleFormControlInput2"
                                  className="form-label"
                                >
                                  Código
                                </label>
                                <input
                                  type="text"
                                  className="form-control m_input"
                                  id="exampleFormControlInput2"
                                  name="code"
                                  placeholder=""
                                  defaultValue={formRef.current.code}
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="mb-3">
                              <label
                                htmlFor="exampleFormControlInput3"
                                className="form-label"
                              >
                                Centro de producción
                              </label>
                              <select
                                className="form-select m_input"
                                name="production_center_id"
                                defaultValue={formRef.current.production_center_id}
                                onChange={handleInputChange}
                              >
                                <option value="">Seleccionar</option>
                                {productionSel?.map((ele) => (
                                  <option key={ele.id} value={ele.id}>
                                    {ele.name}
                                  </option>
                                ))}
                              </select>
                              {errorMessages.production_center_id && (
                                <div className="text-danger errormessage">
                                  {errorMessages.production_center_id}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleFormControlInput4"
                                  className="form-label"
                                >
                                  Precio costo
                                </label>
                                <input
                                  type="text"
                                  className="form-control m_input"
                                  id="exampleFormControlInput4"
                                  name="cost_price"
                                  placeholder="$0.00"
                                  defaultValue={formRef.current.cost_price}
                                  onChange={handleInputChange}
                                />
                                {errorMessages.cost_price && (
                                  <div className="text-danger errormessage">
                                    {errorMessages.cost_price}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleFormControlInput5"
                                  className="form-label"
                                >
                                  Precio venta
                                </label>
                                <input
                                  type="text"
                                  className="form-control m_input"
                                  id="exampleFormControlInput5"
                                  placeholder="$0.00"
                                  name="sale_price"
                                  defaultValue={formRef.current.sale_price}
                                  onChange={handleInputChange}
                                />
                                {errorMessages.sale_price && (
                                  <div className="text-danger errormessage">
                                    {errorMessages.sale_price}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleFormControlInput6"
                                  className="form-label"
                                >
                                  Familia
                                </label>
                                <select
                                  className="form-select m_input"
                                  name="family_id"
                                  id="family"
                                  defaultValue={formRef.current.family_id}
                                  onChange={(e) => {
                                    const selectedFamilyId = e.target.value;
                                    formRef.current.family_id = selectedFamilyId;
                                    getSubFamilies();
                                    setErrorMessages(prev => ({
                                      ...prev,
                                      family_id: ''
                                    }));
                                  }}
                                >
                                  <option value="">Seleccionar</option>
                                  {families?.map((family) => (
                                    <option key={family.id} value={family.id}>
                                      {family.name}
                                    </option>
                                  ))}
                                </select>
                                {errorMessages.family_id && (
                                  <div className="text-danger">
                                    {errorMessages.family_id}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleFormControlInput7"
                                  className="form-label"
                                >
                                  Subfamilia
                                </label>
                                <select
                                  className="form-select m_input"
                                  name="sub_family_id"
                                  defaultValue={formRef.current.sub_family_id}
                                  onChange={handleInputChange}
                                >
                                  <option value="">Seleccionar</option>
                                  {subFamilies?.map((subFamily) => (
                                    <option key={subFamily.id} value={subFamily.id}>
                                      {subFamily.name}
                                    </option>
                                  ))}
                                </select>
                                {errorMessages.sub_family_id && (
                                  <div className="text-danger errormessage">
                                    {errorMessages.sub_family_id}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="mb-3">
                              <label
                                htmlFor="exampleFormControlInput8"
                                className="form-label"
                              >
                                Descripción
                              </label>
                              <input
                                type="text"
                                className="form-control m_input"
                                id="exampleFormControlInput8"
                                name="description"
                                placeholder="-"
                                defaultValue={formRef.current.description}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="row ">
                            <div className="p-3">

                              <label
                                htmlFor="exampleFormControlInput8"
                                className="form-label"
                              >
                                Imagen del producto
                              </label>
                              {
                                selectedFile ? (
                                  <div className="rounded position-relative">
                                    <img
                                      src={URL.createObjectURL(selectedFile)} // Show the selected image
                                      alt="Selected"
                                      style={{
                                        width: "150px",
                                        height: "150px",
                                        objectFit: "cover"
                                      }}
                                      className="object-fit-contain jm-input rounded"
                                    />
                                    <div
                                      className="position-absolute jm-dustbin-position"
                                      onClick={() => {
                                        setSelectedFile(null); // Clear the selected file
                                        setErrorMessages((prevErrors) => ({
                                          ...prevErrors,
                                          image: ""
                                        }));
                                      }}
                                    >
                                      <RiDeleteBin6Fill className="jm-dustbin-size " />
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="m_file-upload"
                                    onClick={() => fileInputRef.current.click()}
                                  >
                                    <input
                                      type="file"
                                      ref={fileInputRef}
                                      onChange={handleFileChange}
                                      style={{ display: "none" }}
                                      accept=".svg,.png,.jpg,.jpeg,.gif"
                                    />

                                    <div className="text-center">
                                      <p>
                                        <img
                                          src={require("../Image/v111.png")}
                                          alt=""
                                        />
                                      </p>
                                      <p className="m_upload-text">
                                        Haga clic para cargar o arrastre y suelte
                                      </p>
                                      <p className="m_supported-types">
                                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                                      </p>
                                    </div>

                                    {errorMessages.image && (
                                      <p className="text-danger errormessage">
                                        {errorMessages.image}
                                      </p>
                                    )}
                                  </div>
                                )
                              }
                            </div>

                          </div>

                        </form>
                        {errorMessages.general && (
                          <div className="text-danger errormessage">
                            {errorMessages.general}
                          </div>
                        )}
                      </Modal.Body>
                      <Modal.Footer className="border-0">
                        <Button
                          variant="primary"
                          style={{ backgroundColor: "#147BDE" }}
                          onClick={handleFormSubmit}
                        >
                          Agregar
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    {/* add product success */}
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
                          <p className="mb-0 mt-2 h6">Sus artículo</p>
                          <p className="opacity-75">
                            Ha sido agregado correctamente
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
                        <Spinner animation="border" role="status" style={{ height: '85px', width: '85px', borderWidth: '6px' }} />
                        <p className="mt-2">Procesando solicitud...</p>
                      </Modal.Body>
                    </Modal>
                  </div>
                </div>
                <div className="row p-2">
                  {isFiltered ? (
                    selectedSubFamilies.length > 0 ? (
                      obj1.filter((item) =>
                        selectedSubFamilies.includes(item.sub_family_id)
                      ).length > 0 ? (
                        obj1
                          .filter((item) =>
                            selectedSubFamilies.includes(item.sub_family_id)
                          )
                          ?.map((ele, index) => (
                            <div
                              className="col-md-4 col-xl-3 col-sm-6 col-12 g-3"
                              key={ele.id}
                            >
                              <SingProd
                                id={ele.id}
                                image={ele.image}
                                name={ele.name}
                                price={ele.sale_price}
                                code={ele.code}
                              />
                            </div>
                          ))
                      ) : (
                        <div className="text-center mt-3 text-white">
                          No hay productos disponibles
                        </div>
                      )
                    ) : Object.keys(checkedParents).some(
                      (key) => checkedParents[key]
                    ) ? (
                      obj1.filter((item) => checkedParents[item.family_id]).length > 0 ? (
                        obj1
                          .filter((item) => checkedParents[item.family_id])
                          ?.map((ele, index) => (
                            <div
                              className="col-md-4 col-xl-3 col-sm-6 col-12 g-3"
                              key={ele.id}
                            >
                              <SingProd
                                id={ele.id}
                                image={ele.image}
                                name={ele.name}
                                price={ele.sale_price}
                                code={ele.code}
                              />
                            </div>
                          ))
                      ) : (
                        <div className="text-center mt-3 text-white">
                          No hay productos disponibles
                        </div>
                      )
                    ) : (
                      <div className="text-center mt-3 text-white">
                        No hay productos disponibles
                      </div>
                    )
                  ) : (
                    obj1?.map((ele, index) => (
                      <div
                        className="col-md-4 col-xl-3 col-sm-6 col-12 g-3"
                        key={ele.id}
                      >
                        <SingProd
                          id={ele.id}
                          image={ele.image}
                          name={ele.name}
                          price={ele.sale_price}
                          code={ele.code}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
