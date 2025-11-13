import React, { useState, useEffect } from "react";
import "./style.scss";

export const EditInfoModal = ({ isOpen, onClose, onSave, currentData }) => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentData) {
      setFormData({
        phone: currentData.phone || "",
        email: currentData.email || "",
        address: currentData.address || "",
      });
      setErrors({});
    }
  }, [currentData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d{9,12}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải từ 9-12 chữ số";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Chỉnh sửa thông tin</h2>
        <div className="modal-grid">
          <div className="modal-item">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          <div className="modal-item">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="modal-item">
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Hủy</button>
          <button onClick={handleSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
};
