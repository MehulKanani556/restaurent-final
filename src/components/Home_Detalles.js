import React, { useRef, useState } from 'react'
import Header from './Header'
import Sidenav from './Sidenav'
import { Badge, Button, Modal } from 'react-bootstrap'
import { FaArrowLeft } from "react-icons/fa";
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
import { Link } from 'react-router-dom';
import checkbox from "../Image/checkbox1.png";

export default function Home_Detalles() {
  // const [counts, setCounts] = useState(item ? { [item.id]: 0 } : {});
  // const [counts, setCounts] = useState(item ? { [item.id]: 0 } : {});

  const obj1 = {
    name: "Damian Gonzales",
    Paltform: "Uber",
  }
  const [data2, setData2] = useState([
    {
      Date: "20/03/2024",
      Hour: "08:00 am",
      User: 'Kitechen',
      state: "Canceled"

    },
    {
      Date: "20/03/2024",
      Hour: "08:00 am",
      User: 'Kitechen',
      state: "Recieved"


    },
    {
      Date: "20/03/2024",
      Hour: "08:00 am",
      User: 'Kitechen',
      state: "Prepared"


    },
    {
      Date: "20/03/2024",
      Hour: "08:00 am",
      User: 'Kitechen',
      state: "Deliverd"
    },
    {
      Date: "20/03/2024",
      Hour: "08:00 am",
      User: 'Kitechen',
      state: "Finalized"
    },
    {
      Date: "20/03/2024",
      Hour: "08:00 am",
      User: 'Kitechen',
      state: "Prepared"
    },



    // More orders...
  ]);

  const [product, setproduct] = useState([
    {
      id: 1,
      image: pic1,
      name: 'Pollo frito crujiente',
      discription: 'Las esepecialidad de la casa',
      price: '$10.00',
      quantity: 2,
      note: 'Agregar nota'
    },
    {
      id: 1,
      image: pic2,
      name: 'Guitig',
      discription: 'Con gas',
      price: '$2.00',
      quantity: 2,
      note: 'Nota: Al clima'
    },

    {
      id: 1,
      image: pic3,
      name: 'Gelatina',
      discription: 'Con gas',
      price: '$2.00',
      quantity: 2,
      note: 'Nota: Con cereza a los lados'
    }
  ])
  const [date, setdate] = useState("17/03/2024")
  const [time, settime] = useState("08:00 am")
  const [order, setorder] = useState("01234")
  const [order1, setorder1] = useState("3")


  document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('#pills-tab button');

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        // Remove 'bg-primary', 'text-light', 'bg-light', 'text-dark' from all tabs
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
  const obj2 = [
    {
      image: img2,
      name: "Jugo",
      price: "2.00",
      code: "0124",
    },
    {
      image: img2,
      name: "Jugo",
      price: "2.00",
      code: "0124",
    },
    {
      image: img2,
      name: "Jugo",
      price: "2.00",
      code: "0124",
    },
    {
      image: img2,
      name: "Jugo",
      price: "2.00",
      code: "0124",
    },
    {
      image: img2,
      name: "Jugo",
      price: "2.00",
      code: "0124",
    },
    {
      image: img2,
      name: "Jugo",
      price: "2.00",
      code: "0124",
    },
    {
      image: img2,
      name: "Jugo",
      price: "2.00",
      code: "0124",
    },
    {
      image: img2,
      name: "Jugo",
      price: "2.00",
      code: "0124",
    },
  ];
  const checkboxs = [
    {
      menu: "Cocina 1",
    },
    {
      menu: "Cocina 2",
    },
    {
      menu: "Barra 1",
    },
    {
      menu: "Barra 2",
    },
  ];

  // Add producttion
  const [show1Prod, setShow1Prod] = useState(false);
  const handleClose1Prod = () => setShow1Prod(false);
  const handleShow1Prod = () => setShow1Prod(true);

  // create production center
  const [showCreate, setShowCreate] = useState(false);
  const handleCloseCreate = () => setShowCreate(false);
  const handleShowCreate = () => setShowCreate(true);

  // create production success
  const [showCreSucProduction, setShowCreSucProduction] = useState(false);
  const handleCloseCreSucProduction = () => setShowCreSucProduction(false);
  const handleShowCreSucProduction = () => setShowCreSucProduction(true);

  //  // Add producttion
  //  const [show1Prod, setShow1Prod] = useState(false);
  //  const handleClose1Prod = () => setShow1Prod(false);
  //  const handleShow1Prod = () => setShow1Prod(true);

  // Add product success
  const [show1AddSuc, setShow1AddSuc] = useState(false);
  const handleClose1AddSuc = () => setShow1AddSuc(false);
  const handleShow1AddSuc = () => setShow1AddSuc(true);

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

  const handleDivClick = () => {
    fileInputRef.current.click();
  };
  const [checkboxes, setCheckboxes] = useState({
    Bebidas: {
      isChecked: false,
      children: {
        Agua: false,
        Colas: false,
        Cervezas: false,
      },
    },
    Snacks: {
      isChecked: false,
      children: {
        Op1: false,
        Op2: false,
      },
    },
    Dulces: {
      isChecked: false,
      children: {
        Op1: false,
        Op2: false,
      },
    },
  });

  const handleParentCheckboxChange = (parentKey) => {
    setCheckboxes((prevState) => {
      const newParentCheckedState = !prevState[parentKey].isChecked;
      const newChildrenState = Object.keys(
        prevState[parentKey].children
      ).reduce((acc, key) => {
        acc[key] = newParentCheckedState;
        return acc;
      }, {});

      return {
        ...prevState,
        [parentKey]: {
          isChecked: newParentCheckedState,
          children: newChildrenState,
        },
      };
    });
  };

  const handleChildCheckboxChange = (parentKey, childKey) => {
    setCheckboxes((prevState) => ({
      ...prevState,
      [parentKey]: {
        ...prevState[parentKey],
        children: {
          ...prevState[parentKey].children,
          [childKey]: !prevState[parentKey].children[childKey],
        },
      },
    }));
  };


  return (
    <div>
      <div className="m_bg_black">
        <Header />
        <div className="d-flex">
          <Sidenav />
          <div className=" flex-grow-1 sidebar overflow-hidden">
            <div className="p-3 m_bgblack text-white  ">
              <a to="/" className='d-flex text-decoration-none' >
                <div className='btn btn-outline-primary text-nowrap py-2 d-flex mt-2 ms-3' style={{ borderRadius: "10px" }}> <FaArrowLeft className='me-2 mt-1' />Regresar</div>
              </a>
              <div className='d-flex justify-content-between align-items-center flex-wrap'>
                <div className='text-white ms-3 my-4' style={{ fontSize: "18px" }}>
                  Pedido :- {order}
                </div>

                <div className='d-flex flex-wrap me-4'>
                  {showCancelOrderButton ? (
                    <div className='btn btn-danger me-2  text-nowrap  me-2 py-2 d-flex align-items-center justify-content-center' style={{ backgroundColor: "#F05252", borderRadius: '10px' }}> <IoMdCloseCircle className='me-2' />Cancel order</div>
                  ) : (
                    <div className='btn btn-primary me-2  text-nowrap  me-2 py-2 d-flex align-items-center justify-content-center' style={{ backgroundColor: "#147BDE", borderRadius: '10px' }}> <MdEditSquare className='me-2' />Editar Pedido</div>
                  )}
                  {/* <div className='btn btn-primary me-2  text-nowrap  me-2 py-2 d-flex align-items-center justify-content-center' style={{ backgroundColor: "#147BDE", borderRadius: '10px' }}> <MdEditSquare className='me-2' />Editar Pedido</div> */}
                  <div className='btn btn-outline-primary b_mar_lef ms-2 py-2 text-nowrap d-flex align-item-center justify-content-center' style={{ borderRadius: "10px" }} onClick={handleShow1Prod} data-bs-toggle="modal" data-bs-target="#sjmodelstaticBackdrop"> <FiPlus className='me-2 mt-1' />Agregar Producto</div>
                </div>

              </div>
              {showDeliveryButton && (
                <div className='b_borderrr pb-4'>
                  <div className='btn a_btn_lightgreen ms-3 a_mar_delivary py-2' style={{ borderRadius: "10px" }}><span className='text-success fw-bold'>Delivery</span></div>
                </div>
              )}
            </div>


            <Tabs
              activeKey={activeTab}
              onSelect={handleTabSelect}
              id="fill-tab-example"
              className="mb-3 m_tabs m_bgblack px-2 border-0 p-3 "
              fill>
              <Tab
                eventKey="home"
                title="Orden"
                className="m_in text-white m-3  rounded">
                <div className='row'>
                  <div className='col-xl-7  col-12 overflow-hidden '>
                    <div className='p-4 m_bgblack text-white  mt-3'>
                      <p className='' style={{ fontSize: "18px", marginBottom: "36px" }}>Listado</p>
                      <div className='a_deli_infolist p-4'>
                        {
                          product.map((item) => {
                            console.log(item)
                            return (
                              <div>
                                <div className=' py-3 '>
                                  <div className='row'>
                                    <div className=' col-sm-8 '>
                                      <div className='d-flex '>
                                        <img src={item.image} alt='pic' className='ms-4' height={70} width={80} />
                                        <div className='ms-4 '>
                                          <div className='text-nowrap'>{item.name}</div>
                                          <div className='mt-3 a_mar_new '>{item.discription}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-sm-2 a_text_price '>
                                      <div className='pe-3 '>{item.quantity}</div>
                                    </div>
                                    <div className='col-sm-2 a_text_price'>
                                      <div className='pe-5 fw-bold '>{item.price}</div>
                                    </div>
                                  </div>
                                </div>

                                <div className='' style={{ marginBottom: "68px" }}  ><a href='#' className='a_home_addnote ms-4 '>{item.note}</a></div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-5 col-12 overflow-hidden '>
                    <div className='p-3 m_bgblack text-white mt-3'>
                      <h5 className='mt-3 ms-2'>Resumen</h5>
                      <div className='deli_infolist p-2'>
                        <div className='d-flex justify-content-end align-items-center ' >
                          <div className='d-flex justify-content-end align-items-center me-3 '>
                            <div className='me-2 fs-4'><CgCalendarDates /></div>
                            <div className='pt-2'>{date}</div>
                          </div>
                          <div className='d-flex justify-content-end align-items-center '>
                            <div className='me-2 fs-4 '><MdOutlineAccessTimeFilled /></div>
                            <div className='pt-2 a_time'>{time}</div>
                          </div>
                        </div>
                        <div className='fw-bold fs-5'>
                          Datos
                        </div>
                        <div className='btn a_btn_lightjamun my-3 py-2 px-4' style={{ borderRadius: "10px" }}><span style={{ fontWeight: "600" }}>Recibido</span></div><br />
                        <div className='btn sj_btn_lightgreen my-3 py-2 px-4' style={{ borderRadius: "10px" }}><span style={{ fontWeight: "600" }}>Uber</span></div>
                        <div className='d-flex justify-content-end align-items-center mb-4 mt-3'>
                          <div className='w-50'>
                            <div className='mb-3'>Codigo pedido</div>
                            <div className='w-75 a_bg_order py-3 border-0' style={{ borderRadius: "10px" }}><span className='ps-3'>{order}</span></div>
                          </div>
                          <div className='w-50'>
                            <div className='mb-3'>Cantidad</div>
                            <div className='w-75 a_bg_order py-3 border-0 ' style={{ borderRadius: "10px" }}><span className='ps-3'>{order1}</span></div>
                          </div>
                        </div>
                        <div className='p-4 a_deli_infolist  mt-3'>
                          <div className=' a_mar_summary fs-5 fw-bold'>Costo total</div>
                          <div className='d-flex justify-content-between align-items-center my-1 mb-2'>
                            <div>Productos</div>
                            <div>$13.00</div>
                          </div>
                          <div className='d-flex justify-content-between align-items-center my-1'>
                            <div>Descuentos</div>
                            <div>$1.00</div>
                          </div>
                          <hr></hr>
                          <div>
                            <div className='d-flex justify-content-between align-items-center my-1 fs-5 fw-bold'>
                              <div>Total</div>
                              <div>$12.00</div>
                            </div>
                          </div>
                        </div>
                        <div className='mx-auto text-center mt-3'>
                          <div className='btn btn-primary w-75 my-4 py-3  border-0' style={{ backgroundColor: "#147BDE", borderRadius: "10px" }}>Cobrar ahora</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="profile" title="Informaction del cliente" className='b_border ' style={{ marginTop: "2px" }}>
                <div className='b-bg-color1'>
                  <div className='text-white ms-4 pt-4' >
                    <h5 >Order information</h5>
                  </div>

                  <div className='d-flex  flex-grow-1 gap-5 mx-4 m b_inputt b_id_input b_home_field  pt-3 '>
                    <div className='w-100 b_search flex-grow-1  text-white mb-3'>
                      <label htmlFor="inputPassword2" className="mb-2" style={{ fontSize: "14px" }}>Customer</label>
                      <input type="text" className="form-control bg-gray border-0 mt-2 py-3" value={obj1.name} id="inputPassword2" placeholder="4" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} />
                    </div>
                    <div className='w-100 flex-grow-1 b_search text-white mb-3'>
                      <label htmlFor="inputPassword2" className="mb-2">Platform</label>
                      <input type="text" className="form-control bg-gray border-0 mt-2 py-3 " value={obj1.email} id="inputPassword2" placeholder="Uber" style={{ backgroundColor: '#242d38', borderRadius: "10px" }} />
                    </div>
                  </div>

                  <div className='b_table1 mx-4 mt-2' >
                    <div className='text-white mt-4'>
                      <h5 style={{ fontSize: "16px" }}>State History</h5>
                    </div>
                    <table className='b_table '>
                      <thead>
                        <tr className='b_thcolor'>
                          <th>Date</th>
                          <th>Hour </th>
                          <th>User</th>
                          <th>State</th>

                        </tr>
                      </thead>
                      <tbody className='text-white b_btnn '>
                        {data2.map((order) => (
                          <tr key={order.id} className='b_row'>
                            <td className=' mb-4'>{order.Date}</td>
                            <td className='text-nowrap'>{order.Hour}</td>
                            <td>{order.User}</td>
                            <td style={{ width: '129px', height: '50px' }} className={` mt-3  mb-3 b_text_w b_btn1 d-flex fw-bold align-items-center justify-content-center mt-0 ${order.state == 'Canceled' ? 'b_redd' : order.state === 'Recieved' ? 'b_bluee' : order.state === 'Prepared' ? 'b_orr' : order.state === 'Deliverd' ? 'b_neww' : order.state === 'Finalized' ? 'b_gree' : order.state === 'Finalized' ? 'b_orr' : 'text-denger'}`}>{order.state}</td>
                            {/* <td className='b_text_w'>
                              <button className='b_edit' onClick={() => handleEditClick(order.id)}><MdEditSquare /></button>
                              <button className='b_edit b_delete' onClick={() => handleDeleteClick(order.id)}><RiDeleteBin5Fill /></button>
                            </td> */}
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
        {/* model 1 */}
        <div className="modal fade" id="sjmodelstaticBackdrop" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="sjmodel">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">Cierre caja</h1>
                <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Completa el “Registro de efectivo” para comparar y detectar cualquier irregularidad en el cierre de caja</p>
                <label htmlFor="final">Monto final</label>
                <input type="text" id="final" className="sj_modelinput" placeholder="$200" /> <br />
                <label htmlFor="final">Monto efectivo</label>
                <input type="text" id="final" className="sj_modelinput" placeholder="$ 0.00" />
              </div>
              <div className="modal-footer sjmodenone">
                <button type="button" className="btn sjredbtn" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" data-bs-toggle="modal" data-bs-target="#sjmodel6staticBackdrop" className="btn btn-primary">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
        {/* model 2 */}
        <div className="modal fade" id="sjmodel6staticBackdrop" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="sjmodel">
              <div className="sj_modal-header">
                {/* <h1 className="modal-title fs-5" id="staticBackdropLabel">Cierre caja</h1> */}
                <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-center">
                  <a href="#">
                    <img src={checkbox} alt="" />
                  </a>
                </div>
                <p className="text-center pt-2 mb-0">Caja</p>
                <p className="text-center">Creada exitosamente</p>
              </div>
              {/* <div className="modal-footer sjmodenone">
                                <button type="button" className="btn sjredbtn" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" data-bs-toggle="modal" data-bs-target="" className="btn btn-primary">Confirmar</button>
                            </div> */}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
