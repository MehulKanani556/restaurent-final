import React from "react";

const OrderRecipt = ({ paymentData, orderData }) => {

  console.log(paymentData);
  console.log(orderData);

  const role = localStorage.getItem("name");

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentSecond = currentDate.getSeconds();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are 0-based, so we add 1
  const year = currentDate.getFullYear();
  const formattedDate = `${day
    .toString()
    .padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
  const formattedTime = `${currentHour
    .toString()
    .padStart(2, "0")}:${currentMinute
      .toString()
      .padStart(2, "0")}:${currentSecond.toString().padStart(2, "0")}`;

  const receiptData = {
    storeName: "CAFE CHOCO CHIP",
    storeInfo: {
      phone: "0998809875001",
      branch: "Guayaquil",
      phone2: "9999999"
    },
    invoice: {
      number: "FAC #:152-045-000000001",
      environment: "Produccion",
      emission: "Normal",
      authorization: `166202202109988098750012152045000000001000000815`,
      type: "REIMPRESION"
    },
    cashier: role,
    date: new Date(orderData.created_at).toLocaleDateString('en-GB'),
    time: new Date(orderData.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ,
    customer: {
      name: paymentData.firstname,
      email: paymentData.email,
      phone: paymentData.phone,
      address: paymentData.address,
      id: paymentData.rut
    },
    // orderData.return_items
    items: orderData.order_details
      ? orderData.order_details?.map((i) => ({
        description: i.name,
        quantity: i.quantity,
        unitPrice: i.amount,
        total: i.quantity * parseFloat(i.amount)
      }))
      : orderData.return_items?.map((i) => ({
        description: i.name,
        quantity: i.quantity,
        unitPrice: i.amount,
        total: parseFloat(i.quantity) * parseFloat(i.amount)
      })),

    footer:
      "Consulte sus documentos electronicos ingresando a bandejaonline.contifico.com si es la primera vez que accede, por favor registrese con su identificacion y correo electronico."
  };


  const itemsTotal = receiptData.items.reduce(
    (sum, item) => sum + item.total,
    0
  );
  console.log(itemsTotal, receiptData.items);

  const price = parseFloat(itemsTotal) - parseFloat(orderData.discount ? orderData.discount : 0);

  console.log(price);

  const iva = itemsTotal * 0.19; // 12% tax
  const total = price + iva;
  receiptData.totals = {
    subtotalIva: itemsTotal,
    subtotal0: 0.0,
    discount: orderData.discount ? orderData.discount : 0,
    iva: iva,
    total: total,
    received: total, // Assuming the exact amount is received
    change: 0.0
  };
  const paymentTypes = {
    credit: "Tarjeta de Crédito",
    debit: "Tarjeta de Débito",
    cash: "Efectivo",
    transfer: "Transferencia",
    future: "compra futura"
    // Add other payment types as needed
  };

  const paymentList = paymentData.type.split(",");
const translatedPayments = paymentList
  .map(payment => paymentTypes[payment.trim()])
  .filter(Boolean); // Filter out any undefined values

  return (
    <div id="receipt-content" >
      <div className="j-counter-recipt">
        <div
          style={{
            fontFamily: "monospace",
            width: "100%",
            margin: "0 auto",
            backgroundColor: "white",
            color: "black",
            fontWeight: "bold",
            padding: "10px 7px",
          }}
        >
          <h2
            style={{ fontSize: "16px", textAlign: "center", marginTop: "10px" }}
          >
            {receiptData.storeName}
          </h2>
          <p style={{ fontSize: "12px", textAlign: "center" }}>
            {receiptData.storeInfo.phone}
            <br />
            Sucursal: {receiptData.storeInfo.branch}
            <br />
            Telefono: {receiptData.storeInfo.phone2}
          </p>

          <p style={{ fontSize: "12px", textAlign: "center" }}>
            <p style={{ margin: 0, textAlign: "center" }}>
              {receiptData.invoice.number}
            </p>

            <p style={{ margin: 0, textAlign: "center" }}>
              Ambiente: {receiptData.invoice.environment}
            </p>
            <p style={{ margin: 0, textAlign: "center" }}>
              Emision: {receiptData.invoice.emission}
            </p>
            <p style={{ margin: 0, textAlign: "center" }}>

              No. de autorizacion/Clave de acceso
            </p>
            <p
              className="mb-0"
              style={{ textWrap: "wrap", textAlign: "center", margin: 0 }}
            >
              {" "}
              {receiptData.invoice.authorization}
              <br />
            </p>
            <p
              className="mb-0"
              style={{ textWrap: "wrap", textAlign: "center", margin: 0 }}
            >
              {" "}
              {receiptData.invoice.type}
            </p>
          </p>
          <p
            className="mx-1 mb-0"
            style={{ fontSize: "12px", textAlign: "left", margin: 0 }}
          >
            Cajero: {receiptData.cashier}
            <br />
            <div style={{ display: 'flex' }}>
              <span>Fecha: {receiptData.date}</span>
              <span style={{ textAlign: "right", marginLeft: 'auto' }}>
                Hora: {receiptData.time}
                <br />
              </span>
            </div>
            Cliente: {receiptData.customer.name}
            <br />
            Email: {receiptData.customer.email}
            <br />
            Telefono: {receiptData.customer.phone}
            <br />
            Direccion: {receiptData.customer.address}
            <br />
            Cedula/RUC: {receiptData.customer.id}
            {orderData.code && (
              <>
                <br /> Codigo de Venta: {orderData.code}
              </>
            )}

          </p>
          <div style={{ borderBottom: "1px dashed #000", marginTop: "1px" }} />
          <div
            className="mb-2"
            style={{ borderBottom: "1px dashed #000", marginTop: "1px" }}
          />

          <table className="mx-1" style={{ fontSize: "12px", width: "100%" }}>
            <thead style={{ borderBottom: "1px dashed #000" }}>
              <tr>
                <th style={{ textAlign: 'left' }}>DESCRIP</th>
                <th style={{ textAlign: 'left' }}>CANT</th>
                <th style={{ textAlign: 'left' }}>P_UNIT</th>
                <th style={{ textAlign: 'left' }}>P_TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.items.map((item, index) => (
                <tr key={index}>
                  <td className="p-0">{item.description}</td>
                  <td className="p-0">{item.quantity}</td>
                  <td className="p-0">$ {item.unitPrice}</td>
                  <td className="p-0">$ {item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="my-1" />
          {/* <div style={{borderBottom:"1px dashed #000"}} ></div> */}
          <p style={{ fontSize: "12px", textAlign: "center" }}>
            <div className="d-flex justify-content-between mx-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>Subtotal IVA:</div>
              <div>
                $ {itemsTotal.toFixed(2)}
                <br />
              </div>
            </div>
            <div className="d-flex justify-content-between mx-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>Subtotal 0%:</div>
              <div>
                $ {receiptData.totals.subtotal0.toFixed(2)}
                <br />
              </div>
            </div>
            <div className="d-flex justify-content-between mx-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>Dcto:</div>
              <div>
                ${Number(receiptData.totals.discount || 0).toFixed(2)}
                <br />
              </div>
            </div>
            <div className="d-flex justify-content-between mx-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>IVA 19.00%:</div>
              <div>
                $ {receiptData.totals.iva.toFixed(2)}
                <br />
              </div>
            </div>
            <div
              style={{ borderBottom: "1px dashed #000", marginTop: "1px" }}
            />
            <div className="d-flex justify-content-between mx-1 py-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>Total:</strong>
              </div>
              <div>
                <strong>$ {receiptData.totals.total.toFixed(2)}</strong>
                <br />
              </div>
            </div>
            <div
              className="mb-2"
              style={{ borderBottom: "1px dashed #000", marginTop: "1px" }}
            />
          </p>

          {orderData.code ? (
            <>
              <p
                className="mb-0 mx-1"
                style={{ fontSize: "12px", textAlign: "left" }}
              >
                Estado de crédito:  {orderData.status == "completed" ?  "terminada" : "pendiente"} 
                <br />
                {paymentTypes[orderData.credit_method == "future purchase"? "future" : orderData.credit_method]}:{" "}
                $ {orderData.credit_method == "future purchase"? "pendiente"  : receiptData.totals.received.toFixed(2)}
                <br />
                <div className="mt-2 d-flex" style={{ display: 'flex' }}>
                  <div className="me-3" style={{ marginRight: '16px' }}>Código origen: {orderData.order_id}</div>
                  <div>Destino:  {orderData.destination || "pendiente"}</div>
                </div>
              </p>
            </>
          ) : (
           <p
              className="mb-0 mx-1"
              style={{ fontSize: "12px", textAlign: "left" }}
            >

              Forma de pago:
              <br />
              {translatedPayments.join(", ")}
              {/* {paymentTypes[paymentData.type]}:{" "} */}
              :{" "} $ {receiptData.totals.received.toFixed(2)}
              <br />
              <div className="mt-2 d-flex" style={{ display: 'flex' }}>
                <div className="me-3" style={{ marginRight: '16px' }}>Recibido: $ {paymentData.amount}</div>
                <div>Cambio: $ {paymentData.return || 0.00}</div>
              </div>
            </p>

          )}
          <div style={{ borderBottom: "1px dashed #000", marginTop: "5px" }} />
          <p
            style={{ fontSize: "12px", textAlign: "center", fontWeight: "600" }}
          >
            {receiptData.footer}
          </p>
        </div>
      </div>
    </div>


  );
};

export default OrderRecipt;
