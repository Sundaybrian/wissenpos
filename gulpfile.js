var gulp = require("gulp"),
    swaggerGenerator = require("gulp-apidoc-swagger");

gulp.task("swaggerGenerator", function () {
    swaggerGenerator.exec({
        src: "api/",
        dest: "doc/",
    });
});
