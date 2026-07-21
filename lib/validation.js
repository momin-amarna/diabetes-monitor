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
