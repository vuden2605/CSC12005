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
  const [selectedSalaryIds, setSelectedSalaryIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");

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
      setSelectedSalaryIds([]);
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

  const toggleSelectAllCurrentPage = () => {
    const currentPageIds = data.map((item) => item.id);
    const allSelected =
      currentPageIds.length > 0 &&
      currentPageIds.every((id) => selectedSalaryIds.includes(id));

    if (allSelected) {
      setSelectedSalaryIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedSalaryIds((prev) => {
        const set = new Set(prev);
        currentPageIds.forEach((id) => set.add(id));
        return Array.from(set);
      });
    }
  };

  const toggleSelectOne = (salaryId) => {
    setSelectedSalaryIds((prev) =>
      prev.includes(salaryId)
        ? prev.filter((id) => id !== salaryId)
        : [...prev, salaryId]
    );
  };
  // xuất bảng lương
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const { showAlert } = useAlert();
  const handleCreatePayroll = async () => {
    try {
      const month = Number(filters.month) || currentMonth;
      const year = Number(filters.year) || currentYear;

      if (!year || year < 2000 || year > 2100) {
        showAlert("error", "Năm không hợp lệ (2000 - 2100)");
        return;
      }

      if (!month || month < 1 || month > 12) {
        showAlert("error", "Tháng không hợp lệ (1 - 12)");
        return;
      }

      await HRService.createPayroll(month, year);
      showAlert("success", `Xuất bảng lương tháng ${month}/${year} thành công`);
      fetchSalaries();
    } catch (err) {
      showAlert("error", err.message || "Xuất bảng lương thất bại");
    }
  };
  //thanh toán lương
  const handlePaySalary = async () => {
  try {
    const month = Number(filters.month) || currentMonth;
    const year = Number(filters.year) || currentYear;

    if (!year || year < 2000 || year > 2100) {
      showAlert("error", "Năm không hợp lệ (2000 - 2100)");
      return;
    }

    if (!month || month < 1 || month > 12) {
      showAlert("error", "Tháng không hợp lệ (1 - 12)");
      return;
    }

    await HRService.paySalary(month, year);
    showAlert("success", `Thanh toán lương tháng ${month}/${year} thành công`);
    fetchSalaries(); // reload bảng lương
  } catch (err) {
    showAlert("error", err.message || "Thanh toán lương thất bại");
  }
};

  const handleBulkUpdateStatus = async () => {
    if (!bulkStatus) {
      showAlert("error", "Vui lòng chọn trạng thái cần cập nhật");
      return;
    }
    if (!selectedSalaryIds.length) {
      showAlert("error", "Vui lòng chọn ít nhất một bảng lương");
      return;
    }

    try {
      await HRService.updateSalaryStatus(selectedSalaryIds, bulkStatus);
      showAlert(
        "success",
        `Cập nhật trạng thái ${bulkStatus} cho ${selectedSalaryIds.length} dòng thành công`
      );
      fetchSalaries();
    } catch (err) {
      showAlert("error", err.message || "Cập nhật trạng thái bảng lương thất bại");
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

          <button onClick={FilterReset}>Đặt lại</button>

          {/* <button onClick={handlePaySalary}>Phát lương</button> */}
        </div>
        <button className="payroll-button" onClick={handleCreatePayroll}>
          Xuất bảng lương {filters.month || currentMonth}/{
            filters.year || currentYear
          }
        </button>
      </div>
      {/* TABLE */}
      <div className="payroll-table">
        <div className="payroll-table-header">
          <h3>NHÂN VIÊN</h3>
          <div className="bulk-status-actions">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
            >
              <option value="">Chọn trạng thái mới</option>
              <option value="DRAFT">Nháp</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="PAID">Đã thanh toán</option>
            </select>
            <button onClick={handleBulkUpdateStatus}>
              Cập nhật trạng thái
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleSelectAllCurrentPage}
                  checked={
                    data.length > 0 &&
                    data
                      .map((item) => item.id)
                      .every((id) => selectedSalaryIds.includes(id))
                  }
                />
              </th>
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
                <td colSpan={9} className="no-data">
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
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSalaryIds.includes(item.id)}
                      onChange={() => toggleSelectOne(item.id)}
                    />
                  </td>
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
          onStatusUpdated={fetchSalaries}
        />
      )}
    </div>
  );
};
