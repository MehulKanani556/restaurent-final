import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import { Link } from "react-router-dom";

const OrderCart = ({ image, name, price, code, addItemToCart ,id }) => {
  const API = "https://shreekrishnaastrology.com/public";

  const handleAddToCart = () => {
    addItemToCart({ id,image, name, price, code });
  };

  return (
    <div>
      <div class="card m_bgblack text-white position-relative">
        <img
        src={`${API}/images/${image}`}
          class="card-img-top object-fit-cover"
          alt="..."
          style={{ height: "200px" }}
        />
        <div class="card-body">
          <h5 class="card-title j-tbl-text-16">{name}</h5>
          <h5 class="card-title j-tbl-pop-1">${price}</h5>
          <p class="card-text opacity-75 j-tbl-btn-font-1">Codigo: {code}</p>
          <div
            class="btn w-100 j-btn-primary text-white"
            onClick={handleAddToCart}
          >
            <Link className="text-white d-flex align-items-center justify-content-center text-decoration-none j-tbl-btn-font-1">
              <FaCartPlus /> <span className="ms-1">Añadir carrito </span>
            </Link>
          </div>
        </div>

        <div className="position-absolute " style={{ cursor: "pointer" }}>
        <Link to={`/articles/singleatricleproduct/${id}`} className="text-white text-decoration-none" >

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
