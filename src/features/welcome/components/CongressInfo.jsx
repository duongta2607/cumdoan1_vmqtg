import { CalendarDays, MapPin, Users } from 'lucide-react';
import { EVENT_INFO } from '../../../constants/event';

export default function CongressInfo() {
  return (
    <section className="congress-info" aria-label="Thông tin Đại hội">
      <article className="congress-info__item">
        <CalendarDays aria-hidden="true" />
        <strong>{EVENT_INFO.date}</strong>
        <span>Thời gian</span>
      </article>
      <article className="congress-info__item">
        <MapPin aria-hidden="true" />
        <strong>{EVENT_INFO.venue}<br />{EVENT_INFO.venueDetail}</strong>
        <span>Địa điểm</span>
      </article>
      <article className="congress-info__item">
        <Users aria-hidden="true" />
        <strong>{EVENT_INFO.expectedDelegates}</strong>
        <span>Đại biểu</span>
      </article>
    </section>
  );
}
