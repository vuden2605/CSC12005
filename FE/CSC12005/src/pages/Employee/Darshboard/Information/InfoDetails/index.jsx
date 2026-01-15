import React, { useState, useEffect } from "react";
import { EditButton } from "../../../../../components/EditButton/EditButton"; 
import { EditInfoModal } from "../../../../../components/modals/EditInfoModal/EditInfoModal";
import { EmployeeService } from "../../../../../services/EmployeeService";
import "./style.scss";
import { useAlert } from "../../../../../context/AlertContext";
export const InfoDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const {showAlert}=useAlert();
  const [info, setInfo] = useState({
    phone: "",
    email: "",
    address: "",
    permanentAddress: "",
    gender: "",
    birthDate: "",
    nationalCode: "",
    maritalStatus: "",
    nationality: "",
    religion: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    hireDate: "",
    educationLevel: "",
    major: "",
    university: "",
    graduationYear: "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const employeeData = await EmployeeService.getCurrentUser();

        const GENDER_LABEL = {
          MALE: "Nam",
          FEMALE: "Nữ",
          OTHER: "Khác",
        };

        const MARITAL_STATUS_LABEL = {
          SINGLE: "Độc thân",
          MARRIED: "Đã kết hôn",
          DIVORCED: "Đã ly hôn",
          WIDOWED: "Góa",
        };

        const EDUCATION_LEVEL_LABEL = {
          HIGH_SCHOOL: "Trung học phổ thông",
          COLLEGE: "Cao đẳng",
          UNIVERSITY: "Đại học",
          MASTER: "Thạc sĩ",
          DOCTORATE: "Tiến sĩ",
        };

        // Map dữ liệu từ API vào state
        setInfo({
          phone: employeeData.phone || "",
          email: employeeData.email || "",
          address: employeeData.address || "",
          permanentAddress: employeeData.permanentAddress || "",
          gender:
            GENDER_LABEL[employeeData.gender] || employeeData.gender || "",
          birthDate: formatDate(employeeData.birthDate),
          nationalCode: employeeData.nationalCode || "",
          maritalStatus:
            MARITAL_STATUS_LABEL[employeeData.maritalStatus] ||
            employeeData.maritalStatus ||
            "",
          nationality: employeeData.nationality || "",
          religion:
            employeeData.religion === "None"
              ? "Không"
              : employeeData.religion || "",
          emergencyContactName: employeeData.emergencyContactName || "",
          emergencyContactPhone: employeeData.emergencyContactPhone || "",
          emergencyContactRelationship:
            employeeData.emergencyContactRelationship || "",
          hireDate: formatDate(employeeData.hireDate),
          educationLevel:
            EDUCATION_LEVEL_LABEL[employeeData.educationLevel] ||
            employeeData.educationLevel ||
            "",
          major: employeeData.major || "",
          university: employeeData.university || "",
          graduationYear:
            employeeData.graduationYear !== undefined &&
            employeeData.graduationYear !== null
              ? String(employeeData.graduationYear)
              : "",
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
      setInfo((prev) => ({ ...prev, ...updated }));
      setIsModalOpen(false);
      
      // Có thể thêm thông báo thành công ở đây nếu cần
      console.log("Profile updated successfully");
      showAlert("success","Chỉnh sửa thông tin cá nhân thành công")

    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Không thể cập nhật thông tin");
      showAlert("error",err.message)
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
        <h2>Thông tin chi tiết</h2>

        <div className="details-grid">
          <div className="details-section-title">Thông tin liên hệ</div>
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
          <div className="details-item">
            <span className="details-label">Địa chỉ thường trú</span>
            <input
              className="details-input"
              value={info.permanentAddress}
              readOnly
            />
          </div>

          <div className="details-section-title">Người liên hệ khẩn cấp</div>
          <div className="details-item">
            <span className="details-label">Họ tên</span>
            <input
              className="details-input"
              value={info.emergencyContactName}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Mối quan hệ</span>
            <input
              className="details-input"
              value={info.emergencyContactRelationship}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Số điện thoại</span>
            <input
              className="details-input"
              value={info.emergencyContactPhone}
              readOnly
            />
          </div>

          <div className="details-section-title">Thông tin cá nhân</div>
          <div className="details-item">
            <span className="details-label">Giới tính</span>
            <input
              className="details-input"
              value={info.gender}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Ngày sinh</span>
            <input
              className="details-input"
              value={info.birthDate}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Quốc tịch</span>
            <input
              className="details-input"
              value={info.nationality}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Tôn giáo</span>
            <input
              className="details-input"
              value={info.religion}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Tình trạng hôn nhân</span>
            <input
              className="details-input"
              value={info.maritalStatus}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">CMND/CCCD</span>
            <input
              className="details-input"
              value={info.nationalCode}
              readOnly
            />
          </div>

          <div className="details-section-title">Học vấn & công việc</div>
          <div className="details-item">
            <span className="details-label">Trình độ học vấn</span>
            <input
              className="details-input"
              value={info.educationLevel}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Chuyên ngành</span>
            <input
              className="details-input"
              value={info.major}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Trường/Đơn vị đào tạo</span>
            <input
              className="details-input"
              value={info.university}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Năm tốt nghiệp</span>
            <input
              className="details-input"
              value={info.graduationYear}
              readOnly
            />
          </div>
          <div className="details-item">
            <span className="details-label">Ngày vào làm</span>
            <input
              className="details-input"
              value={info.hireDate}
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
