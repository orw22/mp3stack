declare module "axios" {
  interface AxiosInstance {
    noCacheGet: (
      url: string,
      config?: AxiosRequestConfig
    ) => Promise<AxiosResponse<any, any>>;
  }
}

export {};
