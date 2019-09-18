import Client from "../client";
import { mutationCreateExplainFeedback, queryExplain } from "../graphql";
import { ExplainClientInstance, ExplainResponse, GraphQLResponse } from "../interfaces";

export class ExplainClient extends Client implements ExplainClientInstance {
  constructor() {
    super();
  }

  public async getExplanation(query: string, schema?: string): Promise<ExplainResponse> {
    const transformResponse = (res: string) => {
      if (res) {
        try {
          const obj = JSON.parse(res) as GraphQLResponse;
          return obj.data;
        } catch (err) {
          throw err;
        }
      }
    };

    return super.doQuery(queryExplain, { query }, { transformResponse }) as Promise<
      ExplainResponse
    >;
  }

  public async sendFeedback(answer: string, comment: string) {
    return super.doMutation(mutationCreateExplainFeedback, { answer, comment });
  }
}
