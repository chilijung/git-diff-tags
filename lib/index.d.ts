import { DiffFile } from "nodegit";
export default class GitDiffFiles {
    private tag;
    private dirPath;
    private summary;
    private headCommitTree;
    private tagCommitTree;
    private newFilesAttributes;
    private oldFilesAttributes;
    constructor(dirPath: string, tag: string);
    start(): Promise<DiffFile[][]>;
    private getHead;
    private getTag;
    private diffTreeToTree;
    private diff;
}
