import { ArrowLeft, FileText } from 'lucide-react';
import unionLogo from '../../../img/img2.png';
import DashboardFooter from './DashboardFooter';
import ScrollToTopButton from './ScrollToTopButton';
import { CONGRESS_DOCUMENTS } from './data/documents';
import './DocumentsPage.css';

export default function DocumentsPage({ onBack, onNavigateFooter, onMenuAction }) {
  return (
    <section className="documents-page" aria-labelledby="documents-title">
      <header className="documents-header">
        <button type="button" onClick={onBack} aria-label="Quay lại Dashboard">
          <ArrowLeft />
        </button>
        <div>
          <span>ĐẠI HỘI CHI ĐOÀN TỔ DÂN PHỐ SỐ 9</span>
          <h1 id="documents-title">VĂN KIỆN ĐẠI HỘI</h1>
        </div>
        <img src={unionLogo} alt="Đoàn TNCS Hồ Chí Minh" />
      </header>

      <div className="documents-intro">
        <p>Nhấn “Xem” để mở nội dung tài liệu PDF.</p>
      </div>

      <div className="documents-list">
        {CONGRESS_DOCUMENTS.map((document) => (
          <article className="document-item" key={document.id}>
            <div className="document-file-icon" aria-hidden="true">
              <FileText />
            </div>

            <div className="document-info">
              <h2>{document.title}</h2>
              <span>{document.meta}</span>
            </div>

            {document.published ? (
              <a
                className="document-view-button"
                href={document.path}
                target="_blank"
                rel="noreferrer"
                aria-label={`Xem ${document.title}`}
              >
                Xem
              </a>
            ) : (
              <span className="document-unavailable">Chưa công bố</span>
            )}
          </article>
        ))}
      </div>

      <ScrollToTopButton aboveFooter />
      <DashboardFooter
        activeItem="documents"
        onNavigate={onNavigateFooter}
        onMenuAction={onMenuAction}
      />
    </section>
  );
}
