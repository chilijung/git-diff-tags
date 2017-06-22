# git-diff-tags

Using git diff to get change files between commits or tags.

## Why?

In our team [Canner](https://www.canner.io/) we encounter a big problem while publishing our assets (images, fonts, ...) to s3 server, each time we when we need to update all the assets on s3 which waste a lot of time.

In order to solve it is using `git-diff-tags` to find out which files is modified, created, deleted ...etc, between each tags and upload needed files, and folders.

`git-diff-tags` let you find out what files, are being modified, created, deleted between tags with ease. Hope this also helps in your project. :)

## Install

```
npm install git-diff-tags
```

## Usage

```js
import GitDiffFiles from "../src/index";

const diff = new GitDiffFiles("./", "v0.2.0", "v0.2.0-a");
// can also diff to HEAD
// const diff = new GitDiffFiles("./", "v0.2.0", null);


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

## install troubleshooting

If you can't install `nodegit` see link below.

https://github.com/nodegit/nodegit/issues/1134

## License

MIT
