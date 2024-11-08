import React, { useState } from 'react';
import Header from './Header';
import Sidenav from './Sidenav';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BiSolidFoodMenu } from 'react-icons/bi';

function Home_local() {

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

    const [data, setData] = useState([
        {
            id: '01234',
            order: '03/28/2024 ',
            time: '08:56 am',
            customer: 'Damian Gonzales',
            pay: '$20.00',
            withdrawal_address:'Restaurent 1',
            guy: 'Local', // Add a status property
        },
        {
            id: '01234',
            order: '03/28/2024 ',
            time: '08:56 am',
            customer: 'Damian Gonzales',
            pay: '$20.00',
            withdrawal_address:'Restaurent 1',
            guy: 'Local', // Add a status property
        },
        {
            id: '01234',
            order: '03/28/2024 ',
            time: '08:56 am',
            customer: 'Damian Gonzales',
            pay: '$20.00',
            withdrawal_address:'Restaurent 1',
            guy: 'Local', // Add a status property
        },
        {
            id: '01234',
            order: '03/28/2024 ',
            time: '08:56 am',
            customer: 'Damian Gonzales',
            pay: '$20.00',
            withdrawal_address:'Restaurent 1',
            guy: 'Local', // Add a status property
        },
      
        // More orders...
    ]);

    const handleEditClick = (id) => {
        // Implement edit functionality here
        console.log('Edit button clicked for order:', id);
    };

    const handleDeleteClick = (id) => {
        // Implement delete functionality here
        const newData = data.filter((order) => order.id !== id);
        setData(newData);
        console.log('Delete button clicked for order:', id);
    };

    const handleStatusChange = (id, newStatus) => {
        // Update order status
        const newData = data.map((order) => {
            if (order.id === id) {
                return { ...order, status: newStatus };
            }
            return order;
        });
        setData(newData);
    };


    return (
        <div className='b_bg_color'>
            <Header />

            <div className='d-flex'>
                <div>
                    <Sidenav />
                </div>
                <div className='flex-grow-1 sidebar overflow-y-scroll '>
                    <div className='ms-4 mt-4'>
                        <h4 className='text-white'>Delivery</h4>
                    </div>
                    <div className='d-flex b_main_search ms-4 justify-content-between mt-3'>
                        <div className='w-25 b_search'>
                            <label htmlFor="inputPassword2" className="visually-hidden">Password</label>
                            <input type="password" className="form-control bg-gray " id="inputPassword2" placeholder="Buscar" style={{ backgroundColor: '#242d38' }} />
                        </div>
                        <div>
                            <div className='me-4'>
                                <button type="submit" className="btn btn-primary mb-3 me-3">+ Crear pedido</button>
                                <button type="submit" className="btn btn-outline-primary mb-3 "><BiSolidFoodMenu /> Generar reporte</button>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between me-4 b_btn_main'>
                        <div className=''>
                            <ul className="nav nav-pills b_nav ms-4 mb-3 gap-3 " id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link  rounded-pill" id="pills-home-tab1" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Todo</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link  rounded-pill" id="pills-profile-tab2" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Delivery</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link  rounded-pill" id="pills-contact-tab3" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Ratiro</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active rounded-pill" id="pills-local-tab4" data-bs-toggle="pill" data-bs-target="#pills-local" type="button" role="tab" aria-controls="pills-local" aria-selected="false">Local</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link rounded-pill" id="pills-paltform-tab5" data-bs-toggle="pill" data-bs-target="#pills-paltform" type="button" role="tab" aria-controls="pills-paltform" aria-selected="false">Plataforma</button>
                                </li>
                            </ul>

                            {/* <div className="tab-content text-white" id="pills-tabContent">
                                <div className="tab-pane fade show active text-white" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab"></div>
                                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab"></div>
                                <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab"></div>
                                <div className="tab-pane fade" id="pills-local" role="tabpanel" aria-labelledby="pills-local-tab"></div>
                                <div className="tab-pane fade" id="pills-paltform" role="tabpanel" aria-labelledby="pills-contact-tab"></div>
                            </div> */}
                        </div>
                        <div className='text-white fs-4 d-flex b_arrow'>
                            <span><IoIosArrowBack /></span> <span><IoIosArrowForward /></span>
                            <div className='text-white  d-flex fs-5 pt-1 ms-5'>
                                <p className='b_page_text'>view 1-15 of 30</p>
                            </div>
                        </div>
                    </div>
                    <div className='b_table1'>
                        <table className='b_table '>
                            <thead>
                                <tr className='b_thcolor'>
                                    <th>Id</th>
                                    <th>Order </th>
                                    <th>Time</th>
                                    <th>Customer</th>
                                    <th>Address</th>
                                    <th>Local</th>
                                    <th>Acion</th>
                                </tr>
                            </thead>
                            <tbody className='text-white b_btnn '>
                                {data.map((order) => (
                                    <tr key={order.id} className='b_row'>
                                        <td className='b_idbtn mb-4'>{order.id}</td>
                                        <td>{order.order}</td>
                                        <td className='b_text_w'>{order.time}</td>
                                        <td className='b_text_w'>{order.customer}</td>
                                        <td className='b_text_w'>{order.withdrawal_address}</td>
                                        <td className='b_btn1 b_btn_w ms-3'>{order.guy}</td>
                                        <td className='b_text_w'>
                                            <button className='b_edit' onClick={() => handleEditClick(order.id)}><MdEditSquare /></button>
                                            <button className='b_edit b_delete' onClick={() => handleDeleteClick(order.id)}><RiDeleteBin5Fill /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>



        </div>
    )
}

export default Home_local;;
