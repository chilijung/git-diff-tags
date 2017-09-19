import {expect} from "chai";
import {DiffFile, Repository, Tag} from "nodegit";
import GitDiffTags from "../src/index";

describe("diff files between tags", () => {
  it("should get modified package.json", (done) => {
    const diff = new GitDiffTags("./", "v0.2.0", "v0.2.0-a");

    diff.start()
      .then((result) => {
        expect(result[0].status).to.equal("M");
        expect(result[0].path).eql("package.json");
        done();
      })
      .catch((err) => {
        done(new Error(err));
      });
  });

  it("should get created file test/test-new-file.js", (done) => {
    const diff = new GitDiffTags("./", "v0.2.0-a", "v0.2.0-b");

    diff.start()
      .then((result) => {
        expect(result[0].status).to.equal("A");
        expect(result[0].path).eql("test/test-new-file.js");
        done();
      })
      .catch((err) => {
        done(new Error(err));
      });
  });

  it("should delete file test/test-new-file.js", (done) => {
    const diff = new GitDiffTags("./", "v0.2.0-b", "v0.2.0-c");

    diff.start()
      .then((result) => {
        expect(result[0].status).to.equal("D");
        expect(result[0].path).eql("test/test-new-file.js");
        done();
      })
      .catch((err) => {
        done(new Error(err));
      });
  });

  it("should diff through three version tags", (done) => {
    const diff = new GitDiffTags("./", "v0.2.0", "v0.2.0-c");

    diff.start()
      .then((result) => {
        expect(result.length).equals(1);
        expect(result[0].status).to.equal("M");
        expect(result[0].path).eql("package.json");
        done();
      })
      .catch((err) => {
        done(new Error(err));
      });
  });

  it("get last tag if tagFrom is null", (done) => {
    const diff = new GitDiffTags("./");

    diff.start()
      .then((result) => {
        // don't fail
        expect(result).to.be.an("array");
        done();
      })
      .catch((err) => {
        done(new Error(err));
      });
  });
});
