<img src="./assets/logo.jpg" style="width: 420px">

# High Thread.js

### Why _Higher Thread.js_?

This lib implements a abstract methods with Node.js api with `Worker Threads`. Features a scalable, easy-to-use parallel programming form.

### When should I use it?

At times of deadlocks on the main thread is a great example of a wise approach to thread usage, see below:

Without the library:

```js
console.time("WITHOUT-LIB");
for (let index = 0; index < 100_000; index++) {
  for (let index2 = 0; index2 < 50_000; index2++) {}
}
console.timeEnd("WITHOUT-LIB");
```

With the library:

```js
console.time("WITH-LIB");
const { SlaveThread } = require("higher-thread");

const secondary = new SlaveThread();

(async () => {
  const algorithm = secondary.useThread(() => {
    for (let index = 0; index < 100_000; index++) {
      for (let index2 = 0; index2 < 50_000; index2++) {}
    }
  });

  await algorithm();
  console.timeEnd("WITH-LIB");
})();
```

Although the time difference between them may be small (or even smaller than the first implementation), but we must emphasize that in the second code we did not get the main thread lock, this is the point where we want to get.

### License

MIT © **High Thread.js**