// const gulp = require("gulp");
// const apidoc = require("gulp-apidoc");

// gulp.task("docs", (done) => {
//     apidoc(
//         {
//             src: "./src/api",
//             dest: "./docs",
//         },
//         done
//     );
// });

// gulp.task("watch", () => {
//     gulp.watch(["./src/api/**"], ["docs"]);
// });

var gulp = require("gulp"),
    swaggerGenerator = require("gulp-apidoc-swagger");

gulp.task("swaggerGenerator", function () {
    swaggerGenerator.exec({
        src: "./src/api",
        dest: "./docs",
    });
});
