import React from 'react';

const TableRecipt = () => {
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
        cashier: "admin",
        date: "16/6/2022",
        time: "13:15:33",
        items: [
            { description: "Pepsi 500ml", quantity: 1, unitPrice: 1.33, total: 1.33 }
        ],
        totals: {
            subtotalIva: 1.33,
            subtotal0: 0.00,
            discount: 0.00,
            iva: 0.16,
            total: 1.49,
            received: 4.47,
            change: 0.00
        },
        masa: {
            masa: "2"
        },
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
                                <td className='p-0'>${item.unitPrice.toFixed(2)}</td>
                                <td className='p-0'>${item.total.toFixed(2)}</td>
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
                            IVA 12.00%:
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
                    Mesero:
                    <div className='mt-2'>
                        <div className='me-3'>
                            Cedula/RUC:
                        </div>
                        <div className='mt-2'>
                            Cliente:
                        </div>
                        <div className='mt-2'>
                            Telefono:
                        </div>
                        <div className='mt-2'>
                            Email:
                        </div>
                        <div className='mt-2 mb-3'>
                            Direccion:
                        </div>
                    </div>
                </p>
            </div >
        </div >

    );
};

export default TableRecipt;

