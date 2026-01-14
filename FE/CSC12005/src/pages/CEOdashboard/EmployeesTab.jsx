import React from "react";
import "./style.scss";
import CEOEmployeeList from "./EmployeeList";

const CEOEmployeesTab = () => {
  return (
    <div className="ceo-tab-card">
      <h2 className="ceo-tab-title">Xem nhân viên mỗi phòng ban</h2>
      <p className="ceo-empty-text" style={{ paddingTop: 0 }}>
        Danh sách hiển thị đầy đủ <strong>Họ tên</strong>, <strong>Phòng ban</strong> và{" "}
        <strong>Chức vụ</strong> của từng nhân viên.
      </p>
      <CEOEmployeeList />
    </div>
  );
};

export default CEOEmployeesTab;

