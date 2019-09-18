"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const os_1 = __importDefault(require("os"));
const constants_1 = require("./constants");
class Client {
    constructor(axiosInstance, auth) {
        this.baseURL = process.env.KMDR_API_URL || "https://api.kmdr.sh/api/graphql";
        this.sessionId = "";
        this.shell = process.env.SHELL || "";
        this.os = `${os_1.default.platform()} ${os_1.default.release()}`;
        this.term = `${process.env.TERM};${process.env.TERM_PROGRAM}`;
        this.version = constants_1.KMDR_CLI_VERSION;
        this.instance =
            axiosInstance ||
                axios_1.default.create({
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
    doQuery(query, variables, config) {
        return this.post({ query, variables }, config);
    }
    doMutation(query, variables, config) {
        return this.post({ query, variables }, config);
    }
    setupInterceptors() {
        this.instance.interceptors.response.use(this.extractSessionId.bind(this));
        this.instance.interceptors.request.use(this.injectSessionId.bind(this));
    }
    extractSessionId(response) {
        this.sessionId = response.headers["x-kmdr-client-session-id"];
        return response;
    }
    injectSessionId(config) {
        const newConfig = config;
        newConfig.headers["x-kmdr-client-session-id"] = this.sessionId;
        return newConfig;
    }
    post(data, config) {
        return this.instance.post("", data, Object.assign({}, config));
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map