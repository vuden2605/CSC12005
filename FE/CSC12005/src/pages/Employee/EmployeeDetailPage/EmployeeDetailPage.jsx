import React from 'react';
import EmployeeDetail from '../../components/EmployeeDetail';

const EmployeeDetailPage = () => {
return (
    <div>
        <h1>Chi tiết thông tin nhân viên</h1>
      <EmployeeDetail /> {/* Hiển thị thông tin chi tiết nhân viên */}
    </div>
);
};

export default EmployeeDetailPage;
