import { defineWebSocket, eventHandler } from "vinxi/http";

export default eventHandler({
  handler: () => { },
  websocket: defineWebSocket({
    async open(peer) {
      console.log(`[ws] open: ${peer}`);
    },
    async message(peer, message) {
      if (message.text().includes("ping")) {
        peer.send("pong");
      }
    },
    async close(peer, event) {
      console.log("[ws] close", peer, event);
    },
    async error(peer, error) {
      console.log("[ws] error", peer, error);
    },
  })
});
