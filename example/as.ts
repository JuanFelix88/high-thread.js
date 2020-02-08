import { SlaveThread } from "../src";

const { useThread, kill } = new SlaveThread();

const app = 23;

// prettier-ignore
(async () => {

  const functGetApp = useThread(() => {
    return app;
  }, [app]);
  
  const a = await functGetApp();
  const b = await functGetApp();
  console.time("bench")
  const c = await functGetApp();

  console.timeEnd("bench")

  console.log(a, b, c);

  kill();



})();
