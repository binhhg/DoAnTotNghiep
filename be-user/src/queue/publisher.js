module.exports = class Publisher {
  constructor (channel, exchange, exchangeType) {
    this.exchange = exchange
    this.pubChannel = channel
    channel.assertExchange(exchange, exchangeType, {
      autoDelete: false,
      durable: true,
      passive: true
    })
  }

  async publish (obj, routingKey) {
    try {
      let msg = ''
      if (obj) {
        if (obj.constructor === Object) {
          msg = JSON.stringify(obj)
        } else if (obj.constructor === String) {
          msg = obj
        }
      }
      if (msg) {
        console.log('startPub', obj)
        await this.pubChannel.publish(this.exchange, routingKey, Buffer.from(msg))
        console.log('pubSuccess', msg.length)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async sendToQueue (obj, queue, option) {
    try {
      let msg = ''
      if (obj) {
        if (obj.constructor === Object) {
          msg = JSON.stringify(obj)
        } else if (obj.constructor === String) {
          msg = obj
        }
      }
      if (msg) {
        console.log('startPub')
        await this.pubChannel.sendToQueue(this.queue || queue, Buffer.from(msg), option)
        console.log('pubSuccess', msg.length)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async sendToQueueOdoo (obj, queue, option) {
    try {
      let msg = ''
      if (obj) {
        if (obj.constructor === Object) {
          msg = JSON.stringify(obj)
        } else if (obj.constructor === String) {
          msg = obj
        }
      }
      if (msg) {
        console.log('startPub')
        const qq = Math.floor(Date.now() / 1000)
        await this.pubChannel.sendToQueue(this.queue || queue, Buffer.from(`{"id": ${qq}, "task": "carpla.car", "args": [], "kwargs": ${msg}, "retries": 0}`), {
          contentType: 'application/json',
          contentEncoding: 'utf-8'
        })
        console.log('send odoo update ', obj)
        console.log('pubSuccess', msg.length)
      }
    } catch (e) {
      console.error(e)
    }
  }
}
