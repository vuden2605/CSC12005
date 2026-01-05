import { useEffect, useState } from "react";
import "./style.scss";
import { HRService } from "../../services/HRService";
import { formatCurrencyVND } from "../../Utils/formatCurrency";
import { useAlert } from "../../context/AlertContext";
import { Pagination } from "../../components/Pagination";
import { SalaryDetailModal } from "../../components/modals/SalaryDetailModal/SalaryDetailModal";

export const HRPayRoll = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [yearError, setYearError] = useState("");
  const [selectedSalary, setSelectedSalary] = useState(null);

  const [filters, setFilters] = useState({
    month: "",
    year: "",
    employeeName: "",
    status: "",
  });

  const fetchSalaries = async () => {
    try {
      const queryParams = {
        status: filters.status || undefined,
        month: filters.month || undefined,
        year: filters.year || undefined,
        employeeName: filters.employeeName || undefined,
        page,
        size: pageSize,
        sortBy: "id",
        direction: "ASC",
      };

      const res = await HRService.getAllSalaries(queryParams);

      setData(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [page, pageSize, filters]);
  const FilterReset = () => {
    setFilters({
      month: "",
      year: "",
      employeeName: "",
      status: "",
    });
    setYearError("");
  };
  // xuất bảng lương
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const { showAlert } = useAlert();
  const handleCreatePayroll = async () => {
    try {
      await HRService.createPayroll(currentMonth, currentYear);
      showAlert("success", "Create payroll success");
      fetchSalaries();
    } catch (err) {
      showAlert("error", err.message);
    }
  };
  //thanh toán lương
  const handlePaySalary = async () => {
  try {
    await HRService.paySalary(currentMonth, currentYear);
    showAlert("success", "Pay salary successfully");
    fetchSalaries(); // reload bảng lương
  } catch (err) {
    showAlert("error", err.message);
  }
};

  return (
    <div className="dashboard-page payroll-page">
      {/* FILTER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="payroll-filter">
          <span className="title">BẢNG LƯƠNG</span>

          <select
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          >
            <option value="">Tháng</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <div className="year-field">
            <input
              type="number"
              placeholder="Năm"
              min={2000}
              max={2100}
              value={filters.year}
              onChange={(e) => {
                const year = e.target.value;

                if (year && (year < 2000 || year > 2026)) {
                  setYearError("Năm phải từ 2000 đến 2026 ");
                } else {
                  setYearError("");
                }

                setFilters({ ...filters, year });
              }}
            />
            <span className={`error ${yearError ? "show" : ""}`}>
              {yearError || "placeholder"}
            </span>
          </div>

          <input
            type="text"
            placeholder="Tên nhân viên"
            value={filters.employeeName}
            onChange={(e) =>
              setFilters({
                ...filters,
                employeeName: e.target.value,
              })
            }
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >

            <option value="">Tất cả trạng thái</option>
            <option value="DRAFT">Nháp</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="PAID">Đã thanh toán</option>
          </select>

          <button onClick={FilterReset}>Reset</button>

          <button onClick={handlePaySalary}>Phát lương</button>
        </div>
        <button className="payroll-button" onClick={handleCreatePayroll}>
          Xuất bảng lương {currentMonth}/{currentYear}
        </button>
      </div>
      {/* TABLE */}
      <div className="payroll-table">
        <h3>NHÂN VIÊN</h3>

        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Nhân viên</th>
              <th>Thời gian</th>
              <th>Vị trí</th>
              <th>Lương</th>
              <th>Số giờ</th>
              <th>Trạng thái</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-data">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const status = item.status; // DRAFT, APPROVED, PAID

                const getStatusLabel = (s) => {
                  if (s === "DRAFT") return "Nháp";
                  if (s === "APPROVED") return "Đã duyệt";
                  if (s === "PAID") return "Đã thanh toán";
                  return s || "-";
                };

                const getStatusClass = (s) => {
                  if (s === "PAID") return "done";
                  if (s === "APPROVED") return "approved";
                  return "pending"; // DRAFT hoặc khác
                };

                const displaySalary =
                  item.netSalary || item.grossSalary || item.actualSalary || item.baseSalary || 0;

                const workHours =
                  item.attendanceSummary?.totalWorkHours ?? item.workTime ?? 0;

                return (
                <tr key={item.id}>
                  <td>{index + 1 + page * 10}</td>
                  <td>
                    <div className="emp-info">
                      <span className="name">
                        {item.employeeName} ({item.employeeCode})
                      </span>
                      <span className="email">{item.positionName}</span>
                    </div>
                  </td>
                  <td>
                    {item.month}/{item.year}
                  </td>
                  <td>{item.positionName}</td>
                  <td>{formatCurrencyVND(displaySalary)}</td>
                  <td>{workHours}</td>
                  <td>
                    <span
                      className={`status ${getStatusClass(status)}`}
                    >

                      {getStatusLabel(status)}

                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-view-detail"
                      onClick={() => setSelectedSalary(item)}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              )})
            )}
          </tbody>
        </table>

        {/* PAGINATION */}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalElements={totalElements}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(0);
          }}
        />

      </div>
      {selectedSalary && (
        <SalaryDetailModal
          salary={selectedSalary}
          onClose={() => setSelectedSalary(null)}
        />
      )}
    </div>
  );
};
