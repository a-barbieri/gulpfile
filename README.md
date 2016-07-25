### GULPFILE ###

This gulpfile preprocesses your Rails javascripts and stylesheets.

The idea behind this is to split your `app` files from the `admin` ones. It has also an `extra` feature that let's you create the namespace for as many plugins as you want without modifing Gulpfile settings.

It has been thought for Ruby on Rails 4.2.6 or later and Node 6.2.0 or later.

What you can do:
* Use gulp for your [application assets](#app)
* Use gulp for your [admin assets](#admin)
* Use gulp for your [plugin assets](#extra)

* * * 

<a name='app'></a>
### Required structure ###

In order to setup properly copy/paste `gulpfile.js` and `package.json` in your project's root. To install gulp dependencies run the following commands from Terminal (or any command-line):
```
  npm install
```

After that you can setup the assets directory. You can do it manually or using the following command:
```
  gulp setup
```

This will setup the basic structure for your application which is explained here below.

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

After your directory is correctly setup you can use the following commands:

* `gulp sass`: it preprocesses sass files
* `gulp js`: it preprocesses js files
* `gulp`: it executes `gulp sass` and `gulp js`
* `gulp watch`: it watches stylesheet and javascript directories and executes `gulp sass` and `gulp js` on every file change
* `gulp bs`: it runs Browsersync in background and executes `gulp sass` and `gulp js` on every file change

* * *
<a name='admin'></a>
### Admin files ###

If you want to keep your admin files separated you can create the same structure as before but within `admin` namespace. 
To automagically setup the file you need run:
```
  gulp setup --admin
```

This will setup the directory as listed here below.

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

In order to refer to `admin` namespace just add `--admin` at the end of the gulp command. 

* `gulp sass --admin`: it preprocesses sass files
* `gulp js --admin`: it preprocesses js files
* `gulp --admin`: it executes `gulp sass --admin` and `gulp js --admin`
* `gulp watch --admin`: it watches stylesheet and javascript directories and executes `gulp sass --admin` and `gulp js --admin` on every file change
* `gulp bs --admin`: it runs Browsersync in background and executes `gulp sass --admin` and `gulp js --admin` on every file change

* * *
<a name='extra'></a>
### Extra feature ###

Always wanted to `gulp watch --extra myPlugin`?

You might want to have third namespace for a plugin that you use only on one specific view of your app. For example a script called `myPlugin` (it can be anything you want). The only thing you have to do is create the structure for it as you have done before with the setup task:
```
  gulp setup --extra myPlugin
```

Then you'll be able to execute gulp commands using appendin `--extra myPlugin` to them.

* `gulp sass --extra myPlugin`: it preprocesses sass files
* `gulp js --extra myPlugin`: it preprocesses js files
* `gulp --extra myPlugin`: it executes `gulp sass --extra myPlugin` and `gulp js --extra myPlugin`
* `gulp watch --extra myPlugin`: it watches stylesheet and javascript directories and executes `gulp sass --extra myPlugin` and `gulp js --extra myPlugin` on every file change
* `gulp bs --extra myPlugin`: it runs Browsersync in background and executes `gulp sass --extra myPlugin` and `gulp js --extra myPlugin` on every file change

