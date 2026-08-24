import DigitalBackground from '../features/welcome/components/DigitalBackground';
import HeroHeader from '../features/welcome/components/HeroHeader';
import CongressInfo from '../features/welcome/components/CongressInfo';
import CheckinButton from '../features/welcome/components/CheckinButton';
import ScrollIndicator from '../features/welcome/components/ScrollIndicator';
import './WelcomePage.css';

export default function WelcomePage({ onCheckin }) {
  return (
    <section className="welcome-page" aria-labelledby="congress-title">
      <DigitalBackground />
      <div className="welcome-page__content">
        <HeroHeader />
        <div className="welcome-page__actions">
          <CongressInfo />
          <CheckinButton onClick={onCheckin} />
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}
