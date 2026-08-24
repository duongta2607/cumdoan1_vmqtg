import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CalendarDays,
  ChevronRight,
  FileText,
  Gamepad2,
  Home,
  Info,
  LogOut,
  Menu,
  MessageCircle,
  X,
} from 'lucide-react';
import unionLogo from '../../../img/img2.png';
import './DashboardFooter.css';

const FOOTER_ITEMS = [
  { id: 'home', label: 'Trang chủ', icon: Home },
  { id: 'documents', label: 'Văn kiện', icon: FileText },
  { id: 'program', label: 'Chương trình', icon: CalendarDays },
  { id: 'activities', label: 'Thêm', icon: Menu },
];

const MORE_MENU_ITEMS = [
  { id: 'about', label: 'Về chúng tôi', icon: Info },
  { id: 'contact', label: 'Liên hệ BTC Đại hội', icon: MessageCircle },
  { id: 'game', label: 'Trò chơi Đại hội', icon: Gamepad2 },
  { id: 'end', label: 'Kết thúc Đại hội', icon: LogOut },
];

export default function DashboardFooter({ activeItem = 'home', onNavigate, onMenuAction }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleFooterItem = (itemId) => {
    if (itemId === 'activities') {
      setMenuOpen(true);
      return;
    }

    onNavigate(itemId);
  };

  const handleMenuItem = (itemId) => {
    setMenuOpen(false);
    onMenuAction?.(itemId);
  };

  return (
    <>
      <nav className="dashboard-footer" aria-label="Điều hướng Dashboard">
        {FOOTER_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeItem === item.id || (item.id === 'activities' && menuOpen);
          return (
            <button
              className={active ? 'active' : ''}
              type="button"
              key={item.id}
              onClick={() => handleFooterItem(item.id)}
              aria-current={activeItem === item.id ? 'page' : undefined}
              aria-expanded={item.id === 'activities' ? menuOpen : undefined}
            >
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {menuOpen && createPortal(
        <div className="more-menu-overlay" role="presentation" onMouseDown={() => setMenuOpen(false)}>
          <aside
            className="more-side-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby="more-menu-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="more-menu-header">
              <div className="more-menu-title">
                <img src={unionLogo} alt="Đoàn TNCS Hồ Chí Minh" />
                <div>
                  <h2 id="more-menu-title">CHI ĐOÀN TỔ DÂN PHỐ SỐ 09</h2>
                  <span>Nhiệm kỳ 2026 – 2027</span>
                </div>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Đóng menu">
                <X />
              </button>
            </header>

            <div className="more-menu-list">
              {MORE_MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    className={item.id === 'end' ? 'more-menu-end' : ''}
                    type="button"
                    key={item.id}
                    onClick={() => handleMenuItem(item.id)}
                  >
                    <span className="more-menu-item-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <strong>{item.label}</strong>
                    <ChevronRight aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </aside>
        </div>,
        document.body,
      )}
    </>
  );
}
