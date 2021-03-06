import { SlaveThread, useParallel } from "../src";

// prettier-ignore
(async () => {
  const secondary = new SlaveThread();
  const tertiary = new SlaveThread();
  
  const data = [...Array(500000)].map(() => Math.floor(Math.random() * 20));
  
  data[Math.floor(Math.random() * data.length)] = 35;
  
  const func = useParallel([
    secondary.useThread(() => {
      return data.find(item => item === 35);
    }, [data]),
    tertiary.useThread(() => {
      return data.reverse().find(item => item === 35);
    }, [data])
  ]);
  
  console.time('XXX')
  await func()
  console.timeEnd('XXX')

  console.time('XXX')
  await func()
  console.timeEnd('XXX')

  console.time('XXX')
  await func()
  console.timeEnd('XXX')
})();
