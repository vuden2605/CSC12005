import React, { useState } from "react";
import '../style.scss';

export const AttendanceModal = ({ onClose }) => {
  const [form, setForm] = useState({
    attendanceDate: "",
    checkIn: "",
    checkOut: "",
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
    if (!form.attendanceDate) newErr.attendanceDate = "Chọn ngày";
    if (!form.checkIn) newErr.checkIn = "Chọn giờ vào";
    if (!form.checkOut) newErr.checkOut = "Chọn giờ ra";
    if (!form.reason) newErr.reason = "Nhập lý do";

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    console.log("Yêu cầu chấm công:", form, file);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Tạo yêu cầu Chấm công</h2>

        <label>Ngày</label>
        <input
          type="date"
          value={form.attendanceDate}
          onChange={(e) => setForm({ ...form, attendanceDate: e.target.value })}
        />
        {errors.attendanceDate && <p className="error">{errors.attendanceDate}</p>}

        <label>Giờ vào</label>
        <input
          type="time"
          value={form.checkIn}
          onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
        />
        {errors.checkIn && <p className="error">{errors.checkIn}</p>}

        <label>Giờ ra</label>
        <input
          type="time"
          value={form.checkOut}
          onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
        />
        {errors.checkOut && <p className="error">{errors.checkOut}</p>}

        <label>Lý do</label>
        <textarea
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        {errors.reason && <p className="error">{errors.reason}</p>}

        <label>File minh chứng (PDF, ≤ 20MB )</label>
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
