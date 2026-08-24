import { EVENT_INFO } from '../../../constants/event';
import youthUnionLogo from '../../../../img/img2.png';

export default function HeroHeader() {
  return (
    <header className="congress-hero">
      <div className="congress-logo">
        <img
          className="congress-logo__image"
          src={youthUnionLogo}
          alt="Biểu trưng Đoàn Thanh niên Cộng sản Hồ Chí Minh"
        />
      </div>
      <h1 className="congress-title" id="congress-title">
        <span className="congress-title__primary">ĐẠI HỘI</span>
        <span className="congress-title__secondary">CHI ĐOÀN</span>
        <span className="congress-title__place">TỔ DÂN PHỐ SỐ 9</span>
      </h1>
      <p className="congress-term">{EVENT_INFO.term}</p>
      <span className="congress-divider" aria-hidden="true" />
      <p className="congress-slogan">
        ĐOÀN KẾT - KHÁT VỌNG <br />
        BẢN LĨNH – SÁNG TẠO - TIÊN PHONG
      </p>
    </header>
  );
}
