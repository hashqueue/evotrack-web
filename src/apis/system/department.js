import request from '@/utils/request'

export const getDepartmentTreeList = () => {
  return request({
    url: `/system/departments/tree/`,
    method: 'GET'
  })
}

export const createDepartment = (data) => {
  return request({
    url: `/system/departments/`,
    method: 'POST',
    data
  })
}

export const getDepartmentDetail = (departmentId) => {
  return request({
    url: `/system/departments/${departmentId}/`,
    method: 'GET'
  })
}

export const deleteDepartmentDetail = (departmentId) => {
  return request({
    url: `/system/departments/${departmentId}/`,
    method: 'DELETE'
  })
}

export const updateDepartment = (departmentId, data) => {
  return request({
    url: `/system/departments/${departmentId}/`,
    method: 'PUT',
    data
  })
}

export const getDepartmentList = (params) => {
  return request({
    url: `/system/departments/`,
    method: 'GET',
    params
  })
}
