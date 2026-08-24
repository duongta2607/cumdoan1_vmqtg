import { ArrowLeft, Phone } from 'lucide-react';
import unionLogo from '../../../img/img2.png';
import DashboardFooter from './DashboardFooter';
import { ORGANIZER_CONTACTS } from './data/organizerContacts';
import './ContactPage.css';

export default function ContactPage({ onBack, onNavigateFooter, onMenuAction }) {
  return (
    <section className="contact-page" aria-labelledby="contact-title">
      <header className="contact-header">
        <button type="button" onClick={onBack} aria-label="Quay lại Dashboard">
          <ArrowLeft />
        </button>
        <div>
          <span>CHI ĐOÀN TỔ DÂN PHỐ SỐ 09</span>
          <h1 id="contact-title">LIÊN HỆ BTC ĐẠI HỘI</h1>
        </div>
        <img src={unionLogo} alt="Đoàn TNCS Hồ Chí Minh" />
      </header>

      <div className="contact-intro">
        <h2>Thông tin Ban tổ chức</h2>
        <p>Vui lòng liên hệ các đồng chí dưới đây khi cần hỗ trợ về Đại hội.</p>
      </div>

      <div className="organizer-contact-list">
        {ORGANIZER_CONTACTS.map((contact) => (
          <article className="organizer-contact-card" key={contact.id}>
            <img src={contact.avatar} alt={`Ảnh đại diện đồng chí ${contact.name}`} />
            <div>
              <span>Đồng chí</span>
              <h2>{contact.name}</h2>
              <p>{contact.role}</p>
              <a href={`tel:${contact.phoneHref}`} aria-label={`Gọi cho đồng chí ${contact.name}`}>
                <Phone aria-hidden="true" />
                <span>{contact.phone}</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      <DashboardFooter
        activeItem="activities"
        onNavigate={onNavigateFooter}
        onMenuAction={onMenuAction}
      />
    </section>
  );
}
