import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import PDF417Barcode from './PDF417Barcode';

const CreditRecipt = forwardRef(({ paymentData, creditData }, ref) => {
    console.log(paymentData, creditData);

    const receiptData = {
        storeCenter: "S.I.I. - SANTIAGO CENTRO",
        rut: paymentData.rut,
        date: new Date(creditData.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-'),
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        storeInfo: {
            name: "EMPANADAS OLGUITA LIMITADA",
            add: "ELABORACION DE PRODUCTOS DE PANADERIA Y PASTELERIA",
            street: "NUBLE 328, Santiago",
        },
        infomation: {
            name: creditData.name,
            add: paymentData.address
        },
        subtotal: creditData.return_items.reduce((acc, v) => acc + v.quantity * v.amount, 0),
        tax: (creditData.return_items.reduce((acc, v) => acc + v.quantity * v.amount, 0) * 19 / 100).toFixed(2),
        total: (creditData.return_items.reduce((acc, v) => acc + v.quantity * v.amount, 0) * 19 / 100 + creditData.return_items.reduce((acc, v) => acc + v.quantity * v.amount, 0)).toFixed(2),
    };
    const barcodeData = JSON.stringify({
        code: creditData.code,
        rut: paymentData.rut,
        date: receiptData.date,
        total: receiptData.total,
        items: creditData.return_items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            amount: item.amount
        })),
    });
    return (

        <div id="printCredit" style={{ backgroundColor: "transparent" }}>
            <div className='j-counter-recipt' id='specific-div-id' style={{ backgroundColor: "transparent" , marginBottom:'40px' }}>
                <div ref={ref} style={{ fontFamily: 'monospace', width: '450px', margin: '0 auto', backgroundColor: "white", color: "black", padding: "15px", fontWeight: "500" }}>
                    <div style={{ fontSize: "18px", textAlign: 'center', marginTop: "10px", border: "1px solid #000", width: "90%", margin: "10px auto 0px auto", padding: "5px", fontWeight: "bold" }}>
                        <div style={{ marginBottom: '5px' }}>R.U.T. : {paymentData.rut}</div>
                        <div>NOTA DE CRÉDITO</div>
                        <div style={{ marginBottom: '10px', lineHeight: '10px' }}>ELECTRÓNICA </div>
                        <div>Nº {creditData.code}</div>
                    </div>
                    <h2 style={{ fontSize: "18px", textAlign: 'center', margin: "6px auto", fontWeight: "bold" }}>
                        {receiptData.storeCenter}
                    </h2>
                    <h3 style={{ fontSize: "18px", marginTop: "20px", marginBottom: "0px", fontWeight: "bold" }}>
                        {receiptData.storeInfo.name}
                    </h3>
                    <p style={{ fontSize: "13px", marginBottom: "0px" }}>
                        {receiptData.storeInfo.add}
                    </p>
                    <p style={{ fontSize: "13px", marginBottom: "0px" }}>
                        {receiptData.storeInfo.street}
                    </p>

                    <div style={{ marginTop: "20px" }}>
                        <div style={{ fontSize: "13px", marginBottom: "0px", fontWeight: '700' }}>
                            <div>Fecha : {receiptData.date}</div>
                        </div>
                        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "0px" }}>
                            {receiptData.infomation.name}
                        </h3>
                        <div style={{ fontSize: "13px", marginBottom: "0px", fontWeight: '800' }}>
                            <div>RUT : {paymentData.rut}</div>
                        </div>
                        <p style={{ fontSize: "13px", marginBottom: "0px" }}>
                            {receiptData.infomation.name1}
                        </p>
                        <p style={{ fontSize: "13px", marginBottom: "0px" }}>
                            Dirección:{receiptData.infomation.add}
                        </p>
                    </div>



                    <h3 style={{ fontSize: "18px", marginTop: "15px", marginBottom: "0px", fontWeight: "bold" }}>
                        Documentos de Referencia
                    </h3>
                    <hr style={{ margin: "0", opacity: '0.80' }} />

                    <table className="mx-1" style={{ fontSize: "14px", width: "100%" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', fontWeight: "bold", padding: '0px' }} colSpan={2} >Tipo Documento</th>
                                <td style={{ textAlign: 'left', padding: '0px' }}>Factura Electrónica</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className="p-0" style={{ textAlign: 'left', padding: '0px' }}>Folio</th>
                                <th className="p-0" style={{ textAlign: 'left', padding: '0px' }}>Fecha</th>
                                <th className="p-0" style={{ textAlign: 'left', padding: '0px' }}>Razon</th>
                            </tr>
                            <tr>
                                <td className="p-0" style={{ textAlign: 'left' }}>{creditData.code}</td>
                                <td className="p-0" style={{ textAlign: 'left' }}>{receiptData.date}</td>
                                <td className="p-0" style={{ textAlign: 'left' }}></td>
                            </tr>
                        </tbody>
                    </table>
                    <hr style={{ margin: "0", opacity: '0.80' }} />

                    <div className='mx-1 mb-0' style={{ fontSize: "12px", textAlign: 'left' }}>

                        {/* products map */}
                        {creditData &&
                            creditData.return_items.map((v) => (
                                <div style={{ fontSize: "13px", display: "flex", justifyContent: "space-between", marginTop: '5px' }}>
                                    <div>{v.name}<span style={{ paddingRight: "20px" }}>   </span>{v.quantity} x ${v.amount}</div>
                                    <div>{v.quantity * v.amount}<br /></div>
                                </div>
                            ))
                        }


                        {/* end */}


                        <div style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                            <div style={{ fontWeight: "800" }}>Neto</div>
                            <div>${receiptData.subtotal}<br /></div>
                        </div>
                        <div style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                            <div style={{ fontWeight: "800" }}>IVA (19%)</div>
                            <div>${receiptData.tax}<br /></div>
                        </div>
                        <div style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                            <div style={{ fontWeight: "800" }}>Total</div>
                            <div style={{ fontWeight: "800" }}>${receiptData.total}<br /></div>
                        </div>
                    </div>

                    <hr style={{ margin: "0", opacity: '0.80' }} />
                    {/* <QRCodeCanvas value={creditData.code} style={{ margin: "5px auto", display: 'flex' }} ref={ref}/> */}
                    {/* <QRCodeCanvas 
                    value={JSON.stringify({
                        code: creditData.code,
                        rut: paymentData.rut,
                        date: receiptData.date,
                        total: receiptData.total,
                        items: creditData.return_items.map(item => ({
                            name: item.name,
                            quantity: item.quantity,
                            amount: item.amount
                        })),
                        receiptUrl: "http://localhost:3000/receipt/" + creditData.code // Add a URL to access the receipt
                    })} 
                    style={{ margin: "5px auto", display: 'flex' }} 
                    ref={ref} 
                    size={128} // Adjust size as needed
                    bgColor={"#ffffff"} // Background color
                    fgColor={"#000000"} // Foreground color
                /> */}
                    {/* <QRCodeCanvas 
                    value={`http://localhost:3000/receipt/${creditData.code}`} // Directly use the URL
                    style={{ margin: "5px auto", display: 'flex' }} 
                    ref={ref} 
                    size={128} // Adjust size as needed
                    bgColor={"#ffffff"} // Background color
                    fgColor={"#000000"} // Foreground color
                /> */}
                    <div>
                        <PDF417Barcode
                            data={barcodeData}
                        /></div>

                    <hr style={{ margin: "0", opacity: '0.80' }} />

                    <p style={{ fontSize: "15px", marginTop: "10px", marginBottom: "0px", textAlign: 'center' }}>
                        <span style={{ fontSize: "15px", textAlign: 'center' }}>Timbre Electrónico SII.</span><br />
                    </p>
                    <p style={{ fontSize: "15px", marginBottom: "0px", textAlign: 'center' }}>
                        <span style={{ fontSize: "15px", textAlign: 'center' }}>Res.80 del 2014- Verifique documento: www.sii.cl
                        </span><br />
                    </p>
                    <p style={{ fontSize: "15px", marginBottom: "20px", textAlign: 'center' }}>
                        <span style={{ fontWeight: "900", fontSize: "15px", textAlign: 'center' }}>www.ingefactura.cl
                        </span><br />
                    </p>
                </div >
            </div >



            <div className='j-counter-recipt' id='specific-div-id' style={{ backgroundColor: "transparent" }}>
                <div ref={ref} style={{ fontFamily: 'monospace', width: '450px', margin: '0 auto', backgroundColor: "white", color: "black", padding: "15px", fontWeight: "500" }}>
                    <div style={{ fontSize: "18px", textAlign: 'center', marginTop: "10px", border: "1px solid #000", width: "90%", margin: "10px auto 0px auto", padding: "5px", fontWeight: "bold" }}>
                        <div style={{ marginBottom: '5px' }}>R.U.T. : {paymentData.rut}</div>
                        <div>NOTA DE CRÉDITO</div>
                        <div style={{ marginBottom: '10px', lineHeight: '10px' }}>ELECTRÓNICA </div>
                        <div>Nº {creditData.code}</div>
                    </div>
                    <h2 style={{ fontSize: "18px", textAlign: 'center', margin: "6px auto", fontWeight: "bold" }}>
                        {receiptData.storeCenter}
                    </h2>
                    <h3 style={{ fontSize: "18px", marginTop: "20px", marginBottom: "0px", fontWeight: "bold" }}>
                        {receiptData.storeInfo.name}
                    </h3>
                    <p style={{ fontSize: "13px", marginBottom: "0px" }}>
                        {receiptData.storeInfo.add}
                    </p>
                    <p style={{ fontSize: "13px", marginBottom: "0px" }}>
                        {receiptData.storeInfo.street}
                    </p>

                    <div style={{ marginTop: "20px" }}>
                        <div style={{ fontSize: "13px", marginBottom: "0px", fontWeight: '700' }}>
                            <div>Fecha : {receiptData.date}</div>
                        </div>
                        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "0px" }}>
                            {receiptData.infomation.name}
                        </h3>
                        <div style={{ fontSize: "13px", marginBottom: "0px", fontWeight: '800' }}>
                            <div>RUT : {paymentData.rut}</div>
                        </div>
                        <p style={{ fontSize: "13px", marginBottom: "0px" }}>
                            {receiptData.infomation.name1}
                        </p>
                        <p style={{ fontSize: "13px", marginBottom: "0px" }}>
                            Dirección:{receiptData.infomation.add}
                        </p>
                    </div>



                    <h3 style={{ fontSize: "18px", marginTop: "15px", marginBottom: "0px", fontWeight: "bold" }}>
                        Documentos de Referencia
                    </h3>
                    <hr style={{ margin: "0", opacity: '0.80' }} />

                    <table className="mx-1" style={{ fontSize: "14px", width: "100%" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', fontWeight: "bold", padding: '0px' }} colSpan={2} >Tipo Documento</th>
                                <td style={{ textAlign: 'left', padding: '0px' }}>Factura Electrónica</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className="p-0" style={{ textAlign: 'left', padding: '0px' }}>Folio</th>
                                <th className="p-0" style={{ textAlign: 'left', padding: '0px' }}>Fecha</th>
                                <th className="p-0" style={{ textAlign: 'left', padding: '0px' }}>Razon</th>
                            </tr>
                            <tr>
                                <td className="p-0" style={{ textAlign: 'left' }}>{creditData.code}</td>
                                <td className="p-0" style={{ textAlign: 'left' }}>{receiptData.date}</td>
                                <td className="p-0" style={{ textAlign: 'left' }}></td>
                            </tr>
                        </tbody>
                    </table>
                    <hr style={{ margin: "0", opacity: '0.80' }} />

                    <div className='mx-1 mb-0' style={{ fontSize: "12px", textAlign: 'left' }}>

                        {/* products map */}
                        {creditData &&
                            creditData.return_items.map((v) => (
                                <div style={{ fontSize: "13px", display: "flex", justifyContent: "space-between", marginTop: '5px' }}>
                                    <div>{v.name}<span style={{ paddingRight: "20px" }}>   </span>{v.quantity} x ${v.amount}</div>
                                    <div>{v.quantity * v.amount}<br /></div>
                                </div>
                            ))
                        }


                        {/* end */}


                        <div style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                            <div style={{ fontWeight: "800" }}>Neto</div>
                            <div>${receiptData.subtotal}<br /></div>
                        </div>
                        <div style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                            <div style={{ fontWeight: "800" }}>IVA (19%)</div>
                            <div>${receiptData.tax}<br /></div>
                        </div>
                        <div style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                            <div style={{ fontWeight: "800" }}>Total</div>
                            <div style={{ fontWeight: "800" }}>${receiptData.total}<br /></div>
                        </div>
                    </div>

                    
                        <>
                            <hr style={{ margin: "0", opacity: '0.80' }} />

                            <div style={{ padding: "10px 0px", width: "100%" }}>
                                <div style={{
                                    border: '1px solid black',
                                    padding: '10px',
                                    width: '100%',
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '14px'
                                }}>
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>NOMBRE: {creditData.name}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', width: "100%" }}>
                                        <div style={{ width: "50%" }}>
                                            <strong>RUT:{receiptData.rut}</strong>
                                        </div>
                                        <div style={{ width: "50%" }}>
                                            <strong>FECHA: {receiptData.date}</strong>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', width: "100%" }}>
                                        <div style={{ width: "50%" }}>
                                            <strong>RECINTO:</strong>
                                        </div>
                                        <div style={{ width: "50%" }}>
                                            <strong>FIRMA:</strong>
                                        </div>
                                    </div>
                                    <p style={{ textAlign: 'justify', lineHeight: '15px', fontWeight: "700", fontSize: "12px", marginBottom: '0px' }}>
                                        El acuse de recibo que se declara en este acto, de acuerdo a lo dispuesto en la letra b) del Art. 4° y la letra c) del Art. 5° de la Ley 19.983, acredita que la entrega de mercadería(s) o servicio(s) ha(n) sido recibido(s).
                                    </p>
                                </div>
                            </div></>
                

                    <hr style={{ margin: "0", opacity: '0.80' }} />
                    {/* <QRCodeCanvas value={creditData.code} style={{ margin: "5px auto", display: 'flex' }} ref={ref}/> */}
                    {/* <QRCodeCanvas 
                    value={JSON.stringify({
                        code: creditData.code,
                        rut: paymentData.rut,
                        date: receiptData.date,
                        total: receiptData.total,
                        items: creditData.return_items.map(item => ({
                            name: item.name,
                            quantity: item.quantity,
                            amount: item.amount
                        })),
                        receiptUrl: "http://localhost:3000/receipt/" + creditData.code // Add a URL to access the receipt
                    })} 
                    style={{ margin: "5px auto", display: 'flex' }} 
                    ref={ref} 
                    size={128} // Adjust size as needed
                    bgColor={"#ffffff"} // Background color
                    fgColor={"#000000"} // Foreground color
                /> */}
                    {/* <QRCodeCanvas 
                    value={`http://localhost:3000/receipt/${creditData.code}`} // Directly use the URL
                    style={{ margin: "5px auto", display: 'flex' }} 
                    ref={ref} 
                    size={128} // Adjust size as needed
                    bgColor={"#ffffff"} // Background color
                    fgColor={"#000000"} // Foreground color
                /> */}
                    <div>
                        <PDF417Barcode
                            data={barcodeData}
                        /></div>

                    <hr style={{ margin: "0", opacity: '0.80' }} />

                    <p style={{ fontSize: "15px", marginTop: "10px", marginBottom: "0px", textAlign: 'center' }}>
                        <span style={{ fontSize: "15px", textAlign: 'center' }}>Timbre Electrónico SII.</span><br />
                    </p>
                    <p style={{ fontSize: "15px", marginBottom: "0px", textAlign: 'center' }}>
                        <span style={{ fontSize: "15px", textAlign: 'center' }}>Res.80 del 2014- Verifique documento: www.sii.cl
                        </span><br />
                    </p>
                    <p style={{ fontSize: "15px", marginBottom: "20px", textAlign: 'center' }}>
                        <span style={{ fontWeight: "900", fontSize: "15px", textAlign: 'center' }}>www.ingefactura.cl
                        </span><br />
                    </p>
                </div >
            </div >

        </div>

    );
});

export default CreditRecipt;

