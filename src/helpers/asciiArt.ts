import chalk from "chalk";
import figlet from "figlet";

const printer = (error: boolean) => (err: Error, data: string) => {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  let printText = "";
  if (error) {
    printText = chalk.red(data);
  } else {
    printText = chalk.green(data);
  }
  console.log(printText);
};

const figletOptions: Object = {
  font: "Small",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 100,
  whitespaceBreak: true
};

export const printAsciiArt = (text: string, error?: boolean) => {
  figlet.text(text, figletOptions, printer(error));
};
