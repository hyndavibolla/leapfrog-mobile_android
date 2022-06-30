const { execSync } = require('child_process');

console.log('------------------------');
console.log('Reporting tool versions:');

try {
  console.log('node:', execSync('node --version').toString().trim());
} catch {}

try {
  console.log('yarn:', execSync('yarn --version').toString().trim());
} catch {}

try {
  console.log(execSync('xcodebuild -version').toString().trim());
} catch {}

try {
  console.log('cocoapods:', execSync('pod --version').toString().trim());
} catch {}

try {
  console.log(execSync('python --version').toString().trim());
} catch {}

console.log('------------------------');
