import OBSWebSocket from "obs-websocket-js";
import { ItemProperties, Scene, FilterProperties } from "../shared/Models";

export class OBSService {
  obs: OBSWebSocket;

  constructor() {
    this.obs = new OBSWebSocket();
    this.obs.on("error", (err) => {
      console.error("socket error:", err);
      throw err;
    });
  }

  async connect(): Promise<void> {
    try {
      await this.obs.connect({
        address: process.env.OBS_HOST,
        password: process.env.OBS_PASSWORD,
      });

      console.log("OBS connection success!");
    } catch (error) {
      console.log("OBS cannot be connected: ", error);
      throw error;
    }
  }

  async switchToScene(sceneName: string): Promise<void> {
    try {
      await this.obs.send("SetCurrentScene", {
        "scene-name": sceneName,
      });
    } catch (error) {
      throw error;
    }
  }

  async getCurrentScene(): Promise<Scene> {
    try {
      return await this.obs.send("GetCurrentScene");
    } catch (error) {
      throw error;
    }
  }

  async getItemCurrentStatus(itemName: string): Promise<ItemProperties> {
    const currentScene = await this.getCurrentScene();
    return await this.obs.send("GetSceneItemProperties", {
      "scene-name": currentScene.name,
      item: { name: itemName },
    });
  }

  async setItemFromCurrentSceneVisibleTo(itemName: string, status: boolean) {
    const currentScene = await this.getCurrentScene();
    await this.obs.send("SetSceneItemProperties", {
      "scene-name": currentScene.name,
      visible: status,
      item: { name: itemName },
      bounds: {},
      scale: {},
      crop: {},
      position: {},
    });
  }

  async muteAudioItem(itemName: string, status: boolean) {
    try {
      await this.obs.send("SetMute", {
        source: itemName,
        mute: status,
      });
    } catch (error) {
      throw error;
    }
  }

  async setSourceFilterVisibility(filter: FilterProperties) {
    try {
      const { sourceName, filterName, filterEnabled } = filter;
      await this.obs.send("SetSourceFilterVisibility", {
        sourceName,
        filterName,
        filterEnabled,
      });
    } catch (error) {
      throw error;
    }
  }
}
