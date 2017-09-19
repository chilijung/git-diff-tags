/* tslint:disable no-console */
import {execSync, spawn} from "child_process";
import {resolve} from "path";

export type StatusTypes = "A" | "C" | "D" | "M" | "R" | "T" | "U" | "X";

export interface IFileStatus {
  path: string;

  // refs: https://git-scm.com/docs/git-diff
  // A: addition of a file
  // C: copy of a file into a new one
  // D: deletion of a file
  // M: modification of the contents or mode of a file
  // R: renaming of a file
  // T: change in the type of the file
  // U: file is unmerged (you must complete the merge before it can be committed)
  // X: "unknown" change type (most probably a bug, please report it)
  status: StatusTypes;
}

export default class GitDiffTags {
  private tagFrom: string;
  private tagTo: string;
  private dirPath: string;

  constructor(dirPath: string, tagFrom?: string, tagTo?: string) {
    this.tagFrom = tagFrom || execSync("git describe --abbrev=0").toString().trim();
    this.tagTo = tagTo || "";
    this.dirPath = resolve(process.cwd(), dirPath);
  }

  public start(): Promise<IFileStatus[]> {
    let result = "";
    const gitDiff = this.tagTo ? spawn("git", [
      `--git-dir=${this.dirPath}/.git`,
      "diff",
      "--name-status",
      this.tagFrom,
      this.tagTo,
    ]) : spawn("git", [
      `--git-dir=${this.dirPath}/.git`,
      "diff",
      "--name-status",
      this.tagFrom,
    ]);

    gitDiff.stdout.on("data", (data) => {
      result += data.toString();
    });

    gitDiff.stderr.on("data", (data) => {
      console.error(`git diff stderr: ${data}`);
    });

    return new Promise((resolved, reject) => {
      gitDiff.on("close", (code) => {
        if (code === 1) {
          return reject("Git diff tags fail");
        }
        // split and remove last item
        const resultArr = result.split("\n").slice(0, -1);
        return resolved(resultArr.map((file) => {
          const fileStatus = file.split("\t");
          const status: StatusTypes = fileStatus[0] as StatusTypes;
          const path: string = fileStatus[1];

          return {
            path,
            status,
          };
        }));
      });
    });
  }
}
