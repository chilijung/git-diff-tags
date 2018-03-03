# git-diff-tags

[![Greenkeeper badge](https://badges.greenkeeper.io/Canner/git-diff-tags.svg)](https://greenkeeper.io/)

Using git diff to get change files between tags.

## Why?

In our team [Canner](https://www.canner.io/) we encounter a big problem while publishing our assets (images, fonts, ...etc) to s3 server, each time with a new release we need to upload all our assets to s3. Before this package we don't know what files are already uploaded, so we uploaded all the files each time we're going to deploy.

In order to solve it, we develop `git-diff-tags` to find out which files are modified, created, deleted ...etc, between each tags and upload needed files and folders.

`git-diff-tags` let you find out what files are modified, created, deleted between tags with ease. Hope this also help in your projects. :)

## Install

```
npm install git-diff-tags
```

## Usage

```js
import GitDiffTags from "../src/index";

const diff = new GitDiffTags("./", "v0.2.0", "v0.2.0-a");
// can also diff to HEAD commit
// const diff = new GitDiffTags("./", "v0.2.0");
// diff last tag to HEAD commit
// const diff = new GitDiffTags("./");


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


diff.start()
      .then((result: IFileStatus[]) => {
        // the diffs between v0.2.0 and v0.2.0-a
        // result is an IFileStatus[]
      })
      .catch((err) => {
        throw(new Error(err));
      });
```

## API

### GitDiffTags(dirPath: string, tagFrom: string?, tagTo: string?)

create a reference. If `tagTo` is null diff from `tagFrom` to `HEAD`. if `tagFrom` is null set to last tag.

### diffTag.start(): Promise<IFileStatus[]>

return a ConvenientPath array, see http://www.nodegit.org/api/convenient_patch.

## Demo usage in gulp

In our team, we use this package with gulpjs. To upload only the modified and added files to server

example:

```js
const gulp = require('gulp');
const path = require('path');
const imagemin = require('gulp-imagemin');
const rimraf = require('rimraf');
const GitDiffTags = require('git-diff-tags').default;

gulp.task('image', function() {
  rimraf.sync(path.resolve('./public/images_dist'));
  const diff = new GitDiffTags('./');

  return diff.start()
      .then(result => {
        // find out what assets are modified or added since last tag.
        let addedFiles = [];
        result.forEach(patch => {
          const filePath = patch.path;
          if ((patch.status === 'A' || patch.status === 'M') && filePath.match(/^public\/image.*(\.png|\.gif)$/g))
            addedFiles.push(filePath);
        });

        return gulp.src(addedFiles, {base: "public/images"})
          .pipe(imagemin({verbose: true}))
          .pipe(gulp.dest('./public/images_dist'));
      })
      .catch(err => {
        throw (new Error(err));
      });
});

```

## License

MIT
