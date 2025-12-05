import { useEffect, useState } from "react";
import "./style.scss";
import { PositionService } from "../../services/PositionService";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  nationalCode: "",
  taxCode: "",
  bankName: "",
  bankAccount: "",
  baseSalary: "",
  departmentId: "",
  positionId: "",
  birthDate: "",
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
  const isPhoneVN = (v) => /^[0-9]{9,11}$/.test(v);
  const isNumber = (v) => /^-?\d+(\.\d+)?$/.test(`${v}`);

  const validate = () => {
    const err = {};

    if (!formData.fullName.trim()) err.fullName = "Vui lòng nhập họ và tên";
    if (!formData.birthDate) err.birthDate = "Vui lòng chọn ngày sinh";
    if (!formData.nationalCode.trim()) err.nationalCode = "Vui lòng nhập CCCD/CMND";
    if (!formData.email.trim()) err.email = "Vui lòng nhập email";
    if (!formData.phone.trim()) err.phone = "Vui lòng nhập số điện thoại";
    if (!formData.address.trim()) err.address = "Vui lòng nhập địa chỉ";
    if (!formData.bankName) err.bankName = "Vui lòng chọn ngân hàng";
    if (!formData.bankAccount.trim()) err.bankAccount = "Vui lòng nhập số tài khoản";
    if (!formData.departmentId) err.departmentId = "Vui lòng chọn phòng ban";
    if (!formData.positionId) err.positionId = "Vui lòng chọn vị trí";
    if (!`${formData.baseSalary}`.trim()) err.baseSalary = "Vui lòng nhập lương cơ bản";
    if (!formData.taxCode.trim()) err.taxCode = "Vui lòng nhập mã số thuế";

    if (formData.email && !isEmail(formData.email)) err.email = "Email không hợp lệ";
    if (formData.phone && !isPhoneVN(formData.phone)) err.phone = "Số điện thoại 9-11 chữ số";
    if (formData.bankAccount && !isNumber(formData.bankAccount)) err.bankAccount = "Số tài khoản chỉ chứa chữ số";
    if (formData.baseSalary && (!isNumber(formData.baseSalary) || Number(formData.baseSalary) <= 0))
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
        const data = await PositionService.getByDepartmentId(formData.departmentId);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) return;

    const payload = {
      ...formData,
      departmentId: Number(formData.departmentId),
      positionId: Number(formData.positionId),
      baseSalary: Number(formData.baseSalary),
    };

    if (typeof onCreateEmp === "function") {
      onCreateEmp(payload);
    }
    console.log("payload create:", payload);
  };

  const invalid = (name) => (errors[name] ? "invalid" : "");

  return (
    <div className="modal-overlay">
      <div className="modal-content-e">
        <h3>Thêm Hồ sơ Nhân viên</h3>

        <form className="employee-form" onSubmit={handleSubmit}>
          {/* --- Thông tin cá nhân --- */}
          <fieldset>
            <legend>Thông tin cá nhân</legend>
            <div className="form-row">
              <div className={`form-group ${invalid("fullName")}`}>
                <label>Họ và tên</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                />
                {errors.fullName && <small className="error">{errors.fullName}</small>}
              </div>
              <div className={`form-group ${invalid("birthDate")}`}>
                <label>Ngày sinh</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange("birthDate")}
                />
                {errors.birthDate && <small className="error">{errors.birthDate}</small>}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("nationalCode")}`}>
                <label>CCCD/CMND</label>
                <input
                  type="text"
                  value={formData.nationalCode}
                  onChange={handleChange("nationalCode")}
                />
                {errors.nationalCode && <small className="error">{errors.nationalCode}</small>}
              </div>
              <div className={`form-group ${invalid("email")}`}>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                />
                {errors.email && <small className="error">{errors.email}</small>}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("phone")}`}>
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                />
                {errors.phone && <small className="error">{errors.phone}</small>}
              </div>
              <div className={`form-group ${invalid("address")}`}>
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={handleChange("address")}
                />
                {errors.address && <small className="error">{errors.address}</small>}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("bankName")}`}>
                <label>Tên ngân hàng</label>
                <select value={formData.bankName} onChange={handleChange("bankName")}>
                  <option value="">-- Chọn ngân hàng --</option>
                  <option>MB Bank</option>
                  <option>Vietcombank</option>
                  <option>ACB</option>
                </select>
                {errors.bankName && <small className="error">{errors.bankName}</small>}
              </div>

              <div className={`form-group ${invalid("bankAccount")}`}>
                <label>Số tài khoản</label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={handleChange("bankAccount")}
                />
                {errors.bankAccount && <small className="error">{errors.bankAccount}</small>}
              </div>
            </div>

         
          </fieldset>

          {/* --- Việc làm --- */}
          <fieldset>
            <legend>Việc làm</legend>
            <div className="form-row">
              <div className={`form-group ${invalid("departmentId")}`}>
                <label>Phòng ban</label>
                <select value={formData.departmentId} onChange={handleChange("departmentId")}>
                  <option value="">-- Chọn phòng ban --</option>
                  <option value="1">Human Resources</option>
                  <option value="2">Finance</option>
                  <option value="4">Information Technology</option>
                  <option value="5">Sales</option>
                  <option value="6">Marketing</option>
                  <option value="7">Manufacturing</option>
                </select>
                {errors.departmentId && <small className="error">{errors.departmentId}</small>}
              </div>

              <div className={`form-group ${invalid("positionId")}`}>
                <label>Vị trí</label>
                <select
                  value={formData.positionId}
                  onChange={handleChange("positionId")}
                  disabled={!formData.departmentId || loadingPositions}
                >
                  <option value="">
                    {loadingPositions ? "Đang tải vị trí..." : "-- Chọn vị trí --"}
                  </option>
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.positionName}
                    </option>
                  ))}
                </select>
                {errors.positionId && <small className="error">{errors.positionId}</small>}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("baseSalary")}`}>
                <label>Mức lương cơ bản</label>
                <input
                  type="number"
                  placeholder="VNĐ"
                  value={formData.baseSalary}
                  onChange={handleChange("baseSalary")}
                />
                {errors.baseSalary && <small className="error">{errors.baseSalary}</small>}
              </div>

              <div className={`form-group ${invalid("taxCode")}`}>
                <label>Mã số thuế</label>
                <input
                  type="text"
                  value={formData.taxCode}
                  onChange={handleChange("taxCode")}
                />
                {errors.taxCode && <small className="error">{errors.taxCode}</small>}
              </div>
            </div>
          </fieldset>

          {/* --- Tài liệu --- */}
          <fieldset>
            <legend>Tài liệu đính kèm</legend>
            <input type="file" onChange={handleChange("attachments")} />
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