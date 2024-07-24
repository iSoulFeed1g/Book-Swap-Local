import React from 'react';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ show, handleClose, handleConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h5>Confirm Deletion</h5>
          <button onClick={handleClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button onClick={handleClose} className="btn btn-secondary">Back</button>
          <button onClick={handleConfirm} className="btn btn-danger">Yes, I am sure</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
