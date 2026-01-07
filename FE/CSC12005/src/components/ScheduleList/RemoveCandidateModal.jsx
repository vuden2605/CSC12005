import React, { useState } from "react";
import { HRService } from "../../services/HRService";
import "./RemoveCandidateModal.scss";

const RemoveCandidateModal = ({ candidate, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError("Vui lòng nhập lý do xóa ứng viên");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Lý do phải có ít nhất 10 ký tự");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ========== CALL REMOVE CANDIDATE API ==========
      await HRService.removeCandidateFromSchedule(candidate.id, reason.trim());

      if (onSuccess) {
        onSuccess(candidate.fullName);
      }

      onClose();
    } catch (err) {
      console.error("Remove error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div
        className="modal-content remove-candidate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Xác nhận xóa ứng viên khỏi lịch</h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="candidate-info">
            <p>
              <strong>Họ tên:</strong> {candidate.fullName}
            </p>
            <p>
              <strong>Email:</strong> {candidate.email}
            </p>
            {candidate.phone && (
              <p>
                <strong>SĐT:</strong> {candidate.phone}
              </p>
            )}
          </div>

          <div className="warning-box">
            <div className="warning-text">
              <strong>Cảnh báo:</strong>
              <p>
                Ứng viên sẽ bị xóa khỏi lịch phỏng vấn và có thể được gán vào
                lịch khác.
              </p>
            </div>
          </div>

          <div className={`form-group ${error ? "has-error" : ""}`}>
            <label htmlFor="reason">
              Lý do xóa <span className="required">*</span>
            </label>
            <textarea
              id="reason"
              rows="4"
              placeholder="Nhập lý do xóa ứng viên (tối thiểu 10 ký tự)..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              disabled={loading}
              maxLength={500}
            />
            {error && <span className="error-text">{error}</span>}
            <span className="char-count">{reason.length} / 500 ký tự</span>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={loading || !reason.trim()}
            >
              {loading ? "Đang xử lý..." : "Xác nhận xóa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemoveCandidateModal;
