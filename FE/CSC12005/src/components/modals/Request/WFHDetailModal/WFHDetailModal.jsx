import React, { useState, useEffect } from "react";
import { EmployeeService } from "../../../../services/EmployeeService";
import "../style.scss";

export const WFHDetailModal = ({ requestId, onClose }) => {
  const [wfhDetail, setWfhDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWFHDetail = async () => {
      try {
        setLoading(true);
        const response = await EmployeeService.getWFHRequestDetail(requestId);
        setWfhDetail(response);
      } catch (err) {
        console.error("Error fetching WFH detail:", err);
        setError(err.message || "Không thể tải chi tiết yêu cầu");
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchWFHDetail();
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
          <h2>Chi tiết yêu cầu Làm việc tại nhà</h2>
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

        {!loading && !error && wfhDetail && (
          <div className="modal-content">
            {/* Thông tin yêu cầu */}
            <div className="detail-section">
              <h3>Thông tin yêu cầu</h3>
              <div className="detail-row">
                <span className="detail-label">Loại yêu cầu:</span>
                <span className="detail-value">Làm việc tại nhà</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Trạng thái:</span>
                <span className={`status-badge ${getStatusClass(wfhDetail.status)}`}>
                  {getStatusText(wfhDetail.status)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Lý do:</span>
                <span className="detail-value">{wfhDetail.reason || "-"}</span>
              </div>
            </div>

            {/* Thông tin thời gian */}
            <div className="detail-section">
              <h3>Thông tin thời gian</h3>
              <div className="detail-row">
                <span className="detail-label">Ngày bắt đầu:</span>
                <span className="detail-value">{formatDate(wfhDetail.startDate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ngày kết thúc:</span>
                <span className="detail-value">{formatDate(wfhDetail.endDate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ngày tạo:</span>
                <span className="detail-value">{formatDateTime(wfhDetail.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Cập nhật lần cuối:</span>
                <span className="detail-value">{formatDateTime(wfhDetail.updatedAt)}</span>
              </div>
            </div>

            {/* Thông tin nhân viên */}
            {wfhDetail.employee && (
              <div className="detail-section">
                <h3>Thông tin nhân viên</h3>
                <div className="detail-row">
                  <span className="detail-label">Mã nhân viên:</span>
                  <span className="detail-value">{wfhDetail.employee.employeeCode}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tên nhân viên:</span>
                  <span className="detail-value">{wfhDetail.employee.fullName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{wfhDetail.employee.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Điện thoại:</span>
                  <span className="detail-value">{wfhDetail.employee.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phòng ban:</span>
                  <span className="detail-value">
                    {wfhDetail.employee.department?.departmentName || "-"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Chức vụ:</span>
                  <span className="detail-value">
                    {wfhDetail.employee.position?.positionName || "-"}
                  </span>
                </div>
              </div>
            )}

            {/* File đính kèm */}
            {wfhDetail.requestAttachment && (
              <div className="detail-section">
                <h3>File đính kèm</h3>
                <div className="attachment-container">
                  <a
                    href={wfhDetail.requestAttachment}
                    target="_blank"
                    rel="noreferrer"
                    className="attachment-link"
                  >
                    📎 {wfhDetail.requestAttachment.split('/').pop()}
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
