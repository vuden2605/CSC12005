import React, { useState, useEffect } from 'react';
import EmployeeRequests from '/src/components/EmployeeRequests/EmployeeRequests.jsx';
import './style.scss';

const EmployeeRequestsPage = () => {
  // State để lưu dữ liệu yêu cầu và bộ lọc
const [requests, setRequests] = useState([]);
const [filters, setFilters] = useState({
    status: 'Chưa duyệt',
    requestType: 'Nghỉ phép',
    startDate: '2025-09-20',
    endDate: '2025-09-20',
});

const fetchRequests = async () => {
    const data = [
    { id: 1, name: 'Bàn Hữu Bằng', requestType: 'Nghỉ phép', status: 'Chưa duyệt', startDate: '2025-09-20', endDate: '2025-09-25' },
    { id: 2, name: 'Bàn Hữu Bằng', requestType: 'Chấm công', status: 'Đã duyệt', startDate: '2025-09-21', endDate: '2025-09-21' },
    { id: 3, name: 'Bàn Hữu Bằng', requestType: 'Làm việc tại nhà', status: 'Chưa duyệt', startDate: '2025-09-22', endDate: '2025-09-23' },
    ];
    setRequests(data);
};

  // Hàm gọi lại API hoặc dữ liệu giả khi bộ lọc thay đổi
useEffect(() => {
    fetchRequests();
}, [filters]);

  // Hàm xử lý thay đổi bộ lọc
const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
    ...prevFilters,
    [filterName]: value,
    }));
};

  // Hàm xử lý khi nhấn xem chi tiết
const handleViewDetails = (requestId) => {
    console.log(`Xem chi tiết yêu cầu ${requestId}`);
};

return (
    <div className="employee-requests-page">
    <h1>Danh sách yêu cầu của nhân viên dưới quyền</h1>

      {/* Bộ lọc yêu cầu */}
    <div className="filters">
        <label>
        Chọn loại yêu cầu:
        <select
            value={filters.requestType}
            onChange={(e) => handleFilterChange('requestType', e.target.value)}
        >
            <option value="Nghỉ phép">Nghỉ phép</option>
            <option value="Làm việc tại nhà">Làm việc tại nhà</option>
            <option value="Chấm công">Chấm công</option>
        </select>
        </label>

        <label>
        Chọn trạng thái:
        <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
        >
            <option value="Chưa duyệt">Chưa duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Không duyệt">Không duyệt</option>
        </select>
        </label>

        <label>
        Lọc theo thời gian:
        <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
        />
        <span> đến </span>
        <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
        />
        </label>
    </div>

      {/* Hiển thị danh sách yêu cầu */}
    <EmployeeRequests requests={requests} onViewDetails={handleViewDetails} />
    </div>
);
};

export default EmployeeRequestsPage;
