import { OBSService } from "./services/OBSService";
import { DispatcherService } from "./services/DispatcherService";
const io = require("socket.io-client");

(async () => {
  const obsService = new OBSService();
  await obsService.connect();

  const socket = io("http://localhost:8081");
  socket.on("connect", () => {
    console.log("connection: ", socket.id);
  });

  socket.on("obs-channel", async (instructions: any) => {
    // console.log("instructions: ", instructions);
    const dispatcher = new DispatcherService(instructions, obsService);
    await dispatcher.make();
  });
})();
