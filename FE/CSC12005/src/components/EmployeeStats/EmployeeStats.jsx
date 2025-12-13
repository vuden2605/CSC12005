import React from 'react';
import './style.scss';

const EmployeeStats = () => {
return (
    <div className="employee-stats">
        <h3>Thông kê KPI</h3>
        <div><strong>Số ngày làm: </strong>20</div>
        <div><strong>Số ngày nghỉ: </strong>5</div>
        <div><strong>Số task hoàn thành: </strong>15</div>
        <div><strong>KPI: </strong>45</div>
    </div>
);
};

export default EmployeeStats;
