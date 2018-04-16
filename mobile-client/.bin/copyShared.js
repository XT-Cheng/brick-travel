const path = require('path')
const klawSync = require('klaw-sync')
const fs = require('fs-extra')

const currentPath = `./src/components`;

const webClientPath = `web-client/src/app/@ui/components`;
const mobileClientPath = `mobile-client/src/components`;

const filterFn = item => {
  return path.extname(item.path) === '.ts';
} 

const paths = klawSync(currentPath,{filter: filterFn}).forEach(find => {
  // console.log(find.path);
  // console.log(find.path.replace(mobileClientPath,webClientPath));
  fs.copySync(find.path, find.path.replace(mobileClientPath,webClientPath));
});