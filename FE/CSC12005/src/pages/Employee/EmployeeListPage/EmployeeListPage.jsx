import React from 'react';
import EmployeeList from "/src/components/EmployeeList/EmployeeList.jsx";
import EmployeeStats from '/src/components/EmployeeStats/EmployeeStats.jsx';
import EmployeeRequests from '/src/components/EmployeeRequests/EmployeeRequests.jsx';

const EmployeeListPage = () => {
  return (
    <div>
      <h1>Danh sách nhân viên dưới quyền</h1>
      <EmployeeList /> {/* Hiển thị danh sách nhân viên */}
      <EmployeeStats /> {/* Hiển thị thống kê KPI của nhân viên */}
      
      <h2>Danh sách yêu cầu của nhân viên</h2>
      <EmployeeRequests /> {/* Hiển thị danh sách yêu cầu nhân viên */}
    </div>
  );
};

export default EmployeeListPage;
