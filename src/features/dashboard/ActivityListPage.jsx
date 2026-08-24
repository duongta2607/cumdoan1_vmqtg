import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp } from 'lucide-react';
import unionLogo from '../../../img/img2.png';
import { ACTIVITY_POSTS } from './data/dashboardContent';
import './ActivityListPage.css';

const INITIAL_POST_COUNT = 5;
const LOAD_MORE_COUNT = 3;

export default function ActivityListPage({ onBack, onOpenActivity }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_POST_COUNT);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isReturningToTop = useRef(false);
  const visiblePosts = ACTIVITY_POSTS.slice(0, visibleCount);
  const hasMorePosts = visibleCount < ACTIVITY_POSTS.length;

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
  }, []);

  const scrollToTop = () => {
    isReturningToTop.current = true;
    setShowScrollTop(false);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <section className="activity-list-page" aria-labelledby="activity-list-title">
      <header className="activity-list-header">
        <button type="button" onClick={onBack} aria-label="Quay lại Dashboard">
          <ArrowLeft />
        </button>
        <div>
          <span>CHI ĐOÀN TỔ DÂN PHỐ SỐ 9</span>
          <h1 id="activity-list-title">Các hoạt động của Chi đoàn</h1>
        </div>
        <img src={unionLogo} alt="Đoàn TNCS Hồ Chí Minh" />
      </header>

      <div className="activity-list-posts">
        {visiblePosts.map((post) => (
          <article className="activity-list-post" key={post.id}>
            <a
              href={`/activities/${post.id}`}
              onClick={(event) => {
                event.preventDefault();
                onOpenActivity(post.id);
              }}
            >
              <img src={post.image} alt="" />
              <div>
                <span>{post.category}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <time dateTime={post.publishedAt.split('/').reverse().join('-')}>
                  {post.publishedAt}
                </time>
              </div>
            </a>
          </article>
        ))}

        {visiblePosts.length === 0 && (
          <p className="activity-list-empty">Chưa có bài viết hoạt động.</p>
        )}
      </div>

      {hasMorePosts && (
        <button
          className="activity-load-more"
          type="button"
          onClick={() => setVisibleCount((count) => count + LOAD_MORE_COUNT)}
        >
          <span>Hiển thị thêm</span>
          <ArrowDown aria-hidden="true" />
        </button>
      )}

      {showScrollTop && (
        <button
          className="activity-list-scroll-top"
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
