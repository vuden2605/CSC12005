import React, { useState } from "react";
import '../style.scss';

export const ModalLeave = ({ onClose }) => {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Validate file PDF < 20MB
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (f.type !== "application/pdf") {
      setErrors({ file: "Chỉ chấp nhận PDF" });
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setErrors({ file: "Dung lượng phải nhỏ hơn 20MB" });
      return;
    }

    setErrors({ ...errors, file: null });
    setFile(f);
  };

  const validate = () => {
    let newErr = {};

    if (!form.startDate) newErr.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!form.endDate) newErr.endDate = "Vui lòng chọn ngày kết thúc";
    if (!form.reason.trim()) newErr.reason = "Vui lòng nhập lý do";

    setErrors(newErr);

    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    console.log("Gửi yêu cầu nghỉ phép:", form, file);
    onClose();
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
        />
        {errors.startDate && <p className="error">{errors.startDate}</p>}

        <label>Ngày kết thúc</label>
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
        {errors.endDate && <p className="error">{errors.endDate}</p>}

        <label>Lý do</label>
        <textarea
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        {errors.reason && <p className="error">{errors.reason}</p>}

        <label>File minh chứng (PDF, ≤ 20MB)</label>
        <input type="file" accept="application/pdf" onChange={handleFile} />
        {errors.file && <p className="error">{errors.file}</p>}

        <div className="btn-row">
          <button className="btn cancel" onClick={onClose}>Hủy</button>
          <button className="btn confirm" onClick={handleSubmit}>Gửi yêu cầu</button>
        </div>
      </div>
    </div>
  );
};
