import { defineWebSocket, eventHandler } from "vinxi/http";

// TODO: persist this on disk
const cids = []

export default eventHandler({
  handler: () => { },
  websocket: defineWebSocket({
    async open(peer) {
      console.log(`[ws] open: ${peer}`);
    },
    async message(peer, message) {
      const { action, body } = JSON.parse(message.text())
      switch (action) {
        case 'register':
          if (!cids.includes(body.cid)) {
            cids.push(body.cid)
          }
          peer.send(JSON.stringify({ ok: true, message: 'cid registered' }))
          break
        default:
          peer.send(JSON.stringify({ ok: false, message: 'unknown action' }))
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
