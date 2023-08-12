import request from '@/utils/request'

export const getUserPermissions = () => {
  return request({
    url: '/system/permissions/get-user-permissions/',
    method: 'GET'
  })
}

export const getPermissionTreeList = () => {
  return request({
    url: `/system/permissions/tree/`,
    method: 'GET'
  })
}

export const createPermission = (data) => {
  return request({
    url: `/system/permissions/`,
    method: 'POST',
    data
  })
}

export const getPermissionDetail = (permissionId) => {
  return request({
    url: `/system/permissions/${permissionId}/`,
    method: 'GET'
  })
}

export const deletePermissionDetail = (permissionId) => {
  return request({
    url: `/system/permissions/${permissionId}/`,
    method: 'DELETE'
  })
}

export const updatePermission = (permissionId, data) => {
  return request({
    url: `/system/permissions/${permissionId}/`,
    method: 'PUT',
    data
  })
}

export const getPermissionList = (params) => {
  return request({
    url: `/system/permissions/`,
    method: 'GET',
    params
  })
}

export const getPermissionAll = () => {
  return request({
    url: `/system/permissions/all/`,
    method: 'GET'
  })
}
