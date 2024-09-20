import React, { useEffect, useState } from 'react';

const CajaRecipe = ({ box, user, boxDetails }) => {

    const [userName, setUserName] = useState("")
    useEffect(() => {
        const users = user.find(u => u.id === box.user_id)
        setUserName(users?.name)
    }, [box.user_id, user])
    const receiptData = {
        storeName: "Reporte de Cierre",
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-'),
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        storeInfo: {
            rcu: "20600728988",
            name: "CB Solutions and Systems S.A.C",
            add: "Juan Fanning Street 432, Miraflores ",
            street: "Lima LIMA Peru",
            tel: "051-305558"
        },
        pointOfSale: {
            pointOfSale: "Point Of Sale 02",
            session: "POS/2018/02/19/68",
            Cajero: userName ? userName : "-",
            opening: boxDetails.box.open_time,
            closing: boxDetails.box.close_time
        },
        openingAmount: boxDetails.box.open_amount,
        sales: boxDetails.box.close_amount - boxDetails.box.open_amount,
        return: "35.0",
        tax: "49.50",
        discount: "10.5",
        closingAmount: boxDetails.box.close_amount,
        customer: {
            name: "JOSE PEREZ",
            email: "prueba@gmail.com",
            phone: "0999555666",
            address: "EDIFICIO SUR",
            id: "0910345461"
        },
        items: [
            { description: "Coca Cola Zero 5", quantity: 2, unitPrice: 1.33, total: 2.66 },
            { description: "Jugo de Naranja 1", quantity: 1, unitPrice: 1.33, total: 1.33 }
        ],
        totals: {
            subtotalIva: 3.99,
            subtotal0: 0.00,
            discount: 0.00,
            iva: 0.48,
            total: 4.47,
            received: 4.47,
            change: 0.00
        },
        footer: "Consulte sus documentos electronicos ingresando a bandejaonline.contifico.com si es la primera vez que accede, por favor registrese con su identificacion y correo electronico."
    };

    return (

        <div className='j-counter-recipt' id="printable">
            <div style={{ fontFamily: 'monospace', width: '380px', margin: '0 auto', backgroundColor: "white", color: "black", fontWeight: "bold", padding: "20px" }}>
                <h2 style={{ fontSize: "18px", textAlign: 'center', marginTop: "10px", border: "1px solid #000", width: "80%", margin: "10px auto", padding: "10px", fontWeight: "bold" }}>{receiptData.storeName}</h2>

                <div style={{ fontSize: "12px" }}>
                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Fecha </div>
                        <div>{receiptData.date}</div>
                    </div>
                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Hora </div>
                        <div>{receiptData.time}</div>
                    </div>
                </div>


                <p style={{ fontSize: "12px", textAlign: 'center' }}>
                    <span style={{ fontWeight: "bold", fontSize: "12px" }}>RCU:</span>
                    {receiptData.storeInfo.rcu}<br />
                    {receiptData.storeInfo.name}<br />
                    {receiptData.storeInfo.add}<br />
                    {receiptData.storeInfo.street}<br />
                    <span style={{ fontWeight: "bold", fontSize: "12px" }}>Tel: {receiptData.storeInfo.tel}</span>
                </p>




                <div className='mx-1 mb-0' style={{ fontSize: "12px", textAlign: 'left' }}>
                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Punto de Venta</div>
                        <div>{receiptData.pointOfSale.pointOfSale}<br /></div>
                    </div>
                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Sesion</div>
                        <div>{receiptData.pointOfSale.session}<br /></div>
                    </div>
                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Cajero</div>
                        <div>{receiptData.pointOfSale.Cajero}<br /></div>
                    </div>
                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Fecha de apertura</div>
                        <div>{new Date(receiptData.pointOfSale.opening).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}<br /></div>
                    </div>
                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Fecha de cierre</div>
                        <div>{new Date(receiptData.pointOfSale.closing).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}<br /></div>
                    </div>

                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div style={{ borderBottom: "1px dashed #000", marginBottom: "8px", width: '40%' }}></div>
                        <div style={{ borderBottom: "1px dashed #000", marginBottom: "8px", width: '40%' }}><br /></div>
                    </div>

                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Monto de apertura</div>
                        <div>S/{receiptData.openingAmount}<br /></div>
                    </div>

                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div style={{ borderBottom: "1px dashed #000", marginBottom: "8px", width: '40%' }}></div>
                        <div style={{ borderBottom: "1px dashed #000", marginBottom: "8px", width: '40%' }}><br /></div>
                    </div>

                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Ventas</div>
                        <div>S/{receiptData.sales}<br /></div>
                    </div>
                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Descuentos</div>
                        <div>S/{boxDetails.discount.discount}<br /></div>
                    </div>
                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Impuestos</div>
                        <div>S/{boxDetails.discount.tax}<br /></div>
                    </div>
                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Importe de descuento</div>
                        <div>S/{receiptData.discount}<br /></div>
                    </div>

                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div style={{ borderBottom: "1px dashed #000", marginBottom: "8px", width: '40%' }}></div>
                        <div style={{ borderBottom: "1px dashed #000", marginBottom: "8px", width: '40%' }}><br /></div>
                    </div>

                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>Monto de cierre</div>
                        <div>S/{receiptData.closingAmount}<br /></div>
                    </div>

                    <div style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div style={{ borderBottom: "1px dashed #000", marginBottom: "8px", width: '40%' }}></div>
                        <div style={{ borderBottom: "1px dashed #000", marginBottom: "8px", width: '40%' }}><br /></div>
                    </div>

                </div>


                <p style={{ fontSize: "13px", padding: "10px 0", borderBottom: "1px dashed #000", borderTop: "1px dashed #000", width: '50%', margin: "10px auto" }}>
                    <span style={{ fontWeight: "bold", fontSize: "13px", textAlign: 'center' }}>Departamento de Ventas</span><br />
                </p>

                <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <div></div>
                    <div>S/{receiptData.sales}<br /></div>
                </div>


                <div style={{ height: "20px", display: "flex", justifyContent: "space-between" }}>
                    <div style={{ marginBottom: "8px", width: '40%', }}></div>
                    <div style={{ borderBottom: "1px dashed #000", marginBottom: "8px", width: '40%' }}><br /></div>
                </div>
                <div style={{ fontSize: "12px", textAlign: 'center' }}>
                    <div className="mx-1" style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>
                            Total:
                        </div>
                        <div>
                            S/{parseFloat(boxDetails.box.close_amount) - parseFloat(boxDetails.box.open_amount)}<br />
                        </div>
                    </div>
                    <div className="mx-1" style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>
                            Efectivo:
                        </div>
                        <div>
                            {boxDetails.discount.type?.cash||0}<br />
                            {/* {alert(boxDetails.discount.type?.cash)} */}
                        </div>
                    </div>
                    <div className="mx-1" style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>
                            Tarjeta Mastercard:
                        </div>
                        <div>
                            {boxDetails.discount.type?.debit||0}<br />
                        </div>
                    </div>
                    <div className="mx-1" style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>
                            Tarjeta Visa:
                        </div>
                        <div>
                        {boxDetails.discount.type?.credit||0}<br />
                        </div>
                    </div>

                    <div style={{ borderBottom: "1px dashed #000", marginBottom: "8px", width: '40%' }}><br /></div>

                    <div className="mx-1 py-1" style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <strong>Total:</strong>
                        </div>
                        <div>
                            <strong>{parseFloat(boxDetails.box.close_amount) - parseFloat(boxDetails.box.open_amount)}</strong><br />
                        </div>
                    </div>

                </div>

            </div >
        </div >

    );
};

export default CajaRecipe;

