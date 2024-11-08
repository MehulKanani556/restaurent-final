import React, { useState } from 'react';
import Header from './Header';
import Sidenav from './Sidenav';
import { IoIosArrowBack, IoIosArrowForward, IoMdArrowRoundBack } from 'react-icons/io';
import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaPrint } from 'react-icons/fa';

function Home_de_information() {

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
                        <h5 className='text-white'>Domain Gonzles</h5>
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
                    <div className='text-white ms-4'>
                        <h4>Customer information</h4>
                    </div>
                    <div>
                        <form action="">
                            <div className='d-flex gap-5 mx-4 mb-5 mt-4 b_inputt'>
                                <div className='w-50 b_search text-white'>
                                    <label htmlFor="inputPassword2" className="">Name</label>
                                    <input type="text" className="form-control bg-gray " id="inputPassword2" placeholder="4" style={{ backgroundColor: '#242d38' }} />
                                </div>
                                <div className='w-50 b_search text-white'>
                                    <label htmlFor="inputPassword2" className="">ID</label>
                                    <input type="text" className="form-control bg-gray " id="inputPassword2" placeholder="0123456789" style={{ backgroundColor: '#242d38' }} />
                                </div>
                                {/* <div className='w-50 text-white'>
                                <label htmlFor="inputEmail4" className="form-label">Name</label>
                                <input type="email" className="form-control" id="inputEmail4" />
                            </div> */}
                                {/* <div className='w-50 text-white'>
                                <label htmlFor="inputEmail4" className="form-label">ID</label>
                                <input type="email" className="form-control" id="inputEmail4" />
                            </div> */}
                            </div>
                        </form>
                    </div>
                    <div>
                        <div className='d-flex gap-5 mx-4 b_inputt mb-5 '>
                            <div className='w-50 b_search text-white'>
                                <label htmlFor="inputPassword2" className="">Mail</label>
                                <input type="text" className="form-control bg-gray " id="inputPassword2" placeholder="Exa,ple@gmail.com" style={{ backgroundColor: '#242d38' }} />
                            </div>
                            <div className='w-50 b_search text-white'>
                                <label htmlFor="inputPassword2" className=" ">Orders</label>
                                <input type="text" className="form-control bg-gray " id="inputPassword2" placeholder="4" style={{ backgroundColor: '#242d38' }} />
                            </div>
                        </div>
                    </div>


                </div>
            </div>



        </div>
    )
}

export default Home_de_information;;
