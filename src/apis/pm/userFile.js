import request from '@/utils/request'

export const createFile = (data) => {
  return request({
    url: `/pm/files/`,
    method: 'POST',
    data
  })
}
export const getFileDetail = (fileId) => {
  return request({
    url: `/pm/files/${fileId}/`,
    method: 'GET'
  })
}

export const updateFile = (fileId, data) => {
  return request({
    url: `/pm/files/${fileId}/`,
    method: 'PUT',
    data
  })
}
export const getFileList = (params) => {
  return request({
    url: `/pm/files/`,
    method: 'GET',
    params
  })
}
export const deleteFileDetail = (fileId) => {
  return request({
    url: `/pm/files/${fileId}/`,
    method: 'DELETE'
  })
}
export const updateFileWithPatch = (fileId, data) => {
  return request({
    url: `/pm/files/${fileId}/`,
    method: 'PATCH',
    data
  })
}
