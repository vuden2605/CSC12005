import { useEffect, useState } from "react";
import "./style.scss";
import { HRService } from "../../services/HRService";
import { formatCurrencyVND } from "../../Utils/formatCurrency";
import { useAlert } from "../../context/AlertContext";

export const HRPayRoll = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [yearError, setYearError] = useState("");

  const [filters, setFilters] = useState({
    month: "",
    year: "",
    employeeName: "",
    status: "",
  });

  const fetchSalaries = async () => {
    try {
      const filterPayload = {
        month: filters.month || null,
        year: filters.year || null,
        employeeName: filters.employeeName || null,
        status: filters.status === "" ? null : filters.status === "true",
      };

      const res = await HRService.getAllSalaries(filterPayload, {
        page,
        size: 10,
      });

      setData(res.content);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [page, filters]);
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
          <span className="title">Payroll</span>

          <select
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          >
            <option value="">Month</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <div className="year-field">
            <input
              type="number"
              placeholder="Year"
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
            placeholder="Employee Name"
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
            <option value="">Status</option>
            <option value="true">Done</option>
            <option value="false">Pending</option>
          </select>

          <button onClick={FilterReset}>reset</button>
          <button onClick={handlePaySalary}>Phát lương</button>
        </div>
        <button className="payroll-button" onClick={handleCreatePayroll}>
          Xuất bảng lương {currentMonth}/{currentYear}
        </button>
      </div>
      {/* TABLE */}
      <div className="payroll-table">
        <h3>EMPLOYEE</h3>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nhân viên</th>
              <th>Thời gian</th>
              <th>Vị trí</th>
              <th>Lương</th>
              <th>Số giờ</th>
              <th>Trạng thái</th>
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
              data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + page * 10}</td>
                  <td>
                    <div className="emp-info">
                      <span className="name">{item.employee.fullName}</span>
                      <span className="email">{item.employee.email}</span>
                    </div>
                  </td>
                  <td>
                    {item.month}/{item.year}
                  </td>
                  <td>{item.employee.positionName}</td>
                  <td>{formatCurrencyVND(item.totalPay)}</td>
                  <td>{item.workTime}</td>
                  <td>
                    <span
                      className={`status ${item.status ? "done" : "pending"}`}
                    >
                      {item.status ? "Done" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i ? "active" : ""}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
