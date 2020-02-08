import { SlaveThread } from "../src";

test("Testing SlaveThread", async (): Promise<void> => {
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
