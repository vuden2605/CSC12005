import { useState, useEffect } from "react";
import "./style.scss";
import { PositionService } from "../../services/PositionService";
import { HRService } from "../../services/HRService";
import { useAlert } from "../../context/AlertContext";

const EmployeeFormUpdateModel = ({ visible, onClose, employee, onUpdate }) => {
  if (!visible || !employee) return null;

  console.log("nhan vien update:  ", employee);

  const [positions, setPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [errors, setErrors] = useState({});

  const [formUpdate, setFormUpdate] = useState({
    fullName: employee.fullName || "",
    gender: employee.gender || "",
    email: employee.email || "",
    phone: employee.phone || "",
    birthDate: employee.birthDate || "",
    nationalCode: employee.nationalCode || "",
    taxCode: employee.taxCode || "",
    address: employee.address || "",
    emergencyContactPhone: employee.emergencyContactPhone || "",
    emergencyContactName:  employee.emergencyContactName || "",
    emergencyContactRelationship: employee. emergencyContactRelationship || "",
    placeOfBirth: employee.placeOfBirth || "",
    nationality: employee.nationality || "",
    religion: employee.religion || "",
    permanentAddress: employee.permanentAddress || "",
    maritalStatus: employee.maritalStatus || "",
    educationLevel: employee.educationLevel || "",
    major: employee. major || "",
    university: employee.university || "",
    graduationYear: employee.graduationYear || "",
    degree: employee.degree || "",
    numberOfDependents: employee.numberOfDependents || "",
    bankName: employee.bankName || "",
    bankAccount: employee.bankAccount || "",
    bankBranch: employee.bankBranch || "",
    baseSalary: employee.baseSalary || "",
    departmentId: employee.department?.id || "",
    positionId: employee.position?.id || "",
    hireDate: employee.hireDate || "",
    contractStartDate: employee.contractStartDate || "",
    contractEndDate:  employee.contractEndDate || "",
    contractType: employee.contractType || "",
    workSchedule: employee.workSchedule || "",
    socialInsuranceNumber: employee.socialInsuranceNumber || "",
    healthInsuranceNumber: employee. healthInsuranceNumber || "",
    attachments: null,
  });

  const departments = [
    { id: 1, departmentName: "Human Resources" },
    { id:  2, departmentName: "Finance" },
    { id: 3, departmentName: "Information Technology" },
    { id:  4, departmentName: "Sales" },
    { id: 5, departmentName: "Marketing" },
    { id: 6, departmentName: "Manufacturing" },
  ];

  useEffect(() => {
    const fetchPositions = async () => {
      if (! formUpdate.departmentId) {
        setPositions([]);
        setFormUpdate((prev) => ({ ...prev, positionId: "" }));
        return;
      }
      try {
        setLoadingPositions(true);
        const data = await PositionService.getByDepartmentId(
          formUpdate.departmentId
        );
        setPositions(data || []);

        const currentPositionValid = data?. some(
          (p) => p.id === formUpdate.positionId
        );
        if (!currentPositionValid) {
          setFormUpdate((prev) => ({ ...prev, positionId: "" }));
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        setPositions([]);
      } finally {
        setLoadingPositions(false);
      }
    };
    fetchPositions();
  }, [formUpdate.departmentId]);

  useEffect(() => {
    if (employee) {
      setFormUpdate({
        fullName: employee.fullName || "",
        gender: employee. gender || "",
        email: employee.email || "",
        phone: employee.phone || "",
        birthDate: employee.birthDate || "",
        nationalCode: employee.nationalCode || "",
        taxCode:  employee.taxCode || "",
        address: employee.address || "",
        emergencyContactPhone: employee. emergencyContactPhone || "",
        emergencyContactName: employee.emergencyContactName || "",
        emergencyContactRelationship: 
          employee.emergencyContactRelationship || "",
        placeOfBirth: employee.placeOfBirth || "",
        nationality: employee.nationality || "",
        religion: employee.religion || "",
        permanentAddress: employee.permanentAddress || "",
        maritalStatus: employee.maritalStatus || "",
        educationLevel: employee.educationLevel || "",
        major: employee.major || "",
        university: employee.university || "",
        graduationYear: employee. graduationYear || "",
        degree: employee.degree || "",
        numberOfDependents: employee.numberOfDependents || "",
        bankName: employee.bankName || "",
        bankAccount: employee.bankAccount || "",
        bankBranch: employee.bankBranch || "",
        baseSalary: employee.baseSalary || "",
        departmentId: employee.department?.id || "",
        positionId: employee.position?. id || "",
        hireDate: employee.hireDate || "",
        contractStartDate: employee. contractStartDate || "",
        contractEndDate: employee.contractEndDate || "",
        contractType: employee.contractType || "",
        workSchedule: employee.workSchedule || "",
        socialInsuranceNumber: employee.socialInsuranceNumber || "",
        healthInsuranceNumber: employee.healthInsuranceNumber || "",
        attachments: null,
      });
      setErrors({});
    }
  }, [employee]);

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhoneVN = (v) => /^(0|\+84)[0-9]{9}$/.test(v);
  const isNumber = (v) => /^-?\d+(\.\d+)?$/.test(`${v}`);

  // ========== VALIDATE (UPDATED - Same as Create except contractType) ==========
  const validate = () => {
    const err = {};

    // Required fields
    if (!formUpdate. fullName. trim()) err.fullName = "Vui lòng nhập họ và tên";
    if (!formUpdate.gender) err.gender = "Vui lòng chọn giới tính";
    if (!formUpdate.birthDate) err.birthDate = "Vui lòng chọn ngày sinh";
    if (!formUpdate.hireDate)
      err.hireDate = "Vui lòng chọn ngày bắt đầu làm việc"; // ✅ ADDED

    if (!formUpdate.nationalCode. trim())
      err.nationalCode = "Vui lòng nhập CCCD/CMND";
    if (! formUpdate.taxCode.trim()) err.taxCode = "Vui lòng nhập mã số thuế";
    if (!formUpdate.email.trim()) err.email = "Vui lòng nhập email";
    if (!formUpdate.phone.trim()) err.phone = "Vui lòng nhập số điện thoại";
    if (!formUpdate.address.trim()) err.address = "Vui lòng nhập địa chỉ";
    if (! formUpdate.bankName) err.bankName = "Vui lòng chọn ngân hàng";
    if (!formUpdate.bankAccount.trim())
      err.bankAccount = "Vui lòng nhập số tài khoản";
    if (!formUpdate.departmentId) err.departmentId = "Vui lòng chọn phòng ban";
    if (!formUpdate.positionId) err.positionId = "Vui lòng chọn vị trí";
    if (!formUpdate.workSchedule)
      err.workSchedule = "Vui lòng chọn lịch làm việc"; // ✅ ADDED
    // ❌ NO contractType validation (not shown in update form)

    if (! `${formUpdate.baseSalary}`.trim())
      err.baseSalary = "Vui lòng nhập lương cơ bản";

    // Format validation
    if (formUpdate.email && !isEmail(formUpdate. email))
      err.email = "Email không hợp lệ";
    if (formUpdate.phone && !isPhoneVN(formUpdate.phone))
      err.phone = "SĐT:  0xxxxxxxxx hoặc +84xxxxxxxxx";
    if (
      formUpdate.emergencyContactPhone &&
      !isPhoneVN(formUpdate. emergencyContactPhone)
    )
      err.emergencyContactPhone = "SĐT không hợp lệ";
    if (formUpdate.bankAccount && !isNumber(formUpdate.bankAccount))
      err.bankAccount = "Số tài khoản chỉ chứa chữ số";
    if (
      formUpdate.baseSalary &&
      (! isNumber(formUpdate.baseSalary) || Number(formUpdate.baseSalary) <= 0)
    )
      err.baseSalary = "Lương cơ bản phải là số dương";

    setErrors(err);
    return err;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === "file" ? e.target.files :  e.target.value;
    setFormUpdate((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const invalid = (name) => (errors[name] ?  "invalid" : "");
  const { showAlert } = useAlert();

  const isIndefiniteContract = formUpdate. contractType === "INDEFINITE";

  useEffect(() => {
    if (isIndefiniteContract) {
      setFormUpdate((prev) => ({ ...prev, contractEndDate: "" }));
    }
  }, [isIndefiniteContract]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length > 0) return;

    try {
      const requestData = {
        fullName:  formUpdate.fullName. trim(),
        gender: formUpdate.gender,
        email: formUpdate.email.trim(),
        phone: formUpdate.phone.trim(),
        address: formUpdate.address.trim(),
        birthDate: formUpdate. birthDate,
        nationalCode:  formUpdate.nationalCode.trim(),
        taxCode: formUpdate. taxCode.trim(),

        emergencyContactName: formUpdate.emergencyContactName || null,
        emergencyContactPhone:  formUpdate.emergencyContactPhone || null,
        emergencyContactRelationship:
          formUpdate. emergencyContactRelationship || null,

        placeOfBirth: formUpdate.placeOfBirth || null,
        nationality: formUpdate.nationality || null,
        religion: formUpdate.religion || null,
        permanentAddress: formUpdate.permanentAddress || null,
        maritalStatus: formUpdate. maritalStatus || null,

        educationLevel: formUpdate. educationLevel || null,
        major: formUpdate.major || null,
        university: formUpdate. university || null,
        graduationYear: formUpdate.graduationYear
          ? Number(formUpdate.graduationYear)
          : null,
        degree: formUpdate.degree || null,
        numberOfDependents: formUpdate.numberOfDependents
          ? Number(formUpdate.numberOfDependents)
          : null,

        bankName: formUpdate.bankName,
        bankAccount: formUpdate. bankAccount. trim(),
        bankBranch: formUpdate.bankBranch || null,

        baseSalary: Number(formUpdate.baseSalary),
        departmentId: Number(formUpdate.departmentId),
        positionId: Number(formUpdate.positionId),
        hireDate: formUpdate. hireDate || null,
        contractStartDate:  formUpdate.contractStartDate || null,
        contractEndDate: formUpdate.contractEndDate || null,
        contractType: formUpdate. contractType || null,
        workSchedule:  formUpdate.workSchedule || null,

        socialInsuranceNumber: formUpdate.socialInsuranceNumber || null,
        healthInsuranceNumber: formUpdate.healthInsuranceNumber || null,
      };

      Object.keys(requestData).forEach((key) => {
        if (requestData[key] === null || requestData[key] === "") {
          delete requestData[key];
        }
      });

      console.log("Data to update:", requestData);
      const data = await HRService.updateEmp(employee.id, requestData);
      console.log("user đã update", data);

      if (onUpdate) {
        onUpdate(data);
      }

      onClose();
      showAlert("success", "Cập nhật nhân viên thành công!");
    } catch (error) {
      console.error("Error updating employee:", error);
      onClose();
      showAlert("error", error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-e" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-e">
          <h3>Sửa Hồ sơ Nhân viên</h3>
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
                  value={formUpdate.fullName}
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
                  value={formUpdate.gender}
                  onChange={handleChange("gender")}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
                {errors.gender && (
                  <small className="error">{errors. gender}</small>
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
                  value={formUpdate.birthDate}
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
                  value={formUpdate. nationalCode}
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
                  value={formUpdate.email}
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
                  value={formUpdate.phone}
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
                  value={formUpdate.address}
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
                  value={formUpdate.permanentAddress}
                  onChange={handleChange("permanentAddress")}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nơi sinh</label>
                <input
                  type="text"
                  value={formUpdate.placeOfBirth}
                  onChange={handleChange("placeOfBirth")}
                />
              </div>

              <div className="form-group">
                <label>Quốc tịch</label>
                <input
                  type="text"
                  value={formUpdate.nationality}
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
                  value={formUpdate.religion}
                  onChange={handleChange("religion")}
                />
              </div>

              <div className="form-group">
                <label>Tình trạng hôn nhân</label>
                <select
                  value={formUpdate.maritalStatus}
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
                  value={formUpdate.numberOfDependents}
                  onChange={handleChange("numberOfDependents")}
                />
              </div>

              <div className={`form-group ${invalid("taxCode")}`}>
                <label>
                  Mã số thuế <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formUpdate.taxCode}
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
                  value={formUpdate.emergencyContactName}
                  onChange={handleChange("emergencyContactName")}
                />
              </div>

              <div className={`form-group ${invalid("emergencyContactPhone")}`}>
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={formUpdate.emergencyContactPhone}
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
                  value={formUpdate.emergencyContactRelationship}
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
                  value={formUpdate.educationLevel}
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
                  value={formUpdate.major}
                  onChange={handleChange("major")}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Trường đại học/cao đẳng</label>
                <input
                  type="text"
                  value={formUpdate.university}
                  onChange={handleChange("university")}
                />
              </div>

              <div className="form-group">
                <label>Năm tốt nghiệp</label>
                <input
                  type="number"
                  min="1950"
                  max="2100"
                  value={formUpdate.graduationYear}
                  onChange={handleChange("graduationYear")}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bằng cấp</label>
                <input
                  type="text"
                  value={formUpdate.degree}
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
                  value={formUpdate. bankName}
                  onChange={handleChange("bankName")}
                >
                  <option value="">-- Chọn ngân hàng --</option>
                  <option value="BIDV">BIDV</option>
                  <option value="Viettinbank">ViettinBank</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="ACB">ACB</option>
                  <option value="Techcombank">Techcombank</option>
                  <option value="MB Bank">MB Bank</option>
                  <option value="VPBank">VPBank</option>
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
                  value={formUpdate.bankAccount}
                  onChange={handleChange("bankAccount")}
                />
                {errors. bankAccount && (
                  <small className="error">{errors. bankAccount}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Chi nhánh</label>
                <input
                  type="text"
                  value={formUpdate.bankBranch}
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
                  value={formUpdate.socialInsuranceNumber}
                  onChange={handleChange("socialInsuranceNumber")}
                />
              </div>

              <div className="form-group">
                <label>Số bảo hiểm y tế</label>
                <input
                  type="text"
                  value={formUpdate.healthInsuranceNumber}
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
                  value={formUpdate.departmentId}
                  onChange={handleChange("departmentId")}
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept. id}>
                      {dept. departmentName}
                    </option>
                  ))}
                </select>
                {errors. departmentId && (
                  <small className="error">{errors.departmentId}</small>
                )}
              </div>

              <div className={`form-group ${invalid("positionId")}`}>
                <label>
                  Vị trí <span className="required">*</span>
                </label>
                <select
                  value={formUpdate.positionId}
                  onChange={handleChange("positionId")}
                  disabled={! formUpdate.departmentId || loadingPositions}
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
                  value={formUpdate.baseSalary}
                  onChange={handleChange("baseSalary")}
                />
                {errors.baseSalary && (
                  <small className="error">{errors. baseSalary}</small>
                )}
              </div>

              {/* ========== NGÀY BẮT ĐẦU LÀM VIỆC (ADDED VALIDATE) ========== */}
              <div className={`form-group ${invalid("hireDate")}`}>
                <label>
                  Ngày bắt đầu làm việc <span className="required">*</span>
                </label>
                <input
                  type="date"
                  value={formUpdate.hireDate}
                  onChange={handleChange("hireDate")}
                />
                {errors.hireDate && (
                  <small className="error">{errors.hireDate}</small>
                )}
              </div>
            </div>

            {/* ========== LỊCH LÀM VIỆC (ADDED VALIDATE) ========== */}
            <div className="form-row">
              <div className={`form-group ${invalid("workSchedule")}`}>
                <label>
                  Lịch làm việc <span className="required">*</span>
                </label>
                <select
                  value={formUpdate. workSchedule}
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
                  <small className="error">{errors. workSchedule}</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ngày bắt đầu hợp đồng</label>
                <input
                  type="date"
                  value={formUpdate.contractStartDate}
                  onChange={handleChange("contractStartDate")}
                />
              </div>

              <div className="form-group">
                <label>
                  Ngày kết thúc hợp đồng
                  {isIndefiniteContract && (
                    <small style={{ color: "#999", marginLeft: "8px" }}>
                      (Không áp dụng)
                    </small>
                  )}
                </label>
                <input
                  type="date"
                  value={formUpdate.contractEndDate}
                  onChange={handleChange("contractEndDate")}
                  disabled={isIndefiniteContract}
                  style={
                    isIndefiniteContract
                      ? { backgroundColor: "#f5f5f5", cursor:  "not-allowed" }
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
              Lưu chỉnh sửa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormUpdateModel;