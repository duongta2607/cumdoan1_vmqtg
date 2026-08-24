import { Mail, X } from 'lucide-react';

export default function ThankYouModal({ name, onClose }) {
  return (
    <div className="modal-bg" onClick={onClose} role="presentation">
      <div className="letter" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="letter-title">
        <X className="close" onClick={onClose} aria-label="Đóng thư" />
        <Mail size={30} color="#0864bd" />
        <h2 id="letter-title">Thư cảm ơn</h2>
        <p>Kính gửi Đồng chí <b>{name}</b>,</p>
        <p>Chi đoàn Tổ dân phố số 9 trân trọng cảm ơn đồng chí đã đến tham dự Đại hội.</p>
        <strong>Trân trọng,<br />Ban tổ chức Đại hội</strong>
      </div>
    </div>
  );
}
