import React, { useEffect, useState } from 'react';

const TableRecipt = ({payment,tableData,productData}) => {
    const [currentTime, setCurrentTime] = useState(new Date());

  
  const role = localStorage.getItem("role");
  const wName = localStorage.getItem("name");
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentSecond = currentDate.getSeconds();
  const day = currentTime.getDate();
  const month = currentTime.getMonth() + 1;
  const year = currentTime.getFullYear();
  const formattedDate = `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
  const formattedTime = currentTime.toTimeString().split(' ')[0];
    const receiptData = {
        storeName: "CAFE CHOCO CHIP",
        storeInfo: {
            phone: "0998809875001",
            branch: "Guayaquil",
            phone2: "9999999"
        },
        invoice: {
            type: "PRECUENTA"
        },
        cashier: role,
        date: formattedDate,
        time: formattedTime,
        // items: [
        //     { description: "Pepsi 500ml", quantity: 1, unitPrice: 1.33, total: 1.33 }
        // ],
        items: tableData[0].items.map((i) => {
            const product = productData.find(p => p.id === i.item_id);
            return {
                description: product ? product.name : i.name,
                quantity: i.quantity,
                unitPrice: i.amount,
                total: i.quantity * parseFloat(i.amount)
            };
        }),
    
        masa: {
            masa: tableData[0].table_id
        },
    };
    const itemsTotal = receiptData.items.reduce(
        (sum, item) => sum + item.total,
        0
      );
const discount = parseFloat(tableData[0].discount) || 0; // Ensure discount is a number

      const price = itemsTotal - tableData[0].discount;
  const iva = price * 0.19; // 12% tax
  const total = price + iva;
  receiptData.totals = {
    subtotalIva: itemsTotal,
    subtotal0: 0.0,
    discount: discount,
    iva: iva,
    total: total,
    received: total, // Assuming the exact amount is received
    change: 0.0
  };
    return (

        <div className='j-counter-recipt'>
            <div style={{ fontFamily: 'monospace', width: '380px', margin: '0 auto', backgroundColor: "white", color: "black", fontWeight: "bold" }}>
                <h2 style={{ fontSize: "16px", textAlign: 'center', marginTop: "10px" }}>{receiptData.storeName}</h2>
                <p style={{ fontSize: "12px", textAlign: 'center' }}>
                    {receiptData.storeInfo.phone}<br />
                    Sucursal: {receiptData.storeInfo.branch}<br />
                    Telefono: {receiptData.storeInfo.phone2}
                </p>

                <p style={{ fontSize: "12px", textAlign: 'center', }}>
                    {receiptData.invoice.type}
                </p>
                <p className='mx-1 mb-0' style={{ fontSize: "12px", textAlign: 'left' }}>
                    Cajero: {receiptData.cashier}<br />
                    <div className='d-flex justify-content-between'>
                        <div>Fecha: {receiptData.date}</div>
                        <div>Hora: {receiptData.time}<br /></div>
                    </div>

                </p>
                <div style={{ borderBottom: "1px dashed #000", marginTop: '1px' }} ></div>
                <div className='mb-2' style={{ borderBottom: "1px dashed #000", marginTop: '1px' }} ></div>

                <table className='mx-1' style={{ fontSize: "12px", width: '100%' }}>
                    <thead style={{ borderBottom: "1px dashed #000" }}>
                        <tr>
                            <th>DESCRIP</th>
                            <th>CANT</th>
                            <th>P.UNIT</th>
                            <th>P.TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receiptData.items.map((item, index) => (
                            <tr key={index}>
                                <td className='p-0'>{item.description}</td>
                                <td className='p-0'>{item.quantity}</td>
                                <td className='p-0'>${item.unitPrice}</td>
                                <td className='p-0'>${item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr className='my-1' />
                {/* <div style={{borderBottom:"1px dashed #000"}} ></div> */}
                <p style={{ fontSize: "12px", textAlign: 'center' }}>
                    <div className="d-flex justify-content-between mx-1">
                        <div>
                            Subtotal IVA:
                        </div>
                        <div>
                            {receiptData.totals.subtotalIva.toFixed(2)}<br />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mx-1">
                        <div>
                            Subtotal 0%:
                        </div>
                        <div>
                            {receiptData.totals.subtotal0.toFixed(2)}<br />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mx-1">
                        <div>
                            Dcto:
                        </div>
                        <div>
                            {receiptData.totals.discount.toFixed(2)}<br />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mx-1">
                        <div>
                            IVA 19.00%:
                        </div>
                        <div>
                            {receiptData.totals.iva.toFixed(2)}<br />
                        </div>
                    </div>
                    <div style={{ borderBottom: "1px dashed #000", marginTop: '1px' }} ></div>
                    <div className="d-flex justify-content-between mx-1 py-1">
                        <div>
                            <strong>Total:</strong>
                        </div>
                        <div>
                            <strong>{receiptData.totals.total.toFixed(2)}</strong><br />
                        </div>
                    </div>
                    <div className='mb-2' style={{ borderBottom: "1px dashed #000", marginTop: '1px' }} ></div>
                </p>
                <p className='mb-0 mx-1' style={{ fontSize: "12px", textAlign: 'left' }}>
                    Mesa: {receiptData.masa.masa}<br />
                    Mesero: {wName}
                    <div className='mt-2'>
                        <div className='me-3'>
                            Cedula/RUC:{payment.rut || ""}
                        </div>
                        {console.log(tableData)}
                        <div className='mt-2'>
                            Cliente: {payment.firstname || payment.businessname || tableData[0].customer_name ||  ""}
                        </div>
                        <div className='mt-2'>
                            Telefono:{payment.phone || ""}
                        </div>
                        <div className='mt-2'>
                            Email:{payment.email || ""}
                        </div>
                        <div className='mt-2 mb-3'>
                            Direccion:{payment.address || ""}
                        </div>
                    </div>
                </p>
            </div >
        </div >

    );
};

export default TableRecipt;

