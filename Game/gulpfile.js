// plugins
var gulp            = require('gulp'),
    gutil           = require('gulp-util'),
    jshint          = require('gulp-jshint'),
    concat          = require('gulp-concat'),
    clean           = require('gulp-clean'),
    uglify          = require('gulp-uglify'),
    stripDebug      = require('gulp-strip-debug'),
    cssmin          = require('gulp-minify-css'),
    autoprefixer    = require('gulp-autoprefixer'),
    imagemin        = require('gulp-imagemin'),
    csslint         = require('gulp-csslint'),
    exec            = require('gulp-exec'),
    connect         = require('gulp-connect'),
    watch           = require('gulp-watch'),
    swig            = require('gulp-swig'),
    preprocess      = require('gulp-preprocess'),
    fileinclude 	= require('gulp-file-include'),
    runSequence     = require('run-sequence'),
    open 			= require('gulp-open'),
    plumber			= require('gulp-plumber'),
    less 			= require('gulp-less'),
    batch 			= require('gulp-batch'),
    browserSync     = require('browser-sync');

var userConfig		= require('./gulp-user.json');

// directories
var dir = {
    app:     	'source',
    dest:    	'output'
};

// specify browser to open site in, and page to open
var browser = userConfig.browser;
var openPage = userConfig.openPage;

// configuration
var config = {
    src: {
        html:           dir.app + '/html/pages/**/*.swig',
        css:            dir.app + '/styles/stylesheet.less',
        fonts:          dir.app + '/styles/fonts/**/*',
        angularApp: 	dir.app + '/javascript/angular',
        js:             dir.app + '/javascript',
        assets:             dir.app + '/assets/**/*',
        img:            dir.app + '/images/**/*',
        jsonData:       dir.app + '/data'
    },
    watch: {
        html:           dir.app + '/html/**/*.swig',
        css:            dir.app + '/styles/**/*',
        img:            dir.app + '/images/**/*',
        js:             dir.app + '/javascript/**/*.js',
        jsonData:       dir.app + '/data/**/*'
    },
    dest: {
        html:           dir.dest,
        css:            dir.dest + '/css',
        fonts:          dir.dest + '/css/fonts',
        js:             dir.dest + '/javascript',
        assets:         dir.dest + '/assets',
        img :           dir.dest + '/images',
        jsonData:       dir.dest + '/data'
    }
};

var paths = {
  ng: [config.src.angularApp + '/app.js', config.src.angularApp + '/directives/*.js', config.src.angularApp + '/services/*.js', config.src.angularApp + '/controllers/*.js']
};


// environments
var dev = gutil.env.dev;
var prod = gutil.env.prod;

//set node_env for preprocessor
if (dev === true) { process.env.NODE_ENV = 'dev' }
else if (prod === true) { process.env.NODE_ENV = 'prod' }

// FUNCTIONS
// =========

