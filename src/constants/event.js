export const EVENT_INFO = {
  title: 'ĐẠI HỘI CHI ĐOÀN',
  place: 'Tổ dân phố số 9',
  venue: 'Nhà văn hóa',
  venueDetail: 'TDP số 9',
  date: '25/05/2026',
  expectedDelegates: 35,
  term: 'Nhiệm kỳ 2026 – 2027',
  subtitle: 'Xây dựng chi đoàn vững mạnh',
};

export const INITIAL_FORM = {
  name: '',
  gender: '',
  role: '',
  workplace: '',
  type: '',
};

export const FORM_FIELDS = [
  { name: 'name', label: 'HỌ VÀ TÊN', placeholder: 'Nhập họ và tên của bạn', control: 'input' },
  { name: 'gender', label: 'GIỚI TÍNH', control: 'select', emptyOption: '-----' },
  { name: 'role', label: 'CHỨC VỤ', control: 'select' },
  { name: 'workplace', label: 'ĐƠN VỊ CÔNG TÁC', control: 'select' },
];

export const GENDER_TYPES = ['Nam', 'Nữ'];

export const POSITION_TYPES = [
  'Bí thư chi bộ',
  'Trưởng ban công tác mặt trận',
  'Tổ trưởng tổ dân phố',
  'Đại diện các ban ngành, đoàn thể KDC số 09',
  'Đại diện Đoàn phường Văn Miếu - Quốc Tử Giám',
  'Bí thư chi đoàn',
  'Phó bí thư chi đoàn',
  'Uỷ viên Ban chấp hành',
  'Đoàn viên',
  'Khác',
];

export const WORKPLACE_TYPES = [
  'Chi bộ 9',
  'Ban công tác mặt trận KDC số 09',
  'Các ban ngành, đoàn thể KDC số 09',
  'Đoàn TNCS Hồ Chí Minh phường Văn Miếu - Quốc Tử Giám',
  ...Array.from(
    { length: 35 },
    (_, index) => `Chi đoàn ${String(index + 1).padStart(2, '0')}`,
  ),
  'Chi đoàn trường THCS Văn Miếu - Quốc Tử Giám',
  'Khác',
];

export const ROLE_WORKPLACE_MAP = {
  'Bí thư chi bộ': 'Chi bộ 9',
  'Trưởng ban công tác mặt trận': 'Ban công tác mặt trận KDC số 09',
  'Tổ trưởng tổ dân phố': 'Các ban ngành, đoàn thể KDC số 09',
  'Đại diện các ban ngành, đoàn thể KDC số 09': 'Các ban ngành, đoàn thể KDC số 09',
  'Đại diện Đoàn phường Văn Miếu - Quốc Tử Giám': 'Đoàn TNCS Hồ Chí Minh phường Văn Miếu - Quốc Tử Giám',
  'Khác': 'Khác',
};

export const DELEGATE_TYPES = ['Đại biểu chính thức', 'Đại biểu khách mời'];
