var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var source = require('vinyl-source-stream');

var srcDir = './client/js/';
var outDir = './public/js/';

function bundle(file, watch) {
    var args = watchify.args;
    args.entries = [srcDir + file];
    args.debug = true;

    var bundler = watch ? watchify(browserify(args)) : browserify(args);
    bundler.transform(reactify);

    function rebundle() {
        var stream = bundler.bundle();
        stream.on('error', notify.onError({
            title: 'Rebundle Error',
            message: '<%= error.message %>'
        }));
        return stream
            .pipe(source(file))
            .pipe(gulp.dest(outDir));
    }

    bundler.on('update', function() {
        rebundle();
        gutil.log('Rebunldling...');
    });

    return rebundle();
}

gulp.task('js', function() {
    bundle('app.js', false);
});

gulp.task('watch', function() {
    gulp.watch('client/js/*.js', function() {
        bundle('app.js', true);
    });
});
