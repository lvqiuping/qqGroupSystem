import request from '@/utils/request'
/**
 *
 * @param {*} data
 * @returns
 */
export function AddUser(data) {
  return request({
    url: '/api/User/AddUser',
    method: 'post',
    data
  })
}
export function GetUserPageList(query) {
  return request({
    url: '/api/User/GetUserPageList',
    method: 'get',
    params: query
  })
}
export function ChangeUserStauts(data) {
  return request({
    url: '/api/User/ChangeUserStauts',
    method: 'post',
    data
  })
}
export function UpdatePassword(data) {
  return request({
    url: '/api/User/UpdatePassword',
    method: 'post',
    data
  })
}
