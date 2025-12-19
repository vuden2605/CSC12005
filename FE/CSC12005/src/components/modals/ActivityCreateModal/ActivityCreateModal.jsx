import React, { useEffect, useState } from "react";
import "./style.scss";
import { HRService } from "../../../services/HRService";

export const ActivityCreateModal = ({ isOpen, onClose, onCreate }) => {
  if (!isOpen) return null;

  /* ================= STATE ================= */
  const [errors, setErrors] = useState({});

  const [formUpdate, setFormUpdate] = useState({
    activityName: "",
    description: "",
    startDate: "",
    endDate: "",
    points: "",
    count: "",
  });
  console.log(formUpdate);

  /* ================= UTILS ================= */
  const formatDateForInput = (date) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  /* ================= EFFECT ================= */

  /* ================= HANDLER ================= */
  const handleChange = (field) => (e) => {
    setFormUpdate((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formUpdate.activityName.trim())
      newErrors.activityName = "Tên sự kiện không được để trống";

    if (!formUpdate.description.trim())
      newErrors.description = "Mô tả không được để trống";

    if (formUpdate.points === "") newErrors.points = "Điểm không được để trống";
    else if (!/^\d+$/.test(formUpdate.points))
      newErrors.points = "Điểm phải là chữ số";
    else if (Number(formUpdate.points) < 5 || Number(formUpdate.points) > 10)
      newErrors.points = "Điểm phải từ 5 đến 10";
    if (formUpdate.count === "")
      newErrors.count = "Số lượng tối đa không được trống";
    else if (!/^\d+$/.test(formUpdate.count))
      newErrors.count = "Số lượng tố đa phải là chữ số";
    else if (Number(formUpdate.count) < 20 || Number(formUpdate.count) > 50)
      newErrors.count = "Số lượng tối đa phải từ 20 đến 50";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const requestData = {
        activityName: formUpdate.activityName.trim(),
        description: formUpdate.description.trim(),
        startDate: formUpdate.startDate,
        endDate: formUpdate.endDate || null,
        points: Number(formUpdate.points),
        count: Number(formUpdate.count),
      };

      const data = await HRService.createActivity(requestData);
      if (onCreate) onCreate(data);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="modal-overlay">
      <div className="modal-content-e">
        <button type="button" onClick={onClose} className="modal-close-btn">
          ✕
        </button>

        <div className="modal-title">Chi tiết sự kiện</div>

        <form className="employee-form" onSubmit={handleSubmit}>
          {/* ===== THÔNG TIN SỰ KIỆN ===== */}
          <fieldset>
            <legend>Thông tin sự kiện</legend>

            <div className="form-row">
              <div className="form-group">
                <label>Tên sự kiện</label>
                <input
                  value={formUpdate.activityName}
                  onChange={handleChange("activityName")}
                />
                {errors.activityName && (
                  <span className="error-text">{errors.activityName}</span>
                )}
              </div>

              <div className="form-group">
                <label>Ngày bắt đầu</label>
                <input
                  type="date"
                  value={formUpdate.startDate}
                  onChange={handleChange("startDate")}
                />
              </div>

              <div className="form-group">
                <label>Ngày kết thúc</label>
                <input
                  type="date"
                  value={formUpdate.endDate}
                  onChange={handleChange("endDate")}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mô tả</label>
                <input
                  value={formUpdate.description}
                  onChange={handleChange("description")}
                />
                {errors.description && (
                  <span className="error-text">{errors.description}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số điểm</label>
                <input
                  value={formUpdate.points}
                  onChange={handleChange("points")}
                />
                {errors.points && (
                  <span className="error-text">{errors.points}</span>
                )}
              </div>
              <div className="form-group">
                <label>Số lượng tối đa</label>
                <input
                  value={formUpdate.count}
                  onChange={handleChange("count")}
                />
                {errors.count && (
                  <span className="error-text">{errors.count}</span>
                )}
              </div>
            </div>
          </fieldset>

          {/* ===== ACTION ===== */}
          <div className="form-actions">
            <button type="button" className="btn light" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn primary">
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
