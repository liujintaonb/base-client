import request from '@/utils/request'

export function getAllMenu () {
  return request({
    url: '/button',
    method: 'GET',
    params: {
      size: 10000,
      page: 1,
      sort: 'index',
      order: 'asc'
    }
  })
}

export function getMenuInfo (id) {
  return request({
    url: `/menu/one/${id}`,
    method: 'GET'
  })
}

export function getRoleMenu (roleId) {
  return request({
    url: `/button/group/${roleId}`,
    method: 'GET'
  })
}

export function createMenu (data) {
  return request({
    url: '/button',
    method: 'POST',
    data
  })
}

export function updateMenu (btnId, data) {
  return request({
    url: `/button/${btnId}`,
    method: 'PUT',
    data
  })
}
/** 设置按钮接口权限 */
export function setBtnInterface (btnId, data) {
  return request({
    url: `/button/interface/${btnId}`,
    method: 'PUT',
    data
  })
}

export function delMenu (id) {
  return request({
    url: `/button/${id}`,
    method: 'DELETE'
  })
}

export function getCurrUserMenu () {
  return request({
    url: '/button/user',
    method: 'GET'
  })
}
