import request from '@/utils/request'

export const createSprint = (data) => {
  return request({
    url: `/pm/sprints/`,
    method: 'POST',
    data
  })
}
export const getSprintDetail = (sprintId) => {
  return request({
    url: `/pm/sprints/${sprintId}/`,
    method: 'GET'
  })
}

export const updateSprint = (sprintId, data) => {
  return request({
    url: `/pm/sprints/${sprintId}/`,
    method: 'PUT',
    data
  })
}
export const getSprintList = (params) => {
  return request({
    url: `/pm/sprints/`,
    method: 'GET',
    params
  })
}
export const deleteSprintDetail = (sprintId) => {
  return request({
    url: `/pm/sprints/${sprintId}/`,
    method: 'DELETE'
  })
}
export const updateSprintWithPatch = (sprintId, data) => {
  return request({
    url: `/pm/sprints/${sprintId}/`,
    method: 'PATCH',
    data
  })
}
