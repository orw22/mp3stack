interface HTMLFormControlsCollection extends HTMLCollectionBase {
  [item: string]: Element | RadioNodeList;
}

declare module "axios" {
  interface AxiosInstance {
    noCacheGet: (
      url: string,
      config?: AxiosRequestConfig
    ) => Promise<AxiosResponse<any, any>>;
  }
}

export {};
