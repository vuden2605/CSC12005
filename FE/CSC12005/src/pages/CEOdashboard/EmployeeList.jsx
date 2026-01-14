import React, { useEffect, useState } from "react";
import { HRService } from "../../services/HRService";

const CEOEmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await HRService.getAllEmp(
          {},
          { page: 0, size: 50, sortBy: "fullName", direction: "ASC" }
        );

        const data = response?.content || (Array.isArray(response) ? response : []);
        setEmployees(data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách nhân viên cho CEO:", err);
        setError("Không thể tải danh sách nhân viên");
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="ceo-loading-text">Đang tải danh sách nhân viên...</div>;
  }

  if (error) {
    return <div className="ceo-error-text">{error}</div>;
  }

  if (!employees.length) {
    return <div className="ceo-empty-text">Không có nhân viên nào.</div>;
  }

  return (
    <div className="ceo-employee-table-wrapper">
      <table className="ceo-employee-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Phòng ban</th>
            <th>Chức vụ</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              {/* Đọc đúng từ API: tên, phòng ban, chức vụ */}
              <td>{emp.fullName || emp.name}</td>
              <td>{emp.department?.departmentName || "Chưa có"}</td>
              <td>{emp.position?.positionName || "Chưa có"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CEOEmployeeList;
