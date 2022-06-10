import request from '@/utils/request'
/** 登录 */
export function login (data) {
  return request({
    url: '/login',
    method: 'POST',
    data
  })
}
/** 登出 */
export function logout () {
  return request({
    url: '/loginout',
    method: 'GET'
  })
}

export function getCurrUserInfo () {
  return request({
    url: '/userinfo',
    method: 'GET'
  })
}
/** 查询 用户列表 */
export function getUserList (params) {
  return request({
    url: '/user',
    method: 'GET',
    params
  })
}

/** 注册 */
export function register (data) {
  return request({
    url: '/register',
    method: 'POST',
    data
  })
}

/** 创建用户 */
export function createUser (data) {
  return request({
    url: '/user',
    method: 'POST',
    data
  })
}

/** 更新用户 */
export function updateUser (userId, data) {
  return request({
    url: `/user/${userId}`,
    method: 'PUT',
    data
  })
}
/** 更新当前用户密码 */
export function updateUserPassword (data) {
  return request({
    url: '/user/password/update',
    method: 'PUT',
    data
  })
}
/** 重置密码 */
export function updateSetPassword (id) {
  return request({
    url: `/user/password/reset/${id}`,
    method: 'PUT'
  })
}

export function deleteUser (id) {
  return request({
    url: `/user/${id}`,
    method: 'DELETE'
  })
}

export function setUserRole (userId, data) {
  return request({
    url: `/user/role/${userId}`,
    method: 'PUT',
    data
  })
}

/** 根据用户id 查询用户所有角色 */
export function getUserRoleList (userId) {
  return request({
    url: `/user/role/${userId}`,
    method: 'GET'
  })
}

export function createOrCancelRoleUser (data) {
  return request({
    url: '/user/role/update',
    method: 'POST',
    data
  })
}
