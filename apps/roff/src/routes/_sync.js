import { defineWebSocket, eventHandler } from "vinxi/http";

// TODO: persist this on disk
const cids = []
const cidToPeer = {}
const log = {}

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
          cidToPeer[data.body.cid] = peer
          // send unmerged transactions
          console.log(log)
          peer.send(JSON.stringify({
            ok: true,
            message: 'cid registered',
            action: 'sync',
            body: {
              transactions: Object.keys(log)
                .filter((tx) => tx >= data.body.maxTx)
                .reduce((acc, tx) => ({ ...acc, [tx]: log[tx] }), {})
            }
          }))
          break
        case 'push':
          Object.keys(data.body.transactions).map((tx) => {
            log[tx] = [...(log[tx] ?? []), ...data.body.transactions[tx]]
          })
          // sync to all registered clients
          cids.forEach((cid) => {
            if (cid === data.cid) return
            console.log('send to', cidToPeer[cid], data.body.transactions)
            cidToPeer[cid].send(JSON.stringify({
              ok: true,
              message: '',
              action: 'sync',
              body: {
                transactions: data.body.transactions
              }
            }))
          })
          // send txs to remove from log
          peer.send(JSON.stringify({
            ok: true,
            message: '',
            action: 'pushed',
            body: {
              txs: Object.keys(data.body.transactions)
            }
          }))
          break
        case 'debug':
          console.log(log)
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
