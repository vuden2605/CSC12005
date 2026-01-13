import { useEffect, useState } from "react";
import "./style.scss";
import { PositionService } from "../../services/PositionService";

const initialForm = {
  // Thông tin cá nhân bắt buộc
  fullName: "",
  gender: "",
  email: "",
  phone: "",
  birthDate: "",
  nationalCode: "",
  taxCode: "",
  address: "",

  // Thông tin liên hệ khẩn cấp
  emergencyContactPhone: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",

  // Thông tin cá nhân bổ sung
  placeOfBirth: "",
  nationality: "",
  religion: "",
  permanentAddress: "",
  maritalStatus: "",

  // Thông tin học vấn
  educationLevel: "",
  major: "",
  university: "",
  graduationYear: "",
  degree: "",
  numberOfDependents: "",

  // Thông tin ngân hàng
  bankName: "",
  bankAccount: "",
  bankBranch: "",

  // Thông tin công việc
  baseSalary: "",
  departmentId: "",
  positionId: "",
  hireDate: "",
  contractStartDate: "",
  contractEndDate: "",
  contractType: "",
  workSchedule: "",

  // Bảo hiểm
  socialInsuranceNumber: "",
  healthInsuranceNumber: "",

  // Khác
  avatarUrl: "",
  attachments: null,
};

