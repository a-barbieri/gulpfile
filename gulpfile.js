/* "esversion: 6" */

'use strict';

/*
| - - - - - - - - - - - - - - - - - - - - 
| @ GULP File
| @ Github: giuseppesalvo
| @ Github: a-barbieri
| - - - - - - - - - - - - - - - - - - - -
*/

//Dependencies
const gulp            = require('gulp' ), 
        browserify    = require('browserify'), 
        sass          = require('gulp-sass' ), 
        autoprefixer  = require('gulp-autoprefixer' ), 
        gp_notify     = require("gulp-notify" ), 
        gutil         = require('gulp-util' ), 
        browserSync   = require('browser-sync').create(), 
        fs            = require('fs'), 
        uglify        = require('gulp-uglify'), 
        argv          = require('yargs').argv,
        expect        = require('gulp-expect-file');

/**
 * Utils
 */
const errorLog = (err)  => gp_notify( { message: err, sound: true, onLast: false } ).write( err );
const notify   = (msg)  => gp_notify( { message: msg, onLast: true } );
const log      = (msg)  => gutil.log( gutil.colors.blue( msg ) );
const assets   = (path) => 'app/assets' + path ;

/**
 * Big class
 */

class Gulp {

    constructor( proxy = "http://localhost:3000" ) {

        if ( argv.admin )
            var NS = "admin";
        else if ( argv.extra )
            var NS = argv.extra
        else
            var NS = "app";

        this.paths = { sass: {}, js: {} }
        this.check = { sass: {}, js: {}, browserify: {} }
        this.dests = { sass: {}, js: {} } 

        this.paths.sass[ NS ]       = assets(`/stylesheets/${NS}/${NS}.scss`);
        this.paths.js[ NS ]         = assets(`/javascripts/${NS}/${NS}.js`);
        this.check.sass[ NS ]       = assets(`/stylesheets/${NS}/**/*.scss`);
        this.check.js[ NS ]         = assets(`/javascripts/${NS}/**/*.js`);
        this.check.browserify[ NS ] = assets(`/javascripts/${NS}/**/*.js`);
        this.dests.sass[ NS ]       = assets('/stylesheets/dist');
        this.dests.js[ NS ]         = assets(`/javascripts/dist/${NS}.bundle.js`);

        this.namespace = NS;
        this.proxy = proxy;

        this.tasks();
    }

    tasks() {

        gulp.task('default' , [ 'sass', 'js' ]);
        gulp.task('watch'   , [ 'sass', 'js', 'watch' ]);
        gulp.task('bs'      , [ 'sass', 'js', 'browserSync' ]);

        gulp.task('sass'        , this.sass        .bind(this));
        gulp.task('js'          , this.js          .bind(this));
        gulp.task('uglify'      , this.uglify      .bind(this));
        gulp.task('browserSync' , this.browserSync .bind(this));
        gulp.task('watch'       , this.watch       .bind(this));

    }
    
    sass() {
        
        const prefix_conf = {
            browsers : ['> 1%', 'IE 7'],
            cascade  : false
        };

        gulp.src( this.paths.sass[this.namespace] )
            .pipe( expect( { errorOnFailure: true }, this.paths.sass[this.namespace] ).on( 'error', errorLog ) )
            .pipe( sass().on( 'error', errorLog ) )
            .pipe( autoprefixer(prefix_conf) )
            .pipe( gulp.dest( this.dests.sass[this.namespace] ) )
            .pipe( browserSync.stream() )
            .pipe( notify( function(file) {
                return "Sass compiled: " + file.relative;
            }));
    }

    js() {

        const extensions = [ ".js", ".jsx", ".vertex", ".fragment" ], 
                paths      = [ './node_modules', this.check.browserify[this.namespace] ], 
                presets    = [ "es2015", "react" ], 
                stringExt  = [ ".vertex", ".fragment" ];

        const br = browserify( this.paths.js[this.namespace], { extensions, paths });

        br.transform("babelify", { presets })
            .transform("stringify", { appliesTo: { includeExtensions: stringExt } })
            .bundle()
            .on( 'error', errorLog )
            .pipe( notify( function(file) {
                return "Sass compiled: " + file.relative;
            }))
            .pipe( browserSync.stream() )
            .pipe( fs.createWriteStream( this.dests.js[this.namespace] ) );
    }
    
    uglify() {

        let dest = this.dests.js[this.namespace].split('/');
            dest.splice(-1,1);
            dest = dest.join('/');
    
        gulp.src( this.dests.js[this.namespace] )
            .pipe( uglify() )
            .pipe( gulp.dest( dest + "/min" ) )
            .pipe( notify('uglify') );
    }

    browserSync( settings = {} ) {
        settings.proxy = this.proxy;
        browserSync.init( settings );
    }

    watch() {

        gulp.watch( this.check.sass[this.namespace] , ['sass']).on( 'change', browserSync.reload );
        gulp.watch( this.check.js[this.namespace]   , ['js'  ]).on( 'change', browserSync.reload );
    }
}

/**
 * Init
 */

new Gulp();