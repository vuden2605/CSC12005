import { useEffect, useState } from "react";
import "./style.scss";
import EmployeeFormUpdateModel from "./EmployeeFormUpdateModal";
import EmployeeFormCreateModal from "./EmployeeFormCreateModal";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { EmployeeService } from "../../services/EmployeeService";
import { HRService } from "../../services/HRService";
function EmployeeList() {
    const [isLoading,setIsLoading] = useState(false);
  // Dữ liệu mẫu
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const fetAllEmp = async () => {
      try {
        const data = await HRService.getAllEmp();
        console.log(data);
        setEmployees(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
      }
    };
    fetAllEmp();
  }, [isLoading]);
  // State filter
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Lọc dữ liệu
  const filteredEmployees = employees.filter((emp) => {
    const matchName = emp.fullName.toLowerCase().includes(search.toLowerCase());
    const matchDept =
      departmentFilter === "all" || emp.department === departmentFilter;
    const matchStatus = statusFilter === "all" || emp.status === statusFilter;
    return matchName && matchDept && matchStatus;
  });

  const departments = ["Phòng IT", "Phòng Nhân sự", "Phòng Marketing"];
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // số nhân viên mỗi trang

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Khi đổi trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDisable = (id) => {
    console.log("Vô hiệu hóa nhân viên có ID:", id);
  };
  // modal update
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEdit = (id) => {
    const employee = employees.find((c) => c.id === id);
    setSelectedEmployee(employee);
    setShowModalUpdate(true);
  };
  // modal create
  const [showModalCreate, setShowModalCreate] = useState(false);

  const handleCreate = () => {
    setShowModalCreate(true);
  };
  //test message:

  return (
    <div className="employee-list">
      <EmployeeFormUpdateModel
        visible={showModalUpdate}
        onClose={() => setShowModalUpdate(false)}
        employee={selectedEmployee}
      />
      <EmployeeFormCreateModal
        visible={showModalCreate}
        onClose={() => setShowModalCreate(false)}
      />
      <div className="header">
        <h2>Danh sách Nhân viên</h2>
        <div className="actions">
          <button className="btn add" onClick={handleCreate}>
            + Thêm nhân viên mới
          </button>
          <button className="btn export">Xuất ▼</button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="all">Tất cả phòng ban</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      {/* Bảng nhân viên */}
      <div className="table">
        <div className="table-header">
          <div>Tên nhân viên</div>
          <div>Phòng ban</div>
          <div>Vị trí</div>
          <div>Trạng thái</div>
          <div>Hành động</div>
        </div>

        {paginatedEmployees.map((emp) => (
          <div className="table-row" key={emp.id}>
            <div>{emp.fullName}</div>
            {/* <div>{emp.department.departmentName}</div> */}
            <div>tên phòng</div>
            {/* <div>{emp.position}</div> */}
            <div>tên vị trí</div>
            {/* <div
              className={`status ${
                emp.status === "active" ? "active" : "inactive"
              }`}
            >
              {emp.status === "active" ? "Hoạt động" : "Không hoạt động"}
            </div> */}
            <div>hành động</div>
            <div>
              <button className="btn edit" onClick={() => handleEdit(emp.id)}>
                Chỉnh sửa
              </button>
              <button
                className="btn disable"
                onClick={() => handleDisable(emp.id)}
              >
                Vô hiệu hóa
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
      {/* test message */}
      {/* <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Thêm nhân viên thành công.
        </Alert> */}
    </div>
  );
}
// npm install @mui/material @emotion/react @emotion/styled
{
  /* <Alert severity="success">
  <AlertTitle>Success</AlertTitle>
  This is a success Alert with an encouraging title.
</Alert>
<Alert severity="info">
  <AlertTitle>Info</AlertTitle>
  This is an info Alert with an informative title.
</Alert>
<Alert severity="warning">
  <AlertTitle>Warning</AlertTitle>
  This is a warning Alert with a cautious title.
</Alert>
<Alert severity="error">
  <AlertTitle>Error</AlertTitle>
  This is an error Alert with a scary title.
</Alert> */
}
export default EmployeeList;
