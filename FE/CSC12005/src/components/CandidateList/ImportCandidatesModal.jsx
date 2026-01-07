import React, { useState } from "react";
import { HRService } from "../../services/HRService";
import "./ImportCandidatesModal.scss";

const ImportCandidatesModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [importResult, setImportResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      setError("");
      return;
    }

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Chỉ chấp nhận file Excel (. xls, .xlsx)");
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Kích thước file không được vượt quá 5MB");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
    setImportResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Vui lòng chọn file Excel");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await HRService.importCandidates(file);

      setImportResult(result);

      // User phải tự click để tắt modal
      if (result.success && onSuccess) {
        onSuccess(result); // Gọi callback để refresh list
      }
    } catch (err) {
      console.error("Import error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========== HANDLE MANUAL CLOSE (NEW) ==========
  const handleClose = () => {
    if (importResult?.success && onSuccess) {
      onSuccess(importResult); // Ensure callback is called
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content import-candidates-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Nhập ứng viên từ file Excel</h3>
          <button className="btn-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Info Box */}
          <div className="info-box">
            <div className="info-content">
              <strong>Hướng dẫn:</strong>
              <ol>
                <li>
                  Chuẩn bị file Excel với các cột: Họ và tên, Email, Số điện
                  thoại, Giới tính, Ngày sinh, Địa chỉ, ID Vị trí
                </li>
                <li>Chọn file và nhấn "Nhập dữ liệu"</li>
                <li>Hệ thống sẽ tự động xử lý và thông báo kết quả</li>
              </ol>
            </div>
          </div>

          {/* File Upload */}
          <div className={`form-group ${error ? "has-error" : ""}`}>
            <label htmlFor="file">
              Chọn file Excel <span className="required">*</span>
            </label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file"
                accept=".xlsx,. xls"
                onChange={handleFileChange}
                disabled={loading}
              />
              {file && (
                <div className="file-info">
                  <span className="file-icon">📎</span>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              )}
            </div>
            {error && <span className="error-text">{error}</span>}
          </div>

          {/* Import Result */}
          {importResult && (
            <div
              className={`import-result ${
                importResult.success ? "success" : "error"
              }`}
            >
              <div className="result-content">
                <h4>Kết quả nhập dữ liệu</h4>
                <div className="result-stats">
                  <div className="stat success-stat">
                    <span className="stat-label">Thành công:</span>
                    <span className="stat-value">
                      {importResult.successRow} dòng
                    </span>
                  </div>
                  <div className="stat error-stat">
                    <span className="stat-label">Lỗi:</span>
                    <span className="stat-value">
                      {importResult.errorRow} dòng
                    </span>
                  </div>
                </div>

                {importResult.importErrors &&
                  importResult.importErrors.length > 0 && (
                    <div className="error-details">
                      <strong>Chi tiết lỗi:</strong>
                      <ul>
                        {importResult.importErrors.map((err, index) => (
                          <li key={index}>
                            Dòng {err.row}: {err.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* ========== SUCCESS MESSAGE (UPDATED) ========== */}
                {importResult.success && (
                  <p className="success-message">
                    Nhập dữ liệu thành công! Nhấn "Đóng" để quay lại danh sách.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="modal-footer">
            {/* ========== CLOSE BUTTON (ALWAYS ENABLED AFTER RESULT) ========== */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              {importResult ? "Đóng" : "Hủy"}
            </button>

            {/* ========== SUBMIT BUTTON (HIDE AFTER SUCCESS) ========== */}
            {!importResult && (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !file}
              >
                {loading ? "Đang xử lý..." : "Nhập dữ liệu"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportCandidatesModal;
