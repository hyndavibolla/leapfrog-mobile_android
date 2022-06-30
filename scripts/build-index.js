const { existsSync, unlinkSync, writeFileSync } = require('fs');
const { environment } = process.env;

const indexFilePath = './index.js';

if (existsSync(indexFilePath)) unlinkSync(indexFilePath);
writeFileSync(
  indexFilePath,
  (() => {
    switch (environment) {
      case 'storybook':
        return `import './storybook';`;
      case 'development':
      case 'qa':
      case 'uat':
      case 'production':
      default:
        return `import './leapfrog.index.js';`;
    }
  })()
);
