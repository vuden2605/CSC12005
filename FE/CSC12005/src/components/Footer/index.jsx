import './style.scss';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">CSC</span>
          <div className="footer__meta">
            <p className="footer__title">CSC12005 Portal</p>
            <p className="footer__copy">© {new Date().getFullYear()} CSC. All rights reserved.</p>
          </div>
        </div>

        <div className="footer__links">
          <a href="#" className="footer__link">Trợ giúp</a>
          <a href="#" className="footer__link">Điều khoản</a>
          <a href="#" className="footer__link">Bảo mật</a>
        </div>
      </div>
    </footer>
  );
};