export const validateEmail = (email) => {
  // Email validation rules:
  // - Valid email format
  // - Not empty
  
  if (!email) {
    return {
      isValid: false,
      message: 'Email không được để trống'
    };
  }

  // Basic email regex pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailPattern.test(email)) {
    return {
      isValid: false,
      message: 'Email không đúng định dạng (ví dụ: example@gmail.com)'
    };
  }

  // Check for common typos in domain
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (domain && !commonDomains.includes(domain)) {
    // Still valid, but might want to warn about uncommon domains
    // For now, we'll accept all valid email formats
  }

  return {
    isValid: true,
    message: null
  };
};
