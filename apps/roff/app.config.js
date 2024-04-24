import { defineConfig } from '@solidjs/start/config'

const config = defineConfig({
  server: {
    experimental: {
      websocket: true
    }
  }
})

config.addRouter({
  name: 'websocket',
  type: 'http',
  handler: './src/routes/_sync.js',
  target: 'server',
  base: '/_sync'
})

export default config
