import React, { useEffect, useMemo, useState } from "react";
import "./style.scss";
import { useSelector } from "react-redux";
import InfoCard from "../../../components/InfoCard";
import { ManagerService } from "../../../services/ManagerService";

export const ManagerProjects = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  const managerInfo = useMemo(() => ({
    name: currentUser?.fullName || "Nguyễn Văn Quản Lý",
    role: currentUser?.position?.positionName || "Quản lý",
    avatar: "👨‍💼",
  }), [currentUser]);

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [membersPage, setMembersPage] = useState(null);
  const [empSearch, setEmpSearch] = useState("");
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [assignRole, setAssignRole] = useState("MEMBER"); // LEADER | MEMBER
  const [employeesPage, setEmployeesPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("assign"); // assign | progress

  const selectedProject = useMemo(
    () => (projects || []).find((p) => p.id === Number(selectedProjectId)),
    [projects, selectedProjectId]
  );

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      if (!isNaN(dt)) return dt.toISOString().split("T")[0];
      return String(d).split("T")[0] || String(d);
    } catch {
      return String(d);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page: 0, size: 50, sortBy: "id", direction: "ASC" };
      let res;
      const deptId = currentUser?.department?.id;
      if (deptId) {
        res = await ManagerService.getProjectsByDepartment(deptId, params);
      } else {
        // fallback if department id not present
        res = await ManagerService.getProjectsByManager(currentUser.id, params);
      }
      setProjects(res?.content || res || []);
      if ((res?.content || []).length > 0) {
        setSelectedProjectId((res.content || res)[0].id);
      }
    } catch (err) {
      setError(err.message || "Không tải được danh sách dự án");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (projectId) => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await ManagerService.getProjectMembers(projectId, {
        page: 0,
        size: 50,
      });
      setMembersPage(res);
    } catch (err) {
      setError(err.message || "Không tải được thành viên dự án");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await ManagerService.getEmployeesByManager(
        currentUser.id,
        0,
        50,
        "fullName",
        "ASC"
      );
      setEmployeesPage(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchProjects();
      fetchEmployees();
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMembers(selectedProjectId);
  }, [selectedProjectId]);

  const employees = employeesPage?.content || [];
  const filteredEmployees = employees.filter((e) =>
    e.fullName.toLowerCase().includes(empSearch.toLowerCase()) ||
    e.employeeCode.toLowerCase().includes(empSearch.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selectedProjectId || !selectedEmpId) return;
    try {
      setLoading(true);
      await ManagerService.addProjectMember(selectedProjectId, selectedEmpId, assignRole);
      await fetchMembers(selectedProjectId);
      setSelectedEmpId(null);
      setEmpSearch("");
      alert("Thêm nhân viên vào dự án thành công");
    } catch (err) {
      alert(err.message || "Không thể thêm nhân viên vào dự án");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="projects-container">
      <InfoCard employee={managerInfo} />

      <div className="employee-list-card">
        <div className="card-header" style={{ justifyContent: "space-between" }}>
          <h2 className="card-title">Quản lý dự án</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn-export" onClick={fetchProjects}>↻ Tải lại</button>
          </div>
        </div>

        {/* Project selector */}
        <div style={{ marginBottom: "1rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span>Chọn dự án:</span>
          <select
            value={selectedProjectId || ""}
            onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : null)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}
          >
            {(projects || []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectCode || p.code || `PRJ-${p.id}`} - {p.projectName || p.name || `Dự án #${p.id}`}
              </option>
            ))}
          </select>
        </div>
        {/* Tabs: phân công / tiến độ */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "assign" ? "active" : ""}`}
            onClick={() => setActiveTab("assign")}
          >
            Phân công dự án
          </button>
          <button
            className={`tab-btn ${activeTab === "progress" ? "active" : ""}`}
            onClick={() => setActiveTab("progress")}
          >
            Tiến độ dự án
          </button>
        </div>

        {/* Tab: Tiến độ dự án */}
        {activeTab === "progress" && selectedProject && (
          <div className="project-summary">
            <div className="summary-row">
              <div>
                <div className="summary-title">{selectedProject.projectName || selectedProject.name}</div>
                <div className="summary-sub">
                  Mã: <strong>{selectedProject.projectCode || selectedProject.code}</strong>
                </div>
              </div>
              <div className="summary-badges">
                <span className={`badge-status status-${(selectedProject.status || '').toLowerCase()}`}>{selectedProject.status || "-"}</span>
                <span className={`badge-priority priority-${(selectedProject.priority || '').toLowerCase()}`}>{selectedProject.priority || "-"}</span>
              </div>
            </div>
            <div className="summary-grid">
              <div>
                <div className="label">Phòng ban</div>
                <div className="value">{selectedProject.department?.departmentName || "-"}</div>
              </div>
              <div>
                <div className="label">Leader</div>
                <div className="value">{selectedProject.leader?.fullName || "-"}</div>
              </div>
              <div>
                <div className="label">Bắt đầu</div>
                <div className="value">{formatDate(selectedProject.startDate)}</div>
              </div>
              <div>
                <div className="label">Kết thúc</div>
                <div className="value">{formatDate(selectedProject.endDate)}</div>
              </div>
            </div>
            <div className="progress-wrapper">
              <div className="progress">
                <div className="progress-bar" style={{ width: `${selectedProject.progress_percentage ?? 0}%` }} />
              </div>
              <div className="progress-text">Tiến độ: {selectedProject.progress_percentage ?? 0}%</div>
            </div>
            {selectedProject.description && (
              <div className="desc">{selectedProject.description}</div>
            )}
          </div>
        )}

        {/* Tab: Phân công dự án */}
        {activeTab === "assign" && (
          <>
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Tên nhân viên</th>
                  <th>Vai trò</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="no-data">Đang tải...</td></tr>
                ) : !membersPage || (membersPage.content || membersPage).length === 0 ? (
                  <tr><td colSpan={3} className="no-data">Chưa có thành viên</td></tr>
                ) : (
                  (membersPage.content || membersPage).map((m) => (
                    <tr key={m.employee?.id || m.id}>
                      <td>{m.employee?.employeeCode || m.employeeCode}</td>
                      <td>{m.employee?.fullName || m.fullName}</td>
                      <td>{m.role || m.memberRole}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div style={{ marginTop: "1.25rem" }}>
              <h3 style={{ marginBottom: "0.5rem" }}>Thêm thành viên vào dự án</h3>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân viên theo tên hoặc mã"
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", minWidth: "260px" }}
                />
                <select
                  value={assignRole}
                  onChange={(e) => setAssignRole(e.target.value)}
                  style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}
                >
                  <option value="LEADER">Leader</option>
                  <option value="MEMBER">Member</option>
                </select>
                <button className="btn-export" onClick={handleAssign} disabled={!selectedEmpId || !selectedProjectId}>
                  ➕ Thêm vào dự án
                </button>
              </div>

              {/* Bảng chọn nhân viên */}
              <table className="assign-emp-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Mã NV</th>
                    <th>Tên nhân viên</th>
                    <th>Phòng ban</th>
                    <th>Vị trí</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="no-data">Không tìm thấy nhân viên phù hợp</td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => {
                      const isSelected = emp.id === selectedEmpId;
                      return (
                        <tr
                          key={emp.id}
                          className={isSelected ? "row-selected" : ""}
                          onClick={() => setSelectedEmpId(emp.id)}
                        >
                          <td>
                            <input
                              type="radio"
                              name="selected-emp"
                              checked={isSelected}
                              onChange={() => setSelectedEmpId(emp.id)}
                            />
                          </td>
                          <td>{emp.employeeCode}</td>
                          <td>{emp.fullName}</td>
                          <td>{emp.department?.departmentName}</td>
                          <td>{emp.position?.positionName}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerProjects;
