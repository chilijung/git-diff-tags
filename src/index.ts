import {Commit, ConvenientPatch, Diff, DiffFile, Oid, Repository, Tag, Tree} from "nodegit";
import {resolve} from "path";

export default class GitDiffTags {
  private tagFrom: string;
  private tagTo: string;
  private dirPath: string;
  private headCommitTree: Tree;
  private tagCommitTree: Tree;

  constructor(dirPath: string, tagFrom: string, tagTo: string) {
    this.tagFrom = tagFrom;
    this.tagTo = tagTo;
    this.dirPath = resolve(process.cwd(), dirPath);
  }

  public start(): Promise<ConvenientPatch[]> {
    return Repository.open(this.dirPath)
      .then(this.getTagFromCommit)
      .then(this.getTagToCommit)
      .then(this.diffTreeToTree)
      .then(this.diff);
  }

  public getTagFrom() {
    return this.tagFrom;
  }

  public getTagTo() {
    return this.tagTo;
  }

  private getTagToCommit = (repo: Repository): Promise<Repository> => {
    const getTagTo = this.tagTo ? this.getTag(repo, this.tagTo) : repo.getHeadCommit();
    return getTagTo
            .then((commit) => {
              return commit.getTree();
            })
            .then((tree) => {
              this.headCommitTree = tree;
              return repo;
            });
  }

  private getTagFromCommit = (repo: Repository): Promise<Repository> => {
    const getTagFrom = this.getTag(repo, this.tagFrom);
    return getTagFrom
      .then((commit) => {
        return commit.getTree();
      })
      .then((tree) => {
        this.tagCommitTree = tree;
        return repo;
      });
  }

  private getTag(repo: Repository, getTagShort: string): Promise<Commit> {
    return Tag.list(repo).then((arr) => {
          if (!getTagShort) {
            getTagShort = arr[arr.length - 1];
            this.tagFrom = getTagShort;
          }

          // check if tags are exist.
          if (arr.indexOf(getTagShort) === -1) {
            // not found tag
            throw new Error(`Make sure your tag is in the right name, can't find tag: ${getTagShort}`);
          }
          return repo.getTagByName(getTagShort);
        })
        .then((tag) => {
          return repo.getCommit(tag.targetId());
        })
        .catch((e) => {
          return repo.getReferenceCommit(getTagShort);
        });
  }

  private diffTreeToTree = (repo: Repository): Promise<Diff> => {
    return Diff.treeToTree(repo, this.tagCommitTree, this.headCommitTree, null);
  }

  private diff = (diff: Diff): Promise<ConvenientPatch[]> => {
    return diff.patches();
  }
}
