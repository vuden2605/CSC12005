import React, { useState, useEffect } from "react";
import Select from "react-select";
import { HRService } from "../../services/HRService";
import { PositionService } from "../../services/PositionService";
import { EmployeeService } from "../../services/EmployeeService";
import "./CandidateDetailModal.scss";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

const CandidateDetailModal = ({ candidate, onClose, onUpdate }) => {
  if (!candidate) return null;
  console.log("candidate detail", candidate);

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [errors, setErrors] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });
  // Form data for edit mode
  const [formData, setFormData] = useState({
    fullName: candidate.fullName || "",
    email: candidate.email || "",
    gender: candidate.gender || "",
    phone: candidate.phone || "",
    address: candidate.address || "",
    birthDate: candidate.birthDate || "",
    cv: null,
    positionId: candidate.position?.id || null,
  });

  // Fetch positions when entering edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchPositions();
    }
  }, [isEditMode]);

  const fetchPositions = async () => {
    try {
      const data = await PositionService.getAll();
      setPositions(data);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      NOT_INTERVIEWED: "Chưa phỏng vấn",
      HIRED: "Đã thành nhân viên",
      INTERVIEWING: "Đang phỏng vấn",
      INTERVIEWED: "Đã phỏng vấn",
      PASSED: "Đạt",
      FAILED: "Không đạt",
    };
    return labels[status] || status;
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "star filled" : "star"}>
            ★
          </span>
        ))}
        <span className="rating-value">{rating}/5</span>
      </div>
    );
  };

  const handleDownload = async (fileKey) => {
    try {
      const url = await EmployeeService.downloadFile(fileKey);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error downloading file:", err);
    }
  };

  // ========== EDIT MODE HANDLERS ==========
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

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

    if (!formData.email.trim()) {
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
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Ngày sinh là bắt buộc";
    }

    if (!formData.positionId) {
      newErrors.positionId = "Vị trí là bắt buộc";
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

      const result = await HRService.updateCandidate(candidate.id, formData);

      console.log("✅ Updated candidate:", result);

      setIsEditMode(false);

      // Refresh parent component
      if (onUpdate) {
        onUpdate();
      }

      onClose();
    } catch (error) {
      console.error("Update candidate error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      fullName: candidate.fullName || "",
      email: candidate.email || "",
      gender: candidate.gender || "",
      phone: candidate.phone || "",
      address: candidate.address || "",
      birthDate: candidate.birthDate || "",
      cv: null,
      positionId: candidate.position?.id || null,
    });
    setErrors({});
    setIsEditMode(false);
  };

  // ========== INTERVIEW RESULT HANDLERS (NEW) ==========
  const handleMarkResultClick = (passed) => {
    const resultText = passed ? "ĐẠT" : "KHÔNG ĐẠT";
    const type = passed ? "success" : "danger";

    setConfirmModal({
      isOpen: true,
      type: type,
      title: `Xác nhận kết quả phỏng vấn`,
      message: `Bạn có chắc chắn muốn đánh dấu ứng viên "${candidate.fullName}" là ${resultText}?`,
      onConfirm: () => handleMarkResultConfirm(passed),
    });
  };

  const handleMarkResultConfirm = async (passed) => {
    const resultText = passed ? "ĐẠT" : "KHÔNG ĐẠT";

    try {
      setLoading(true);

      await HRService.markInterviewResult(candidate.id, passed);

      console.log(`✅ Marked as ${resultText}`);

      // Close confirm modal
      setConfirmModal({ ...confirmModal, isOpen: false });

      // Refresh and close
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Mark interview result error:", error);
      setConfirmModal({ ...confirmModal, isOpen: false });
    } finally {
      setLoading(false);
    }
  };
  // ========== HIRE CANDIDATE HANDLER (NEW) ==========
  const handleHireClick = () => {
    setConfirmModal({
      isOpen: true,
      type: "success",
      title: "Xác nhận tuyển dụng",
      message: `Bạn có chắc chắn muốn tuyển dụng ứng viên "${candidate.fullName}"?\n\nỨng viên sẽ được chuyển thành nhân viên chính thức. `,
      onConfirm: handleHireConfirm,
    });
  };

  const handleHireConfirm = async () => {
    try {
      setLoading(true);

      const newEmployee = await HRService.hireCandidate(candidate.id);

      console.log("✅ Candidate hired:", newEmployee);

      // Close confirm modal
      setConfirmModal({ ...confirmModal, isOpen: false });

      // Refresh and close
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Hire candidate error:", error);
      setConfirmModal({ ...confirmModal, isOpen: false });
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmModalCancel = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const positionOptions = positions.map((pos) => ({
    value: pos.id,
    label: pos.positionName || pos.name,
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="icon-user"></i>
            {isEditMode ? "Chỉnh sửa thông tin ứng viên" : "Thông tin ứng viên"}
          </h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* ========== VIEW MODE ========== */}
          {!isEditMode ? (
            <>
              {/* Basic Info */}
              <section className="info-section">
                <h4 className="section-title">Thông tin cơ bản</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Họ và tên:</label>
                    <strong>{candidate.fullName}</strong>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{candidate.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Giới tính:</label>
                    <span>
                      {candidate.gender === "MALE"
                        ? "Nam"
                        : candidate.gender === "FEMALE"
                        ? "Nữ"
                        : "Khác"}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Ngày sinh:</label>
                    <span>{candidate.birthDate}</span>
                  </div>
                  <div className="info-item">
                    <label>Số điện thoại:</label>
                    <span>{candidate.phone || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <label>Địa chỉ:</label>
                    <span>{candidate.address || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <label>Vị trí ứng tuyển:</label>
                    <strong>{candidate.position?.positionName || "N/A"}</strong>
                  </div>
                  <div className="info-item">
                    <label>CV:</label>
                    {candidate.cv ? (
                      <span
                        className="download-link"
                        onClick={() => handleDownload(candidate.cv)}
                      >
                        Tải xuống
                      </span>
                    ) : (
                      <span>Chưa có CV</span>
                    )}
                  </div>
                  <div className="info-item full-width">
                    <label>Trạng thái:</label>
                    <span
                      className={`status-badge status-${candidate.status?.toLowerCase()}`}
                    >
                      {getStatusLabel(candidate.status)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Rating */}
              {candidate.ratingAverage && (
                <section className="info-section">
                  <h4 className="section-title">Đánh giá phỏng vấn</h4>
                  <div className="rating-grid">
                    <div className="rating-item">
                      <label>Kỹ năng chuyên môn:</label>
                      {renderStars(candidate.ratingTechnical)}
                    </div>
                    <div className="rating-item">
                      <label>Giải quyết vấn đề: </label>
                      {renderStars(candidate.ratingProblemSolving)}
                    </div>
                    <div className="rating-item">
                      <label>Giao tiếp:</label>
                      {renderStars(candidate.ratingCommunication)}
                    </div>
                    <div className="rating-item">
                      <label>Kinh nghiệm:</label>
                      {renderStars(candidate.ratingExperience)}
                    </div>
                    <div className="rating-item">
                      <label>Văn hóa công ty:</label>
                      {renderStars(candidate.ratingCultureFit)}
                    </div>
                    <div className="rating-item average">
                      <label>Điểm trung bình:</label>
                      <strong className="avg-score">
                        {candidate.ratingAverage}/5
                      </strong>
                    </div>
                  </div>

                  {candidate.feedback && (
                    <div className="feedback-section">
                      <label>Nhận xét:</label>
                      <div className="feedback-text">{candidate.feedback}</div>
                    </div>
                  )}
                </section>
              )}

              {/* Schedule */}
              {candidate.schedule && (
                <section className="info-section">
                  <h4 className="section-title">Thông tin lịch phỏng vấn</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Ngày phỏng vấn:</label>
                      <span>{candidate.schedule.date}</span>
                    </div>
                    <div className="info-item">
                      <label>Thời gian: </label>
                      <span>{candidate.schedule.timeSlot?.start}</span>
                    </div>
                    <div className="info-item full-width">
                      <label>Địa điểm:</label>
                      <span>{candidate.schedule.location}</span>
                    </div>
                    <div className="info-item full-width">
                      <label>Người phỏng vấn: </label>
                      <span>
                        {candidate.schedule.interviewer?.fullName || "N/A"}
                      </span>
                    </div>
                  </div>
                </section>
              )}
            </>
          ) : (
            /* ========== EDIT MODE ========== */
            <form className="edit-form">
              <div className="form-grid">
                {/* Họ và tên */}
                <div
                  className={`form-group ${errors.fullName ? "has-error" : ""}`}
                >
                  <label>
                    Họ và tên <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  {errors.fullName && (
                    <span className="error-text">{errors.fullName}</span>
                  )}
                </div>

                {/* Email */}
                <div
                  className={`form-group ${errors.email ? "has-error" : ""}`}
                >
                  <label>
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>

                {/* Giới tính */}
                <div
                  className={`form-group ${errors.gender ? "has-error" : ""}`}
                >
                  <label>
                    Giới tính <span className="required">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                  {errors.gender && (
                    <span className="error-text">{errors.gender}</span>
                  )}
                </div>

                {/* Số điện thoại */}
                <div
                  className={`form-group ${errors.phone ? "has-error" : ""}`}
                >
                  <label>
                    Số điện thoại <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && (
                    <span className="error-text">{errors.phone}</span>
                  )}
                </div>

                {/* Địa chỉ */}
                <div
                  className={`form-group full-width ${
                    errors.address ? "has-error" : ""
                  }`}
                >
                  <label>
                    Địa chỉ <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  {errors.address && (
                    <span className="error-text">{errors.address}</span>
                  )}
                </div>

                {/* Ngày sinh */}
                <div
                  className={`form-group ${
                    errors.birthDate ? "has-error" : ""
                  }`}
                >
                  <label>
                    Ngày sinh <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.birthDate && (
                    <span className="error-text">{errors.birthDate}</span>
                  )}
                </div>

                {/* Vị trí */}
                <div
                  className={`form-group ${
                    errors.positionId ? "has-error" : ""
                  }`}
                >
                  <label>
                    Vị trí ứng tuyển <span className="required">*</span>
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
                    placeholder="Chọn vị trí"
                    isClearable
                    isSearchable
                  />
                  {errors.positionId && (
                    <span className="error-text">{errors.positionId}</span>
                  )}
                </div>

                {/* CV Upload */}
                <div className="form-group full-width">
                  <label>CV mới (nếu muốn thay đổi)</label>
                  {candidate.cv && (
                    <div className="current-cv">
                      <span>CV hiện tại: </span>
                      <span
                        className="download-link"
                        onClick={() => handleDownload(candidate.cv)}
                      >
                        Xem CV
                      </span>
                    </div>
                  )}
                  <div className="file-upload">
                    <input
                      type="file"
                      id="cv-upload-edit"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="cv-upload-edit"
                      className="file-upload-label"
                    >
                      <i className="icon-upload"></i>
                      {formData.cv
                        ? formData.cv.name
                        : "Chọn file CV mới (nếu cần)"}
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
            </form>
          )}
        </div>

        <div className="modal-footer">
          {!isEditMode ? (
            <>
              {candidate.status === "NOT_INTERVIEWED" && (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditMode(true)}
                >
                  Sửa
                </button>
              )}

              {/* ========== INTERVIEW RESULT BUTTONS (NEW) ========== */}
              {candidate.status === "INTERVIEWED" && (
                <>
                  <button
                    className="btn-pass"
                    onClick={() => handleMarkResultClick(true)}
                    disabled={loading}
                  >
                    Đạt
                  </button>
                  <button
                    className="btn-fail"
                    onClick={() => handleMarkResultClick(false)}
                    disabled={loading}
                  >
                    Không đạt
                  </button>
                </>
              )}
              {candidate.status === "PASSED" && (
                <button
                  className="btn-hire"
                  onClick={handleHireClick}
                  disabled={loading}
                >
                  Tuyển dụng
                </button>
              )}

              <button className="btn btn-secondary" onClick={onClose}>
                Đóng
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </>
          )}
        </div>
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          type={confirmModal.type}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={handleConfirmModalCancel}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CandidateDetailModal;
