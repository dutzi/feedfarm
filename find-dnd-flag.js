const { find } = require('find-in-files');

find('no-deploy', './src', '.').then(results => {
  if (Object.keys(results).length) {
    console.log('\n[find-dnd-flag] Found no-deploy flag in some of the files:');
    console.log('- ' + Object.keys(results).join('\n -') + '\n');
    process.exit(1);
  }
});
