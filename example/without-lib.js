console.time("BENCH-WITHOUT-LIB");
const { readFileSync } = require("fs");
const { resolve } = require("path");

const itens = JSON.parse(readFileSync(resolve(__dirname, "app.json"), "utf8"));

const result = itens.find(item => item === 152);

console.log("without:", result);

console.timeEnd("BENCH-WITHOUT-LIB");
