import React, { useEffect, useState } from "react";
import { HRService } from "../../../services/HRService";
import ManagerCandidateReviewModal from "./ManagerCandidateReviewModal";
import "../../../components/ScheduleList/ScheduleDetailModal.scss";

const ManagerScheduleDetailModal = ({ scheduleId, onClose, onUpdate }) => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchScheduleDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId]);

  const fetchScheduleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await HRService.getScheduleById(scheduleId);
      setSchedule(data);
    } catch (err) {
      console.error("Fetch schedule error:", err);
      setError(err.message || "Không thể tải chi tiết lịch phỏng vấn");
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotLabel = (timeSlot) => {
    switch (timeSlot) {
      case "MORNING":
        return "Buổi sáng";
      case "AFTERNOON":
        return "Buổi chiều";
      case "EVENING":
        return "Buổi tối";
      default:
        return timeSlot;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "Đã lên lịch";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      // Candidate statuses
      case "NOT_INTERVIEWED":
        return "Chưa phỏng vấn";
      case "INTERVIEWING":
        return "Đang phỏng vấn";
      case "INTERVIEWED":
        return "Đã phỏng vấn";
      case "PASSED":
        return "Đạt";
      case "FAILED":
        return "Không đạt";
      case "HIRED":
        return "Đã thành nhân viên";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      SCHEDULED: "status-scheduled",
      COMPLETED: "status-completed",
      CANCELLED: "status-cancelled",
      NOT_INTERVIEWED: "status-new",
      INTERVIEWING: "status-interviewing",
      INTERVIEWED: "status-interviewed",
      PASSED: "status-passed",
      FAILED: "status-rejected",
    };
    return classes[status] || "status-default";
  };

  if (loading && !schedule) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải thông tin lịch phỏng vấn...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="error-state">
            <div className="error-icon">❌</div>
            <p className="error-message">{error}</p>
            <button className="btn btn-primary" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!schedule) return null;

  const handleReviewUpdated = async () => {
    await fetchScheduleDetails();
    if (onUpdate) onUpdate();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content schedule-detail-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>Chi tiết lịch & ứng viên</h3>
            <button className="btn-close" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="modal-body">
            <section className="info-section">
              <h4 className="section-title">Thông tin lịch phỏng vấn</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>Ngày phỏng vấn:</label>
                  <strong className="date-value">{schedule.date}</strong>
                </div>
                <div className="info-item">
                  <label>Khung giờ:</label>
                  <span className="time-slot-badge">
                    {getTimeSlotLabel(schedule.timeSlot)}
                  </span>
                </div>
                <div className="info-item full-width">
                  <label>Địa điểm:</label>
                  <span className="location-value">{schedule.location}</span>
                </div>
                <div className="info-item">
                  <label>Vị trí tuyển dụng:</label>
                  <strong>{schedule.position?.positionName || "N/A"}</strong>
                </div>
                {/* <div className="info-item">
                  <label>Người phỏng vấn:</label>
                  <span>{schedule.interviewer?.fullName || "Chưa gán"}</span>
                </div> */}
                <div className="info-item">
                  <label>Trạng thái:</label>
                  <span
                    className={`status-badge ${getStatusClass(
                      schedule.status
                    )}`}
                  >
                    {getStatusLabel(schedule.status)}
                  </span>
                </div>
              </div>
            </section>

            <section className="info-section">
              <h4 className="section-title">Danh sách ứng viên</h4>
              {schedule.candidates && schedule.candidates.length > 0 ? (
                <div className="candidates-list">
                  {schedule.candidates.map((candidate) => (
                    <div key={candidate.id} className="candidate-card">
                      <div className="candidate-avatar">
                        {candidate.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="candidate-info">
                        <div className="candidate-name">
                          {candidate.fullName}
                        </div>
                        <div className="candidate-email">{candidate.email}</div>
                        {candidate.phone && (
                          <div className="candidate-phone">{candidate.phone}</div>
                        )}
                      </div>
                      <div className="candidate-status">
                        <span
                          className={`status-badge ${getStatusClass(
                            candidate.status
                          )}`}
                        >
                          {getStatusLabel(candidate.status)}
                        </span>
                        <button
                          className="btn btn-view"
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          Đánh giá
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-candidates">
                  <p>Chưa có ứng viên nào được gán vào lịch này</p>
                </div>
              )}
            </section>

            {schedule.createdAt && (
              <section className="info-section">
                <h4 className="section-title">Thông tin khác</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Ngày tạo:</label>
                    <span>{schedule.createdAt}</span>
                  </div>
                  {schedule.updatedAt && (
                    <div className="info-item">
                      <label>Cập nhật lần cuối:</label>
                      <span>{schedule.updatedAt}</span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>

      {selectedCandidate && (
        <ManagerCandidateReviewModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onUpdated={handleReviewUpdated}
        />
      )}
    </>
  );
};

export default ManagerScheduleDetailModal;
