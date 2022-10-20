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
 * @param {*} data
 * @returns
 */
export function GetGroupMembers(data2, data) {
  return request({
    url: '/api/Contact/GetGroupMembers?' + data2,
    method: 'post',
    data
  })
}
/**
 *
 * @param {*} query
 * @returns
 */
export function GetGroupPageList(query) {
  return request({
    url: '/api/Contact/GetGroupPageList',
    method: 'get',
    params: query
  })
}
/**
 *
 * @param {*} query
 * @returns
 */
export function GetGroupMemberPageList(query) {
  return request({
    url: '/api/Contact/GetGroupMemberPageList',
    method: 'get',
    params: query
  })
}
/**
 *
 * @param {*} query
 * @returns
 */
export function GetUpdateMemberStatus(query) {
  return request({
    url: '/api/Contact/GetUpdateMemberStatus',
    method: 'get',
    params: query
  })
}
/**
 *
 * @param {*} data
 * @returns
 */
export function ExportAllGroups(data) {
  return request({
    url: '/api/Contact/ExportAllGroups',
    method: 'post',
    data
  })
}
/**
 *
 * @param {*} data
 * @returns
 */
export function ExportAllGroupMembers(data) {
  return request({
    url: '/api/Contact/ExportAllGroupMembers?' + data,
    method: 'post'
  })
}

/**
 *
 * @param {*} data
 * @returns
 */
export function DeleteGroups(data) {
  return request({
    url: '/api/Contact/DeleteGroups',
    method: 'post',
    data
  })
}
/**
 *
 * @param {*} data
 * @returns
 */
export function DeleteMembers(data) {
  return request({
    url: '/api/Contact/DeleteMembers',
    method: 'post',
    data
  })
}
