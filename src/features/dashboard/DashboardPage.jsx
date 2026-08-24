import { useEffect, useState } from 'react';
import { FileText, PlayCircle } from 'lucide-react';
import unionLogo from '../../../img/img2.png';
import bannerImage from '../../../img/img3.png';
import galleryImageOne from '../../../img/img4.png';
import galleryImageTwo from '../../../img/img5.jpg';
import galleryImageThree from '../../../img/img6.png';
import galleryImageFour from '../../../img/img12.jpg';
import galleryImageFive from '../../../img/img13.jpg';
import maleAvatar from '../../../img/img10.png';
import femaleAvatar from '../../../img/img11.png';
import congressVideo from '../../../video/video01.mp4';
import { ACTIVITY_POSTS } from './data/dashboardContent';
import DashboardFooter from './DashboardFooter';
import './DashboardPage.css';

const GALLERY_ITEMS = [
  { id: 1, src: galleryImageOne, alt: 'Tuổi trẻ tiên phong chuyển đổi số' },
  { id: 2, src: galleryImageTwo, alt: 'Không gian thành phố số' },
  { id: 3, src: galleryImageThree, alt: 'Không gian Đại hội số' },
  { id: 4, src: galleryImageFour, alt: 'Hình ảnh hoạt động Chi đoàn' },
  { id: 5, src: galleryImageFive, alt: 'Hình ảnh Đại hội Chi đoàn' },
  ...Array.from({ length: 5 }, (_, index) => ({
    id: index + 6,
    src: null,
    alt: `Vị trí ảnh ${index + 6} đang để trống`,
  })),
];

export default function DashboardPage({
  delegate,
  onOpenActivity,
  onOpenActivityList,
  onOpenDocuments,
  onOpenProgram,
  onMenuAction,
}) {
  const [activeNav, setActiveNav] = useState('home');
  const avatar = delegate.gender === 'Nam' ? maleAvatar : femaleAvatar;

  useEffect(() => {
    const targetSection = window.location.hash.slice(1);
    if (!['documents', 'program', 'activities'].includes(targetSection)) {
      setActiveNav('home');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return undefined;
    }

    setActiveNav(targetSection);
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(targetSection)?.scrollIntoView({ block: 'start' });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const navigateSection = (sectionId) => {
    if (sectionId === 'documents') {
      onOpenDocuments();
      return;
    }

    if (sectionId === 'program') {
      onOpenProgram();
      return;
    }

    setActiveNav(sectionId);

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <header className="dashboard-header" id="home">
        <img src={unionLogo} alt="Đoàn TNCS Hồ Chí Minh" />
        <div>
          <span>ĐẠI HỘI CHI ĐOÀN</span>
          <h1 id="dashboard-title">TỔ DÂN PHỐ SỐ 9</h1>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-banner" aria-label="Banner Đại hội">
          <img src={bannerImage} alt="Đại hội Chi đoàn Tổ dân phố số 9" />
        </section>

        <section className="delegate-greeting" aria-label="Thông tin đại biểu">
          <img src={avatar} alt={`Ảnh đại diện ${delegate.gender.toLowerCase()}`} />
          <div>
            <span>Xin chào đồng chí</span>
            <strong>{delegate.name}</strong>
            <small>
              {delegate.role} - {delegate.workplace}
            </small>
          </div>
          <em>Đã check-in</em>
        </section>

        <section className="gallery-section" id="documents" aria-label="Hình ảnh Đại hội">
          <div className="dashboard-gallery" aria-roledescription="carousel">
            {GALLERY_ITEMS.map((item) => (
              <figure
                className={`gallery-item${item.src ? '' : ' gallery-item--empty'}`}
                key={item.id}
                aria-label={item.alt}
              >
                {item.src && <img src={item.src} alt={item.alt} />}
                {!item.src && <span className="sr-only">{item.alt}</span>}
              </figure>
            ))}
          </div>
        </section>

        <section className="dashboard-section video-section" id="program">
          <div className="section-heading">
            <div>
              <PlayCircle aria-hidden="true" />
              <h2>Video Đại hội</h2>
            </div>
          </div>
          <div className="dashboard-video-frame">
            <video controls playsInline preload="metadata" poster={bannerImage}>
              <source src={congressVideo} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
          </div>
        </section>

        <section className="dashboard-section activities-section" id="activities">
          <div className="section-heading">
            <div>
              <FileText aria-hidden="true" />
              <h2>Các hoạt động của Chi đoàn</h2>
            </div>
            <a
              className="activities-view-all"
              href="/activities"
              onClick={(event) => {
                event.preventDefault();
                onOpenActivityList();
              }}
            >
              Xem tất cả
            </a>
          </div>

          <div className="activity-list">
            {ACTIVITY_POSTS.slice(0, 3).map((post) => (
              <article className="activity-card" key={post.id}>
                <a
                  className="activity-card-link"
                  href={`/activities/${post.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onOpenActivity(post.id);
                  }}
                >
                  <img src={post.image} alt="" />
                  <div>
                    <span>{post.category}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <time dateTime={post.publishedAt.split('/').reverse().join('-')}>
                      {post.publishedAt}
                    </time>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>

      <DashboardFooter
        activeItem={activeNav}
        onNavigate={navigateSection}
        onMenuAction={onMenuAction}
      />
    </section>
  );
}
