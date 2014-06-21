grunt-tessel
============

> Grunt tasks to aid tessel development

This project adds two tasks to your grunt: `blacklist-dev-deps` and `tessel-push`.

### tessel-push

This task pushes code to your tessel. By default, it looks in the `main` field of your `package.json` and deploys that. This task does not require you to have `tessel` installed globally - it installs `tessel` itself.

I've tried to add sensible defaults, so you should be able to drop the following into your grunt config and be good to go:

```js
'tesel-push': {
    default: {}
}
```

##### Options

```js
'tessel-push': {
    options: {
        // Passes the --logs flag to `tessel push`.
        // This will keep the connection open so you can watch what the tessel is doing.
        // This option makes the task run forever.
        // Defaults to `true`.
        keepalive: true,
        
        // The package.json to look for a `main` script - relative to the cwd.
        // This option is ignored if `fileToPush` is specified.
        // Defaults to `package.json`.
        packageJsonFilePath: 'package.json',
        
        // Instead of looking in a package.json for a `main` field, just push this file instead.
        // Setting this field causes `packageJsonFilePath` to be ignored.
        // Defaults to `null`
        fileToPush: null,
        
        // Additional arguments to pass through to `tessel push`. 
        // See `tessel push --help` for more details.
        // Defaults to an empty list.
        additionalArgs: []
    },
    
    // Example task targets
    'watch-the-logs': {
        options: {
            keepalive: true
        }
    },
    'fire-and-forget': {
        options: {
            keepalive: false
        }
    }
},
```

### blacklist-dev-deps
By default, `tessel push` will bundle up everything in your cwd and deploy it to the tessel. If you have dev dependencies, this will result in an excess of code getting pushed onto the device. Tessel supports a blacklist option where you can tell it not to bundle certain paths. This task automates the process of blacklisting everything in your `devDependencies` in `package.json`.

 I've tried to add sensible defaults, so you should be able to drop the following into your grunt config and be good to go:

```js
'blacklist-dev-deps': {
    default: {}
}
```

##### Options

```js
'blacklist-dev-deps': {
    options: {
        // The number of spaces to use when serializing your package.json.
        // Defaults to `2`.
        jsonSpacing: 2,
        
        // The file to transform - relative to the cwd.
        // Defaults to `package.json`.
        packageJsonFilePath: 'package.json',
        
        // Instead of overwriting `packageJsonFilePath`, write the new file with
        // blacklisted dev deps to a new destination. If not set, the input
        // package.json will be overwritten.
        // Defaults to `null`.
        outputPackageJsonFilePath: null
    }
}
```

### Standalone
If you want this functionality free of grunt, you can also `require('grunt-tessel')` and you'll get the two functions by themselves.

```js
var gruntTessel = require('grunt-tessel');

gruntTessel
    .blacklistDevDeps()
    .then(gruntTessel.push);
```

### Contributing
I'm by no means an expert with tessel development. I am happy to evolve these tasks as best practies for working with the tessel become apparent. PRs welcome if you have ideas for ways to make this better.
