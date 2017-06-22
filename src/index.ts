import {Commit, ConvenientPatch, Diff, DiffFile, Oid, Repository, Tag, Tree} from "nodegit";
import {resolve} from "path";

export default class GitDiffFiles {
  private tagFrom: string;
  private tagTo: string;
  private dirPath: string;
  private summary: object;
  private headCommitTree: Tree;
  private tagCommitTree: Tree;

  constructor(dirPath: string, tagFrom: string, tagTo: string) {
    this.tagFrom = tagFrom;
    this.tagTo = tagTo;
    this.dirPath = resolve(process.cwd(), dirPath);
  }

  public start() {
    return Repository.open(this.dirPath)
      .then(this.getTagFromCommit)
      .then(this.getTagToCommit)
      .then(this.diffTreeToTree)
      .then(this.diff);
  }

  private getTagToCommit = (repo: Repository): Promise<Repository> => {
    const getTagTo = this.tagTo != null ? this.getTag(repo, this.tagTo) : repo.getHeadCommit();
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
    return repo.getTagByName(getTagShort)
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
