import { useEffect, useState } from "react";
import "./style.scss";
import { formatCurrencyVND } from "../../../../Utils/formatCurrency";
import { EmployeeService } from "../../../../services/EmployeeService";
import { SalaryDetailModal } from "../../../../components/modals/SalaryDetailModal/SalaryDetailModal";
import { Pagination } from "../../../../components/Pagination";

export const Salary = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [yearError, setYearError] = useState("");
  const [selectedSalary, setSelectedSalary] = useState(null);

  const [filters, setFilters] = useState({
    month: "",
    year: "",
    status: "",
  });

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const filterPayload = {
        month: filters.month || undefined,
        year: filters.year || undefined,
        status: filters.status || undefined,
      };

      const res = await EmployeeService.getMySalaries(filterPayload, {
        page,
        size: pageSize,
      });

      setData(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || (res.content ? res.content.length : 0));
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [page, pageSize, filters]);
  const FilterReset = () => {
    setFilters({
      month: "",
      year: "",
      status: "",
    });
    setYearError("");
    setPage(0);
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
          <option value="">Tất cả trạng thái</option>
          <option value="DRAFT">Nháp</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="PAID">Đã thanh toán</option>
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
              <th>Chi tiết</th>
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
                  <td>{index + 1 + page * pageSize}</td>

                  <td>
                    {item.month}/{item.year}
                  </td>
                  <td>
                    {formatCurrencyVND(
                      item.netSalary ||
                        item.grossSalary ||
                        item.actualSalary ||
                        item.baseSalary ||
                        0
                    )}
                  </td>
                  <td>{
                    item.attendanceSummary?.totalWorkHours ??
                    item.workTime ??
                    0
                  }</td>
                  <td>
                    {(() => {
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
                        return "pending";
                      };

                      return (
                        <span
                          className={`status ${getStatusClass(status)}`}
                        >
                          {getStatusLabel(status)}
                        </span>
                      );
                    })()}
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
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalElements={totalElements}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
          loading={loading}
        />
      </div>
      {selectedSalary && (
        <SalaryDetailModal
          salary={selectedSalary}
          onClose={() => setSelectedSalary(null)}
          canUpdateStatus={false}
          showQr={false}
          hideEmployeeInfo={true}
        />
      )}
    </div>
  );
};
