import React, { useEffect, useState } from 'react'
import Sidenav from './Sidenav';
import Header from './Header';
import { HiExternalLink } from 'react-icons/hi';
import KdsCard from './KdsCard';
import { FaXmark } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, Spinner } from 'react-bootstrap';


const orders = [
    {
        type: 'Recibido',
        sections: [
            {
                title: 'Mesa 2',
                time: '15:20',
                orderNumber: '01234',
                fromTime: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo', 'Cola Fanta', 'Pastel'],
                notes: ['Sin salsa de tote']
            },
            {
                title: 'Mesa 2',
                time: '15:20',
                orderNumber: '01234',
                hrtimestart: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo', 'Cola Fanta', 'Pastel'],
                notes: ['Sin salsa de tote', 'Al clima']
            },
            {
                title: 'Mesa 2',
                time: '15:20',
                orderNumber: '01234',
                hrtimestart: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo'],
                notes: ['Sin salsa de tote']
            }
        ]
    },
    {
        sections: [
            {
                title: 'Delivery',
                time: '15:20',
                orderNumber: '01234',
                hrtimestart: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo'],
                notes: ['Sin salsa de tote']
            },
            {
                title: 'Mesa 2',
                time: '15:20',
                orderNumber: '01234',
                fromTime: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo', 'Cola Fanta', 'Pastel'],
                notes: ['Sin salsa de tote']
            },
            {
                title: 'Mesa 2',
                time: '15:20',
                orderNumber: '01234',
                hrtimestart: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo', 'Cola Fanta', 'Pastel'],
                notes: ['Sin salsa de tote', 'Al clima']
            }
        ]
    },
    {

        sections: [
            {
                title: 'Delivery',
                time: '15:20',
                orderNumber: '01234',
                fromTime: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo', 'Cola Fanta', 'Pastel'],
                notes: ['Sin salsa de tote']
            },
            {
                title: 'Delivery',
                time: '15:20',
                orderNumber: '01234',
                hrtimestart: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo'],
                notes: ['Sin salsa de tote']
            },
            {
                title: 'Mesa 2',
                time: '15:20',
                orderNumber: '01234',
                hrtimestart: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo', 'Cola Fanta', 'Pastel'],
                notes: ['Sin salsa de tote', 'Al clima'],
            }
        ]
    },
    {
        sections: [
            {
                title: 'Mesa 2',
                time: '15:20',
                orderNumber: '01234',
                fromTime: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo', 'Cola Fanta', 'Pastel'],
                notes: ['Sin salsa de tote', 'Al clima'],
            },
            {
                title: 'Mesa 2',
                time: '15:20',
                orderNumber: '01234',
                hrtimestart: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo', 'Cola Fanta', 'Pastel'],
                notes: ['Sin salsa de tote', 'Al clima'],
            },
            {
                title: 'Mesa 2',
                time: '15:20',
                orderNumber: '01234',
                hrtimestart: '10:00 AM',
                who: 'Damian Lopez',
                center: 'Cocina',
                list: ['Almuerzo'],
                notes: ['Sin salsa de tote'],
            }
        ]
    }
];


