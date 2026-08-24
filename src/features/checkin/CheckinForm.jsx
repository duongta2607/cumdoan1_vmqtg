import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronRight,
  UserRound,
  UsersRound,
} from 'lucide-react';
import {
  DELEGATE_TYPES,
  FORM_FIELDS,
  GENDER_TYPES,
  POSITION_TYPES,
  WORKPLACE_TYPES,
} from '../../constants/event';
import unionLogo from '../../../img/img2.png';
import './CheckinForm.css';

const FIELD_ICONS = {
  name: UserRound,
  gender: UsersRound,
  role: BriefcaseBusiness,
  workplace: Building2,
};

const SELECT_OPTIONS = {
  gender: GENDER_TYPES,
  role: POSITION_TYPES,
  workplace: WORKPLACE_TYPES,
};

export default function CheckinForm({ form, saving, error, fieldErrors, onChange, onSubmit }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const success = await onSubmit();

    if (!success) {
      window.requestAnimationFrame(() => {
        formElement.querySelector('[aria-invalid="true"]')?.focus();
      });
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <header className="form-header">
        <div className="form-logo-glow">
          <img src={unionLogo} alt="Đoàn TNCS Hồ Chí Minh" />
        </div>
        <h2>Thông tin đại biểu</h2>
        <p>Vui lòng điền đầy đủ thông tin để hoàn tất check-in.</p>
      </header>

      {error && <p id="checkin-form-error" className="form-error" role="alert">{error}</p>}

      <div className="form-fields">
        {FORM_FIELDS.map((field, index) => {
          const FieldIcon = FIELD_ICONS[field.name];
          const fieldId = `checkin-${field.name}`;

          return (
            <label
              className="form-field"
              htmlFor={fieldId}
              key={field.name}
              style={{ '--field-delay': `${0.5 + index * 0.09}s` }}
            >
              <span className="field-label">{field.label}</span>
              <span className={`field-control${field.control === 'select' ? ' field-control--select' : ''}`}>
                <FieldIcon aria-hidden="true" />
                {field.control === 'select' ? (
                  <>
                    <select
                      id={fieldId}
                      name={field.name}
                      value={form[field.name]}
                      onChange={onChange}
                      aria-invalid={Boolean(fieldErrors[field.name])}
                      aria-describedby={fieldErrors[field.name] ? `${fieldId}-error` : undefined}
                    >
                      <option value="">{field.emptyOption ?? '-----'}</option>
                      {SELECT_OPTIONS[field.name].map((option) => <option key={option}>{option}</option>)}
                    </select>
                    <ChevronDown className="select-chevron" aria-hidden="true" />
                  </>
                ) : (
                  <input
                    id={fieldId}
                    name={field.name}
                    value={form[field.name]}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    autoComplete={field.name === 'name' ? 'name' : 'organization'}
                    autoFocus={field.name === 'name'}
                    aria-invalid={Boolean(fieldErrors[field.name])}
                    aria-describedby={fieldErrors[field.name] ? `${fieldId}-error` : undefined}
                  />
                )}
              </span>
              {fieldErrors[field.name] && (
                <span id={`${fieldId}-error`} className="field-error">
                  {fieldErrors[field.name]}
                </span>
              )}
            </label>
          );
        })}

        <label
          className="form-field"
          htmlFor="checkin-type"
          style={{ '--field-delay': `${0.5 + FORM_FIELDS.length * 0.09}s` }}
        >
          <span className="field-label">CƠ CẤU ĐẠI BIỂU</span>
          <span className="field-control field-control--select">
            <UsersRound aria-hidden="true" />
            <select
              id="checkin-type"
              name="type"
              value={form.type}
              onChange={onChange}
              aria-invalid={Boolean(fieldErrors.type)}
              aria-describedby={fieldErrors.type ? 'checkin-type-error' : undefined}
            >
              <option value="">-----</option>
              {DELEGATE_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
            <ChevronDown className="select-chevron" aria-hidden="true" />
          </span>
          {fieldErrors.type && (
            <span id="checkin-type-error" className="field-error">
              {fieldErrors.type}
            </span>
          )}
        </label>
      </div>

      <button className="submit-button" type="submit" disabled={saving}>
        <span>{saving ? 'ĐANG LƯU...' : 'THAM GIA ĐẠI HỘI'}</span>
        <ChevronRight size={19} aria-hidden="true" />
      </button>
    </form>
  );
}
