import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { HRService } from "../../services/HRService";

// Hiển thị danh sách nhân viên, có thể lọc theo phòng ban sau này
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await HRService.getAllEmp();
        setEmployees(Array.isArray(data) ? data : data || []);
      } catch (err) {
        setError(err.message || "Không thể tải danh sách nhân viên");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div>Đang tải danh sách nhân viên...</div>;
  }

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  return (
    <div className="employee-list">
      <Table hover responsive>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Phòng ban</th>
            <th>Chức vụ</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.fullName || employee.name}</td>
              <td>
                {typeof employee.department === "object"
                  ? employee.department?.name
                  : employee.department}
              </td>
              <td>
                {typeof employee.position === "object"
                  ? employee.position?.positionName
                  : employee.position}
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center">
                Không có nhân viên nào.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default EmployeeList;
