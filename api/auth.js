import axios from "axios";
//Login with email and password
const login = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/Login`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Register with email and password
const register = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/Register`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// get profile
const getMainProfile = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/Auth/GetUserProfile`)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// change password
const changePassword = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/ChangePassword`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// forgot password - send reset code to email or username
const forgotPassword = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/ForgotPassword/Request`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// verify reset code
const verifyResetCode = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/ForgotPassword/Verify`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// reset password with code
const resetPassword = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/ForgotPassword/Reset`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// verify mail token
const verifyMailToken = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/ForgotPassword/Verify`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// verify mail with OTP code
const verifyMail = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/ForgotPassword/Verify`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// resend verify code
const resendVerifyCode = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/VerifyMail/Resend`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// update password after verify
const updatePasswordAfterVerify = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/ForgotPassword/Reset`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default {
  login,
  register,
  getMainProfile,
  changePassword,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  verifyMailToken,
  verifyMail,
  resendVerifyCode,
  updatePasswordAfterVerify,
};
