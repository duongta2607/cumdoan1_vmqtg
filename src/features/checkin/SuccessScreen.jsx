import { ArrowRight, Check } from 'lucide-react';
import maleAvatar from '../../../img/img10.png';
import femaleAvatar from '../../../img/img11.png';
import './SuccessScreen.css';

const CONFETTI_COLORS = ['#ff5f78', '#ffd447', '#22e6ff', '#75ff91', '#a98cff', '#ffffff', '#ff9f43'];
const CONFETTI_PIECES = Array.from({ length: 46 }, (_, index) => ({
  left: `${(index * 23 + 7) % 96}%`,
  delay: `${-((index * 0.37) % 5.6)}s`,
  duration: `${4.4 + (index % 7) * 0.28}s`,
  drift: `${((index % 9) - 4) * 12}px`,
  rotation: `${(index * 47) % 180}deg`,
  width: `${4 + (index % 3) * 2}px`,
  height: `${8 + (index % 4) * 2}px`,
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
}));

function CelebrationConfetti() {
  return (
    <div className="success-confetti" aria-hidden="true">
      {CONFETTI_PIECES.map((piece, index) => (
        <i
          className="success-confetti-piece"
          key={index}
          style={{
            left: piece.left,
            '--confetti-color': piece.color,
            '--confetti-delay': piece.delay,
            '--confetti-duration': piece.duration,
            '--confetti-drift': piece.drift,
            '--confetti-rotation': piece.rotation,
            '--confetti-width': piece.width,
            '--confetti-height': piece.height,
          }}
        >
          <span />
        </i>
      ))}
    </div>
  );
}

export default function SuccessScreen({ delegate, onEnter }) {
  const avatar = delegate.gender === 'Nam' ? maleAvatar : femaleAvatar;

  return (
    <section className="success-screen" aria-labelledby="success-title">
      <CelebrationConfetti />

      <div className="success-check" aria-hidden="true">
        <Check />
      </div>

      <header className="success-header">
        <h1 id="success-title">CHECK-IN THÀNH CÔNG!</h1>
        <p>
          Xin chào đồng chí
          <strong>{delegate.name}</strong>
        </p>
      </header>

      <article className="success-welcome-card">
        <img src={avatar} alt={`Ảnh đại diện ${delegate.gender.toLowerCase()}`} />
        <div className="success-thank-you">
          <p>Kính gửi Đồng chí <b>{delegate.name}</b>,</p>
          <p>Mỗi sự hiện diện là một niềm vui, mỗi ý kiến đóng góp là một phần tạo nên thành công của Đại hội.</p>
          <p>Chi đoàn Tổ dân phố số 9 trân trọng cảm ơn đồng chí đã đến tham dự và đồng hành cùng Đại hội.</p>
          <strong>Trân trọng,<br />Ban tổ chức Đại hội</strong>
        </div>
      </article>

      <button className="success-enter-button" type="button" onClick={onEnter}>
        <span>VÀO ĐẠI HỘI</span>
        <ArrowRight aria-hidden="true" />
      </button>
    </section>
  );
}
