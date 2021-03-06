import fetch, { BodyInit, Request } from "node-fetch";
import { getUserToken } from "./userData";

interface Headers {
  [key: string]: string;
}

interface RequestOptions {
  url: string;
  method: Request["method"];
  body?: BodyInit;
  headers?: Headers;
}

export const defaultHeaders: Headers = {
  accept: "application/vnd.shimo.v2+json",
  "cache-control": "no-cache",
  "user-agent": "SOS/1.3.28",
  "content-type": "application/json",
};

export async function request(options: RequestOptions, withToken = true) {
  const headers = options.headers || defaultHeaders;
  if (withToken) {
    const token = getUserToken();
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(options.url, {
    method: options.method,
    headers: headers,
    body: options.body,
  });
}
