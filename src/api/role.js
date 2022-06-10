import request from '@/utils/request'

/** 获取所有角色集合 params 除非有必要否则不要改 */
export function getRoleList () {
  return request({
    url: '/role',
    method: 'GET',
    params: { size: 999, page: 1 }
  })
}

/** 获取没有当前角色的用户集合 */
export function getNoRoleUserList (roleId, params) {
  return request({
    url: `/role/user/absent/${roleId}`,
    method: 'GET',
    params
  })
}
/** 获取有当前角色的用户集合 */
export function getHasRoleUserList (roleId, params) {
  return request({
    url: `/role/user/${roleId}`,
    method: 'GET',
    params
  })
}

export function getRoleOne (id) {
  return request({
    url: `/role/${id}`,
    method: 'GET'
  })
}

/** 角色绑定用户 data 是将要解除绑定的 用户集合 */
export function bindUserList (roleId, data) {
  return request({
    url: `/role/user/bind/${roleId}`,
    method: 'PUT',
    data
  })
}
/** 解除角色与用户绑定， data 是将要解除绑定的 用户集合 */
export function unbindUserList (roleId, data) {
  return request({
    url: `/role/user/ubind/${roleId}`,
    method: 'PUT',
    data
  })
}

export function createRole (data) {
  return request({
    url: '/role',
    method: 'POST',
    data
  })
}

export function updateRole (roleId, data) {
  return request({
    url: `/role/${roleId}`,
    method: 'PUT',
    data
  })
}

export function delRoleInfo (id) {
  return request({
    url: `/role/${id}`,
    method: 'DELETE'
  })
}

export function setRoleButton (roleId, data) {
  return request({
    url: `/role/button/${roleId}`,
    method: 'PUT',
    data
  })
}
