console.time("BENCH-WITH-LIB");
console.log("\n\n");
const { useConcurrency, SlaveThread } = require("../dist");

const one = new SlaveThread();
const two = new SlaveThread();
const three = new SlaveThread();
const four = new SlaveThread();

// prettier-ignore
(async () => {
  const chain = useConcurrency([
    // one
    one.useThread(() => {
      const { readFileSync } = require("fs");
      const { resolve } = require("path");
      /**@type {number[]} */
      const itens = JSON.parse(readFileSync(resolve(__dirname, "app.json"), "utf8"));

      return itens.slice(0,5_000_000).find(item => item === 152)    
    }, []),
    // two
    two.useThread(() => {
      const { readFileSync } = require("fs");
      const { resolve } = require("path");
      /**@type {number[]} */
      const itens = JSON.parse(readFileSync(resolve(__dirname, "app.json"), "utf8"));

      return itens.slice(5_000_001,10_000_000).find(item => item === 152)    
    }, []),
    // three
    three.useThread(() => {
      const { readFileSync } = require("fs");
      const { resolve } = require("path");
      /**@type {number[]} */
      const itens = JSON.parse(readFileSync(resolve(__dirname, "app.json"), "utf8"));

      return itens.slice(10_000_001,15_000_000).find(item => item === 152)    
    }, []),
    //four
    four.useThread(() => {
      const { readFileSync } = require("fs");
      const { resolve } = require("path");
      /**@type {number[]} */
      const itens = JSON.parse(readFileSync(resolve(__dirname, "app.json"), "utf8"));

      return itens.slice(15_000_001,20_000_000).find(item => item === 152)    
    }, [])
  ], {
    resolveWhen: data => data !== undefined
  })

  const results = await chain();

  console.log("with:", results);

  console.timeEnd("BENCH-WITH-LIB");
  one.kill();
  two.kill();
  three.kill();
  four.kill();
})();
