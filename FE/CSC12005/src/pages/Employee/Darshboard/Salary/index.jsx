import { useEffect, useState } from "react";
import "./style.scss";
import { formatCurrencyVND } from "../../../../Utils/formatCurrency";
import { EmployeeService } from "../../../../services/EmployeeService";

export const Salary = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [yearError, setYearError] = useState("");

  const [filters, setFilters] = useState({
    month: "",
    year: "",
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

      const res = await EmployeeService.getMySalaries(filterPayload, {
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
      status: "",
    });
    setYearError("");
  };


  return (
    <div className="dashboard-page payroll-page">
      {/* FILTER */}
      <div className="payroll-filter">
        <span className="title">Bảng lương</span>

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

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Trạng thái</option>
          <option value="true">Đã thanh toán</option>
          <option value="false">Đang thanh toán</option>
        </select>

        <button onClick={FilterReset}>Đặt lại</button>
      </div>

      {/* TABLE */}
      <div className="payroll-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Thời gian</th>
              <th>Lương</th> <th>Số giờ</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + page * 10}</td>

                  <td>
                    {item.month}/{item.year}
                  </td>
                  <td>{formatCurrencyVND(item.totalPay)}</td>
                  <td>{item.workTime}</td>
                  <td>
                    <span
                      className={`status ${item.status ? "done" : "pending"}`}
                    >
                      {item.status ? "Đã thanh toán" : "Đang thanh toán"}
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
            Trước
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
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};
