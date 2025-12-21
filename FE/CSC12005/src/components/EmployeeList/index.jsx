import { useEffect, useState } from "react";
import "./style.scss";
import EmployeeFormUpdateModel from "./EmployeeFormUpdateModal";
import EmployeeFormCreateModal from "./EmployeeFormCreateModal";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { EmployeeService } from "../../services/EmployeeService";
import { HRService } from "../../services/HRService";
import EmployeeImportModal from "./EmployeeImportModal";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState(null);
  // state cho alert message
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        setLoading(true);
        const data = await HRService.getAllEmp();
        console.log(data);
        setEmployees(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
        showAlert("error", "Không thể tải danh sách nhân viên");
      } finally {
        setLoading(false);
      }
    };
    fetchAllEmployees();
  }, []);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // filter
  const filteredEmployees = employees.filter((emp) => {
    const matchName = emp.fullName.toLowerCase().includes(search.toLowerCase());
    const matchDept =
      departmentFilter === "all" ||
      emp.department?.departmentName === departmentFilter;
    const matchStatus = statusFilter === "all" || emp.status == statusFilter;
    return matchName && matchDept && matchStatus;
  });

  const departments = [
    "Human Resources",
    "Finance",
    "Information Technology",
    "Sales",
    "Marketing",
    "Manufacturing",
  ];

  //  phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  //  đổi trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleUpdateStatus = async (id) => {
    try {
      const updatedEmployee = await HRService.UpdateStatusEmp(id);
      
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === id ? updatedEmployee : emp
        )
      );
      
      showAlert(
        "success", 
        updatedEmployee.status ? "Kích hoạt nhân viên thành công" : "Vô hiệu hóa nhân viên thành công"
      );
    } catch (error) {
      showAlert("error", error.message);
    }
  };

  // modal update
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEdit = (id) => {
    const employee = employees.find((c) => c.id === id);
    setSelectedEmployee(employee);
    setShowModalUpdate(true);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    showAlert("success", "Cập nhật nhân viên thành công!");
  };

  // modal create
  const [showModalCreate, setShowModalCreate] = useState(false);

  const handleOpenCreateModal = () => {
    setShowModalCreate(true);
  };


  const handleCreateEmployee = async (employeeData) => {
    try {
      setLoading(true);

      const requestData = {
        fullName: employeeData.fullName,
        email: employeeData.email,
        phone: employeeData.phone,
        birthDate: employeeData.birthDate,
        nationalCode: employeeData.nationalCode,
        taxCode: employeeData.taxCode,
        bankName: employeeData.bankName,
        bankAccount: employeeData.bankAccount,
        address: employeeData.address,
        baseSalary: employeeData.baseSalary,
        departmentId: employeeData.departmentId,
        positionId: employeeData.positionId,
        avatarUrl: employeeData.avatarUrl || null,
      };

      const newEmployee = await HRService.createEmp(requestData);

      setEmployees((prevEmployees) => [newEmployee, ...prevEmployees]);
      setShowModalCreate(false);

      showAlert(
        "success",
        `Thêm nhân viên ${newEmployee.fullName} thành công!`
      );

      setCurrentPage(1);
    } catch (error) {
      console.error("Error creating employee:", error);

    //show err
      setShowModalCreate(false);
      let errorMessage = error.message;
      if (errorMessage.includes("Email already exists"))
        errorMessage =
          "Email này đã được sử dụng. Vui lòng sử dụng email khác. ";
      showAlert("error", errorMessage);

    } finally {
      setLoading(false);
    }
  };
  const handleImportEmployees = async (file) => {
    try {
      setLoading(true);
  
      const result = await HRService.importEmployees(file);
  
      setImportResult(result); // 👈 lưu kết quả
      setShowImportModal(true); // giữ modal mở
  
      if (result.successRow > 0) {
        showAlert(
          "success",
          `Import thành công ${result.successRow} nhân viên`
        );
  
        // reload danh sách
        const employees = await HRService.getAllEmp();
        setEmployees(Array.isArray(employees) ? employees : []);
      }
    } catch (error) {
      showAlert("error", error.message || "Import thất bại");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  // thông báo
  const showAlert = (type, message) => {
    setAlert({
      show: true,
      type: type,
      message: message,
    });

    setTimeout(() => {
      setAlert({ show: false, type: "success", message: "" });
    }, 5000);
  };

  // close đóng thông báo
  const handleCloseAlert = () => {
    setAlert({ show: false, type: "success", message: "" });
  };

  return (
    <div className="employee-list">
      {/* Alert Message */}
      {alert.show && (
        <div className="alert-container">
          <Alert severity={alert.type} onClose={handleCloseAlert}>
            <AlertTitle>
              {alert.type === "success" && "Thành công"}
              {alert.type === "error" && "Lỗi"}
              {alert.type === "warning" && "Cảnh báo"}
              {alert.type === "info" && "Thông tin"}
            </AlertTitle>
            {alert.message}
          </Alert>
        </div>
      )}

      <EmployeeFormUpdateModel
        visible={showModalUpdate}
        onClose={() => setShowModalUpdate(false)}
        employee={selectedEmployee}
        onUpdate={handleUpdateEmployee}
      />

      <EmployeeFormCreateModal
        visible={showModalCreate}
        onClose={() => setShowModalCreate(false)}
        onCreateEmp={handleCreateEmployee}
        loading={loading}
      />
      <EmployeeImportModal
        visible={showImportModal}
        onClose={() => {
        setShowImportModal(false);
        setImportResult(null);
        }}
        onImport={handleImportEmployees}
        loading={loading}
        importResult={importResult}
      />


      {/* Header */}
      <div className="header">
        <h2>Danh sách Nhân viên</h2>
        <div className="actions">
          <button
            className="btn add"
            onClick={handleOpenCreateModal}
            disabled={loading}
          >
            + Thêm nhân viên mới
          </button>
          <button
            className="btn add"
            onClick={() => setShowImportModal(true)}
            disabled={loading}
          >
            + Thêm nhân viên từ file
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
          {departments?.map((d) => (
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
          <option value="1">Hoạt động</option>
          <option value="0">Không hoạt động</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <div className="loading">Đang xử lý...</div>}

      {/* Bảng nhân viên */}
      <div className="table">
        <div className="table-header">
          <div>Tên nhân viên</div>
          <div>Phòng ban</div>
          <div>Vị trí</div>
          <div>Trạng thái</div>
          <div>Hành động</div>
        </div>

        {paginatedEmployees.length > 0 ? (
          paginatedEmployees.map((emp) => (
            <div className="table-row" key={emp.id}>
              <div>{emp.fullName}</div>
              <div>{emp.department?.departmentName || "Chưa có"}</div>
              <div>{emp.position?.positionName || "Chưa có"}</div>
              <div
                className={`status ${
                  emp.status == "1" ? "active" : "inactive"
                }`}
              >
                {emp.status ? "Hoạt động" : "Không hoạt động"}
              </div>
              <div>
                <button className="btn edit" onClick={() => handleEdit(emp.id)}>
                  Chỉnh sửa
                </button>
                <button
                  className="btn disable"
                  onClick={() => handleUpdateStatus(emp.id)}
                >
                  {emp.status ? "vô hiệu hóa" : "Kích hoạt"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">Không có dữ liệu</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
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
      )}
    </div>
  );
}

export default EmployeeList;
