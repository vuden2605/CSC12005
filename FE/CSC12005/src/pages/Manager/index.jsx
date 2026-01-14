import React, { useState, useEffect } from "react";
import "./style.scss";
import InfoCard from "../../components/InfoCard";
import { ManagerService } from "../../services/ManagerService";
import { useSelector } from "react-redux";
import { EmployeeDetailModal } from "../../components/modals/EmployeeDetailModal/EmployeeDetailModal";

export const Manager = () => {
  const [employeesPage, setEmployeesPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // ⭐ SEARCH STATE
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const currentUser = useSelector((state) => state.user.currentUser);

  const employee = {
    name: currentUser?.fullName || "Nguyễn Văn Quản Lý",
    role: currentUser.position.positionName || "Quản lý",
    avatar: "👨‍💼",
  };

  const fetchEmployees = async (page = 1) => {
    try {
      const res = await ManagerService.getEmployeesByManager(
        currentUser.id,
        page - 1,
        1,
        "id",
        "ASC"
      );
      setEmployeesPage(res);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.id) fetchEmployees(currentPage);
  }, [currentUser, currentPage]);
  if (!employeesPage) return <div>Đang tải danh sách nhân viên...</div>;

  const employees = employeesPage.content;
  const totalPages = employeesPage.totalPages;

  // ⭐ FILTER SEARCH
  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================
  // EXPORT CSV
  // ============================
  const exportToCSV = () => {
    if (!filteredEmployees || filteredEmployees.length === 0) {
      alert("Không có dữ liệu để xuất");
      return;
    }

    const headers = ["Mã NV", "Tên nhân viên", "Phòng ban", "Vị trí"];

    const rows = filteredEmployees.map((emp) => [
      emp.employeeCode,
      emp.fullName,
      emp.department?.departmentName,
      emp.position?.positionName,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =
      "danh_sach_nhan_vien_" + new Date().toISOString().split("T")[0] + ".csv";
    link.click();
  };

  // ============================
  // EXPORT EXCEL
  // ============================
  const exportToExcel = () => {
    if (!filteredEmployees || filteredEmployees.length === 0) {
      alert("Không có dữ liệu để xuất");
      return;
    }

    const tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8" /></head>
      <body>
        <table>
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Tên nhân viên</th>
              <th>Phòng ban</th>
              <th>Vị trí</th>
            </tr>
          </thead>
          <tbody>
            ${filteredEmployees
              .map(
                (emp) => `
              <tr>
                <td>${emp.employeeCode}</td>
                <td>${emp.fullName}</td>
                <td>${emp.department?.departmentName}</td>
                <td>${emp.position?.positionName}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(["\uFEFF", tableHTML], {
      type: "application/vnd.ms-excel",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =
      "danh_sach_nhan_vien_" + new Date().toISOString().split("T")[0] + ".xls";
    link.click();
  };

  return (
    <div className="employee-container">
      <InfoCard employee={employee} />

      <h1 className="page-title">Nhân viên dưới quyền</h1>

      <div className="employee-list-card">
        <div className="card-header">
          <h2 className="card-title">Danh sách nhân viên dưới quyền</h2>
          <div className="employee-count">
            Tổng cộng: {employeesPage.totalElements} nhân viên
          </div>
        </div>

        {/* ⭐ SEARCH BOX UI */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th>Mã nhân viên</th>
              <th>Họ và tên</th>
              <th>Phòng ban</th>
              <th>Vị trí</th>
              <th>Thông tin</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.employeeCode}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.department?.departmentName}</td>
                  <td>{emp.position?.positionName}</td>
                  <td>
                    <button
                      type="button"
                      className="link-view"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowEmployeeModal(true);
                      }}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  Không có nhân viên nào dưới quyền hoặc không tìm thấy theo tìm kiếm
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 0 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="export-section">
        <button
          className="btn-export"
          onClick={exportToExcel}
        >
          📊 Xuất Excel
        </button>
        <button
          className="btn-export btn-export-csv"
          onClick={exportToCSV}
        >
          📄 Xuất CSV
        </button>
      </div>

      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setSelectedEmployee(null);
        }}
      />
    </div>
  );
};
