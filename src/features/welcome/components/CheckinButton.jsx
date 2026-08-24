import { ArrowRight } from 'lucide-react';

export default function CheckinButton({ onClick }) {
  return (
    <button className="congress-checkin" type="button" onClick={onClick}>
      <span>CHECK-IN ĐẠI HỘI</span>
      <ArrowRight size={20} aria-hidden="true" />
    </button>
  );
}
