import React, { useEffect, useState } from "react";
import "./style.scss";
import { HRService } from "../../../services/HRService";
import { useAlert } from "../../../context/AlertContext";
// ========== STATUS MAPPING ==========
const STATUS_MAP = {
  // DRAFT: { label: "Nháp", className: "status-draft" },
  OPEN_FOR_REGISTRATION: { label: "Đang mở đăng ký", className: "status-open" },
  REGISTRATION_CLOSED: { label: "Đã đóng đăng ký", className: "status-closed" },
  ONGOING: { label: "Đang diễn ra", className: "status-ongoing" },
  COMPLETED: { label: "Đã hoàn thành", className: "status-completed" },
  CANCELLED: { label: "Đã hủy", className: "status-cancelled" },
};

export const ActivityUpdateModal = ({
  activity,
  isOpen,
  onClose,
  onUpdate,
}) => {
  if (!isOpen || !activity) return null;

  const { showAlert } = useAlert();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    status: "",
  });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showOpenRegistrationConfirm, setShowOpenRegistrationConfirm] =
    useState(false);
  // ========== THÊM IMPORT STATES ==========
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  // ========== CHECK IF IS COMPLETED ==========
  const isCompleted = activity.activityStatus === "COMPLETED";
  // ========== CHECK IF IS DRAFT ==========
  const isDraft = activity.activityStatus === "OPEN_FOR_REGISTRATION";

  // ========== GET STATUS DISPLAY ==========
  const getStatusDisplay = (status) => {
    const statusInfo = STATUS_MAP[status] || {
      label: status || "N/A",
      className: "status-default",
    };
    return statusInfo;
  };

  const statusInfo = getStatusDisplay(activity.activityStatus);

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
    duration: "",
    minParticipants: "",
    isMandatory: false,
    firstPlaceBonus: "",
    secondPlaceBonus: "",
    thirdPlaceBonus: "",
    notes: "",

    // Files
    image: null,
    attachment: null,
    currentImageUrl: null,
    currentAttachmentUrl: null,
  });

  /* ================= UTILS ================= */
  const formatDateForInput = (date) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  const formatTimeForInput = (time) => {
    if (!time) return "";
    return time.substring(0, 5);
  };

  const formatDateTimeForInput = (dateTime) => {
    if (!dateTime) return "";
    return dateTime.substring(0, 16);
  };

  /* ================= EFFECT - Load Activity Data ================= */
  useEffect(() => {
    if (activity) {
      setFormData({
        activityName: activity.activityName || "",
        activityType: activity.activityType || "",
        description: activity.description || "",
        startDate: formatDateForInput(activity.startDate),
        endDate: formatDateForInput(activity.endDate),
        startTime: formatTimeForInput(activity.startTime),
        endTime: formatTimeForInput(activity.endTime),
        registrationDeadline: formatDateTimeForInput(
          activity.registrationDeadline
        ),
        location: activity.location || "",
        address: activity.address || "",
        organizer: activity.organizer || "",
        contactPhone: activity.contactPhone || "",
        contactEmail: activity.contactEmail || "",
        minParticipants: activity.minParticipants || "",
        maxParticipants: activity.maxParticipants || "",
        isMandatory: activity.isMandatory || false,
        basePoints: activity.basePoints || "",
        firstPlaceBonus: activity.firstPlaceBonus || "",
        secondPlaceBonus: activity.secondPlaceBonus || "",
        thirdPlaceBonus: activity.thirdPlaceBonus || "",
        notes: activity.notes || "",
        duration: activity.duration || "",

        // Files
        image: null,
        attachment: null,
        currentImageUrl: activity.image || null,
        currentAttachmentUrl: activity.attachment || null,
      });
    }
  }, [activity]);

  /* ================= EFFECT - Auto Calculate Duration ================= */
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
        setFormData((prev) => ({ ...prev, duration: durationInMinutes }));
      } else {
        setFormData((prev) => ({ ...prev, duration: "" }));
      }
    }
  }, [
    formData.startDate,
    formData.endDate,
    formData.startTime,
    formData.endTime,
  ]);

  /* ================= EFFECT - Fetch Participants ================= */
  useEffect(() => {
    if (!activity?.id) return;

    const fetchParticipants = async () => {
      try {
        const data = await HRService.GetParticipantsByActivity(
          activity.id,
          filters
        );
        setParticipants(data.content || []);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchParticipants();
  }, [activity?.id, filters]);

  /* ================= HANDLERS ================= */
  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.type === "file"
        ? e.target.files[0]
        : e.target.value;

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetFilters = () => {
    setFilters({
      name: "",
      status: "",
    });
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhoneVN = (v) => /^(0|\+84)[0-9]{9}$/.test(v);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.activityName.trim()) {
      newErrors.activityName = "Tên hoạt động không được để trống";
    } else if (formData.activityName.trim().length < 5) {
      newErrors.activityName = "Tên hoạt động phải có ít nhất 5 ký tự";
    }

    if (!formData.activityType) {
      newErrors.activityType = "Vui lòng chọn loại hoạt động";
    }

    if (formData.description && formData.description.trim().length > 1000) {
      newErrors.description = "Mô tả không được quá 1000 ký tự";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }

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
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Địa chỉ phải có ít nhất 10 ký tự";
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = "Người tổ chức không được để trống";
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

    if (formData.image && formData.image instanceof File) {
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

    if (formData.attachment && formData.attachment instanceof File) {
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

      const activityData = {
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
        image: formData.image,
        attachment: formData.attachment,
      };

      console.log("Updating activity:", activityData);

      const result = await HRService.UpdateActivity(activity.id, activityData);

      if (onUpdate) onUpdate(result);
      onClose();
      showAlert("success", "Cập nhật hoạt động thành công!");
    } catch (error) {
      console.error("Error updating activity:", error);
      showAlert("error", error.message || "Cập nhật hoạt động thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ========== HANDLERS FOR STATUS CHANGE ==========
  const handleCancelActivity = async () => {
    try {
      setLoading(true);
      const result = await HRService.cancelDraftActivity(activity.id);

      if (onUpdate) onUpdate(result);
      onClose();
      showAlert("success", "Hủy sự kiện thành công!");
    } catch (error) {
      console.error("Error cancelling activity:", error);
      showAlert("error", error.message || "Hủy sự kiện thất bại");
    } finally {
      setLoading(false);
      setShowCancelConfirm(false);
    }
  };

  const handleOpenRegistration = async () => {
    try {
      setLoading(true);
      const result = await HRService.openRegistration(activity.id);

      if (onUpdate) onUpdate(result);
      onClose();
      showAlert("success", "Mở đăng ký thành công!");
    } catch (error) {
      console.error("Error opening registration:", error);
      showAlert("error", error.message || "Mở đăng ký thất bại");
    } finally {
      setLoading(false);
      setShowOpenRegistrationConfirm(false);
    }
  };
  // ========== THÊM IMPORT HANDLERS ==========
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setImportFile(selectedFile);
    setImportResult(null);
  };

  const handleImportResult = async () => {
    if (!importFile) {
      showAlert("warning", "Vui lòng chọn file để import");
      return;
    }

    try {
      setImportLoading(true);

      const result = await HRService.importActivityResult(importFile);
      setImportResult(result);

      if (result.errorCount === 0) {
        showAlert(
          "success",
          `Import thành công ${result.successCount} bản ghi! `
        );

        // Refresh participants list
        const data = await HRService.GetParticipantsByActivity(
          activity.id,
          filters
        );
        setParticipants(data.content || []);

        // Auto close after 2s
        setTimeout(() => {
          setShowImportModal(false);
          setImportFile(null);
          setImportResult(null);
        }, 2000);
      } else {
      }
    } catch (error) {
      console.error("Error importing:", error);
      showAlert("error", error.message || "Import thất bại");
    } finally {
      setImportLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    window.open("/templates/activity-result-template.xlsx", "_blank");
  };
  console.log("importResult:", importResult);
  const invalid = (field) => (errors[field] ? "invalid" : "");

  /* ================= RENDER ================= */
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-e" onClick={(e) => e.stopPropagation()}>
        {/* ========== MODAL HEADER ========== */}
        <div className="modal-header-e">
          <h3>Chi tiết hoạt động</h3>
          <button className="btn-close-e" onClick={onClose} type="button">
            ×
          </button>
        </div>

        {/* ========== HIỂN THỊ STATUS ========== */}
        <div className="activity-status-banner">
          <span className={`status-badge-large ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>

        <form
          className="employee-form"
          onSubmit={isDraft ? handleSubmit : (e) => e.preventDefault()}
        >
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                  disabled={isDraft}
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
                  disabled={isDraft}
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                  disabled={isDraft}
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                    disabled={!isDraft}
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                  disabled={!isDraft}
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
                <label>Ảnh hoạt động</label>

                {formData.currentImageUrl && !formData.image && (
                  <div style={{ marginBottom: "8px" }}>
                    <small style={{ color: "#666" }}>
                      Ảnh hiện tại:
                      <a
                        href={formData.currentImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: "4px", color: "#2563eb" }}
                      >
                        Xem ảnh
                      </a>
                    </small>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange("image")}
                  disabled={!isDraft}
                />

                {formData.image && (
                  <small style={{ color: "#28a745" }}>
                    ✓ Ảnh mới: {formData.image.name}
                  </small>
                )}

                {errors.image && (
                  <small className="error">{errors.image}</small>
                )}

                {isDraft && (
                  <small
                    style={{
                      color: "#666",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {formData.image
                      ? "Ảnh mới sẽ thay thế ảnh cũ"
                      : "Để trống nếu không muốn thay đổi"}
                  </small>
                )}
              </div>

              <div className={`form-group ${invalid("attachment")}`}>
                <label>Tài liệu đính kèm</label>

                {formData.currentAttachmentUrl && !formData.attachment && (
                  <div style={{ marginBottom: "8px" }}>
                    <small style={{ color: "#666" }}>
                      File hiện tại:
                      <a
                        href={formData.currentAttachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: "4px", color: "#2563eb" }}
                      >
                        Tải xuống
                      </a>
                    </small>
                  </div>
                )}

                <input
                  type="file"
                  onChange={handleChange("attachment")}
                  accept=".pdf,.doc,.docx,. xls,.xlsx"
                  disabled={!isDraft}
                />

                {formData.attachment && (
                  <small style={{ color: "#28a745" }}>
                    ✓ File mới: {formData.attachment.name}
                  </small>
                )}

                {errors.attachment && (
                  <small className="error">{errors.attachment}</small>
                )}

                {isDraft && (
                  <small
                    style={{
                      color: "#666",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {formData.attachment
                      ? "File mới sẽ thay thế file cũ"
                      : "Để trống nếu không muốn thay đổi"}
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
                  placeholder="Ghi chú thêm về hoạt động"
                  disabled={!isDraft}
                />
              </div>
            </div>
          </fieldset>

          {/* ===== ACTION (CHỈ HIỆN KHI DRAFT) ===== */}
          {isDraft && (
            <div className="form-actions">
              <button
                type="button"
                className="btn danger"
                onClick={handleCancelActivity}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Hủy sự kiện"}
              </button>

              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? "Đang cập nhật..." : "Chỉnh sửa"}
              </button>

              {/* <button
                type="button"
                className="btn success"
                onClick={handleOpenRegistration}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Mở đăng ký"}
              </button> */}
            </div>
          )}

          {/* ===== DANH SÁCH THAM GIA ===== */}
          <fieldset>
            <legend>Danh sách nhân viên tham gia</legend>

            <div className="participants-filter">
              <input
                className="filter-input"
                placeholder="Lọc theo tên"
                value={filters.name}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, name: e.target.value }))
                }
              />

              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, status: e.target.value }))
                }
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Hoàn thành</option>
                <option value="false">Chưa hoàn thành</option>
              </select>

              <button
                type="button"
                className="reset-btn"
                onClick={resetFilters}
              >
                Đặt lại
              </button>
              {isCompleted && (
                <div className="import-section">
                  <button
                    type="button"
                    className="btn btn-import"
                    onClick={() => setShowImportModal(true)}
                  >
                    Import kết quả
                  </button>
                </div>
              )}
            </div>

            <table className="participants-table">
              <thead>
                <tr>
                  <th>Tên nhân viên</th>
                  <th>Xếp hạng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="no-data-a">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  participants?.map((p) => (
                    <tr key={p.id}>
                      <td>{p.employeeName}</td>
                      <td>{p.activityRank}</td>
                      <td>{p.isSuccess ? "Hoàn thành" : "Chưa hoàn thành"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </fieldset>
        </form>
      </div>

      {showImportModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowImportModal(false)}
        >
          <div
            className="modal-content-import"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Import kết quả hoạt động</h3>
              <button
                className="btn-close"
                onClick={() => setShowImportModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* File Input */}
              <div className="file-input-section">
                <label htmlFor="file-upload" className="file-label">
                  Chọn file Excel (. xls, .xlsx)
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileChange}
                  disabled={importLoading}
                />

                {importFile && (
                  <div className="file-info">
                    <span>✓ {importFile.name}</span>
                    <span className="file-size">
                      ({(importFile.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                )}
              </div>

              {/* Import Result */}
              {importResult && (
                <div className="import-result">
                  <h4>Kết quả import:</h4>
                  <div className="result-summary">
                    <div className="success-count">
                      <span>Thành công: {importResult.successRow || 0}</span>
                    </div>
                    <div className="error-count">
                      <span>Thất bại: {importResult.importErrors.length || 0}</span>
                    </div>
                  </div>

                  {/* Error Details */}
                  {importResult.importErrors &&
                    importResult.importErrors.length > 0 && (
                      <div className="error-details">
                        <h5>Chi tiết lỗi:</h5>
                        <ul>
                          {importResult.importErrors.map((error, index) => (
                            <li key={index}>{error.message}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setShowImportModal(false)}
                disabled={importLoading}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleImportResult}
                disabled={!importFile || importLoading}
              >
                {importLoading ? "Đang import..." : "Import"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
