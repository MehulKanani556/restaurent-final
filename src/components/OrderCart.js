import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

const OrderCart = ({ image, name, price, code, addItemToCart ,id }) => {
  const API = process.env.REACT_APP_IMAGE_URL;
  const location = useLocation();

  const handleAddToCart = () => {
    addItemToCart({ id,image, name, price, code });
  };

  return (
    <div>
      <div className="card m_bgblack text-white position-relative">
      {image ? (
          <img
            src={`${API}/images/${image}`}
            className="card-img-top object-fit-cover rounded"
            alt={name}
            style={{ height: "200px", objectFit: "cover" }}
          />
        ) : (
          <div className="d-flex justify-content-center align-items-center rounded" style={{ height: "200px", backgroundColor: 'rgb(55 65 81 / 34%)', color: 'white' }}>
            <p>{name}</p>
          </div>
        )}
        <div className="card-body">
          <h5 className="card-title j-tbl-text-16">{name}</h5>
          <h5 className="card-title j-tbl-pop-1">${price}</h5>
          <p className="card-text opacity-75 j-tbl-btn-font-1">Codigo: {code}</p>
          <div
            className="btn w-100 j-btn-primary text-white"
            onClick={handleAddToCart}
          >
            <Link className="text-white d-flex align-items-center justify-content-center text-decoration-none j-tbl-btn-font-1">
              <FaCartPlus /> <span className="ms-1">Añadir carrito </span>
            </Link>
          </div>
        </div>

        <div className="position-absolute " style={{ cursor: "pointer" }}>
        <Link to={`/articles/singleatricleproduct/${id}`} state={{ from: location.pathname }} className="text-white text-decoration-none" >

          <p className="m_bgblack j-var-padd d-flex align-items-center rounded m-2 j-tbl-font-3">
            <IoMdInformationCircle className="me-1 fs-5 j-card-j-width" />{" "}
            <span style={{ fontSize: "14px" }}>Ver información</span>
          </p>
          </Link >
        </div>
      </div>
    </div>
  );
};

export default OrderCart;
