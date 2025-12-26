import React from "react";

const PointExchangeDetailModal = ({
  isOpen,
  selectedRequest,
  processingId,
  getStatusBadge,
  onClose,
  onApprove,
  onReject,
  onComplete,
}) => {
  if (!isOpen || !selectedRequest) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📄 Chi tiết yêu cầu đổi điểm</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Điểm của hàng</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Tên nhân viên:</label>
                <span>{selectedRequest.employeeName || "N/A"}</span>
              </div>
              <div className="detail-item">
                <label>Mã nhân viên:</label>
                <span>{selectedRequest.employeeCode || "N/A"}</span>
              </div>
              <div className="detail-item">
                <label>Điểm sử dụng:</label>
                <span className="highlight">{selectedRequest.pointUsed || 0}</span>
              </div>
              <div className="detail-item">
                <label>Giá trị quy đổi:</label>
                <span className="highlight-value">
                  {(selectedRequest.exchangeValue || 0).toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="detail-item">
                <label>Trạng thái:</label>
                <span>{getStatusBadge(selectedRequest.status)}</span>
              </div>
              <div className="detail-item">
                <label>Ngày yêu cầu:</label>
                <span>
                  {selectedRequest.requestedAt
                    ? new Date(selectedRequest.requestedAt).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "N/A"}
                </span>
              </div>
              {selectedRequest.approvedAt && (
                <div className="detail-item">
                  <label>Ngày duyệt:</label>
                  <span>
                    {new Date(selectedRequest.approvedAt).toLocaleDateString(
                      "vi-VN",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {selectedRequest.note && (
            <div className="detail-section">
              <h3>Ghi chú</h3>
              <p className="note-text">{selectedRequest.note}</p>
            </div>
          )}
        </div>

        {selectedRequest.status === "PENDING" && (
          <div className="modal-footer">
            <button
              className="btn-reject-modal"
              onClick={onReject}
              disabled={processingId === selectedRequest.id}
            >
              ❌ Từ chối
            </button>
            <button
              className="btn-approve-modal"
              onClick={onApprove}
              disabled={processingId === selectedRequest.id}
            >
              {processingId === selectedRequest.id ? "..." : "✅ Duyệt"}
            </button>
          </div>
        )}

        {selectedRequest.status === "APPROVED" && (
          <div className="modal-footer">
            <button
              className="btn-complete-modal"
              onClick={onComplete}
              disabled={processingId === selectedRequest.id}
            >
              {processingId === selectedRequest.id ? "..." : "Đã chuyển khoản"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointExchangeDetailModal;
