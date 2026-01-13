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
  const [hasPrevMonthPayroll, setHasPrevMonthPayroll] = useState(false);
  const [checkingPrevMonthPayroll, setCheckingPrevMonthPayroll] = useState(false);

  const [filters, setFilters] = useState({
    month: "",
    year: "",
    employeeName: "",
    status: "",
  });

  // xuất bảng lương
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  // Kiểm tra xem tháng trước đã có bảng lương chưa để disable nút
  useEffect(() => {
    const checkPrevPayroll = async () => {
      try {
        setCheckingPrevMonthPayroll(true);
        const res = await HRService.getAllSalaries({
          month: previousMonth,
          year: previousYear,
          page: 0,
          size: 1,
          sortBy: "id",
          direction: "ASC",
        });

        const total =
          res?.totalElements ??
          (Array.isArray(res?.content) ? res.content.length : 0);
        setHasPrevMonthPayroll(total > 0);
      } catch (err) {
        console.error(
          "Error checking previous month payroll:",
          err.message
        );
      } finally {
        setCheckingPrevMonthPayroll(false);
      }
    };

    checkPrevPayroll();
  }, [previousMonth, previousYear]);

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

  const getAllowedBulkStatuses = () => {
    const selectedItems = data.filter((item) =>
      selectedSalaryIds.includes(item.id)
    );

    if (!selectedItems.length) return [];

    if (selectedItems.some((item) => item.status === "PAID")) {
      return [];
    }

    let allowedSet = null;

    selectedItems.forEach((item) => {
      let itemAllowed = [];
      // Chờ duyệt (DRAFT) chỉ được chuyển sang Đã duyệt (APPROVED)
      if (item.status === "DRAFT") itemAllowed = ["APPROVED"];
      // Đã duyệt (APPROVED) chỉ được chuyển sang Đã thanh toán (PAID)
      else if (item.status === "APPROVED") itemAllowed = ["PAID"];

      if (allowedSet === null) {
        allowedSet = new Set(itemAllowed);
      } else {
        const nextSet = new Set();
        itemAllowed.forEach((status) => {
          if (allowedSet.has(status)) nextSet.add(status);
        });
        allowedSet = nextSet;
      }
    });

    return allowedSet ? Array.from(allowedSet) : [];
  };
  const { showAlert } = useAlert();
  const handleCreatePayroll = async () => {
    try {
      // Chỉ cho phép xuất bảng lương tháng trước
      const month = previousMonth;
      const year = previousYear;

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
  setHasPrevMonthPayroll(true);
      fetchSalaries();
    } catch (err) {
      showAlert("error", err.message || "Xuất bảng lương thất bại");
    }
  };
  //thanh toán lương
  const handlePaySalary = async () => {
  try {
    // Thanh toán lương cũng cố định cho tháng trước
    const month = previousMonth;
    const year = previousYear;

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
    if (!selectedSalaryIds.length) {
      showAlert("error", "Vui lòng chọn ít nhất một bảng lương");
      return;
    }

    const selectedItems = data.filter((item) =>
      selectedSalaryIds.includes(item.id)
    );

    if (selectedItems.some((item) => item.status === "PAID")) {
      showAlert(
        "error",
        "Có bảng lương đã thanh toán, không thể cập nhật trạng thái"
      );
      return;
    }

    const allowedStatuses = getAllowedBulkStatuses();

    if (!allowedStatuses.length) {
      showAlert(
        "error",
        "Không có trạng thái hợp lệ để cập nhật cho các bảng lương đã chọn"
      );
      return;
    }

    const targetStatus = allowedStatuses[0];

    try {
      await HRService.updateSalaryStatus(selectedSalaryIds, targetStatus);
      showAlert(
        "success",
        `Cập nhật trạng thái cho ${selectedSalaryIds.length} dòng thành công`
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
            <option value="DRAFT">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="PAID">Đã thanh toán</option>
          </select>

          <button onClick={FilterReset}>Đặt lại</button>

          {/* <button onClick={handlePaySalary}>Phát lương</button> */}
        </div>
        <button
          className="payroll-button"
          onClick={handleCreatePayroll}
          disabled={hasPrevMonthPayroll || checkingPrevMonthPayroll}
        >
          {hasPrevMonthPayroll
            ? `Đã xuất bảng lương tháng ${previousMonth}/${previousYear}`
            : checkingPrevMonthPayroll
            ? "Đang kiểm tra bảng lương..."
            : `Xuất bảng lương tháng trước (${previousMonth}/${previousYear})`}
        </button>
      </div>
      {/* TABLE */}
      <div className="payroll-table">
        <div className="payroll-table-header">
          <h3>NHÂN VIÊN</h3>
          {selectedSalaryIds.length > 0 && (
            <div className="bulk-status-actions">
              {getAllowedBulkStatuses().length === 0 ? (
                <span className="no-bulk-update">
                  Không thể cập nhật trạng thái cho các dòng đã chọn
                </span>
              ) : (
                <button onClick={handleBulkUpdateStatus}>
                  {getAllowedBulkStatuses()[0] === "APPROVED"
                    ? "Cập nhật sang Đã duyệt"
                    : "Cập nhật sang Đã thanh toán"}
                </button>
              )}
            </div>
          )}
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
                  if (s === "DRAFT") return "Chờ duyệt";
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
