import { useState, useEffect } from "react";
import "./style.scss";
import { PositionService } from "../../services/PositionService";
import { HRService } from "../../services/HRService";

const EmployeeFormUpdateModel = ({ visible, onClose, employee, onUpdate }) => {
  if (!visible || ! employee) return null;

  console.log("nhan vien update: ", employee);
  
  const [positions, setPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [errors, setErrors] = useState({});

  const [formUpdate, setFormUpdate] = useState({
    fullName: employee.fullName || "",
    email: employee.email || "",
    phone: employee.phone || "",
    address: employee. address || "",
    nationalCode: employee.nationalCode || "",
    taxCode: employee.taxCode || "",
    bankName: employee.bankName || "",
    bankAccount: employee.bankAccount || "",
    baseSalary: employee.baseSalary || "",
    departmentId: employee. department?.id || "",
    positionId: employee.position?.id || "",
    birthDate: employee.birthDate || "",
    attachments: null,
  });

  const departments=[
          { id: 1, departmentName: "Human Resources" },
          { id: 2, departmentName: "Finance" },
          { id: 4, departmentName: "Information Technology" },
          { id: 5, departmentName: "Sales" },
          { id: 6, departmentName: "Marketing" },
          { id: 7, departmentName: "Manufacturing" },
        ];
  
  useEffect(() => {
    const fetchPositions = async () => {
      if (!formUpdate.departmentId) {
        setPositions([]);
        setFormUpdate((prev) => ({ ...prev, positionId: "" }));
        return;
      }
      try {
        setLoadingPositions(true);
        const data = await PositionService.getByDepartmentId(formUpdate. departmentId);
        setPositions(data || []);
        
        const currentPositionValid = data?.some(p => p.id === formUpdate.positionId);
        if (! currentPositionValid) {
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
        email: employee.email || "",
        phone: employee.phone || "",
        address: employee.address || "",
        nationalCode: employee.nationalCode || "",
        taxCode: employee.taxCode || "",
        bankName: employee.bankName || "",
        bankAccount: employee.bankAccount || "",
        baseSalary: employee.baseSalary || "",
        departmentId: employee.department?. id || "",
        positionId: employee.position?.id || "",
        birthDate: employee.birthDate || "",
        attachments: null,
      });
      setErrors({});
    }
  }, [employee]);

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhoneVN = (v) => /^[0-9]{9,11}$/.test(v);
  const isNumber = (v) => /^-?\d+(\.\d+)?$/.test(`${v}`);

  const validate = () => {
    const err = {};

    if (!formUpdate. fullName. trim()) err.fullName = "Vui lòng nhập họ và tên";
    if (!formUpdate.birthDate) err.birthDate = "Vui lòng chọn ngày sinh";
    if (!formUpdate.nationalCode. trim()) err.nationalCode = "Vui lòng nhập CCCD/CMND";
    if (! formUpdate.email.trim()) err.email = "Vui lòng nhập email";
    if (!formUpdate.phone.trim()) err.phone = "Vui lòng nhập số điện thoại";
    if (!formUpdate.address.trim()) err.address = "Vui lòng nhập địa chỉ";
    if (!formUpdate.bankName) err.bankName = "Vui lòng chọn ngân hàng";
    if (!formUpdate.bankAccount.trim()) err.bankAccount = "Vui lòng nhập số tài khoản";
    if (!formUpdate. departmentId) err.departmentId = "Vui lòng chọn phòng ban";
    if (!formUpdate.positionId) err.positionId = "Vui lòng chọn vị trí";
    if (!`${formUpdate.baseSalary}`.trim()) err.baseSalary = "Vui lòng nhập lương cơ bản";
    if (!formUpdate.taxCode.trim()) err.taxCode = "Vui lòng nhập mã số thuế";

    if (formUpdate.email && !isEmail(formUpdate. email)) err.email = "Email không hợp lệ";
    if (formUpdate.phone && !isPhoneVN(formUpdate.phone)) err.phone = "Số điện thoại 9-11 chữ số";
    if (formUpdate.bankAccount && !isNumber(formUpdate. bankAccount)) 
      err.bankAccount = "Số tài khoản chỉ chứa chữ số";
    if (formUpdate.baseSalary && (! isNumber(formUpdate.baseSalary) || Number(formUpdate.baseSalary) <= 0))
      err.baseSalary = "Lương cơ bản phải là số dương";

    setErrors(err);
    return err;
  };

  // setstate
  const handleChange = (field) => (e) => {
    const value = e.target.type === "file" ? e.target.files : e.target.value;
    setFormUpdate((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const invalid = (name) => (errors[name] ?  "invalid" : "");

  //    submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate trước khi submit
    const err = validate();
    if (Object.keys(err).length > 0) return;

    try {
      // convert data 
      const requestData = {
        fullName: formUpdate.fullName.trim(),
        email: formUpdate.email.trim(),
        phone: formUpdate.phone.trim(),
        address: formUpdate.address.trim(),
        birthDate: formUpdate.birthDate,
        nationalCode: formUpdate. nationalCode.trim(),
        taxCode: formUpdate.taxCode. trim(),
        bankName: formUpdate.bankName,
        bankAccount: formUpdate. bankAccount.trim(),
        baseSalary: Number(formUpdate.baseSalary),
        departmentId: Number(formUpdate.departmentId),
        positionId: Number(formUpdate.positionId),
      };

      console.log("Data to update:", requestData);
      const data = await HRService. updateEmp(employee.id, requestData);
      console.log("user đã update", data);

      if (onUpdate) {
        onUpdate(data);
      }

      onClose();
    } catch (error) {
      console.error("Error updating employee:", error);
      alert(error. message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-e">
        <h3>Sửa Hồ sơ Nhân viên</h3>

        <form className="employee-form" onSubmit={handleSubmit}>
          {/* --- Thông tin cá nhân --- */}
          <fieldset>
            <legend>Thông tin cá nhân</legend>
            <div className="form-row">
              <div className={`form-group ${invalid("fullName")}`}>
                <label>Họ và tên</label>
                <input
                  type="text"
                  value={formUpdate.fullName}
                  onChange={handleChange("fullName")}
                />
                {errors.fullName && <small className="error">{errors.fullName}</small>}
              </div>
              <div className={`form-group ${invalid("birthDate")}`}>
                <label>Ngày sinh</label>
                <input
                  type="date"
                  value={formUpdate.birthDate}
                  onChange={handleChange("birthDate")}
                />
                {errors.birthDate && <small className="error">{errors.birthDate}</small>}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("nationalCode")}`}>
                <label>Số CCCD</label>
                <input
                  type="text"
                  value={formUpdate.nationalCode}
                  onChange={handleChange("nationalCode")}
                />
                {errors.nationalCode && <small className="error">{errors. nationalCode}</small>}
              </div>
              <div className={`form-group ${invalid("email")}`}>
                <label>Email cá nhân</label>
                <input
                  type="email"
                  value={formUpdate.email}
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
                  value={formUpdate.phone}
                  onChange={handleChange("phone")}
                />
                {errors.phone && <small className="error">{errors.phone}</small>}
              </div>
              <div className={`form-group ${invalid("address")}`}>
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={formUpdate.address}
                  onChange={handleChange("address")}
                />
                {errors.address && <small className="error">{errors.address}</small>}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("bankName")}`}>
                <label>Tên ngân hàng</label>
                <select
                  value={formUpdate. bankName}
                  onChange={handleChange("bankName")}
                >
                  <option value="">-- Chọn ngân hàng --</option>
                  <option value="MB Bank">MB Bank</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="ACB">ACB</option>
                  <option value="Techcombank">Techcombank</option>
                  <option value="VPBank">VPBank</option>
                </select>
                {errors.bankName && <small className="error">{errors.bankName}</small>}
              </div>

              <div className={`form-group ${invalid("bankAccount")}`}>
                <label>Số tài khoản</label>
                <input
                  type="text"
                  value={formUpdate.bankAccount}
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
                <select
                  value={formUpdate.departmentId}
                  onChange={handleChange("departmentId")}
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
                {errors.departmentId && <small className="error">{errors.departmentId}</small>}
              </div>
              <div className={`form-group ${invalid("positionId")}`}>
                <label>Vị trí</label>
                <select
                  value={formUpdate.positionId}
                  onChange={handleChange("positionId")}
                  disabled={! formUpdate.departmentId || loadingPositions}
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
                {errors.positionId && <small className="error">{errors. positionId}</small>}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${invalid("baseSalary")}`}>
                <label>Mức lương cơ bản</label>
                <input
                  type="number"
                  placeholder="VNĐ"
                  value={formUpdate.baseSalary}
                  onChange={handleChange("baseSalary")}
                />
                {errors.baseSalary && <small className="error">{errors.baseSalary}</small>}
              </div>
              <div className={`form-group ${invalid("taxCode")}`}>
                <label>Mã số thuế</label>
                <input
                  type="text"
                  value={formUpdate.taxCode}
                  onChange={handleChange("taxCode")}
                />
                {errors.taxCode && <small className="error">{errors. taxCode}</small>}
              </div>
            </div>
          </fieldset>

          {/* --- Tài liệu --- */}
          <fieldset>
            <legend>Tài liệu đính kèm</legend>
            <input
              type="file"
              onChange={handleChange("attachments")}
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