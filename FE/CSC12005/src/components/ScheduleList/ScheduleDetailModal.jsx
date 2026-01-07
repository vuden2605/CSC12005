import React, { useEffect, useState } from "react";
import { HRService } from "../../services/HRService";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import CancelScheduleModal from "./CancelScheduleModal"; 
import "./ScheduleDetailModal.scss";

const ScheduleDetailModal = ({ scheduleId, onClose, onUpdate }) => {
  // ========== ALL STATES MUST BE AT THE TOP ==========
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false); // ← NEW STATE

  // ========== FORM DATA WITH SAFE INITIALIZATION ==========
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    location:  "",
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });

  // ========== FETCH SCHEDULE ON MOUNT ==========
  useEffect(() => {
    fetchScheduleDetails();
  }, [scheduleId]);

  // ========== UPDATE FORM DATA WHEN SCHEDULE LOADS ==========
  useEffect(() => {
    if (schedule) {
      setFormData({
        date: schedule.date || "",
        timeSlot: schedule.timeSlot || "",
        location:  schedule.location || "",
      });
    }
  }, [schedule]);

  const fetchScheduleDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await HRService.getScheduleById(scheduleId);

      setSchedule(data);
      console.log("Schedule details:", data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const timeSlotOptions = [
    { value: "MORNING", label: "Buổi sáng (8: 00 - 12:00)" },
    { value: "AFTERNOON", label: "Buổi chiều (13:00 - 17:00)" },
  ];

  const statusOptions = [
    { value:  "SCHEDULED", label: "Đã lên lịch" },
    { value: "COMPLETED", label: "Đã hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  const getStatusLabel = (status) => {
    const option = statusOptions. find((opt) => opt.value === status);
    return option ?  option.label : status;
  };

  const getTimeSlotLabel = (timeSlot) => {
    const option = timeSlotOptions.find((opt) => opt.value === timeSlot);
    return option ? option.label : timeSlot;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = "Ngày phỏng vấn là bắt buộc";
    } else {
      const selectedDate = new Date(formData. date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors. date = "Ngày phỏng vấn phải từ hôm nay trở đi";
      }
    }

    if (!formData. timeSlot) {
      newErrors.timeSlot = "Khung giờ là bắt buộc";
    }

    if (!formData.location. trim()) {
      newErrors.location = "Địa điểm là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const result = await HRService.updateSchedule(schedule.id, {
        date: formData.date,
        timeSlot: formData.timeSlot,
        location: formData.location,
      });

      console.log("✅ Updated schedule:", result);
      alert("Cập nhật lịch phỏng vấn thành công!");

      setIsEditMode(false);

      // Refresh schedule data
      await fetchScheduleDetails();

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Update schedule error:", error);
      alert(`Lỗi:  ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      date: schedule. date || "",
      timeSlot: schedule.timeSlot || "",
      location: schedule.location || "",
    });
    setErrors({});
    setIsEditMode(false);
  };

  // ========== CANCEL SCHEDULE HANDLERS (UPDATED) ==========
  const handleCancelScheduleClick = () => {
    setShowCancelModal(true); // ← Open CancelScheduleModal
  };

  const handleCancelSuccess = () => {
    setShowCancelModal(false);

    if (onUpdate) onUpdate();
    onClose();
  };

  const handleConfirmModalCancel = () => {
    setConfirmModal({ ... confirmModal, isOpen: false });
  };

  // ========== LOADING STATE ==========
  if (loading && ! schedule) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải thông tin lịch phỏng vấn...</p>
          </div>
        </div>
      </div>
    );
  }

  // ========== ERROR STATE ==========
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

  // ========== NO SCHEDULE ==========
  if (!schedule) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content schedule-detail-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>
              {isEditMode ? "Chỉnh sửa lịch phỏng vấn" :  "Chi tiết lịch phỏng vấn"}
            </h3>
            <button className="btn-close" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="modal-body">
            {! isEditMode ? (
              <>
                {/* Basic Info */}
                <section className="info-section">
                  <h4 className="section-title">Thông tin lịch phỏng vấn</h4>
                  <div className="info-grid">
                    <div className="info-item" >
                      <label>Ngày phỏng vấn:</label>
                      <strong className="date-value"> {schedule.date}</strong>
                    </div>
                    <div className="info-item">
                      <label>Khung giờ:</label>
                      <span className="time-slot-badge">
                        {getTimeSlotLabel(schedule. timeSlot)}
                      </span>
                    </div>
                    <div className="info-item full-width">
                      <label>Địa điểm: </label>
                      <span className="location-value"> {schedule.location}</span>
                    </div>
                    <div className="info-item">
                      <label>Vị trí tuyển dụng:</label>
                      <strong>{schedule.position?.positionName || "N/A"}</strong>
                    </div>
                    <div className="info-item">
                      <label>Người phỏng vấn:</label>
                      <span>{schedule.interviewer?.fullName || "Chưa gán"}</span>
                    </div>
                    <div className="info-item">
                      <label>Số ứng viên:</label>
                      <span className="candidate-count">
                        {schedule.candidates.length|| 0} ứng viên
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Trạng thái:</label>
                      <span className={`status-badge ${getStatusClass(schedule.status)}`}>
                        {getStatusLabel(schedule.status)}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Candidates List */}
                {schedule.candidates && schedule.candidates.length > 0 ?  (
                  <section className="info-section">
                    <h4 className="section-title">
                      Danh sách ứng viên ({schedule.candidates.length})
                    </h4>
                    <div className="candidates-list">
                      {schedule.candidates.map((candidate) => (
                        <div key={candidate.id} className="candidate-card">
                          <div className="candidate-avatar">
                            {candidate.fullName. charAt(0).toUpperCase()}
                          </div>
                          <div className="candidate-info">
                            <div className="candidate-name">{candidate.fullName}</div>
                            <div className="candidate-email"> {candidate.email}</div>
                            {candidate.phone && (
                              <div className="candidate-phone"> {candidate.phone}</div>
                            )}
                          </div>
                          <div className="candidate-status">
                            <span className={`status-badge ${getStatusClass(candidate.status)}`}>
                              {getStatusLabel(candidate.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : (
                  <section className="info-section">
                    <h4 className="section-title">Danh sách ứng viên</h4>
                    <div className="empty-candidates">
                      <p>Chưa có ứng viên nào được gán vào lịch này</p>
                    </div>
                  </section>
                )}

                {/* Timeline */}
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
              </>
            ) : (
              /* ========== EDIT MODE ========== */
              <form className="edit-form" >
                <div className="form-grid"> 
                  {/* Ngày phỏng vấn */}
                  <div className={`form-group ${errors.date ? "has-error" : ""}`} style={{width:"300px"}}>
                    <label>
                      Ngày phỏng vấn <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.date && <span className="error-text">{errors.date}</span>}
                  </div>

                  {/* Khung giờ */}
                  <div className={`form-group ${errors.timeSlot ? "has-error" : ""}`} style={{width:"365px"}}>
                    <label>
                      Khung giờ <span className="required">*</span>
                    </label>
                    <select name="timeSlot" value={formData.timeSlot} onChange={handleInputChange}>
                      <option value="">Chọn khung giờ</option>
                      {timeSlotOptions. map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.timeSlot && <span className="error-text">{errors.timeSlot}</span>}
                  </div>

                  {/* Địa điểm */}
                  <div className={`form-group full-width ${errors.location ? "has-error" : ""}`}style={{width:"725px"}}>
                    <label>
                      Địa điểm <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Ví dụ: Phòng họp A, Tầng 3"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                    {errors.location && <span className="error-text">{errors.location}</span>}
                  </div>
                </div>

                {/* Read-only fields */}
                <div className="readonly-info">
                  <div className="info-notice">
                    <div className="notice-text">
                      <strong>Lưu ý: </strong>Vị trí tuyển dụng và người phỏng vấn không thể thay
                      đổi sau khi tạo lịch. 
                    </div>
                  </div>
                  <div className="readonly-fields">
                    <div className="readonly-field">
                      <label>Vị trí tuyển dụng:</label>
                      <span>{schedule.position?.positionName || "N/A"}</span>
                    </div>
                    <div className="readonly-field">
                      <label>Người phỏng vấn:</label>
                      <span>{schedule.interviewer?.fullName || "Chưa gán"}</span>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="modal-footer">
            {! isEditMode ? (
              <>
                {schedule.status === "SCHEDULED" && (
                  <>
                    <button className="btn btn-primary" onClick={() => setIsEditMode(true)}>
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleCancelScheduleClick}
                      disabled={loading}
                    >
                      Hủy lịch
                    </button>
                  </>
                )}
                <button className="btn btn-secondary" onClick={onClose}>
                  Đóng
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={handleCancelEdit} disabled={loading}>
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========== CANCEL SCHEDULE MODAL (NEW) ========== */}
      {showCancelModal && (
        <CancelScheduleModal
          schedule={schedule}
          onClose={() => setShowCancelModal(false)}
          onSuccess={handleCancelSuccess}
        />
      )}

      {/* Keep ConfirmModal for other purposes if needed */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={handleConfirmModalCancel}
        loading={loading}
      />
    </>
  );
};

export default ScheduleDetailModal;