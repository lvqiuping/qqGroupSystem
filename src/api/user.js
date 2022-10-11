import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/User/Login',
    method: 'post',
    data: data
  })
}
export function logout(data) {
  return request({
    url: '/api/User/LogOut?' + data,
    method: 'post'
  })
}
