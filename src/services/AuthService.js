import ApiService from "./ApiService";

export async function apiSignIn(data) {
  return ApiService.fetchData({
    url: "/admin/login",
    method: "post",
    data,
  }).then((res) => res?.data);
}

export async function apiSignUp(data) {
  return ApiService.fetchData({
    url: "/sign-up",
    method: "post",
    data,
  });
}

export async function apiSignOut(data) {
  return ApiService.fetchData({
    url: "/admin/logout",
    method: "post",
    data,
  });
}

export async function apiForgotPassword(data) {
  return ApiService.fetchData({
    url: "/api/forgotPassword",
    method: "post",
    data,
  });
}

export async function apiResetPassword(data) {
  return ApiService.fetchData({
    url: "/reset-password",
    method: "post",
    data,
  });
}
