// src/config.ts
const BASE_URL = 'https://api.aigcteacher.top';  // 添加协议部分

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/admin/user/login`,
  SIGNUP: `${BASE_URL}/admin/user/register`,
  PROFILE: `${BASE_URL}/admin/user/profile`,
};
