import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa6";
import img1 from "../Image/Image.jpg";
import { IoMdInformationCircle } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


export default function SingProd({ image, price, name, code, id }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const API = process.env.REACT_APP_IMAGE_URL;
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [admin_id, setAdmin_id] = useState(localStorage.getItem("admin_id"));
  const location = useLocation();


  const handleClick = async () => {
    console.log("asasd");

    localStorage.setItem("cartItems", JSON.stringify([{ image, price, name, code, id, count: 1, isEditing: false, note: "" }]));
    try {

      const response = await axios.post(`${apiUrl}/orders/last`, { admin_id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // console.log(response.data);
      if (response.status == 200) {
        localStorage.setItem("lastOrder", JSON.stringify(response.data.order.id + 1));
        navigate("/counter");
      }

    } catch (error) {
      console.error(
        "Error fetching subfamilies:",
        error.response ? error.response.data : error.message
      );
    }
  }

  return (
    <div>
      <div class="card m_bgblack text-white position-relative">
        <img
          src={`${API}/images/${image}`}
          class="card-img-top object-fit-cover rounded"
          alt="..."
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div class="card-body">
          <h6 class="card-title">{name}</h6>
          <h6 class="card-title">$ {price}</h6>
          <p class="card-text opacity-50">Codigo: {code}</p>
          <div class="btn w-100 btn-primary text-white">
            <Link className="text-white text-decoration-none" style={{ fontSize: '14px' }} onClick={handleClick} >
              <FaCartPlus /> <span className="ms-1">Añadir a mostrador</span>
            </Link>
          </div>
        </div>

        <div className="position-absolute " style={{ cursor: 'pointer' }}>
          <Link to={`/articles/singleatricleproduct/${id}`} state={{ from: location.pathname }} className="text-white text-decoration-none" >
            <p className=" px-1  rounded m-2" style={{ backgroundColor: '#374151' }}>
              <IoMdInformationCircle />{" "}
              <span style={{ fontSize: "12px" }}>Ver información</span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
