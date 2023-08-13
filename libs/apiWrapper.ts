"use client";
import authService from "@/libs/authService";

export const apiFetch = async (
  url: string,
  method: string = "GET",
  payload: any = null
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authService.isAuthenticated) {
    headers["Authorization"] = `Bearer ${await authService.getAccessToken()}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  return fetch(url, options);
};
