import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUp, CalendarDays } from 'lucide-react';
import unionLogo from '../../../img/img2.png';
import { ACTIVITY_POSTS } from './data/dashboardContent';
import './ActivityDetailPage.css';

export default function ActivityDetailPage({ activityId, onBack }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isReturningToTop = useRef(false);
  const activity = ACTIVITY_POSTS.find((post) => post.id === activityId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    const handleScroll = () => {
      if (isReturningToTop.current) {
        setShowScrollTop(false);
        if (window.scrollY <= 8) isReturningToTop.current = false;
        return;
      }

      setShowScrollTop(window.scrollY > 180);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activityId]);

  const scrollToTop = () => {
    isReturningToTop.current = true;
    setShowScrollTop(false);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  if (!activity) {
    return (
      <section className="activity-detail-page activity-detail-page--empty">
        <img src={unionLogo} alt="Đoàn TNCS Hồ Chí Minh" />
        <h1>Không tìm thấy hoạt động</h1>
        <p>Bài viết có thể đã được cập nhật hoặc không còn tồn tại.</p>
        <button type="button" onClick={onBack}>Quay lại trang chủ</button>
      </section>
    );
  }

  const publishedDate = activity.publishedAt.split('/').reverse().join('-');

  return (
    <section className="activity-detail-page" aria-labelledby="activity-detail-title">
      <header className="activity-detail-header">
        <button type="button" onClick={onBack} aria-label="Quay lại Dashboard">
          <ArrowLeft />
        </button>
        <div>
          <span>HOẠT ĐỘNG CHI ĐOÀN</span>
          <strong>CHI ĐOÀN TỔ DÂN PHỐ SỐ 9</strong>
        </div>
        <img src={unionLogo} alt="Đoàn TNCS Hồ Chí Minh" />
      </header>

      <article className="activity-detail-article">
        <img className="activity-detail-cover" src={activity.image} alt={activity.title} />

        <div className="activity-detail-body">
          <span className="activity-detail-category">{activity.category}</span>
          <h1 id="activity-detail-title">{activity.title}</h1>

          <div className="activity-detail-date">
            <CalendarDays aria-hidden="true" />
            <time dateTime={publishedDate}>{activity.publishedAt}</time>
          </div>

          <p className="activity-detail-lead">{activity.excerpt}</p>

          <div className="activity-detail-content">
            {activity.content.map((paragraph, index) => (
              <p key={`${activity.id}-${index}`}>{paragraph}</p>
            ))}
          </div>

          <footer className="activity-detail-signature">
            <span>Thông tin được đăng tải bởi</span>
            <strong>Chi đoàn Tổ dân phố số 9</strong>
          </footer>
        </div>
      </article>

      {showScrollTop && (
        <button
          className="activity-scroll-top"
          type="button"
          onClick={scrollToTop}
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp aria-hidden="true" />
        </button>
      )}
    </section>
  );
}
