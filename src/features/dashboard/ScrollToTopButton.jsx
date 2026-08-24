import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import './ScrollToTopButton.css';

export default function ScrollToTopButton({ aboveFooter = false, resetKey }) {
  const [visible, setVisible] = useState(false);
  const isReturningToTop = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    const handleScroll = () => {
      if (isReturningToTop.current) {
        setVisible(false);
        if (window.scrollY <= 8) isReturningToTop.current = false;
        return;
      }

      setVisible(window.scrollY > 180);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [resetKey]);

  const scrollToTop = () => {
    isReturningToTop.current = true;
    setVisible(false);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      className={`scroll-to-top-button${aboveFooter ? ' scroll-to-top-button--above-footer' : ''}`}
      type="button"
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
    >
      <ArrowUp aria-hidden="true" />
    </button>
  );
}
