import React from 'react'
import Header from './Header';
import Sidenav from './Sidenav';
import { MdDateRange } from 'react-icons/md';
import { FiClock } from 'react-icons/fi';
import image1 from '../Image/Image1.png';
import image2 from '../Image/Image2.png';
// import img1 from '../Image/Image.jpg'


function Home_De_eme() {

    const obj1 = [
        {
            name: "Cheese soup",
            price: "$2.00",
            image: image1,
            code: "0124",

        },
        {
            name: "Cheese soup",
            price: "$2.00",
            image: image1,
            code: "0124",

        },
        {
            name: "Cheese soup",
            price: "$2.00",
            image: image1,
            code: "0124",

        },
        // {
        //     name1: "Crispy Fried chicken",
        //     price1: "$2.00",
        //     image1: image2,
        //     code1: "0124",

        // },
        // {
        //     name1: "Crispy Fried chicken",
        //     price1: "$2.00",
        //     image1: image2,
        //     code1: "0124",

        // },
        // {
        //     name1: "Crispy Fried chicken",
        //     price1: "$2.00",
        //     image1: image2,
        //     code1: "0124",

        // },


    ]

    return (
        <div>
            <Header />
            <div className='d-flex'>
                <div>
                    <Sidenav />
                </div>
                <div className='text-white sidebar flex-grow-1'>
                    <div className="row">
                        <div className="col-8">
                            <div className="py-3 border-bottom">
                                <h4 className='ms-4'>Mostrador</h4>
                            </div>

                            <div className="row">
                                <div className='w-25 b_search m-4'>
                                    <label htmlFor="inputPassword2" className="visually-hidden">Password</label>
                                    <input type="password" className="form-control bg-gray " id="inputPassword2" placeholder="Buscar" style={{ backgroundColor: '#242d38' }} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-10">
                                    <ul className="nav nav-pills b_nav ms-4 mb-3 gap-3 " id="pills-tab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active rounded-pill" id="pills-home-tab1" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Bebidas</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill" id="pills-profile-tab2" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Snacks</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill" id="pills-contact-tab3" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Postres</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill" id="pills-local-tab4" data-bs-toggle="pill" data-bs-target="#pills-local" type="button" role="tab" aria-controls="pills-local" aria-selected="false">Almuerzos</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill" id="pills-paltform-tab5" data-bs-toggle="pill" data-bs-target="#pills-home1" type="button" role="tab" aria-controls="pills-paltform" aria-selected="false">Desayunos</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill" id="pills-paltform-tab5" data-bs-toggle="pill" data-bs-target="#pills-home2" type="button" role="tab" aria-controls="pills-paltform" aria-selected="false">Cenas</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill" id="pills-paltform-tab5" data-bs-toggle="pill" data-bs-target="#pills-home3" type="button" role="tab" aria-controls="pills-paltform" aria-selected="false">Bebidas</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill" id="pills-paltform-tab5" data-bs-toggle="pill" data-bs-target="pills-home4" type="button" role="tab" aria-controls="pills-paltform" aria-selected="false">Snacks</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill" id="pills-paltform-tab5" data-bs-toggle="pill" data-bs-target="#pills-home5" type="button" role="tab" aria-controls="pills-paltform" aria-selected="false">Cenas</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill" id="pills-paltform-tab5" data-bs-toggle="pill" data-bs-target="#pills-home6" type="button" role="tab" aria-controls="pills-paltform" aria-selected="false">Gelatinas</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill" id="pills-paltform-tab5" data-bs-toggle="pill" data-bs-target="#pills-home7" type="button" role="tab" aria-controls="pills-paltform" aria-selected="false">Pasteles</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link rounded-pill" id="pills-paltform-tab5" data-bs-toggle="pill" data-bs-target="#pills-home8" type="button" role="tab" aria-controls="pills-paltform" aria-selected="false">Futas con crema</button>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                            <div className="tab-content text-white " id="pills-tabContent">
                                <div className="tab-pane fade row show ms-4  d-flex active text-white" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    {obj1.map((ele, index) => (

                                        <div className="col-md-3 col-sm-6" keys={index}>
                                            <div><h5>{ele.head}</h5></div>
                                            <div className="card border-0 b_card " style={{ width: '15rem' }} >
                                                <img src={ele.image} className='object-fit-cover' alt />
                                                <div className="card-body m_bgblack">
                                                    <h5 className="card-title">{ele.name}</h5>
                                                    <p className="card-text">{ele.price}</p>
                                                    <p className="card-text text-secondary">Code: {ele.code}</p>
                                                    <div className=''>
                                                        <a href="#" className="btn btn-primary w-100 m-auto">Add Cart</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="tab-pane fade row show ms-4  d-flex  text-white" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab2">


                                </div>
                                <div className="tab-pane fade show  text-white" id="pills-contact" role="tabpanel1" aria-labelledby="pills-home-tab">

                                </div>
                                <div className="tab-pane fade show  text-white" id="pills-local" role="tabpane2" aria-labelledby="pills-home-tab">

                                </div>
                                <div className="tab-pane fade show  text-white" id="pills-home1" role="tabpanel3" aria-labelledby="pills-home-tab">

                                </div>
                                <div className="tab-pane fade show  text-white" id="pills-home2" role="tabpanel4" aria-labelledby="pills-home-tab">

                                </div>
                                <div className="tab-pane fade show  text-white" id="pills-home3" role="tabpanel5" aria-labelledby="pills-home-tab">

                                </div>
                                <div className="tab-pane fade show  text-white" id="pills-home4" role="tabpanel5" aria-labelledby="pills-home-tab">

                                </div>
                                <div className="tab-pane fade show  text-white" id="pills-home5" role="tabpanel5" aria-labelledby="pills-home-tab">

                                </div>
                                <div className="tab-pane fade show  text-white" id="pills-home6" role="tabpanel5" aria-labelledby="pills-home-tab">

                                </div>
                                <div className="tab-pane fade show  text-white" id="pills-home7" role="tabpanel5" aria-labelledby="pills-home-tab">

                                </div>
                                <div className="tab-pane fade show  text-white" id="pills-home8" role="tabpanel5" aria-labelledby="pills-home-tab">

                                </div>
                            </div>

                        </div>














                        <div className="col-md-4">
                            <h5 className='mt-4'>Resumen</h5>
                            <div className='d-flex justify-content-end mx-4 gap-4 text-white'>
                                <div className='fs-5'> <MdDateRange /> <span>03/17/2024</span></div>
                                <div className='fs-5'> <FiClock /> <span>08:AM</span></div>
                            </div>
                            <div>
                                <button type="button" className="btn btn-outline-success b_new_btn">Delivery</button>
                            </div>
                            <div className='mt-4'>
                                <h5>Datos</h5>
                                <p>Quien lo regista</p>
                            </div>
                            <div className='w-100 pe-4 b_search '>
                                <label htmlFor="inputPassword2" className="visually-hidden">Password</label>
                                <input type="password" className="form-control bg-gray " id="inputPassword2" placeholder="Lucia Lopez" style={{ backgroundColor: '#242d38' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home_De_eme;