const KdsRecibido = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = sessionStorage.getItem('token');
    const [allOrder, setAllOrder] = useState([]);
    const [user, setUser] = useState([]);
    const [centerProduction, setCenterProduction] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [categories, setCategories] = useState([
        'Todo',
        'Cocina',
        'Barra',
        'Postres'
    ]);
    const [isProcessing, setIsProcessing] = useState(false);



    const [selectedCategory, setSelectedCategory] = useState('Todo');
    useEffect(() => {
        fetchOrder();
        fetchUser();
        fetchCenter();
        fetchAllItems();
    }, []);

    const fetchOrder = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/order/getAll?received=yes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const ordersObject = response.data; // The object you provided
            const ordersArray = Object.values(ordersObject); // Convert object to array

            setAllOrder(ordersArray); // Set the state with the array of orders

        } catch (error) {
            console.error("Error fetching orders:", error);
        }
        setIsProcessing(false);
    }
    const fetchUser = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/get-users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setIsProcessing(false);
    }
    const fetchCenter = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/production-centers`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCenterProduction(response.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setIsProcessing(false);
    }
    const fetchAllItems = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/item/getAll`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAllItems(response.data.items);
            console.log("Fetched items as array:", response.data.items); // Log the array
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setIsProcessing(false);
    }
    const filterOrdersByCategory = (orders, category) => {
        if (category === 'Todo') {
            return orders;
        }
        return orders.filter(order => {
            return order.order_details.some(detail => {
                const item = allItems.find(item => item.id === detail.item_id);
                if (item) {
                    const matchingCenter = centerProduction.find(center => center.id === item.production_center_id);
                    return matchingCenter && matchingCenter.name === category;
                }
                return false;
            });
        });
        
    };

    return (
        <>
            <Header />
            <div className="d-flex">
                <Sidenav />
                <div className="flex-grow-1 sidebar">
                    <div className="j-kds-head">
                        <h5 className='text-white j-counter-text-1'>KDS</h5>
                        <div className="j-show-items">
                            <ul className="nav">
                                <li
                                    className={`nav-item j-nav-item-size ${selectedCategory === 'Todo' ? "active" : ""}`}
                                    onClick={() => setSelectedCategory('Todo')}
                                >
                                    <a className="nav-link" aria-current="page">
                                        Todo
                                    </a>
                                </li>
                                {centerProduction.map((category, index) => (
                                    <li
                                        className={`nav-item j-nav-item-size ${selectedCategory === category.name ? "active" : ""}`}
                                        key={index}
                                        onClick={() => setSelectedCategory(category.name)}
                                    >
                                        <a className="nav-link" aria-current="page">
                                            {category.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="j-kds-body">
                        <Link to={"/kds"} className='text-decoration-none'>
                            <div className={`j-kds-body-btn-1 j-kds-body-btn mx-3`}>
                                <button className='d-flex align-items-center j-kds-body-text-1'>
                                    Recibido <FaXmark className='ms-2 j-kds-body-text-1' />
                                </button>
                            </div>
                        </Link>
                        <div className="row">
                            
                        {filterOrdersByCategory(allOrder, selectedCategory)
                                        // .filter(section => section.status === orderTypeMapping[orderType])
                                        .map((section, sectionIndex) => (
                                            <div key={sectionIndex} className="col-3 px-0">
                                            <KdsCard
                                                key={sectionIndex}
                                                table={section.table_id}
                                                time={section.created_at}
                                                orderId={section.id}
                                                startTime={section.created_at}
                                                waiter={section.user_id}
                                                center={section.discount}
                                                notes={section.reason}
                                                finishedAt={section.finished_at}
                                                user={user}
                                                centerProduction={centerProduction}
                                                fetchOrder={fetchOrder}
                                                status={section.status}
                                                items={section.order_details.filter(detail => {
                                                    if (selectedCategory === 'Todo') return true;
                                                    const item = allItems.find(item => item.id === detail.item_id);
                                                    if (item) {
                                                        const matchingCenter = centerProduction.find(center => center.id === item.production_center_id);
                                                        return matchingCenter && matchingCenter.name === selectedCategory;
                                                    }
                                                    return false;
                                                })}
                                                productionCenter={selectedCategory === 'Todo' ?
                                                    section.order_details.map(order => {
                                                        const item = allItems.find(item => item.id === order.item_id);
                                                        if (item) {
                                                            const matchingCenter = centerProduction.find(center => center.id === item.production_center_id);
                                                            return matchingCenter ? matchingCenter.name : null;
                                                        }
                                                        return null;
                                                    }).filter(item => item !== null)
                                                    : [selectedCategory]
                                                }
                                            />
                                        </div>
                                        ))}
                        </div>
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
                        <Spinner animation="border" role="status" style={{ height: '85px', width: '85px', borderWidth: '6px' }} />
                        <p className="mt-2">Procesando solicitud...</p>
                    </Modal.Body>
                </Modal>

            </div>
        </>
    );
};


export default KdsRecibido;
