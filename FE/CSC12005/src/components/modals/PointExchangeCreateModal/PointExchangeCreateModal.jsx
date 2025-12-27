import React, { useState } from "react";
import { EmployeeService } from "../../../services/EmployeeService";

const PointExchangeCreateModal = ({ isOpen, onClose, onSuccess }) => {
  const [points, setPoints] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const parsed = Number(points);
    if (!parsed || parsed <= 0) {
      setError("Vui lòng nhập số điểm hợp lệ (> 0)");
      return;
    }
    try {
      setSubmitting(true);
      await EmployeeService.createPointExchangeRequest(parsed, note || undefined);
      setSubmitting(false);
      onClose?.();
      onSuccess?.();
    } catch (err) {
      setSubmitting(false);
      setError(err.message || "Không thể tạo yêu cầu đổi điểm");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Tạo yêu cầu đổi điểm</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{ marginBottom: 12 }}>{error}</div>}
          <div className="detail-section">
            <div className="detail-grid">
              <div className="detail-item">
                <label>Điểm muốn đổi</label>
                <input
                  type="number"
                  min={1}
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder="Nhập số điểm"
                  style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
                  required
                />
              </div>
              <div className="detail-item">
                <label>Ghi chú (tuỳ chọn)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Đổi lấy tiền mặt"
                  style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-reject-modal" onClick={onClose} disabled={submitting}>Huỷ</button>
            <button type="submit" className="btn-approve-modal" disabled={submitting}>
              {submitting ? "Đang tạo..." : "Tạo yêu cầu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PointExchangeCreateModal;
