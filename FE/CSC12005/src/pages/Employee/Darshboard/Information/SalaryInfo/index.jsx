import React from "react";
import "./style.scss";
import { EditButton } from "../../../../../components/EditButton/EditButton";
import mbLogo from "../../../../../assets/images/mbbank-logo.png"; // 🧩 bạn đổi đường dẫn tùy thư mục ảnh của bạn

export const SalaryInfo = () => {
  const bankInfo = {
    bankName: "MB – NHTMCP Quân Đội",
    accountName: "Nguyễn Quang Vũ",
    branch: "HCM",
    accountNumber: "1234 5678 9999", // nếu bạn muốn thêm số TK
    logo: mbLogo,
  };

  const handleEdit = () => {
    alert("Chức năng chỉnh sửa tài khoản ngân hàng sẽ được thêm sau!");
  };

  return (
    <div className="salary-info">
      <div className="salary-card">
        <h2>Tài khoản ngân hàng của tôi</h2>

        <div className="bank-info">
          <div className="bank-logo">
            <img src={bankInfo.logo} alt="MB Bank Logo" />
          </div>

          <div className="bank-details">
            <div className="bank-name">{bankInfo.bankName}</div>
            <div className="bank-account">
              <span className="label">Họ và tên:</span>
              <span className="value">{bankInfo.accountName}</span>
            </div>
            <div className="bank-branch">
              <span className="label">Chi nhánh:</span>
              <span className="value">{bankInfo.branch}</span>
            </div>
            {bankInfo.accountNumber && (
              <div className="bank-number">
                <span className="label">Số tài khoản:</span>
                <span className="value">{bankInfo.accountNumber}</span>
              </div>
            )}
          </div>
        </div>

          <EditButton label="Sửa thông tin" onClick={handleEdit} />
      </div>
    </div>
  );
};
