import request from '@/utils/request'

export const getOrganizationTreeList = () => {
  return request({
    url: `/system/organizations/tree/`,
    method: 'GET'
  })
}

export const createOrganization = (data) => {
  return request({
    url: `/system/organizations/`,
    method: 'POST',
    data
  })
}

export const getOrganizationDetail = (organizationId) => {
  return request({
    url: `/system/organizations/${organizationId}/`,
    method: 'GET'
  })
}

export const deleteOrganizationDetail = (organizationId) => {
  return request({
    url: `/system/organizations/${organizationId}/`,
    method: 'DELETE'
  })
}

export const updateOrganization = (organizationId, data) => {
  return request({
    url: `/system/organizations/${organizationId}/`,
    method: 'PUT',
    data
  })
}

export const getOrganizationList = (params) => {
  return request({
    url: `/system/organizations/`,
    method: 'GET',
    params
  })
}
