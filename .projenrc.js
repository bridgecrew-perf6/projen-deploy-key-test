const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Amir Szekely',
  authorAddress: 'kichik@gmail.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'projen-deploy-key-test',
  repositoryUrl: 'https://github.com/kichik/projen-deploy-key-test.git',
  description: 'Test repo for https://github.com/projen/projen/pull/1906',

  // deps: [],                /* Runtime dependencies of this module. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */

  publishToGo: {
    moduleName: 'github.com/kichik/projen-deploy-key-test-go',
    githubUseSsh: true,
  },

  depsUpgrade: false,
});

const releaseWorkflow = project.github.tryFindWorkflow('release');
// skip npm as we are only testing golang
releaseWorkflow.file.addDeletionOverride('jobs.release_npm');
// inject our branch of publib
releaseWorkflow.file.addOverride('jobs.release_golang.steps.8.run', `wget https://github.com/kichik/publib/archive/refs/heads/patch-1.tar.gz
tar xzf patch-1.tar.gz
cd publib-patch-1
yarn
npm run build
sudo npm i -g dist/js/publib-0.0.0.tgz
publib-golang`);

project.synth();