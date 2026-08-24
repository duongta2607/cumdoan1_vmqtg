import { ArrowLeft, Circle } from 'lucide-react';
import unionLogo from '../../../img/img2.png';
import DashboardFooter from './DashboardFooter';
import ScrollToTopButton from './ScrollToTopButton';
import { PROGRAM_TIMELINE } from './data/programTimeline';
import './TimelineInformation.css';

export default function TimelineInformation({ onBack, onNavigateFooter, onMenuAction }) {
  return (
    <section className="timeline-page" aria-labelledby="timeline-title">
      <header className="timeline-header">
        <button type="button" onClick={onBack} aria-label="Quay lại Dashboard">
          <ArrowLeft />
        </button>
        <div>
          <span>ĐẠI HỘI CHI ĐOÀN TỔ DÂN PHỐ SỐ 9</span>
          <h1 id="timeline-title">CHƯƠNG TRÌNH ĐẠI HỘI</h1>
        </div>
        <img src={unionLogo} alt="Đoàn TNCS Hồ Chí Minh" />
      </header>

      <div className="timeline-intro">
        <p>Thời gian và các nội dung dự kiến của Đại hội.</p>
      </div>

      <ol className="program-timeline">
        {PROGRAM_TIMELINE.map((item) => (
          <li className="program-timeline-item" key={item.id}>
            <div className="program-timeline-marker" aria-hidden="true">
              <Circle />
            </div>
            <time>{item.time}</time>
            <strong>{item.title}</strong>
          </li>
        ))}
      </ol>

      <ScrollToTopButton aboveFooter />
      <DashboardFooter
        activeItem="program"
        onNavigate={onNavigateFooter}
        onMenuAction={onMenuAction}
      />
    </section>
  );
}
