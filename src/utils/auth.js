import config from '@/config'

const TokenKey = config.tokenKey

export function getToken () {
  // return '80889797978'
  return sessionStorage.getItem(TokenKey)
}

export function setToken (token) {
  sessionStorage.setItem(TokenKey, token)
}

export function removeToken () {
  return sessionStorage.removeItem(TokenKey)
}
