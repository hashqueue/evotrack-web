import request from '@/utils/request'

export const createUser = (data) => {
  return request({
    url: `/system/users/`,
    method: 'POST',
    data
  })
}
export const getUserDetail = (userId) => {
  return request({
    url: `/system/users/${userId}/`,
    method: 'GET'
  })
}

export const getUserProfile = () => {
  return request({
    url: `/system/users/profile/`,
    method: 'GET'
  })
}

export const resetUserPassword = (data) => {
  return request({
    url: `/system/users/reset-password/`,
    method: 'POST',
    data
  })
}

export const updateUser = (userId, data) => {
  return request({
    url: `/system/users/${userId}/`,
    method: 'PUT',
    data
  })
}

export const updateUserProfile = (data) => {
  return request({
    url: `/system/users/update-profile/`,
    method: 'PUT',
    data
  })
}

export const getUserList = (params) => {
  return request({
    url: `/system/users/`,
    method: 'GET',
    params
  })
}

export const getAllUserList = () => {
  return request({
    url: `/system/users/all/`,
    method: 'GET'
  })
}

export const deleteUserDetail = (userId) => {
  return request({
    url: `/system/users/${userId}/`,
    method: 'DELETE'
  })
}

export const getUserStatistics = () => {
  return request({
    url: `/system/users/statistics/`,
    method: 'GET'
  })
}

export const updateUserWithPatch = (userId, data) => {
  return request({
    url: `/system/users/${userId}/`,
    method: 'PATCH',
    data
  })
}
