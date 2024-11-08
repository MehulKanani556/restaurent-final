import React, { useState } from 'react';
import Header from './Header';
import Sidenav from './Sidenav';
import { IoIosArrowBack, IoIosArrowForward, IoMdArrowRoundBack } from 'react-icons/io';
import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaPrint } from 'react-icons/fa';

function Information() {

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
            state1: 'Pending Return',
            credit_note: 'See Detail',
            action1: 'Cancel sale',
        },
        {
            id: '01234',
            state1: 'Return Completed',
            credit_note: 'See Detail',
            action1: 'Cancel sale',
        },
        {
            id: '01234',
            state1: 'Return Completed',
            credit_note: 'See Detail',
            action1: 'Cancel sale',
        },
        {
            id: '01234',
            state1: 'Return Completed',
            credit_note: 'See Detail',
            action1: 'Cancel sale',
        },

        // More orders...
    ]);

    const [data1, setData1] = useState([
        {
            id: '01234',
            state1: 'Delivered',
            credit_note: 'Create credit note',
            action1: 'Cancel sale',
        },
        {
            id: '01234',
            state1: 'Delivered',
            credit_note: 'Create credit note',
            action1: 'Cancel sale',
        },
        {
            id: '01234',
            state1: 'Delivered',
            credit_note: 'Create credit note',
            action1: 'Cancel sale',
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
                    <div className='m-4'>
                        <button type="button" className="btn btn-outline-primary"><IoMdArrowRoundBack /> Go Back</button>
                    </div>
                    <div className='ms-4 mt-4'>
                        <h4 className='text-white'>Domain Gonzales</h4>
                    </div>
                    <div className='d-flex justify-content-evenly text-white  b_border-top mb-4 py-3 '>
                        <div className=''>
                            <a href="#">Recored</a>
                        </div>
                        <div className=''>
                            <a href="#">Information</a>
                        </div>
                        <div className=''>
                            <a href="#">Creadit note</a>
                        </div>
                    </div>
                    <div className='b_table1'>
                        <table className='b_table '>
                            <thead>
                                <tr className='b_thcolor'>
                                    <th>Order</th>
                                    <th>State </th>
                                    <th>Credit Note</th>
                                    <th>Action</th>
                                    <th>Print</th>
                                </tr>
                            </thead>
                            <tbody className='text-white b_btnn '>
                                {data1.map((order) => (
                                    <tr key={order.id} className='b_row'>
                                        <td className='b_idbtn mb-3'>{order.id}</td>
                                        <td ><div className='b_idbtn b_text_w b_idbtn_s m-0'>{order.state1}</div></td>
                                        <td> <div className='b_text_w b_idbtn b_idbtn_c m-0'>{order.credit_note}</div> </td>
                                        <td className='b_text_w b_idbtn b_idbtn_a mb-3 '>
                                            {order.action1}
                                        </td>
                                        <td>
                                            <button className='b_edit ' style={{ backgroundColor: "#0694A2" }}><FaPrint /></button>
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

export default Information