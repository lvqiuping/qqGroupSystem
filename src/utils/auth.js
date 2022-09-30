import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const RefreshTokenKey = 'vue_admin_template_retoken'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setRefreshToken(refreshtoken) {
  return Cookies.set(RefreshTokenKey, refreshtoken)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

