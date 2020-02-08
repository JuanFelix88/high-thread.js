const { SlaveThread } = require("../dist");
const vm = require("vm");
const v8 = require("v8");
const pider = require("./tes");

const getRef = val => {
  return value => {
    /**
     * @type {any}
     */
    var res;
    if (value) {
      eval(`res = ${Object.keys(val)[0]} = value`);
    } else {
      eval(`res = ${Object.keys(val)[0]}`);
    }
    return res;
  };
};

let app = 23;

const apx = getRef({ app });

console.log(app);

console.time("B");
pider(apx);
console.timeEnd("B");

console.log(app);
