import request from '@/utils/request'

export const createDevice = (data) => {
  return request({
    url: `/devices/`,
    method: 'POST',
    data
  })
}
export const getDeviceDetail = (deviceId) => {
  return request({
    url: `/devices/${deviceId}/`,
    method: 'GET'
  })
}

export const updateDevice = (deviceId, data) => {
  return request({
    url: `/devices/${deviceId}/`,
    method: 'PUT',
    data
  })
}
export const getDeviceList = (params) => {
  return request({
    url: `/devices/`,
    method: 'GET',
    params
  })
}
export const deleteDeviceDetail = (deviceId) => {
  return request({
    url: `/devices/${deviceId}/`,
    method: 'DELETE'
  })
}
export const updateDeviceWithPatch = (deviceId, data) => {
  return request({
    url: `/devices/${deviceId}/`,
    method: 'PATCH',
    data
  })
}
export const getDeviceAliveLogList = (deviceId) => {
  return request({
    url: `/devices/${deviceId}/device-alive-logs/`,
    method: 'GET'
  })
}

export const collectDevicePerfData = (deviceId, data) => {
  return request({
    url: `/devices/${deviceId}/collect-perf-data/`,
    method: 'POST',
    data
  })
}

export const deployAgentToDevice = (deviceId) => {
  return request({
    url: `/devices/${deviceId}/deploy-agent/`,
    method: 'GET'
  })
}
