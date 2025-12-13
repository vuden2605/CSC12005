import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './style.scss';

const EmployeeDetail = () => {
const { employeeId } = useParams(); // Lấy employeeId từ URL
const [employee, setEmployee] = useState({});

useEffect(() => {
    // Gọi API để lấy thông tin chi tiết của nhân viên
    fetch(`/api/managers/1/employees/${employeeId}`)
        .then(response => response.json())
        .then(data => setEmployee(data.employee));
}, [employeeId]);

return (
    <div className="employee-detail">
    <h2>Thông tin nhân viên</h2>
    <div className="employee-info">
        <div><strong>Họ và tên: </strong>{employee.fullName}</div>
        <div><strong>Email: </strong>{employee.email}</div>
        <div><strong>Phòng ban: </strong>{employee.departmentName}</div>
        <div><strong>Vị trí: </strong>{employee.positionName}</div>
        <div><strong>Số điện thoại: </strong>{employee.phone}</div>
        <div><strong>Ngày sinh: </strong>{employee.birthDate}</div>
    </div>
    </div>
);
};

export default EmployeeDetail;
