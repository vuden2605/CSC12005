import React from "react";
import "../Request/style.scss";
import { formatCurrencyVND } from "../../../Utils/formatCurrency";

export const SalaryDetailModal = ({ salary, onClose }) => {
  if (!salary) return null;

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("vi-VN");
  };

  const {
    employeeName,
    employeeCode,
    positionName,
    year,
    month,
    baseSalary,
    actualSalary,
    netSalary,
    grossSalary,
    lateDeduction,
    positionAllowance,
    transportAllowance,
    mealAllowance,
    socialInsurance,
    healthInsurance,
    unemploymentInsurance,
    totalInsurance,
    taxableIncome,
    personalIncomeTax,
    totalDeductions,
    status,
    approvedAt,
    paidAt,
    attendanceSummary,
  } = salary;

  const getStatusLabel = (s) => {
    if (s === "DRAFT") return "Nháp";
    if (s === "APPROVED") return "Đã duyệt";
    if (s === "PAID") return "Đã thanh toán";
    return s || "-";
  };

  const currency = (v) => formatCurrencyVND(v || 0);

  return (
    <div className="modal-overlay">
      <div className="modal-box wfh-detail-modal">
        <div className="modal-header">
          <h2>Chi tiết lương</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {/* Thông tin nhân viên */}
          <div className="detail-section">
            <h3>Thông tin nhân viên</h3>
            <div className="detail-row">
              <span className="detail-label">Nhân viên:</span>
              <span className="detail-value">
                {employeeName} ({employeeCode})
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Vị trí:</span>
              <span className="detail-value">{positionName || "-"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Thời gian:</span>
              <span className="detail-value">
                {month}/{year}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Trạng thái:</span>
              <span className="detail-value">{getStatusLabel(status)}</span>
            </div>
          </div>

          {/* Tổng quan lương */}
          <div className="detail-section">
            <h3>Tổng quan</h3>
            <div className="detail-row">
              <span className="detail-label">Lương cơ bản:</span>
              <span className="detail-value">{currency(baseSalary)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Lương thực tế:</span>
              <span className="detail-value">{currency(actualSalary)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Lương gross:</span>
              <span className="detail-value">{currency(grossSalary)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Tổng khấu trừ:</span>
              <span className="detail-value">{currency(totalDeductions)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Lương NET:</span>
              <span className="detail-value">{currency(netSalary)}</span>
            </div>
          </div>

          {/* Phụ cấp & khấu trừ đi muộn */}
          <div className="detail-section">
            <h3>Phụ cấp & Đi muộn</h3>
            <div className="detail-row">
              <span className="detail-label">Phụ cấp chức vụ:</span>
              <span className="detail-value">{currency(positionAllowance)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phụ cấp đi lại:</span>
              <span className="detail-value">{currency(transportAllowance)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phụ cấp ăn trưa:</span>
              <span className="detail-value">{currency(mealAllowance)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phạt đi muộn:</span>
              <span className="detail-value">{currency(lateDeduction)}</span>
            </div>
          </div>

          {/* Bảo hiểm & Thuế */}
          <div className="detail-section">
            <h3>Bảo hiểm & Thuế</h3>
            <div className="detail-row">
              <span className="detail-label">BHXH:</span>
              <span className="detail-value">{currency(socialInsurance)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">BHYT:</span>
              <span className="detail-value">{currency(healthInsurance)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">BHTN:</span>
              <span className="detail-value">{currency(unemploymentInsurance)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Tổng bảo hiểm:</span>
              <span className="detail-value">{currency(totalInsurance)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Thu nhập chịu thuế:</span>
              <span className="detail-value">{currency(taxableIncome)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Thuế TNCN:</span>
              <span className="detail-value">{currency(personalIncomeTax)}</span>
            </div>
          </div>

          {/* Tổng kết chấm công */}
          {attendanceSummary && (
            <div className="detail-section">
              <h3>Tổng kết chấm công</h3>
              <div className="detail-row">
                <span className="detail-label">Số ngày làm việc:</span>
                <span className="detail-value">
                  {attendanceSummary.totalWorkDays}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số ngày vắng:</span>
                <span className="detail-value">
                  {attendanceSummary.totalAbsentDays}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Số ngày đi muộn:</span>
                <span className="detail-value">
                  {attendanceSummary.totalLateDays}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Tổng giờ làm:</span>
                <span className="detail-value">
                  {attendanceSummary.totalWorkHours} giờ
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Giờ tăng ca:</span>
                <span className="detail-value">
                  {attendanceSummary.totalOvertimeHours} giờ
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Tiền tăng ca:</span>
                <span className="detail-value">
                  {currency(attendanceSummary.overtimePay)}
                </span>
              </div>
            </div>
          )}

          {/* Mốc thời gian */}
          <div className="detail-section">
            <h3>Thời gian xử lý</h3>
            <div className="detail-row">
              <span className="detail-label">Ngày duyệt:</span>
              <span className="detail-value">{formatDateTime(approvedAt)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Ngày trả lương:</span>
              <span className="detail-value">{formatDateTime(paidAt)}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn cancel" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
