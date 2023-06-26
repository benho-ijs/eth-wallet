const dependencies = require('./package.json').dependencies || {};
const packageName = require('./package.json').name;

const Fs = require('fs');

async function readFile(fileName) {
  return new Promise((resolve, reject) => {
    Fs.readFile(fileName, 'utf8', function (err, data) {
      if (err)
        reject(err)
      else
        resolve(data)
    })
  })
}

async function build() {
  let result = await require('esbuild').build({
    entryPoints: ['src/plugin.ts'],
    outdir: 'dist',
    bundle: true,
    minify: false,
    format: 'cjs',
    external: [
      ...Object.keys(dependencies)
    ],
    plugins: [],
  }).catch(() => process.exit(1));
  let content = await readFile('dist/plugin.js');
  let web3 = await readFile('src/lib/web3/1.9.0/web3.min.js');
  let bignumber = await readFile('node_modules/bignumber.js/bignumber.js');
//   define("aws-sdk", ()=>{});
// define("asn1.js", ()=>{});
// define("bn.js", ()=>{});
  content = `
var __defineAmdValue;
if (typeof(define) == 'function'){
  __defineAmdValue = define.amd;
  define.amd = null;
};
${web3}
${bignumber}
define("ethereumjs-tx", ()=>{});
define("ethereumjs-util", ()=>{});
define("ethereum-cryptography/keccak", ()=>{});
define("web3", (require,exports)=>{
    exports['web3'] = window["Web3"];
});
define("bignumber.js", (require,exports)=>{
    exports['BigNumber'] = window["BigNumber"];
});
define("@ijstech/eth-wallet",(require, exports)=>{
${content}
});
if (typeof(define) == 'function')
  define.amd = __defineAmdValue;
`

  Fs.writeFileSync('dist/plugin.js', content);
  Fs.renameSync('dist/plugin.js', 'dist/index.js');
  // Fs.copyFileSync('src/lib/web3/1.9.0/web3.min.js', 'dist/web3.js');
};
build();