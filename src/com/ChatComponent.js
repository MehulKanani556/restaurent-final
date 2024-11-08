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
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { startTransition } from "react";

const ChatComponent = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const API = process.env.REACT_APP_IMAGE_URL;
  const token = localStorage.getItem("token");
  const admin_id = localStorage.getItem("admin_id");
  const [selectedRevMonth, setSelectedRevtaMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState([]);
  const [revData, setRevData] = useState('month');
  const [totalRevenue, setTotalRevenue] = useState([]);
  useEffect(() => {
    
    fetchData();
  }, [token]);
  useEffect(() => {
    fetchTotalRevenue();
  }, [revData, selectedRevMonth]);
  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/dashboard`,
        { admin_id }, // You can pass any data here if needed
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' // Ensure Content-Type is set correctly
          },
        }
      );
      setData(response.data);
      // setLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., setting an error state or displaying a message
    }
  };
  const fetchTotalRevenue = async () => {
    try {
      let durationData = {};

      if (revData === 'day') {
        durationData = {
          duration: 'day',
          day: new Date().toISOString().split('T')[0]
          //   duration: 'week',
          // week: '1'
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
          // duration: 'day',
          // day: new Date().toISOString().split('T')[0]
          
        };
      } 

      const response = await axios.post(
        `${apiUrl}/getTotalRevenue`,
        { ...durationData, admin_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' // Ensure Content-Type is set correctly
          },
        }
      );
      setTotalRevenue(response.data.total_revenue);
      // setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately
    }
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
        const cn = startDate.getMonth()+1; // Get the current month number
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get number of days in the current month
        let endDay = selectedRevMonth === cn ? today : daysInMonth; // Determine the end day based on the condition
        // console.log(endDay,selectedRevMonth,cn,selectedRevMonth === cn)
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
      const cn = startDate.getMonth()+1; // Get the current month number

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

  const chartData = transformOrderDetails(totalRevenue.order_details);

  return (
    <div className="col-6 j-payment-color2">
    <div className="s_dashboard-head">
      <div className="d-flex justify-content-between text-white">
        <div className="s_dashboard-left-head  ">
          <h2 className="text-white  sjfs-2">{Number(totalRevenue.total_revenue).toFixed(0)}$</h2>

          <p style={{fontSize: "16px",fontWeight: "400",lineHeight: "24px", textAlign: "left"}}>Ingresos totales</p>
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
                  // fetchData(); // Call fetchData to get current month data
                }
              }}
              value={selectedRevMonth}
              style={{fontWeight: '500', lineHeight: '21px'}}
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
              checked= {revData == "month"}
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
      {/* {console.log(chartData)} */}
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
    <div className="j-foot-text text-end" >
      <button className="sjfs-14">
        Ver reporte 
      </button>
    </div>
  </div>
  );
};

export default ChatComponent;




