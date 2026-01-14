import { useEffect, useState } from "react";
import "./style.scss";
import EmployeeFormUpdateModel from "./EmployeeFormUpdateModal";
import EmployeeFormCreateModal from "./EmployeeFormCreateModal";
import EmployeeImportModal from "./EmployeeImportModal";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { HRService } from "../../services/HRService";
import { Pagination } from "../../components/Pagination";
import Select from "react-select";
import * as XLSX from "xlsx"; // ← THÊM IMPORT

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // ========== FILTERS ==========
  const [filters, setFilters] = useState({
    employeeName: "",
    departmentId: null,
    status: undefined,
  });

  // ========== PAGINATION ==========
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sortBy: "createdAt",
    direction: "DESC",
  });

  // ========== DEPARTMENTS ==========
  const [departments, setDepartments] = useState([]);

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // Modal states
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModalCreate, setShowModalCreate] = useState(false);

  // ========== FETCH DEPARTMENTS ==========
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = [
        { id: 1, departmentName: "Human Resources" },
        { id: 2, departmentName: "Finance" },
        { id: 3, departmentName: "Information Technology" },
        { id: 4, departmentName: "Sales" },
        { id: 5, departmentName: "Marketing" },
        { id: 6, departmentName: "Manufacturing" },
      ];
      setDepartments(data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  // ========== FETCH EMPLOYEES ==========
  useEffect(() => {
    fetchEmployees();
  }, [pagination.page, pagination.size, filters]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await HRService.getAllEmp(filters, pagination);

      if (response && response.content) {
        setEmployees(response.content);
        setTotalElements(response.totalElements || 0);
      } else if (Array.isArray(response)) {
        setEmployees(response);
        setTotalElements(response.length);
      } else {
        setEmployees([]);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("Fetch employees error:", error);
      showAlert("error", "Không thể tải danh sách nhân viên");
      setEmployees([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // ========== EXPORT TO EXCEL (NEW) ==========
  // ========== EXPORT TO EXCEL (UPDATED - Removed Contract Type) ==========
  const handleExport = async () => {
    if (employees.length === 0) {
      showAlert("warning", "Không có dữ liệu để xuất");
      return;
    }

    try {
      setLoading(true);

      // Fetch ALL employees (không phân trang)
      const response = await HRService.getAllEmp(filters, {
        page: 0,
        size: 9999,
        sortBy: "createdAt",
        direction: "DESC",
      });

      const allEmployees =
        response?.content || (Array.isArray(response) ? response : []);

      if (allEmployees.length === 0) {
        showAlert("warning", "Không có dữ liệu để xuất");
        return;
      }

      const genderMap = {
        MALE: "Nam",
        FEMALE: "Nữ",
        OTHER: "Khác",
      };

      const workScheduleMap = {
        FULL_TIME: "Toàn thời gian",
        PART_TIME: "Bán thời gian",
        MORNING_SHIFT: "Ca sáng",
        AFTERNOON_SHIFT: "Ca chiều",
        HYBRID: "Linh hoạt",
        REMOTE: "Làm việc từ xa",
      };

      const maritalStatusMap = {
        SINGLE: "Độc thân",
        MARRIED: "Đã kết hôn",
      };

      const educationLevelMap = {
        COLLEGE: "Cao đẳng",
        UNIVERSITY: "Đại học",
        MASTER: "Thạc sĩ",
        DOCTORATE: "Tiến sĩ",
      };

      // Prepare data for Excel (WITHOUT Contract Type)
      const exportData = allEmployees.map((emp, index) => ({
        STT: index + 1,
        "Họ và tên": emp.fullName || "",
        "Giới tính": genderMap[emp.gender] || emp.gender || "",
        "Ngày sinh": emp.birthDate || "",
        "Số CCCD/CMND": emp.nationalCode || "",
        Email: emp.email || "",
        "Số điện thoại": emp.phone || "",
        "Địa chỉ hiện tại": emp.address || "",
        "Địa chỉ thường trú": emp.permanentAddress || "",
        "Nơi sinh": emp.placeOfBirth || "",
        "Quốc tịch": emp.nationality || "",
        "Tôn giáo": emp.religion || "",
        "Tình trạng hôn nhân":
          maritalStatusMap[emp.maritalStatus] || emp.maritalStatus || "",
        "Số người phụ thuộc": emp.numberOfDependents || "",
        "Mã số thuế": emp.taxCode || "",

        // Liên hệ khẩn cấp
        "Người liên hệ khẩn cấp": emp.emergencyContactName || "",
        "SĐT khẩn cấp": emp.emergencyContactPhone || "",
        "Mối quan hệ": emp.emergencyContactRelationship || "",

        // Học vấn
        "Trình độ học vấn":
          educationLevelMap[emp.educationLevel] || emp.educationLevel || "",
        "Chuyên ngành": emp.major || "",
        Trường: emp.university || "",
        "Năm tốt nghiệp": emp.graduationYear || "",
        "Bằng cấp": emp.degree || "",

        // Ngân hàng
        "Ngân hàng": emp.bankName || "",
        "Số tài khoản": emp.bankAccount || "",
        "Chi nhánh": emp.bankBranch || "",

        // Công việc
        "Phòng ban": emp.department?.departmentName || "",
        "Vị trí": emp.position?.positionName || "",
        "Lương cơ bản": emp.baseSalary
          ? emp.baseSalary.toLocaleString("vi-VN")
          : "",
        "Ngày bắt đầu làm": emp.hireDate || "",
        // ❌ REMOVED: "Loại hợp đồng"
        "Lịch làm việc":
          workScheduleMap[emp.workSchedule] || emp.workSchedule || "",
        "Ngày bắt đầu HĐ": emp.contractStartDate || "",
        "Ngày kết thúc HĐ": emp.contractEndDate || "",

        // Bảo hiểm
        "Số BHXH": emp.socialInsuranceNumber || "",
        "Số BHYT": emp.healthInsuranceNumber || "",

        "Trạng thái": emp.status ? "Hoạt động" : "Không hoạt động",
        "Ngày tạo": emp.createdAt || "",
      }));

      // Create workbook
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Nhân viên");

      // Set column widths (UPDATED - removed one column)
      worksheet["!cols"] = [
        { wch: 5 }, // STT
        { wch: 25 }, // Họ và tên
        { wch: 10 }, // Giới tính
        { wch: 12 }, // Ngày sinh
        { wch: 15 }, // CCCD
        { wch: 30 }, // Email
        { wch: 15 }, // SĐT
        { wch: 35 }, // Địa chỉ hiện tại
        { wch: 35 }, // Địa chỉ thường trú
        { wch: 20 }, // Nơi sinh
        { wch: 15 }, // Quốc tịch
        { wch: 15 }, // Tôn giáo
        { wch: 15 }, // Hôn nhân
        { wch: 10 }, // Số người phụ thuộc
        { wch: 15 }, // MST
        { wch: 25 }, // Người liên hệ
        { wch: 15 }, // SĐT khẩn cấp
        { wch: 15 }, // Mối quan hệ
        { wch: 15 }, // Trình độ
        { wch: 20 }, // Chuyên ngành
        { wch: 25 }, // Trường
        { wch: 12 }, // Năm tốt nghiệp
        { wch: 15 }, // Bằng cấp
        { wch: 15 }, // Ngân hàng
        { wch: 15 }, // STK
        { wch: 20 }, // Chi nhánh
        { wch: 20 }, // Phòng ban
        { wch: 20 }, // Vị trí
        { wch: 15 }, // Lương
        { wch: 12 }, // Ngày bắt đầu
        // ❌ REMOVED:  Loại hợp đồng column
        { wch: 15 }, // Lịch LV
        { wch: 12 }, // Ngày bắt đầu HĐ
        { wch: 12 }, // Ngày kết thúc HĐ
        { wch: 15 }, // BHXH
        { wch: 15 }, // BHYT
        { wch: 15 }, // Trạng thái
        { wch: 20 }, // Ngày tạo
      ];

      // Generate file name with current date
      const now = new Date();
      const fileName = `DanhSachNhanVien_${now.getDate()}-${
        now.getMonth() + 1
      }-${now.getFullYear()}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, fileName);

      showAlert(
        "success",
        `Đã xuất ${allEmployees.length} nhân viên ra Excel! `
      );
    } catch (error) {
      console.error("Export error:", error);
      showAlert("error", `Lỗi xuất Excel: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ========== OTHER HANDLERS ==========
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 0 });
    fetchEmployees();
  };

  const handleReset = () => {
    setFilters({
      employeeName: "",
      departmentId: null,
      status: undefined,
    });
    setPagination({
      page: 0,
      size: 10,
      sortBy: "createdAt",
      direction: "DESC",
    });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleUpdateStatus = async (id) => {
    try {
      const updatedEmployee = await HRService.UpdateStatusEmp(id);

      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) => (emp.id === id ? updatedEmployee : emp))
      );

      showAlert(
        "success",
        updatedEmployee.status
          ? "Kích hoạt nhân viên thành công"
          : "Vô hiệu hóa nhân viên thành công"
      );
    } catch (error) {
      showAlert("error", error.message);
    }
  };

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

  const handleOpenCreateModal = () => {
    setShowModalCreate(true);
  };

  const handleCreateEmployee = async (employeeData) => {
    try {
      setLoading(true);

      const requestData = {
        fullName: employeeData.fullName,
        gender: employeeData.gender,
        email: employeeData.email,
        phone: employeeData.phone,
        birthDate: employeeData.birthDate,
        nationalCode: employeeData.nationalCode,
        taxCode: employeeData.taxCode,
        address: employeeData.address,
        emergencyContactPhone: employeeData.emergencyContactPhone || null,
        emergencyContactName: employeeData.emergencyContactName || null,
        emergencyContactRelationship:
          employeeData.emergencyContactRelationship || null,
        placeOfBirth: employeeData.placeOfBirth || null,
        nationality: employeeData.nationality || null,
        religion: employeeData.religion || null,
        permanentAddress: employeeData.permanentAddress || null,
        maritalStatus: employeeData.maritalStatus || null,
        educationLevel: employeeData.educationLevel || null,
        major: employeeData.major || null,
        university: employeeData.university || null,
        graduationYear: employeeData.graduationYear || null,
        degree: employeeData.degree || null,
        numberOfDependents: employeeData.numberOfDependents || null,
        bankName: employeeData.bankName,
        bankAccount: employeeData.bankAccount,
        bankBranch: employeeData.bankBranch || null,
        baseSalary: employeeData.baseSalary,
        departmentId: employeeData.departmentId,
        positionId: employeeData.positionId,
        hireDate: employeeData.hireDate || null,
        contractStartDate: employeeData.contractStartDate || null,
        contractEndDate: employeeData.contractEndDate || null,
        contractType: employeeData.contractType || null,
        workSchedule: employeeData.workSchedule || null,
        socialInsuranceNumber: employeeData.socialInsuranceNumber || null,
        healthInsuranceNumber: employeeData.healthInsuranceNumber || null,
        avatarUrl: employeeData.avatarUrl || null,
      };

      Object.keys(requestData).forEach((key) => {
        if (
          requestData[key] === null ||
          requestData[key] === undefined ||
          requestData[key] === ""
        ) {
          delete requestData[key];
        }
      });

      const newEmployee = await HRService.createEmp(requestData);

      setEmployees((prevEmployees) => [newEmployee, ...prevEmployees]);
      setShowModalCreate(false);

      showAlert(
        "success",
        `Thêm nhân viên ${newEmployee.fullName} thành công!`
      );

      setPagination({ ...pagination, page: 0 });
      fetchEmployees();
    } catch (error) {
      console.error("Error creating employee:", error);

      setShowModalCreate(false);
      let errorMessage = error.message;

      if (errorMessage.includes("Email already exists")) {
        errorMessage =
          "Email này đã được sử dụng. Vui lòng sử dụng email khác. ";
      } else if (errorMessage.includes("REQUIRED_")) {
        errorMessage = "Vui lòng điền đầy đủ thông tin bắt buộc.";
      } else if (errorMessage.includes("INVALID_")) {
        errorMessage = "Thông tin không hợp lệ.  Vui lòng kiểm tra lại.";
      }

      showAlert("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImportEmployees = async (file) => {
    try {
      setLoading(true);

      const result = await HRService.importEmployees(file);

      setImportResult(result);
      setShowImportModal(true);

      if (result.successRow > 0) {
        showAlert(
          "success",
          `Import thành công ${result.successRow} nhân viên`
        );
        fetchEmployees();
      }
    } catch (error) {
      showAlert("error", error.message || "Import thất bại");
    } finally {
      setLoading(false);
    }
  };

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

  const handleCloseAlert = () => {
    setAlert({ show: false, type: "success", message: "" });
  };

  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: dept.departmentName,
  }));

  const customStyles = {
    container: (base) => ({
      ...base,
      width: "250px",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "150px",
    }),
  };

  const totalPages = Math.ceil(totalElements / pagination.size);

  return (
    <div className="employee-list">
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
      <div className="header-list">
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

          {/* ========== EXPORT BUTTON (UPDATED) ========== */}
          <button
            className="btn export"
            onClick={handleExport}
            disabled={loading || employees.length === 0}
          >
            Xuất ▼
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={filters.employeeName}
          onChange={(e) =>
            setFilters({ ...filters, employeeName: e.target.value })
          }
        />

        <Select
          options={departmentOptions}
          isClearable
          isSearchable
          placeholder="Chọn phòng ban..."
          value={departmentOptions.find(
            (opt) => opt.value === filters.departmentId
          )}
          styles={customStyles}
          onChange={(opt) =>
            setFilters({
              ...filters,
              departmentId: opt ? opt.value : null,
            })
          }
        />

        <select
          value={
            filters.status === undefined
              ? ""
              : filters.status
              ? "true"
              : "false"
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              status:
                e.target.value === "" ? undefined : e.target.value === "true",
            })
          }
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Hoạt động</option>
          <option value="false">Không hoạt động</option>
        </select>

        <button className="btn btn-secondary" onClick={handleReset}>
          Đặt lại
        </button>
      </div>

      {loading && <div className="loading">Đang xử lý...</div>}

      {/* Table */}
      <div className="table">
        <div className="table-header">
          <div>Mã nhân viên</div>

          <div>Tên nhân viên</div>
          <div>Phòng ban</div>
          <div>Vị trí</div>
          <div>Trạng thái</div>
          <div>Hành động</div>
        </div>

        {employees.length > 0 ? (
          employees.map((emp) => (
            <div className="table-row" key={emp.id}>
              <div>{emp.employeeCode}</div>
              <div>{emp.fullName}</div>
              <div>{emp.department?.departmentName || "Chưa có"}</div>
              <div>{emp.position?.positionName || "Chưa có"}</div>
              <div className={`status ${emp.status ? "active" : "inactive"}`}>
                {emp.status ? "Hoạt động" : "Không hoạt động"}
              </div>
              <div>
                <button
                  className="btn edit"
                  onClick={() => handleEdit(emp.id)}
                  disabled={!emp.status}
                  style={
                    !emp.status
                      ? {
                          backgroundColor: "#ccc",
                          cursor: "not-allowed",
                          opacity: 0.6,
                        }
                      : {}
                  }
                >
                  Chỉnh sửa
                </button>
                <button
                  className="btn disable"
                  onClick={() => handleUpdateStatus(emp.id)}
                >
                  {emp.status ? "Vô hiệu hóa" : "Kích hoạt"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">Không có dữ liệu</div>
        )}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={totalPages}
        pageSize={pagination.size}
        totalElements={totalElements}
        onPageChange={handlePageChange}
        onPageSizeChange={(newSize) =>
          setPagination({ ...pagination, size: newSize, page: 0 })
        }
        loading={loading}
      />
    </div>
  );
}

export default EmployeeList;
