import request from '@/utils/request'

export const createComment = (data) => {
  return request({
    url: `/pm/comments/`,
    method: 'POST',
    data
  })
}
export const getCommentDetail = (commentId) => {
  return request({
    url: `/pm/comments/${commentId}/`,
    method: 'GET'
  })
}

export const updateComment = (commentId, data) => {
  return request({
    url: `/pm/comments/${commentId}/`,
    method: 'PUT',
    data
  })
}
export const getCommentList = (params) => {
  return request({
    url: `/pm/comments/`,
    method: 'GET',
    params
  })
}
export const deleteCommentDetail = (commentId) => {
  return request({
    url: `/pm/comments/${commentId}/`,
    method: 'DELETE'
  })
}
export const updateCommentWithPatch = (commentId, data) => {
  return request({
    url: `/pm/comments/${commentId}/`,
    method: 'PATCH',
    data
  })
}
