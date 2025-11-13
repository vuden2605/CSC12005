import "./style.scss";

const EmployeeFormUpdateModel = ({ visible, onClose, employee }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Sửa Hồ sơ Nhân viên</h3>

        <form className="employee-form">
          {/* --- Thông tin cá nhân --- */}
          <fieldset>
            <legend>Thông tin cá nhân</legend>
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên</label>
                <input type="text" defaultValue={employee?.name} />
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                <input type="date" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số CCCD</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Email cá nhân</label>
                <input type="email" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Tên ngân hàng</label>
                <select>
                  <option>MB Bank</option>
                  <option>Vietcombank</option>
                  <option>ACB</option>
                </select>
              </div>
              <div className="form-group">
                <label>Số tài khoản</label>
                <input type="text" />
              </div>
            </div>
          </fieldset>

          {/* --- Việc làm --- */}
          <fieldset>
            <legend>Việc làm</legend>
            <div className="form-row">
              <div className="form-group">
                <label>Ngày bắt đầu làm việc</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>Phòng ban</label>
                <select>
                  <option>Phòng IT</option>
                  <option>Phòng HR</option>
                  <option>Phòng Kế toán</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vị trí</label>
                <input type="text" defaultValue={employee?.position} />
              </div>
              <div className="form-group">
                <label>Mức lương cơ bản</label>
                <input type="number" placeholder="VNĐ" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quản lý trực tiếp</label>
                <select>
                  <option>NV001</option>
                  <option>NV002</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mã số thuế</label>
                <input type="text" />
              </div>
            </div>
          </fieldset>

          {/* --- Tài liệu --- */}
          <fieldset>
            <legend>Tài liệu đính kèm</legend>
            <input type="file" />
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
