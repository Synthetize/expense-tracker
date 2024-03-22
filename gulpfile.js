const gulp = require('gulp');

gulp.task('copy-bootstrap-css', function() {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-bootstrap-js', function() {
    return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('default', gulp.series('copy-bootstrap-css', 'copy-bootstrap-js'));