### GULPFILE ###

This gulpfile has been created to split `app` files from the `admin` ones. It has also an `extra` feature that let's you create the namespace you want without modifing the Gulpfile settings.

It has been thought for Ruby on Rails 4.2.6 or later and Node 6.2.0 or later.

# Required structure #

In order to work you need to have the following directory structure:

**JAVASCRIPT**
```
  app/
    assets/
      javascripts/

        application.js    -> Rails pipeline referral
        app/              -> Put here any App js file
          app.js          -> Gulp (browserify) referral

        dist/
          app.bundle.js   -> File to require in App Rails pipeline
```

**STYLESHEETS**
```
  app/
    assets/
      stylesheets/

        application.css   -> Rails pipeline referral
        app/              -> Put here any App css file
          app.scss        -> Gulp referral

        dist/
          app.css         -> File to require in App Rails pipeline
```

You can use the following commands:

* `gulp sass`: preprocesses sass files
* `gulp js`: preprocesses js files
* `gulp`: executes `gulp sass` and `gulp js`
* `gulp watch`: watches stylesheet and javascript directories and executes `gulp sass` and `gulp js` on every file change
* `gulp bs`: runs Browsersync in background and executes `gulp sass` and `gulp js` on every file change

# Admin files #

If you want to keep your admin files separated you can create the same structure as before but within `admin` namespace. Refer to the following schema.

**JAVASCRIPT**
```
  app/
    assets/
      javascripts/

        admin.js          -> Rails pipeline referral
        admin/            -> Put here any Admin js file
          admin.js        -> Gulp (browserify) referral

        dist/
          admin.bundle.js -> File to require in Admin Rails pipeline
```

**STYLESHEETS**
```
  app/
    assets/
      stylesheets/

        admin.css         -> Rails pipeline referral
        admin/            -> Put here any Admin css file
          admin.scss      -> Gulp referral

        dist/
          admin.css       -> File to require in Admin Rails pipeline
```

In order to refer to `admin` namespace just add `--admin` at the end of the gulp command. For example `gulp watch --admin` or  simply `gulp --admin`.

# Extra feature #

You might want to have third namespace for a plugin that you use only on one specific view of your app. For example a script called `myPlugin`. The only thing you have to do is create the structure for it as you have done for admin and replacing admin with `myPlugin`. Then you'll be able to execute gulp commands using appendin `--extra myPlugin` to them. For example `gulp watch --extra myPlugin` or `gulp --extra myPlugin`.

# NEXT FEATURES #
* Implement a command to create the structure automagically