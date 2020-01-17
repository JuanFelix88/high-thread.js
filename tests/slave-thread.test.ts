import { SlaveThread } from "../src";

test("Testing SlaveThread", async () => {
  const secondary = new SlaveThread();

  const resultThread = await secondary.useThread(() => {
    return "Test result thread";
  })();

  expect(resultThread).toBe("Test result thread");

  secondary.kill();
});
