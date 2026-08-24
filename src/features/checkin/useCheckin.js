import { useState } from 'react';
import { createCheckin } from '../../lib/supabase';
import { FORM_FIELDS, INITIAL_FORM, ROLE_WORKPLACE_MAP } from '../../constants/event';

const REQUIRED_FIELD_MESSAGE = '* Vui lòng điền đẩy đủ thông tin';
const GENDER_MESSAGE = '*Vui lòng chọn giới tính';
const POSITION_MESSAGE = '*Vui lòng chọn chức vụ';
const WORKPLACE_MESSAGE = '*Vui lòng chọn đơn vị công tác';
const DELEGATE_TYPE_MESSAGE = '*Vui lòng chọn cơ cấu đại biểu';
const OFFICIAL_WORKPLACE = 'Chi đoàn 09';

function getDelegateType(workplace) {
  if (!workplace) return '';
  return workplace === OFFICIAL_WORKPLACE ? 'Đại biểu chính thức' : 'Đại biểu khách mời';
}

export function useCheckin() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const updateField = (event) => {
    const { name, value } = event.target;
    const autoSelectedWorkplace = name === 'role' ? (ROLE_WORKPLACE_MAP[value] ?? '') : null;
    const selectedWorkplace = name === 'workplace' ? value : autoSelectedWorkplace;
    const autoSelectedDelegateType = selectedWorkplace === null
      ? null
      : getDelegateType(selectedWorkplace);

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === 'role' ? { workplace: autoSelectedWorkplace } : {}),
      ...(autoSelectedDelegateType !== null ? { type: autoSelectedDelegateType } : {}),
    }));
    setError('');
    setFieldErrors((current) => {
      const nextErrors = { ...current };
      let changed = false;

      if (current[name] && value.trim()) {
        delete nextErrors[name];
        changed = true;
      }

      if (name === 'role' && autoSelectedWorkplace && current.workplace) {
        delete nextErrors.workplace;
        changed = true;
      }

      if (autoSelectedDelegateType && current.type) {
        delete nextErrors.type;
        changed = true;
      }

      return changed ? nextErrors : current;
    });
  };

  const submit = async () => {
    setError('');

    const validationErrors = FORM_FIELDS.reduce((errors, field) => {
      if (!form[field.name].trim()) {
        if (field.name === 'gender') errors[field.name] = GENDER_MESSAGE;
        else if (field.name === 'role') errors[field.name] = POSITION_MESSAGE;
        else if (field.name === 'workplace') errors[field.name] = WORKPLACE_MESSAGE;
        else errors[field.name] = REQUIRED_FIELD_MESSAGE;
      }
      return errors;
    }, {});

    if (!form.type) validationErrors.type = DELEGATE_TYPE_MESSAGE;

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return false;
    }

    setFieldErrors({});
    setSaving(true);
    try {
      return await createCheckin(form);
    } catch (requestError) {
      setError(requestError.message || 'Không thể lưu thông tin check-in.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setForm(INITIAL_FORM);
    setError('');
    setFieldErrors({});
  };

  return { form, saving, error, fieldErrors, updateField, submit, reset };
}
