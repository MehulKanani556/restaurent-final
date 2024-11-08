import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  Pie,
  PieChart,
  Cell,
  Bar,
  Area,
  AreaChart,
  Label,
  YAxis,
  CartesianGrid
} from "recharts";
import Sidenav from "./Sidenav";
import ApexCharts from "apexcharts";

import { BiSolidDashboard, BiSolidMessageSquareDetail } from "react-icons/bi";
import { FaAngleRight, FaBox, FaDigitalOcean, FaUser } from "react-icons/fa";
import { ImPieChart, ImUsers } from "react-icons/im";
import {
  MdArticle,
  MdCountertops,
  MdOutlineKeyboardArrowDown,
  MdOutlineProductionQuantityLimits
} from "react-icons/md";
import chart1 from "../Image/Ellipse 1.png";
import chart2 from "../Image/Ellipse 2.png";
import chart3 from "../Image/Ellipse 4.png";
import chart4 from "../Image/Ellipse 3.png";
import order1 from "../Image/order1.png";
import order2 from "../Image/order2.png";
import order3 from "../Image/order3.png";
import Chart from "react-apexcharts";
import green from "../Image/green.png";
import Aa from "./Aa";
import Sa from "./Sa";
import Header from "./Header";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
// import ApexCharts from "apexcharts";
// import ApexCharts from 'apexcharts';

