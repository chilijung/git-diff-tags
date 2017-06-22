import {expect} from "chai";
import {DiffFile} from "nodegit";
import GitDiffFiles from "../src/index";

describe("index", () => {
  it("should get summary", (done) => {
    const diff = new GitDiffFiles("./", "0.1.0", "v0.1.0");

    diff.start()
      .then((result) => {
        console.log(result);
        done();
      })
      .catch((err) => {
        console.log("error", err);
      });
  });
});
