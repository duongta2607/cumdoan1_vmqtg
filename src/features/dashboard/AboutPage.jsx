import {
  ArrowLeft,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import unionLogo from '../../../img/img2.png';
import activityImageOne from '../../../img/img12.jpg';
import activityImageTwo from '../../../img/img13.jpg';
import activityImageThree from '../../../img/img4.png';
import activityImageFour from '../../../img/img5.jpg';
import DashboardFooter from './DashboardFooter';
import ScrollToTopButton from './ScrollToTopButton';
import './AboutPage.css';

const ABOUT_SECTIONS = [
  {
    id: 'formation',
    icon: Users,
    title: 'Một tập thể trẻ cùng chung khát vọng',
    content: 'Được hình thành trong bối cảnh sắp xếp, sáp nhập và kiện toàn tổ chức, Chi đoàn Tổ dân phố số 9 là một tập thể còn non trẻ, với những đoàn viên đến từ nhiều môi trường, lĩnh vực khác nhau nhưng cùng gặp nhau ở tinh thần đoàn kết, nhiệt huyết và khát vọng cống hiến của tuổi trẻ.',
  },
  {
    id: 'development',
    icon: TrendingUp,
    title: 'Từng bước xây dựng và trưởng thành',
    content: 'Những ngày đầu của một tổ chức mới luôn đặt ra không ít khó khăn và thử thách. Tuy nhiên, bằng tinh thần trách nhiệm và sự chủ động của mỗi đoàn viên, Chi đoàn đã nhanh chóng ổn định tổ chức, từng bước xây dựng nền nếp hoạt động và hoàn thành tốt các nhiệm vụ được Đoàn cấp trên và địa phương giao phó.',
  },
  {
    id: 'community',
    icon: HeartHandshake,
    title: 'Đồng hành cùng cộng đồng',
    content: 'Không chỉ thực hiện nhiệm vụ chính trị, Chi đoàn luôn xác định chăm lo, đồng hành cùng đoàn viên, thanh thiếu nhi và phục vụ cộng đồng là một trong những nhiệm vụ quan trọng. Những chương trình ý nghĩa đã mang đến niềm vui, đồng thời lan tỏa hình ảnh đẹp của màu áo xanh thanh niên trong khu dân cư.',
  },
  {
    id: 'volunteer',
    icon: Sparkles,
    title: 'Phát huy vai trò xung kích',
    content: 'Trong các phong trào tại địa phương, đoàn viên Chi đoàn luôn nỗ lực phát huy vai trò xung kích, tình nguyện và trách nhiệm của tuổi trẻ. Mỗi đoàn viên đang từng ngày góp một phần sức trẻ của mình vào công cuộc xây dựng khu dân cư đoàn kết, văn minh và nghĩa tình.',
  },
  {
    id: 'innovation',
    icon: Lightbulb,
    title: 'Năng lượng mới, ý tưởng mới',
    content: 'Là một Chi đoàn mới, chúng tôi hiểu rằng phía trước vẫn còn một hành trình dài để xây dựng và trưởng thành. Nhưng chính sự non trẻ ấy cũng mang đến nguồn năng lượng mới, những ý tưởng mới và một tinh thần sẵn sàng đổi mới.',
  },
  {
    id: 'mission',
    icon: Target,
    title: 'Định hướng nhiệm kỳ 2026 – 2027',
    content: 'Chi đoàn xác định tiếp tục đổi mới nội dung và phương thức hoạt động; tăng cường ứng dụng công nghệ, chuyển đổi số trong công tác Đoàn; tạo môi trường để đoàn viên được kết nối, rèn luyện và phát huy năng lực; đồng thời đưa sức trẻ đến gần hơn với những nhu cầu thiết thực của người dân và cộng đồng.',
  },
];

const CORE_VALUES = [
  { label: 'Đoàn kết', icon: Users },
  { label: 'Khát vọng', icon: Sparkles },
  { label: 'Bản lĩnh', icon: ShieldCheck },
  { label: 'Sáng tạo', icon: Lightbulb },
  { label: 'Tiên phong', icon: Target },
];

const ACTIVITY_IMAGES = [
  { src: activityImageOne, alt: 'Hoạt động văn hóa của Chi đoàn' },
  { src: activityImageTwo, alt: 'Hoạt động cộng đồng của Chi đoàn' },
  { src: activityImageThree, alt: 'Tuổi trẻ tiên phong chuyển đổi số' },
  { src: activityImageFour, alt: 'Hoạt động xây dựng khu dân cư' },
];

export default function AboutPage({ onBack, onNavigateFooter, onMenuAction }) {
  return (
    <section className="about-page" aria-labelledby="about-title">
      <header className="about-header">
        <button type="button" onClick={onBack} aria-label="Quay lại Dashboard">
          <ArrowLeft />
        </button>
        <div>
          <span>CHI ĐOÀN TỔ DÂN PHỐ SỐ 09</span>
          <h1 id="about-title">VỀ CHÚNG TÔI</h1>
        </div>
        <img src={unionLogo} alt="Đoàn TNCS Hồ Chí Minh" />
      </header>

      <div className="about-content">
        <section
          className="about-hero-visual"
          role="img"
          aria-label="Tập thể đoàn viên Chi đoàn Tổ dân phố số 9"
        />

        <section className="about-opening">
          <span>CHI ĐOÀN TỔ DÂN PHỐ SỐ 9</span>
          <h2>SỨC TRẺ TỪ MỘT HÀNH TRÌNH MỚI</h2>
          <p>Khát vọng dựng xây tương lai bằng tinh thần đoàn kết, trách nhiệm và tiên phong.</p>
        </section>

        <div className="about-story-list">
          {ABOUT_SECTIONS.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={section.id}>
                <section className="about-story-item">
                  <span className="about-story-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <div>
                    <h2>{section.title}</h2>
                    <p>{section.content}</p>
                  </div>
                </section>

                {index === 2 && (
                  <div className="about-activity-gallery" aria-label="Hình ảnh hoạt động Chi đoàn">
                    {ACTIVITY_IMAGES.map((image) => (
                      <img src={image.src} alt={image.alt} key={image.src} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <section className="about-values">
          <span>VỚI PHƯƠNG CHÂM</span>
          <div>
            {CORE_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.label}>
                  <Icon aria-hidden="true" />
                  <strong>{value.label}</strong>
                </article>
              );
            })}
          </div>
        </section>

        <section className="about-manifesto">
          <p>CHÚNG TÔI CÓ THỂ LÀ MỘT CHI ĐOÀN NON TRẺ VỀ TUỔI ĐỜI,</p>
          <strong>NHƯNG KHÔNG NON TRẺ</strong>
          <span>TRONG KHÁT VỌNG CỐNG HIẾN!</span>
          <small>Một tập thể mới – Một hành trình mới – Một khát vọng mới.</small>
        </section>
      </div>

      <ScrollToTopButton aboveFooter />
      <DashboardFooter
        activeItem="activities"
        onNavigate={onNavigateFooter}
        onMenuAction={onMenuAction}
      />
    </section>
  );
}
