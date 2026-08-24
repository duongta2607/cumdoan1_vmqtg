import { BadgeCheck, BriefcaseBusiness, Building2, ChevronRight } from 'lucide-react';
import maleAvatar from '../../../img/img10.png';
import femaleAvatar from '../../../img/img11.png';
import './ConfirmationScreen.css';

export default function ConfirmationScreen({ delegate, onConfirm }) {
  const avatar = delegate.gender === 'Nam' ? maleAvatar : femaleAvatar;

  return (
    <section className="confirmation-screen" aria-labelledby="confirmation-title">
      <header className="confirmation-header">
        <h1 id="confirmation-title">XÁC NHẬN THÔNG TIN</h1>
        <p>Vui lòng kiểm tra thông tin đại biểu</p>
      </header>

      <article className="confirmation-card">
        <div className="confirmation-profile">
          <div className="confirmation-avatar">
            <img src={avatar} alt={`Ảnh đại diện ${delegate.gender.toLowerCase()}`} />
          </div>

          <div className="confirmation-identity">
            <h2>{delegate.name}</h2>
            <span>{delegate.type}</span>
          </div>
        </div>

        <dl className="confirmation-details">
          <div className="confirmation-detail">
            <div className="confirmation-detail-icon"><BriefcaseBusiness aria-hidden="true" /></div>
            <div>
              <dt>Chức vụ</dt>
              <dd>{delegate.role}</dd>
            </div>
          </div>

          <div className="confirmation-detail">
            <div className="confirmation-detail-icon"><Building2 aria-hidden="true" /></div>
            <div>
              <dt>Đơn vị công tác</dt>
              <dd>{delegate.workplace}</dd>
            </div>
          </div>

          <div className="confirmation-detail">
            <div className="confirmation-detail-icon"><BadgeCheck aria-hidden="true" /></div>
            <div>
              <dt>Cơ cấu đại biểu</dt>
              <dd>{delegate.type}</dd>
            </div>
          </div>
        </dl>
      </article>

      <p className="confirmation-note">
        Vui lòng xác nhận thông tin trước khi hoàn tất check-in.
      </p>

      <button className="confirmation-button" type="button" onClick={onConfirm}>
        <span>XÁC NHẬN CHECK-IN</span>
        <ChevronRight aria-hidden="true" />
      </button>
    </section>
  );
}
