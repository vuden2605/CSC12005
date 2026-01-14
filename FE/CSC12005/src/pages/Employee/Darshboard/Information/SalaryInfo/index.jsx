import React, { useState, useEffect } from "react";
import { EmployeeService } from "../../../../../services/EmployeeService";
import { formatCurrencyVND } from "../../../../../Utils/formatCurrency";
import "./style.scss";
import acbLogo from "../../../../../assets/images/ACB.png";
import vcbLogo from "../../../../../assets/images/VIETCOMBANK.png";
import vtbLogo from "../../../../../assets/images/VIETTINBANK.png";
import bidvLogo from "../../../../../assets/images/BIDV.png";

export const SalaryInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bankLogos = {
    ACB: acbLogo,
    Vietcombank: vcbLogo,
    Viettinbank: vtbLogo,
    BIDV: bidvLogo,
  };
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountName: "",
    branch: "",
    accountNumber: "",
    logo: acbLogo,
  });

  const [salaryInfo, setSalaryInfo] = useState({
    baseSalary: 0,
    salaryRangeMin: 0,
    salaryRangeMax: 0,
  });

  useEffect(() => {
    const fetchSalaryInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const employeeData = await EmployeeService.getCurrentUser();

        // Map dữ liệu ngân hàng
        setBankInfo({
          bankName: employeeData.bankName || "",
          accountName: employeeData.fullName || "",
          branch: employeeData.bankBranch || "",
          accountNumber: employeeData.bankAccount || "",
          logo: bankLogos[employeeData.bankName] || mbLogo,
        });

        // Map thông tin lương cơ bản và dải lương từ vị trí
        setSalaryInfo({
          baseSalary: employeeData.baseSalary || 0,
          salaryRangeMin: employeeData.position?.salaryRangeMin || 0,
          salaryRangeMax: employeeData.position?.salaryRangeMax || 0,
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
        <h2>Thông tin tài chính</h2>

        <div className="bank-info">
          <div className="bank-logo">
            <img src={bankInfo.logo} alt="Bank Logo" />
          </div>

          <div className="bank-details">
            <div className="bank-name">{bankInfo.bankName}</div>

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

        <div className="salary-summary">
          <div className="salary-item">
            <span className="label">Lương cơ bản</span>
            <span className="value">
              {formatCurrencyVND(salaryInfo.baseSalary)}
            </span>
          </div>
          {(salaryInfo.salaryRangeMin || salaryInfo.salaryRangeMax) && (
            <div className="salary-item">
              <span className="label">Khung lương vị trí</span>
              <span className="value">
                {formatCurrencyVND(salaryInfo.salaryRangeMin)} -{" "}
                {formatCurrencyVND(salaryInfo.salaryRangeMax)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
