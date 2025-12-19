import React, { useState, useEffect } from "react";
import { EditButton } from "../../../../../components/EditButton/EditButton"; 
import { EditInfoModal } from "../../../../../components/modals/EditInfoModal/EditInfoModal";
import { EmployeeService } from "../../../../../services/EmployeeService";
import "./style.scss";

export const InfoDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState({
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const employeeData = await EmployeeService.getCurrentUser();
        
        // Map dữ liệu từ API vào state
        setInfo({
          phone: employeeData.phone || "",
          email: employeeData.email || "",
          address: employeeData.address || "",
        });
      } catch (err) {
        console.error("Error fetching employee info:", err);
        setError(err.message || "Không thể tải thông tin nhân viên");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeInfo();
  }, []);

  const handleSave = async (updated) => {
    try {
      setUpdating(true);
      setError(null);
      
      // Gọi API để cập nhật profile
      await EmployeeService.updateProfile({
        email: updated.email,
        address: updated.address,
        phone: updated.phone,
      });
      
      // Cập nhật state sau khi API thành công
      setInfo(updated);
      setIsModalOpen(false);
      
      // Có thể thêm thông báo thành công ở đây nếu cần
      console.log("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Không thể cập nhật thông tin");
      // Không đóng modal nếu có lỗi để người dùng có thể thử lại
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="info-details">
        <div className="details-card">
          <h2>Thông tin cá nhân</h2>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="info-details">
        <div className="details-card">
          <h2>Thông tin cá nhân</h2>
          <p style={{ color: "red" }}>Lỗi: {error}</p>
        </div>
      </div>
    );
  }

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
        isUpdating={updating} // Truyền trạng thái updating
      />
      
      {/* Hiển thị lỗi khi cập nhật */}
      {error && !loading && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "0.75rem", 
          backgroundColor: "#fee2e2", 
          color: "#dc2626", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}
    </div>
  );
};
