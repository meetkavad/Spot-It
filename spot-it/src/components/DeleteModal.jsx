import React from "react";
import "./DeleteModal.css";

const DeleteModal = ({ onConfirm, onCancel }) => {

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Are you sure you want to delete this post?</p>
        <div className="modal-buttons">
          <button className="modal-confirm" onClick={onConfirm}>
            Delete
          </button>
          <button className="modal-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
