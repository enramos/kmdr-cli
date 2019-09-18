import chalk from "chalk";
import enquirer from "enquirer";
import Spinner from "ora";
import { ConsoleAnswers } from "./interfaces";

export default class Console {
  private spinner?: any;

  public async prompt(questions: any): Promise<any> {
    return enquirer.prompt(questions);
  }

  public print(content?: string) {
    console.log(content ? content : "");
  }

  public log(str: string) {
    console.log(str);
  }

  public clear() {
    console.log("TODO");
  }

  public error(msg: string) {
    console.error(chalk.red(msg));
  }

  public startSpinner(msg: string) {
    this.spinner = Spinner(msg).start();
  }

  public stopSpinner() {
    this.spinner.stop();
  }

  public succeedSpinner(text?: string) {
    this.spinner.succeed(text);
  }
}
