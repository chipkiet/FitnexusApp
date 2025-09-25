export const validateEmail = (email) => {
  if (!email) {
    return {
      isValid: false,
      message: 'Email không được để trống'
    };
  }

  // Regex cơ bản: chỉ check phần trước @
  const emailPattern = /^[a-zA-Z0-9._%+-]+$/;

  const [localPart, domain] = email.split('@');

  // Check phần local (trước @)
  if (!localPart || !emailPattern.test(localPart)) {
    return {
      isValid: false,
      message: 'Email không đúng định dạng (ví dụ: example@gmail.com)'
    };
  }

  // Chỉ cho phép domain cố định
  const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

  if (!domain || !allowedDomains.includes(domain.toLowerCase())) {
    return {
      isValid: false,
      message: `Chỉ chấp nhận email thuộc các domain: ${allowedDomains.join(', ')}`
    };
  }

  return {
    isValid: true,
    message: null
  };
};
