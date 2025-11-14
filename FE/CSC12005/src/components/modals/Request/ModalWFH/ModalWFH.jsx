import React, { useState } from "react";
import '../style.scss';

export const ModalWFH = ({ onClose }) => {
  const [form, setForm] = useState({
    workDate: "",
    reason: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (f.type !== "application/pdf") return setErrors({ file: "Chỉ PDF" });
    if (f.size > 20 * 1024 * 1024) return setErrors({ file: "File < 20MB" });

    setErrors({});
    setFile(f);
  };

  const validate = () => {
    let newErr = {};
    if (!form.workDate) newErr.workDate = "Hãy chọn ngày làm việc tại nhà";
    if (!form.reason) newErr.reason = "Hãy nhập lý do";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    console.log("Yêu cầu làm việc tại nhà:", form, file);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Tạo yêu cầu Làm việc tại nhà</h2>

        <label>Ngày làm việc tại nhà</label>
        <input
          type="date"
          value={form.workDate}
          onChange={(e) => setForm({ ...form, workDate: e.target.value })}
        />
        {errors.workDate && <p className="error">{errors.workDate}</p>}

        <label>Lý do</label>
        <textarea
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        {errors.reason && <p className="error">{errors.reason}</p>}

        <label> File minh chứng (PDF, ≤ 20MB )</label>
        <input type="file" accept="application/pdf" onChange={handleFile} />
        {errors.file && <p className="error">{errors.file}</p>}

        <div className="btn-row">
          <button className="btn cancel" onClick={onClose}>Hủy</button>
          <button className="btn confirm" onClick={submit}>Gửi yêu cầu</button>
        </div>
      </div>
    </div>
  );
};
