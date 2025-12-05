import React, { useState, useEffect } from "react";
import { EmployeeService } from "../../../../../services/EmployeeService";
import "./style.scss";
import mbLogo from "../../../../../assets/images/mbbank-logo.png"; 

export const SalaryInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountName: "",
    branch: "",
    accountNumber: "",
    logo: mbLogo,
  });

  useEffect(() => {
    const fetchSalaryInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const employeeData = await EmployeeService.getCurrentUser();
        
        // Map dữ liệu từ API vào state
        setBankInfo({
          bankName: employeeData.bankName || "",
          accountName: employeeData.fullName || "",
          branch: "", // Không có trong API response, có thể để trống hoặc thêm sau
          accountNumber: employeeData.bankAccount || "",
          logo: mbLogo, // Giữ logo mặc định
        });
      } catch (err) {
        console.error("Error fetching salary info:", err);
        setError(err.message || "Không thể tải thông tin tài chính");
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryInfo();
  }, []);

  const handleEdit = () => {
    alert("Chức năng chỉnh sửa tài khoản ngân hàng sẽ được thêm sau!");
  };

  if (loading) {
    return (
      <div className="salary-info">
        <div className="salary-card">
          <h2>Tài khoản ngân hàng của tôi</h2>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="salary-info">
        <div className="salary-card">
          <h2>Tài khoản ngân hàng của tôi</h2>
          <p style={{ color: "red" }}>Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="salary-info">
      <div className="salary-card">
        <h2>Tài khoản ngân hàng của tôi</h2>

        <div className="bank-info">
          <div className="bank-logo">
            <img src={bankInfo.logo} alt="Bank Logo" />
          </div>

          <div className="bank-details">
            <div className="bank-name">{bankInfo.bankName}</div>
            <div className="bank-account">
              <span className="label">Họ và tên:</span>
              <span className="value">{bankInfo.accountName}</span>
            </div>
            {bankInfo.branch && (
              <div className="bank-branch">
                <span className="label">Chi nhánh:</span>
                <span className="value">{bankInfo.branch}</span>
              </div>
            )}
            {bankInfo.accountNumber && (
              <div className="bank-number">
                <span className="label">Số tài khoản:</span>
                <span className="value">{bankInfo.accountNumber}</span>
              </div>
            )}
          </div>
        </div>          
      </div>
    </div>
  );
};
