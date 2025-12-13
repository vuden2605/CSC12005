import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const EmployeeList = () => {
const [employees, setEmployees] = useState([]);

useEffect(() => {
    // Lấy dữ liệu danh sách nhân viên từ API
    fetch('/api/managers/1/employees')
        .then(response => response.json())
        .then(data => setEmployees(data.employees));
}, []);

return (
    <div className="employee-list">
        <h2>Danh sách nhân viên dưới quyền</h2>
        <div className="search-container">
        <input
            type="text"
            placeholder="Tìm kiếm nhân viên"
            className="search-input"
        />
    </div>
    <table className="employee-table">
        <thead>
        <tr>
            <th>Mã NV</th>
            <th>Tên nhân viên</th>
            <th>Phòng ban</th>
            <th>Vị trí</th>
            <th>Xem</th>
        </tr>
        </thead>
        <tbody>
        {employees.map(employee => (
            <tr key={employee.employeeId}>
            <td>{employee.employeeCode}</td>
            <td>{employee.fullName}</td>
            <td>{employee.departmentName}</td>
            <td>{employee.positionName}</td>
            <td>
                <Link to={`/employee/${employee.employeeId}`} className="view-button">
                Xem
                </Link>
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
);
};

export default EmployeeList;
