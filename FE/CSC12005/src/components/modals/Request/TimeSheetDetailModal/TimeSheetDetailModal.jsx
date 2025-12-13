import React, { useState, useEffect } from "react";
import { EmployeeService } from "../../../../services/EmployeeService";
import "../style.scss";

export const TimeSheetDetailModal = ({ requestId, onClose }) => {
  const [timeSheetDetail, setTimeSheetDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeSheetDetail = async () => {
      try {
        setLoading(true);
        const response = await EmployeeService.getTimeSheetRequestDetail(requestId);
        setTimeSheetDetail(response);
      } catch (err) {
        console.error("Error fetching TimeSheet detail:", err);
        setError(err.message || "Không thể tải chi tiết yêu cầu");
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchTimeSheetDetail();
    }
  }, [requestId]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const getStatusText = (status) => {
    const statusMap = {
      "PENDING": "Chờ duyệt",
      "APPROVED": "Đã duyệt",
      "REJECTED": "Từ chối",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "APPROVED":
        return "status-approved";
      case "REJECTED":
        return "status-waiting";
      default:
        return "";
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box wfh-detail-modal">
        <div className="modal-header">
          <h2>Chi tiết yêu cầu Chấm công</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {loading && (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
            <p>Lỗi: {error}</p>
          </div>
        )}

        {!loading && !error && timeSheetDetail && (
          <div className="modal-content">
            {/* Thông tin yêu cầu */}
            <div className="detail-section">
              <h3>Thông tin yêu cầu</h3>
              <div className="detail-row">
                <span className="detail-label">Loại yêu cầu:</span>
                <span className="detail-value">Chấm công</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Trạng thái:</span>
                <span className={`status-badge ${getStatusClass(timeSheetDetail.status)}`}>
                  {getStatusText(timeSheetDetail.status)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Lý do:</span>
                <span className="detail-value">{timeSheetDetail.reason || "-"}</span>
              </div>
            </div>

            {/* Thông tin thời gian */}
            <div className="detail-section">
              <h3>Thông tin thời gian</h3>
              <div className="detail-row">
                <span className="detail-label">Ngày làm việc:</span>
                <span className="detail-value">{formatDate(timeSheetDetail.workDate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Giờ vào mới:</span>
                <span className="detail-value">{timeSheetDetail.checkInNew || "-"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Giờ ra mới:</span>
                <span className="detail-value">{timeSheetDetail.checkOutNew || "-"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ngày tạo:</span>
                <span className="detail-value">{formatDateTime(timeSheetDetail.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Cập nhật lần cuối:</span>
                <span className="detail-value">{formatDateTime(timeSheetDetail.updatedAt)}</span>
              </div>
            </div>

            {/* Thông tin nhân viên */}
            {timeSheetDetail.employee && (
              <div className="detail-section">
                <h3>Thông tin nhân viên</h3>
                <div className="detail-row">
                  <span className="detail-label">Mã nhân viên:</span>
                  <span className="detail-value">{timeSheetDetail.employee.employeeCode}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tên nhân viên:</span>
                  <span className="detail-value">{timeSheetDetail.employee.fullName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{timeSheetDetail.employee.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Điện thoại:</span>
                  <span className="detail-value">{timeSheetDetail.employee.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phòng ban:</span>
                  <span className="detail-value">
                    {timeSheetDetail.employee.department?.departmentName || "-"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Chức vụ:</span>
                  <span className="detail-value">
                    {timeSheetDetail.employee.position?.positionName || "-"}
                  </span>
                </div>
              </div>
            )}

            {/* File đính kèm */}
            {timeSheetDetail.requestAttachment && (
              <div className="detail-section">
                <h3>File đính kèm</h3>
                <div className="attachment-container">
                  <a
                    href={timeSheetDetail.requestAttachment}
                    target="_blank"
                    rel="noreferrer"
                    className="attachment-link"
                  >
                    📎 {timeSheetDetail.requestAttachment.split('/').pop()}
                  </a>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button className="btn cancel" onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
