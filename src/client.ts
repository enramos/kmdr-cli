import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import os from "os";
import { KMDR_CLI_VERSION } from "./constants";
import { AuthCredentials } from "./interfaces";

export default class Client {
  private baseURL: string = process.env.KMDR_API_URL || "https://api.kmdr.sh/api/graphql";
  private shell: string;
  private term: string;
  private os: string;
  private instance: AxiosInstance;
  private version: string;
  private sessionId: string = "";

  constructor(axiosInstance?: AxiosInstance, auth?: AuthCredentials) {
    this.shell = process.env.SHELL || "";
    this.os = `${os.platform()} ${os.release()}`;
    this.term = `${process.env.TERM};${process.env.TERM_PROGRAM}`;
    this.version = KMDR_CLI_VERSION;

    this.instance =
      axiosInstance ||
      axios.create({
        baseURL: this.baseURL,
        headers: {
          "Content-Type": "application/json",
          "X-kmdr-client-os": this.os,
          "X-kmdr-client-shell": this.shell,
          "X-kmdr-client-term": this.term,
          "X-kmdr-client-version": this.version,
        },
        responseType: "json",
      });
    this.setupInterceptors();
  }

  protected doQuery(query: string, variables?: {}, config?: AxiosRequestConfig) {
    return this.post({ query, variables }, config);
  }

  protected doMutation(query: string, variables?: {}, config?: AxiosRequestConfig) {
    return this.post({ query, variables }, config);
  }

  private setupInterceptors() {
    this.instance.interceptors.response.use(this.extractSessionId.bind(this));
    this.instance.interceptors.request.use(this.injectSessionId.bind(this));
  }

  private extractSessionId(response: AxiosResponse): AxiosResponse {
    this.sessionId = response.headers["x-kmdr-client-session-id"];
    return response;
  }

  private injectSessionId(config: AxiosRequestConfig): AxiosRequestConfig {
    const newConfig = config;
    newConfig.headers["x-kmdr-client-session-id"] = this.sessionId;

    return newConfig;
  }

  private post(data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.post("", data, { ...config });
  }
}
