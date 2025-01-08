import ApiService from "./ApiService";
import BaseService from "./BaseService";

export function getApi(endpoint, params) {
  return BaseService.get(endpoint, { params }).then((res) => res?.data);
}

export function postApi(endpoint, payload) {
  return BaseService.post(endpoint, payload).then((res) => res?.data);
}

export async function apiGetNotificationCount() {
  return ApiService.fetchData({
    url: "/notification/count",
    method: "get",
  });
}

export async function apiGetNotificationList() {
  return ApiService.fetchData({
    url: "/notification/list",
    method: "get",
  });
}

export async function apiGetSearchResult(data) {
  return ApiService.fetchData({
    url: "/search/query",
    method: "post",
    data,
  });
}
