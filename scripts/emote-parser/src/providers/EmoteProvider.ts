import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
/**
 *
 */
export type EmoteProviderOptions = {
  url: string
}
export abstract class EmoteProvider {
  baseUrl: string
  api: AxiosInstance

  constructor(_options: EmoteProviderOptions) {
    this.api = axios.create({
      baseURL: _options.url,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
  }
  /**
   * Perform a get request to the provider's API.
   * @param endpoint Endpoint to request. In the form of `/api/v1/endpoint`
   * @param config Axios request config. Can send params or headers if needed.
   * @returns The Emote Provider's response in the form of an Axios response object
   */
  get = (endpoint: string, config: AxiosRequestConfig = {}) =>
    this.api.get(endpoint, config).catch((e) => console.error(e))
}
