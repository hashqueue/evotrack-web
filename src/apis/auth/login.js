import request from '@/utils/request'

export const login = (data) => {
  return request({
    url: '/system/auth/login/',
    method: 'POST',
    data
  })
}

export const register = (data) => {
  return request({
    url: '/system/auth/register/',
    method: 'POST',
    data
  })
}
