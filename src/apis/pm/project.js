import request from '@/utils/request'

export const createProject = (data) => {
  return request({
    url: `/pm/projects/`,
    method: 'POST',
    data
  })
}
export const getProjectDetail = (projectId) => {
  return request({
    url: `/pm/projects/${projectId}/`,
    method: 'GET'
  })
}

export const getProjectMembers = (projectId) => {
  return request({
    url: `/pm/projects/${projectId}/members/`,
    method: 'GET'
  })
}

export const updateProject = (projectId, data) => {
  return request({
    url: `/pm/projects/${projectId}/`,
    method: 'PUT',
    data
  })
}
export const getProjectList = (params) => {
  return request({
    url: `/pm/projects/`,
    method: 'GET',
    params
  })
}
export const deleteProjectDetail = (projectId) => {
  return request({
    url: `/pm/projects/${projectId}/`,
    method: 'DELETE'
  })
}
export const updateProjectWithPatch = (projectId, data) => {
  return request({
    url: `/pm/projects/${projectId}/`,
    method: 'PATCH',
    data
  })
}
