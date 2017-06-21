"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodegit_1 = require("nodegit");
const path_1 = require("path");
class GitDiffFiles {
    constructor(dirPath, tag) {
        this.getHead = (repo) => {
            return repo.getHeadCommit()
                .then((commit) => {
                return commit.getTree();
            })
                .then((tree) => {
                this.headCommitTree = tree;
                return repo;
            });
        };
        this.getTag = (repo) => {
            return repo.getReferenceCommit(this.tag)
                .then((commit) => {
                return commit.getTree();
            })
                .then((tree) => {
                this.tagCommitTree = tree;
                return repo;
            });
        };
        this.diffTreeToTree = (repo) => {
            return nodegit_1.Diff.treeToTree(repo, this.tagCommitTree, this.headCommitTree, null);
        };
        this.diff = (diff) => {
            this.newFilesAttributes = [];
            this.oldFilesAttributes = [];
            return diff.patches()
                .then((patches) => {
                patches.forEach((patch) => {
                    this.newFilesAttributes.push(patch.newFile());
                    this.oldFilesAttributes.push(patch.oldFile());
                });
                return [this.newFilesAttributes, this.oldFilesAttributes];
            });
        };
        this.tag = tag;
        this.dirPath = path_1.resolve(__dirname, dirPath);
    }
    start() {
        return nodegit_1.Repository.open(this.dirPath)
            .then(this.getHead)
            .then(this.getTag)
            .then(this.diffTreeToTree)
            .then(this.diff);
    }
}
exports.default = GitDiffFiles;
