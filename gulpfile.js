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
        mkdirp        = require('mkdirp'), 
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

        this.files = { sass: {}, js: {} }
        this.check = { sass: {}, js: {}, browserify: {} }
        this.dests = { sass: {}, js: {} } 

        this.files.sass[ NS ]       = assets(`/stylesheets/${NS}/${NS}.scss`);
        this.files.js[ NS ]         = assets(`/javascripts/${NS}/${NS}.js`);
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

        gulp.task('setup'       , this.setup       .bind(this));
        gulp.task('sass'        , this.sass        .bind(this));
        gulp.task('js'          , this.js          .bind(this));
        gulp.task('uglify'      , this.uglify      .bind(this));
        gulp.task('browserSync' , this.browserSync .bind(this));
        gulp.task('watch'       , this.watch       .bind(this));

    }

    setup() {

        this.setupFolders('javascripts', 'js');
        this.setupFolders('stylesheets', 'scss');

    }

    setupFolders ( folder, extension ) {

        var directory           = assets( `/${ folder }` ),
            namespace           = this.namespace;

        var pipelineIndex       = `${ directory }/${ namespace }.${ extension }`,
            pipelineDestination = `${ directory }/dist/.${ namespace }.bundle.${ extension }`,
            gulpTargetFile      = `${ directory }/${ namespace }.${ extension }`;


        // Create pipeline file
        this.setupFiles( pipelineIndex );

        // Create main folder for current namespace
        mkdirp( `${ directory }/${ namespace }`, ( err ) => {

            if ( err != null ) { console.log( err ); }
            else { 
                this.setupFiles( gulpTargetFile );
            }
        });

        // Create main folder for current namespace
        mkdirp( `${ directory }/dist`, ( err ) => {

            if ( err != null ) { console.log( err ); }
            else { 
                this.setupFiles( pipelineDestination );
            }
        });
    }

    setupFiles ( file ) {

        fs.access( file, fs.F_OK, ( err ) => {

            if ( err != null  ) { 

                fs.writeFile( file, '', ( err ) => {

                    if ( err != null ) { console.log( err ); }
                    else { console.log(`${ file } has been created`); }
                });
            }
            else { 

                console.log(`The following file has already been setup: ${ file }`);
            }
        });
    }
    
    sass() {
        
        const prefix_conf = {
            browsers : ['> 1%', 'IE 7'],
            cascade  : false
        };

        gulp.src( this.files.sass[this.namespace] )
            .pipe( expect( { errorOnFailure: true }, this.files.sass[this.namespace] ).on( 'error', errorLog ) )
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

        const br = browserify( this.files.js[this.namespace], { extensions, paths });

        br.transform("babelify", { presets })
            .transform("stringify", { appliesTo: { includeExtensions: stringExt } })
            .bundle()
            .on( 'error', errorLog )
            .pipe( notify("Js compiled"))
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