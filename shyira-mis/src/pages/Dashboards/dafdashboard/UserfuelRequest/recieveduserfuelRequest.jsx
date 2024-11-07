import React, { useEffect, useState } from 'react';
import { FaEye,FaTimes } from 'react-icons/fa';
import axios from 'axios';

const FuelRequisitionForm = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [quantityReceived, setQuantityReceived] = useState('');
  const [logisticUsers, setLogisticUsers] = useState([]);
  const [dafUsers, setDafUsers] = useState([]);

  useEffect(() => {
    const fetchLogisticUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/logistic-users');
        setLogisticUsers(response.data);
      } catch (error) {
        console.error('Error fetching logistic users:', error);
      }
    };
    fetchLogisticUsers();
  }, []);

  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/userfuelrequest/recievedfuel');
        setRequisitions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requisitions:', error);
        setError('Failed to fetch requisitions');
        setLoading(false);
      }
    };
    fetchRequisitions();
  }, []);

  useEffect(() => {
    const fetchDafUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/daf-users');
        setDafUsers(response.data);
      } catch (error) {
        console.error('Error fetching daf users:', error);
      }
    };
    fetchDafUsers();
  }, []);

  const handleRequestClick = async (requestId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/userfuelrequest/receivedfuel/${requestId}`);
      setSelectedRequest(response.data);
     
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };


  const handleCloseClick = () => {
    setSelectedRequest(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="fuel-requisition-form">
      <h4>List of Fuel Requisition that has been Recieved</h4>
      <label htmlFor=""> Review requisition was recieved </label>
      <div className="open-request">
        <ul>
          {requisitions.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
                Requisition Form of Fuel requested by {request.hodName} done on {new Date(request.createdAt).toDateString()} recieved
              </p>
            </li>
          ))}
               </ul>
      </div>

      {selectedRequest && (
        <div className="fuel-request-details-overlay">
          <div className="fixed-nav-bar">
            <button type="button" className='close-btn' onClick={handleCloseClick}><FaTimes /></button>
          </div>

          <div className="fuel-request-details-content">
            <h3>Fuel Requisition Form</h3>
            <form>
              <div className="view-form-group">
                <label>Requester Name: <span>{selectedRequest.requesterName || ''}</span></label>
              </div>
              <div className="view-form-group">
                <div className="right-side">
                  <label>Car Plaque:</label>
                  <span>{selectedRequest.carPlaque || ''}</span>
                </div>
                <div className="left-side">
                  <label>Remaining (liters):</label>
                  <span>{selectedRequest.remainingLiters || ''}</span>
                </div>
              </div>
              <div className="view-form-group">
                <div className="right-side">
                  <label>Kilometers:</label>
                  <span>{selectedRequest.kilometers || ''}</span>
                </div>
                <div className="right-side">
                  <label>Quantity Requested (liters):</label>
                  <span>{selectedRequest.quantityRequested || ''}</span>
                </div>
              </div>
              <div className="view-form-group">
                <div className="left-side">
                  <label>Average Km/l:</label>
                  <span>{selectedRequest.average || ''}</span>
                </div>
                <div className="left-side">
                  <label>Quantity Received (liters):</label>
                  <span>{selectedRequest.quantityReceived || ''}</span>
                </div>
              </div>
              <div className="view-form-group">
                <div className="detail-row">
                  {selectedRequest && selectedRequest.file ? (
                    <div className='file-uploaded'>
                      <label>Previous Destination file:</label>
                      <a href={`http://localhost:5000/${selectedRequest.file}`} target="_blank" rel="noopener noreferrer">
                        <FaEye /> View File
                      </a>
                    </div>
                  ) : (
                    <p>No file uploaded</p>
                  )}
                </div>
              </div>
              <hr />
              <div className="fuel-signatures">
                <div className="hods">
                  <h5>Head Of department:</h5>
                  <label>Prepared By:</label>
                  <span>{selectedRequest.hodName || ''}</span>
                  <img src={`http://localhost:5000/${selectedRequest.hodSignature}`} alt="HOD Signature" />
                </div>
                <div className='logistic-signature'>
                  <h5>Logistic Office:</h5>
                  <label htmlFor="">Verified By:</label>
                  {logisticUsers.map(user => (
                    <div key={user._id} className="logistic-user">
                      <p>{user.firstName} {user.lastName}</p>
                      {user.signature ? (
                        <img src={`http://localhost:5000/${user.signature}`} alt={`${user.firstName} ${user.lastName} Signature`} />
                      ) : (
                        <p>No signature available</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="daf-signature">
                  <h5>DAF:</h5>
                  <label htmlFor="">Approved By:</label>
                  {dafUsers.map(user => (
                    <div key={user._id} className="logistic-user">
                      <p>{user.firstName} {user.lastName}</p>
                      {user.signature ? (
                        <img src={`http://localhost:5000/${user.signature}`} alt={`${user.firstName} ${user.lastName} Signature`} />
                      ) : (
                        <p>No signature available</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="hods">
                  <h5>Head Of department:</h5>
                  <label>Prepared By:</label>
                  <span>{selectedRequest.hodName || ''}</span>
                  <img src={`http://localhost:5000/${selectedRequest.hodSignature}`} alt="HOD Signature" />
                </div>
              </div>
              <div className="action-buttons">
            
              </div>
            </form>
          </div>
             </div>
       
      )}
    </div>
  );
};

export default FuelRequisitionForm;