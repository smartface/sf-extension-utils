const TypeDoc = require("typedoc");
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'docs';
const BASE_PATH = 'src';

function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath) {
  return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

function getModuleNamesWithPath(basePath) {
  const directories = getDirectoriesRecursive(basePath);
  return directories;
}

async function main() {
  const app = new TypeDoc.Application();
  app.converter.on(TypeDoc.Converter.EVENT_RESOLVE_BEGIN, (context) => {
    // Some extra sanity checks would be good here.
    // context is of type Context, which typedoc <0.22 doesn't publicly export
    context.project?.children?.forEach(submodule => {
      const oldDefault = submodule?.children?.find((reflection) => reflection.name === "default" && reflection.kind === 128);
      oldDefault?.children?.forEach((child) => {
        submodule.children.push(child)
        child.parent = submodule;
      });
      if (oldDefault) {
        oldDefault.children = undefined;
        context.project.removeReflection(oldDefault);
      }
    });
  });
  app.options.addReader(new TypeDoc.TSConfigReader());
  const fileNames = getModuleNamesWithPath(BASE_PATH);
  app.bootstrap({
    entryPoints: fileNames,
    sort: ["source-order", "visibility"],
    excludePrivate: true,
    excludeNotDocumented: false,
    excludeInternal: true,
    pretty: true,
    categorizeByGroup: true,
    emit: true
  });

  const project = app.convert();
  
  // Project may not have converted correctly
  if (project) {
    // Rendered docs
    await app.generateDocs(project, OUTPUT_DIR);
  }
}

main().catch(console.error);