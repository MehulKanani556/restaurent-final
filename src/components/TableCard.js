import React, { useState, useEffect, useRef } from 'react';

const TableCard = ({ name, id, oId,selectedTabNo, no,tableId, userId, tableColor,selectedCards, getUserName, status, setTableStatus, onShowAvailableModal, handleData, handleGet, onShowOcupadoModal, isModalOpen, isOffcanvasOpen }) => {
  const [isSelected, setSelected] = useState(false);
  const tableRef = useRef(null);

  // Check local storage for selected table on mount
  useEffect(() => {
    const selectedTable = localStorage.getItem('selectedTable');
    if (selectedTable === id) {
      setSelected(true);
    }
  }, [id]);

  // Handle click outside of the card to deselect only if modal is not open
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelected(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  const cardCss = {
    backgroundColor: (selectedCards?.includes(no)) ? "#147BDE" : 
      (isSelected && isOffcanvasOpen ? "#147BDE" : 
      (status === "available" ? "#ebf5ff" : "#374151")),
    color: (selectedCards?.includes(no)) ? "#fff" :
      (isSelected && isOffcanvasOpen ? "#fff" : 
      (status === "available" ? "#111928" : "#fff")),
    cursor: "pointer",
  };

  // const cardCss = {
  //   backgroundColor: (selectedCards === no) ? "#147BDE" : 
  //     (isSelected && isOffcanvasOpen ? "#147BDE" : 
  //     (status === "available" ? "#ebf5ff" : "#374151")),
  //   color: (selectedCards === no) ? "#fff" :
  //     (isSelected && isOffcanvasOpen ? "#fff" : 
  //     (status === "available" ? "#111928" : "#fff")),
  //   cursor: "pointer",
  // };
  const cardBodyStyle = {
    marginTop: status === "available" ? "40px" : "20px",
  };

  const handleClick = () => {
    if (!isSelected) {
      setSelected(true);
      setTableStatus(status);
      localStorage.setItem('selectedTable', id); // Store selected table in local storage
      if (!selectedCards?.includes(no)) {
        if (status === 'available') {
          onShowAvailableModal(no);
        } else {
          onShowOcupadoModal(no);
        }
      }
    }
    handleData(id);
    handleGet(oId);
  };

  // Listen for storage changes to update selection
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'selectedTable') {
        setSelected(event.newValue === id);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [id]);

  return (
    <div ref={tableRef} className="card j_bgblack position-relative" onClick={handleClick} style={cardCss}>
      <div className={`card-body jcard-color`} style={cardBodyStyle}>
        {(status === "busy") ? (
          <>
            <p className='j-tbl-no-text-7 mb-0'>{tableId || no}</p>
            <h5 className="card-text j-tbl-text-8 mb-1">Pedido : {oId}</h5>
            <p className="card-title j-tbl-text-9 mb-0">{getUserName(userId)}</p>
          </>
        ) : (
          <p className='j-tbl-no-text-7 mb-0'>{tableId}</p>
        )}
      </div>
    </div>
  );
};

export default TableCard;