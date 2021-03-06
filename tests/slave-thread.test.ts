import { SlaveThread } from "../src";

/**
 * Assembly test of a function that links two threads;
 * - For reuse of a specific function;
 */
test("Testing SlaveThread useThread", async (): Promise<void> => {
  const { useThread, kill } = new SlaveThread();

  const app = 0;

  const functGetApp = useThread(() => {
    return app;
  }, [app]);

  const a = await functGetApp();
  const b = await functGetApp();
  const c = await functGetApp();

  kill();

  expect([a, b, c]).toEqual([0, 0, 0]);
}, 1000);

/**
 * Test using a quick execution of a child thread;
 * - Fast use case;
 */
test("Testing SlaveThread threadSpawn", async (): Promise<void> => {
  const { threadSpawn, kill } = new SlaveThread();

  const app = [0, 1, 2, 3];

  const result = await threadSpawn(() => {
    return app.map(item => item + 1);
  }, [app]);

  kill();
}, 1000);
