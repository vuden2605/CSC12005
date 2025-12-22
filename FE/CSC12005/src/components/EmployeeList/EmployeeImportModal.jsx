import { useState } from "react";
import "./import-modal.scss";

function EmployeeImportModal({
  visible,
  onClose,
  onImport,
  loading,
  importResult,
}) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  if (!visible) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".xlsx")) {
      setError("Chỉ hỗ trợ file Excel (.xlsx)");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    if (!file) {
      setError("Vui lòng chọn file Excel");
      return;
    }
    onImport(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Thêm nhân viên từ file Excel</h3>

        <input type="file" accept=".xlsx" onChange={handleFileChange} />

        {error && <p className="error">{error}</p>}
        {importResult && (
          <div className="import-summary">
            <p>✅ Thành công: {importResult.successRow}</p>
            <p>❌ Thất bại: {importResult.errorRow}</p>
          </div>
        )}

        {importResult?.importErrors?.length > 0 && (
          <div className="import-errors">
            <h4>❌ Danh sách lỗi</h4>
            <ul>
              {importResult.importErrors.map((err, idx) => (
                <li key={idx}>{err.message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="actions">
          <button className="btn cancel" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeImportModal;
