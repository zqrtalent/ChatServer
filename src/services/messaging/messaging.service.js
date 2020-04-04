const logger = require('../../common/logger')
const amqp = require('amqplib/callback_api')

let amqpChannel = null // Channel

/**
 * Sets up queues.
 * @param {*} opts Initialize connection options.
 * @param {*} channel RabbitMQ channel instance object.
 */
const setupQueues = (opts, channel) => {
    const queues = opts.queues || [];
    queues.forEach(q => {
        channel.assertQueue(q.queueName, { durable: q.persistMessages || false });
    });
}

/**
 * Sends message to a particular message queue.
 * @param {String} queue Queue name message send to.
 * @param {Object} message Message object contaning 'type' property referring to the type name of the message.
 */
const sendMessage = (queue, message) => {
    if(amqpChannel == null){
        logger.error('RabbitMQ channel is not initialized!')
        return false
    }

    if(typeof message.type != "string" || message.type.length == 0){
        logger.error('Message must containt property :type:!')
        return false
    }
    
    amqpChannel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true })
    return true;
}

/**
 *  Initializes RabbitMQ service connection and sets up the message consumer flows, based on options.queues argument. 
 * @param { 
    * amqpUrl: String, 
    * queues: [ 
    * { 
    *      queueName: String, 
    *      onMessageCallback: (queueName: String, msg: Object, oncomplete: (message: Object) => {}) => {}, 
    *      noAck: Boolean,
    *      persistMessages: Boolean
    * } ]} options 
    */
const init = (opts) => {
    return new Promise((resolve, reject) => {
        const amqpUrl = opts.amqpUrl
        amqp.connect(amqpUrl, (err, conn) => {
            if(err != null){
                logger.error(err)
                reject(err) // Reject with error
                return;
            }

            conn.on('error', (err) => {
                if (err.message !== 'Connection closing') {
                    logger.error('[AMQP] conn error: ' + err.message)
                }
            });

            conn.on('close', () => {
                logger.error('[AMQP] reconnecting')
                amqpChannel = null
                //return setTimeout(start, 1000);
            });
            
            logger.info('[AMQP] connected')

            conn.createChannel((err, channel) => {
                if(err != null){
                    logger.error(err)
                    reject(error) // Reject with error
                    return
                }
                
                // Setup queues.
                setupQueues(opts, channel)

                // Channel has created.
                amqpChannel = channel

                // Register consume message functionality.
                const queues = opts.queues || []
                queues.forEach(q => {
                    if(typeof (q.onMessageCallback || '') != 'function'){
                        return
                    }
                    channel.consume(q.queueName, 
                        (msg) => {
                            q.onMessageCallback(
                                q.queueName, 
                                msg, 
                                (message) => {
                                    // Send ACK message back.
                                    if((q.noAck || true) === false){
                                        amqpChannel.ack(message)
                                    }
                                } )
                        }, { noAck: q.noAck || true });
                })

                resolve({
                    sendMessage
                }) // DONE
            })
        })
    })
}

module.exports = init