import request from '@/utils/request'

export const createRole = (data) => {
  return request({
    url: `/system/roles/`,
    method: 'POST',
    data
  })
}

export const getRoleDetail = (roleId) => {
  return request({
    url: `/system/roles/${roleId}/`,
    method: 'GET'
  })
}

export const deleteRoleDetail = (roleId) => {
  return request({
    url: `/system/roles/${roleId}/`,
    method: 'DELETE'
  })
}

export const updateRole = (roleId, data) => {
  return request({
    url: `/system/roles/${roleId}/`,
    method: 'PUT',
    data
  })
}

export const updateRoleWithPatch = (roleId, data) => {
  return request({
    url: `/system/roles/${roleId}/`,
    method: 'PATCH',
    data
  })
}

export const getRoleList = (params) => {
  return request({
    url: `/system/roles/`,
    method: 'GET',
    params
  })
}
