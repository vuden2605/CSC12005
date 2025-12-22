import React, { useMemo, useState } from "react";
import EmployeeRow from "./EmployeeRow";
import ConfirmModal from "./ConfirmModal";
import "./employeeList.scss";

export default function EmployeeList({
    employees = [],
  onDisableEmployee, // (employeeId) => Promise | void
}) {
const [keyword, setKeyword] = useState("");
const [selected, setSelected] = useState(null);
const [confirmOpen, setConfirmOpen] = useState(false);
const [loading, setLoading] = useState(false);

const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return employees;
    return employees.filter((e) => {
    return (
        e.name.toLowerCase().includes(k) ||
        e.email.toLowerCase().includes(k) ||
        (e.department || "").toLowerCase().includes(k)
    );
    });
}, [employees, keyword]);

const handleDisableClick = (employee) => {
    setSelected(employee);
    setConfirmOpen(true);
};

const handleConfirmDisable = async () => {
    if (!selected) return;
    try {
    setLoading(true);
    await onDisableEmployee?.(selected.id);
    setConfirmOpen(false);
    setSelected(null);
    } finally {
    setLoading(false);
    }
};

return (
    <div className="el-wrap">
    <div className="el-header">
        <div>
            <h3 className="el-title">Quản lý nhân viên</h3>
            <p className="el-sub">HR có thể vô hiệu hóa nhân viên (không xóa dữ liệu).</p>
        </div>

        <input
            className="el-search"
            placeholder="Tìm theo tên / email / phòng ban..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
        />
    </div>

    <div className="el-list">
        {filtered.length === 0 ? (
        <div className="el-empty">Không có nhân viên phù hợp.</div>
        ) : (
        filtered.map((emp) => (
            <EmployeeRow key={emp.id} employee={emp} onDisableClick={handleDisableClick} />
        ))
        )}
    </div>

    <ConfirmModal
        open={confirmOpen}
        title="Xác nhận vô hiệu hóa"
        message={
        selected
            ? `Bạn chắc chắn muốn vô hiệu hóa nhân viên "${selected.name}"? Nhân viên sẽ không thể đăng nhập/hoạt động trên hệ thống.`
            : ""
        }
        confirmText="Vô hiệu hóa"
        loading={loading}
        onClose={() => {
        if (!loading) {
            setConfirmOpen(false);
            setSelected(null);
        }
        }}
        onConfirm={handleConfirmDisable}
    />
    </div>
);
}
    