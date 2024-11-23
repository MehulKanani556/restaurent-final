import React, { useEffect, useState } from 'react';
import Sidenav from './Sidenav';
import KdsCard from './KdsCard';
import { HiExternalLink } from 'react-icons/hi';
import Header from './Header';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, Spinner } from 'react-bootstrap';



const Kds = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');
    const [allOrder, setAllOrder] = useState([]);
    const admin_id = localStorage.getItem('admin_id');
    const [user, setUser] = useState([]);
    const [centerProduction, setCenterProduction] = useState([]);
    const [tableInfo, setTableInfo] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    useEffect(() => {
        fetchOrder();
        fetchUser();
        fetchCenter();
        fetchAllItems();
        fetchTable();
    }, []);


    const fetchOrder = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post(`${apiUrl}/order/getAllKds?received=yes&prepared=yes&delivered=yes&finalized=yes`, { admin_id: admin_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const ordersObject = response.data; // The object you provided
            const ordersArray = Object.values(ordersObject); // Convert object to array

            setAllOrder(ordersArray); // Set the state with the array of orders
            // console.log(response)
            // console.log("Fetched orders as array:", ordersArray); // Log the array
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
        setIsProcessing(false);
    }
    const [categories, setCategories] = useState([
        'Todo',
        'Cocina',
        'Barra',
        'Postres'
    ]);
    const orderType = [
        'Recibido',
        'Preparado',
        'Finalizado',
        'Terminado'
    ]

    const orderTypeMapping = {
        'Recibido': 'received',
        'Preparado': 'prepared',
        'Finalizado': 'finalized',
        'Terminado': 'delivered'
    };
    const fetchAllItems = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.get(`${apiUrl}/item/getAll`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAllItems(response.data.items);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setIsProcessing(false);
    }
    const fetchTable = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post(`${apiUrl}/sector/getWithTable`, { admin_id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // console.log(response.data.data)
            setTableInfo(response.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
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
            const response = await axios.post(`${apiUrl}/production-centers`, { admin_id: admin_id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCenterProduction(response.data.data);

            // console.log("production center", response.data.data)
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setIsProcessing(false);
    }
    const [selectedCategory, setSelectedCategory] = useState('Todo');


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
                        <div className="row">
                            {orderType.map((orderType, index) => (
                                <div key={index} className="col-3 px-0">
                                    <div className={`j-kds-border-right w-100 j_kds_${orderType}`}>
                                        <Link to={`/kds/${orderType}`} className='text-decoration-none'>
                                            <div className={`j-kds-body-btn-${index + 1} j-kds-body-btn mx-3`}>
                                                <button className='d-flex align-items-center j-kds-body-text-1'>
                                                    {orderType} <HiExternalLink className='ms-2 j-kds-body-text-1' />
                                                </button>
                                            </div>
                                        </Link>
                                    </div>

                                    {filterOrdersByCategory(allOrder, selectedCategory)
                                        .filter(section => section.status === orderTypeMapping[orderType])
                                        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                                        .map((section, sectionIndex) => {
                                            // Find the table based on table_id
                                            const table = tableInfo.flatMap(sector => sector.tables).find(table => table.id === section.table_id);
                                            const tableName = table ? table.table_no : ''; // Default if not found
                                            return (
                                                <>
                                                    <KdsCard
                                                        key={sectionIndex}
                                                        table={tableName} // Use the table name here
                                                        time={section.updated_at}
                                                        orderId={section.order_id}
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
                                                </>
                                            )
                                        })}
                                </div>
                            ))}
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
            </div>
        </>
    );
};

export default Kds;
