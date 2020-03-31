
const delay = require('delay')

const init = (caching) => {
    /**
     * Sends group message to the users.
     * @param {*} groupId Group identifier.
     * @param {*} userIds Array of user ids.
     * @param {*} message 
     */
    const sendMessage = async (senderId, groupId, groupUserIds, text) => {
        if(!groupUserIds || !groupId || !text){
            return 0
        }

        let loop = 0
        const items = [{ groupId, message: { type:'text', text }}]
        for(let userId of groupUserIds){
            await caching.pushListItems(`gmsg:-${userId}`, items)
            loop ++
        }
        return loop
    }

    /**
     * Reads received messages if exists, otherwise waits for waitTimeSec seconds.
     * @param {*} userId 
     * @param {*} waitTimeSec 
     */
    const receiveMessage = async (userId, waitTimeSec) => {
        let messages = []
        let loopCt = waitTimeSec * 4
        while(loopCt > 0){
            // Pop all the values from cache list.
            let value = await caching.popValue(`gmsg:-${userId}`, 0)
            if(value){
                messages.push(value)
                while(value){
                    value = await caching.popValue(`gmsg:-${userId}`, 0)
                    if(value){
                        messages.push(value)
                    }
                }
            }

            if(messages.length > 0){
                break;
            }

            await delay(250)
            loopCt --;
        }

        // Parse to json and reverse messages
        return messages.map(x => JSON.parse(x)).reverse() 
    }

    return {
        receiveMessage,
        sendMessage
    }
}

module.exports = init