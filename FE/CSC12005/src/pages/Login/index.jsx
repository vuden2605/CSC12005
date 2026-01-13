import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShieldCheck, Users } from "lucide-react";
import logo from "../../assets/images/mbbank-logo.png";
import { AuthService } from "../../services/AuthService";
import { EmployeeService } from "../../services/EmployeeService";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux";
import { useAlert } from "../../context/AlertContext";
const roleRedirects = {
  ADMIN: "/admin",
  MN: "/employee/dashboard/info",
  EMP: "/employee",
  HRM: "/employee/dashboard/info",
};

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const { showAlert } = useAlert();
  // validate form
  const isFormValid = useMemo(() => {
    if (!formData.username || !formData.password) return false;
    // const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return formData.password.length >= 4;
    // const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // return usernameRegex.test(formData.username) && formData.password.length >= 6;
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };
  //redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    console.log("User trong Redux đã thay đổi:", user);
  }, [user]);

  //login
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid || status === "loading") return;

    try {
      setStatus("loading");
      console.log("form data", formData);
      const res = await AuthService.login(formData.username, formData.password);

      console.log("res", res);
      const accessToken = res.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      const userRes = await EmployeeService.getCurrentUser();
      console.log("Current User after login:", userRes);

      dispatch(setUser(userRes)); // lưu user vào Redux
      setStatus("success");
      showAlert("success", "Đăng nhập thành công!");
      const redirectPath = roleRedirects[userRes.position.role] || "/";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      showAlert("error", error.message);
      setStatus("idle");
    }
  };

  return (
    <div className="login-page">
      <section className="login-card">
        <div className="login-card__visual">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="MB Bank logo"
              className="login-card__logo"
              loading="lazy"
            />
          </div>
          <h1 style={{ color: "white" }}>Human Resource Portal</h1>
          <p>
            Nền tảng quản trị nhân sự giúp tối ưu hóa quy trình và kết nối nhân
            viên trong toàn hệ thống.
          </p>

          <ul>
            <li>
              <ShieldCheck size={18} />
              <span style={{ color: "   #405463" }}>
                Xác thực đa lớp & phân quyền chặt chẽ
              </span>
            </li>
            <li>
              <Users size={18} />
              <span style={{ color: "   #405463" }}>
                Theo dõi hồ sơ nhân viên theo thời gian thực
              </span>
            </li>
          </ul>
        </div>

        <div className="login-card__form">
          <header>
            <p className="subtitle">Chào mừng bạn trở lại</p>
            <h2 style={{ color: "#405463" }}>Đăng nhập tài khoản</h2>
            <p className="description">
              Sử dụng tài khoản và mật khẩu nội bộ để tiếp tục.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <span style={{ color: "#405463" }}>Tài khoản</span>
              <input
                type="text"
                name="username"
                placeholder="NVKT00001"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </label>

            <label className="password-field">
              <span style={{ color: "#405463" }}>Mật khẩu</span>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {errorMessage && (
              <div className="form-error" role="alert">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  Đang xác thực...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <footer>
            <p>
              Gặp sự cố? Liên hệ <a href="mailto:hr@mbbank.vn">IT Helpdesk</a>{" "}
              để được hỗ trợ.
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
};
