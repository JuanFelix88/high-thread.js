import { SlaveThread, useParallel } from "../src";

test("Parallel chain", async () => {
  const secondary = new SlaveThread();
  const tertiary = new SlaveThread();

  const data = [...Array(500000)].map(() => Math.floor(Math.random() * 20));

  data[Math.floor(Math.random() * data.length)] = 35;

  const func = useParallel<number>([
    secondary.useThread(() => {
      return data.find(item => item === 35);
    }, [data]),
    tertiary.useThread(() => {
      return data.reverse().find(item => item === 35);
    }, [data])
  ]);

  const result = await func();

  expect(result).toEqual([35, 35]);

  secondary.kill();
  tertiary.kill();
}, 3000);
