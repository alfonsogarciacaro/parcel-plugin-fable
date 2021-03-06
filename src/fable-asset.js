const commandExists = require("command-exists");
const fableUtils = require("fable-utils");
const path = require("path");
const { Asset } = require("parcel-bundler");

// TODO: see if there is a way to clean up these requires
const uglify = require("parcel-bundler/src/transforms/uglify");
const fs = require("parcel-bundler/src/utils/fs");
const localRequire = require("parcel-bundler/src/utils/localRequire");

class FableAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = "js";
    this.outputCode = null;
  }

  process() {
    // We don't want to process this asset if the worker is in a warm up phase
    // since the asset will also be processed by the main process, which
    // may cause errors since rust writes to the filesystem.
    if (this.options.isWarmUp) {
      return;
    }

    return super.process();
  }

  async parse(code) {
    const fableSplitter = await this.requireDependencies();
    let options = {
      entry: this.name,
      outDir: path.dirname(this.name),
      babel: fableUtils.resolveBabelOptions({
        plugins: [
          // default Babel plugins
          "babel-plugin-transform-es2015-modules-commonjs"
        ]
      })
    };

    // read project config, and use that as the base
    const config = await this.getConfig(["fable-splitter.config.js"]);
    if (config) {
      options = Object.assign(config, options);
    }

    const info = await fableSplitter(options);

    // fable-splitter will bubble up errors, but it will also still
    // display them. No need to display the errors via Parcel, so a
    // simple message should do.
    if (Array.isArray(info.logs.error) && info.logs.error.length > 0) {
      throw new Error("Compilation error. See log above");
    }

    // add compiled paths as dependencies for watch functionality
    // to trigger rebuild on F# file changes
    Array.from(info.compiledPaths).map(p =>
      this.addDependency(p, { includedInParent: true })
    );

    await this.populateContents();

    // `this.contents` becomes the new value for `this.ast`
    return this.contents;
  }

  // final transformations before bundle is generated
  async transform() {
    if (this.options.minify) {
      await uglify(this);
    }
  }

  async generate() {
    return {
      [this.type]: this.outputCode || this.contents
    };
  }

  generateErrorMessage(error) {
    return (
      path.relative(process.cwd(), this.options.rootDir) +
      path.sep +
      this.relativeName +
      ": " +
      error.message
    );
  }

  // helpers

  async requireDependencies() {
    // dotnet SDK tooling is required by Fable to operate successfully
    try {
      await commandExists("dotnet");
    } catch (e) {
      throw new Error(
        "dotnet isn't installed. Visit https://dot.net for more info"
      );
    }

    await localRequire("babel-core", this.name);
    const fable = await localRequire("fable-splitter", this.name);
    return fable.default;
  }

  async populateContents() {
    // TODO: possible without temp file?
    try {
      const outputFile = this.name.replace(/\.(fsproj|fsx)$/, ".js");
      const outputContent = await fs.readFile(outputFile);
      this.contents = outputContent.toString();
    } catch (e) {
      throw new Error("Intermediate build file missing");
    }
  }
}

module.exports = FableAsset;
