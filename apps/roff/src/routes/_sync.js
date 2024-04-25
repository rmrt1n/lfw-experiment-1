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
      let data;
      try {
        data = JSON.parse(message.text())
      } catch (error) {
        peer.send(JSON.stringify({ ok: false, message: 'bad request' }))
        return
      }
      if (!data.action) {
        peer.send(JSON.stringify({ ok: false, message: 'bad request' }))
      }
      switch (data.action) {
        case 'register':
          if (!cids.includes(data.body.cid)) {
            cids.push(data.body.cid)
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
