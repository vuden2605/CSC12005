import React, { useState } from "react";
import EmployeeList from "../../components/EmployeeManagement";
import "./disableEmployee.scss";


export default function DisableEmployee() {
//Dữ liệu mẫu
const seedEmployees = [
{ id: 1, name: "Bàn Hữu Bằng", email: "a@company.com", department: "HR", status: "ACTIVE" },
{ id: 2, name: "Bàn Hữu Bằng", email: "b@company.com", department: "IT", status: "ACTIVE" },
{ id: 3, name: "Bàn Hữu Bằng", email: "c@company.com", department: "Sales", status: "DISABLED" },
];

const handleDisableEmployee = (employeeId) => {
    setEmployees((prev) =>
    prev.map((e) =>
        e.id === employeeId ? { ...e, status: "DISABLED" } : e
    )
    );
};

return (
    <EmployeeList
    employees={employees}
    onDisableEmployee={handleDisableEmployee}
    />
);
}
