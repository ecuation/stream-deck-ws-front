import { Greeter } from "./greeter";
import { OBSService } from "./services/OBSService";
import { io } from "socket.io-client";
import { DispatcherService } from "./services/DispatcherService";

(async () => {
  const obs = new OBSService();
  await obs.connect();

  const socket = io("http://localhost:8081");
  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("obs-channel", async (arg) => {
    console.log("instructions: ", arg);
    const dispatcher = new DispatcherService(arg, obs);
    await dispatcher.make();
  });
})();

const g = new Greeter("Juri");
g.greet();
