import React from "react";
import "./ConfirmModal.scss";

const ConfirmModal = ({ isOpen, title, message, type = "info", onConfirm, onCancel, loading = false }) => {
  if (!isOpen) return null;


  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        \

        <h3 className="confirm-modal-title">{title}</h3>

        <p className="confirm-modal-message">{message}</p>

        <div className="confirm-modal-actions">
          <button
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            className={`btn btn-confirm ${type}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;