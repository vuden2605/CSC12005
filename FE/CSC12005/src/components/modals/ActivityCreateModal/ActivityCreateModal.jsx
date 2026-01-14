import React, { useState, useEffect } from "react";
import "./style.scss";
import { HRService } from "../../../services/HRService";
import { useAlert } from "../../../context/AlertContext";

export const ActivityCreateModal = ({ isOpen, onClose, onCreate }) => {
  if (!isOpen) return null;

  const { showAlert } = useAlert();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Required fields
    activityName: "",
    activityType: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    registrationDeadline: "",
    location: "",
    address: "",
    organizer: "",
    contactPhone: "",
    contactEmail: "",
    maxParticipants: "",
    basePoints: "",

    // Optional fields
    description: "",
    duration: "", // Auto-calculated
    minParticipants: "",
    isMandatory: false,
    firstPlaceBonus: "",
    secondPlaceBonus: "",
    thirdPlaceBonus: "",
    notes: "",

    // Files
    image: null,
    attachment: null,
  });

  /* ================= AUTO CALCULATE DURATION ================= */
  useEffect(() => {
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startTime &&
      formData.endTime
    ) {
      const start = new Date(`${formData.startDate}T${formData.startTime}:00`);
      const end = new Date(`${formData.endDate}T${formData.endTime}:00`);

      if (end > start) {
        const durationInMinutes = Math.floor((end - start) / (1000 * 60));
        setFormData((prev) => ({
          ...prev,
          duration: durationInMinutes,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          duration: "",
        }));
      }
    }
  }, [
    formData.startDate,
    formData.endDate,
    formData.startTime,
    formData.endTime,
  ]);

  /* ================= HANDLERS ================= */
  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.type === "file"
        ? e.target.files[0]
        : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhoneVN = (v) => /^(0|\+84)[0-9]{9}$/.test(v);

  // ========== VALIDATE FUNCTION ==========
  const validateForm = () => {
    const newErrors = {};

    // ===== THÔNG TIN CƠ BẢN =====
    if (!formData.activityName.trim()) {
      newErrors.activityName = "Tên hoạt động không được để trống";
    } else if (formData.activityName.trim().length < 5) {
      newErrors.activityName = "Tên hoạt động phải có ít nhất 5 ký tự";
    } else if (formData.activityName.trim().length > 200) {
      newErrors.activityName = "Tên hoạt động không được quá 200 ký tự";
    }

    if (!formData.activityType) {
      newErrors.activityType = "Vui lòng chọn loại hoạt động";
    }

    if (formData.description && formData.description.trim().length > 1000) {
      newErrors.description = "Mô tả không được quá 1000 ký tự";
    }

    // ===== THỜI GIAN & ĐỊA ĐIỂM =====
    if (!formData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }

    // Check endDate >= startDate
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = "Vui lòng chọn giờ bắt đầu";
    }

    if (!formData.endTime) {
      newErrors.endTime = "Vui lòng chọn giờ kết thúc";
    }

    // Check endTime > startTime
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startTime &&
      formData.endTime
    ) {
      const start = new Date(`${formData.startDate}T${formData.startTime}:00`);
      const end = new Date(`${formData.endDate}T${formData.endTime}: 00`);

      if (end <= start) {
        newErrors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }
    }

    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline = "Vui lòng chọn hạn đăng ký";
    } else {
      // Check registrationDeadline < startDate
      const deadline = new Date(formData.registrationDeadline);
      const start = new Date(`${formData.startDate}T${formData.startTime}`);

      if (deadline >= start) {
        newErrors.registrationDeadline =
          "Hạn đăng ký phải trước thời gian bắt đầu";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Địa điểm không được để trống";
    } else if (formData.location.trim().length < 3) {
      newErrors.location = "Địa điểm phải có ít nhất 3 ký tự";
    } else if (formData.location.trim().length > 100) {
      newErrors.location = "Địa điểm không được quá 100 ký tự";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Địa chỉ phải có ít nhất 10 ký tự";
    } else if (formData.address.trim().length > 255) {
      newErrors.address = "Địa chỉ không được quá 255 ký tự";
    }

    // ===== THÔNG TIN LIÊN HỆ =====
    if (!formData.organizer.trim()) {
      newErrors.organizer = "Người tổ chức không được để trống";
    } else if (formData.organizer.trim().length < 3) {
      newErrors.organizer = "Tên người tổ chức phải có ít nhất 3 ký tự";
    } else if (formData.organizer.trim().length > 100) {
      newErrors.organizer = "Tên người tổ chức không được quá 100 ký tự";
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Số điện thoại không được để trống";
    } else if (!isPhoneVN(formData.contactPhone.trim())) {
      newErrors.contactPhone = "SĐT:  0xxxxxxxxx hoặc +84xxxxxxxxx";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Email không được để trống";
    } else if (!isEmail(formData.contactEmail.trim())) {
      newErrors.contactEmail = "Email không hợp lệ";
    }

    // ===== SỐ LƯỢNG & ĐIỂM =====
    if (formData.minParticipants !== "") {
      const min = Number(formData.minParticipants);
      if (isNaN(min) || min < 0) {
        newErrors.minParticipants = "Số lượng tối thiểu phải >= 0";
      } else if (!Number.isInteger(min)) {
        newErrors.minParticipants = "Số lượng tối thiểu phải là số nguyên";
      }
    }

    if (!formData.maxParticipants) {
      newErrors.maxParticipants = "Số lượng tối đa không được trống";
    } else {
      const max = Number(formData.maxParticipants);
      if (isNaN(max) || max <= 0) {
        newErrors.maxParticipants = "Số lượng tối đa phải > 0";
      } else if (!Number.isInteger(max)) {
        newErrors.maxParticipants = "Số lượng tối đa phải là số nguyên";
      }
    }

    // Check minParticipants <= maxParticipants
    if (
      formData.minParticipants &&
      formData.maxParticipants &&
      Number(formData.minParticipants) > Number(formData.maxParticipants)
    ) {
      newErrors.minParticipants =
        "Số lượng tối thiểu không được lớn hơn tối đa";
    }

    if (!formData.basePoints) {
      newErrors.basePoints = "Điểm cơ bản không được để trống";
    } else {
      const points = Number(formData.basePoints);
      if (isNaN(points) || points < 0) {
        newErrors.basePoints = "Điểm cơ bản phải >= 0";
      } else if (!Number.isInteger(points)) {
        newErrors.basePoints = "Điểm cơ bản phải là số nguyên";
      }
    }

    // Validate bonus points
    if (formData.firstPlaceBonus !== "") {
      const bonus = Number(formData.firstPlaceBonus);
      if (isNaN(bonus) || bonus < 0) {
        newErrors.firstPlaceBonus = "Điểm thưởng phải >= 0";
      } else if (!Number.isInteger(bonus)) {
        newErrors.firstPlaceBonus = "Điểm thưởng phải là số nguyên";
      }
    }

    if (formData.secondPlaceBonus !== "") {
      const bonus = Number(formData.secondPlaceBonus);
      if (isNaN(bonus) || bonus < 0) {
        newErrors.secondPlaceBonus = "Điểm thưởng phải >= 0";
      } else if (!Number.isInteger(bonus)) {
        newErrors.secondPlaceBonus = "Điểm thưởng phải là số nguyên";
      }
    }

    if (formData.thirdPlaceBonus !== "") {
      const bonus = Number(formData.thirdPlaceBonus);
      if (isNaN(bonus) || bonus < 0) {
        newErrors.thirdPlaceBonus = "Điểm thưởng phải >= 0";
      } else if (!Number.isInteger(bonus)) {
        newErrors.thirdPlaceBonus = "Điểm thưởng phải là số nguyên";
      }
    }

    // Check bonus order:  first >= second >= third
    if (
      formData.firstPlaceBonus &&
      formData.secondPlaceBonus &&
      Number(formData.firstPlaceBonus) < Number(formData.secondPlaceBonus)
    ) {
      newErrors.secondPlaceBonus = "Điểm giải nhì không được lớn hơn giải nhất";
    }

    if (
      formData.secondPlaceBonus &&
      formData.thirdPlaceBonus &&
      Number(formData.secondPlaceBonus) < Number(formData.thirdPlaceBonus)
    ) {
      newErrors.thirdPlaceBonus = "Điểm giải ba không được lớn hơn giải nhì";
    }

    // ===== FILES =====
    if (!formData.image) {
      newErrors.image = "Vui lòng chọn ảnh hoạt động";
    } else {
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!validImageTypes.includes(formData.image.type)) {
        newErrors.image = "Chỉ chấp nhận file ảnh (JPG, PNG, GIF)";
      } else if (formData.image.size > 5 * 1024 * 1024) {
        newErrors.image = "Kích thước ảnh không được quá 5MB";
      }
    }

    if (formData.attachment) {
      if (formData.attachment.size > 10 * 1024 * 1024) {
        newErrors.attachment = "Kích thước file không được quá 10MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert("warning", "Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      setLoading(true);

      // Prepare data
      const activityData = {
        // Required
        activityName: formData.activityName.trim(),
        activityType: formData.activityType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime + ":00",
        endTime: formData.endTime + ":00",
        registrationDeadline: formData.registrationDeadline + ":00",
        location: formData.location.trim(),
        address: formData.address.trim(),
        organizer: formData.organizer.trim(),
        contactPhone: formData.contactPhone.trim(),
        contactEmail: formData.contactEmail.trim(),
        maxParticipants: Number(formData.maxParticipants),
        basePoints: Number(formData.basePoints),

        // Optional
        description: formData.description.trim() || null,
        duration: formData.duration ? Number(formData.duration) : null,
        minParticipants: formData.minParticipants
          ? Number(formData.minParticipants)
          : null,
        isMandatory: formData.isMandatory,
        firstPlaceBonus: formData.firstPlaceBonus
          ? Number(formData.firstPlaceBonus)
          : null,
        secondPlaceBonus: formData.secondPlaceBonus
          ? Number(formData.secondPlaceBonus)
          : null,
        thirdPlaceBonus: formData.thirdPlaceBonus
          ? Number(formData.thirdPlaceBonus)
          : null,
        notes: formData.notes.trim() || null,

        // Files
        image: formData.image,
        attachment: formData.attachment,
      };

      console.log("Submitting activity data:", activityData);

      const result = await HRService.createActivity(activityData);

      if (onCreate) onCreate(result);
      onClose();
      showAlert("success", "Thêm hoạt động thành công!");
    } catch (error) {
      console.error("Error creating activity:", error);
      showAlert("error", error.message || "Tạo hoạt động thất bại");
    } finally {
      setLoading(false);
    }
  };

  const invalid = (field) => (errors[field] ? "invalid" : "");

  /* ================= RENDER ================= */
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-e" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-e">
          <h3>Tạo hoạt động mới</h3>
          <button className="btn-close-e" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          {/* ===== THÔNG TIN CƠ BẢN ===== */}
          <fieldset>
            <legend>Thông tin cơ bản</legend>

            <div className="form-row">
              <div className={`form-group ${invalid("activityName")}`}>
                <label>
                  Tên hoạt động <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.activityName}
                  onChange={handleChange("activityName")}
                  placeholder="Nhập tên hoạt động"
                />
                {errors.activityName && (
                  <small className="error">{errors.activityName}</small>
                )}
              </div>

              <div className={`form-group ${invalid("activityType")}`}>
                <label>
                  Loại hoạt động <span className="required">*</span>
                </label>
                <select
                  value={formData.activityType}
                  onChange={handleChange("activityType")}
                >
                  <option value="">-- Chọn loại --</option>
                  <option value="TRAINING">Đào tạo</option>
                  <option value="TEAM_BUILDING">Team Building</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="CONFERENCE">Hội nghị</option>
                  <option value="VOLUNTEER">Tình nguyện</option>
                  <option value="SPORTS">Thể thao</option>
                  <option value="OTHER">Khác</option>
                </select>
                {errors.activityType && (
                  <small className="error">{errors.activityType}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("description")}`}>
                <label>Mô tả</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={handleChange("description")}
                  placeholder="Mô tả về hoạt động"
                />
                {errors.description && (
                  <small className="error">{errors.description}</small>
                )}
              </div>
            </div>
          </fieldset>

          {/* ===== THỜI GIAN & ĐỊA ĐIỂM ===== */}
          <fieldset>
            <legend>Thời gian & Địa điểm</legend>

            <div className="form-row">
              <div className={`form-group ${invalid("startDate")}`}>
                <label>
                  Ngày bắt đầu <span className="required">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange("startDate")}
                />
                {errors.startDate && (
                  <small className="error">{errors.startDate}</small>
                )}
              </div>

              <div className={`form-group ${invalid("endDate")}`}>
                <label>
                  Ngày kết thúc <span className="required">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange("endDate")}
                />
                {errors.endDate && (
                  <small className="error">{errors.endDate}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("startTime")}`}>
                <label>
                  Giờ bắt đầu <span className="required">*</span>
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange("startTime")}
                />
                {errors.startTime && (
                  <small className="error">{errors.startTime}</small>
                )}
              </div>

              <div className={`form-group ${invalid("endTime")}`}>
                <label>
                  Giờ kết thúc <span className="required">*</span>
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange("endTime")}
                />
                {errors.endTime && (
                  <small className="error">{errors.endTime}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("registrationDeadline")}`}>
                <label>
                  Hạn đăng ký <span className="required">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.registrationDeadline}
                  onChange={handleChange("registrationDeadline")}
                />
                {errors.registrationDeadline && (
                  <small className="error">{errors.registrationDeadline}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("location")}`}>
                <label>
                  Địa điểm <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={handleChange("location")}
                  placeholder="VD: Phòng họp A"
                />
                {errors.location && (
                  <small className="error">{errors.location}</small>
                )}
              </div>

              <div className={`form-group ${invalid("address")}`}>
                <label>
                  Địa chỉ <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={handleChange("address")}
                  placeholder="Địa chỉ cụ thể"
                />
                {errors.address && (
                  <small className="error">{errors.address}</small>
                )}
              </div>
            </div>
          </fieldset>

          {/* ===== THÔNG TIN LIÊN HỆ ===== */}
          <fieldset>
            <legend>Thông tin liên hệ</legend>

            <div className="form-row">
              <div className={`form-group ${invalid("organizer")}`}>
                <label>
                  Người tổ chức <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={handleChange("organizer")}
                  placeholder="Tên người tổ chức"
                />
                {errors.organizer && (
                  <small className="error">{errors.organizer}</small>
                )}
              </div>

              <div className={`form-group ${invalid("contactPhone")}`}>
                <label>
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={handleChange("contactPhone")}
                  placeholder="0xxxxxxxxx"
                />
                {errors.contactPhone && (
                  <small className="error">{errors.contactPhone}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("contactEmail")}`}>
                <label>
                  Email liên hệ <span className="required">*</span>
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange("contactEmail")}
                  placeholder="email@example.com"
                />
                {errors.contactEmail && (
                  <small className="error">{errors.contactEmail}</small>
                )}
              </div>
            </div>
          </fieldset>

          {/* ===== SỐ LƯỢNG & ĐIỂM ===== */}
          <fieldset>
            <legend>Số lượng & Điểm thưởng</legend>

            <div className="form-row">
              <div className={`form-group ${invalid("minParticipants")}`}>
                <label>Số lượng tối thiểu</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minParticipants}
                  onChange={handleChange("minParticipants")}
                  placeholder="Tối thiểu"
                />
                {errors.minParticipants && (
                  <small className="error">{errors.minParticipants}</small>
                )}
              </div>

              <div className={`form-group ${invalid("maxParticipants")}`}>
                <label>
                  Số lượng tối đa <span className="required">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={handleChange("maxParticipants")}
                  placeholder="Tối đa"
                />
                {errors.maxParticipants && (
                  <small className="error">{errors.maxParticipants}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isMandatory}
                    onChange={handleChange("isMandatory")}
                  />
                  <span style={{ marginLeft: "8px" }}>Bắt buộc tham gia</span>
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("basePoints")}`}>
                <label>
                  Điểm cơ bản <span className="required">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.basePoints}
                  onChange={handleChange("basePoints")}
                  placeholder="Điểm cho người tham gia"
                />
                {errors.basePoints && (
                  <small className="error">{errors.basePoints}</small>
                )}
              </div>

              <div className={`form-group ${invalid("firstPlaceBonus")}`}>
                <label>Điểm thưởng giải nhất</label>
                <input
                  type="number"
                  min="0"
                  value={formData.firstPlaceBonus}
                  onChange={handleChange("firstPlaceBonus")}
                  placeholder="Điểm thưởng (nếu có)"
                />
                {errors.firstPlaceBonus && (
                  <small className="error">{errors.firstPlaceBonus}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("secondPlaceBonus")}`}>
                <label>Điểm thưởng giải nhì</label>
                <input
                  type="number"
                  min="0"
                  value={formData.secondPlaceBonus}
                  onChange={handleChange("secondPlaceBonus")}
                />
                {errors.secondPlaceBonus && (
                  <small className="error">{errors.secondPlaceBonus}</small>
                )}
              </div>

              <div className={`form-group ${invalid("thirdPlaceBonus")}`}>
                <label>Điểm thưởng giải ba</label>
                <input
                  type="number"
                  min="0"
                  value={formData.thirdPlaceBonus}
                  onChange={handleChange("thirdPlaceBonus")}
                />
                {errors.thirdPlaceBonus && (
                  <small className="error">{errors.thirdPlaceBonus}</small>
                )}
              </div>
            </div>
          </fieldset>

          {/* ===== FILES & GHI CHÚ ===== */}
          <fieldset>
            <legend>Tài liệu & Ghi chú</legend>

            <div className="form-row">
              <div className={`form-group ${invalid("image")}`}>
                <label>
                  Ảnh hoạt động <span className="required">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange("image")}
                />
                {errors.image && (
                  <small className="error">{errors.image}</small>
                )}
                {formData.image && !errors.image && (
                  <small style={{ color: "#28a745" }}>
                    ✓ {formData.image.name}
                  </small>
                )}
              </div>

              <div className={`form-group ${invalid("attachment")}`}>
                <label>Tài liệu đính kèm</label>
                <input
                  type="file"
                  onChange={handleChange("attachment")}
                  accept=".pdf,.doc,.docx,. xls,.xlsx"
                />
                {errors.attachment && (
                  <small className="error">{errors.attachment}</small>
                )}
                {formData.attachment && !errors.attachment && (
                  <small style={{ color: "#28a745" }}>
                    ✓ {formData.attachment.name}
                  </small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange("notes")}
                  placeholder="Ghi chú thêm về hoạt động (không bắt buộc)"
                />
              </div>
            </div>
          </fieldset>

          {/* ===== ACTION ===== */}
          <div className="form-actions">
            <button
              type="button"
              className="btn light"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Đang xử lý..." : "Tạo hoạt động"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
