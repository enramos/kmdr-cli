"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = __importDefault(require("../ast"));
const console_1 = __importDefault(require("../console"));
const client_1 = require("./client");
const highlight_1 = __importDefault(require("../highlight"));
class Explain extends console_1.default {
    constructor() {
        super();
        this.client = new client_1.ExplainClient();
    }
    async render({ interactive = false, highlight = false }) {
        do {
            const prompt = await this.prompt({
                message: "Enter your command:",
                name: "query",
                required: true,
                type: "input",
            });
            const { query } = prompt;
            try {
                this.startSpinner("Analyzing your command...");
                const res = await this.client.getExplanation(query);
                this.stopSpinner();
                const { ast, query: apiQuery } = res.data.explain;
                const serializedAST = ast_1.default.serialize(ast);
                const flattenAST = ast_1.default.flatten(serializedAST);
                if (highlight) {
                    const h = new highlight_1.default();
                    this.print(h.decorate(apiQuery, flattenAST));
                }
                this.makeExplanation();
            }
            catch (err) {
                this.error("There was an error");
                this.error(err);
            }
        } while (interactive);
    }
    makeExplanation() { }
}
exports.Explain = Explain;
//# sourceMappingURL=explain.js.map