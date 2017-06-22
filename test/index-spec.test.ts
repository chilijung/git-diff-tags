import {expect} from "chai";
import {DiffFile, Repository, Tag} from "nodegit";
import GitDiffTags from "../src/index";

describe("diff files between tags", () => {
  it("should get modified package.json", (done) => {
    const diff = new GitDiffTags("./", "v0.2.0", "v0.2.0-a");

    diff.start()
      .then((result) => {
        expect(result[0].isAdded()).to.be.false; // tslint:disable-line
        expect(result[0].isDeleted()).to.be.false; // tslint:disable-line
        expect(result[0].isModified()).to.be.true; // tslint:disable-line
        expect(result[0].newFile().path()).eql("package.json"); // tslint:disable-line
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
        expect(result[0].isAdded()).to.be.true; // tslint:disable-line
        expect(result[0].isDeleted()).to.be.false; // tslint:disable-line
        expect(result[0].isModified()).to.be.false; // tslint:disable-line
        expect(result[0].newFile().path()).eql("test/test-new-file.js"); // tslint:disable-line
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
        expect(result[0].isAdded()).to.be.false; // tslint:disable-line
        expect(result[0].isDeleted()).to.be.true; // tslint:disable-line
        expect(result[0].isModified()).to.be.false; // tslint:disable-line
        expect(result[0].newFile().path()).eql("test/test-new-file.js"); // tslint:disable-line
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
        expect(result[0].isAdded()).to.be.false; // tslint:disable-line
        expect(result[0].isDeleted()).to.be.false; // tslint:disable-line
        expect(result[0].isModified()).to.be.true; // tslint:disable-line
        expect(result[0].newFile().path()).eql("package.json"); // tslint:disable-line
        done();
      })
      .catch((err) => {
        done(new Error(err));
      });
  });

  it("get last tag if tagFrom is null", (done) => {
    const diff = new GitDiffTags("./", null, null);

    diff.start()
      .then((result) => {
        return Repository.open("./")
          .then((repo) => {
            return Tag.list(repo).then((arr) => {
              return arr[arr.length - 1];
            });
          });
      })
      .then((lastTag) => {
        expect(diff.getTagFrom()).equals(lastTag);

        done();
      })
      .catch((err) => {
        done(new Error(err));
      });
  });
});
