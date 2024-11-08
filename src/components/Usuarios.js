import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import Sidenav from "./Sidenav";
import img1 from "../Image/Image (3).jpg";
import {
  FaAngleLeft,
  FaAngleRight,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaPlus
} from "react-icons/fa6";
import { Button, Dropdown, Modal, Spinner } from "react-bootstrap";
import { MdClose, MdEditSquare } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoIosSend, IoMdLock } from "react-icons/io";
import axios from "axios";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import useAudioManager from "./audioManager";
//import { enqueueSnackbar  } from "notistack";

const Usuarios = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [token] = useState(localStorage.getItem("token"));
  const role = localStorage.getItem("role");
  const [email] = useState(localStorage.getItem("email"));
  const navigate = useNavigate();
  const admin_id = localStorage.getItem("admin_id");
  const [showPassword, setShowPassword] = useState(false);
  const [showcomfirmPassword, setShowcomfirmPassword] = useState(false);
  const [editshowPassword, seteditShowPassword] = useState(false);
  const [editshowcomfirmPassword, seteditShowcomfirmPassword] = useState(
    false
  );
  const [formKey, setFormKey] = useState(0);
  const [password, setPassword] = useState("");
  const [comfirmpassword, setcomfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [editpassword, seteditPassword] = useState("");
  const [editcomfirmpassword, seteditcomfirmPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [userActive, setUserActive] = useState(null);
  const { playNotificationSound } = useAudioManager();

  const roleNamesInSpanish = {
    1: "Admin",
    2: "Cajero",
    3: "Garzón",
    4: "Cocina"
  };
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role_id: "",
    email: "",
    password: "",
    confirm_password: "",
    invite: true,

  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [show, setShow] = useState(false);

  // Add refs for form inputs
  const formRefs = {
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirm_password: useRef(null),
    role_id: useRef(null)
  };

  useEffect(
    () => {

      if (role !== "admin") {
        navigate("/dashboard");
      } else if (token) {
        setIsProcessing(true);
        fetchUser();
        fetchRole();
        setIsProcessing(false);
      }
    },
    [token]
  );

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setcomfirmPassword(capitalizedValue);
  };

  const [showEditFamDel, setShowEditFamDel] = useState(false);
  const handleCloseEditFamDel = () => setShowEditFamDel(false);
  const handleShowEditFamDel = (no) => {
    const newData = data.filter((order) => order.no !== no);

    // Update the state with the new filtered data
    setData(newData);

    setShowEditFamDel(true);
  };
  const [showEditFamDel2, setShowEditFamDel2] = useState(false);
  const handleCloseEditFamDel2 = () => setShowEditFamDel2(false);
  const handleShowEditFamDel2 = (no) => {
    const newData = data.filter((order) => order.no !== no);

    // Update the state with the new filtered data
    setData(newData);

    setShowEditFamDel2(true);
  };

  const [showCreSubSuc, setShowCreSubSuc] = useState(false);
  const handleCloseCreSubSuc = () => setShowCreSubSuc(false);
  const handleShowCreSubSuc = () => {
    setShowCreSubSuc(true);
    setTimeout(() => {
      setShowCreSubSuc(false);
    }, 2000);
  };

  // edit family
  const [showEditProduction, setShowEditProduction] = useState(false);
  const handleCloseEditProduction = () => setShowEditProduction(false);
  const handleShowEditProduction = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      role_id: user.role_id,
      email: user.email,
      password: "", // Set password to empty string
      confirm_password: "", // Set confirm_password to empty string
      invite: true
    });
    setShowEditProduction(true);
  };

  // edit family Success
  const [showEditProductionSuc, setShowEditProductionSuc] = useState(false);
  const handleCloseEditProductionSuc = () => setShowEditProductionSuc(false);
  const handleShowEditProductionSuc = () => {
    setShowEditProductionSuc(true);
    setTimeout(() => {
      setShowEditProductionSuc(false);
    }, 2000);
  };

  // edit family Eliminat
  const [showEditProductionDel, setShowEditProductionDel] = useState(false);
  const handleCloseEditProductionDel = () => setShowEditProductionDel(false);
  const handleShowEditProductionDel = () => {
    setShowEditProductionDel(true);
    setTimeout(() => {
      setShowEditProductionDel(false);
    }, 2000);
  };
  const [showEditProductionDel2, setShowEditProductionDel2] = useState(false);
  const handleCloseEditProductionDel2 = () => setShowEditProductionDel2(false);
  const handleShowEditProductionDel2 = () => {
    setShowEditProductionDel2(true);
    setTimeout(() => {
      setShowEditProductionDel2(false);
    }, 2000);
  };

  const [data, setData] = useState([]);

  // filter

  const [selectedFilters, setSelectedFilters] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [isFilterActive, setIsFilterActive] = useState(false);

  // const handleCheckboxChange = (event) => {
  //   const { name, checked } = event.target;
  //   setSelectedFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [name]: checked
  //   }));
  // };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        [name]: checked
      };
      const anyFilterActive = Object.values(newFilters).some((value) => value);
      setIsFilterActive(anyFilterActive);
      return newFilters;
    });
  };

  // const clearFilter = (roleId) => {
  //   setSelectedFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [roleId]: false
  //   }));
  // };
  const clearFilter = (roleId) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        [roleId]: false
      };
      const anyFilterActive = Object.values(newFilters).some((value) => value);
      setIsFilterActive(anyFilterActive);
      return newFilters;
    });
  };
  const filterUser = (user) => {
    const activeFilters = Object.keys(selectedFilters).filter(
      (roleId) => selectedFilters[roleId]
    );

    if (activeFilters.length === 0) {
      return true;
    }

    return activeFilters.includes(user.role_id.toString());
  };
  const filteredUsers = users.filter((user) => {
    const userName = user.name.toLowerCase();
    return (
      userName.includes(searchTerm.toLowerCase()) &&
      filterUser(user) 
    );
  });

  const filteredItems = data.filter((item) => {
    const activeFilters = Object.keys(selectedFilters).filter(
      (filter) => selectedFilters[filter]
    );

    if (activeFilters.length === 0) {
      return true;
    }

    return activeFilters.includes(item.Role);
  });
  // pagination
  useEffect(
    () => {
      setCurrentPage(1);
    },
    [selectedFilters, searchTerm]
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // *************************************API*****************************************

  // Function to fetch users and roles on initial load or when token changes
  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = "Se requiere el nombre";
    } else if (data.name.length < 5) {
      errors.name = "El nombre debe tener entre 5 caracteres";
    }

    if (!data.role_id) {
      errors.role = "Se requiere el rol";
    }

    if (!data.email.trim()) {
      errors.email = "correo electronico es requerido";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)
    ) {
      errors.email = "el correo electrónico es invalido";
    }

    if (!data.password) {
      errors.password = "Se requiere el contraseña";
    } else if (data.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(
        data.password
      )
    ) {
      errors.password =
        "La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial";
    }

    if (!data.confirm_password) {
      errors.confirm_password = "Se requiere el confirma la contraseña";
    }
    if (data.password !== data.confirm_password) {
      errors.confirm_password = "Las contraseñas no coinciden";
    }
    return errors;
  };

  const fetchUser = async () => {
    // setIsProcessing(true);

    await axios
      .get(`${apiUrl}/get-users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setUsers(response.data);
        // setIsProcessing(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    // setIsProcessing(false);

  };
  const fetchRole = () => {

    axios
      .get(`${apiUrl}/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setRoles(response.data);

      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });

  };

  console.log(isProcessing);


  const getRoleName = (roleId) => {
    const role = roles.find((role) => role.id === roleId);
    return role ? role.name : "Unknown Role";
  };

  // Replace handleChange with this optimized version
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data without triggering re-render
    formData[name] = value;

    // Validate only the changed field
    // const fieldError = validateField(name, value);
    if(errors[name] || name == "role_id"){
    setErrors(prev => ({
      ...prev,
      [name]: undefined,
      role: name == "role_id" ? undefined : prev.role
    }));
  }
}

  // // Add field-level validation
  // const validateField = (fieldName, value) => {
  //   switch (fieldName) {
  //     case 'name':
  //       if (!value.trim()) return "Se requiere el nombre";
  //       if (value.length < 5) return "El nombre debe tener entre 5 caracteres";
  //       return null;
      
  //     case 'email':
  //       if (!value.trim()) return "correo electronico es requerido";
  //       if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
  //         return "el correo electrónico es invalido";
  //       }
  //       return null;

  //   if (name === "name") {
  //     if (value.length >= 5) {
  //       setErrors((prevErrors) => ({
  //         ...prevErrors,
  //         name: undefined // Clear the name error when length is 5 or more
  //       }));
  //     } else {
  //       setErrors((prevErrors) => ({
  //         ...prevErrors,
  //         name: "El nombre debe tener entre 5 caracteres" // Set error if less than 5 characters
  //       }));
  //     }
  //   } else {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       [name]: undefined // Clear error for other fields
  //     }));
  //   }
  // };

  // update user

  const updateUser = async (dataToUpdate) => {
    handleCloseEditProduction();
    setIsProcessing(true);
    try {

      const response = await axios.post(
        `${apiUrl}/update-user/${selectedUser.id}`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setIsProcessing(false);

      await fetchUser();
      handleCloseEditProduction();
      handleShowEditProductionSuc();
      if (response?.data?.notification) {
        //enqueueSnackbar (response?.data?.notification, { variant: 'success' })
        // playNotificationSound();;
      }


    } catch (error) {
      console.error("Error updating user:", error);
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;
    }
    setIsProcessing(false);

  };

  const [showDuplicateEmailModal, setShowDuplicateEmailModal] = useState(
    false
  );
  const handleCloseDuplicateEmailModal = () => {
    setShowDuplicateEmailModal(false);
    setFormData((prevState) => ({
      ...prevState,
      email: ""
    }));
  };

  // create user
  const handleSubmit = async () => {
    // Collect current form values
    const currentFormData = {
      name: formRefs.name.current.value,
      email: formRefs.email.current.value,
      password: formRefs.password.current.value,
      confirm_password: formRefs.confirm_password.current.value,
      role_id: formRefs.role_id.current.value,
      invite: true
    };

    // Validate all fields
    // console.log(currentFormData);
    const validationErrors = validateForm(currentFormData);
    setErrors(validationErrors);
    // console.log(errors);
    
    if (Object.keys(validationErrors).length !== 0) {
      // console.log(errors);
      return;   
    }
    // handleClose();
    setIsProcessing(true);
    try {
      if (selectedUser) {
        const dataToUpdate = { ...currentFormData };
        if (!dataToUpdate.password) {
          delete dataToUpdate.password;
          delete dataToUpdate.confirm_password;
        }

        // console.log(dataToUpdate);
        await updateUser(dataToUpdate);
      } else {
        const emailExists = users.some((user) => user.email === currentFormData.email);
        setIsProcessing(false);

        if (emailExists) {
          handleClose();
          setShowDuplicateEmailModal(true);

          setTimeout(() => {
            setShowDuplicateEmailModal(false);
            setFormData((prevState) => ({
              ...prevState,
              email: ""
            }));
          }, 3000);
          return;
        }
        handleClose();
        // console.log(currentFormData);
        
        // Create new user
        const response = await axios.post(`${apiUrl}/create-user`, {...currentFormData,admin_id}, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (response.status === 200) {
          handleShowCreSubSuc();
          handleClose();
          fetchUser();
          setIsProcessing(false);
          //enqueueSnackbar (response.data.notification, { variant: 'success' })
          // playNotificationSound();;
        }
      }
    } catch (error) {
      console.error("Error creating or updating user:", error);
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;
      // Handle API errors here
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "An error occurred. Please try again." });
      }
    }
    setIsProcessing(false);
  };

  const handleDelete = async (userId) => {
    setIsProcessing(true);

    try {
      const response = await axios.post(`${apiUrl}/user/update-status/${userId}`, {
        status: 'Suspender'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsProcessing(false);
      fetchUser();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setIsProcessing(false);
    handleShowEditProductionDel();

  };
  const handleActiveUser = async (userId) => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${apiUrl}/user/update-status/${userId}`, {
        status: 'Activa'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUser();
      setIsProcessing(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setIsProcessing(false);
    handleShowEditProductionDel2();
  };

  const handleClose = () => {
    setShow(false);
    setSelectedUser(null);
    setErrors({}); // Clear errors
  };
  // const handleShow = () => setShow(true);

  const handleShow = () => {
    setFormData({
      name: "",
      role_id: "",
      email: "",
      password: "",
      confirm_password: "",
      invite: true

    });
    setSelectedUser(null);
    setShow(true);
    setErrors({}); // Clear errors
    setFormKey((prevKey) => prevKey + 1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const [showEditFam, setShowEditFam] = useState(false);
  const [showEditFam2, setShowEditFam2] = useState(false);
  const handleCloseEditFam = () => {
    setShowEditFam(false);
    setUserToDelete(null);
  };
  const handleCloseEditFam2 = () => {
    setShowEditFam2(false);
    setUserActive(null);
  };
  const handleShowEditFam = (userId) => {
    setUserToDelete(userId);
    setShowEditFam(true);
  };
  const handleShowEditFam2 = (userId) => {
    setUserActive(userId);
    setShowEditFam2(true);
  };

  return (
    <div>
      <Header />
      <div className="d-flex overflow-scroll">
        <div>
          <Sidenav />
        </div>
        <div
          className="flex-grow-1 sidebar"
          style={{ backgroundColor: "#1F2A37" }}
        >
          <div>
            <div style={{ padding: "20px" }}>
              <div className="j-usuarios-h2">
                <h2 className="text-white">Usuarios</h2>
              </div>
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="me-2 ">
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
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <Dropdown data-bs-theme="dark" className="m_drop">
                    <Dropdown.Toggle
                      id="dropdown-button-dark-example1"
                      variant="outline-primary"
                      style={{ fontSize: "12px" }}
                      className="btn btn-outline-primary b_togllle b_border_out b_ttt"
                    >
                      <FaFilter /> &nbsp; {" "}
                      <span className="b_ttt">Filtro</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="m14 m_filter">
                      {roles.map((role) => (
                        <div
                          className="px-3 py-1 d-flex gap-2 align-items-center fw-500"
                          key={role.id}
                          style={{
                            opacity: selectedFilters[role.id] ? 1 : 0.5
                          }}
                        >
                          <input
                            className="j-change-checkbox j_check_white"
                            type="checkbox"
                            name={role.id.toString()}
                            checked={selectedFilters[role.id] || false}
                            onChange={handleCheckboxChange}
                          />
                          <span className="fw-500">
                            {roleNamesInSpanish[role.id] || role.name} {/* Display name in Spanish */}
                          </span>
                        </div>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div>
                  <button
                    className="btn text-white j-btn-primary text-nowrap m12 "
                    onClick={handleShow}
                  >
                    <FaPlus /> Invitar
                  </button>
                  {/* create user */}
                  <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop={true}
                    keyboard={false}
                    className="m_modal m_user"
                  >
                    <Modal.Header
                      closeButton
                      className="m_borbot  b_border_bb mx-3 ps-0"
                    >
                      <Modal.Title>Invitar usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="border-0 pb-0">
                      <form key={formKey}>
                        <div>
                          <div className="d-flex row">
                            <div className="col-6">
                              <label className="mb-2">Nombre</label>
                              <div
                                className="m_group "
                                style={{ width: "100%" }}
                              >
                                <svg
                                  className="m_icon"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <input
                                  ref={formRefs.name}
                                  className="bm_input"
                                  style={{ width: "100%" }}
                                  type="text"
                                  placeholder="Escribir . . ."
                                  name="name"
                                  onChange={handleChange}
                                  autocomplete="off"
                                />
                              </div>
                              {errors.name && (
                                <div className="text-danger errormessage">
                                  {errors.name}
                                </div>
                              )}
                            </div>
                            <div className="col-6">
                              <div className="me-2 mb-2">
                                <label className="mb-2">Rol</label>
                                <div className="m_group">
                                  <select
                                    ref={formRefs.role_id}
                                    className="jm_input"
                                    name="role_id"
                                    onChange={handleChange}
                                  >
                                    <option value="">Seleccionar Rol</option>
                                    {/* {roles.map((role) => (
                                      <option key={role.id} value={role.id}>
                                        {roleNamesInSpanish[role.id] ||
                                          role.name}
                                      </option>
                                    ))} */}
                                    {roles.map((role) => {
                                      console.log();
                                      
                                      if (role.name !== 'admin'  && role.name !== 'superadmin') {
                                        return (
                                          <option key={role.id} value={role.id}>
                                            {roleNamesInSpanish[role.id] || role.name}
                                          </option>
                                        );
                                      }
                                      return null; // Skip rendering admin role if user is not superadmin@gmail.com
                                    })}
                                  </select>
                                </div>
                                {errors.role && (
                                  <div className="text-danger errormessage">
                                    {errors.role}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="mt-2">
                              <label className="mb-2">Correo</label>
                              <div className="m_group j_group">
                                <svg
                                  className="m_icon"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z" />
                                  <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z" />
                                </svg>
                                <input
                                  ref={formRefs.email}
                                  className="bm_input"
                                  type="email"
                                  name="email"
                                  // value={formData.email}
                                  onChange={handleChange}
                                  placeholder="Escribir . . ."
                                  autocomplete="new-email"
                                />
                              </div>
                              {errors.email && (
                                <div className="text-danger errormessage">
                                  {errors.email}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between mt-2 row">
                            <div className="col-6">
                              <label
                                htmlFor="password"
                                className="form-label text-white"
                              >
                                Contraseña
                              </label>
                              <div className="icon-input">
                                <IoMdLock className="i" />
                                <input
                                  ref={formRefs.password}
                                  type={showPassword ? "text" : "password"}
                                  className="form-control j-user-password"
                                  placeholder="Escribir . . ."
                                  name="password"
                                  // value={formData.password}
                                  onChange={handleChange}
                                  autocomplete="new-password"
                                />
                                <button
                                  className="border-0 j-user-hide bg-transparent"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowPassword(
                                      (prevState) => !prevState
                                    );
                                  }}
                                >
                                  {showPassword ? (
                                    <FaEye className="i" />
                                  ) : (
                                    <FaEyeSlash className="i" />
                                  )}
                                </button>
                              </div>
                              {errors.password && (
                                <div className="text-danger errormessage">
                                  {errors.password}
                                </div>
                              )}
                            </div>
                            <div className="col-6">
                              <div className="mb-2 me-2">
                                <label
                                  htmlFor="password"
                                  className="form-label text-white"
                                >
                                  Confirmar Contraseña
                                </label>
                                <div className="icon-input">
                                  <IoMdLock className="i" />
                                  <input
                                    ref={formRefs.confirm_password}
                                    type={
                                      showcomfirmPassword ? (
                                        "text"
                                      ) : (
                                        "password"
                                      )
                                    }
                                    className="form-control j-user-password"
                                    id="password"
                                    placeholder="Escribir . . ."
                                    name="confirm_password"
                                    // value={formData.confirm_password}
                                    onChange={handleChange}
                                    autocomplete="off"
                                  />
                                  <button
                                    className="border-0 j-user-hide bg-transparent"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setShowcomfirmPassword(
                                        (prevState) => !prevState
                                      );
                                    }}
                                  >
                                    {showcomfirmPassword ? (
                                      <FaEye className="i" />
                                    ) : (
                                      <FaEyeSlash className="i" />
                                    )}
                                  </button>
                                </div>
                                {errors.confirm_password && (
                                  <div className="text-danger errormessage">
                                    {errors.confirm_password}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                      <Button
                        className="j-btn-primary"
                        onClick={() => {
                          handleSubmit();
                        }}
                        variant="primary"
                      >
                        <IoIosSend className="me-2" />Invitar
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  {/* =============== Email Verify ================  */}
                  <Modal
                    show={showDuplicateEmailModal}
                    onHide={handleCloseDuplicateEmailModal}
                    backdrop={true}
                    keyboard={false}
                    className="m_modal m_user"
                  >
                    <Modal.Header closeButton className="border-0" />
                    <Modal.Body>
                      <div className="text-center">
                        {/* <img src={require("../Image/warning-icon.png")} alt="Warning" /> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          width={85}
                          height={85}
                          x={0}
                          y={0}
                          viewBox="0 0 330 330"
                          style={{ enableBackground: "new 0 0 512 512" }}
                          xmlSpace="preserve"
                          className
                        >
                          <g>
                            <path
                              d="M165 0C74.019 0 0 74.02 0 165.001 0 255.982 74.019 330 165 330s165-74.018 165-164.999S255.981 0 165 0zm0 300c-74.44 0-135-60.56-135-134.999S90.56 30 165 30s135 60.562 135 135.001C300 239.44 239.439 300 165 300z"
                              fill="#f05151"
                              opacity={1}
                              data-original="#000000"
                              className
                            />
                            <path
                              d="M164.998 70c-11.026 0-19.996 8.976-19.996 20.009 0 11.023 8.97 19.991 19.996 19.991 11.026 0 19.996-8.968 19.996-19.991 0-11.033-8.97-20.009-19.996-20.009zM165 140c-8.284 0-15 6.716-15 15v90c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15v-90c0-8.284-6.716-15-15-15z"
                              fill="#f05151"
                              opacity={1}
                              data-original="#000000"
                              className
                            />
                          </g>
                        </svg>
                        <p className="mb-0 mt-2 h6">Email ya existe</p>
                        <p className="opacity-75">
                          Este correo electrónico ya está registrado. Por
                          favor, utilice otro correo electrónico.
                        </p>
                      </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                      <Button
                        variant="danger"
                        onClick={() => setShowDuplicateEmailModal(false)}
                      >
                        Eliminar
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  {/* ============================================ */}
                  <Modal
                    show={showCreSubSuc}
                    onHide={handleCloseCreSubSuc}
                    backdrop={true}
                    keyboard={false}
                    className="m_modal m_user"
                  >
                    <Modal.Header closeButton className="border-0" />
                    <Modal.Body>
                      <div className="text-center">
                        <img
                          src={require("../Image/check-circle.png")}
                          alt=""
                        />
                        <p className="mb-0 mt-2 h6">
                          Enlace enviado exitosamente
                        </p>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="p-3 ps-0 m_bgblack d-flex align-items-center">
                  {isFilterActive && (
                    <span className="text-white m14">Filtro:</span>
                  )}
                  {roles.map(
                    (role) =>
                      selectedFilters[role.id] && (
                        <div
                          key={role.id}
                          className="d-inline-block ms-2 d-flex align-items-center m12"
                        >
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => clearFilter(role.id)}
                            className="rounded-3 m12"
                            style={{ fontWeight: "500" }}
                          >
                            {roleNamesInSpanish[role.id]} &nbsp;
                            <span className="m16">
                              <MdClose />
                            </span>
                          </Button>
                        </div>
                      )
                  )}
                </div>
                <div
                  className="text-white  d-flex  b_arrow"
                  style={{ alignItems: "baseline", cursor: "pointer" }}
                >
                  <div
                    className="pe-3 mt-2 b_svg "
                    style={{ color: "#9CA3AF" }}
                  >
                    <FaAngleLeft
                      className="bj-right-icon-size-2"
                      onClick={handlePrevPage}
                      style={{
                        cursor: currentPage === 1 ? "not-allowed" : "pointer"
                      }}
                    />
                  </div>
                  <span className="mt-2" style={{ color: "#9CA3AF" }}>
                    <FaAngleRight
                      className="bj-right-icon-size-2"
                      onClick={handleNextPage}
                      style={{
                        cursor:
                          currentPage === totalPages
                            ? "not-allowed"
                            : "pointer"
                      }}
                    />
                  </span>
                  <div className="text-white bj-delivery-text-3  d-flex  pt-1 ms-5">
                    <p
                      className="b_page_text me-4"
                      style={{ color: "#9CA3AF" }}
                    >
                      vista{" "}
                      <span className="text-white">
                        {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)}
                      </span>{" "}
                      de{" "}
                      <span className="text-white">
                        {filteredUsers.length}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="b_table1">
              {currentUsers.length > 0 ? (
                <table className="b_table mb-4 p-0">
                  <thead>
                    <tr className="b_thcolor">
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Correo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-white b_btnn ">
                    {currentUsers.map(
                      (user) =>
                      (
                        <tr key={user.id} className="b_row">
                          <td className="b_text_w">{user.name}</td>
                          <td className="b_text_w">
                            {roleNamesInSpanish[user.role_id] ||
                              "Rol Desconocido"}
                          </td>
                          <td className="b_text_w">{user.email}</td>
                          <td>
                            {user.status === "Activa" ? (
                              <button className="btn btn-success" onClick={() => handleShowEditFam(user.id)} style={{ minWidth: "120px" }}>
                                Activo
                              </button>
                            ) : (
                              <button className="btn btn-danger" onClick={() => handleShowEditFam2(user.id)} style={{ minWidth: "120px" }} >
                                Suspender
                              </button>
                            )}
                          </td>
                          <td className="b_text_w ">
                            <button
                              className="b_edit me-5"
                              onClick={() => handleShowEditProduction(user)}
                            >
                              <MdEditSquare />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-white py-4">
                  No se han encontrado resultados
                </div>
              )}
            </div>
            {/* //////////////////// Delete Popup /////////////////// */}
            {/* Delete Confirmation Modal */}
            <Modal
              show={showEditProductionDel}
              onHide={handleCloseEditProductionDel}
              backdrop={true}
              keyboard={false}
              className="m_modal m_user"
            >
              <Modal.Header closeButton className="border-0" />
              <Modal.Body>
                <div className="text-center">
                  <img src={require("../Image/trash-check 1.png")} alt="" />
                  <p className="opacity-75 mt-2">
                  Usuario Suspendido con éxito
                  </p>
                </div>
              </Modal.Body>
            </Modal>
            {/* Edit User */}
            <Modal
              show={showEditProduction}
              onHide={handleCloseEditProduction}
              backdrop={true}
              keyboard={false}
              className="m_modal m_user"
            >
              <Modal.Header closeButton className="m_borbot b_border_bb mx-3 ps-0">
                <Modal.Title>Editar usuario</Modal.Title>
              </Modal.Header>
              <Modal.Body className="border-0 pb-0">
                <div>
                  <div className="d-flex row">
                    <div className="col-6">
                      <label className="mb-2">Nombre</label>
                      <div className="m_group " style={{ width: "100%" }}>
                        <svg
                          className="m_icon"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <input
                          ref={formRefs.name}
                          className="bm_input"
                          style={{ width: "100%" }}
                          type="text"
                          placeholder="Escribir . . ."
                          name="name"
                          defaultValue={formData.name}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </div>
                      {errors.name && (
                        <div className="text-danger errormessage">
                          {errors.name}
                        </div>
                      )}
                    </div>
                    <div className="col-6">
                      <div className="me-2 mb-2">
                        <label className="mb-2">Rol</label>
                        <div className="m_group">
                          <select
                            ref={formRefs.role_id}
                            className="jm_input"
                            name="role_id"
                            defaultValue={formData.role_id}
                            onChange={handleChange}
                          >
                            {roles.map((role) => {
                               if (role.name !== 'admin'  && role.name !== 'superadmin') {
                                return (
                                  <option key={role.id} value={role.id}>
                                    {roleNamesInSpanish[role.id] ||
                                      role.name}
                                  </option>
                                );
                              }
                              return null; // Skip rendering admin role if user is not superadmin@gmail.com
                            })}
                          </select>
                        </div>
                        {errors.role && (
                          <div className="text-danger errormessage">
                            {errors.role}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="mt-3 ">
                      <label className="mb-2">Correo</label>
                      <div className="m_group  j_group ">
                        <svg
                          className="m_icon"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z" />
                          <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z" />
                        </svg>
                        <input
                          ref={formRefs.email}
                          className="bm_input"
                          type="email"
                          placeholder="Escribir . . ."
                          name="email"
                          defaultValue={formData.email}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </div>
                      {errors.email && (
                        <div className="text-danger errormessage">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-3 row">
                    <div className="col-6">
                      <label htmlFor="password" className="form-label text-white">
                        Nueva Contraseña (opcional)
                      </label>
                      <div className="icon-input">
                        <IoMdLock className="i" />
                        <input
                          ref={formRefs.password}
                          type={editshowPassword ? "text" : "password"}
                          className="form-control j-user-password"
                          placeholder="-"
                          name="password"
                          defaultValue={formData.password}
                          onChange={handleChange}
                          autoComplete="new-password"
                        />
                        <button
                          className="border-0 j-user-hide bg-transparent"
                          onClick={() => seteditShowPassword((prevState) => !prevState)}
                        >
                          {editshowPassword ? <FaEye className="i" /> : <FaEyeSlash className="i" />}
                        </button>
                      </div>
                      {errors.password && (
                        <div className="text-danger errormessage">{errors.password}</div>
                      )}
                    </div>
                    <div className="col-6">
                      <div className="mb-2 me-2">
                        <label htmlFor="confirm_password" className="form-label text-white">
                          Confirmar Nueva Contraseña
                        </label>
                        <div className="icon-input">
                          <IoMdLock className="i" />
                          <input
                            ref={formRefs.confirm_password}
                            type={editshowcomfirmPassword ? "text" : "password"}
                            className="form-control j-user-password"
                            placeholder="-"
                            name="confirm_password"
                            defaultValue={formData.confirm_password}
                            onChange={handleChange}
                            autoComplete="new-password"
                          />
                          <button
                            className="border-0 j-user-hide bg-transparent"
                            onClick={() => seteditShowcomfirmPassword((prevState) => !prevState)}
                          >
                            {editshowcomfirmPassword ? <FaEye className="i" /> : <FaEyeSlash className="i" />}
                          </button>
                        </div>
                        {errors.confirm_password && (
                          <div className="text-danger errormessage">{errors.confirm_password}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="border-0">
                <Button
                  variant="primary"
                  className="b_btn_pop"
                  onClick={handleSubmit}
                >
                  Guardar cambios
                </Button>
              </Modal.Footer>
            </Modal>
            {/* edit production success  */}
            <Modal
              show={showEditProductionSuc}
              onHide={handleCloseEditProductionSuc}
              backdrop={true}
              keyboard={false}
              className="m_modal  m_user"
            >
              <Modal.Header closeButton className="border-0" />
              <Modal.Body>
                <div className="text-center">
                  <img src={require("../Image/check-circle.png")} alt="" />
                  <p className="mb-0 mt-2 h6">Sus cambios</p>
                  <p className="opacity-75">
                    Han sido modificados exitosamente
                  </p>
                </div>
              </Modal.Body>
            </Modal>

            {/* {/ user suspend /} */}
            <Modal
              show={showEditFam}
              onHide={handleCloseEditFam}
              backdrop={true}
              keyboard={false}
              className="m_modal jay-modal m_user"
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
                    ¿Quieres suspender a esta Usuario?
                  </p>
                </div>
              </Modal.Body>
              <Modal.Footer className="border-0 justify-content-end">
                <Button
                  className="j-tbl-btn-font-1 b_btn_close"
                  variant="danger"
                  onClick={() => {
                    handleDelete(userToDelete);
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
            {/* {/ user active /} */}
            <Modal
              show={showEditFam2}
              onHide={handleCloseEditFam2}
              backdrop={true}
              keyboard={false}
              className="m_modal jay-modal m_user"
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
                    ¿Quieres activar a esta Usuario?
                  </p>
                </div>
              </Modal.Body>
              <Modal.Footer className="border-0 justify-content-end">
                <Button
                  className="j-tbl-btn-font-1 b_btn_close"
                  variant="danger"
                  onClick={() => {
                    handleActiveUser(userActive);
                    handleCloseEditFam2();
                    handleShowEditFamDel2();
                  }}
                >
                  Si, seguro
                </Button>
                <Button
                  className="j-tbl-btn-font-1 "
                  variant="secondary"
                  onClick={() => {
                    handleCloseEditFam2();
                  }}
                >
                  No, cancelar
                </Button>
              </Modal.Footer>
            </Modal>
            {/* Active Confirmation Modal */}
            <Modal
              show={showEditProductionDel2}
              onHide={handleCloseEditProductionDel2}
              backdrop={true}
              keyboard={false}
              className="m_modal m_user"
            >
              <Modal.Header closeButton className="border-0" />
              <Modal.Body>
                <div className="text-center">
                  <img src={require("../Image/checkbox1.png")} alt="" />
                  <p className="opacity-75 mt-2">
                    Usuario activo exitosamente
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
      </div>
    </div>
  );
};

export default Usuarios;
