import request from '@/utils/request'
/**
 *
 * @param {*} data
 * @returns
 */
export function GetQQLoginImage(data) {
  return request({
    url: '/api/Contact/GetQQLoginImage',
    method: 'post',
    data
  })
}
/**
 *
 * @param {*} data
 * @returns
 */
export function LoginConfirm(data) {
  return request({
    url: '/api/Contact/LoginConfirm',
    method: 'post',
    data
  })
}
/**
 *
 * @param {*} query
 * @returns
 */
export function GetQQGroups(query) {
  return request({
    url: '/api/Contact/GetQQGroups',
    method: 'get',
    params: query
  })
}
/**
 *
 * @param {*} query
 * @returns
 */
export function GetGroupMembers(query) {
  return request({
    url: '/api/Contact/GetGroupMembers',
    method: 'get',
    params: query
  })
}
