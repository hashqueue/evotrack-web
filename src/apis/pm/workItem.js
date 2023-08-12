import request from '@/utils/request'

export const createWorkItem = (data) => {
  return request({
    url: `/pm/work-items/`,
    method: 'POST',
    data
  })
}
export const getWorkItemDetail = (workItemId) => {
  return request({
    url: `/pm/work-items/${workItemId}/`,
    method: 'GET'
  })
}

export const updateWorkItem = (workItemId, data) => {
  return request({
    url: `/pm/work-items/${workItemId}/`,
    method: 'PUT',
    data
  })
}
export const getWorkItemList = (params) => {
  return request({
    url: `/pm/work-items/`,
    method: 'GET',
    params
  })
}
export const deleteWorkItemDetail = (workItemId) => {
  return request({
    url: `/pm/work-items/${workItemId}/`,
    method: 'DELETE'
  })
}
export const updateWorkItemWithPatch = (workItemId, data) => {
  return request({
    url: `/pm/work-items/${workItemId}/`,
    method: 'PATCH',
    data
  })
}
