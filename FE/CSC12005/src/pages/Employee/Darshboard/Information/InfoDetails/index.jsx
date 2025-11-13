import React, { useState } from "react";
import { EditButton } from "../../../../../components/EditButton/EditButton"; // đường dẫn tùy theo project của bạn
import "./style.scss";

export const InfoDetails = () => {
  const [employee, setEmployee] = useState({
    phone: "0912 345 678",
    email: "vu.nguyen@company.com",
    address: "123 Nguyễn Trãi, TP. Hồ Chí Minh",
  });

  return (
    <div className="info-details">
      <div className="details-card">
        <h2>Thông tin chi tiết</h2>

        <div className="details-grid">
          <div className="details-item">
            <label className="details-label">Số điện thoại</label>
            <input
              type="text"
              className="details-input"
              value={employee.phone}
              readOnly
            />
          </div>

          <div className="details-item">
            <label className="details-label">Email</label>
            <input
              type="email"
              className="details-input"
              value={employee.email}
              readOnly
            />
          </div>

          <div className="details-item">
            <label className="details-label">Địa chỉ</label>
            <input
              type="text"
              className="details-input"
              value={employee.address}
              readOnly
            />
          </div>
        </div>

       
          <EditButton onClick={() => console.log("Edit details clicked")} />
        
      </div>
    </div>
  );
};
