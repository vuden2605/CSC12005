import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatCurrencyVND } from "../../../Utils/formatCurrency";
import { ManagerService } from "../../../services/ManagerService";
import { Pagination } from "../../Pagination";
import "./style.scss";

const EmployeeDetailModal = ({ employee, open, onClose }) => {
  if (!open || !employee) return null;

  const currentUser = useSelector((state) => state.user.currentUser);
  const role = currentUser?.position?.role?.toUpperCase();
  const canViewSalary = role === "HRM";
  const isActive =
    employee.employmentStatus === "ACTIVE" || employee.status === true;

  const [pointHistories, setPointHistories] = useState([]);
  const [phLoading, setPhLoading] = useState(false);
  const [phError, setPhError] = useState("");
  const now = new Date();
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const yearOptions = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);
  const [phPageIndex, setPhPageIndex] = useState(0);
  const [phPageSize, setPhPageSize] = useState(5);
  const [phTotalPages, setPhTotalPages] = useState(0);
  const [phTotalElements, setPhTotalElements] = useState(0);
  const [monthlyTotalPoints, setMonthlyTotalPoints] = useState(0);

  useEffect(() => {
    const fetchPointHistories = async () => {
      if (!employee?.id) return;
      setPhLoading(true);
      setPhError("");
      try {
        const data = await ManagerService.getEmployeePointHistories(
          employee.id,
          { page: phPageIndex, size: phPageSize, sortBy: "createdAt", direction: "DESC" },
          { year: filterYear, month: filterMonth, type: "REWARD" }
        );
        if (data && Array.isArray(data.content)) {
          setPointHistories(data.content);
          setPhTotalPages(data.totalPages ?? 1);
          setPhTotalElements(data.totalElements ?? data.content.length);
          // Compute monthly total: fetch all items for selected month/year and sum pointChange
          try {
            const sumResp = await ManagerService.getEmployeePointHistories(
              employee.id,
              { page: 0, size: data.totalElements ?? data.content.length, sortBy: "createdAt", direction: "DESC" },
              { year: filterYear, month: filterMonth, type: "REWARD" }
            );
            const items = Array.isArray(sumResp?.content)
              ? sumResp.content
              : Array.isArray(sumResp)
              ? sumResp
              : [];
            const sum = items.reduce((acc, it) => acc + (Number(it.pointChange) || 0), 0);
            setMonthlyTotalPoints(sum);
          } catch {
            const sum = data.content.reduce((acc, it) => acc + (Number(it.pointChange) || 0), 0);
            setMonthlyTotalPoints(sum);
          }
        } else if (Array.isArray(data)) {
          // Non-paged fallback
          setPointHistories(data);
          setPhTotalPages(1);
          setPhTotalElements(data.length);
          const sum = data.reduce((acc, it) => acc + (Number(it.pointChange) || 0), 0);
          setMonthlyTotalPoints(sum);
        } else {
          setPointHistories([]);
          setPhTotalPages(0);
          setPhTotalElements(0);
          setMonthlyTotalPoints(0);
        }
      } catch (err) {
        setPhError(err.message || "Không thể tải lịch sử điểm");
      } finally {
        setPhLoading(false);
      }
    };

    if (open) {
      fetchPointHistories();
    }
  }, [open, employee?.id, filterYear, filterMonth, phPageIndex, phPageSize]);

  return (
    <div className="employee-detail-backdrop" onClick={onClose}>
      <div
        className="employee-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="employee-detail-header">
          <h3>Thông tin nhân viên</h3>
          <button
            type="button"
            className="employee-detail-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="employee-detail-body">
          <div className="detail-row">
            <span className="detail-label">Mã nhân viên</span>
            <span className="detail-value">
              {employee.employeeCode || "N/A"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Họ và tên</span>
            <span className="detail-value">{employee.fullName || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{employee.email || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Số điện thoại</span>
            <span className="detail-value">{employee.phone || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phòng ban</span>
            <span className="detail-value">
              {employee.department?.departmentName || "N/A"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Vị trí</span>
            <span className="detail-value">
              {employee.position?.positionName || "N/A"}
            </span>
          </div>
          {canViewSalary && (
            <div className="detail-row">
              <span className="detail-label">Lương cơ bản</span>
              <span className="detail-value">
                {employee.baseSalary != null
                  ? formatCurrencyVND(employee.baseSalary)
                  : "N/A"}
              </span>
            </div>
          )}
          <div className={`detail-row status-row ${isActive ? "active" : ""}`}>
            <span className="detail-label">Trạng thái</span>
            <span className="detail-value">
              {employee.employmentStatus ||
                (employee.status === true
                  ? "Đang làm việc"
                  : employee.status === false
                  ? "Ngừng làm việc"
                  : "N/A")}
            </span>
          </div>

          <div className="point-history-section">
            <h4>Lịch sử điểm gần đây</h4>
            <div className="ph-filters">
              <div className="ph-filter">
                <span>Tháng</span>
                <select
                  value={filterMonth}
                  onChange={(e) => {
                    setFilterMonth(Number(e.target.value));
                    setPhPageIndex(0);
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="ph-filter">
                <span>Năm</span>
                <select
                  value={filterYear}
                  onChange={(e) => {
                    setFilterYear(Number(e.target.value));
                    setPhPageIndex(0);
                  }}
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="ph-month-total">
                <span>Điểm đã nhận tháng này:</span>
                <strong>+{monthlyTotalPoints}</strong>
              </div>
            </div>
            {phLoading && (
              <div className="ph-status">Đang tải lịch sử điểm...</div>
            )}
            {phError && <div className="ph-error">{phError}</div>}
            {!phLoading && !phError && (
              pointHistories.length > 0 ? (
                <div className="point-history-table-wrapper">
                  <table className="point-history-table">
                    <thead>
                      <tr>
                        <th>Thời gian</th>
                        <th>Thay đổi</th>
                        <th>Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pointHistories.map((ph) => (
                        <tr key={ph.id}>
                          <td>
                            {ph.createdAt
                              ? new Date(ph.createdAt).toLocaleString("vi-VN")
                              : "—"}
                          </td>
                          <td>
                            <span
                              className={`ph-badge ${
                                ph.pointChange > 0
                                  ? "ph-inc"
                                  : ph.pointChange < 0
                                  ? "ph-dec"
                                  : "ph-neutral"
                              }`}
                            >
                              {ph.pointChange > 0
                                ? `+${ph.pointChange}`
                                : ph.pointChange < 0
                                ? `-${Math.abs(ph.pointChange)}`
                                : "0"}
                            </span>
                          </td>
                          <td className="ph-desc">{ph.description || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="ph-empty">Chưa có lịch sử điểm</div>
              )
            )}

            {phTotalPages > 0 && (
              <div className="ph-pagination">
                <Pagination
                  currentPage={phPageIndex}
                  totalPages={phTotalPages}
                  pageSize={phPageSize}
                  totalElements={phTotalElements}
                  onPageChange={(page) => setPhPageIndex(page)}
                  onPageSizeChange={(size) => {
                    setPhPageSize(size);
                    setPhPageIndex(0);
                  }}
                  loading={phLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