const EmployeeFormCreateModal = ({ visible, onClose, onCreateEmp }) => {
  if (!visible) return null;

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [positions, setPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "file" ? e.target.files : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhoneVN = (v) => /^(0|\+84)[0-9]{9}$/.test(v);
  const isNumber = (v) => /^-?\d+(\.\d+)?$/.test(`${v}`);

  const validate = () => {
    const err = {};

    // Required fields
    if (!formData.fullName.trim()) err.fullName = "Vui lòng nhập họ và tên";
    if (!formData.gender) err.gender = "Vui lòng chọn giới tính";
    if (!formData.birthDate) err.birthDate = "Vui lòng chọn ngày sinh";
    if (!formData.hireDate) err.hireDate = "Vui lòng chọn ngày bắt đầu làm việc";

    if (!formData.nationalCode.trim())
      err.nationalCode = "Vui lòng nhập CCCD/CMND";
    if (!formData.taxCode.trim()) err.taxCode = "Vui lòng nhập mã số thuế";
    if (!formData.email.trim()) err.email = "Vui lòng nhập email";
    if (!formData.phone.trim()) err.phone = "Vui lòng nhập số điện thoại";
    if (!formData.address.trim()) err.address = "Vui lòng nhập địa chỉ";
    if (!formData.bankName) err.bankName = "Vui lòng chọn ngân hàng";
    if (!formData.bankAccount.trim())
      err.bankAccount = "Vui lòng nhập số tài khoản";
    if (!formData.departmentId) err.departmentId = "Vui lòng chọn phòng ban";
    if (!formData.positionId) err.positionId = "Vui lòng chọn vị trí";
        if (!formData.contractType) err.contractType = "Vui lòng chọn loại hợp đồng";
    if (!formData.workSchedule) err.workSchedule = "Vui lòng chọn lịch làm việc";

    if (!`${formData.baseSalary}`.trim())
      err.baseSalary = "Vui lòng nhập lương cơ bản";

    // Format validation
    if (formData.email && !isEmail(formData.email))
      err.email = "Email không hợp lệ";
    if (formData.phone && !isPhoneVN(formData.phone))
      err.phone = "SĐT:   0xxxxxxxxx hoặc +84xxxxxxxxx";
    if (
      formData.emergencyContactPhone &&
      !isPhoneVN(formData.emergencyContactPhone)
    )
      err.emergencyContactPhone = "SĐT không hợp lệ";
    if (formData.bankAccount && !isNumber(formData.bankAccount))
      err.bankAccount = "Số tài khoản chỉ chứa chữ số";
    if (
      formData.baseSalary &&
      (!isNumber(formData.baseSalary) || Number(formData.baseSalary) <= 0)
    )
      err.baseSalary = "Lương cơ bản phải là số dương";

    setErrors(err);
    return err;
  };

  useEffect(() => {
    const fetchPositions = async () => {
      if (!formData.departmentId) {
        setPositions([]);
        setFormData((prev) => ({ ...prev, positionId: "" }));
        return;
      }
      try {
        setLoadingPositions(true);
        const data = await PositionService.getByDepartmentId(
          formData.departmentId
        );
        setPositions(data || []);
        setFormData((prev) => ({ ...prev, positionId: "" }));
      } catch {
        setPositions([]);
      } finally {
        setLoadingPositions(false);
      }
    };
    fetchPositions();
  }, [formData.departmentId]);

  // 🔥 Xóa ngày kết thúc hợp đồng khi chọn "Không thời hạn"
  useEffect(() => {
    if (formData.contractType === "INDEFINITE") {
      setFormData((prev) => ({ ...prev, contractEndDate: "" }));
    }
  }, [formData.contractType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) return;

    const payload = {
      ...formData,
      departmentId: Number(formData.departmentId),
      positionId: Number(formData.positionId),
      baseSalary: Number(formData.baseSalary),
      graduationYear: formData.graduationYear
        ? Number(formData.graduationYear)
        : null,
      numberOfDependents: formData.numberOfDependents
        ? Number(formData.numberOfDependents)
        : null,
    };

    // Remove empty strings
    Object.keys(payload).forEach((key) => {
      if (payload[key] === "" || payload[key] === null) {
        delete payload[key];
      }
    });

    if (typeof onCreateEmp === "function") {
      onCreateEmp(payload);
    }
  };

  const invalid = (name) => (errors[name] ? "invalid" : "");

  // 🔥 Kiểm tra xem có phải hợp đồng không thời hạn không
  const isIndefiniteContract = formData.contractType === "INDEFINITE";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-e" onClick={(e) => e.stopPropagation()}>
        {/* ========== MODAL HEADER ========== */}
        <div className="modal-header-e">
          <h3>Thêm Hồ sơ Nhân viên</h3>
          <button className="btn-close-e" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          {/* ========== THÔNG TIN CÁ NHÂN ========== */}
          <fieldset>
            <legend>Thông tin cá nhân</legend>

            <div className="form-row">
              <div className={`form-group ${invalid("fullName")}`}>
                <label>
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                />
                {errors.fullName && (
                  <small className="error">{errors.fullName}</small>
                )}
              </div>

              <div className={`form-group ${invalid("gender")}`}>
                <label>
                  Giới tính <span className="required">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={handleChange("gender")}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
                {errors.gender && (
                  <small className="error">{errors.gender}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("birthDate")}`}>
                <label>
                  Ngày sinh <span className="required">*</span>
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange("birthDate")}
                />
                {errors.birthDate && (
                  <small className="error">{errors.birthDate}</small>
                )}
              </div>

              <div className={`form-group ${invalid("nationalCode")}`}>
                <label>
                  CCCD/CMND <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nationalCode}
                  onChange={handleChange("nationalCode")}
                />
                {errors.nationalCode && (
                  <small className="error">{errors.nationalCode}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("email")}`}>
                <label>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                />
                {errors.email && (
                  <small className="error">{errors.email}</small>
                )}
              </div>

              <div className={`form-group ${invalid("phone")}`}>
                <label>
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                />
                {errors.phone && (
                  <small className="error">{errors.phone}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("address")}`}>
                <label>
                  Địa chỉ hiện tại <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={handleChange("address")}
                />
                {errors.address && (
                  <small className="error">{errors.address}</small>
                )}
              </div>

              <div className="form-group">
                <label>Địa chỉ thường trú</label>
                <input
                  type="text"
                  value={formData.permanentAddress}
                  onChange={handleChange("permanentAddress")}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nơi sinh</label>
                <input
                  type="text"
                  value={formData.placeOfBirth}
                  onChange={handleChange("placeOfBirth")}
                />
              </div>

              <div className="form-group">
                <label>Quốc tịch</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={handleChange("nationality")}
                  placeholder="Việt Nam"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tôn giáo</label>
                <input
                  type="text"
                  value={formData.religion}
                  onChange={handleChange("religion")}
                />
              </div>

              <div className="form-group">
                <label>Tình trạng hôn nhân</label>
                <select
                  value={formData.maritalStatus}
                  onChange={handleChange("maritalStatus")}
                >
                  <option value="">-- Chọn --</option>
                  <option value="SINGLE">Độc thân</option>
                  <option value="MARRIED">Đã kết hôn</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số người phụ thuộc</label>
                <input
                  type="number"
                  min="0"
                  value={formData.numberOfDependents}
                  onChange={handleChange("numberOfDependents")}
                />
              </div>

              <div className={`form-group ${invalid("taxCode")}`}>
                <label>
                  Mã số thuế <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.taxCode}
                  onChange={handleChange("taxCode")}
                />
                {errors.taxCode && (
                  <small className="error">{errors.taxCode}</small>
                )}
              </div>
            </div>
          </fieldset>

          {/* ========== LIÊN HỆ KHẨN CẤP ========== */}
          <fieldset>
            <legend>Liên hệ khẩn cấp</legend>

            <div className="form-row">
              <div className="form-group">
                <label>Tên người liên hệ</label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={handleChange("emergencyContactName")}
                />
              </div>

              <div className={`form-group ${invalid("emergencyContactPhone")}`}>
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange("emergencyContactPhone")}
                />
                {errors.emergencyContactPhone && (
                  <small className="error">
                    {errors.emergencyContactPhone}
                  </small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mối quan hệ</label>
                <input
                  type="text"
                  value={formData.emergencyContactRelationship}
                  onChange={handleChange("emergencyContactRelationship")}
                  placeholder="Vd: Cha, Mẹ, Vợ/Chồng..."
                />
              </div>
            </div>
          </fieldset>

          {/* ========== HỌC VẤN ========== */}
          <fieldset>
            <legend>Học vấn</legend>

            <div className="form-row">
              <div className="form-group">
                <label>Trình độ học vấn</label>
                <select
                  value={formData.educationLevel}
                  onChange={handleChange("educationLevel")}
                >
                  <option value="">-- Chọn --</option>
                  <option value="COLLEGE">Cao đẳng</option>
                  <option value="UNIVERSITY">Đại học</option>
                  <option value="MASTER">Thạc sĩ</option>
                  <option value="DOCTORATE">Tiến sĩ</option>
                </select>
              </div>

              <div className="form-group">
                <label>Chuyên ngành</label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={handleChange("major")}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Trường đại học/cao đẳng</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={handleChange("university")}
                />
              </div>

              <div className="form-group">
                <label>Năm tốt nghiệp</label>
                <input
                  type="number"
                  min="1950"
                  max="2100"
                  value={formData.graduationYear}
                  onChange={handleChange("graduationYear")}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bằng cấp</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={handleChange("degree")}
                />
              </div>
            </div>
          </fieldset>

          {/* ========== THÔNG TIN NGÂN HÀNG ========== */}
          <fieldset>
            <legend>Thông tin ngân hàng</legend>

            <div className="form-row">
              <div className={`form-group ${invalid("bankName")}`}>
                <label>
                  Tên ngân hàng <span className="required">*</span>
                </label>
                <select
                  value={formData.bankName}
                  onChange={handleChange("bankName")}
                >
                  <option value="">-- Chọn ngân hàng --</option>
                  <option value="BIDV">BIDV</option>
                  <option value="Viettinbank">ViettinBank</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="ACB">ACB</option>
                </select>
                {errors.bankName && (
                  <small className="error">{errors.bankName}</small>
                )}
              </div>

              <div className={`form-group ${invalid("bankAccount")}`}>
                <label>
                  Số tài khoản <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={handleChange("bankAccount")}
                />
                {errors.bankAccount && (
                  <small className="error">{errors.bankAccount}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Chi nhánh</label>
                <input
                  type="text"
                  value={formData.bankBranch}
                  onChange={handleChange("bankBranch")}
                />
              </div>
            </div>
          </fieldset>

          {/* ========== BẢO HIỂM ========== */}
          <fieldset>
            <legend>Bảo hiểm</legend>

            <div className="form-row">
              <div className="form-group">
                <label>Số bảo hiểm xã hội</label>
                <input
                  type="text"
                  value={formData.socialInsuranceNumber}
                  onChange={handleChange("socialInsuranceNumber")}
                />
              </div>

              <div className="form-group">
                <label>Số bảo hiểm y tế</label>
                <input
                  type="text"
                  value={formData.healthInsuranceNumber}
                  onChange={handleChange("healthInsuranceNumber")}
                />
              </div>
            </div>
          </fieldset>

          {/* ========== VIỆC LÀM ========== */}
          <fieldset>
            <legend>Việc làm</legend>

            <div className="form-row">
              <div className={`form-group ${invalid("departmentId")}`}>
                <label>
                  Phòng ban <span className="required">*</span>
                </label>
                <select
                  value={formData.departmentId}
                  onChange={handleChange("departmentId")}
                >
                  <option value="">-- Chọn phòng ban --</option>
                  <option value="1">Human Resources</option>
                  <option value="2">Finance</option>
                  <option value="3">Information Technology</option>
                  <option value="4">Sales</option>
                  <option value="5">Marketing</option>
                  <option value="6">Manufacturing</option>
                </select>
                {errors.departmentId && (
                  <small className="error">{errors.departmentId}</small>
                )}
              </div>

              <div className={`form-group ${invalid("positionId")}`}>
                <label>
                  Vị trí <span className="required">*</span>
                </label>
                <select
                  value={formData.positionId}
                  onChange={handleChange("positionId")}
                  disabled={!formData.departmentId || loadingPositions}
                >
                  <option value="">
                    {loadingPositions ? "Đang tải..." : "-- Chọn vị trí --"}
                  </option>
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.positionName}
                    </option>
                  ))}
                </select>
                {errors.positionId && (
                  <small className="error">{errors.positionId}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("baseSalary")}`}>
                <label>
                  Mức lương cơ bản (VNĐ) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  placeholder="10000000"
                  value={formData.baseSalary}
                  onChange={handleChange("baseSalary")}
                />
                {errors.baseSalary && (
                  <small className="error">{errors.baseSalary}</small>
                )}
              </div>

              <div className={`form-group ${invalid("hireDate")}`}>
                <label>Ngày bắt đầu làm việc</label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange("hireDate")}
                />
                {errors.hireDate && (
                  <small className="error">{errors.hireDate}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("contractType")}`}>
                <label>Loại hợp đồng</label>
                <select
                  value={formData.contractType}
                  onChange={handleChange("contractType")}
                >
                  <option value="">-- Chọn --</option>
                  <option value="FULL_TIME">Toàn thời gian</option>
                  <option value="PART_TIME">Bán thời gian</option>
                  <option value="PROBATION">Thử việc</option>
                  <option value="FIXED_TERM">Có thời hạn</option>
                  <option value="INTERNSHIP">Thực tập</option>
                  <option value="INDEFINITE">Không thời hạn</option>
                </select>
                {errors.contractType && (
                  <small className="error">{errors.contractType}</small>
                )}
              </div>

              <div className={`form-group ${invalid("workSchedule")}`}>
                <label>Lịch làm việc</label>
                <select
                  value={formData.workSchedule}
                  onChange={handleChange("workSchedule")}
                >
                  <option value="">-- Chọn --</option>
                  <option value="FULL_TIME">Toàn thời gian</option>
                  <option value="PART_TIME">Bán thời gian</option>
                  <option value="MORNING_SHIFT">Ca sáng</option>
                  <option value="AFTERNOON_SHIFT">Ca chiều</option>
                  <option value="HYBRID">Linh hoạt</option>
                  <option value="REMOTE">Làm việc từ xa</option>
                </select>
                {errors.workSchedule && (
                  <small className="error">{errors.workSchedule}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ngày bắt đầu hợp đồng</label>
                <input
                  type="date"
                  value={formData.contractStartDate}
                  onChange={handleChange("contractStartDate")}
                />
              </div>

              <div className="form-group">
                <label>Ngày kết thúc hợp đồng</label>
                <input
                  type="date"
                  value={formData.contractEndDate}
                  onChange={handleChange("contractEndDate")}
                  disabled={isIndefiniteContract}
                  style={
                    isIndefiniteContract
                      ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div>
            </div>
          </fieldset>

          {/* ========== TÀI LIỆU ========== */}
          <fieldset>
            <legend>Tài liệu đính kèm</legend>
            <input
              type="file"
              onChange={handleChange("attachments")}
              multiple
            />
          </fieldset>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn light">
              Hủy
            </button>
            <button type="submit" className="btn primary">
              Thêm nhân viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormCreateModal;
