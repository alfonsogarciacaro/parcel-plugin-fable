# Fable Parcel Template

This template can be used to generate a simple web app with [Fable](http://fable.io/).
You can find more templates by searching `Fable.Template` packages in [Nuget](https://www.nuget.org).

## Requirements

* [dotnet SDK](https://www.microsoft.com/net/download/core) 2.0 or higher
* [node.js](https://nodejs.org) 6.11 or higher
* A JS package manager: [yarn](https://yarnpkg.com) or [npm](http://npmjs.com/)

> npm comes bundled with node.js, but we recommend to use at least npm 5. If you have npm installed, you can upgrade it by running `npm install -g npm`.

Although is not a Fable requirement, on macOS and Linux you'll need [Mono](http://www.mono-project.com/) for other F# tooling like Paket or editor support.

## Editor

The project can be used by editors compatible with the new .fsproj format, like VS Code + [Ionide](http://ionide.io/), Emacs with [fsharp-mode](https://github.com/fsharp/emacs-fsharp-mode) or [Rider](https://www.jetbrains.com/rider/). **Visual Studio for Mac** is also compatible but in the current version the package auto-restore function conflicts with Paket so you need to disable it: `Preferences > Nuget > General`.

## Installing the template

In a terminal, run `dotnet new -i Fable.Template` to install or update the template to the latest version.

## Creating a new project with the template

In a terminal, run `dotnet new fable` to create a project in the current directory. Type `dotnet new fable -n MyApp` instead to create a subfolder named `MyApp` and put the new project there.

> The project will have the name of the directory. You may get some issues if the directory name contains some special characters like hyphens

## Building and running the app

> In the commands below, yarn is the tool of choice. If you want to use npm, just replace `yarn` by `npm` in the commands.

* Install JS dependencies and Install F# dependencies: `yarn install`
* Start Fable daemon and [Parcel](https://parceljs.org/) dev server: `yarn start`
* In your browser, open: http://localhost:1234/

> Note: `dotnet fable yarn-start` (or `npm-start`) is used to start the Fable daemon and run a script in package.json concurrently. It's a shortcut of `yarn-run [SCRIPT_NAME]`, e.g. `dotnet fable yarn-run start`.

Any modification you do to the F# code will be reflected in the web page after saving. When you want to output the JS code to disk, run `yarn build`, and you'll get a minified JS bundle in the `dist` folder.

## JS Output

To replace objects and APIs that may be missing in old browsers, the `index.html` file [submits a request](https://github.com/fable-compiler/fable-templates/blob/7b9352cdaeb77ecd600b45ed4eab2f41c73b85e4/simple/Content/public/index.html#L8) to [cdn.polyfill.io](https://polyfill.io/v2/docs/) that tailors the polyfill according to the user's browser.

## Project structure

### Paket

[Paket](https://fsprojects.github.io/Paket/) is the package manager used for F# dependencies. It doesn't need a global installation, the binary is included in the `.paket` folder. Other Paket related files are:

- **paket.dependencies**: contains all the dependencies in the repository.
- **paket.references**: there should be one such a file next to each `.fsproj` file.
- **paket.lock**: automatically generated, but should be committed to source control, [see why](https://fsprojects.github.io/Paket/faq.html#Why-should-I-commit-the-lock-file).
- **Nuget.Config**: prevents conflicts with Paket in machines with some Nuget configuration.

> Paket dependencies will be installed in the `packages` directory. See [Paket website](https://fsprojects.github.io/Paket/) for more info.

### yarn/npm

- **package.json**: contains the JS dependencies together with other info, like development scripts.
- **yarn.lock**: is the lock file created by yarn.

> JS dependencies will be installed in `node_modules`. See [yarn](https://yarnpkg.com) and/or [npm](http://npmjs.com/) websites for more info.

### Parcel

[Parcel](https://parcejs.org) is a bundler, which links different JS sources into a single file making deployment much easier. It also offers other features, like a static dev server that can automatically refresh the browser upon changes in your code or a minifier for production release. Fable interacts with Parcel through `fable-splitter`, which is added to `package.json` whenever it isn't present. See [Parcel website](https://parceljs.org) for more info.

### F# source files

The template only contains two F# source files: the project (.fsproj) and a source file (.fs) in `src` folder.

## Where to go from here

Check more [Fable samples](https://github.com/fable-compiler/samples-browser), use another template like `Fable.Template.Elmish.React` or `SAFE.Template`, and check the [awesome-fable](https://github.com/kunjee17/awesome-fable#-awesome-fable) for a curated list of resources provided by the community.