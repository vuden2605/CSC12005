import React from 'react';
import EmployeeList from '../../components/EmployeeList';
import EmployeeStats from '../../components/EmployeeStats';

const EmployeeListPage = () => {
return (
    <div>
        <h1>Danh sách nhân viên dưới quyền</h1>
      <EmployeeList /> {/* Hiển thị danh sách nhân viên */}
      <EmployeeStats /> {/* Hiển thị thống kê KPI của nhân viên */}
    </div>
);
};

export default EmployeeListPage;
