import { OBSService } from "./services/OBSService";
import { DispatcherService } from "./services/DispatcherService";
const io = require("socket.io-client");

(async () => {
  const obs = new OBSService();
  await obs.connect();

  const socket = io("http://localhost:8081");
  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("obs-channel", async (arg: any) => {
    console.log("instructions: ", arg);
    const dispatcher = new DispatcherService(arg, obs);
    await dispatcher.make();
  });
})();
