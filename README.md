# git-diff-tags

Using git diff to get change files between commits or tags.

## Why?

In our team [Canner](https://www.canner.io/) we encounter a big problem while publishing our assets (images, fonts, ...etc) to s3 server, each time we when we need to update all the assets on s3 which waste a lot of time.

In order to solve it is using `git-diff-tags` to find out which files is modified, created, deleted ...etc, between each tags and upload needed files and folders.

`git-diff-tags` let you find out what files, are being modified, created, deleted between tags with ease. Hope this also helps in your project. :)

## Install

```
npm install git-diff-tags
```

## Usage

```js
import GitDiffTags from "../src/index";

const diff = new GitDiffTags("./", "v0.2.0", "v0.2.0-a");
// can also diff to HEAD
// const diff = new GitDiffTags("./", "v0.2.0", null);
// diff last tag to HEAD
// const diff = new GitDiffTags("./", null, null);


diff.start()
      .then((result) => {
        // the diffs between v0.2.0 and v0.2.0-a
        // result is a ConvenientPatch[]
        // please reference to nodegit[ConvenientPatch]: http://www.nodegit.org/api/convenient_patch

      })
      .catch((err) => {
        throw(new Error(err));
      });
```

## API

### GitDiffTags(dirPath: string, tagFrom: string?, tagTo: string?)

create a reference. If `tagTo` is null diff from `tagFrom` to `HEAD`. if `tagFrom` is null set to last tag.

### diffTag.start(): Promise<ConvenientPatch[]>

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
          const filePath = patch.newFile().path();
          if ((patch.isAdded() || patch.isModified()) && filePath.match(/^public\/image.*(\.png|\.gif)$/g))
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

## install troubleshooting

If you can't install `nodegit` see link below.

Mac:

```
sudo xcode-select --install
```

https://github.com/nodegit/nodegit/issues/1134

## License

MIT
