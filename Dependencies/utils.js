import {
    EnglishLanguage,
} from '../config.js';

import {
    heartbeatRate,
    antiCheatRate,
    channelID_Commands,
    channelID_UserStats,
    channelID_2StarVerificationForum,
    channelID_Webhook,
    channelID_Heartbeat,
    channelID_AntiCheat,
    channelID_MewtwoVerificationForum,
    channelID_CharizardVerificationForum,
    channelID_PikachuVerificationForum,
    channelID_MewVerificationForum,
    channelID_DialgaVerificationForum,
    channelID_PalkiaVerificationForum,
    channelID_ArceusVerificationForum,
    channelID_ShiningVerificationForum,
    channelID_BuzzwoleVerificationForum,
    text_verifiedLogo,
    text_likedLogo,
    text_waitingLogo,
    text_notLikedLogo,
    text_deadLogo,
} from '../config.js';

import {
    getGuild,
} from './coreUtils.js';

function formatNumbertoK(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    } else {
      return num.toString();
    }
}

function formatMinutesToDays(minutes) {
    const days = minutes / (24 * 60); // 1 day = 24 hours * 60 minutes
    return days.toFixed(1) + ' days';
  }

function sumIntArray( arrayNumbers ) {
    return arrayNumbers
      .filter(item => item !== undefined) // Filter undefined values
      .map(Number) // Convert strings to numbers
      .reduce((acc, curr) => acc + curr, 0); // Add the numbers
  }

function sumFloatArray( arrayNumbers ) {
    return arrayNumbers.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue), 0);
}

function roundToOneDecimal(num) {
    return parseFloat(num.toFixed(1));
}

function roundToTwoDecimals(num) {
    return parseFloat(num.toFixed(2));
}

function countDigits(str) {
    return (str.match(/\d/g) || []).length;
}

function extractNumbers(str) {
    return (str.match(/\d+/g) || []).map(Number);
}

function extractTwoStarAmount(inputString) {
    const match = inputString.match(/\[(\d+)\/5\]/);

    if (match && match[1]) {
        return match[1];
    }

    return 5;
}

function replaceLastOccurrence(str, search, replace) {
    const regex = new RegExp(`(${search})(?!.*\\1)`);
    return str.replace(regex, replace);
}

function replaceMissCount(str, newCount) {
    // Use a regular expression to find the number inside the brackets
    const regex = /\[ (\d+) miss \/ (\d+) \]/;
    // Replace the number inside the brackets with the new number while keeping the second number
    return str.replace(regex, (match, p1, p2) => `[ ${newCount} miss / ${p2} ]`);
}

function replaceMissNeeded(str, newCount) {
    // Use a regular expression to find the numbers inside the brackets
    const regex = /\[ (\d+) miss \/ (\d+) \]/;
    // Replace only the second number inside the brackets with the new total count
    return str.replace(regex, (match, p1, p2) => `[ ${p1} miss / ${newCount} ]`);
}

function isNumbers( input ){
    var isNumber = true;
    for (let i = 0; i < input.length; i++) {
        if(!/^\d+$/.test(input.charAt(i))){
            isNumber = false;
        }
    }
    return isNumber;
}

function convertMnToMs(minutes) {
    // 1 minute = 60,000 milliseconds
    const milliseconds = minutes * 60000;
    return milliseconds;
}

function convertMsToMn(milliseconds) {
    // 1 minute = 60,000 milliseconds
    const minutes = milliseconds / 60000;
    return minutes;
}

function splitMulti(str, tokens){
    var tempChar = tokens[0]; // We can use the first token as a temporary join character
    for(var i = 1; i < tokens.length; i++){
        str = str.split(tokens[i]).join(tempChar);
    }
    str = str.split(tempChar);
    return str;
}

async function sendReceivedMessage(client, msgContent, interaction = undefined, timeout = 0, channelID = channelID_Commands) {
    
    if(interaction != undefined) {
        var message = await interaction.editReply({ content: msgContent });
        
        if(parseFloat(timeout) > 0){
            setTimeout(async () => {
                try {
                    // Fetch the message to check if it still exists
                    const fetchedMessage = await message.fetch();
                    if (fetchedMessage) {
                        await fetchedMessage.delete();
                    } else {
                        console.log('❗️ Tried to delete nonexistent message');
                    }
                } catch {
                    console.log('❗️ Tried to delete nonexistent message');
                }
            }, parseFloat(timeout)*1000);
        }
    }
    else{
        sendChannelMessage(client, channelID, msgContent, timeout);
    }
}

