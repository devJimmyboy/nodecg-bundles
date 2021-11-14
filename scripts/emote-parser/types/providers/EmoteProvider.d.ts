import { AxiosInstance, AxiosRequestConfig } from "axios";
/**
 *
 */
export declare type EmoteProviderOptions = {
    url: string;
};
export declare abstract class EmoteProvider {
    baseUrl: string;
    api: AxiosInstance;
    constructor(_options: EmoteProviderOptions);
    /**
     * Perform a get request to the provider's API.
     * @param endpoint Endpoint to request. In the form of `/api/v1/endpoint`
     * @param config Axios request config. Can send params or headers if needed.
     * @returns The Emote Provider's response in the form of an Axios response object
     */
    get: (endpoint: string, config?: AxiosRequestConfig) => Promise<void | import("axios").AxiosResponse<unknown, any>>;
}
