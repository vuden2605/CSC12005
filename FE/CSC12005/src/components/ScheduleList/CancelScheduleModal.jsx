import React, { useState } from "react";
import { HRService } from "../../services/HRService";
import "./CancelScheduleModal.scss";

const CancelScheduleModal = ({ schedule, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do hủy lịch");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Lý do phải có ít nhất 10 ký tự");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await HRService.cancelSchedule(schedule.id, reason.trim());
      

      alert("Đã hủy lịch phỏng vấn thành công!");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      console.error("Cancel error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotLabel = (timeSlot) => {
    const labels = {
      MORNING: "Buổi sáng (8: 00 - 12:00)",
      AFTERNOON: "Buổi chiều (13:00 - 17:00)",
    };
    return labels[timeSlot] || timeSlot;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content cancel-schedule-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>
            <span className="icon warning">⚠️</span>
            Xác nhận hủy lịch phỏng vấn
          </h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="schedule-info">
            <p>
              <strong>Ngày: </strong> {schedule.date}
            </p>
            <p>
              <strong>Khung giờ:</strong> {getTimeSlotLabel(schedule. timeSlot)}
            </p>
            <p>
              <strong>Địa điểm:</strong> {schedule.location}
            </p>
            <p>
              <strong>Số ứng viên:</strong> {schedule.candidateCount || 0}
            </p>
          </div>

          <div className="warning-box">
            <div className="warning-icon">⚠️</div>
            <div className="warning-text">
              <strong>Cảnh báo:</strong>
              <p>
                Hành động này không thể hoàn tác.  Tất cả ứng viên sẽ nhận được thông báo hủy lịch. 
              </p>
            </div>
          </div>

          <div className={`form-group ${error ? "has-error" : ""}`}>
            <label htmlFor="reason">
              Lý do hủy lịch <span className="required">*</span>
            </label>
            <textarea
              id="reason"
              rows="4"
              placeholder="Nhập lý do hủy lịch phỏng vấn (tối thiểu 10 ký tự)..."
              value={reason}
              onChange={(e) => {
                setReason(e. target.value);
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
              Quay lại
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={loading || !reason.trim()}
            >
              {loading ? "Đang hủy..." : "❌ Xác nhận hủy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelScheduleModal;