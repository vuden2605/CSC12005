import React, { useState } from "react";
import { EmployeeService } from "../../../../services/EmployeeService";
import '../style.scss';

export const ModalWFH = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getMinStartDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  };

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
    // Giới hạn 10MB (thường backend Spring mặc định là 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
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
    const minStartDate = getMinStartDate();
    if (!form.startDate) newErr.startDate = "Hãy chọn ngày bắt đầu";
    if (form.startDate && form.startDate < minStartDate) {
      newErr.startDate = `Ngày bắt đầu phải sau hôm nay tối thiểu 3 ngày (${minStartDate})`;
    }
    if (!form.endDate) newErr.endDate = "Hãy chọn ngày kết thúc";
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      newErr.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
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
      
      // Gọi API để tạo yêu cầu WFH với file thực tế
      await EmployeeService.createRequest({
        file: file, // Gửi file object trực tiếp
        reason: form.reason,
        startDate: `${form.startDate}T00:00:00`,
        endDate: `${form.endDate}T23:59:59`,
      }
      , "WorkFromHome"
      );

      // Gọi callback onSuccess nếu có để refresh danh sách
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error("Error creating WFH request:", error);
      
      // Xử lý lỗi cụ thể từ backend
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
        <h2>Tạo yêu cầu Làm việc tại nhà</h2>

        <label>Ngày bắt đầu</label>
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          min={getMinStartDate()}
          disabled={loading}
        />
        {errors.startDate && <p className="error">{errors.startDate}</p>}

        <label>Ngày kết thúc</label>
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          disabled={loading}
        />
        {errors.endDate && <p className="error">{errors.endDate}</p>}

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
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </div>
    </div>
  );
};