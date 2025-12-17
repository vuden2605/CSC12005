import React from 'react';
import './style.scss';

const EmployeeRequests = ({ requests, onViewDetails }) => {
return (
    <div className="employee-requests">
    <h2>Danh sách yêu cầu</h2>
    <table className="requests-table">
        <thead>
        <tr>
            <th>Họ tên</th>
            <th>Loại yêu cầu</th>
            <th>Trạng thái</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Thao tác</th>
        </tr>
        </thead>
        <tbody>
        {requests.map((request) => (
            <tr key={request.id}>
            <td>{request.name}</td>
            <td>{request.requestType}</td>
            <td>{request.status}</td>
            <td>{request.startDate}</td>
            <td>{request.endDate}</td>
            <td>
                <button onClick={() => onViewDetails(request.id)}>Xem chi tiết</button>
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
);
};

export default EmployeeRequests;
