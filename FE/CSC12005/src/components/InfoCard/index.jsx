import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { EmployeeService } from "../../services/EmployeeService";
import "./style.scss"

function InfoCard({employee}){
  const [employeeData, setEmployeeData] = useState(employee);
  const [loading, setLoading] = useState(!employee);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Nếu không có employee prop, fetch từ API
    if (!employee) {
      fetchEmployeeInfo();
    }
  }, [employee]);

  const fetchEmployeeInfo = async () => {
    try {
      setLoading(true);
      const data = await EmployeeService.getCurrentUser();
      
      // Map dữ liệu từ API
      // Nếu position là object, extract positionName; nếu là string thì dùng trực tiếp
      let role = "N/A";
      if (typeof data.position === 'object' && data.position !== null) {
        role = data.position.positionName || data.position.name || "N/A";
      } else if (typeof data.position === 'string') {
        role = data.position;
      } else if (data.role) {
        role = data.role;
      }
      
      const mappedData = {
        name: data.fullName || data.name || "N/A",
        role: role,
        avatar: data.avatar || "👨‍💼",
        email: data.email,
        phone: data.phone,
        department: typeof data.department === 'object' ? data.department?.name : data.department
      };
      
      setEmployeeData(mappedData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch employee info:", err);
      setError(err.message);
      // Fallback dữ liệu nếu fetch thất bại
      setEmployeeData({
        name: "N/A",
        role: "N/A",
        avatar: "👨‍💼"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-header">
        <div className="header-content">
          <div className="profile-avatar-large">
            <span className="avatar-emoji">⏳</span>
          </div>
          <div className="profile-info">
            <h1>Đang tải...</h1>
            <p className="role">Vui lòng chờ</p>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div className="profile-header">
      <div className="header-content">
        <div className="profile-avatar-large">
          <span className="avatar-emoji">{employeeData?.avatar || "👨‍💼"}</span>
        </div>
        <div className="profile-info">
          <h1>{employeeData?.name || "N/A"}</h1>
          <p className="role">{employeeData?.role || "N/A"}</p>
        </div>
      </div>
      <button className="send-button">
        <Send size={18} />
      </button>
    </div>
  )
}
export default InfoCard;