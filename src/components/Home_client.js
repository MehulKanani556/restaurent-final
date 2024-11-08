import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidenav from "./Sidenav";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdEditSquare } from "react-icons/md";
import { RiCloseLargeFill, RiDeleteBin5Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import axios from "axios";
import Loader from "./Loader";
import { Modal, Spinner } from "react-bootstrap";

function Home_client() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const [isProcessing, setIsProcessing] = useState(false);
  const admin_id = localStorage.getItem("admin_id");
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesdeMonth, setSelectedDesdeMonth] = useState(1);
  const [selectedHastaMonth, setSelectedHastaMonth] = useState(
    new Date().getMonth() + 1
  );
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [orderUser, setOrderUser] = useState([]);
  const [filteredOrderUser, setFilteredOrderUser] = useState([]);

  document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll("#pills-tab button");

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove 'bg-primary', 'text-light', 'bg-light', 'text-dark' from all tabs
        tabs.forEach((button) => {
          button.classList.remove("bg-primary", "text-light");
          button.classList.add("bg-light", "text-dark");
        });

        // Add 'bg-primary' and 'text-light' to the clicked tab
        tab.classList.remove("bg-light", "text-dark");
        tab.classList.add("bg-primary", "text-light");
      });
    });
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrderUser.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrderUser.length / itemsPerPage);
  const filteredUsers = error
    ? []
    : filteredOrderUser.filter((user) => {

      const displayName = user?.firstname || user?.business_name;
      const fullName = `${displayName} ${user?.lastname || ''}`.toLowerCase();
      const searchLower = searchTerm?.toLowerCase();

      return (
        fullName.includes(searchLower) ||
        displayName?.toLowerCase().includes(searchLower) ||
        (user?.lastname?.toLowerCase().includes(searchLower) || '') ||
        user?.email?.toLowerCase().includes(searchLower)  ||
        user.rut?.toLowerCase().includes(searchLower)
      );
    });
  const indexOfLastFilteredItem = currentPage * itemsPerPage;
  const indexOfFirstFilteredItem = indexOfLastFilteredItem - itemsPerPage;
  const currentFilteredItems = error
    ? []
    : filteredUsers.slice(indexOfFirstFilteredItem, indexOfLastFilteredItem);

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredUsers.length / itemsPerPage))
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  useEffect(
    () => {
      if (selectedDesdeMonth > selectedHastaMonth) {
        setError("Hasta month must be greater than or equal to Desde month.");
        setUsers([]);
      } else {
        const filtered = orderUser.filter(user => {
          const userMonth = new Date(user.created_at).getMonth() + 1; // Assuming user.date is the date field
          return userMonth >= selectedDesdeMonth && userMonth <= selectedHastaMonth;
        });
        setFilteredOrderUser(filtered);
        setError("");
      }
    },
    [orderUser, selectedDesdeMonth, selectedHastaMonth]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchUser = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${apiUrl}/get-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setIsProcessing(false);
  };


  // const fetchpaymentUser = async () =>{
  //   try {
  //     const response = await axios.get(`${apiUrl}/get-payments`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setOrderUser(response.data);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // }

  // const fetchPaymentUser = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/get-payments`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     console.log(response.data.result);


  //     // Remove duplicates based on firstname
  //     const uniqueUsers = removeDuplicatesByFirstname(response.data.result);

  //     setOrderUser(uniqueUsers);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // }

  // const removeDuplicatesByFirstname = (users) => {
  //   const uniqueUsers = {};
  //   return users.filter(user => {
  //     if (!uniqueUsers[user.firstname] && !uniqueUsers[user.business_name] && !uniqueUsers[user.email] ) {
  //       uniqueUsers[user.firstname] = true;
  //       return true;
  //     }
  //     return false;
  //   });
  // }

  // console.log(orderUser);

  const fetchPaymentUser = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${apiUrl}/get-payments`, { admin_id: admin_id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // console.log(response.data.result);

      // Group users and collect their order_master_ids
      const groupedUsers = groupUsersByDetails(response.data.result);

      setOrderUser(groupedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setIsProcessing(false);
  }

  const groupUsersByDetails = (users) => {
    setIsProcessing(true);
    const groupedUsers = {};

    users.forEach(user => {
      const displayName = user.firstname || user.business_name;
    const fullName = `${displayName} ${user.lastname || ''}`.trim();
    const key = `${fullName}|${user.rut}`;

      if (!groupedUsers[key]) {
        groupedUsers[key] = {
          ...user,
          orderIds: [user.order_master_id]
        };
      } else {
        groupedUsers[key].orderIds.push(user.order_master_id);
      }
    });
    setIsProcessing(false);

    return Object.values(groupedUsers);
  }

  // console.log(orderUser);

  useEffect(
    () => {
      if (token) {
        fetchUser();
        fetchPaymentUser();
      }
    },
    [token, selectedDesdeMonth, selectedHastaMonth]
  );

  const handleViewDetails = (user) => {
    navigate("/home/client/detail", { state: { user } });
    // navigate("/home/client/detail/")
  }

  return (
    <div className="b_bg_color">
      <Header />

      <div className="d-flex">
        <div>
          <Sidenav />
        </div>
        <div
          className="flex-grow-1 sidebar w-50"
          style={{ backgroundColor: "#1F2A37" }}
        >

          <div>
            <div className="overflow-hidden">

            <div className="ms-4 mt-4">
              <h4 className="text-white bj-delivery-text-65">Clientes</h4>
            </div>
            <div className="d-flex b_main_search ms-4 justify-content-between mt-3 mb-3">
              <div>
                <div className="">
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
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between me-4 b_btn_main">
              <div className="ms-4 d-flex gap-5">
                <div className="mb-3 text-white  ">
                  <label
                    htmlFor="exampleFormControlInput6"
                    className="form-label "
                  >
                    Desde
                  </label>
                  <select
                    className="form-select  b_select border-0 py-2  "
                    style={{ borderRadius: "6px" }}
                    aria-label="Default select example"
                    value={selectedDesdeMonth}
                    onChange={(e) => setSelectedDesdeMonth(e.target.value)}
                  >
                    <option selected value="1">
                      Enero
                    </option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre </option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                </div>
                <div className="mb-3  text-white">
                  <label
                    htmlFor="exampleFormControlInput6"
                    className="form-label "
                  >
                    Hasta
                  </label>
                  <select
                    className="form-select  b_select border-0 py-2 "
                    style={{ borderRadius: "6px" }}
                    aria-label="Default select example "
                    value={selectedHastaMonth}
                    onChange={(e) => setSelectedHastaMonth(e.target.value)}
                  >
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option selected value="3">
                      Marzo
                    </option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre </option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                </div>
                {error && (
                  <div className="alert alert-danger d-flex justify-content-between pointer">
                    {error}{" "}
                    <div
                      className="text-black d-flex align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        setError("");
                        setSelectedDesdeMonth(1);
                      }}
                    >
                      <RiCloseLargeFill />{" "}
                    </div>
                  </div>
                )}
              </div>

              {/* <div className='text-white  d-flex  b_arrow' style={{ alignItems: "baseline" }}>
                            <div className='pe-3 mt-2 b_svg ' style={{ color: "#9CA3AF" }}><FaAngleLeft className='bj-right-icon-size-2' /></div> <span className='mt-2' style={{ color: "#9CA3AF" }}><FaAngleRight className='bj-right-icon-size-2' /></span>
                            <div className='text-white bj-delivery-text-3  d-flex  pt-1 ms-5'>
                                <p className='b_page_text me-4' style={{ color: "#9CA3AF" }}>vista <span className='text-white'>1-15</span> de <span className='text-white'>30</span></p>
                            </div>
                        </div> */}
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
                    disabled={currentPage === 1}
                  />
                </div>
                <span className="mt-2" style={{ color: "#9CA3AF" }}>
                  <FaAngleRight
                    className="bj-right-icon-size-2"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  />
                </span>
                <div className="text-white bj-delivery-text-3  d-flex  pt-1 ms-5">
                  <p
                    className="b_page_text me-4"
                    style={{ color: "#9CA3AF" }}
                  >
                    vista{" "}
                    <span className="text-white">
                      {indexOfFirstFilteredItem + 1}-{Math.min(
                        indexOfLastFilteredItem,
                        filteredUsers.length
                      )}
                    </span>{" "}
                    de{" "}
                    <span className="text-white">{filteredUsers.length}</span>
                  </p>
                </div>
              </div>
            </div>
            </div>
            <div className="b_table1 w-100" >
              <table className="b_table ">
                <thead>
                  <tr className="b_thcolor">
                    <th>DNI</th>
                    <th>Nombre </th>
                    <th>Correo</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody className="text-white b_btnn ">
                  {console.log(currentFilteredItems)}

                  {currentFilteredItems.length > 0 ?
                    currentFilteredItems.map((user) => (
                      // console.log(user),  

                      <tr key={user.id} className="b_row">
                        <td className="bj-table-client-text">{user.rut}</td>
                        <td className="bj-table-client-text">{user.firstname ? user.firstname : user.business_name} {user.lastname}</td>
                        <td className="b_text_w bj-table-client-text">
                          {user.email}
                        </td>
                        <td
                          className="b_text_w  b_idbtn my-3 "
                          style={{ borderRadius: "10px", fontSize: "12px" }}
                          onClick={() => handleViewDetails(user)}
                        >
                          Ver detalles
                        </td>
                      </tr>
                    ))
                    :
                    <tr>
                      <td colSpan="4" className="text-center"> {/* Added colSpan to span all columns */}
                        <div className="text-center">No hay datos para mostrar</div>
                      </td>
                    </tr>
                  }

                </tbody>
              </table>
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

        </div>
      </div>
    </div>
  );
}

export default Home_client;