/**
 * [lintReporter description]
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
function lintReporter(file) {
    gutil.log(gutil.colors.red(file.csslint.errorCount) + ' Warnings in ' + gutil.colors.yellow(file.path));

    file.csslint.results.forEach(function(result) {
        gutil.log(result.error.message + ' on line ' + result.error.line);
    });
};

function writeable() {

    gutil.log('Making ' + dir.dest + ' writeable');

    return gulp.src(dir.dest)
        .pipe(exec('attrib -r /s', function(err, stdout, stderr) {
            gutil.log(stdout);
        }));
};

var onError = function (err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
};

// TASKS
// =========

//swig task
gulp.task('swig', function() {
	gutil.log('TASK: Compile SWIG Templates');
    return gulp.src(config.src.html)
    	.pipe(plumber({errorHandler: onError}))
        .pipe(swig({
	        load_json: true,
	        defaults: {cache: false}
	    }))
        .pipe(gulp.dest(config.dest.html))
        .pipe(dev ? connect.reload() : gutil.noop());
});

// // Compile Sass
// gulp.task('sass', function() {
//     return gulp.src(config.src.css)
//     .pipe(sass())
//     .pipe(autoprefixer('last 2 version', '> 5%'))
//     .pipe(dev ? csslint('.csslintrc') : gutil.noop())
//     .pipe(dev ? csslint.reporter(lintReporter) : gutil.noop())
//     .pipe(prod ? cssmin() : gutil.noop())
//     .pipe(gulp.dest(config.dest.css))
//     .pipe(dev ? connect.reload() : gutil.noop());
// });

gulp.task('less', function () {
	return gulp.src(config.src.css)
    	.pipe(plumber({errorHandler: onError}))
		.pipe(less())
		.pipe(gulp.dest(config.dest.css));
});

// copy css assets
gulp.task('cssAssets', function (){
  	return gulp.src(config.src.fonts)
    	.pipe(plumber({errorHandler: onError}))
		//.pipe(!dev ? imagemin() : gutil.noop())
		.pipe(gulp.dest(config.dest.fonts));
});

// image copy task
gulp.task('img', function() {
	return gulp.src(config.src.img)
    	.pipe(plumber({errorHandler: onError}))
		.pipe(!dev ? imagemin() : gutil.noop())
		.pipe(gulp.dest(config.dest.img));
});

// assets copy task
gulp.task('assets', function() {
    return gulp.src(config.src.assets)
        .pipe(plumber({errorHandler: onError}))
        .pipe(gulp.dest(config.dest.assets));
});

gulp.task('ng-scripts', function() {
	return gulp.src(paths.ng)
    	.pipe(plumber({errorHandler: onError}))
		.pipe(concat('ng.min.js'))
		.pipe(gulp.dest(config.dest.js));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src(config.src.js + '/scripts.js')
    	.pipe(plumber({errorHandler: onError}))
		.pipe(fileinclude('@@'))
		.pipe(preprocess())
		// .pipe(!dev ? stripDebug() : gutil.noop())
		// .pipe(!dev ? uglify({mangle: false}) : gutil.noop())
		.pipe(concat('all.min.js'))
		.pipe(gulp.dest(config.dest.js));
});

//js vendor copy task
gulp.task('jsvendor', function() {
	return gulp.src(config.src.js + '/vendor.js')
    	.pipe(plumber({errorHandler: onError}))
		.pipe(fileinclude('@@'))
		//.pipe(preprocess())
		//.pipe(!dev ? uglify({ outSourceMap: false, compress: { drop_console: true } }) : gutil.noop())
		//.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest(config.dest.js));
});

// copy json data files to dist/assets/data
gulp.task('jsonData', function () {
    return gulp.src(config.src.jsonData + '/*.json')
    	.pipe(plumber({errorHandler: onError}))
        .pipe(gulp.dest(config.dest.jsonData));
});


gulp.task('browser-sync', function() {
  browserSync.init(['css/*.css', 'js/**/*.js', '*.html'], {
    server: {
      baseDir: "output"
    }
  });
});

//connect task
gulp.task('connect', function () {
	return connect.server({
		root: [dir.dest],
		port: 8000,
		livereload: true
	});
});

//watch task
gulp.task('watch', function() {
	//watch html files
	gulp.watch(config.watch.html, { readDelay: 1000, interval: 1000 }, ['swig']);
	//watch css files
	gulp.watch(config.watch.css, { interval: 1000 }, ['less']);
	//watch img files
	gulp.watch(config.watch.img, { interval: 1000 }, ['img']);
	//watch js files
	gulp.watch(config.watch.js, { interval: 1000 }, ['scripts', 'ng-scripts']);
	//watch json data files
	gulp.watch(config.watch.jsonData, { interval: 1000 }, ['jsonData']);
});

//clean task
gulp.task('clean', function() {
	return gulp.src([dir.dest, '.sass-cache'], {read: false})
		.pipe(clean({force:true}));
});

//default task
gulp.task('default', ['serve'], function(){
	gutil.log('Making ' + dir.dest + ' writeable');
	return gulp.src(dir.dest)
		.pipe(exec('cd '+dir.dest))
		.pipe(exec('attrib -R -S /S /D'))
		.pipe(exec('cd ..'));
});

gulp.task('open', function() {
	gutil.log('Opening http://localhost:8000'+openPage);
	return gulp.src(dir.dest+openPage)
		  .pipe(open('', { url: 'http://localhost:8000'+openPage, app: browser }));
});

//
gulp.task('build', function(cb) {
	runSequence('jsvendor', 'scripts', 'ng-scripts', ['swig', 'less', 'cssAssets', 'img', 'jsonData', 'assets'], cb);
});

gulp.task('serve', function(cb) {
  runSequence('clean', 'build', 'browser-sync', 'watch', cb);
});
