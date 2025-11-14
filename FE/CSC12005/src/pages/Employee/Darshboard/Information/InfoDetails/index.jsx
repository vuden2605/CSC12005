import React, { useState } from "react";
import { EditButton } from "../../../../../components/EditButton/EditButton"; 
import { EditInfoModal } from "../../../../../components/modals/EditInfoModal/EditInfoModal";
import "./style.scss";

export const InfoDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [info, setInfo] = useState({
    phone: "0123456789",
    email: "vu.nguyen@example.com",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  });

  const handleSave = (updated) => {
    setInfo(updated); // Cập nhật thông tin từ modal
    setIsModalOpen(false); // Đóng modal sau khi lưu
  };

  return (
    <div className="info-details">
      <div className="details-card">
        <h2>Thông tin cá nhân</h2>

        <div className="details-grid">
          <div className="details-item">
            <span className="details-label">Số điện thoại</span>
            <input
              className="details-input"
              value={info.phone}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Email</span>
            <input
              className="details-input"
              value={info.email}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Địa chỉ</span>
            <input
              className="details-input"
              value={info.address}
              readOnly
            />
          </div>
        </div>

        <EditButton label="Sửa thông tin" onClick={() => setIsModalOpen(true)} />
      </div>

      {/* Modal chỉnh sửa */}
      <EditInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        currentData={info} // Truyền dữ liệu hiện tại để modal hiển thị
      />
    </div>
  );
};
