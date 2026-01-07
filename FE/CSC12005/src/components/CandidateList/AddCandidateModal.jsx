import React, { useState } from "react";
import Select from "react-select";
import { HRService } from "../../services/HRService";
import "./AddCandidateModal.scss";

const AddCandidateModal = ({ positions, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    phone: "",
    address: "",
    birthDate: "",
    cv: null,
    positionId: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Validate file size (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, cv: "File CV không được vượt quá 5MB" });
      return;
    }

    setFormData({
      ...formData,
      cv: file,
    });
    setErrors({ ...errors, cv: null });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên là bắt buộc";
    }

    if (! formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.gender) {
      newErrors.gender = "Giới tính là bắt buộc";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^(0|\+84)[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (VD: 0901234567)";
    }

    if (!formData.address. trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Ngày sinh là bắt buộc";
    } else {
      const birthYear = new Date(formData.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - birthYear < 18) {
        newErrors.birthDate = "Ứng viên phải từ 18 tuổi trở lên";
      }
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

      const result = await HRService.createCandidate(formData);

      console.log(" Created candidate:", result);
      
      
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error("Create candidate error:", error);

    } finally {
      setLoading(false);
    }
  };

  const positionOptions = positions.map((pos) => ({
    value: pos.id,
    label: pos.positionName || pos.name,
  }));

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: errors.positionId ? "#f5222d" : state.isFocused ? "#1890ff" : "#d9d9d9",
      boxShadow: state.isFocused
        ? errors.positionId
          ? "0 0 0 2px rgba(245, 34, 45, 0.1)"
          : "0 0 0 2px rgba(24, 144, 255, 0.1)"
        : "none",
      "&:hover": {
        borderColor: errors.positionId ? "#f5222d" : "#1890ff",
      },
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "150px",
    }),
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-candidate-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="icon-user-add"></i>
            Thêm ứng viên mới
          </h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className={`form-group ${errors.fullName ? "has-error" : ""}`}>
              <label>
                Họ và tên <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Nhập họ và tên"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            {/* Email */}
            <div className={`form-group ${errors.email ? "has-error" : ""}`}>
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Giới tính */}
            <div className={`form-group ${errors.gender ? "has-error" : ""}`}>
              <label>
                Giới tính <span className="required">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              {errors. gender && <span className="error-text">{errors.gender}</span>}
            </div>

            {/* Số điện thoại */}
            <div className={`form-group ${errors.phone ? "has-error" : ""}`}>
              <label>
                Số điện thoại <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="0901234567"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            {/* Địa chỉ */}
            <div className={`form-group full-width ${errors.address ? "has-error" : ""}`}>
              <label>
                Địa chỉ <span className="required">*</span>
              </label>
              <input
                type="text"
                name="address"
                placeholder="Nhập địa chỉ"
                value={formData.address}
                onChange={handleInputChange}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            {/* Ngày sinh */}
            <div className={`form-group ${errors.birthDate ? "has-error" : ""}`}>
              <label>
                Ngày sinh <span className="required">*</span>
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData. birthDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split("T")[0]}
              />
              {errors.birthDate && <span className="error-text">{errors.birthDate}</span>}
            </div>

            {/* Vị trí */}
            <div className={`form-group ${errors.positionId ? "has-error" : ""}`}>
              <label>
                Vị trí ứng tuyển <span className="required">*</span>
              </label>
              <Select
                options={positionOptions}
                value={positionOptions.find((opt) => opt.value === formData.positionId)}
                onChange={(selected) => {
                  setFormData({ ...formData, positionId: selected?. value || null });
                  setErrors({ ...errors, positionId: null });
                }}
                placeholder="Chọn vị trí"
                isClearable
                isSearchable
                styles={customSelectStyles}
              />
              {errors.positionId && <span className="error-text">{errors.positionId}</span>}
            </div>

            {/* CV Upload */}
            <div className={`form-group full-width ${errors.cv ? "has-error" : ""}`}>
              <label>
                CV (PDF, DOCX - Max 5MB)
              </label>
              <div className="file-upload">
                <input
                  type="file"
                  id="cv-upload"
                  accept=". pdf,. doc,.docx"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="cv-upload" className="file-upload-label">
                  <i className="icon-upload"></i>
                  {formData.cv ? formData.cv.name : "Chọn file CV"}
                </label>
                {formData.cv && (
                  <button
                    type="button"
                    className="btn-remove-file"
                    onClick={() => setFormData({ ...formData, cv: null })}
                  >
                    ×
                  </button>
                )}
              </div>
              {errors.cv && <span className="error-text">{errors.cv}</span>}
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Đang thêm..." : "Thêm ứng viên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;