const Dashboard = () => {
  const [selectedHastaMonth, setSelectedHastaMonth] = useState(
    new Date().getMonth() + 1
  );

  // chart

 

  const delivery = {

    chart: {
      type: "bar",
      height: 10,
      stacked: true,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          enabled: false
        },
        borderRadius: 4, // Apply rounded corners to the bars
        // borderRadiusApplication: "start", // Apply border radius to all sides
        // borderRadiusWhenStacked: "all" 
        borderRadiusApplication: "start",

      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 0
    },
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    grid: {
      show: false
    },
    legend: {
      show: false
    }
  };

  const apiUrl = process.env.REACT_APP_API_URL;
  const API = process.env.REACT_APP_IMAGE_URL;
  const token = localStorage.getItem("token");
  const admin_id = localStorage.getItem("admin_id");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // month select
  const [cancelOrderDay, setCancelOrderDay] = useState('month');
  const [statisticalData, setStatisticalData] = useState('month');
  const [paymentsData, setPaymentData] = useState('month');
  const [revData, setRevData] = useState('month');
  const [popData, setPopData] = useState('month');
  const [boxDay, setBoxDay] = useState('month');
  const [deliveryDay, setDeliveryDay] = useState('month');

  const [seleceCancelMonth, setSelectCencelMonth] = useState(new Date().getMonth() + 1);
  const [selectedRevMonth, setSelectedRevtaMonth] = useState(new Date().getMonth() + 1);
  const [selectBoxMonth, setselectBoxMonth] = useState(new Date().getMonth() + 1)
  const [selectPopMonth, setSelectPopMonth] = useState(new Date().getMonth() + 1);
  const [selectDeliveryMonth, setSelectDeliveryMonth] = useState(new Date().getMonth() + 1);

  const [cancelOrder, setCancelOrder] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [payMethodData, setPayMethodData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState([]);
  const [summaryState, setSummaryState] = useState([]);
  const [popularData, setPopularData] = useState([]);
  const [boxDetails, setBoxDetails] = useState([]);
  const [payment, setPayement] = useState([]);
  const [loadingPayMethodData, setLoadingPayMethodData] = useState(false); // Add loading state
  const [loadingSummary, setLoadingSummary] = useState(false);


  const [deliveryData, setDeliveryData] = useState({});

  const [boxName, setBoxName] = useState([]);

 

  // api
  // useEffect(() => {
  //   setLoading(true);
  //   fetchData();
  //   fetchStatical();
  //   fetchPayment();
  //   fetchPaymentMethos();
  //   fetchTotalRevenue();
  //   fetchSummry();
  //   fetchPopular();
  //   fetchBoxEntry();
  //   fetchCancelOrder();
  //   fetchDelivery();
  //   fetchBox();
  // }, [token, deliveryDay, selectDeliveryMonth, statisticalData, paymentsData, selectedHastaMonth, selectedRevMonth, revData, popData, selectPopMonth, selectBoxMonth, boxDay, cancelOrderDay, seleceCancelMonth])
// api
useEffect(() => {
  setLoading(true);
  fetchData();
}, [token]);

useEffect(() => {
  fetchStatical();
}, [statisticalData]);



useEffect(() => {
  fetchPaymentMethos();
  fetchPayment();

}, [selectedHastaMonth,paymentsData]);

useEffect(() => {
  fetchTotalRevenue();
}, [revData,selectedRevMonth]);

useEffect(() => {
  fetchSummry();
}, [token]);

useEffect(() => {
  fetchPopular();
}, [selectPopMonth,popData]);

useEffect(() => {
  fetchBoxEntry();
}, [selectBoxMonth,boxDay]);

useEffect(() => {
  fetchCancelOrder();
}, [cancelOrderDay, seleceCancelMonth]);

useEffect(() => {
  fetchDelivery();
}, [deliveryDay, selectDeliveryMonth]);

useEffect(() => {
  fetchBox();
}, []);

  // fetch whole dashboard
  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/dashboard`,
        {admin_id}, // You can pass any data here if needed
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., setting an error state or displaying a message
    }
  };
  // fetch whole dashboard
  const fetchBox = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/get-boxs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBoxName(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., setting an error state or displaying a message
    }
  };

  // fetch Statical data
  const fetchStatical = async () => {
    try {
      let durationData = {};

      if (statisticalData === 'day') {
        durationData = {
          duration: 'day',
          day: new Date().toISOString().split('T')[0]
        };
      } else if (statisticalData === 'week') {
        durationData = {
          duration: 'week',
          week: '1'  // Assuming '1' represents the current week
        };
      } else if (statisticalData === 'month') {
        durationData = {
          duration: 'month',
          month: new Date().getMonth() + 1  // Current month (1-12)
        };
      } else {

      }

      const response = await axios.post(
        `${apiUrl}/getStatisticalData`,
        {admin_id,durationData},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      setStateData(response.data.statistical_data);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately
    }
  };

  // fetch Payment data
  const fetchPaymentMethos = async () => {
    setLoadingPayMethodData(true);
    try {
      let durationData = {};

      if (paymentsData === 'day') {
        durationData = {
          duration: 'day',
          day: new Date().toISOString().split('T')[0]
        };
      } else if (paymentsData === 'week') {
        durationData = {
          duration: 'week',
          week: '1'  // Assuming '1' represents the current week
        };
      } else if (paymentsData === 'month') {
        durationData = {
          duration: 'month',
          month: selectedHastaMonth  // Current month (1-12)
        };
      } else {

      }

      const response = await axios.post(
        `${apiUrl}/getPaymentMethods`,
        {durationData,admin_id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      setPayMethodData(response.data.payment_methods);
      setLoading(false);
      setLoadingPayMethodData(false);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately
    }
  };
  // fetch Total revenue data
  const fetchTotalRevenue = async () => {
    try {
      let durationData = {};

      if (revData === 'day') {
        durationData = {
          duration: 'day',
          day: new Date().toISOString().split('T')[0]
        };
      } else if (revData === 'week') {
        durationData = {
          duration: 'week',
          week: '1'  // Assuming '1' represents the current week
        };
      } else if (revData === 'month') {
        durationData = {
          duration: 'month',
          month: selectedRevMonth  // Current month (1-12)
        };
      } else {

      }

      const response = await axios.post(
        `${apiUrl}/getTotalRevenue`,
        {admin_id,durationData},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      setTotalRevenue(response.data.total_revenue);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately
    }
  };

  // fetch Summary state
  const fetchSummry = async () => {
    setLoadingSummary(true)
    try {
      const response = await axios.post(
        `${apiUrl}/getStatusSummary`,
        {admin_id}, // You can pass any data here if needed
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSummaryState(response.data.statusSummary);
      setLoadingSummary(false);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., setting an error state or displaying a message
    }
  };

  // fetch popular order data
  const fetchPopular = async () => {
    try {
      let durationData = {};

      if (popData === 'day') {
        durationData = {
          duration: 'day',
          day: new Date().toISOString().split('T')[0]
        };
      } else if (popData === 'week') {
        durationData = {
          duration: 'week',
          week: '1'  // Assuming '1' represents the current week
        };
      } else if (popData === 'month') {
        durationData = {
          duration: 'month',
          month: selectPopMonth  // Current month (1-12)
        };
      } else {

      }

      const response = await axios.post(
        `${apiUrl}/getPopularProducts`,
        {admin_id,durationData},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      setPopularData(response.data.popular_products);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately
    }
  };

  // fetch box entry
  const fetchBoxEntry = async () => {

    try {
      let durationData = {};

      if (boxDay === 'day') {
        durationData = {
          duration: 'day',
          day: new Date().toISOString().split('T')[0]
        };
      } else if (boxDay === 'week') {
        durationData = {
          duration: 'week',
          week: '1'  // Assuming '1' represents the current week
        };
      } else if (boxDay === 'month') {
        durationData = {
          duration: 'month',
          month: selectBoxMonth  // Current month (1-12)
        };
      }
      const response = await axios.post(`${apiUrl}/getBoxEntry`, {admin_id,durationData}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBoxDetails(response.data.box_entries)
    } catch (error) {
      console.error('Error at box ', error)
    }
  }

  // fetch Delivery information
  const fetchDelivery = async () => {

    try {
      let durationData = {};

      if (deliveryDay === 'day') {
        durationData = {
          duration: 'day',
          day: new Date().toISOString().split('T')[0]
        };
      } else if (deliveryDay === 'week') {
        durationData = {
          duration: 'week',
          week: '1'  // Assuming '1' represents the current week
        };
      } else if (deliveryDay === 'month') {
        durationData = {
          duration: 'month',
          month: selectDeliveryMonth  // Current month (1-12)
        };
      } else {

      }
      const response = await axios.post(
        `${apiUrl}/getdelivery`,
        {admin_id,durationData},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDeliveryData(response.data.delivery_methods || {}); // Ensure deliveryData is an object
      // console.log("delivery", response.data.delivery_methods)

    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., setting an error state or displaying a message
    }
  };

  // get cancle order
  const fetchCancelOrder = async () => {
    try {
      let durationData = {};

      if (cancelOrderDay === 'day') {
        durationData = {
          duration: 'day',
          day: new Date().toISOString().split('T')[0]
        };
      } else if (cancelOrderDay === 'week') {
        durationData = {
          duration: 'week',
          week: '1'  // Assuming '1' represents the current week
        };
      } else if (cancelOrderDay === 'month') {
        durationData = {
          duration: 'month',
          month: seleceCancelMonth  // Current month (1-12)
        };
      }
      const response = await axios.post(
        `${apiUrl}/cancelOrders`,
        {admin_id,durationData},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCancelOrder(response.data.cancelled_orders);
      setLoading(false);



    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., setting an error state or displaying a message
    }
  };

  // get payment
  const fetchPayment = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/get-payments`,
        {admin_id},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayement(response.data.result);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., setting an error state or displaying a message
    }
  };

  // const transformOrdersData = (orders) => {
  //   return orders.map(order => ({
  //     date: new Date(order.created_at).toLocaleDateString(),
  //     Order: 1 // Each order counts as 1
  //   }));
  // };
  const transformOrdersData = (orders, duration) => {
    if (duration === 'day') {
      const ordersByHour = orders.reduce((acc, order) => {
        const hour = new Date(order.created_at).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      return [
        { hour: '00:00', Order: 0 },
        ...Array.from({ length: 24 }, (_, i) => ({
          hour: `${i.toString().padStart(2, '0')}:00`,
          Order: ordersByHour[i] || 0
        }))
      ];
    } else {
      const ordersByDate = orders.reduce((acc, order) => {
        const date = new Date(order.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const sortedDates = Object.keys(ordersByDate).sort((a, b) => new Date(a) - new Date(b));
      const firstDate = sortedDates[0] || new Date().toLocaleDateString();

      return [
        { date: firstDate, Order: 0 },

        ...sortedDates.map(date => ({
          date,
          Order: ordersByDate[date]
        }))
      ];
    }
  };

  const transformPaymentsData = (payments) => {
    // Ensure payments are sorted by date
    payments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return [
      { date: new Date().toLocaleDateString(), Amount: 0 }, // Add this line
      ...payments.map(payment => ({
        date: new Date(payment.created_at).toLocaleDateString(),
        Amount: parseFloat(payment.amount)
      }))
    ];
  };

  const transformAverageData = (payments) => {
    // Ensure payments are sorted by date
    payments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return [
      { date: new Date().toLocaleDateString(), Amount: 0 }, // Add this line
      ...payments.map(payment => ({
        date: new Date(payment.created_at).toLocaleDateString(),
        Amount: parseFloat(payment.amount / stateData.total_days).toFixed(3)
      }))
    ];
  };

  const transformDeliveryOrdersData = (orders) => {
    if (!Array.isArray(orders)) {
      return []; // Return an empty array if orders is not defined or not an array
    }

    const ordersByDate = orders.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1; // Count orders per date
      return acc;
    }, {});

    return [
      { date: new Date().toLocaleDateString(), Order: 0 }, // Ensure starting with 0
      ...Object.keys(ordersByDate).map(date => ({
        date,
        Order: ordersByDate[date]
      }))
    ];
  };
  const transformOrderDetails = (orderDetails) => {
    if (!Array.isArray(orderDetails)) {
      return [{ date: new Date().toLocaleDateString(), total: 0, quantity: 0 }]; // Return an array with 0 values if orderDetails is not defined or not an array
    }

    const result = orderDetails.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString();
      const amount = parseFloat(order.amount) || 0; // Handle null amounts

      if (!acc[date]) {
        acc[date] = { date, total: 0, quantity: 0 }; // Start with 0
      }
      acc[date].total += amount;
      acc[date].quantity += order.quantity || 0; // Ensure quantity starts with 0

      return acc;
    }, {});

    const sortedResults = Object.values(result).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    // Ensure the chart starts with a 0 value entry
    if (sortedResults.length === 0 || sortedResults[0].total !== 0) {
      sortedResults.unshift({ date: new Date().toLocaleDateString(), total: 0, quantity: 0 });
    }

    return sortedResults;
  };

  // Use the transformed data in the chart
  const chartData = transformOrderDetails(totalRevenue.order_details);

  return (
    <div>
      <Header />
      <div className="j-bg-color">
        <div className="j-sidebar-nav">
          <Sidenav />
        </div>
        <section className="j-dashboard sidebar">
          <div className="j-dashboard-statistical">
            <div className="j-dashboard-head">
              <h2 className="text-white sjfs-2">Datos estadísticos</h2>

              <div className="text-end">
                <input
                  type="radio"
                  className="btn-check"
                  name="options-base"
                  id="option1"
                  autoComplete="off"
                />
                <label
                  className="btn btn-outline-primary j-blue-color j-custom-label sjfs-12"
                  htmlFor="option1"
                  onClick={() => setStatisticalData('day')}
                >
                  Día
                </label>
                <input
                  type="radio"
                  className="btn-check "
                  name="options-base"
                  id="option2"
                  autoComplete="off"
                />
                <label
                  className="btn btn-outline-primary j-custom-label j-blue-color sjfs-12"
                  htmlFor="option2"
                  onClick={() => setStatisticalData('week')}
                >
                  Semana
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  name="options-base"
                  id="option3"
                  autoComplete="off"
                  defaultChecked
                />
                <label
                  className="btn btn-outline-primary j-blue-color j-custom-label sjfs-12"
                  htmlFor="option3"
                  onClick={() => setStatisticalData('month')}
                >
                  Mes
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-3 sjj_borderright">
                <div className="j-chart">
                  <div className="j-chart-head">
                    <p className="sjfs-16">Total pedidos</p>
                    <h3 className="text-white fw-bold sj-fs30">{stateData.total_orders_count}</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={100}>
                    <AreaChart
                      data={transformOrdersData(stateData.total_orders || [], statisticalData)}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1c64f2"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#395692"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      {/* <XAxis dataKey={statisticalData === 'day' ? 'hour' : 'date'} hide={true} /> */}
                      <XAxis dataKey={statisticalData === 'day' ? 'hour' : 'date'} hide={true} />
                      <YAxis hide={true} domain={[0, 'dataMax']} />
                      <Tooltip cursor={false} />
                      <Area
                        type="monotone"
                        dataKey="Order"
                        strokeWidth={2}
                        stroke="#1c64f2"
                        fill="url(#colorGradient)"
                        baseValue={0}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="col-3 sjj_borderright">
                <div className="j-chart">
                  <div className="j-chart-head">
                    <p className="sjfs-16">Total ingresos</p>
                    <h3 className="text-white fw-bold sj-fs30">
                      {stateData.total_income ? stateData.total_income.toFixed(2) : '0.00'}$
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={100}>
                    <AreaChart data={transformPaymentsData(stateData.total_payments || [])} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1c64f2"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#395692"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide={true} />
                      <YAxis hide={true} domain={[0, 'auto']} />

                      <Tooltip cursor={false} />
                      <Area
                        type="monotone"
                        dataKey="Amount"
                        strokeWidth={2}
                        stroke="#1c64f2" // Border color
                        fill="url(#colorGradient)" // Gradient fill
                        baseValue={0} // Ensure the base value starts from 0
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="col-3 sjj_borderright">
                <div className="j-chart">
                  <div className="j-chart-head">
                    <p className="sjfs-16">Venta promedio</p>
                    <h3 className="text-white fw-bold sj-fs30">{stateData.total_average ? stateData.total_average.toFixed(2) : '00'}</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={100}>
                    <AreaChart data={transformAverageData(stateData.total_payments || [])} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1c64f2"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#395692"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide={true} />
                      <YAxis hide={true} domain={[0, stateData.total_average / 2]} />
                      <Tooltip cursor={false} />

                      <Area
                        type="monotone"
                        dataKey="Amount"
                        strokeWidth={2}
                        stroke="#1c64f2" // Border color Different color for average
                        fill="url(#colorGradient)" // Gradient fill for average
                        baseValue={0} // Ensure the base value starts from 0
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="col-3 sjj_borderright">
                <div className="j-chart">
                  <div className="j-chart-head">
                    <p className="sjfs-16">Pedidos delivery</p>
                    <h3 className="text-white fw-bold sj-fs30">{stateData.delivery_orders_count}</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={100}>
                    <AreaChart data={transformDeliveryOrdersData(stateData.delivery_orders)}>
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1c64f2"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#395692"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide={true} />
                      <YAxis hide={true} domain={[0, 'auto']} />
                      <Tooltip cursor={false} />
                      <Area
                        type="monotone"
                        dataKey="Order"
                        strokeWidth={2}
                        stroke="#1c64f2" // Border color
                        fill="url(#colorGradient)" // Gradient fill
                        baseValue={0} // Ensure the base value starts from 0
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="j-dashboard-Payment">
            <div className="row">
              <div className="col-6 j-payment-color">
                <div className="s_dashboard-head">
                  <div className="d-flex justify-content-between text-white">
                    <h2 className="text-white sjfs-2">Métodos pago</h2>
                    <div>
                      <select
                        id="month-select"
                        className="form-select sjfs-14"
                        // onChange={(e) => setSelectedHastaMonth(e.target.value)}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setSelectedHastaMonth(selectedValue);
                          if (selectedValue === "12") {
                            const currentMonth = new Date().getMonth() + 1;
                            setSelectedHastaMonth(currentMonth); // Set to current month
                            fetchData(); // Call fetchData to get current month data
                          }
                        }}
                        value={selectedHastaMonth}
                      >
                        <option value="1">Mes Enero</option>
                        <option value="2">Mes Febrero</option>
                        <option value="3">Mes Marzo</option>
                        <option value="4">Mes Abril</option>
                        <option value="5">Mes Mayo</option>
                        <option value="6">Mes Junio</option>
                        <option value="7">Mes Julio</option>
                        <option value="8">Mes Agosto</option>
                        <option value="9">Mes Septiembre</option>
                        <option value="10">Mes Octubre </option>
                        <option value="11">Mes Noviembre</option>
                        <option value="12">Mes Diciembre</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-end">
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base1"
                      id="option4"
                      autoComplete="off"
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option4"
                      onClick={() => setPaymentData('day')}
                    >
                      Día
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base1"
                      id="option5"
                      autoComplete="off"
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option5"
                      onClick={() => setPaymentData('week')}
                    >
                      Semana
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base1"
                      id="option6"
                      autoComplete="off"
                      defaultChecked
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option6"
                      onClick={() => {
                        setPaymentData('month');
                        const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
                        setSelectedHastaMonth(currentMonth); // Set to current month
                        fetchData(); // Call fetchData to get current month data
                      }}
                    >
                      Mes
                    </label>
                  </div>
                </div>
                <div className="j-border2">
                  <div className="row">
                    <div className="col-6 j-col-3">
                      <div className="s_dashboard-body">
                        <div className="j-border px-2">

                          <h5 className="mb-1 text-white sjfs-2">Total: {payMethodData?.cash}</h5>
                          <p className="s_fontsize mb-2 sjfs-14">Efectivo</p>
                        </div>
                        <div className="j-border px-2 py-1">
                          <h5 className="mb-1 text-white sjfs-2">Total: {payMethodData?.debit}</h5>
                          <p className="s_fontsize mb-2 sjfs-14">
                            Tarjeta de debito
                          </p>
                        </div>
                        <div className="j-border px-2 py-1">
                          <h5 className="mb-1 text-white sjfs-2">Total: {payMethodData?.credit}</h5>
                          <p className="s_fontsize mb-2 sjfs-14">
                            Tarjeta de crédito
                          </p>
                        </div>
                        <div className="px-2 py-1">
                          <h5 className="mb-1 text-white sjfs-2">Total: {payMethodData?.transfer}</h5>
                          <p className="s_fontsize sjfs-14">Transferencias</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 .j-col-3">
                      {/* <div className="j-text-center position-relative ">

                        <Aa data={data.payment_methods} />
                       
                      </div> */}
                      <div className="j-text-center position-relative ">
                        {loadingPayMethodData ? ( // Check loading state
                          <p>Loading...</p>
                        ) : (
                          <Aa data={payMethodData} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <Chart/> */}
                <div>{/* <Chart /> */}</div>
                <div className="j-foot-border py-3">
                  <div className="j-payment-foot text-white row">
                    <div className="d-flex align-items-center justify-content-center col-md-6">
                      <img src={chart1} className="ss_img" />
                      <p className="ss_fontsize mb-0 sjfs-14">
                        Efectivo:{" "}
                        <span className="text-white me-4 sjfs-14">
                          {payMethodData?.cash}$ CLP
                        </span>
                      </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-center  col-md-6">
                      <img src={chart2} className="ssj_img" />
                      <p className="ss_fontsize mb-0 sjfs-14">
                        Tarjeta debito:{" "}
                        <span className="text-white sjfs-14">{payMethodData?.debit}$ CLP</span>
                      </p>
                    </div>
                  </div>
                  <div className="j-payment-foot text-white row">
                    <div className="d-flex align-items-center justify-content-center col-md-6 ">
                      <img src={chart3} className="ss_img" />
                      <p className="ss_fontsize mb-0 sjfs-14">
                        Tarjeta crédito:{" "}
                        <span className="text-white me-4 sjfs-14">
                          {payMethodData?.credit}$ CLP
                        </span>
                      </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-center col-md-6">
                      <img src={chart4} className="ssj_img" />
                      <p className="ss_fontsize mb-0 sjfs-14">
                        Transferencias:{" "}
                        <span className="text-white sjfs-14">{payMethodData?.transfer}$ CLP</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="j-foot-text text-end">
                  <button className="sjfs-14">
                    Ver reporte <FaAngleRight />
                  </button>
                </div>
              </div>
              <div className="col-6 j-payment-color2">
                <div className="s_dashboard-head">
                  <div className="d-flex justify-content-between text-white">
                    <div className="s_dashboard-left-head  ">
                      <h2 className="text-white  sjfs-2">{Number(totalRevenue.total_revenue).toFixed(0)}$</h2>

                      <p>Ingresos totales</p>
                    </div>

                    <div className="s_dashboard-right-head">
                      <div className="mb-2">
                        <select
                          id="month-select"
                          className="form-select sjfs-14"
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setSelectedRevtaMonth(selectedValue);
                            if (selectedValue === "12") {
                              const currentMonth = new Date().getMonth() + 1;
                              setSelectedRevtaMonth(currentMonth); // Set to current month
                              fetchData(); // Call fetchData to get current month data
                            }
                          }}
                          value={selectedRevMonth}
                        >
                          <option value="1">Mes Enero</option>
                          <option value="2">Mes Febrero</option>
                          <option value="3">Mes Marzo</option>
                          <option value="4">Mes Abril</option>
                          <option value="5">Mes Mayo</option>
                          <option value="6">Mes Junio</option>
                          <option value="7">Mes Julio</option>
                          <option value="8">Mes Agosto</option>
                          <option value="9">Mes Septiembre</option>
                          <option value="10">Mes Octubre </option>
                          <option value="11">Mes Noviembre</option>
                          <option value="12">Mes Diciembre</option>
                        </select>
                      </div>
                      <div className="text-end">
                        <input
                          type="radio"
                          className="btn-check"
                          name="options-base2"
                          id="option7"
                          autoComplete="off"
                        />
                        <label
                          className="btn btn-outline-primary j-custom-label sjfs-12"
                          htmlFor="option7"
                          onClick={() => setRevData('day')}
                        >
                          Día
                        </label>
                        <input
                          type="radio"
                          className="btn-check"
                          name="options-base2"
                          id="option8"
                          autoComplete="off"
                        />
                        <label
                          className="btn btn-outline-primary j-custom-label sjfs-12"
                          htmlFor="option8"
                          onClick={() => setRevData('week')}

                        >
                          Semana
                        </label>
                        <input
                          type="radio"
                          className="btn-check"
                          name="options-base2"
                          id="option9"
                          autoComplete="off"
                          defaultChecked
                        />
                        <label
                          className="btn btn-outline-primary j-custom-label sjfs-12"
                          htmlFor="option9"
                          onClick={() => {
                            setRevData('month');
                            const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
                            setSelectedRevtaMonth(currentMonth); // Set to current month
                            fetchData(); // Call fetchData to get current month data
                          }}

                        >
                          Mes
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="j-payment-body">

                  <ResponsiveContainer width="100%" height={450}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="10%" stopColor="#1c64f2" stopOpacity={0.4} />
                          <stop offset="90%" stopColor="#395692" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="10%" stopColor="#16bdca" stopOpacity={0.4} />
                          <stop offset="90%" stopColor="#1c506a" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 65, 82)" horizontal={true} vertical={false} />

                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
                        }}
                      />
                      {/* <YAxis domain={[0, 'dataMax']} axisLine={false} yAxisId="left" /> */}
                      {/* <YAxis domain={[0, 'dataMax']} axisLine={false} orientation="right" yAxisId="right" /> */}
                      <Tooltip cursor={false} formatter={(value, name) => [value, name === 'total' ? 'Total' : 'Quantity']} />
                      <Area dataKey="total" stroke="#1c64f2" strokeWidth={3} fill="url(#colorOrder)" dot={false} yAxisId="left" />
                      <Area dataKey="quantity" stroke="#16bdca" strokeWidth={3} fill="url(#colorTotal)" dot={false} yAxisId="right" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="j-foot-text text-end">
                  <button className="sjfs-14">
                    Ver reporte <FaAngleRight />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="j-dashboard-summary">
            <div className="row">
              <div className="col-6 j-payment-color">
                <div className="j_dashboard-head">
                  <h2 className="text-white  sjfs-2">Resumen estados</h2>
                  <p className="sjfs-16">En tiempo real</p>
                </div>

                <div className="j-text-dta  position-relative">
                  <div>

                    {loadingSummary ? ( // Check loading state
                      <p>Loading...</p> // Show loading message
                    ) : (
                      <Sa data={summaryState} />
                    )}
                    {/* <Sa data={data.statusSummary} /> */}
                    {/* <Aa /> */}
                  </div>
                  <div className="j-summary-data2 mb-3">
                    <div className="d-flex align-items-center j-margin">
                      <img src={chart4} className="jj_img me-2" />
                      <p className="ss_fontsize mb-0 sjfs-14">Recibido</p>
                    </div>
                    <div className="d-flex align-items-center j-margin">
                      <img src={chart2} className="jj_img me-2" />
                      <p className="ss_fontsize mb-0 sjfs-14">Preparado</p>
                    </div>
                    <div className="d-flex align-items-center j-margin">
                      <img src={chart1} className="jj_img me-2" />
                      <p className="ss_fontsize mb-0 sjfs-14">Entregado</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <img src={chart3} className="jj_img me-2" />
                      <p className="ss_fontsize mb-0 sjfs-14">Finalizado</p>
                    </div>
                  </div>
                </div>
                <div className="j-foot-text text-end">
                  <button className="sjfs-14">
                    Ver reporte <FaAngleRight />
                  </button>
                </div>
              </div>
              <div className="col-6 j-payment-color2">
                <div className="j_dashboard-head">
                  <div className="d-flex justify-content-between text-white">
                    <h2 className="text-white sjfs-2 mb-0">Popular</h2>
                    <div>
                      <select
                        id="month-select"
                        className="form-select sjfs-14"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setSelectPopMonth(selectedValue);
                          if (selectedValue === "12") {
                            const currentMonth = new Date().getMonth() + 1;
                            setSelectPopMonth(currentMonth); // Set to current month
                            fetchData(); // Call fetchData to get current month data
                          }
                        }}
                        value={selectPopMonth}
                      >
                        <option value="1">Mes Enero</option>
                        <option value="2">Mes Febrero</option>
                        <option value="3">Mes Marzo</option>
                        <option value="4">Mes Abril</option>
                        <option value="5">Mes Mayo</option>
                        <option value="6">Mes Junio</option>
                        <option value="7">Mes Julio</option>
                        <option value="8">Mes Agosto</option>
                        <option value="9">Mes Septiembre</option>
                        <option value="10">Mes Octubre </option>
                        <option value="11">Mes Noviembre</option>
                        <option value="12">Mes Diciembre</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-end">
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base3"
                      id="option10"
                      autoComplete="off"
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option10"
                      onClick={() => setPopData('day')}
                    >
                      Día
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base3"
                      id="option11"
                      autoComplete="off"
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option11"
                      onClick={() => setPopData('week')}

                    >
                      Semana
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base3"
                      id="option12"
                      autoComplete="off"
                      defaultChecked
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option12"
                      onClick={() => {
                        setPopData('month');
                        const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
                        setSelectPopMonth(currentMonth); // Set to current month
                        fetchData(); // Call fetchData to get current month data
                      }}
                    >
                      Mes
                    </label>
                  </div>
                </div>

                <div className="j-summary-body j-example">
                  {/* {popularData.map((item, index) => (
                    <div
                      key={item.id}
                      className="j-summary-body-data scrollbox d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center">
                        <div className="j-order-no">#{index + 1}</div>
                        <div className="j-order-img">
                          <img src={`${API}/images/${item.image}`} alt={item.name} />
                        </div>
                        <div className="j-order-data">
                          <h4 className="sjfs-16">{item.name}</h4>
                          <p className="sjfs-12">Padido {item.order_count}</p>
                        </div>
                      </div>
                      <div className="j-order-price sjfs-16 me-2">
                        {parseFloat(item.amount) % 1 === 0 ? `${parseFloat(item.amount).toFixed(0)}$` : `${parseFloat(item.amount)}$`}
                      </div>
                    </div>
                  ))} */}
                  {popularData.map((item, index) => (
                    <div
                      key={item.id} // Ensure each item has a unique key
                      className="j-summary-body-data scrollbox d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center">
                        <div className="j-order-no">#{index + 1}</div>
                        <div className="j-order-img">
                          <img src={`${API}/images/${item.image}`} alt={item.name} />
                        </div>
                        <div className="j-order-data">
                          <h4 className="sjfs-16">{item.name}</h4>
                          <p className="sjfs-12">Padido {item.order_count}</p>
                        </div>
                      </div>
                      <div className="j-order-price sjfs-16 me-2">
                        {parseFloat(item.amount) % 1 === 0 ? `${parseFloat(item.amount).toFixed(0)}$` : `${parseFloat(item.amount)}$`}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="j-foot-text text-end">
                  <button className="sjfs-14">
                    Ver reporte <FaAngleRight />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="j-dashboard-delivery">
            <div className="row">
              <div className="col-6 j-payment-color">
                <div className="j_dashboard-head">
                  <div className="d-flex justify-content-between text-white">
                    <h2 className="text-white sjfs-2">Delivery</h2>
                    <div>
                      <select
                        id="month-select"
                        className="form-select sjfs-14"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setSelectDeliveryMonth(selectedValue);
                          if (selectedValue === "12") {
                            const currentMonth = new Date().getMonth() + 1;
                            setSelectDeliveryMonth(currentMonth); // Set to current month
                            fetchData(); // Call fetchData to get current month data
                          }
                        }}
                        value={selectDeliveryMonth}
                      >
                        <option value="1">Mes Enero</option>
                        <option value="2">Mes Febrero</option>
                        <option value="3">Mes Marzo</option>
                        <option value="4">Mes Abril</option>
                        <option value="5">Mes Mayo</option>
                        <option value="6">Mes Junio</option>
                        <option value="7">Mes Julio</option>
                        <option value="8">Mes Agosto</option>
                        <option value="9">Mes Septiembre</option>
                        <option value="10">Mes Octubre </option>
                        <option value="11">Mes Noviembre</option>
                        <option value="12">Mes Diciembre</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-end">
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base4"
                      id="option13"
                      autoComplete="off"
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option13"
                      onClick={() => setDeliveryDay('day')}
                    >
                      Día
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base4"
                      id="option14"
                      autoComplete="off"
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option14"
                      onClick={() => setDeliveryDay('week')}
                    >
                      Semana
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base4"
                      id="option15"
                      autoComplete="off"
                      defaultChecked
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option15"
                      onClick={() => {
                        setDeliveryDay('month');
                        const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
                        setSelectDeliveryMonth(currentMonth); // Set to current month
                        fetchData(); // Call fetchData to get current month data
                      }}
                    >
                      Mes
                    </label>
                  </div>
                </div>

                <div className="j-delivery-body">
                  <div className="row">
                    <div className="col-6">
                      <div className="j-delivery-data">
                        <p className="sjfs-16">Delivery</p>
                        <h5 className="sjfs-2">{deliveryData.delivery}</h5>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="j-delivery-data">
                        <p className="sjfs-16">Retiro</p>
                        <h5 className="sjfs-2">{deliveryData.withdrawal}</h5>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="j-delivery-data">
                        <p className="sjfs-16">Local</p>
                        <h5 className="sjfs-2">{deliveryData.local}</h5>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="j-delivery-data">
                        <p className="sjfs-16">Plataforma</p>
                        <h5 className="sjfs-2">{deliveryData.platform}</h5>
                      </div>
                    </div>
                  </div>

                  <div className="j-delivery-chart">
                    <div id="chart">
                      <Chart
                        options={delivery}
                        // series={delivery.series}
                        series={[
                          {
                            name: 'Delivery',
                            // data: [deliveryData.delivery],
                            data: deliveryData.delivery ? [deliveryData.delivery] : [0], // Provide default value
                            color: "#147bde"
                          },
                          {
                            name: 'Retiro',
                            // data: [deliveryData.withdrawal],
                            data: deliveryData.withdrawal ? [deliveryData.withdrawal] : [0], // Provide default value
                            color: "#16bdca"
                          },
                          {
                            name: 'Local',
                            // data: [deliveryData.local],
                            data: deliveryData.local ? [deliveryData.local] : [0], // Provide default value
                            color: "#fdba8c"
                          },
                          {
                            name: 'Plataforma',
                            // data: [deliveryData.platform],
                            data: deliveryData.platform ? [deliveryData.platform] : [0], // Provide default value
                            color: "#31c48d"
                          },
                        ]}
                        type="bar"
                        height={75}

                      />
                    </div>
                  </div>

                  <div className="j-delivery-foot">
                    <div className="j-summary-data2 mb-3">
                      <div className="d-flex align-items-center me-4">
                        <img src={chart1} className="jj_img me-2" />
                        <p className="ss_fontsize mb-0 sjfs-12">Delivery</p>
                      </div>
                      <div className="d-flex align-items-center me-4">
                        <img src={chart3} className="jj_img me-2" />
                        <p className="ss_fontsize mb-0 sjfs-12">Retiro</p>
                      </div>
                      <div className="d-flex align-items-center me-4">
                        <img src={chart2} className="jj_img me-2" />
                        <p className="ss_fontsize mb-0 sjfs-12">Local</p>
                      </div>
                      <div className="d-flex align-items-center">
                        <img src={green} className="jj_img me-2" />
                        <p className="ss_fontsize mb-0 sjfs-12">Plataforma</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 j-payment-color2">
                <div className="j_dashboard-head">
                  <div className="d-flex justify-content-between text-white">
                    <h2 className="text-white sjfs-2">Ingreso de cajas</h2>
                    <div>
                      <select
                        id="month-select"
                        className="form-select sjfs-14"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setselectBoxMonth(selectedValue);
                          if (selectedValue === "12") {
                            const currentMonth = new Date().getMonth() + 1;
                            setselectBoxMonth(currentMonth); // Set to current month
                            fetchData(); // Call fetchData to get current month data
                          }
                        }}
                        value={selectBoxMonth}
                      >
                        <option value="1">Mes Enero</option>
                        <option value="2">Mes Febrero</option>
                        <option value="3">Mes Marzo</option>
                        <option value="4">Mes Abril</option>
                        <option value="5">Mes Mayo</option>
                        <option value="6">Mes Junio</option>
                        <option value="7">Mes Julio</option>
                        <option value="8">Mes Agosto</option>
                        <option value="9">Mes Septiembre</option>
                        <option value="10">Mes Octubre </option>
                        <option value="11">Mes Noviembre</option>
                        <option value="12">Mes Diciembre</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-end">
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base5"
                      id="option16"
                      autoComplete="off"
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option16"
                      onClick={() => setBoxDay('day')}
                    >
                      Día
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base5"
                      id="option17"
                      autoComplete="off"
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option17"
                      onClick={() => setBoxDay('week')}
                    >
                      Semana
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base5"
                      id="option18"
                      autoComplete="off"
                      defaultChecked
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option18"
                      onClick={() => {
                        setBoxDay('month');
                        const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
                        setselectBoxMonth(currentMonth); // Set to current month
                        fetchData(); // Call fetchData to get current month data
                      }}
                    >
                      Mes
                    </label>
                  </div>
                </div>

                <div
                  className="j-chart-entry"
                  style={{ height: "300px", overflowY: "auto" }}
                >

                  {boxDetails.map((ele, index) => {
                    const totalAmount = ele.logs.reduce((sum, log) => {
                      const closeAmount = parseFloat(log.close_amount);
                      const openAmount = parseFloat(log.open_amount) || 0;
                      return closeAmount ? sum + (closeAmount - openAmount) : sum;
                    }, 0);
                    // Prepare data for the chart
                    const chartData = [
                      { name: '', Order: 0 }, // Start with 0 value
                      ...ele.logs.map(log => ({
                        name: log.open_time, // Use open_time as the x-axis label
                        Order: parseFloat(log.close_amount) - parseFloat(log.open_amount) // Calculate the order value
                      }))
                    ];

                    return (
                      <div className="j-chart-entry-1 d-flex align-items-center" key={ele.id}>
                        <ResponsiveContainer width={100} height={100}>
                          <LineChart data={chartData}>
                            <Tooltip cursor={false} />
                            <Line
                              type="monotoneX"
                              dataKey="Order"
                              stroke="#0e9f6e"
                              dot={false}
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="j-chart-entry-data ps-3">
                          <p className="sjfs-14">{ele.box_name}</p>
                          <h5 className="sjfs-2"> {parseFloat(totalAmount) % 1 === 0 ? `${parseFloat(totalAmount).toFixed(0)}$` : `${parseFloat(totalAmount)}$`}</h5> {/* Display total amount */}

                        </div>
                      </div>
                    );
                  })}

                </div>

                <div className="j-foot-text text-end">
                  <button className="sjfs-14">
                    Ver reporte <FaAngleRight />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="j-dashboard-cancel">
            <div className="row">
              <div className="col-12 j-cancel-color">
                <div className="j_dashboard-head">
                  <div className="d-flex justify-content-between text-white">
                    <h2 className="text-white sjfs-2">Anulación pedidos</h2>
                    <div>
                      <select
                        id="month-select"
                        className="form-select sjfs-14"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setSelectCencelMonth(selectedValue);
                          if (selectedValue === "12") {
                            const currentMonth = new Date().getMonth() + 1;
                            setSelectCencelMonth(currentMonth); // Set to current month
                            fetchData(); // Call fetchData to get current month data
                          }
                        }}
                        value={seleceCancelMonth}
                      >
                        <option value="1">Mes Enero</option>
                        <option value="2">Mes Febrero</option>
                        <option value="3">Mes Marzo</option>
                        <option value="4">Mes Abril</option>
                        <option value="5">Mes Mayo</option>
                        <option value="6">Mes Junio</option>
                        <option value="7">Mes Julio</option>
                        <option value="8">Mes Agosto</option>
                        <option value="9">Mes Septiembre</option>
                        <option value="10">Mes Octubre </option>
                        <option value="11">Mes Noviembre</option>
                        <option value="12">Mes Diciembre</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-end">
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base6"
                      id="option19"
                      autoComplete="off"
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option19"
                      onClick={() => setCancelOrderDay('day')}
                    >
                      Día
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base6"
                      id="option20"
                      autoComplete="off"
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option20"
                      onClick={() => setCancelOrderDay('week')}

                    >
                      Semana
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base6"
                      id="option21"
                      autoComplete="off"
                      defaultChecked
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option21"
                      onClick={() => {
                        setCancelOrderDay('month');
                        const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
                        setSelectCencelMonth(currentMonth); // Set to current month
                        fetchData(); // Call fetchData to get current month data
                      }}
                    >
                      Mes
                    </label>
                  </div>
                </div>
                <div className="j-table">
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th
                            className="sjfs-17"
                            scope="col"
                            style={{ borderRadius: "10px 0 0 0" }}
                          >
                            Pedido
                          </th>
                          <th scope="col" className="sjfs-17">
                            Caja
                          </th>
                          <th scope="col" className="sjfs-17">
                            Hora
                          </th>
                          <th scope="col" className="sjfs-17">
                            Fecha
                          </th>
                          <th scope="col" className="sjfs-17">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      {/* <tbody>
                        {Object.values(cancelOrder).map((e, index) => {
                          // Find the box name that matches the box_id
                          const box = boxName.find(box => box.id === e.box_id);
                          return (
                            <tr key={e.id}>
                              <td scope="row">
                                <Link to={`/home_Pedidos/paymet/${e.id}`}>
                                  <button className="j-success sjfs-16">
                                    {e.id}
                                  </button>
                                </Link>
                              </td>
                              <td className="sjfs-17">{box ? box.name : ''}</td>
                              <td className="sjfs-17">{new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                              <td className="sjfs-17">{new Date(e.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}</td>
                              <td>
                                <button className="j-danger sjfs-16">
                                  {e.status === 'cancelled' ? 'Anulado' : e.status}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody> */}
                      <tbody>
                        {Object.values(cancelOrder).map((e, index) => {
                          const box = boxName.find(box => box.id === e.box_id);
                          return (
                            <tr key={e.id}>
                              <td scope="row">
                                <Link to={`/home_Pedidos/paymet/${e.id}`}>
                                  <button className="j-success sjfs-16">
                                    {e.id}
                                  </button>
                                </Link>
                              </td>
                              <td className="sjfs-17">{box ? box.name : ''}</td>
                              <td className="sjfs-17">{new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                              <td className="sjfs-17">{new Date(e.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}</td>
                              <td>
                                <button className="j-danger sjfs-16">
                                  {e.status === 'cancelled' ? 'Anulado' : e.status}
                                </button>
                              </td>
                            </tr>
                          ); // Ensure no extra spaces or newlines here
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="j-foot-text text-end">
                  <button className="sjfs-14">
                    Ver reporte <FaAngleRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;

 