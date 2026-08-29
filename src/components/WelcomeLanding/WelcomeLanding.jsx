import React from "react";
import { CalendarDays, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import "./WelcomeLanding.css";
import unionLogo from "../../../img/img2.png";

export default function WelcomeLanding({ onCheckIn }) {
  const handleCheckIn = () => {
    if (onCheckIn) {
      onCheckIn();
      return;
    }
    window.location.href = "/checkin";
  };

  return (
    <main className="welcome-page">
      <section className="welcome-content">
        <header className="welcome-header">
          <div className="logo-glow">
            <img
              src={unionLogo}
              className="union-logo"
              alt="Đoàn TNCS Hồ Chí Minh"
            />
          </div>

          <div className="congress-title">
            <h1>ĐẠI HỘI</h1>
            <h2>CHI ĐOÀN</h2>
            <h2 className="district-title">TỔ DÂN PHỐ SỐ 9</h2>
          </div>

          <div className="term">NHIỆM KỲ 2026 – 2027</div>

          <div className="slogan">
            <span className="slogan-line" />
            <p>
              ĐOÀN KẾT - KHÁT VỌNG
              <br />
              BẢN LĨNH – SÁNG TẠO - TIÊN PHONG
            </p>
          </div>
        </header>

        <section className="bottom-zone">
          <div className="congress-info">
            <div className="info-item">
              <CalendarDays />
              <strong>29/08/2026</strong>
              <span>Thời gian</span>
            </div>

            <div className="info-divider" />

            <div className="info-item">
              <MapPin />
              <strong>
                Nhà văn hóa
                <br />
                TDP số 4
              </strong>
              <span>Địa điểm</span>
            </div>

          </div>

          <button className="checkin-button" onClick={handleCheckIn}>
            <span>CHECK-IN ĐẠI HỘI</span>
            <ArrowRight size={21} />
          </button>

          <div className="scroll-indicator">
            <ChevronDown size={20} />
          </div>
        </section>
      </section>
    </main>
  );
}
