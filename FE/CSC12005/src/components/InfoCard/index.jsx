import { Send } from "lucide-react";
import "./style.scss"
function InfoCard({employee}){
    
    return(
         <div className="profile-header">
                <div className="header-content">
                  <div className="profile-avatar-large">
                    <span className="avatar-emoji">{employee.avatar}</span>
                  </div>
                  <div className="profile-info">
                    <h1>{employee.name}</h1>
                    <p className="role">{employee.role}</p>
                  </div>
                </div>
                <button className="send-button">
                  <Send size={18} />
                </button>
              </div>
    )
}
export default InfoCard;