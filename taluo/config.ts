// src/config.ts
const BASE_URL = 'https://api.aigcteacher.top';  // 添加协议部分

export const API_ENDPOINTS = {
  EMAIL_LOGIN: `${BASE_URL}/admin/user/login`,
  SIGNUP: `${BASE_URL}/admin/user/register`,
  PROFILE: `${BASE_URL}/admin/user/profile`,
  SEND_CODE: `${BASE_URL}/admin/user/send_sms`,
  PHONE_LOGIN: `${BASE_URL}/admin/user/phone_login`,
  UPDATE_PROFILE: `${BASE_URL}/admin/user/update_profile`,
  GET_COINS: `${BASE_URL}/admin/user/balance`,
  GET_INVITE_INFO: `${BASE_URL}/admin/user/invite_code`,
  CONSUME_COINS: `${BASE_URL}/admin/balance/balance/consume`,
  REFERRER: `${BASE_URL}/admin/balance/set_referrer`,
  CHAT_QUESTION: `${BASE_URL}/biz/core/next_question`,
};
