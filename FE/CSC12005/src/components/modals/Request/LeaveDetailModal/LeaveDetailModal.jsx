import React, { useState, useEffect } from "react";
import { EmployeeService } from "../../../../services/EmployeeService";
import { ManagerService } from "../../../../services/ManagerService";
import "../style.scss";

export const LeaveDetailModal = ({ requestId, onClose, isManager }) => {
  const [leaveDetail, setLeaveDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchLeaveDetail = async () => {
      try {
        setLoading(true);
        const response = await EmployeeService.getLeaveRequestDetail(requestId);
        setLeaveDetail(response);
      } catch (err) {
        console.error("Error fetching Leave detail:", err);
        setError(err.message || "Không thể tải chi tiết yêu cầu");
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchLeaveDetail();
    }
  }, [requestId]);

  // ===== ACTIONS =====
  const handleApprove = async () => {
    try {
      setLoading(true);
      await ManagerService.approveLeaveRequest(requestId);
      alert("Đã duyệt yêu cầu nghỉ phép");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Duyệt yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const ok = window.confirm("Bạn chắc chắn muốn từ chối yêu cầu này?");
    if (!ok) return;

    try {
      setLoading(true);
      await ManagerService.rejectLeaveRequest(requestId);
      alert("Đã từ chối yêu cầu nghỉ phép");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Từ chối yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ===== HELPERS =====
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("vi-VN") : "-";

  const formatDateTime = (dateString) =>
    dateString ? new Date(dateString).toLocaleString("vi-VN") : "-";

  const getFileName = (url) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return decodeURIComponent(pathname.split("/").pop() || "file");
    } catch {
      return url.split("/").pop() || "file";
    }
  };

  const handleDownload = async (fileKey) => {
    try {
      const url = await EmployeeService.downloadFile(fileKey);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error downloading file:", err);
      alert(err.message || "Lỗi khi tải file");
    }
  };

  const getStatusText = (status) => {
    const map = {
      PENDING: "Chờ duyệt",
      APPROVED: "Đã duyệt",
      REJECTED: "Từ chối",
    };
    return map[status] || status;
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

  const isFinalStatus =
    leaveDetail?.status === "APPROVED" ||
    leaveDetail?.status === "REJECTED";

  // ===== RENDER =====
  return (
    <div className="modal-overlay">
      <div className="modal-box wfh-detail-modal">
        <div className="modal-header">
          <h2>Chi tiết yêu cầu Nghỉ phép</h2>
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

        {!loading && !error && leaveDetail && (
          <div className="modal-content">

            {/* ===== THÔNG TIN YÊU CẦU ===== */}
            <div className="detail-section">
              <h3>Thông tin yêu cầu</h3>

              <div className="detail-row">
                <span className="detail-label">Loại yêu cầu:</span>
                <span className="detail-value">Nghỉ phép</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Trạng thái:</span>
                <span
                  className={`status-badge ${getStatusClass(leaveDetail.status)}`}
                >
                  {getStatusText(leaveDetail.status)}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Lý do:</span>
                <span className="detail-value">{leaveDetail.reason || "-"}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Tệp đính kèm:</span>
                <span className="detail-value">
                  {leaveDetail.requestAttachment ? (
                    <button
                      onClick={() => handleDownload(leaveDetail.requestAttachment)}
                      className="attachment-link"
                      title={getFileName(leaveDetail.requestAttachment)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      📎 {getFileName(leaveDetail.requestAttachment)}
                    </button>
                  ) : (
                    "-"
                  )}
                </span>
              </div>
            </div>

            {/* ===== THỜI GIAN ===== */}
            <div className="detail-section">
              <h3>Thông tin thời gian</h3>

              <div className="detail-row">
                <span className="detail-label">Ngày bắt đầu:</span>
                <span className="detail-value">
                  {formatDate(leaveDetail.startDate)}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Ngày kết thúc:</span>
                <span className="detail-value">
                  {formatDate(leaveDetail.endDate)}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Ngày tạo:</span>
                <span className="detail-value">
                  {formatDateTime(leaveDetail.createdAt)}
                </span>
              </div>
            </div>

            {/* ===== THÔNG TIN NHÂN VIÊN ===== */}
            {leaveDetail.employee && (
              <div className="detail-section">
                <h3>Thông tin nhân viên</h3>

                <div className="detail-row">
                  <span className="detail-label">Mã nhân viên:</span>
                  <span className="detail-value">
                    {leaveDetail.employee.employeeCode}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Tên nhân viên:</span>
                  <span className="detail-value">
                    {leaveDetail.employee.fullName}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">
                    {leaveDetail.employee.email}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Phòng ban:</span>
                  <span className="detail-value">
                    {leaveDetail.employee.department?.departmentName || "-"}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Chức vụ:</span>
                  <span className="detail-value">
                    {leaveDetail.employee.position?.positionName || "-"}
                  </span>
                </div>
              </div>
            )}

            {/* ===== FOOTER ===== */}
            <div className="modal-footer">
              <button className="btn cancel" onClick={onClose}>
                Đóng
              </button>

              {isManager && !isFinalStatus && (
                <>
                  <button className="btn danger" onClick={handleReject}>
                    Từ chối
                  </button>
                  <button className="btn primary" onClick={handleApprove}>
                    Duyệt
                  </button>
                </>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
