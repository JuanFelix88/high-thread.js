<img src="./assets/logo.jpg" style="width: 350px">

# High Thread.js

## Table of contents
- [High Thread.js](#high-threadjs)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [Motivation](#motivation)
  - [Roadmap](#roadmap)
  - [Installation](#installation)
  - [Guides](#guides)
    - [Basics Thread Spawn](#basics-thread-spawn)
    - [License](#license)

## Overview

**High Thread.js** is an abstraction for Node.js api `woker_threads`, focused on agility and performance during the development of highly complex algorithms or that need parallelism. 

## Motivation

**High Thread.js** was motivated to be created due to a deficit of data manipulation and parallel computing in `Node.js`, then encouraged to abstract practical and agile functions and methods to define a robust api that makes sense in the daily use of applications that demand such a need; 

## Roadmap

- Faster;
- In tests (IMPORTANT);
- Proper Documentation;
- no additional modules;
- Friendly API;

## Installation

**High Thread.js** is available at npm and you can purchase them through the following commands:

npm:

```
$ npm i xxxxx
```

or yarn:

```
$ yarn add xxxxx
```

## Guides

### Basics Thread Spawn

This bellow is code for a simple thread spawn:

```js
const { threadSpawn } = require("xxxxx");

const arr = [0, 1, 2, 3, 4];

const result = await threadSpawn(() => (
  arr.map((item, index) => Math.pow(item, index))
), [arr])

// prints result
console.log(result);
```

### License

MIT © **High Thread.js**
