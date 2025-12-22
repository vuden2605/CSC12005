import React from "react";
import "./confirmModal.scss";

export default function ConfirmModal({
    open,
    title = "Xác nhận",
    message,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    loading = false,
    onConfirm,
    onClose,
}) {
if (!open) return null;

return (
    <div className="cm-backdrop" onClick={onClose}>
    <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <h4 className="cm-title">{title}</h4>
        <p className="cm-message">{message}</p>

        <div className="cm-actions">
        <button className="cm-btn cm-cancel" onClick={onClose} disabled={loading}>
            {cancelText}
        </button>
        <button className="cm-btn cm-confirm" onClick={onConfirm} disabled={loading}>
            {loading ? "Đang xử lý..." : confirmText}
        </button>
        </div>
    </div>
    </div>
);
}
