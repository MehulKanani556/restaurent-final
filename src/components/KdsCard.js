import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GoDotFill } from 'react-icons/go';
import useAudioManager from './audioManager';
// import { //enqueueSnackbar  } from 'notistack';

const KdsCard = ({ table, time, orderId, startTime, waiter, center, items, notes, finishedAt, hrtimestart, user, centerProduction, fetchOrder, status, productionCenter }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');
    const admin_id = localStorage.getItem('admin_id');
  const { playNotificationSound } = useAudioManager();

    const handleNextStatus = async () => {
        let newStatus;
        switch (status) {
            case 'received':
                newStatus = 'prepared';
                break;
            case 'prepared':
                newStatus = 'finalized';
                break;
            case 'finalized':
                newStatus = 'delivered';
                break;
            default:
                return; // Exit if status is not recognized
        }

        try {
            // Make an API call to update the status
            const response = await axios.post(`${apiUrl}/order/updateStatus`, { order_id: orderId, status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            //enqueueSnackbar (response?.data?.notification || "Estado actualizado", { variant: 'success' });
            // playNotificationSound();;
            fetchOrder();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };



    const waiterName = user.find(u => u.id === waiter)?.name || 'Unknown'; // Get the waiter's name
    const centerName = centerProduction.find(c => c.id === center)?.name || 'Unknown'; // Get the center's name
    return (
        <div className="j-kds-body-card-2">
            <div className='' style={{ borderRight: '2px solid transparent ' }}>
                <div className="j-kds-body-card-head p-3 mx-3 j-kds-body-card">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h4 className='j-kds-body-text-1000 mb-0 text-white'>Mesa {table}</h4>
                        <button className='j-kds-button-500'>{new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</button>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <button className='j-kds-button-5000'>{orderId}</button>
                        {hrtimestart ? (
                            <h4 className='j-kds-body-text-100 mb-0 text-white'>Hr. estado: {hrtimestart}</h4>
                        ) : (
                            <h4 className='j-kds-body-text-100 mb-0 text-white'>Desde: {new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</h4>
                        )}
                    </div>
                    <div className="j-kids-body-card-p">
                        <p className='text-white'>Quién realizo: {waiterName}</p>
                        <p className='text-white j-p-bgcolor ps-1'>Centro: {productionCenter[productionCenter.length - 1]}</p>
                    </div>
                    <div className="j-kds-border-card">
                        <div className="j-kds-border-bottom">
                            <h6 className='j-kds-border-card-h6 text-white'>Lista</h6>
                            {items.map((item, itemIndex) => (
                                <p key={itemIndex} className='j-kds-border-card-p text-white'>{item.name}</p>
                            ))}
                        </div>
                        <ul className='text-white p-0 mb-0'>
                            <h6 className='j-kds-border-card-h6'>Notas</h6>


                            {items.map((item, itemIndex) => item.notes && (
                                <li key={itemIndex} ><GoDotFill />  {item.notes}</li>
                            ))}

                        </ul>
                    </div>
                    <div className="j-kds-border-card-button mt-2">
                        {finishedAt ? (

                            <button className='j-kds-button-secolor w-100'>Terminado a las {new Date(finishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</button>

                        ) : (
                            <button className='j-kds-button-bgcolor w-100' onClick={handleNextStatus}>Siguiente estado</button>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default KdsCard;

