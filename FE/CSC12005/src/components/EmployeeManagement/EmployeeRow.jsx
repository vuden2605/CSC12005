import React from "react";
import "./employeeRow.scss";

export default function EmployeeRow({ employee, onDisableClick }) {
const isDisabled = employee.status === "DISABLED";

return (
    <div className={`er-row ${isDisabled ? "is-disabled" : ""}`}>
    <div className="er-left">
        <div className="er-name">{employee.name}</div>
        <div className="er-meta">
        <span>{employee.email}</span>
        <span className="dot">•</span>
        <span>{employee.department}</span>
        </div>
    </div>

    <div className="er-right">
        <span className={`er-badge ${isDisabled ? "disabled" : "active"}`}>
        {isDisabled ? "Đã vô hiệu hóa" : "Đang hoạt động"}
        </span>

        <button
            className="er-btn"
            onClick={() => onDisableClick(employee)}
            disabled={isDisabled}
            title={isDisabled ? "Nhân viên đã bị vô hiệu hóa" : "Vô hiệu hóa nhân viên"}
        >
        Vô hiệu hóa
        </button>
    </div>
    </div>
);
}
