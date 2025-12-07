import React, { useState } from "react";
import { EmployeeService } from "../../../../services/EmployeeService";
import '../style.scss';

export const AttendanceModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    workDate: "",
    checkInNew: "",
    checkOutNew: "",
    reason: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) {
      setFile(null);
      return;
    }

    // Cho phép PDF và các loại ảnh phổ biến
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp"
    ];

    if (!allowedTypes.includes(f.type)) {
      setErrors({ ...errors, file: "Chỉ chấp nhận file PDF hoặc ảnh (JPG, PNG, GIF, WEBP)" });
      setFile(null);
      return;
    }
    
    // Giới hạn 10MB
    const maxSize = 10 * 1024 * 1024;
    if (f.size > maxSize) {
      const fileSizeMB = (f.size / (1024 * 1024)).toFixed(2);
      setErrors({ ...errors, file: `File quá lớn (${fileSizeMB}MB). Kích thước tối đa: 10MB` });
      setFile(null);
      return;
    }

    setFile(f);
    setErrors({ ...errors, file: "" });
  };

  const validate = () => {
    let newErr = {};
    if (!form.workDate) newErr.workDate = "Hãy chọn ngày";
    if (!form.checkInNew) newErr.checkInNew = "Hãy nhập giờ vào";
    if (!form.checkOutNew) newErr.checkOutNew = "Hãy nhập giờ ra";
    if (form.checkInNew && form.checkOutNew && form.checkInNew >= form.checkOutNew) {
      newErr.checkOutNew = "Giờ ra phải sau giờ vào";
    }
    if (!form.reason.trim()) newErr.reason = "Hãy nhập lý do";
    if (!file) newErr.file = "Hãy chọn file minh chứng";

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append("workDate", form.workDate);
      formData.append("checkInNew", form.checkInNew);
      formData.append("checkOutNew", form.checkOutNew);
      formData.append("reason", form.reason);
      if (file) {
        formData.append("file", file);
      }

      // Gọi API để tạo timesheet request
      await EmployeeService.createTimesheetRequest(formData);

      // Gọi callback onSuccess nếu có để refresh danh sách
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Error creating timesheet request:", error);

      let errorMessage = "Không thể tạo yêu cầu. Vui lòng thử lại.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 413 || error.message.includes("Maximum upload size")) {
        errorMessage = "File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.";
      }

      setErrors({ ...errors, submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Tạo yêu cầu Timesheet</h2>

        <label>Ngày</label>
        <input
          type="date"
          value={form.workDate}
          onChange={(e) => setForm({ ...form, workDate: e.target.value })}
          disabled={loading}
        />
        {errors.workDate && <p className="error">{errors.workDate}</p>}

        <label>Giờ vào</label>
        <input
          type="time"
          value={form.checkInNew}
          onChange={(e) => setForm({ ...form, checkInNew: e.target.value })}
          disabled={loading}
        />
        {errors.checkInNew && <p className="error">{errors.checkInNew}</p>}

        <label>Giờ ra</label>
        <input
          type="time"
          value={form.checkOutNew}
          onChange={(e) => setForm({ ...form, checkOutNew: e.target.value })}
          disabled={loading}
        />
        {errors.checkOutNew && <p className="error">{errors.checkOutNew}</p>}

        <label>Lý do</label>
        <textarea
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          disabled={loading}
        />
        {errors.reason && <p className="error">{errors.reason}</p>}

        <label>File minh chứng (PDF hoặc ảnh: JPG, PNG, GIF, WEBP, tối đa 10MB)</label>
        <input
          type="file"
          accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFile}
          disabled={loading}
        />
        {file && (
          <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Đã chọn: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
        {errors.file && <p className="error">{errors.file}</p>}

        {errors.submit && <p className="error" style={{ marginTop: "10px" }}>{errors.submit}</p>}

        <div className="btn-row">
          <button 
            className="btn cancel" 
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button 
            className="btn confirm" 
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Gửi yêu cầu"}
          </button>
        </div>
      </div>
    </div>
  );
};
