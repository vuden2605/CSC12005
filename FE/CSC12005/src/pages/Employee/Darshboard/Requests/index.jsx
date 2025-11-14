import React, { useState } from 'react';
import './style.scss';

import {ModalLeave} from '../../../../components/modals/Request/ModalLeave/ModalLeave';
import {ModalWFH} from '../../../../components/modals/Request/ModalWFH/ModalWFH';
import {AttendanceModal} from '../../../../components/modals/Request/ModalTimekeeping/ModalTimekeeping';


export const Requests = () => {
  const [leaveType, setLeaveType] = useState("Tất cả");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [statusFilter, setStatusFilter] = useState({
    pending: true,
    approved: true,
    rejected: true
  });

  // Modal control
  const [showChooseTypeModal, setShowChooseTypeModal] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState(null);

  const requestData = [
    { id: 1, name: "Nguyễn Quang Vũ", duration: 1, startDate: "2022-04-22", endDate: "2022-04-28", status: "pending", statusText: "Chờ duyệt", reason: "Cá nhân", paid: true, type: "Nghỉ phép" },
    { id: 2, name: "Nguyễn Quang Vũ", duration: 7, startDate: "2022-04-22", endDate: "2022-04-30", status: "approved", statusText: "Đã duyệt", reason: "Thi IELTS", paid: false, type: "Làm việc tại nhà" },
    { id: 3, name: "Nguyễn Quang Vũ", duration: 1, startDate: "2022-04-22", endDate: "2022-06-28", status: "rejected", statusText: "Từ chối", reason: "Chăm sóc con", paid: true, type: "Chấm công" },
    { id: 4, name: "Nguyễn Quang Vũ", duration: 5, startDate: "2022-04-22", endDate: "2022-04-28", status: "approved", statusText: "Đã duyệt", reason: "Cá nhân", paid: true, type: "Nghỉ phép" },
    { id: 5, name: "Nguyễn Quang Vũ", duration: 5, startDate: "2022-04-22", endDate: "2022-04-28", status: "approved", statusText: "Đã duyệt", reason: "Cá nhân", paid: true, type: "Làm việc tại nhà" }
  ];

  const filteredData = requestData.filter(item => {
    const typeMatch = leaveType === "Tất cả" || item.type === leaveType;

    const statusMatch =
      (statusFilter.pending && item.status === 'pending') ||
      (statusFilter.approved && item.status === 'approved') ||
      (statusFilter.rejected && item.status === 'rejected');

    const dateMatch =
      (!startDate || item.startDate >= startDate) &&
      (!endDate || item.endDate <= endDate);

    return typeMatch && statusMatch && dateMatch;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-waiting';
      default: return '';
    }
  };

  const totalDays = filteredData.reduce((sum, item) => sum + item.duration, 0);
  const paidDays = filteredData.filter(item => item.paid).reduce((sum, item) => sum + item.duration, 0);
  const unpaidDays = totalDays - paidDays;

  // --- Chọn modal ---
  const openRequestModal = (type) => {
    setSelectedRequestType(type);
    setShowChooseTypeModal(false);
  };

  const closeModal = () => setSelectedRequestType(null);

  return (
    <div className="leave-management">
      
      {/* Các filter ở trên giữ nguyên */}
      {/* ... */}

      {/* Table */}
      <div className="table-section">
        <h3 className="section-title">Danh sách các yêu cầu</h3>
        <table className="leave-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Thời gian</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Lí do</th>
              <th>Loại nghỉ</th>
              <th>Loại yêu cầu</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.duration}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(item.status)}`}>
                    {item.statusText}
                  </span>
                </td>
                <td>{item.reason}</td>
                <td>{item.paid ? 'Có lương' : 'Không lương'}</td>
                <td>{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="remaining-leave">
          <div className="leaf-icon">🌿</div>
          <p>Ngày nghỉ có lương còn lại</p>
          <h2>0 Ngày</h2>
        </div>

        <button className="create-btn" onClick={() => setShowChooseTypeModal(true)}>
          Tạo yêu cầu
        </button>
      </div>

      {/* Modal chọn loại yêu cầu */}
      {showChooseTypeModal && (
        <div className="modal-overlay">
          <div className="modal choose-type-modal">
            <h3>Chọn loại yêu cầu</h3>

            <button onClick={() => openRequestModal("Nghỉ phép")} className="modal-btn">Nghỉ phép</button>
            <button onClick={() => openRequestModal("Làm việc tại nhà")} className="modal-btn">Làm việc tại nhà</button>
            <button onClick={() => openRequestModal("Chấm công")} className="modal-btn">Chấm công</button>

            <button className="close-btn" onClick={() => setShowChooseTypeModal(false)}>Đóng</button>
          </div>
        </div>
      )}

      {/* Render modal tương ứng */}
      {selectedRequestType === "Nghỉ phép" && <ModalLeave onClose={closeModal} />}
      {selectedRequestType === "Làm việc tại nhà" && <ModalWFH onClose={closeModal} />}
      {selectedRequestType === "Chấm công" && <AttendanceModal onClose={closeModal} />}

    </div>
  );
};
