const logger = require('../../common/logger')
const amqp = require('amqplib/callback_api')

/*

Features to be added:
    - Reconnect 
    - Dead letter queue.
    - Hearbeat check method.
    - Graceful close of the connection.
*/

let amqpChannel = null // Channel

/**
 * Sets up queues.
 * @param {*} opts Initialize connection options.
 * @param {*} channel RabbitMQ channel instance object.
 */
const setupQueues = (opts, channel, onAssertQueueCallback) => {
    const queues = opts.queues || [];
    queues.forEach(qOpts => {
        // Assert Dead-Letter-Exchange.
        const dlx = 'dead-letter-ex'
        channel.assertExchange(dlx, 'direct', { durable: true })

        // Assert Queue
        channel.assertQueue(qOpts.queueName, { 
            exclusive: false, 
            deadLetterExchange: dlx, 
            //messageTtl (0 <= n < 2^32): expires messages arriving in the queue after n
            durable: qOpts.persistMessages || false 
        }, (err, q) => {
            if(err){
                logger.error(`assertQueue() error: ${err.toString()}`)
            }
            else{
                // Bind queue to the exchange.
                channel.bindQueue(q.queue, dlx)
                // Invoke callback
                onAssertQueueCallback(channel, q, qOpts)
            }
        })
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
    
    amqpChannel.publish(/*exchange*/'', queue, Buffer.from(JSON.stringify(message)), { persistent: true })
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

                // One message to a worker at a time.
                //channel.prefetch(1)
                
                // Channel has created.
                amqpChannel = channel

                // Setup queues.
                setupQueues(opts, channel, (ch, q, qOpts) => {
                    if(typeof (qOpts.onMessageCallback || '') != 'function'){
                        return
                    }

                    channel.consume(qOpts.queueName, async (msg) => {
                        try{
                            await qOpts.onMessageCallback(qOpts.queueName, msg, 
                                (message) => {
                                    // Send ACK message back.
                                    if(qOpts.noAck === false){
                                        amqpChannel.ack(message)
                                    }
                                })
                        }
                        catch(err){
                            amqpChannel.nack(msg, false, false)

                            // let retryCt = msg.properties.headers['x-retry-ct']
                            // if(typeof retryCt == 'undefined'){
                            //     retryCt = 2 // Max retry count.
                            // }

                            // // Move to DLQ
                            // if(retryCt <= 0){
                            //     amqpChannel.nack(msg, false, false)
                            // }
                            // else{
                            //     // Send ack
                            //     amqpChannel.ack(msg)

                            //     // Requeue message with retry flag.
                            //     amqpChannel.publish('', msg.fields.routingKey, msg.content, { 
                            //         persistent: true,
                            //         headers:{
                            //             'x-retry-ct': retryCt - 1
                            //         }
                            //     })
                            // }
                        }
                    }, { noAck: qOpts.noAck });
                })

                resolve({
                    sendMessage
                }) // DONE
            })
        })
    })
}

module.exports = init