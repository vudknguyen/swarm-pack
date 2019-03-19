const yaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');
const compile = require('./compile/compile');
const deploy = require('./deploy');
const { inspectPack } = require('./repo');
const { searchRepositories } = require('./query');
const defaults_yaml = require('./config/defaults.yml.js');

async function compileAndDeploy({ stack, packRef, values = {} }) {
  const pack = await inspectPack(packRef);

  // Required files
  const template = (await fs.readFile(
    path.join(pack.dir, 'docker-compose.tpl.yml')
  )).toString('utf8');

  // Optional files
  const defaults = yaml.safeLoad(defaults_yaml);

  const newValues = Object.assign({}, defaults, values);

  return deploy(
    compile({
      manifests: pack.packFile.pack,
      packDir: pack.dir,
      template,
      values: newValues,
      stack
    })
  );
}

module.exports = {
  compileAndDeploy,
  compile,
  deploy,
  inspectPack,
  searchRepositories
};
