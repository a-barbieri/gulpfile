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
    , argv          = require('yargs').argv


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

    constructor({ paths, check, dests, proxy = "http://localhost:3000" }) {

        this.proxy = proxy;
        this.paths = paths;
        this.check = check;
        this.dests = dests;

        this.namespace = argv.admin ? "admin" : "app" ;

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
        }

        gulp.src( this.paths.sass[this.namespace] )
            .pipe( sass().on( 'error', errorLog ) )
            .pipe( autoprefixer(prefix_conf) )
            .pipe( gulp.dest( this.dests.sass[this.namespace] ) )
            .pipe( browserSync.stream() )
            .pipe( notify( "Sass compiled" ) )

    }

    js() {

        const extensions = [ ".js", ".jsx", ".vertex", ".fragment" ]
            , paths      = [ './node_modules', this.check.browserify[this.namespace] ]
            , presets    = [ "es2015", "react" ]
            , stringExt  = [ ".vertex", ".fragment" ]

        const br = browserify( this.paths.js[this.namespace], { extensions, paths });

        br.transform("babelify", { presets })
          .transform("stringify", { appliesTo: { includeExtensions: stringExt } })
          .bundle()
          .on( 'error', errorLog )
          .pipe( notify( "Scripts compiled" ) )
          .pipe( browserSync.stream() )
          .pipe( fs.createWriteStream( this.dests.js[this.namespace] ) )
    }
    
    uglify() {

        let dest = this.dests.js[this.namespace].split('/');
            dest.splice(-1,1);
            dest = dest.join('/')
    
        gulp.src( this.dests.js[this.namespace] )
            .pipe( uglify() )
            .pipe( gulp.dest( dest + "/min" ) )
            .pipe( notify('uglify') )
    }

    browserSync( settings = {} ) {
        settings.proxy = this.proxy;
        browserSync.init( settings )
    }

    watch() {
        gulp.watch( this.check.sass[this.namespace] , ['sass']).on( 'change', browserSync.reload );
        gulp.watch( this.check.js[this.namespace]   , ['js'  ]).on( 'change', browserSync.reload );
    }
}

/**
 * Init
 */
new Gulp({

    paths: {
        sass : {
            app   : assets('/stylesheets/app/app.scss'),
            admin : assets('/stylesheets/admin/admin.scss'),
        },
        js : {
            app   : assets('/javascripts/app/app.js'),
            admin : assets('/javascripts/admin/admin.js')
        }
    },

    // avoid dests watch
    check : {
        sass : {
            app   : assets('/stylesheets/app/**/*.scss'),
            admin : assets('/stylesheets/admin/**/*.scss'),
        },
        js : {
            app   : assets('/javascripts/app/**/*.js'),
            admin : assets('/javascripts/admin/**/*.js'),
        },
        browserify : {
            app   : assets('/javascripts/app/**/*.js'),
            admin : assets('/javascripts/admin/**/*.js')
        }
    },
    
    dests : {
        sass: {
            app   : assets('/stylesheets/dist'),
            admin : assets('/stylesheets/dist'),
        },
        js: {
            app   : assets('/javascripts/dist/app.bundle.js'),
            admin : assets('/javascripts/dist/admin.bundle.js')
        }
    }
})