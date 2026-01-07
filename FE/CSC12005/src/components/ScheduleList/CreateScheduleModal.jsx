import React, { useState, useEffect } from "react";
import Select from "react-select";
import { HRService } from "../../services/HRService";
import { PositionService } from "../../services/PositionService";
import "./CreateScheduleModal.scss";
import { useAlert } from "../../context/AlertContext";

const CreateScheduleModal = ({ onClose, onSuccess }) => {
  const customStyles = {
    container: (base) => ({
      ...base,
      width: "200px",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "150px",
    }),
  };

  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [errors, setErrors] = useState({});
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    location: "",
    positionId: null,
  });

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const data = await PositionService.getAll();
      setPositions(data);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
    }
  };

  const timeSlotOptions = [
    { value: "MORNING", label: "Buổi sáng (8:00 - 12:00)" },
    { value: "AFTERNOON", label: "Buổi chiều (13:00 - 17:00)" },
  ];

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
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Ngày phỏng vấn phải từ hôm nay trở đi";
      }
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = "Khung giờ là bắt buộc";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Địa điểm là bắt buộc";
    }

    if (!formData.positionId) {
      newErrors.positionId = "Vị trí là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const result = await HRService.createSchedule(formData);

      console.log("Schedule created:", result);

      if (onSuccess) {
        onSuccess(result);
      }

      onClose();
    } catch (error) {
      console.error("Create schedule error:", error);
      showAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const positionOptions = positions.map((pos) => ({
    value: pos.id,
    label: pos.positionName || pos.name,
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content create-schedule-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Tạo lịch phỏng vấn</h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            {/* Ngày phỏng vấn */}
            <div
              className={`form-group ${errors.date ? "has-error" : ""}`}
              style={{ width: "300px" }}
            >
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
            <div
              className={`form-group ${errors.timeSlot ? "has-error" : ""}`}
              style={{ width: "350px" }}
            >
              <label>
                Khung giờ <span className="required">*</span>
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleInputChange}
              >
                <option value="">Chọn khung giờ</option>
                {timeSlotOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.timeSlot && (
                <span className="error-text">{errors.timeSlot}</span>
              )}
            </div>

            {/* Địa điểm */}
            <div
              className={`form-group full-width ${
                errors.location ? "has-error" : ""
              }`}
              style={{ width: "725px" }}
            >
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
              {errors.location && (
                <span className="error-text">{errors.location}</span>
              )}
            </div>

            {/* Vị trí */}
            <div
              className={`form-group full-width ${
                errors.positionId ? "has-error" : ""
              }`}
            >
              <label>
                Vị trí tuyển dụng <span className="required">*</span>
              </label>
              <Select
                options={positionOptions}
                value={positionOptions.find(
                  (opt) => opt.value === formData.positionId
                )}
                onChange={(selected) => {
                  setFormData({
                    ...formData,
                    positionId: selected?.value || null,
                  });
                  setErrors({ ...errors, positionId: null });
                }}
                styles={customStyles}
                placeholder="Chọn vị trí"
                isClearable
                isSearchable
              />
              {errors.positionId && (
                <span className="error-text">{errors.positionId}</span>
              )}
            </div>
          </div>

          <div className="form-info">
            <div className="info-text">
              Lịch phỏng vấn sẽ được tạo cho vị trí đã chọn. Bạn có thể gán ứng
              viên vào lịch này sau.
            </div>
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
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Đang tạo..." : " Tạo lịch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
