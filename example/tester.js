const fn = require("./as");

/**
 * @returns {any}
 */
const useRef = ref => {
  let res;
  eval(`res = { get ["$"]() { return ${Object.keys(ref)[0]} },
        set ["$"](val) { ${Object.keys(ref)[0]} = val }
  }`);
  return res;
};

class STR extends String {
  constructor(value, varname) {
    super(value);
    var coa = 0;
    this._recons = this.getReconstructor(varname);
  }
  getReconstructor(varname) {
    var res;
    eval(`res = val => { 
      ${varname} = new STR(val, ${varname}) 
    }`);
    return res;
  }
  set ref(val) {
    this._recons(val);
  }
  get core() {
    return this.corex;
  }
  set core(val) {
    this.corex = val;
  }
}

let aps = new STR("Hey", "aps");

console.log(aps + "");
fn(aps);
aps.ref = "Joga";

console.log(aps + "");
