import React, { useState, useEffect } from "react";
import { EmployeeService } from "../../../../services/EmployeeService";
import { ManagerService } from "../../../../services/ManagerService";
import { useAlert } from "../../../../context/AlertContext";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";
import "../style.scss";

export const LeaveDetailModal = ({ requestId, onClose, isManager, onSuccess }) => {
  const [leaveDetail, setLeaveDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAlert } = useAlert();
  const [confirmState, setConfirmState] = useState({ isOpen: false, action: null });
  useEffect(() => {
    const fetchLeaveDetail = async () => {
      try {
        setLoading(true);
        const response = await EmployeeService.getRequestDetail(requestId, "Leave");
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
    setConfirmState({ isOpen: true, action: "approve" });
  };

  const handleConfirmApprove = async () => {
    try {
      setLoading(true);
      await ManagerService.approveRequest(requestId);
      showAlert("success", "Đã duyệt yêu cầu nghỉ phép");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Duyệt yêu cầu thất bại");
    } finally {
      setLoading(false);
      setConfirmState({ isOpen: false, action: null });
    }
  };

  const handleReject = async () => {
    setConfirmState({ isOpen: true, action: "reject" });
  };

  const handleConfirmReject = async () => {
    try {
      setLoading(true);
      await ManagerService.rejectRequest(requestId, "Leave");
      showAlert("success", "Đã từ chối yêu cầu nghỉ phép");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Từ chối yêu cầu thất bại");
    } finally {
      setLoading(false);
      setConfirmState({ isOpen: false, action: null });
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

  const mapLeaveReason = (reason) => {
    if (!reason) return "-";

    const reasonMap = {
      SICK_LEAVE: "Nghỉ ốm",
      ANNUAL_LEAVE: "Nghỉ phép",
      MATERNITY_LEAVE: "Nghỉ thai sản",
      PERSONAL_LEAVE: "Nghỉ việc riêng",
    };

    return reasonMap[reason] || reason;
  };

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
                <span className="detail-value">{mapLeaveReason(leaveDetail.reason)}</span>
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
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={
          confirmState.action === "approve"
            ? "Xác nhận duyệt yêu cầu"
            : "Xác nhận từ chối yêu cầu"
        }
        message={
          confirmState.action === "approve"
            ? "Bạn chắc chắn muốn duyệt yêu cầu này?"
            : "Bạn chắc chắn muốn từ chối yêu cầu này?"
        }
        type={confirmState.action === "reject" ? "danger" : "info"}
        onConfirm={
          confirmState.action === "approve"
            ? handleConfirmApprove
            : handleConfirmReject
        }
        onCancel={() => setConfirmState({ isOpen: false, action: null })}
        loading={loading}
      />
     </div>
  );
};