async function sendChannelMessage(client, channelID, msgContent, timeout = 0) {
    
    const guild = await getGuild(client);

    if(timeout > 0){
        guild.channels.cache.get(channelID).send({ content:`${msgContent}`})
            .then(sentMessage => {
                setTimeout(async () => {
                    try {
                        // Fetch the message to check if it still exists
                        const fetchedMessage = await sentMessage.fetch();
                        if (fetchedMessage) {
                            await fetchedMessage.delete();
                        } else {
                            console.log('❗️ Tried to delete nonexistent message');
                        }
                    } catch {
                        console.log('❗️ Tried to delete nonexistent message');
                    }
                }, timeout * 1000);
            });
    }
    else{
        guild.channels.cache.get(channelID).send({ content:`${msgContent}`});
    }
}

async function bulkDeleteMessages(channel, numberOfMessages) {
    try {
        var totalDeleted = 0;
        const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000); // 14 days in milliseconds

        while (totalDeleted < numberOfMessages) {
            const remaining = numberOfMessages - totalDeleted;
            const limit = Math.min(remaining, 100);

            const fetchedMessages = await channel.messages.fetch({ limit });

            if (fetchedMessages.size === 0) {
                break;
            }

            // Filter out pinned messages and messages older than 14 days
            const messagesToDelete = fetchedMessages.filter(msg => {
                return !msg.pinned && msg.createdTimestamp > twoWeeksAgo;
            });

            if (messagesToDelete.size === 0) {
                console.log('⚠️ No deletable messages found (all are pinned or older than 14 days)');
                break;
            }

            try {
                // If only one message, use single delete instead of bulk delete
                if (messagesToDelete.size === 1) {
                    const message = messagesToDelete.first();
                    try {
                        await message.delete();
                        totalDeleted += 1;
                        console.log(`✅ Deleted 1 message individually`);
                    } catch (deleteError) {
                        if (deleteError.code === 10008) {
                            console.log('⚠️ Message already deleted, skipping...');
                            totalDeleted += 1; // Count as processed to avoid infinite loop
                        } else {
                            console.error('❌ Error deleting individual message:', deleteError.message);
                        }
                    }
                } else {
                    // Use bulk delete for multiple messages
                    const deletedMessages = await channel.bulkDelete(messagesToDelete, true); // true = filterOld
                    totalDeleted += deletedMessages.size;
                    console.log(`✅ Bulk deleted ${deletedMessages.size} messages`);
                }
            } catch (bulkError) {
                if (bulkError.code === 10008) {
                    console.log('⚠️ Some messages were already deleted, continuing...');
                    totalDeleted += messagesToDelete.size; // Count as processed
                } else if (bulkError.code === 50013) {
                    console.error('❌ Missing permissions to delete messages');
                    break;
                } else if (bulkError.code === 50034) {
                    console.log('⚠️ Messages too old for bulk delete, trying individual deletion...');
                    
                    // Try deleting each message individually
                    for (const message of messagesToDelete.values()) {
                        try {
                            await message.delete();
                            totalDeleted += 1;
                            await wait(0.1); // Small delay between individual deletions
                        } catch (individualError) {
                            if (individualError.code === 10008) {
                                console.log('⚠️ Message already deleted, skipping...');
                                totalDeleted += 1;
                            } else {
                                console.error('❌ Error deleting message individually:', individualError.message);
                            }
                        }
                    }
                } else {
                    console.error('❌ Unexpected error during bulk delete:', bulkError.message);
                    throw bulkError;
                }
            }

            // Add a small delay between batches to avoid rate limiting
            if (totalDeleted < numberOfMessages && messagesToDelete.size > 0) {
                await wait(0.5);
            }
        }

        console.log(`✅ Total messages processed: ${totalDeleted}`);
    } catch (error) {
        console.error('❌ ERROR in bulkDeleteMessages:', error.message);
        
        // Don't throw the error, just log it to prevent the entire operation from failing
        if (error.code === 10008) {
            console.log('⚠️ Some messages were already deleted - this is normal');
        } else if (error.code === 50013) {
            console.error('❌ Bot lacks permission to delete messages in this channel');
        } else {
            console.error('❌ Unexpected error during message deletion:', error);
        }
    }
}

function colorText( text, color ){
    
    if(color == "gray")
        return `[2;30m${text}[0m`

    if(color == "red")
        return `[2;31m${text}[0m`

    if(color == "green")
        return `[2;32m${text}[0m`

    if(color == "yellow")
        return `[2;33m${text}[0m`

    if(color == "blue")
        return `[2;34m${text}[0m`

    if(color == "pink")
        return `[2;35m${text}[0m`

    if(color == "cyan")
        return `[2;36m${text}[0m`
}

function addTextBar(str, targetLength, color = true) {
    const currentLength = str.length;
    // Calculate the number of spaces needed to reach the target length
    const spacesNeeded = Math.max(targetLength - currentLength - 1,0);
    // Create a string of spaces
    const spaces = ' '.repeat(spacesNeeded);
    // Return the string with the spaces and the bar added
    const bar = color == true ? colorText('|', "gray") : '|';
    return str + spaces + bar;
}

