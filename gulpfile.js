'use strict';

/*
| - - - - - - - - - - - - - - - - - - - - 
| @ GULP File
| @ Github: giuseppesalvo
| - - - - - - - - - - - - - - - - - - - -
*/

//Dependencies
const gulp          = require('gulp' )
    , browserify    = require('browserify')
    , sass          = require('gulp-sass' )
    , autoprefixer  = require('gulp-autoprefixer' )
    , gp_notify     = require("gulp-notify" )
    , gutil         = require('gulp-util' )
    , browserSync   = require('browser-sync').create()
    , fs            = require('fs')
    , uglify        = require('gulp-uglify')

/**
 * Utils
 */
const errorLog = err  => gp_notify({ message: err, sound: true, onLast: false } ).write( err );
const notify   = msg  => gp_notify({ message: msg, onLast: true } );
const log      = msg  => gutil.log( gutil.colors.blue( msg ) );
const assets   = path => './app/assets' + path ;

/**
 * Big class
 */

class Gulp {

    constructor({ paths, watch, dests, proxy = "http://localhost:3000" }) {

        this.proxy = proxy;
        this.paths = paths;
        this.watch = watch;
        this.dests = dests;

        this.tasks();    
    }

    tasks() {

        gulp.task('default' , [ 'sass', 'js' ]);
        gulp.task('watch'   , [ 'sass', 'js', 'watchTask' ]);
        gulp.task('bs'      , [ 'sass', 'js', 'browserSync' ]);

        gulp.task('sass'        , this.sass        .bind(this));
        gulp.task('js'          , this.js          .bind(this));
        gulp.task('uglify'      , this.uglify      .bind(this));
        gulp.task('browserSync' , this.browserSync .bind(this));
        gulp.task('watchTask'   , this.watchTask   .bind(this));

    }
    
    sass() {
        
        const prefix_conf = {
            browsers : ['> 1%', 'IE 7'],
            cascade  : false
        }

        gulp.src( this.paths.sass )
            .pipe( sass().on( 'error', errorLog ) )
            .pipe( autoprefixer(prefix_conf) )
            .pipe( gulp.dest( this.dests.sass ) )
            .pipe( browserSync.stream() )
            .pipe( notify( "Sass compiled" ) )

    }

    js() {

        const extensions = [ ".js", ".jsx", ".vertex", ".fragment" ]
            , paths      = [ './node_modules', this.watch.browserify ]
            , presets    = [ "es2015", "react" ]
            , stringExt  = [ ".vertex", ".fragment" ]

        const br = browserify( this.paths.js, { extensions, paths });

        br.transform("babelify", { presets })
          .transform("stringify", { appliesTo: { includeExtensions: stringExt } })
          .bundle()
          .on( 'error', errorLog )
          .pipe( notify( "Scripts compiled" ) )
          .pipe( browserSync.stream() )
          .pipe( fs.createWriteStream( this.dests.js + "/bundle.js") )
    }
    
    uglify() {
    
        gulp.src( this.dests.js + "/**/*.js" )
            .pipe( uglify() )
            .pipe( gulp.dest( this.dests.js + "/min" ) )
            .pipe( notify('uglify') )
    
    }

    browserSync( settings = {} ) {

        settings.proxy = this.proxy;

        browserSync.init( settings )
    }

    watchTask() {
        gulp.watch( this.paths.sass , ['sass']).on( 'change', browserSync.reload );
        gulp.watch( this.watch.js   , ['js'  ]).on( 'change', browserSync.reload );
    }
}

/**
 * Init
 */
new Gulp({

    paths: {
        sass : assets('/stylesheets/app.scss'),
        js   : assets('/javascripts/src/app.js')
    },

    // avoid dests watch
    watch : {
        sass       : assets('/stylesheets/**/*.scss'),
        js         : assets('/javascripts/src/**/*.js'),
        browserify : assets('/javascripts/src/**/*.js')
    },
    
    dests : {
        sass : assets('/stylesheets/dist'),
        js   : assets('/javascripts/dist')
    }
})
