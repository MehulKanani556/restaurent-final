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
import useSocket from "../hooks/useSocket";
import * as XLSX from "xlsx-js-style";
import { useChat } from "../contexts/ChatContext";
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
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email')
  const echo = useSocket();
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
  const [allUser, setAllUser] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupChats, setgroupChats] = useState([]);
  const [deliveryData, setDeliveryData] = useState({});
  const [boxName, setBoxName] = useState([]);

  const {fetchAllUsers} = useChat();

  useEffect(() => {
    if (userId) {
      // console.log(userId);
      // setupEchoListeners(userId);
      updateActiveStatus(userId);
    }
  }, [userId])

  const updateActiveStatus = async (id) => {
    try {
      const responce = await axios.post(
        `${apiUrl}/update-user/${id}`,
        {
          activeStatus: true,
          name: name,
          email: email

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // console.log(responce);
      setupEchoListeners(userId);
    } catch (error) {
      console.log("not updating user", + error.message);

    }
  }

  const setupEchoListeners = (userId) => { // Accept userId as a parameter
    if (echo) {
      echo.channel(`online-users`)
        .listen('Chat', () => {
          console.log(`User ${userId} is online`);
          fetchAllUsers();
        });
      console.log("Socket connection established for user online");
    }
  };


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

  }, [selectedHastaMonth, paymentsData]);

  useEffect(() => {
    fetchTotalRevenue();
  }, [revData, selectedRevMonth]);

  useEffect(() => {
    fetchSummry();
  }, [token]);

  useEffect(() => {
    fetchPopular();
  }, [selectPopMonth, popData]);

  useEffect(() => {
    fetchBoxEntry();
  }, [selectBoxMonth, boxDay]);

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
        { admin_id }, // You can pass any data here if needed
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
        { ...durationData, admin_id },
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

      if (selectedHastaMonth == new Date().getMonth() + 1) {
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
        }
      } else {

      }



      const response = await axios.post(
        `${apiUrl}/getPaymentMethods`,
        { ...durationData, admin_id },
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
        { ...durationData, admin_id },
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
        { admin_id }, // You can pass any data here if needed
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
        { ...durationData, admin_id },
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
      const response = await axios.post(`${apiUrl}/getBoxEntry`, { ...durationData, admin_id }, {
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
        { ...durationData, admin_id },
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
        { ...durationData, admin_id },
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
        { admin_id },
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
    // Check if orderDetails is defined and is an array
    if (!Array.isArray(orderDetails) || orderDetails.length === 0) { // Updated condition to check for empty array
      if (revData === 'week') {
        const completeResults = [];
        const startDate = new Date();
        const currentDay = startDate.getDay(); // Get current day of the week
        const weekStart = new Date(startDate.setDate(startDate.getDate() - currentDay)); // Start of the week
        const today = new Date(); // Get today's date
        const weekEnd = today; // Set weekEnd to today

        for (let d = weekStart; d <= weekEnd; d.setDate(d.getDate() + 1)) {
          const dateString = d.toLocaleDateString('en-US');
          completeResults.push({ date: dateString, total: 0, quantity: 0 }); // Fill with 0 for each day of the week
        }
        return completeResults; // Return the complete results for the week
      } else if (revData === 'month') { // Added condition for month
        const completeResults = [];
        const startDate = new Date();
        const currentMonth = selectedRevMonth - 1;
        const currentYear = startDate.getFullYear();
        const today = startDate.getDate(); // Get today's date
        const cn = startDate.getMonth() + 1; // Get the current month number
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get number of days in the current month
        let endDay = selectedRevMonth === cn ? today : daysInMonth; // Determine the end day based on the condition
        console.log(endDay, selectedRevMonth, cn, selectedRevMonth === cn)
        for (let day = 1; day <= endDay; day++) {
          const dateString = new Date(currentYear, currentMonth, day).toLocaleDateString('en-US'); // Specify locale
          completeResults.push({ date: dateString, total: 0, quantity: 0 }); // Fill with 0 for each day of the month
        }
        return completeResults; // Return the complete results for the month
      }
      return [{ date: new Date().toLocaleDateString('en-US'), total: 0, quantity: 0 }]; // Return a default value
    }

    const result = orderDetails.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString('en-US');
      const amount = parseFloat(order.amount) || 0; // Handle null amounts

      if (!acc[date]) {
        acc[date] = { date, total: 0, quantity: 0 }; // Start with 0
      }

      acc[date].total += amount;
      acc[date].quantity += order.quantity || 0; // Ensure quantity starts with 0

      return acc;
    }, {});

    const sortedResults = Object.values(result).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    const completeResults = [];
    const startDate = new Date(); // Current date

    if (revData === 'day') {
      // Show only current date
      const dateString = startDate.toLocaleDateString('en-US');
      completeResults.push(result[dateString]); // Fill with 0 for the current date
    } else if (revData === 'week') {
      const currentDay = startDate.getDay(); // Get current day of the week
      const weekStart = new Date(startDate.setDate(startDate.getDate() - currentDay)); // Start of the week
      const today = new Date(); // Get today's date
      const weekEnd = today; // Set weekEnd to today
      let hasData = false; // Flag to check if there's any data for the week

      for (let d = weekStart; d <= weekEnd; d.setDate(d.getDate() + 1)) {
        const dateString = d.toLocaleDateString('en-US');
        if (!result[dateString]) {
          completeResults.push({ date: dateString, total: 0, quantity: 0 }); // Fill missing dates with 0
        } else {
          completeResults.push(result[dateString]); // Use existing data
          hasData = true; // Set flag to true if data exists for the week
        }
      }

      // If no data exists for the week, fill with 0s for each day of the week
      if (!hasData) {
        for (let d = weekStart; d <= weekEnd; d.setDate(d.getDate() + 1)) {
          const dateString = d.toLocaleDateString('en-US');
          completeResults.push({ date: dateString, total: 0, quantity: 0 }); // Fill missing dates with 0
        }
      }
    } else if (revData === 'month') {
      // Show current month dates up to today's date or the end of the month
      const currentMonth = selectedRevMonth - 1; // Adjust for zero-based index
      const currentYear = startDate.getFullYear();
      const today = startDate.getDate(); // Get today's date
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get number of days in the current month
      const cn = startDate.getMonth() + 1; // Get the current month number

      let endDay = selectedRevMonth == cn ? today : daysInMonth; // Determine the end day based on the condition

      for (let day = 1; day <= endDay; day++) { // Loop until the last day of the month or today's date
        const dateString = new Date(currentYear, currentMonth, day).toLocaleDateString('en-US'); // Specify locale
        if (!result[dateString]) {
          completeResults.push({ date: dateString, total: 0, quantity: 0 }); // Fill missing dates with 0
        } else {
          completeResults.push(result[dateString]); // Use existing data
        }
      }
    }

    return completeResults;
  };

  // Use the transformed data in the chart
  const chartData = transformOrderDetails(totalRevenue?.order_details);

  // console.log(chartData);




  const paymentMethodsReport = async () => {
    // setIsProcessing(true);
    try {
      const infomation = {
        Efectivo: payMethodData?.cash,
        Tarjeta_de_debito: payMethodData?.debit,
        Tarjeta_de_crédito: payMethodData?.credit,
        Transferencias: payMethodData?.transfer
      };

      const formattedData = Object.entries(
        infomation
      ).map(([key, value]) => ({
        Campo: key == "Tarjeta_de_debito" ? "Tarjeta de debito" :
          key == "Tarjeta_de_crédito" ? "Tarjeta de crédito" : key,
        Valor: value
      }));


      // Create a worksheet
      const wsi = XLSX.utils.json_to_sheet(formattedData, { origin: "A2" });

      // Add a heading "Información"
      // Merge cells for the heading
      XLSX.utils.sheet_add_aoa(wsi, [["Métodos pago"]], { origin: "A1" });
      wsi["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

      // Apply styles to the heading
      wsi["A1"].s = {
        font: { name: "Aptos Narrow", bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" }
      };

      // Set row height for the heading
      if (!wsi["!rows"]) wsi["!rows"] = [];
      wsi["!rows"][0] = { hpt: 30 };

      // Auto-size columns
      const colWidthsa = [{ wch: 20 }, { wch: 30 }]; // Set widths for "Campo" and "Valor"
      wsi["!cols"] = colWidthsa;

      // Set row height for header
      wsi["!rows"] = [{ hpt: 25 }]; // Set height of first row to 25


      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsi, "Métodos pago");

      XLSX.writeFile(
        wb,
        `Métodos pago ${paymentsData}-${selectedHastaMonth == "1" ? "Enero" :
          selectedHastaMonth == "2" ? "Febrero" :
            selectedHastaMonth == "3" ? "Marzo" :
              selectedHastaMonth == "4" ? "Abril" :
                selectedHastaMonth == "5" ? "Mayo" :
                  selectedHastaMonth == "6" ? "Junio" :
                    selectedHastaMonth == "7" ? "Julio" :
                      selectedHastaMonth == "8" ? "Agosto" :
                        selectedHastaMonth == "9" ? "Septiembre" :
                          selectedHastaMonth == "10" ? "Octubre" :
                            selectedHastaMonth == "11" ? "Noviembre" :
                              selectedHastaMonth == "12" ? "Diciembre" : " "
        }.xlsx`
      );
      // console.log(selectedHastaMonth, paymentsData);

    } catch (error) {
      console.error("Error generating report:", error);

    }
  };

  const totalrevenueReport = async () => {

    const historia = chartData
      .map((table, index) => {
        if (index > 0) {
          return {
            Fecha: table.date,
            totales: table.quantity,
            cantidad: table.total,
          };
        }
        return null; // Return null for index 0
      })
      .filter(item => item !== null);

    const ws = XLSX.utils.json_to_sheet(historia.length > 0 ? historia : [{ Fecha: "", totales: "", cantidad: "" }], { origin: "A2" });

    // Add a heading "Reporte de Entrega"
    XLSX.utils.sheet_add_aoa(ws, [["Ingresos totales"]], { origin: "A1" });
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }]; // Merge cells for the heading

    // Add column names only if there is data
    if (historia.length > 0) {
      const columnNames = ["Fecha", " totales", "cantidad"];
      XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" })
    } else {
      // Add column names even if there's no data
      const columnNames = ["Fecha", " totales", "cantidad"];
      XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" });
    }

    // Apply styles to the heading
    ws["A1"].s = {
      font: { name: "Aptos Narrow", bold: true, sz: 16 },
      alignment: { horizontal: "center", vertical: "center" }
    };

    // Set row height for the heading
    if (!ws["!rows"]) ws["!rows"] = [];
    ws["!rows"][0] = { hpt: 30 };
    ws["!rows"][1] = { hpt: 25 }; // Set height for column names

    // Auto-size columns
    const colWidths = [{ wch: 15 }, { wch: 20 }];
    ws["!cols"] = colWidths;

    // Add sorting functionality
    if (historia.length > 0) {
      ws['!autofilter'] = { ref: `A2:B${historia.length}` }; // Enable autofilter for the range
    }
    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ingresos totales");

    XLSX.writeFile(
      wb,
      `Reporte de Ingresos totales ${revData}-${selectedRevMonth == "1" ? "Enero" :
        selectedRevMonth == "2" ? "Febrero" :
          selectedRevMonth == "3" ? "Marzo" :
            selectedRevMonth == "4" ? "Abril" :
              selectedRevMonth == "5" ? "Mayo" :
                selectedRevMonth == "6" ? "Junio" :
                  selectedRevMonth == "7" ? "Julio" :
                    selectedRevMonth == "8" ? "Agosto" :
                      selectedRevMonth == "9" ? "Septiembre" :
                        selectedRevMonth == "10" ? "Octubre" :
                          selectedRevMonth == "11" ? "Noviembre" :
                            selectedRevMonth == "12" ? "Diciembre" : " "
      }.xlsx`
    );
  }

  const summaryStatesReport = async () => {
    // setIsProcessing(true);
    try {
      const infomation = {
        Recibido: summaryState?.received,
        Preparado: summaryState?.prepared,
        Finalizado: summaryState?.finalized,
        Entregado: summaryState?.delivered,
      };
      const formattedData = Object.entries(
        infomation
      ).map(([key, value]) => ({
        Campo: key,
        Valor: value
      }));


      // Create a worksheet
      const wsi = XLSX.utils.json_to_sheet(formattedData, { origin: "A2" });

      // Add a heading "Información"
      // Merge cells for the heading
      XLSX.utils.sheet_add_aoa(wsi, [["Resumen estados"]], { origin: "A1" });
      wsi["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

      // Apply styles to the heading
      wsi["A1"].s = {
        font: { name: "Aptos Narrow", bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" }
      };

      // Set row height for the heading
      if (!wsi["!rows"]) wsi["!rows"] = [];
      wsi["!rows"][0] = { hpt: 30 };

      // Auto-size columns
      const colWidthsa = [{ wch: 20 }, { wch: 30 }]; // Set widths for "Campo" and "Valor"
      wsi["!cols"] = colWidthsa;

      // Set row height for header
      wsi["!rows"] = [{ hpt: 25 }]; // Set height of first row to 25


      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsi, "Resumen estados");

      XLSX.writeFile(
        wb,
        `Reporte de Resumen estados.xlsx`
      );
      // console.log(selectedHastaMonth, paymentsData);

    } catch (error) {
      console.error("Error generating report:", error);

    }
  };
  // console.log(summaryState);


  const PopularReport = async () => {

    const historia = popularData
      .map((table, index) => {

        return {
          // Imagen: `${API}/images/${table.image}`,
          Nombre: table.name,
          Padido: table.order_count,
          cantidad: `$${table.amount}`
        }
      })
      .filter(item => item !== null);

    const ws = XLSX.utils.json_to_sheet(historia.length > 0 ? historia : [{ Nombre: "", Padido: "", cantidad: "" }], { origin: "A2" });

    // Add a heading "Reporte de Entrega"
    XLSX.utils.sheet_add_aoa(ws, [["Ingresos totales"]], { origin: "A1" });
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }]; // Merge cells for the heading

    // Add column names only if there is data
    if (historia.length > 0) {
      const columnNames = ["Nombre", " Padido", "cantidad"];
      XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" })
    } else {
      // Add column names even if there's no data
      const columnNames = ["Nombre", " Padido", "cantidad"];
      XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" });
    }

    // Apply styles to the heading
    ws["A1"].s = {
      font: { name: "Aptos Narrow", bold: true, sz: 16 },
      alignment: { horizontal: "center", vertical: "center" }
    };

    // Set row height for the heading
    if (!ws["!rows"]) ws["!rows"] = [];
    ws["!rows"][0] = { hpt: 30 };
    ws["!rows"][1] = { hpt: 25 }; // Set height for column names

    // Auto-size columns
    const colWidths = [{ wch: 15 }, { wch: 10 }, { wch: 10 }];
    ws["!cols"] = colWidths;

    // Add sorting functionality
    if (historia.length > 0) {
      ws['!autofilter'] = { ref: `A2:C${historia.length}` }; // Enable autofilter for the range
    }
    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ingresos totales");

    XLSX.writeFile(
      wb,
      `Reporte de Ingresos totales ${popData}-${selectPopMonth == "1" ? "Enero" :
        selectPopMonth == "2" ? "Febrero" :
          selectPopMonth == "3" ? "Marzo" :
            selectPopMonth == "4" ? "Abril" :
              selectPopMonth == "5" ? "Mayo" :
                selectPopMonth == "6" ? "Junio" :
                  selectPopMonth == "7" ? "Julio" :
                    selectPopMonth == "8" ? "Agosto" :
                      selectPopMonth == "9" ? "Septiembre" :
                        selectPopMonth == "10" ? "Octubre" :
                          selectPopMonth == "11" ? "Noviembre" :
                            selectPopMonth == "12" ? "Diciembre" : " "
      }.xlsx`
    );
  }

  const boxEntryReport = () => {
    const historia = boxDetails
      .map((table, index) => {

        const totalAmount = table.logs.reduce((sum, log) => {
          const closeAmount = parseFloat(log.close_amount);
          const openAmount = parseFloat(log.open_amount) || 0;
          return closeAmount ? sum + (closeAmount - openAmount) : sum;
        }, 0);


        return {
          caja: table.box_name,
          CantidadTotal: (totalAmount).toFixed(0),
        };
      })
      .filter(item => item !== null);

    const ws = XLSX.utils.json_to_sheet(historia.length > 0 ? historia : [{ caja: "", CantidadTotal: "" }], { origin: "A2" });

    // Add a heading "Reporte de Entrega"
    XLSX.utils.sheet_add_aoa(ws, [["Ingreso de cajas"]], { origin: "A1" });
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }]; // Merge cells for the heading

    // Add column names only if there is data
    if (historia.length > 0) {
      const columnNames = ["caja", " CantidadTotal"];
      XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" })
    } else {
      // Add column names even if there's no data
      const columnNames = ["caja", " CantidadTotal"];
      XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" });
    }

    // Apply styles to the heading
    ws["A1"].s = {
      font: { name: "Aptos Narrow", bold: true, sz: 16 },
      alignment: { horizontal: "center", vertical: "center" }
    };

    // Set row height for the heading
    if (!ws["!rows"]) ws["!rows"] = [];
    ws["!rows"][0] = { hpt: 30 };
    ws["!rows"][1] = { hpt: 25 }; // Set height for column names

    // Auto-size columns
    const colWidths = [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    ws["!cols"] = colWidths;

    // Add sorting functionality
    if (historia.length > 0) {
      ws['!autofilter'] = { ref: `A2:B${historia.length}` }; // Enable autofilter for the range
    }
    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ingreso de cajas");

    XLSX.writeFile(
      wb,
      `Reporte de Ingreso de cajas ${boxDay}-${selectBoxMonth == "1" ? "Enero" :
        selectBoxMonth == "2" ? "Febrero" :
          selectBoxMonth == "3" ? "Marzo" :
            selectBoxMonth == "4" ? "Abril" :
              selectBoxMonth == "5" ? "Mayo" :
                selectBoxMonth == "6" ? "Junio" :
                  selectBoxMonth == "7" ? "Julio" :
                    selectBoxMonth == "8" ? "Agosto" :
                      selectBoxMonth == "9" ? "Septiembre" :
                        selectBoxMonth == "10" ? "Octubre" :
                          selectBoxMonth == "11" ? "Noviembre" :
                            selectBoxMonth == "12" ? "Diciembre" : " "
      }.xlsx`
    );
  }

  const CancelledordersReport = () => {

    const historia = cancelOrder
      .map((table, index) => {

        const box = boxName.find(box => box.id === table.box_id);
        return {
          Pedido: table.id,
          Caja: box ? box.name : '',
          Hora: new Date(table.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          Fecha: new Date(table.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/'),
          Estado: table.status === 'cancelled' ? 'Anulado' : table.status,
        };
      })
      .filter(item => item !== null);

    const ws = XLSX.utils.json_to_sheet(historia.length > 0 ? historia : [{ Pedido: "", Caja: "", Hora: "", Fecha: "", Estado: "" }], { origin: "A2" });

    // Add a heading "Reporte de Entrega"
    XLSX.utils.sheet_add_aoa(ws, [["Anulación pedidos"]], { origin: "A1" });
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }]; // Merge cells for the heading

    // Add column names only if there is data
    if (historia.length > 0) {
      const columnNames = ["Pedido", " Caja", "Hora", "Fecha", "Estado"];
      XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" })
    } else {
      // Add column names even if there's no data
      const columnNames = ["Pedido", " Caja", "Hora", "Fecha", "Estado"];
      XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" });
    }

    // Apply styles to the heading
    ws["A1"].s = {
      font: { name: "Aptos Narrow", bold: true, sz: 16 },
      alignment: { horizontal: "center", vertical: "center" }
    };

    // Set row height for the heading
    if (!ws["!rows"]) ws["!rows"] = [];
    ws["!rows"][0] = { hpt: 30 };
    ws["!rows"][1] = { hpt: 25 }; // Set height for column names

    // Auto-size columns
    const colWidths = [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    ws["!cols"] = colWidths;

    // Add sorting functionality
    if (historia.length > 0) {
      ws['!autofilter'] = { ref: `A2:D${historia.length}` }; // Enable autofilter for the range
    }
    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Anulación pedidos");

    XLSX.writeFile(
      wb,
      `Reporte de Anulación pedidos ${cancelOrderDay}-${seleceCancelMonth == "1" ? "Enero" :
        seleceCancelMonth == "2" ? "Febrero" :
          seleceCancelMonth == "3" ? "Marzo" :
            seleceCancelMonth == "4" ? "Abril" :
              seleceCancelMonth == "5" ? "Mayo" :
                seleceCancelMonth == "6" ? "Junio" :
                  seleceCancelMonth == "7" ? "Julio" :
                    seleceCancelMonth == "8" ? "Agosto" :
                      seleceCancelMonth == "9" ? "Septiembre" :
                        seleceCancelMonth == "10" ? "Octubre" :
                          seleceCancelMonth == "11" ? "Noviembre" :
                            seleceCancelMonth == "12" ? "Diciembre" : " "
      }.xlsx`
    );


  }

  // console.log(popularData);


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
                      $ {stateData.total_income ? stateData.total_income.toFixed(2) : '0.00'}
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
                          setPaymentData('month');
                          if (selectedValue === "12") {
                            const currentMonth = new Date().getMonth() + 1;
                            setSelectedHastaMonth(currentMonth); // Set to current month
                            fetchData(); // Call fetchData to get current month data
                          }
                        }}
                        value={selectedHastaMonth}
                        style={{ fontWeight: '500', lineHeight: '21px' }}
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
                      disabled={selectedHastaMonth != new Date().getMonth() + 1}
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option4"
                      onClick={() => {
                        if (selectedHastaMonth == new Date().getMonth() + 1) {
                          setPaymentData('day')
                        } else {
                          setPaymentData('month')
                        }
                      }}
                    >
                      Día
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="options-base1"
                      id="option5"
                      autoComplete="off"
                      disabled={selectedHastaMonth != new Date().getMonth() + 1}
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option5"
                      onClick={() => {
                        if (selectedHastaMonth == new Date().getMonth() + 1) {
                          setPaymentData('week')
                        } else {
                          setPaymentData('month')
                        }
                      }}
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
                      checked={paymentsData == "month"}
                      disabled={selectedHastaMonth > new Date().getMonth() + 1}
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option6"
                      onClick={() => {
                        setPaymentData('month');
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
                    <div className="d-flex align-items-center  col-md-6">
                      <img src={chart1} className="ss_img" />
                      <p className="ss_fontsize mb-0 sjfs-14">
                        Efectivo:{" "}
                        <span className="text-white me-4 sjfs-14">
                          {payMethodData?.cash}$ CLP
                        </span>
                      </p>
                    </div>
                    <div className="d-flex align-items-center   col-md-6">
                      <img src={chart3} className="ssj_img" />
                      <p className="ss_fontsize mb-0 sjfs-14">
                        Tarjeta debito:{" "}
                        <span className="text-white sjfs-14">{payMethodData?.debit}$ CLP</span>
                      </p>
                    </div>
                  </div>
                  <div className="j-payment-foot text-white row">
                    <div className="d-flex align-items-center  col-md-6 ">
                      <img src={chart4} className="ss_img" />
                      <p className="ss_fontsize mb-0 sjfs-14">
                        Tarjeta crédito:{" "}
                        <span className="text-white me-4 sjfs-14">
                          {payMethodData?.credit}$ CLP
                        </span>
                      </p>
                    </div>
                    <div className="d-flex align-items-center  col-md-6">
                      <img src={chart2} className="ssj_img" />
                      <p className="ss_fontsize mb-0 sjfs-14">
                        Transferencias:{" "}
                        <span className="text-white sjfs-14">{payMethodData?.transfer}$ CLP</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="j-foot-text text-end" onClick={paymentMethodsReport}>
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

                      <p style={{ fontSize: "16px", fontWeight: "400", lineHeight: "24px", textAlign: "left" }}>Ingresos totales</p>
                    </div>

                    <div className="s_dashboard-right-head">
                      <div className="mb-2">
                        <select
                          id="month-select"
                          className="form-select sjfs-14"
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setSelectedRevtaMonth(selectedValue);
                            // setRevData('month')
                            if (selectedValue === "12") {
                              const currentMonth = new Date().getMonth() + 1;
                              setSelectedRevtaMonth(currentMonth); // Set to current month
                              fetchData(); // Call fetchData to get current month data
                            }
                          }}
                          value={selectedRevMonth}
                          style={{ fontWeight: '500', lineHeight: '21px' }}
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
                          disabled={selectedRevMonth != new Date().getMonth() + 1}
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
                          disabled={selectedRevMonth != new Date().getMonth() + 1}
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
                          checked={revData == "month"}
                          disabled={selectedRevMonth > new Date().getMonth() + 1}
                        />
                        <label
                          className="btn btn-outline-primary j-custom-label sjfs-12"
                          htmlFor="option9"
                          onClick={() => {
                            setRevData('month'); // Set to current month
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
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="10%" stopColor="#1c64f2" stopOpacity={0.5} />
                          <stop offset="90%" stopColor="#395692" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="10%" stopColor="#16bdca" stopOpacity={0.5} />
                          <stop offset="90%" stopColor="#1c506a" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 65, 82)" horizontal={true} vertical={false} />
                      {/* {chartData[0]!=undefined && ( */}

                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          // Check if revData is 'day' and return today's date
                          return revData === 'day' ? `${String(new Date().getDate()).padStart(2, '0')}` : `${String(d.getDate()).padStart(2, '0')}`;
                        }}
                        // tick={{ fill: 'white' }}
                        interval={0}
                        padding={{ left: 25, right: 10 }}
                        domain={['dataMin', 'dataMax']}
                      />
                      {/* )} */}
                      <YAxis yAxisId="left" orientation="left" stroke="#1c64f2" hide />
                      <YAxis yAxisId="right" orientation="right" stroke="#16bdca" hide />
                      <Tooltip cursor={false} formatter={(value, name) => [value, name === 'total' ? 'Total' : 'Quantity']} />
                      <Area
                        // type="monotone"
                        dataKey="total"
                        stroke="#1c64f2"
                        strokeWidth={3}
                        fill="url(#colorOrder)"
                        dot={false}
                        yAxisId="left"
                      />
                      <Area
                        // type="monotone"
                        dataKey="quantity"
                        stroke="#16bdca"
                        strokeWidth={3}
                        fill="url(#colorTotal)"
                        dot={false}
                        yAxisId="right"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="j-foot-text text-end" onClick={totalrevenueReport}>
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
                    <div className="d-flex align-items-center j-margin ak-Dstate">
                      <img src={chart4} className="jj_img me-2 ak-me1" />
                      <p className="ss_fontsize mb-0 sjfs-14" style={{ lineHeight: '21px' }}>Recibido</p>
                    </div>
                    <div className="d-flex align-items-center j-margin ak-Dstate">
                      <img src={chart2} className="jj_img me-2 ak-me1" />
                      <p className="ss_fontsize mb-0 sjfs-14" style={{ lineHeight: '21px' }}>Preparado</p>
                    </div>
                    <div className="d-flex align-items-center j-margin ak-Dstate">
                      <img src={chart1} className="jj_img me-2 ak-me1" />
                      <p className="ss_fontsize mb-0 sjfs-14" style={{ lineHeight: '21px' }}>Finalizado</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <img src={chart3} className="jj_img me-2 ak-me1" />
                      <p className="ss_fontsize mb-0 sjfs-14" style={{ lineHeight: '21px' }}>Entregado</p>
                    </div>
                  </div>
                </div>
                <div className="j-foot-text text-end" onClick={summaryStatesReport}>
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
                          setPopData('month');
                          if (selectedValue === "12") {
                            const currentMonth = new Date().getMonth() + 1;
                            setSelectPopMonth(currentMonth); // Set to current month
                            fetchData(); // Call fetchData to get current month data
                          }
                        }}
                        value={selectPopMonth}
                        style={{ fontWeight: '500', lineHeight: '21px' }}
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
                      disabled={selectPopMonth != new Date().getMonth() + 1}
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
                      disabled={selectPopMonth != new Date().getMonth() + 1}
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
                      checked={popData == "month"}
                      disabled={selectPopMonth > new Date().getMonth() + 1}

                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option12"
                      onClick={() => {
                        setPopData('month');
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
                  {popularData?.map((item, index) => (
                    <div
                      key={item.id} // Ensure each item has a unique key
                      className="j-summary-body-data scrollbox d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center">
                        <div className="j-order-no" style={{ width: "30px" }}>#{index + 1}</div>
                        <div className="j-order-img">
                          <img src={`${API}/images/${item.image}`} alt={item.name} style={{ borderRadius: "8px" }} />
                        </div>
                        <div className="j-order-data">
                          <h4 className="sjfs-16">{item.name}</h4>
                          <p className="sjfs-12">Pedido {item.order_count}</p>
                        </div>
                      </div>
                      <div className="j-order-price sjfs-16 me-2">
                        {parseFloat(item.amount) % 1 === 0 ? `${parseFloat(item.amount).toFixed(0)}$` : `${parseFloat(item.amount)}$`}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="j-foot-text text-end" onClick={PopularReport}>
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
                          setDeliveryDay('month');
                          if (selectedValue === "12") {
                            const currentMonth = new Date().getMonth() + 1;
                            setSelectDeliveryMonth(currentMonth); // Set to current month
                            fetchData(); // Call fetchData to get current month data
                          }
                        }}
                        value={selectDeliveryMonth}
                        style={{ fontWeight: '500', lineHeight: '21px' }}
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
                      disabled={selectDeliveryMonth != new Date().getMonth() + 1}
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
                      disabled={selectDeliveryMonth != new Date().getMonth() + 1}
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
                      checked={deliveryDay == "month"}
                      disabled={selectDeliveryMonth > new Date().getMonth() + 1}


                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option15"
                      onClick={() => {
                        setDeliveryDay('month');
                        fetchData(); // Call fetchData to get current month data
                      }}
                    >
                      Mes
                    </label>
                  </div>
                </div>

                <div className="j-delivery-body">
                  <div className="row align-items-center mt-4">
                    <div className="col-4">
                      <div className="j-delivery-data">
                        <p className="sjfs-16" style={{ fontWeight: "500", lineHeight: '21px' }}>Delivery</p>
                        <h5 className="sjfs-2">{deliveryData.delivery}</h5>
                      </div>
                    </div>
                    <div className="col-4 text-center">
                      <div className="j-delivery-data">
                        <p className="sjfs-16" style={{ fontWeight: "500", lineHeight: '21px' }}>Retiro</p>
                        <h5 className="sjfs-2">{deliveryData.withdrawal}</h5>
                      </div>
                    </div>
                    <div className="col-4 text-end">
                      <div className="j-delivery-data">
                        <p className="sjfs-16" style={{ fontWeight: "500", lineHeight: '21px' }}>Local</p>
                        <h5 className="sjfs-2">{deliveryData.local}</h5>
                      </div>
                    </div>

                    {/* <div className="col-6">
                      <div className="j-delivery-data">
                        <p className="sjfs-16"style={{fontWeight:"500", lineHeight:'21px'}}>Plataforma</p>
                        <h5 className="sjfs-2">{deliveryData.platform}</h5>
                      </div>
                    </div> */}
                  </div>
                  <div >&nbsp;</div>
                  <div >&nbsp;</div>
                  <div >&nbsp;</div>

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
                          // {
                          //   name: 'Plataforma',
                          //   // data: [deliveryData.platform],
                          //   data: deliveryData.platform ? [deliveryData.platform] : [0], // Provide default value
                          //   color: "#31c48d"
                          // },
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
                      {/* <div className="d-flex align-items-center">
                        <img src={green} className="jj_img me-2" />
                        <p className="ss_fontsize mb-0 sjfs-12">Plataforma</p>
                      </div> */}
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
                          setBoxDay('month');
                          if (selectedValue === "12") {
                            const currentMonth = new Date().getMonth() + 1;
                            setselectBoxMonth(currentMonth); // Set to current month
                            fetchData(); // Call fetchData to get current month data
                          }
                        }}
                        value={selectBoxMonth}
                        style={{ fontWeight: '500', lineHeight: '21px' }}
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
                      disabled={selectBoxMonth != new Date().getMonth() + 1}
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
                      disabled={selectBoxMonth != new Date().getMonth() + 1}
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
                      checked={boxDay == "month"}
                      disabled={selectBoxMonth > new Date().getMonth() + 1}
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option18"
                      onClick={() => {
                        setBoxDay('month');
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

                    // console.log(chartData,ele.box_name,totalAmount,ele);


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

                <div className="j-foot-text text-end" onClick={boxEntryReport}>
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
                          setCancelOrderDay('month');
                          if (selectedValue === "12") {
                            const currentMonth = new Date().getMonth() + 1;
                            setSelectCencelMonth(currentMonth); // Set to current month
                            fetchData(); // Call fetchData to get current month data
                          }
                        }}
                        value={seleceCancelMonth}
                        style={{ fontWeight: '500', lineHeight: '21px' }}
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
                      disabled={seleceCancelMonth != new Date().getMonth() + 1}
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
                      disabled={seleceCancelMonth != new Date().getMonth() + 1}
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option20"
                      onClick={() => setCancelOrderDay('week')}
                      disabled={seleceCancelMonth < new Date().getMonth() + 1}

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
                      checked={cancelOrderDay == "month"}
                      disabled={seleceCancelMonth > new Date().getMonth() + 1}
                    />
                    <label
                      className="btn btn-outline-primary j-custom-label sjfs-12"
                      htmlFor="option21"
                      onClick={() => {
                        setCancelOrderDay('month');
                        // const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
                        // setSelectCencelMonth(currentMonth); // Set to current month
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
                <div className="j-foot-text text-end" onClick={CancelledordersReport}>
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

