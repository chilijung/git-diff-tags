import {expect} from "chai";
import {DiffFile} from "nodegit";
import GitDiffFiles from "../src/index";

describe("index", () => {
  it("should get summary", (done) => {
    const diff = new GitDiffFiles("../../canner-web", "v3.0.0");

    diff.start()
      .then((result: DiffFile[][]) => {
        console.log(result);
        done();
      })
      .catch((err: Error) => {
        console.log("error", err);
      });
  });
});
