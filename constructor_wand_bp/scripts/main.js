let system = server.registerSystem(0, 0);

system.initialize = function () {
  this.listenForEvent("minecraft:script_logger_config", (eventData) => {
    this.broadcastEvent("minecraft:script_logger_config", {
      log_errors: true,
      log_information: true,
      log_warnings: true
    });
  });

  this.listenForEvent("minecraft:player_used_item", (eventData) => {
    let player = eventData.data.player;
    let item = eventData.data.item_stack.item;

    if (item === "constructor:wand") {
      this.executeCommand(`/say §aConstructor Wand ativada!`, () => {});
      this.executeCommand(`/fill ~-2 ~ ~-2 ~2 ~ ~2 dirt replace water`, () => {});
    }
  });
};
