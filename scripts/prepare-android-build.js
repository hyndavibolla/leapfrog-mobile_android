const { copyFile } = require('fs');
const { homedir } = require('os');

copyFile('./scripts/assets/gradle.properties', `${homedir()}/.gradle/gradle.properties`, err =>
  err ? console.error('Error Found: ', err) : console.log('grade.properties file generated successfully')
);
