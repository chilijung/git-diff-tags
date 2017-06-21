import {Commit, ConvenientPatch, Diff, DiffFile, Oid, Repository, Tree} from "nodegit";
import {resolve} from "path";

export default class GitDiffFiles {
  private tag: string;
  private dirPath: string;
  private summary: object;
  private headCommitTree: Tree;
  private tagCommitTree: Tree;
  private newFilesAttributes: DiffFile[];
  private oldFilesAttributes: DiffFile[];

  constructor(dirPath: string, tag: string) {
    this.tag = tag;
    this.dirPath = resolve(process.cwd(), dirPath);
  }

  public start() {
    return Repository.open(this.dirPath)
      .then(this.getHead)
      .then(this.getTag)
      .then(this.diffTreeToTree)
      .then(this.diff);
  }

  private getHead = (repo: Repository) => {
    return repo.getHeadCommit()
            .then((commit) => {
              return commit.getTree();
            })
            .then((tree) => {
              this.headCommitTree = tree;
              return repo;
            });
  }

  private getTag = (repo: Repository) => {
    return repo.getReferenceCommit(this.tag)
            .then((commit) => {
              return commit.getTree();
            })
            .then((tree) => {
              this.tagCommitTree = tree;
              return repo;
            });
  }

  private diffTreeToTree = (repo: Repository) => {
    return Diff.treeToTree(repo, this.tagCommitTree, this.headCommitTree, null);
  }

  private diff = (diff: Diff) => {
    this.newFilesAttributes = [];
    this.oldFilesAttributes = [];
    return diff.patches()
      .then((patches: ConvenientPatch[]) => {
        patches.forEach((patch) => {
          this.newFilesAttributes.push(patch.newFile());
          this.oldFilesAttributes.push(patch.oldFile());
        });

        return [this.newFilesAttributes, this.oldFilesAttributes];
      });
  }
}
