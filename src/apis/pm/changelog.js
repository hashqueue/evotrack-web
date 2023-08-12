import request from '@/utils/request'

export const getChangelogDetail = (changelogId) => {
  return request({
    url: `/pm/changelogs/${changelogId}/`,
    method: 'GET'
  })
}

export const getChangelogList = (params) => {
  return request({
    url: `/pm/changelogs/`,
    method: 'GET',
    params
  })
}
