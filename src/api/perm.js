import request from '@/utils/request'

export function getCurrUserPerms () {
  return request({
    url: '/interface',
    method: 'GET'
  })
}

/** 查询单个按钮 所关联的接口 */
export function getOneMenuPerms (btnId) {
  return request({
    url: `/interface/check/${btnId}`,
    method: 'GET'
  })
}
