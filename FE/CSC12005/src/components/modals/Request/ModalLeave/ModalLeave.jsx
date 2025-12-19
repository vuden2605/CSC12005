import React, { useState } from "react";
import { EmployeeService } from "../../../../services/EmployeeService";
import "../style.scss";

export const ModalLeave = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate file PDF < 20MB
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) {
      setFile(null);
      return;
    }

    if (f.type !== "application/pdf") {
      setErrors({ ...errors, file: "Chỉ chấp nhận PDF" });
      setFile(null);
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setErrors({ ...errors, file: "Dung lượng phải nhỏ hơn 20MB" });
      setFile(null);
      return;
    }

    setErrors({ ...errors, file: "" });
    setFile(f);
  };

  const validate = () => {
    let newErr = {};

    // Tính ngày tối thiểu (3 ngày sau ngày hiện tại)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);

    if (!form.startDate) {
      newErr.startDate = "Vui lòng chọn ngày bắt đầu";
    } else {
      const startDate = new Date(form.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (startDate < minDate) {
        newErr.startDate = "Ngày bắt đầu phải sau ngày hiện tại ít nhất 3 ngày";
      }
    }

    if (!form.endDate) {
      newErr.endDate = "Vui lòng chọn ngày kết thúc";
    } else {
      const endDate = new Date(form.endDate);
      endDate.setHours(0, 0, 0, 0);
      if (endDate < minDate) {
        newErr.endDate = "Ngày kết thúc phải sau ngày hiện tại ít nhất 3 ngày";
      }
    }

    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      newErr.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    if (!form.reason.trim()) newErr.reason = "Vui lòng nhập lý do";
    if (!file) newErr.file = "Vui lòng chọn file minh chứng";

    setErrors(newErr);

    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append("startDate", `${form.startDate}T00:00:00`);
      formData.append("endDate", `${form.endDate}T23:59:59`);
      formData.append("reason", form.reason);
      if (file) {
        formData.append("file", file);
      }

      // Gọi API để tạo leave request
      await EmployeeService.createLeaveRequest(formData);

      // Gọi callback onSuccess nếu có để refresh danh sách
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Error creating leave request:", error);

      let errorMessage = "Không thể tạo yêu cầu. Vui lòng thử lại.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error.response?.status === 413 ||
        error.message.includes("Maximum upload size")
      ) {
        errorMessage = "File quá lớn. Vui lòng chọn file nhỏ hơn 20MB.";
      }

      setErrors({ ...errors, submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Tạo yêu cầu Nghỉ phép</h2>

        <label>Ngày bắt đầu</label>
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
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

        <label>
          File minh chứng (PDF hoặc ảnh: JPG, PNG, GIF, WEBP, tối đa 10MB)
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          disabled={loading}
        />
        {file && (
          <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Đã chọn: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
        {errors.file && <p className="error">{errors.file}</p>}

        {errors.submit && (
          <p className="error" style={{ marginTop: "10px" }}>
            {errors.submit}
          </p>
        )}

        <div className="btn-row">
          <button className="btn cancel" onClick={onClose} disabled={loading}>
            Hủy
          </button>
          <button
            className="btn confirm"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Gửi yêu cầu"}
          </button>
        </div>
      </div>
    </div>
  );
};
