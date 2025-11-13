import React, { useState } from 'react';
import './style.scss';

export const LeaveRequests = () => {
  // --- State ---
  const [leaveType, setLeaveType] = useState('Tất cả');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState({
    pending: true,
    approved: true,
    rejected: true
  });

  // --- Dữ liệu mẫu ---
  const leaveData = [
    { id: 1, name: 'Nguyễn Quang Vũ', duration: 1, startDate: '2022-04-22', endDate: '2022-04-28', status: 'pending', statusText: 'Chờ duyệt', reason: 'Cá nhân', paid: true },
    { id: 2, name: 'Nguyễn Quang Vũ', duration: 7, startDate: '2022-04-22', endDate: '2022-04-30', status: 'approved', statusText: 'Đã duyệt', reason: 'Thi IELTS', paid: false },
    { id: 3, name: 'Nguyễn Quang Vũ', duration: 1, startDate: '2022-04-22', endDate: '2022-06-28', status: 'rejected', statusText: 'Từ chối', reason: 'Chăm sóc con', paid: true },
    { id: 4, name: 'Nguyễn Quang Vũ', duration: 5, startDate: '2022-04-22', endDate: '2022-04-28', status: 'approved', statusText: 'Đã duyệt', reason: 'Cá nhân', paid: true },
    { id: 5, name: 'Nguyễn Quang Vũ', duration: 5, startDate: '2022-04-22', endDate: '2022-04-28', status: 'approved', statusText: 'Đã duyệt', reason: 'Cá nhân', paid: true }
  ];

  // --- Lọc dữ liệu ---
  const filteredData = leaveData.filter(item => {
    // lọc theo loại nghỉ
    const typeMatch = leaveType === 'Tất cả' || item.type === leaveType;


    // lọc theo trạng thái
    const statusMatch =
      (statusFilter.pending && item.status === 'pending') ||
      (statusFilter.approved && item.status === 'approved') ||
      (statusFilter.rejected && item.status === 'rejected');

    // lọc theo ngày
    const dateMatch =
      (!startDate || item.startDate >= startDate) &&
      (!endDate || item.endDate <= endDate);

    return typeMatch && statusMatch && dateMatch;
  });

  // --- Class cho trạng thái ---
  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-waiting';
      default: return '';
    }
  };

  // --- Tính tổng số ngày nghỉ ---
  const totalDays = filteredData.reduce((sum, item) => sum + item.duration, 0);
  const paidDays = filteredData.filter(item => item.paid).reduce((sum, item) => sum + item.duration, 0);
  const unpaidDays = totalDays - paidDays;

  return (
    <div className="leave-management">
      {/* Header + Filter */}
      <div className="header-section">
        <div className="filter-group">
          <label>Loại yêu cầu</label>
          <select value={leaveType} onChange={e => setLeaveType(e.target.value)} className="select-input">
            <option>Nghỉ phép</option>
            <option>Nghỉ ốm</option>
            <option>Nghỉ việc riêng</option>
            <option>Tất cả</option>
          </select>
        </div>

        <div className="date-filter">
          <label>Lọc theo thời gian</label>
          <div className="date-inputs">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="date-input"/>
            <span>đến</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="date-input"/>
          </div>
        </div>

        <div className="status-filter">
          <label>Chọn trạng thái</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={statusFilter.pending} onChange={e => setStatusFilter({...statusFilter, pending: e.target.checked})}/>
              Chưa duyệt
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={statusFilter.approved} onChange={e => setStatusFilter({...statusFilter, approved: e.target.checked})}/>
              Đã duyệt
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={statusFilter.rejected} onChange={e => setStatusFilter({...statusFilter, rejected: e.target.checked})}/>
              Không duyệt
            </label>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-item"><strong>Tổng số ngày đã nghỉ: {totalDays}</strong></div>
          <div className="summary-item">Số ngày nghỉ có lương: <strong>{paidDays}</strong></div>
          <div className="summary-item">Số ngày nghỉ không có lương: <strong>{unpaidDays}</strong></div>
        </div>
      </div>

      {/* Table */}
      <div className="table-section">
        <h3 className="section-title">Lịch sử nghỉ phép</h3>
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
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.duration}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td><span className={`status-badge ${getStatusClass(item.status)}`}>{item.statusText}</span></td>
                <td>{item.reason}</td>
                <td>{item.paid ? 'Có lương' : 'Không lương'}</td>
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
        <button className="create-btn">Tạo đơn nghỉ phép</button>
      </div>
    </div>
  );
};
