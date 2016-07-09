const gulp = require("gulp");
const livereload = require("gulp-livereload");

gulp.task("watch-all", ["build-js", "build-css", "build-html", "build-bower"], () => {
  livereload.listen();
  // if you use absolute path(./src) watch isn't notified by file creation/deletion
  gulp.watch("src/app/**/*.js", ["build-js"]);
  gulp.watch("src/app/**/*.css", ["build-css"]);
  gulp.watch("src/app/components/**/*.html", ["build-html"]);
  gulp.watch("src/bower_components/**/*", ["build-bower"]);
});
