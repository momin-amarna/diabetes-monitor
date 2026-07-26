export function validateMeasurement({ reading, fastingHours }) {
  const errors = {};

  const readingNum = Number(reading);
  if (reading === '' || reading === null || reading === undefined || Number.isNaN(readingNum)) {
    errors.reading = 'الرجاء إدخال قراءة السكر';
  } else if (readingNum <= 0) {
    errors.reading = 'القراءة يجب أن تكون أكبر من صفر';
  }

  const fastingNum = Number(fastingHours);
  if (fastingHours === '' || fastingHours === null || fastingHours === undefined || Number.isNaN(fastingNum)) {
    errors.fastingHours = 'الرجاء إدخال ساعات الصيام';
  } else if (fastingNum < 0 || fastingNum > 24) {
    errors.fastingHours = 'ساعات الصيام يجب أن تكون بين 0 و 24';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateWeight({ weight }) {
  const errors = {};

  const weightNum = Number(weight);
  if (weight === '' || weight === null || weight === undefined || Number.isNaN(weightNum)) {
    errors.weight = 'الرجاء إدخال الوزن';
  } else if (weightNum <= 0) {
    errors.weight = 'الوزن يجب أن يكون أكبر من صفر';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validatePatient({ name, emoji, color }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'الرجاء إدخال اسم المريض';
  }

  if (!emoji) {
    errors.emoji = 'الرجاء اختيار رمز';
  }

  if (!color || !/^#[0-9a-fA-F]{6}$/.test(color)) {
    errors.color = 'الرجاء اختيار لون';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
