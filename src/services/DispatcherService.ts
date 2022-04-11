import type { Instructions } from "../shared/Models";
import type { OBSService } from "./OBSService";

export class DispatcherService {
  private instructions: Instructions;
  private obs: OBSService;

  constructor(instructions: Instructions, obs: OBSService) {
    this.instructions = instructions;
    this.obs = obs;
  }

  async make() {
    const insutructions = Object.keys(this.instructions) as [
      "setScene",
      "mute",
      "setFilter",
      "hideAndShowSource",
      "setSceneItemProperties",
      "displaySource"
    ];

    try {
      for (const instruction of insutructions) {
        await this[instruction]();
      }
    } catch (error) {
      throw error;
    }
  }

  async setSceneItemProperties() {
    try {
      const actions = this.instructions.setSceneItemProperties;
      for (const action of actions) {
        await this.obs.setItemFromCurrentSceneVisibleTo(
          action.sourceName,
          action.visible
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async setScene() {
    try {
      await this.obs.switchToScene(this.instructions.setScene);
    } catch (error) {
      throw error;
    }
  }

  async mute() {
    try {
      const actions = this.instructions.mute;
      for (const action of actions) {
        await this.obs.muteAudioItem(action.item, action.status);
      }
    } catch (error) {
      throw error;
    }
  }

  async setFilter() {
    try {
      const actions = this.instructions.setFilter;
      for (const filter of actions) {
        await this.obs.setSourceFilterVisibility(filter);
      }
    } catch (error) {
      throw error;
    }
  }

  async displaySource() {
    const actions = this.instructions.displaySource;
    for (const filter of actions) {
      const { sourceName, visible } = filter;
      await this.obs.setItemFromCurrentSceneVisibleTo(sourceName, visible);
    }
  }

  async hideAndShowSource(): Promise<void> {
    const actions = this.instructions.hideAndShowSource;
    for (const filter of actions) {
      const { sourceName } = filter;

      await this.obs.setItemFromCurrentSceneVisibleTo(sourceName, false);
      setTimeout(async () => {
        await this.obs.setItemFromCurrentSceneVisibleTo(sourceName, true);
      }, 3000);
    }
  }
}
