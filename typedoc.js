const TypeDoc = require("typedoc");
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'docs';
const BASE_PATH = 'src';

function getModuleNamesWithPath(basePath) {
  const files = fs.readdirSync(basePath, { 
    withFileTypes: true
  });
  const directories = files.filter((dirent) => dirent.isDirectory());
  return directories.map((dirent) => `${basePath}${path.sep}${dirent.name}`);
}

async function main() {
  const app = new TypeDoc.Application();
  app.options.addReader(new TypeDoc.TSConfigReader());

  const fileNames = getModuleNamesWithPath(BASE_PATH);
  app.bootstrap({
    // typedoc options here
    entryPoints: fileNames,
    sort: ["source-order", "visibility"],
    excludePrivate: true
  });

  const project = app.convert();

  if (project) {
    // Project may not have converted correctly
    const outputDir = OUTPUT_DIR;

    // Rendered docs
    await app.generateDocs(project, outputDir);
  }
}

main().catch(console.error);