function formatNumberWithSpaces(number, totalLength) {

    const numberStr = number.toString();
    const currentLength = numberStr.replace('.', '').length;
    const spacesNeeded = Math.max(totalLength - currentLength,0);
    const formattedStr = numberStr + '⠀'.repeat(spacesNeeded);
    return formattedStr;
}

function localize( text_french, text_english ) {
    if(EnglishLanguage){
        return text_english;
    }
    else{
        return text_french;
    }
}

function getRandomStringFromArray(array) {
    if (!Array.isArray(array) || array.length === 0) {
        throw new Error("Array should not be empty");
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

async function getOldestMessage( channel ){

    let lastMessageId = null;
    let oldestMessage = null;

    try {
        while (true) {
            const options = { limit: 100 };
            if (lastMessageId) {
                options.before = lastMessageId;
            }

            const messages = await channel.messages.fetch(options);
            if (messages.size === 0) break;

            lastMessageId = messages.last().id;
            oldestMessage = messages.last();

            if (messages.size < 100) break;
        }

        if (oldestMessage) {
            return oldestMessage;
            // console.log(`ID : ${oldestMessage.id}`);
            // console.log(`Content : ${oldestMessage.content}`);
        } else {
            return ""
        }
    } catch (error) {
        console.log('❌ ERROR TRYING TO ACCESS OLDER MESSAGE');
    }    
}

function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function replaceAnyLogoWith(text, newLogo) {
    const editedText = text.replace(text_deadLogo,newLogo).replace(text_notLikedLogo,newLogo).replace(text_waitingLogo,newLogo).replace(text_likedLogo,newLogo).replace(text_verifiedLogo,newLogo);
    return editedText;
}

// Replace characters that look the same
function normalizeOCR(str){
    const replacements = { 'D': 'O', 'B': 'O', '0': 'O', '1': 'I', 'l': 'I' };
    return str.toUpperCase().split('').map(char => replacements[char] || char).join('');
}

async function getLastsAntiCheatMessages(client){
    const channel_AntiCheat = await client.channels.fetch(channelID_AntiCheat);
    const fetchedMessages = await channel_AntiCheat.messages.fetch({ limit: 100 });

    const antiCheatTimeThreshold = 30 + antiCheatRate;

    // Check if messages are less than 35 minutes ago by default
    const thresholdMinutesAgo = new Date(Date.now() - antiCheatTimeThreshold * 60 * 1000);
    const recentMessages = Array.from(fetchedMessages.values()).filter(msg => msg.createdTimestamp > thresholdMinutesAgo.getTime());

    // Find the messages that start with the same numeric sequence
    const messagesByPrefix = {};

    for (let msg of recentMessages) {
        // Extract the initial numeric sequence
        const match = msg.content.match(/^\d+/);
        if (match) {
            const prefix = match[0];

            // Group messages by their prefix
            if (!messagesByPrefix[prefix]) {
                messagesByPrefix[prefix] = [];
            }
            messagesByPrefix[prefix].push(msg);
        }
    }

    // Find the prefix with the highest total length of string
    let maxLengthPrefix = '';
    let maxLength = 0;
    for (let prefix in messagesByPrefix) {
        const totalLength = messagesByPrefix[prefix].reduce((sum, msg) => sum + msg.content.length, 0);
        if (totalLength > maxLength) {
            maxLength = totalLength;
            maxLengthPrefix = prefix;
        }
    }

    return {
        prefix: maxLengthPrefix,
        messages: messagesByPrefix[maxLengthPrefix]?.slice(0, Math.floor(30/antiCheatRate)) || [""]
    };
}

function updateAverage(currentAverage, count, newValue) {
    const newAverage = (currentAverage * (count - 1) + newValue) / count;
    return newAverage;
}

export {
    formatMinutesToDays,
    formatNumbertoK,
    sumIntArray, 
    sumFloatArray, 
    roundToOneDecimal,
    roundToTwoDecimals,
    countDigits, 
    extractNumbers,
    extractTwoStarAmount,
    isNumbers,
    convertMnToMs,
    convertMsToMn,
    splitMulti, 
    replaceLastOccurrence,
    replaceMissCount,
    replaceMissNeeded,
    sendReceivedMessage, 
    sendChannelMessage,
    bulkDeleteMessages, 
    colorText, 
    addTextBar,
    formatNumberWithSpaces,
    localize,
    getRandomStringFromArray,
    getOldestMessage,
    wait,
    replaceAnyLogoWith,
    normalizeOCR,
    getLastsAntiCheatMessages,
    updateAverage,
}