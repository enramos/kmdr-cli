import AST from "../ast";
import Console from "../console";
import { ExplainClientInstance } from "../interfaces";
import { ExplainClient } from "./client";
import Highlight from "../highlight";

export class Explain extends Console {
  private client: ExplainClientInstance;

  constructor() {
    super();

    this.client = new ExplainClient();
  }

  public async render({ interactive = false, highlight = false }) {
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
        const serializedAST = AST.serialize(ast);
        const flattenAST = AST.flatten(serializedAST);
        if (highlight) {
          const h = new Highlight();
          this.print(h.decorate(apiQuery, flattenAST));
        }
        this.makeExplanation();
      } catch (err) {
        this.error("There was an error");
        this.error(err);
      }
    } while (interactive);
  }

  public makeExplanation() {}
}
