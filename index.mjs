//                    GNU GENERAL PUBLIC LICENSE
//                       Version 3, 29 June 2007
//
//Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
//Everyone is permitted to copy and distribute verbatim copies
//of this license document, but changing it is not allowed.
//
// Bot written by @thobi made to work with Arturo PTCG Bot for the PTCGP Rerollers community
// See here: https://github.com/Arturo-1212/PTCGPB
// Shoutout to @cjlj for Automated ids.txt modifications on the ahk side
//
// Documentation:
// https://github.com/TheThobi/PTCGPRerollManager
//

// Imports

import {
    token,
    guildID,
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
    channelID_SolgaleoVerificationForum,
    channelID_LunalaVerificationForum,
    channelID_BuzzwoleVerificationForum,
    gitToken,
    gitGistID,
    gitGistGroupName,
    gitGistGPName,
    missBeforeDead,
    missNotLikedMultiplier,
    showPerPersonLive,
    EnglishLanguage,
    AntiCheat,
    AutoKick,
    refreshInterval,
    inactiveTime,
    inactiveInstanceCount,
    inactivePackPerMinCount,
    inactiveIfMainOffline,
    heartbeatRate,
    delayMsgDeleteState,
    backupUserDatasTime,
    min2Stars,
    groupPacksType,
    canPeopleAddOthers,
    canPeopleRemoveOthers,
    canPeopleLeech,
    leechPermGPCount,
    leechPermPackCount,
    resetServerDataFrequently,
    resetServerDataTime,
    safeEligibleIDsFiltering,
    forceSkipMin2Stars,
    forceSkipMinPacks,
    text_verifiedLogo,
    text_likedLogo,
    text_waitingLogo,
    text_notLikedLogo,
    text_deadLogo,
    channelID_GPTrackingList,
    gpTrackingUpdateInterval,
    gpTrackingUseCronSchedule,
    createThreadsForGodPacks,
    createThreadsForTradeableCards,
    createThreadsForDoubleStars,
    logPackFindsToChannel,
    packFindsLogChannelID,
    channelID_Notifications,
    notificationsEnabled,
} from './config.js';
import {
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
} from './Dependencies/utils.js';

import {
    getGuild, 
    getMemberByID,
    getUsersStats, 
    sendStats, 
    sendIDs,
    sendStatusHeader,
    inactivityCheck,
    extractGPInfo,
    extractDoubleStarInfo,
    createForumPost,
    markAsDead, 
    updateEligibleIDs,
    updateInactiveGPs,
    setUserState,
    updateServerData,
    updateAntiCheat,
    updateUserDataGPLive,
    addUserDataGPLive,
    getPackSpecificChannel,
    updateGPTrackingList,
    createTimelineStats,
    checkAllPackChannelsAccess,
    verifyAllChannels,
} from './Dependencies/coreUtils.js';

import {
    checkFileExists,
    checkFileExistsOrCreate,
    writeFile,
    doesUserProfileExists, 
    setUserAttribValue, 
    getUserAttribValue, 
    setAllUsersAttribValue,
    setUserSubsystemAttribValue,
    getUserSubsystemAttribValue,
    getActiveUsers,
    getActiveIDs,
    getAllUsers,
    getUsernameFromUsers, 
    getUsernameFromUser, 
    getIDFromUsers, 
    getIDFromUser,
    getTimeFromGP,
    getAttribValueFromUsers, 
    getAttribValueFromUser, 
    getAttribValueFromUserSubsystems,
    refreshUserActiveState,
    refreshUserRealInstances,
    cleanString,
    addServerGP,
    getServerDataGPs,
    backupFile,
} from './Dependencies/xmlManager.js';
import {
    attrib_PocketID,
    attrib_Prefix,
    attrib_UserState,
    attrib_ActiveState,
    attrib_AverageInstances, 
    attrib_HBInstances, 
    attrib_RealInstances, 
    attrib_SessionTime, 
    attrib_TotalPacksOpened, 
    attrib_TotalPacksFarm,
    attrib_TotalAverageInstances,
    attrib_TotalAveragePPM,
    attrib_TotalHBTick,
    attrib_SessionPacksOpened,
    attrib_DiffPacksSinceLastHB,
    attrib_DiffTimeSinceLastHB,
    attrib_PacksPerMin,
    attrib_GodPackFound,
    attrib_GodPackLive,
    attrib_LastActiveTime, 
    attrib_LastHeartbeatTime,
    attrib_TotalTime,
    attrib_TotalTimeFarm,
    attrib_TotalMiss,
    attrib_AntiCheatUserCount,
    attrib_Subsystems,
    attrib_Subsystem,
    attrib_eligibleGPs,
    attrib_eligibleGP,
    attrib_liveGPs,
    attrib_liveGP,
    attrib_ineligibleGPs,
    attrib_ineligibleGP,
    attrib_SelectedPack,
    attrib_RollingType,
    attrib_DisplayName,
    pathUsersData,
    pathServerData,
} from './Dependencies/xmlConfig.js';

import {
    text_lowTension,
    text_mediumTension,
    text_highTension,
} from './Dependencies/missSentences.js';

import {
    Client,
    Events,
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    ButtonBuilder, 
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    PermissionsBitField,
} from 'discord.js';

import {
    scheduleJob
} from 'node-schedule';

// Import the GP test utilities
import {
    addNoShow,
    resetTest,
    getTestSummary,
    extractGodpackIdFromMessage,
} from './Dependencies/gpTestUtils.js';
// Enhanced function to extract pack type from webhook message
function extractPackTypeFromWebhook(webhookContent) {
    console.log(`🔍 Analyzing webhook content: ${webhookContent.substring(0, 100)}...`);
    
    // Method 1: Extract from the parentheses pattern like "(9 packs, Lunala)"
    const packTypeMatch = webhookContent.match(/\((\d+) packs?, ([^)]+)\)/);
    if (packTypeMatch) {
        const packType = packTypeMatch[2].trim();
        console.log(`📦 Pack type extracted from parentheses: "${packType}"`);
        return packType;
    }
    
    // Method 2: Look for "Pack Type: X" pattern
    const packTypeDirectMatch = webhookContent.match(/Pack Type:\s*([^\n]+)/i);
    if (packTypeDirectMatch) {
        const packType = packTypeDirectMatch[1].trim();
        console.log(`📦 Pack type extracted from direct match: "${packType}"`);
        return packType;
    }
    
    // Method 3: Look for known pack names anywhere in the content
    const packNames = [
        'Mewtwo', 'Charizard', 'Pikachu', 'Mew', 
        'Dialga', 'Palkia', 'Arceus', 'Shining',
        'Solgaleo', 'Lunala', 'Buzzwole'
    ];
    
    const lowerContent = webhookContent.toLowerCase();
    for (const packName of packNames) {
        if (lowerContent.includes(packName.toLowerCase())) {
            console.log(`📦 Pack type found in content: "${packName}"`);
            return packName;
        }
    }
    
    console.log("❓ Could not determine pack type, defaulting to Mewtwo");
    return "Mewtwo"; // Default fallback
}

// Helper function to unfollow all existing threads (run once to clean up)
async function unfollowAllBotThreads(client, channelID) {
    try {
        const guild = await getGuild(client);
        const channel = guild.channels.cache.get(channelID);
        
        if (!channel || channel.type !== 15) {
            console.log(`❌ Channel ${channelID} is not a forum channel`);
            return;
        }

        console.log(`🔍 Checking for threads to unfollow in ${channel.name}...`);
        
        // Get active threads
        const activeThreads = await channel.threads.fetchActive();
        
        let unfollowCount = 0;
        for (const [threadId, thread] of activeThreads.threads) {
            try {
                // Check if bot is following this thread
                const members = await thread.members.fetch();
                const botMember = members.get(client.user.id);
                
                if (botMember) {
                    await thread.leave();
                    unfollowCount++;
                    console.log(`✅ Unfollowed: ${thread.name}`);
                    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit protection
                }
            } catch (error) {
                console.log(`⚠️ Could not unfollow ${thread.name}: ${error.message}`);
            }
        }
        
        console.log(`✅ Unfollowed ${unfollowCount} threads in ${channel.name}`);
        
    } catch (error) {
        console.error("❌ Error unfollowing threads:", error);
    }
}

// Function to log pack finds to channel when thread creation is disabled
async function logPackFindToChannel(client, message, packType, cardType, accountName, packAmount, ownerID, accountID) {
    if (!logPackFindsToChannel) return;
    
    try {
        const guild = await getGuild(client);
        const logChannel = guild.channels.cache.get(packFindsLogChannelID);
        
        if (!logChannel) {
            console.log(`❌ Pack finds log channel ${packFindsLogChannelID} not found`);
            return;
        }
        
        // Create a simple log message
        let logMessage = `🎉 **${cardType}** found by <@${ownerID}>!\n`;
        logMessage += `📦 **Pack Type:** ${packType}\n`;
        logMessage += `👤 **Account:** ${accountName}\n`;
        logMessage += `📊 **Packs Opened:** ${packAmount}\n`;
        
        if (accountID && accountID !== "0000000000000000" && accountID !== "NOTRADEID") {
            logMessage += `🆔 **Account ID:** ${accountID}\n`;
        }
        
        logMessage += `🔗 **Source:** ${message.url}`;
        
        // Add image if available
        let imageUrl = "";
        if (message.attachments && message.attachments.size > 0) {
            imageUrl = message.attachments.first().url;
        } else if (message.embeds && message.embeds.length > 0 && message.embeds[0].image) {
            imageUrl = message.embeds[0].image.url;
        }
        
        const logData = {
            content: logMessage
        };
        
        if (imageUrl) {
            logData.embeds = [{
                image: { url: imageUrl },
                color: 0xf02f7e
            }];
        }
        
        await logChannel.send(logData);
        console.log(`📝 Logged ${cardType} find to channel`);
        
    } catch (error) {
        console.error("❌ Error logging pack find to channel:", error);
    }
}

// Main webhook processing function for tradeable cards
async function processTradeableCardsWebhook(client, message) {
    try {
        console.log("🔍 Processing tradeable cards webhook...");
        
        // Extract pack type from webhook content
        const packType = extractPackTypeFromWebhook(message.content);
        console.log(`📦 Detected pack type: ${packType}`);
        
        // For tradeable cards, extract different info
        const regexOwnerID = /<@(\d+)>/;
        const regexFoundBy = /([A-Za-z\s]+) found by (\S+)/i;
        const regexPackInfo = /\((\d+) packs?, ([^)]+)\)/;
        
        const ownerIDMatch = message.content.match(regexOwnerID);
        const foundByMatch = message.content.match(regexFoundBy);
        const packInfoMatch = message.content.match(regexPackInfo);
        
        const ownerID = ownerIDMatch ? ownerIDMatch[1] : "0000000000000000";
        let cardType = "Unknown";
        let accountName = "NoAccountName";
        
        if (foundByMatch && foundByMatch.length >= 3) {
            cardType = foundByMatch[1].trim();
            accountName = foundByMatch[2];
        }
        
        let packAmount = "1";
        if (packInfoMatch && packInfoMatch.length >= 3) {
            packAmount = packInfoMatch[1];
        }
        
        // Validate required information
        if (!ownerID || ownerID === "0000000000000000") {
            console.log("❌ Missing or invalid owner ID, skipping...");
            return;
        }
        
        if (!accountName || accountName === "NoAccountName") {
            console.log("❌ Missing account name, skipping...");
            return;
        }
        
        // Check if this is a God Pack
        const isGodPack = message.content.toLowerCase().includes("god pack found");
        
        // Determine if we should create a thread based on configuration
        const shouldCreateThread = isGodPack ? createThreadsForGodPacks : createThreadsForTradeableCards;
        
        if (shouldCreateThread) {
            // Get the appropriate forum channel for this pack type
            const targetChannelID = await getPackSpecificChannel(packType);
            console.log(`🎯 Target channel ID: ${targetChannelID}`);
            
            // Create the title for the forum post
            const titleName = `${accountName} [${packAmount}P]`;
            console.log(`📝 Forum post title: ${titleName}`);
            
            // Create forum post - pass "NOTRADEID" as placeholder for account ID
            await createForumPost(
                client,
                message,              // The original webhook message
                targetChannelID,      // Pack-specific forum channel
                cardType,            // Card type (e.g., "Full Art", "Rainbow")
                titleName,           // The formatted title
                ownerID,             // Discord user ID who found it
                "NOTRADEID",         // Placeholder for account ID since tradeable cards don't have friend codes
                packAmount,          // Number of packs
                packType            // Pack type for additional processing
            );
            
            console.log(`✅ Successfully created thread for ${packType} ${cardType} for ${accountName}`);
        } else {
            console.log(`📝 Thread creation disabled for ${isGodPack ? 'God Packs' : 'tradeable cards'}, logging instead`);
            
            // Log to channel if enabled
            await logPackFindToChannel(client, message, packType, cardType, accountName, packAmount, ownerID, "NOTRADEID");
        }
        
    } catch (error) {
        console.error("❌ Error processing tradeable cards webhook:", error);
    }
}
// Global Var

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	]
});

var startIntervalTime = Date.now();    
var evenTurnShortInterval = false;
function getNexIntervalRemainingTime() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startIntervalTime;
    const timeRemaining = (refreshInterval) - convertMsToMn(elapsedTime);
    return timeRemaining;
}

// Setup scheduled jobs function
function setupScheduledJobs(client) {
    // Schedule the GP tracking list update based on configuration
    if (gpTrackingUseCronSchedule) {
        // Use cron-style scheduling (more precise but more complex)
        // This will run every X minutes (*/X = every X minutes)
        scheduleJob(`*/${gpTrackingUpdateInterval} * * * *`, function() {
            updateGPTrackingList(client);
        });
        console.log(`🕒 Scheduled GP tracking list update every ${gpTrackingUpdateInterval} minutes using cron schedule`);
    } else {
        // Use simple interval (less precise but simpler)
        setInterval(function() {
            updateGPTrackingList(client);
        }, gpTrackingUpdateInterval * 60 * 1000); // Convert minutes to milliseconds
        console.log(`🕒 Scheduled GP tracking list update every ${gpTrackingUpdateInterval} minutes using interval`);
    }
}
// Events

client.once(Events.ClientReady, async c => {
    console.log(`✅ Logged in as ${c.user.tag}`);

    const guild = await getGuild(client);

    // Verify all channels first
    await verifyAllChannels(client);

    // Then do the detailed channel access check
    const channelCheck = await checkAllPackChannelsAccess(client);
    if (!channelCheck.success) {
        console.log(`⚠️ Found ${channelCheck.issuesFound.length} channel issues that need attention`);
    }

    // Auto-cleanup threads on startup (optional)
    console.log("🧹 Performing auto-cleanup of followed threads...");
    try {
        const packChannels = [
            channelID_MewtwoVerificationForum,
            channelID_CharizardVerificationForum,
            channelID_PikachuVerificationForum,
            channelID_MewVerificationForum,
            channelID_DialgaVerificationForum,
            channelID_PalkiaVerificationForum,
            channelID_ArceusVerificationForum,
            channelID_ShiningVerificationForum,
            channelID_SolgaleoVerificationForum,
            channelID_LunalaVerificationForum,
            channelID_BuzzwoleVerificationForum
        ];
        
        for (const channelID of packChannels) {
            if (channelID) {
                await unfollowAllBotThreads(client, channelID);
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between channels
            }
        }
        console.log("✅ Auto-cleanup complete");
    } catch (error) {
        console.log("⚠️ Auto-cleanup failed:", error.message);
    }

    // Every "refreshInterval/2" mn it will alternate from sendUserStat to inactivityCheck
    setInterval(() =>{
        startIntervalTime = Date.now();
        evenTurnShortInterval = !evenTurnShortInterval;

        if (evenTurnShortInterval) {
            sendStats(client);
        } 
        else if(AutoKick) {
            inactivityCheck(client);
        }

    }, convertMnToMs(refreshInterval/2));

    // TIMELINE STATS COMMAND
    const timelineStatsDesc = localize("Affiche les statistiques d'activité sur une période", "Display activity statistics over a time period");
    const timelineStatsDescDays = localize("Nombre de jours à considérer (défaut: 7)", "Number of days to consider  (default: 7)");
    const timelineStatsSCB = new SlashCommandBuilder()
    .setName(`timelinestats`)
    .setDescription(`${timelineStatsDesc}`)
    .addIntegerOption(option =>
        option
            .setName("days")
            .setDescription(`${timelineStatsDescDays}`)
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(30)
    );

    // Send back the messages with buttons so ppl can switch states easily
    await sendStatusHeader(client);
    setInterval(async() =>{
        await sendStatusHeader(client);
    }, convertMnToMs(60));

    // Reset and Update ServerData every X hours (might disable the loop if you have over 10k gp or it'll take a while)
    await updateServerData(client, true);
    setInterval(async() =>{
        await updateServerData(client);
    }, convertMnToMs(resetServerDataTime+1));

    // Backup UserData.xml file
    setInterval(async() =>{
        await backupFile(pathUsersData);
    }, convertMnToMs(backupUserDatasTime+1));

    if(AntiCheat){
        setInterval(async() =>{
            await updateAntiCheat(client);
        }, convertMnToMs(5));
    
        await updateAntiCheat(client);
    }

    // Backup UserData.xml file
    setInterval(async() =>{
        await updateInactiveGPs(client);
    }, convertMnToMs(60));
    
    await updateInactiveGPs(client);

    // Initial update of GP tracking list
    await updateGPTrackingList(client);
    
    // Setup scheduled jobs
    setupScheduledJobs(client);

    // Clear all guild commands (Warning: also clears channel restrictions set on discord)
    // guild.commands.set([]);

    // Clear a specific guild command
    // const commandId = 'XXXXXXXXXXXXXXXXXXX';
    // await guild.commands.delete(commandId);
// Commands Creation

    const playeridDesc = localize("Lie votre code ami à votre pseudo discord unique", "Link your ID Code with your Discord unique username");
    const playeridDescId = localize("Votre ID SANS TIRET", "Your ID without any dashes");
    const playeridSCB = new SlashCommandBuilder()
        .setName(`setplayerid`)
        .setDescription(`${playeridDesc}\n`) 
        .addStringOption(option =>
            option
                .setName("id")
                .setDescription(`${playeridDescId}`)
                .setRequired(true)
        );

    const instancesDesc = localize("Renseignez votre nombre d'instance moyen", "Set your average number of instances");
    const instancesDescAmount = localize("Nombres ronds (ex: pas 5.5 parce que vous etes a 6 et de fois 5)", "Round numbers (e.g., not 5.5 if you usually run 5 or 6)");
    const instancesSCB = new SlashCommandBuilder()
        .setName(`setaverageinstances`)
        .setDescription(`${instancesDesc}\n`)
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription(`${instancesDescAmount}`)
                .setRequired(true)
        );

    const prefixDesc = localize("Renseignez votre préfixe de votre liste de nom d'utilisateur", "Set your prefix from your username list");
    const prefixDescPrefix = localize("Doit être composé de 4 lettres", "Must be exactly 4 letters");
    const prefixSCB = new SlashCommandBuilder()
        .setName(`setprefix`)
        .setDescription(`${prefixDesc}\n`)
        .addStringOption(option =>
            option
                .setName("prefix")
                .setDescription(`${prefixDescPrefix}`)
                .setRequired(true)
        );

    const activeDesc = localize("Vous ajoute dans le doc d'ID", "Add yourself to the active rerollers list");
    const activeDescUser = localize("ADMIN ONLY : pour forcer l'ajout de quelqu'un d'autre", "ADMIN ONLY: Only useful to force-add someone other than yourself");
    const activeSCB = new SlashCommandBuilder()
        .setName(`active`)
        .setDescription(`${activeDesc}`)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription(`${activeDescUser}`)
                .setRequired(false)
        );
        
    const inactiveDesc = localize("Vous retire du doc d'ID"," Remove yourself from the active rerollers list");
    const inactiveDescUser = localize("ADMIN ONLY : pour forcer le retrait de quelqu'un d'autre", "ADMIN ONLY: Only useful to force-remove someone other than yourself");
    const inactiveSCB = new SlashCommandBuilder()
        .setName(`inactive`)
        .setDescription(`${inactiveDesc}`)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription(`${inactiveDescUser}`)
                .setRequired(false)
        );
        
    const farmDesc = localize("Vous ajoute dans le doc d'ID comme farmer (noMain)", "Add yourself to the active rerollers list as farmer (noMain)");
    const farmDescUser = localize("ADMIN ONLY : pour forcer l'ajout' de quelqu'un d'autre", "ADMIN ONLY: Only useful to force-add someone other than yourself");
    const farmSCB = new SlashCommandBuilder()
        .setName(`farm`)
        .setDescription(`${farmDesc}`)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription(`${farmDescUser}`)
                .setRequired(false)
        );

    const unfollowThreadsDesc = localize("Arrête de suivre tous les threads du bot dans les forums de pack", "Unfollow all bot threads in pack forums");
    const unfollowThreadsDescPack = localize("Type de pack à nettoyer (ou 'all' pour tous)", "Pack type to clean (or 'all' for all packs)");
    const unfollowThreadsSCB = new SlashCommandBuilder()
        .setName(`unfollowthreads`)
        .setDescription(`${unfollowThreadsDesc}`)
        .addStringOption(option =>
            option.setName('pack')
                .setDescription(`${unfollowThreadsDescPack}`)
                .setRequired(false)
                .addChoices(
                    { name: 'All Packs', value: 'all' },
                    { name: 'Mewtwo', value: 'mewtwo' },
                    { name: 'Charizard', value: 'charizard' },
                    { name: 'Pikachu', value: 'pikachu' },
                    { name: 'Mew', value: 'mew' },
                    { name: 'Dialga', value: 'dialga' },
                    { name: 'Palkia', value: 'palkia' },
                    { name: 'Arceus', value: 'arceus' },
                    { name: 'Shining', value: 'shining' },
                    { name: 'Solgaleo', value: 'solgaleo' },
                    { name: 'Lunala', value: 'lunala' },
                    { name: 'Buzzwole', value: 'buzzwole' }
                ));

    const leechDesc = localize("Vous ajoute dans le doc d'ID comme leecher (onlyMain)", "Add yourself to the active rerollers list as leecher (onlyMain)");
    const leechDescUser = localize("ADMIN ONLY : pour forcer l'ajout' de quelqu'un d'autre", "ADMIN ONLY: Only useful to force-add someone other than yourself");
    const leechSCB = new SlashCommandBuilder()
        .setName(`leech`)
        .setDescription(`${leechDesc}`)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription(`${leechDescUser}`)
                .setRequired(false)
        );

    const refreshDesc = localize("Rafraichit la liste des Stats instantanément","Refresh the user stats instantly");
    const refreshSCB = new SlashCommandBuilder()
        .setName(`refresh`)
        .setDescription(`${refreshDesc}`);

    const forcerefreshDesc = localize("Rafraichit la liste des ids et les envois au server","Refresh the ids.txt and send it to the servers");
    const forcerefreshSCB = new SlashCommandBuilder()
        .setName(`forcerefresh`)
        .setDescription(`${forcerefreshDesc}`);

    const verifiedDesc = localize("Designe pack valide","Flag the post as valid");
    const verifiedSCB = new SlashCommandBuilder()
        .setName(`verified`)
        .setDescription(`${verifiedDesc}`);

    const deadDesc = localize("Designe pack invalide / dud","Flag the post as invalid / dud");
    const deadSCB = new SlashCommandBuilder()
        .setName(`dead`)
        .setDescription(`${deadDesc}`);
        
    const likedDesc = localize("Designe pack comme liké","Flag the post as liked");
    const likedSCB = new SlashCommandBuilder()
        .setName(`liked`)
        .setDescription(`${likedDesc}`);

    const notLikedDesc = localize("Designe pack comme non liké","Flag the post as not liked");
    const notLikedSCB = new SlashCommandBuilder()
        .setName(`notliked`)
        .setDescription(`${notLikedDesc}`);

    const missDesc = localize("Pour la verification GP, après X fois suivant le nombre de pack cela auto /dead", "For verification purposes, after X times based on pack amount it sends /dead");
    const missSCB = new SlashCommandBuilder()
        .setName(`miss`)
        .setDescription(`${missDesc}`);

    const misscountDesc = localize("Montre le rapport de miss par temps passé à roll", "Show how many misses rerollers made while active");
    const misscountSCB = new SlashCommandBuilder()
        .setName(`misscount`)
        .setDescription(`${misscountDesc}`);

    const lastactivityDesc = localize("Montre à combien de temps remonte le dernier Heartbeat", "Show how much time has passed since the last Heartbeat");
    const lastactivitySCB = new SlashCommandBuilder()
        .setName(`lastactivity`)
        .setDescription(`${lastactivityDesc}`);

    const generateusernamesDesc = localize("Génère liste basé sur préfixe et, facultatif, des mots","Generate a list based on a prefix and, if desired, keywords");   
    const generateusernamesDescPrefix = localize("Les 4 premières lettres premières lettres de votre pseudo","The first 4 letters of your username");   
    const generateusernamesDescKeyword = localize("Des mots clés qui seront assemblés aléatoirement, espace/virgule = séparation","Some keywords that will be assembled randomly, space or comma are separators");   
    const generateusernamesSCB = new SlashCommandBuilder()
        .setName(`generateusernames`)
        .setDescription(`${generateusernamesDesc}`)
        .addStringOption(option =>
            option
                .setName("prefix")
                .setDescription(`${generateusernamesDescPrefix}`)
                .setRequired(true)
        ).addStringOption(option2 =>
            option2
                .setName("keywords")
                .setDescription(`${generateusernamesDescKeyword}`)
                .setRequired(false)
        );

    const addGPFoundDesc = localize("ADMIN ONLY : Ajoute un GP trouvé à un utilisateur pour les stats","ADMIN ONLY: Add a GP Found to a user for the stats");
    const addGPFoundDescUser = localize("seulement utile pour corriger des erreurs","Only useful for fixing bugs");
    const addGPFoundSCB = new SlashCommandBuilder()
        .setName(`addgpfound`)
        .setDescription(`${addGPFoundDesc}`)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription(`${addGPFoundDescUser}`)
                .setRequired(false)
        );

    const removeGPFoundDesc = localize("ADMIN ONLY : Retire un GP trouvé à un utilisateur pour les stats","ADMIN ONLY: Remove a GP Found from a user for the stats");
    const removeGPFoundDescUser = localize("seulement utile pour corriger des erreurs","Only useful for fixing bugs");
    const removeGPFoundSCB = new SlashCommandBuilder()
    .setName(`removegpfound`)
    .setDescription(`${removeGPFoundDesc}`)
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription(`${removeGPFoundDescUser}`)
            .setRequired(false)
    );

    // Add the new refresh GP tracking list command
    const refreshGPTrackingDesc = localize("Rafraîchit la liste des GP actifs","Refresh the active GP list");
    const refreshGPTrackingSCB = new SlashCommandBuilder()
        .setName(`refreshgplist`)
        .setDescription(`${refreshGPTrackingDesc}`);
        
    // NoShow command definition
    const noshowDesc = localize("Signale un test sans montrer le godpack", "Report a test without showing the godpack");
    const noshowDescSlots = localize("Nombre d'emplacements ouverts", "Number of open slots");
    const noshowDescFriends = localize("Nombre total d'amis ou comptes", "Total number of friends or accounts");
    const noshowSCB = new SlashCommandBuilder()
        .setName(`noshow`)
        .setDescription(`${noshowDesc}`)
        .addIntegerOption(option =>
            option
                .setName("slots")
                .setDescription(`${noshowDescSlots}`)
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("friends")
                .setDescription(`${noshowDescFriends}`)
                .setRequired(true)
        );

    // Reset test command definition
    const resetTestDesc = localize("Réinitialise les tests pour un godpack spécifique", "Reset tests for a specific godpack");
    const resetTestSCB = new SlashCommandBuilder()
        .setName(`resettest`)
        .setDescription(`${resetTestDesc}`);

    // Test summary command definition
    const testSummaryDesc = localize("Affiche un résumé des tests pour ce godpack", "Display a summary of tests for this godpack");
    const testSummarySCB = new SlashCommandBuilder()
        .setName(`testsummary`)
        .setDescription(`${testSummaryDesc}`);
// Register all commands
    const playeridCommand = playeridSCB.toJSON();
    client.application.commands.create(playeridCommand, guildID);

    const instancesCommand = instancesSCB.toJSON();
    client.application.commands.create(instancesCommand, guildID);

    const prefixCommand = prefixSCB.toJSON();
    client.application.commands.create(prefixCommand, guildID);

    const activeCommand = activeSCB.toJSON();
    client.application.commands.create(activeCommand, guildID);

    const inactiveCommand = inactiveSCB.toJSON();
    client.application.commands.create(inactiveCommand, guildID);

    const farmCommand = farmSCB.toJSON();
    client.application.commands.create(farmCommand, guildID);

    const leechCommand = leechSCB.toJSON();
    client.application.commands.create(leechCommand, guildID);

    const refreshCommand = refreshSCB.toJSON();
    client.application.commands.create(refreshCommand, guildID);

    const forcerefreshCommand = forcerefreshSCB.toJSON();
    client.application.commands.create(forcerefreshCommand, guildID);
    
    const verifiedCommand = verifiedSCB.toJSON();
    client.application.commands.create(verifiedCommand, guildID);
    
    const deadCommand = deadSCB.toJSON();
    client.application.commands.create(deadCommand, guildID);
    
    const likedCommand = likedSCB.toJSON();
    client.application.commands.create(likedCommand, guildID);
    
    const notLikedCommand = notLikedSCB.toJSON();
    client.application.commands.create(notLikedCommand, guildID);

    const missCommand = missSCB.toJSON();
    client.application.commands.create(missCommand, guildID);    
    
    const misscountCommand = misscountSCB.toJSON();
    client.application.commands.create(misscountCommand, guildID);

    const lastactivityCommand = lastactivitySCB.toJSON();
    client.application.commands.create(lastactivityCommand, guildID);
    
    const generateusernamesCommand = generateusernamesSCB.toJSON();
    client.application.commands.create(generateusernamesCommand, guildID);

    const addGPFoundCommand = addGPFoundSCB.toJSON();
    client.application.commands.create(addGPFoundCommand, guildID);

    const removeGPFoundCommand = removeGPFoundSCB.toJSON();
    client.application.commands.create(removeGPFoundCommand, guildID);

    // Create the new GP tracking list refresh command
    const refreshGPTrackingCommand = refreshGPTrackingSCB.toJSON();
    client.application.commands.create(refreshGPTrackingCommand, guildID);
    
    // Register the timeline stats command
    const timelineStatsCommand = timelineStatsSCB.toJSON();
    client.application.commands.create(timelineStatsCommand, guildID);
    
    // Register the NoShow command
    const noshowCommand = noshowSCB.toJSON();
    client.application.commands.create(noshowCommand, guildID);

    // Register the Reset Test command
    const resetTestCommand = resetTestSCB.toJSON();
    client.application.commands.create(resetTestCommand, guildID);

    // Register the Test Summary command
    const testSummaryCommand = testSummarySCB.toJSON();
    client.application.commands.create(testSummaryCommand, guildID);

    // Register the Unfollow Threads command
    const unfollowThreadsCommand = unfollowThreadsSCB.toJSON();
    client.application.commands.create(unfollowThreadsCommand, guildID);
});
client.on(Events.InteractionCreate, async interaction => {

    var interactionUserName = interaction.user.username;
    var interactionUserID = interaction.user.id;
    var interactionDisplayName = interaction.user.displayName;

    const guild = await getGuild(client);

    // ======================= Buttons =======================
    
    try{

        if (interaction.customId === 'active') {
            await interaction.deferReply();
            setUserState(client, interaction.user, "active", interaction)
        } 
        else if (interaction.customId === 'farm') {
            await interaction.deferReply();
            setUserState(client, interaction.user, "farm", interaction)
        }
        else if (interaction.customId === 'leech') {
            await interaction.deferReply();
            setUserState(client, interaction.user, "leech", interaction)
        }
        else if (interaction.customId === 'inactive') {
            await interaction.deferReply();
            setUserState(client, interaction.user, "inactive", interaction)
        }
        else if (interaction.customId === 'refreshUserStats') {
            await interaction.deferReply();
            const text_listForceRefreshed = localize(`**Stats des rerollers actifs rafraichies dans <#${channelID_UserStats}>**`, `**Active rerollers stats refreshed in <#${channelID_UserStats}>**`);

            await sendReceivedMessage(client, text_listForceRefreshed, interaction, delayMsgDeleteState);
            sendStats(client)
        }

        if(!interaction.isChatInputCommand()) return;

// SET PLAYER ID COMMAND
        if(interaction.commandName === `setplayerid`){

            await interaction.deferReply();
            const id = interaction.options.getString(`id`);

            const text_incorrectID = localize("ID Incorrect pour","Incorrect ID for");
            const text_incorrectReason = localize("Votre code doit être composé de **16 chifres**","Your code should be **16 numbers in length**");
            const text_replace = localize("a été remplacé par","has been replaced by");
            const text_for = localize("pour","for");
            const text_set = localize("set pour","set for user");

            if(id.length != 16 || !isNumbers(id)){
                await sendReceivedMessage(client, text_incorrectID + ` **<@${interactionUserID}>**, ` + text_incorrectReason, interaction);
            }
            else{
                const userPocketID = await getUserAttribValue( client, interactionUserID, attrib_PocketID);
                    
                if( userPocketID != undefined ){

                    await setUserAttribValue( interactionUserID, interactionUserName, attrib_PocketID, cleanString(id));
                    await sendReceivedMessage(client, `Code **${userPocketID}** ` + text_replace + ` **${id}** ` + text_for + ` **<@${interactionUserID}>**`, interaction);
                }
                else{
                    await setUserAttribValue( interactionUserID, interactionUserName, attrib_PocketID, cleanString(id));
                    await sendReceivedMessage(client, `Code **${id}** ` + text_set + ` **<@${interactionUserID}>**`, interaction);
                }
            }
        }

        // TIMELINE STATS COMMAND
        if(interaction.commandName === `timelinestats`){
            await interaction.deferReply();
            try {
                const days = interaction.options.getInteger(`days`) || 7;
                
                const timelineEmbed = await createTimelineStats(client, days);
                await interaction.editReply({ embeds: [timelineEmbed] });
            } catch (error) {
                console.error('Error handling timeline stats command:', error);
                await interaction.editReply({ content: "Failed to generate timeline statistics." });
            }
        }

        // ACTIVE COMMAND
        if(interaction.commandName === `active`){

            await interaction.deferReply();
            const text_missingPerm = localize("n\'a pas les permissions nécessaires pour changer l\'état de","does not have permission to edit other user");
            
            var user = interaction.user;
            const userArg = interaction.options.getUser(`user`);
            
            if( userArg != null ){
                if(!canPeopleAddOthers) {
                    
                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interactionUserID != user.id) {
                        return await sendReceivedMessage(client, `<@${interactionUserID}> ${text_missingPerm} <@${user.id}>`, interaction);
                    }
                }
                var user = userArg;
            }

            setUserState(client, user, "active", interaction)
        }

        // INACTIVE COMMAND
        if(interaction.commandName === `inactive`){

            await interaction.deferReply();
            const text_missingPerm = localize("n\'a pas les permissions nécessaires pour changer l\'état de","does not have permission to edit the other user");
            
            var user = interaction.user;
            const userArg = interaction.options.getUser(`user`);

            if( userArg != null){
                if(!canPeopleRemoveOthers) {

                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interactionUserID != user.id) {
                        return await sendReceivedMessage(client, `<@${interactionUserID}> ${text_missingPerm} <@${user.id}>`, interaction);
                    }
                }
                var user = userArg;
            }

            setUserState(client, user, "inactive", interaction)
        }

        // FARM COMMAND
        if(interaction.commandName === `farm`){

            await interaction.deferReply();
            const text_missingPerm = localize("n\'a pas les permissions nécessaires pour changer l\'état de","does not have permission to edit the other user");
            
            var user = interaction.user;
            const userArg = interaction.options.getUser(`user`);

            if( userArg != null){
                if(!canPeopleRemoveOthers) {

                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interactionUserID != user.id) {
                        return await sendReceivedMessage(client, `<@${interactionUserID}> ${text_missingPerm} <@${user.id}>`, interaction);
                    }
                }
                var user = userArg;
            }

            setUserState(client, user, "farm", interaction)
        }

        // LEECH COMMAND
        if(interaction.commandName === `leech`){

            await interaction.deferReply();
            const text_missingPerm = localize("n\'a pas les permissions nécessaires pour changer l\'état de","does not have permission to edit the other user");
            
            var user = interaction.user;
            const userArg = interaction.options.getUser(`user`);

            if( userArg != null){
                if(!canPeopleRemoveOthers) {

                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interactionUserID != user.id) {
                        return await sendReceivedMessage(client, `<@${interactionUserID}> ${text_missingPerm} <@${user.id}>`, interaction);
                    }
                }
                var user = userArg;
            }

            setUserState(client, user, "leech", interaction)
        }
// REFRESH COMMAND
        if(interaction.commandName === `refresh`){
            
            await interaction.deferReply();
            const text_listForceRefreshed = localize(`**Stats des rerollers actifs rafraichies dans <#${channelID_UserStats}>**`, `**Active rerollers stats refreshed in <#${channelID_UserStats}>**`);

            await sendReceivedMessage(client, text_listForceRefreshed, interaction, delayMsgDeleteState);
            sendStats(client)
        }

        // FORCE REFRESH COMMAND
        if(interaction.commandName === `forcerefresh`){
            
            await interaction.deferReply();
            const refreshTime = roundToOneDecimal(getNexIntervalRemainingTime());
            const text_IDsRefreshedIn = localize("**IDs rafraichis**, rafraichissment des **Stats dans","**IDs refreshed**, refreshing **Stats in");
            const text_see = localize("voir","see");

            const text_listRefreshed = `${text_IDsRefreshedIn} ${refreshTime}mn**, ${text_see} <#${channelID_UserStats}>`;

            await sendReceivedMessage(client, text_listRefreshed, interaction, delayMsgDeleteState);
            sendIDs(client);
        }

        // VERIFIED COMMAND
        if(interaction.commandName === `verified`){
            
            await interaction.deferReply();
            const text_markAsVerified = localize("Godpack marqué comme live","Godpack marked as verified");
            const text_alreadyVerified = localize("C'est gentil de ta part mais il est déjà vérifié le GodPack","That's kind of you, but this GP is already verified");

            const thread = client.channels.cache.get(interaction.channelId);

            if(thread.name.includes(text_verifiedLogo)){
                await sendReceivedMessage(client, `${text_alreadyVerified}`, interaction);
            }
            else{
                const newPostName = replaceAnyLogoWith(thread.name, text_verifiedLogo);
    
                // Edit a thread
                await thread.edit({ name: `${newPostName}` });
                
                await addServerGP(attrib_liveGP, thread);

                await addUserDataGPLive(client, thread);
    
                await sendReceivedMessage(client, `${text_verifiedLogo} ${text_markAsVerified}`, interaction);
                
                // Update GP tracking list after a GP is verified
                await updateGPTrackingList(client);
            }
        }

        // DEAD COMMAND
        if(interaction.commandName === `dead`){

            await interaction.deferReply();
            await markAsDead(client, interaction);
            
            // Update GP tracking list after a GP is marked as dead
            await updateGPTrackingList(client);
        }

        // LIKED COMMAND
        if(interaction.commandName === `liked`){
                    
            await interaction.deferReply();
            const text_markAsLiked = localize(`Godpack marqué comme **liké** ${text_likedLogo} beaucoup de chance d'être live`,`Godpack marked as **liked** ${text_likedLogo} likely to be live`);
            const text_alreadyLiked = localize("C'est gentil de ta part mais il est déjà marqué comme liké","That's kind of you, but this GP is already marked as liked");

            const thread = client.channels.cache.get(interaction.channelId);

            if(thread.name.includes(text_likedLogo)){
                await sendReceivedMessage(client, `${text_alreadyLiked}`, interaction);
            }
            else{
                const newPostName = replaceAnyLogoWith(thread.name, text_likedLogo);
                await thread.edit({ name: `${newPostName}` });

                await sendReceivedMessage(client, `${text_markAsLiked}`, interaction);
                
                // Update GP tracking list after a GP is marked as liked
                await updateGPTrackingList(client);
            }
        }

// NOT LIKED COMMAND
        if(interaction.commandName === `notliked`){
            
            await interaction.deferReply();
            const text_markAsNotLiked = localize(`Godpack marqué comme **non liké** ${text_notLikedLogo} Peu de chance d'être live\n**Nombre de miss total requis**`,`Godpack marked as **not liked** ${text_notLikedLogo} Unlikely to be live\n**Total number of misses required**`);
            const text_alreadyNotLiked = localize("C'est gentil de ta part mais il est déjà marqué comme non liké","That's kind of you, but this GP is already marked as not liked");
            const text_notCompatible = localize("This GP uses the **old format**, so /notliked is not compatible","This GP uses the **old format**, so /notliked is not compatible");

            const thread = client.channels.cache.get(interaction.channelId);

            if(thread.name.includes(text_notLikedLogo)){
                await sendReceivedMessage(client, `${text_alreadyNotLiked}`, interaction);
            }
            else{
                // Edit the initial message to divide multiplier miss required by missNotLikedMultiplier[numbersTwoStars]
                const initialMessage = await getOldestMessage(thread);
                const splitForumContent = splitMulti(initialMessage.content,['[',']']);

                if (splitForumContent.length > 1){

                    const numbersMiss = extractNumbers(splitForumContent[1]);
                    const numbersTwoStars = extractTwoStarAmount(thread.name);
            
                    var missAmount = parseInt(numbersMiss[0]);
                    var missNeeded = numbersMiss[1];
                    var newMissNeeded = Math.round(parseInt(missNeeded)*missNotLikedMultiplier[numbersTwoStars]);

                    const text_finalNotLiked = text_markAsNotLiked + ` **x${missNotLikedMultiplier[numbersTwoStars]}\n[ ${missAmount} miss / ${newMissNeeded} ]**`
                    
                    // Check if, once modified, the missAmount is greater or equal to the new newMissNeeded
                    if (missAmount>=newMissNeeded){
                        
                        const text_failed = localize(`Po\n`,`Well, rip,`) + ` **[ ${missAmount} miss / ${missNeeded} ]**\n`;
                        await markAsDead(client, interaction, text_finalNotLiked + localize(`\n\nCependant comportant deja suffisement de Miss pour être considéré comme\n`,`\n\nHowever, already containing enough misses to be considered as\n`));
                    }
                    else{ // Else, the missAmount is lower than the new newMissNeeded

                        const newPostName = replaceAnyLogoWith(thread.name, text_notLikedLogo);
                        await thread.edit({ name: `${newPostName}` });
                        await initialMessage.edit(`${replaceMissNeeded(initialMessage.content, newMissNeeded)}`);
                        await sendReceivedMessage(client, `${text_finalNotLiked}`, interaction);
                        
                        // Update GP tracking list after a GP is marked as not liked
                        await updateGPTrackingList(client);
                    }
                }
                else{
                    await sendReceivedMessage(client, text_notCompatible, interaction);
                }
            }
        }

        // MISS COMMAND
        if(interaction.commandName === `miss`){

            await interaction.deferReply();
            const text_notCompatible = localize("This GP uses the **old format**, so /miss is not compatible","This GP uses the **old format**, so /miss is not compatible");
            const text_scam = localize("Oh le petit malin il a essayé de scam un miss 🤡\nVenez voir tout le monde","Little sneaky boy tried to scam a miss 🤡\nEveryone, take a look at this");

            const thread = client.channels.cache.get(interaction.channelId);

            // Only add a miss for posts marked as notLiked, Waiting or Liked
            if (thread.name.includes(text_notLikedLogo) || thread.name.includes(text_waitingLogo) || thread.name.includes(text_likedLogo)){

                const initialMessage = await getOldestMessage(thread);
                const splitForumContent = splitMulti(initialMessage.content,['[',']']);

                if (splitForumContent.length > 1){

                    const numbersMiss = extractNumbers(splitForumContent[1]);
            
                    var missAmount = numbersMiss[0];
                    var newMissAmount = parseInt(missAmount)+1;
                    var missNeeded = numbersMiss[1];

                    var totalMiss = await getUserAttribValue( client, interactionUserID, attrib_TotalMiss, 0 );
                    await setUserAttribValue( interactionUserID, interactionUserName, attrib_TotalMiss, parseInt(totalMiss)+1);

                    if(newMissAmount >= missNeeded){
                        
                        await initialMessage.edit( `${replaceMissCount(initialMessage.content, newMissAmount)}`);

                        const text_failed = localize(`C'est finito\n`,`It's over\n`) + ` **[ ${newMissAmount} miss / ${missNeeded} ]**\n`;
                        await markAsDead(client, interaction, text_failed);
                        
                        // Update GP tracking list after a GP is marked as dead via misses
                        await updateGPTrackingList(client);
                    }
                    else{
                        await initialMessage.edit( `${replaceMissCount(initialMessage.content, newMissAmount)}`);
                        
                        // If miss is <= 50% the amount sentences are """encouraging""" then it gets worse and even more after 75% 
                        const text_fitTension = newMissAmount <= missNeeded*0.5 ? text_lowTension(client) : newMissAmount <= missNeeded*0.75 ? text_mediumTension(client) : text_highTension(client);
                        await sendReceivedMessage(client, `${text_fitTension}\n**[ ${newMissAmount} miss / ${missNeeded} ]**`, interaction);            
                    }
                }
                else{
                    await sendReceivedMessage(client, text_notCompatible, interaction);
                }
            }
            else{
                await sendReceivedMessage(client, text_scam, interaction);
            }
        }

// MISS COUNT COMMAND
        if(interaction.commandName === `misscount`){

            await interaction.deferReply();

            var activityOutput = "\`\`\`\n";

            const allUsers = await getAllUsers();

            for( var i = 0; i < allUsers.length; i++ ) {
                
                var user = allUsers[i];
                var userID = getIDFromUser(user);
                
                const member = await getMemberByID(client, userID);

                // Skip if member does not exist
                if (member == "") {
                    console.log(`❗️ User ${userID} is not registered on this server`)
                    continue;
                }

                var userDisplayName = member.displayName;
                const totalMiss = getAttribValueFromUser(user, attrib_TotalMiss, 0);
                const totalTime = getAttribValueFromUser(user, attrib_TotalTime, 0);
                const totalTimeHour = parseFloat(totalTime)/60;
                var missPer24Hour = roundToOneDecimal( (parseFloat(totalMiss) / totalTimeHour) * 24 );

                missPer24Hour = isNaN(missPer24Hour) || missPer24Hour == Infinity ? 0 : missPer24Hour;

                activityOutput += addTextBar(`${userDisplayName} `, 20, false) + ` ${missPer24Hour} miss / 24h - ${totalMiss} miss over ${roundToOneDecimal(totalTimeHour)}h\n`
            };

            activityOutput+="\`\`\`";

            await sendReceivedMessage(client, activityOutput, interaction);
        }

        // LAST ACTIVITY COMMAND
        if(interaction.commandName === `lastactivity`){

            await interaction.deferReply();

            var activityOutput = "\`\`\`\n";

            const allUsers = await getAllUsers();

            for( var i = 0; i < allUsers.length; i++ ) {
                
                var userID = getIDFromUser(allUsers[i]);
                const member = await getMemberByID(client, userID);

                // Skip if member does not exist
                if (member == "") {
                    console.log(`❗️ Heartbeat from ID ${userID} is not registered on this server`)
                    continue;
                }

                var userDisplayName = member.displayName;

                const lastHBTime = new Date(getAttribValueFromUser(allUsers[i], attrib_LastHeartbeatTime));
                var diffTime = (Date.now() - lastHBTime) / 60000 / 60;
                diffTime = roundToOneDecimal(diffTime);

                activityOutput += addTextBar(`${userDisplayName} `, 20, false) + ` ${diffTime} h since last hb\n`
            };

            activityOutput+="\`\`\`";

            await sendReceivedMessage(client, activityOutput, interaction);
        }

// GENERATE USERNAMES COMMAND
        if(interaction.commandName === `generateusernames`){

            await interaction.deferReply();
            const text_incorrectPrefix = localize("Le préfixe doit être composé de 4 Lettres","The prefix must be 4 letters");
            const text_incorrectParameters = localize("Paramètres incorrects, entre prefix ET keywords","Incorrect parameters — please enter both a prefix and keywords");
            const text_listGenerated = localize("Nouvelle liste d'usernames generé :","New usernames.txt list generated:");

            const prefix = interaction.options.getString(`prefix`).toUpperCase();
            var keyWords = interaction.options.getString(`keywords`);

            if(prefix.length != 4)
            {
                return await sendReceivedMessage(client, text_incorrectPrefix, interaction);
            }

            if(prefix == null || keyWords == null)
            {
                return await sendReceivedMessage(client, text_incorrectParameters, interaction);
            }
            
            keyWords = keyWords.replaceAll(`,`, ` `).split(' ');
            const wordsGenerated = 1000;
            const maxNameLength = 14;
            const prefixLength = prefix.length + 1; // Include the underscore in the length calculation

            const forbiddenWords = ["ass","sht","nazi","anus","nig","rape","pede","dic","bitte","hymen","pimp","shto","ugly","bch","nun","tara","wth","bastard","baka","cono","std","cox","chope"];

            var content = "";

            for (let i = 0; i < wordsGenerated; i++) {
                
                var generatedWord = "";

                for (let attempts = 0; attempts < 50; attempts++) {

                    // Break if maxNameLength-1 is hit
                    if (prefixLength + generatedWord.length >= maxNameLength-1) {break;}

                    const randomIndex = Math.floor(Math.random() * keyWords.length);
                    var keyWord = keyWords[randomIndex];
                    // Remove all special characters
                    keyWord = keyWord.replaceAll(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

                    if (prefixLength + (generatedWord + keyWord).length > maxNameLength) {
                        continue;
                    } 
                    else {
                        generatedWord = generatedWord + keyWord;
                    }
                }

                const fullName = prefix + "O" + generatedWord; // O = separator as it seems adbShell.StdIn.WriteLine can't input special characters 
                if (!forbiddenWords.some(word => fullName.includes(word))) {
                    content = content + fullName + " \n";
                }
            }

            await sendReceivedMessage(client, text_listGenerated, interaction);
            await interaction.channel.send({
                files: [{
                    attachment: Buffer.from(content),
                    name: 'usernames.txt'
                }]
            })
        }

// SET AVERAGE INSTANCES COMMAND
        if(interaction.commandName === `setaverageinstances`){

            await interaction.deferReply();
            const amount = interaction.options.getInteger(`amount`);

            const text_instancesSetTo = localize("Nombre d'instance moyenne défini à","Average number of instances set to");
            const text_incorrectAmount = localize("Petit clown va, entre ton vrai nombre d'instances","Nice try — please enter your real instance count");
            const text_for = localize("pour","for");

            if(amount < 1 || amount > 100){
                await sendReceivedMessage(client, text_incorrectAmount, interaction);
            }
            else{
                await setUserAttribValue( interactionUserID, interactionUserName, attrib_AverageInstances, amount);
                await sendReceivedMessage(client, text_instancesSetTo + ` **${amount}** ` + text_for + ` **<@${interactionUserID}>**`, interaction);
            }
        }

        // ADD GP FOUND COMMAND
        if(interaction.commandName === `addgpfound`){

            await interaction.deferReply();        
            const text_addGP = localize("Ajout d\'un GP pour","Add a GP for");
            const text_missingPerm = localize("n\'a pas les permissions d\'Admin","does not have Admin permissions");
            
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await sendReceivedMessage(client, `<@${interactionUserID}> ${text_missingPerm}`, interaction);
            }

            const user = interaction.options.getUser(`user`);
            if( user != null){
                interactionUserName = user.username;
                interactionUserID = user.id;
            }

            var GPCount = parseInt(await getUserAttribValue( client, interactionUserID, attrib_GodPackFound));
            await setUserAttribValue( interactionUserID, interactionUserName, attrib_GodPackFound, GPCount+1);
            await sendReceivedMessage(client, `${text_addGP} **<@${interactionUserID}>**`, interaction);
        }

        // REMOVE GP FOUND COMMAND
        if(interaction.commandName === `removegpfound`){

            await interaction.deferReply();
            const text_removeGP = localize("Retrait d\'un GP pour","Remove a GP for");
            const text_minimumGP = localize("Nombre de GP déjà au minimum pour","GP count is already at the minimum for");
            const text_missingPerm = localize("n\'a pas les permissions d\'Admin","does not have Admin permissions");

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await sendReceivedMessage(client, `<@${interactionUserID}> ${text_missingPerm}`, interaction);
            }

            const user = interaction.options.getUser(`user`);
            if( user != null){
                interactionUserName = user.username;
                interactionUserID = user.id;
            }

            var GPCount = parseInt(await getUserAttribValue( client, interactionUserID, attrib_GodPackFound));
            if (GPCount > 0){
                await setUserAttribValue( interactionUserID, interactionUserName, attrib_GodPackFound, GPCount-1);
                await sendReceivedMessage(client, `${text_removeGP} **<@${interactionUserID}>**`, interaction);
            }
            else{
                await sendReceivedMessage(client, `${text_minimumGP} **<@${interactionUserID}>**`, interaction);
            }
        }
// SET PREFIX COMMAND
        if(interaction.commandName === `setprefix`){

            await interaction.deferReply();
            const prefix = interaction.options.getString(`prefix`).toUpperCase();

            const text_instancesSetTo = localize("Préfixe défini à","Prefix set to");
            const text_incorrectLength = localize("Le Préfixe doit être composé d'exactement 4 lettres","The prefix must be exactly 4 letters");
            const text_otherPrefixe = localize("L'autre préfixe existant","The other existing prefix");
            const text_tooSimilar = localize("s'apparente trop à","is too similar to");
            const text_for = localize("pour","for");

            if(prefix.length != 4){
                await sendReceivedMessage(client, text_incorrectLength, interaction);
            }
            else{
                const allUsers = await getAllUsers();
                const othersPrefix = getAttribValueFromUsers(allUsers, attrib_Prefix, [0]);

                for(let i = 0; i < othersPrefix.length; i++){

                    const otherPrefix = othersPrefix[i];

                    if(otherPrefix == undefined || otherPrefix == 0 ){continue;}

                    if(normalizeOCR(otherPrefix).toUpperCase() == normalizeOCR(prefix)){
                        await sendReceivedMessage(client, `${text_otherPrefixe} **\"${otherPrefix}\"** ${text_tooSimilar} **\"${prefix}\"**`, interaction);
                        return;
                    }
                }

                await setUserAttribValue( interactionUserID, interactionUserName, attrib_Prefix, prefix);
                await sendReceivedMessage(client, text_instancesSetTo + ` \"**${prefix}**\" ` + text_for + ` **<@${interactionUserID}>**`, interaction);
            }
        }

        // REFRESH GP LIST COMMAND
        if(interaction.commandName === `refreshgplist`){
            await interaction.deferReply();
            const text_listRefreshed = localize(`**Liste des GP rafraîchie dans <#${channelID_GPTrackingList}>**`, `**GP list refreshed in <#${channelID_GPTrackingList}>**`);

            await sendReceivedMessage(client, text_listRefreshed, interaction, delayMsgDeleteState);
            await updateGPTrackingList(client);
        }

        // UNFOLLOW THREADS COMMAND
        if(interaction.commandName === `unfollowthreads`){
            await interaction.deferReply({ ephemeral: true });
            
            const packType = interaction.options.getString('pack') || 'all';
            
            try {
                let channelsToClean = [];
                
                if (packType === 'all') {
                    // Clean all pack forums
                    channelsToClean = [
                        { name: 'Mewtwo', id: channelID_MewtwoVerificationForum },
                        { name: 'Charizard', id: channelID_CharizardVerificationForum },
                        { name: 'Pikachu', id: channelID_PikachuVerificationForum },
                        { name: 'Mew', id: channelID_MewVerificationForum },
                        { name: 'Dialga', id: channelID_DialgaVerificationForum },
                        { name: 'Palkia', id: channelID_PalkiaVerificationForum },
                        { name: 'Arceus', id: channelID_ArceusVerificationForum },
                        { name: 'Shining', id: channelID_ShiningVerificationForum },
                        { name: 'Solgaleo', id: channelID_SolgaleoVerificationForum },
                        { name: 'Lunala', id: channelID_LunalaVerificationForum },
                        { name: 'Buzzwole', id: channelID_BuzzwoleVerificationForum }
                    ];
                } else {
                    // Clean specific pack forum
                    const channelMap = {
                        'mewtwo': { name: 'Mewtwo', id: channelID_MewtwoVerificationForum },
                        'charizard': { name: 'Charizard', id: channelID_CharizardVerificationForum },
                        'pikachu': { name: 'Pikachu', id: channelID_PikachuVerificationForum },
                        'mew': { name: 'Mew', id: channelID_MewVerificationForum },
                        'dialga': { name: 'Dialga', id: channelID_DialgaVerificationForum },
                        'palkia': { name: 'Palkia', id: channelID_PalkiaVerificationForum },
                        'arceus': { name: 'Arceus', id: channelID_ArceusVerificationForum },
                        'shining': { name: 'Shining', id: channelID_ShiningVerificationForum },
                        'solgaleo': { name: 'Solgaleo', id: channelID_SolgaleoVerificationForum },
                        'lunala': { name: 'Lunala', id: channelID_LunalaVerificationForum },
                        'buzzwole': { name: 'Buzzwole', id: channelID_BuzzwoleVerificationForum }
                    };
                    
                    if (channelMap[packType]) {
                        channelsToClean = [channelMap[packType]];
                    }
                }
                
                for (const channel of channelsToClean) {
                    if (channel.id) {
                        await unfollowAllBotThreads(client, channel.id);
                    }
                }
                
                const text_unfollowComplete = localize(
                    `Nettoyage terminé pour ${packType === 'all' ? 'tous les packs' : packType}`,
                    `Cleanup complete for ${packType === 'all' ? 'all packs' : packType}`
                );
                
                await interaction.editReply({ content: text_unfollowComplete });
                
            } catch (error) {
                console.error('Error in unfollowthreads command:', error);
                await interaction.editReply({ 
                    content: localize("Une erreur s'est produite", "An error occurred") 
                });
            }
        }

// NOSHOW COMMAND
        if(interaction.commandName === `noshow`){
            await interaction.deferReply();
            
            const slots = interaction.options.getInteger(`slots`);
            const friends = interaction.options.getInteger(`friends`);
            
            const text_invalidRange = localize("Les valeurs doivent être positives", "Values must be positive");
            const text_noshowAdded = localize("NoShow enregistré", "NoShow recorded");
            
            // Validate input
            if(slots < 0 || friends < 0) {
                return await sendReceivedMessage(client, text_invalidRange, interaction);
            }
            
            const thread = client.channels.cache.get(interaction.channelId);
            
            try {
                // Get the first message to extract godpack info
                const initialMessage = await getOldestMessage(thread);
                const godpackId = extractGodpackIdFromMessage(initialMessage);
                
                if(!godpackId) {
                    return await sendReceivedMessage(client, 
                        localize("ID de Godpack non trouvé dans ce thread", "Godpack ID not found in this thread"), 
                        interaction);
                }
                
                // Add the noshow test record
                const probability = await addNoShow(guildID, godpackId, interaction.user.id, slots, friends);
                
                await sendReceivedMessage(client, 
                    `${text_noshowAdded} - ${localize("Probabilité restante", "Remaining probability")}: ${probability.toFixed(2)}%`, 
                    interaction);
                
                // Update GP tracking list if applicable
                await updateGPTrackingList(client);
            } catch (error) {
                console.error('Error in noshow command:', error);
                await sendReceivedMessage(client, 
                    localize("Une erreur s'est produite", "An error occurred"), 
                    interaction);
            }
        }

        // RESET TEST COMMAND
        if(interaction.commandName === `resettest`){
            await interaction.deferReply();
            
            const thread = client.channels.cache.get(interaction.channelId);
            
            try {
                // Get the first message to extract godpack info
                const initialMessage = await getOldestMessage(thread);
                const godpackId = extractGodpackIdFromMessage(initialMessage);
                
                if(!godpackId) {
                    return await sendReceivedMessage(client, 
                        localize("ID de Godpack non trouvé dans ce thread", "Godpack ID not found in this thread"), 
                        interaction);
                }
                
                // Reset the test records for this user and godpack
                const probability = await resetTest(guildID, godpackId, interaction.user.id);
                
                await sendReceivedMessage(client, 
                    localize(`Tests réinitialisés - Probabilité restante: ${probability.toFixed(2)}%`, 
                            `Tests reset - Remaining probability: ${probability.toFixed(2)}%`), 
                    interaction);
                
                // Update GP tracking list if applicable
                await updateGPTrackingList(client);
            } catch (error) {
                console.error('Error in resettest command:', error);
                await sendReceivedMessage(client, 
                    localize("Une erreur s'est produite", "An error occurred"), 
                    interaction);
            }
        }

        // TEST SUMMARY COMMAND
        if(interaction.commandName === `testsummary`){
            await interaction.deferReply();
            
            const thread = client.channels.cache.get(interaction.channelId);
            
            try {
                // Get the first message to extract godpack info
                const initialMessage = await getOldestMessage(thread);
                const godpackId = extractGodpackIdFromMessage(initialMessage);
                
                if(!godpackId) {
                    return await sendReceivedMessage(client, 
                        localize("ID de Godpack non trouvé dans ce thread", "Godpack ID not found in this thread"), 
                        interaction);
                }
                
                // Get a summary of all tests for this godpack
                const summary = await getTestSummary(guildID, godpackId);
                
                await sendReceivedMessage(client, summary, interaction);
            } catch (error) {
                console.error('Error in testsummary command:', error);
                await sendReceivedMessage(client, 
                    localize("Une erreur s'est produite", "An error occurred"), 
                    interaction);
            }
        }

    }
    catch(error){
        console.error('❌ ERROR - Crash Prevented\n', error);
    }
});
client.on("messageCreate", async (message) => {
    const guild = await getGuild(client);

    // Do never continue if the author is the bot, that should not filter webhooks
    if (message.author.id === client.user.id) return;

    if (message.channel.id === channelID_Webhook) {
        console.log(`Processing webhook message: ${message.content}`);

        // Check if message has attachment and is not invalid
        if (message.attachments.first() != undefined && !message.content.toLowerCase().includes("invalid")) {
            
            // Check if this is a God Pack message
            if (message.content.toLowerCase().includes("god pack found")) {
                console.log("🎯 === PROCESSING GOD PACK ===");
                
                if (createThreadsForGodPacks) {
                    console.log("✅ Thread creation enabled for God Packs");
                    
                    // Extract GP info using your existing function
                    const gpInfo = extractGPInfo(message.content);
                    
                    console.log(`📦 Extracted pack type: ${gpInfo.packBoosterType}`);
                    
                    // Get the appropriate forum channel for this pack type
                    const targetChannelID = await getPackSpecificChannel(gpInfo.packBoosterType);
                    console.log(`🎯 Target channel ID: ${targetChannelID}`);
                    
                    // Create the title for the forum post
                    const titleName = `${gpInfo.accountName} [${gpInfo.packAmount}P][${gpInfo.twoStarRatio}]`;
                    console.log(`📝 Forum post title: ${titleName}`);
                    
                    // Create forum post
                    await createForumPost(
                        client,
                        message,              // The original webhook message
                        targetChannelID,      // Pack-specific forum channel
                        "God Pack",          // Card type
                        titleName,           // The formatted title
                        gpInfo.ownerID,      // Discord user ID who found it
                        gpInfo.accountID,    // Friend code
                        gpInfo.packAmount,   // Number of packs
                        gpInfo.packBoosterType // Pack type for additional processing
                    );
                    
                    console.log(`✅ Successfully created thread for ${gpInfo.packBoosterType} God Pack for ${gpInfo.accountName}`);
                } else {
                    // Extract basic info for logging
                    const gpInfo = extractGPInfo(message.content);
                    console.log(`📝 Thread creation disabled for God Packs, logging instead`);
                    await logPackFindToChannel(client, message, gpInfo.packBoosterType, "God Pack", gpInfo.accountName, gpInfo.packAmount, gpInfo.ownerID, gpInfo.accountID);
                }
            }
            // Handle any other card types that contain "found by" - ENHANCED VERSION
            else if (message.content.toLowerCase().includes("found by")) {
                console.log("🎴 === PROCESSING TRADEABLE CARD ===");
                
                if (createThreadsForTradeableCards) {
                    console.log("✅ Thread creation enabled for tradeable cards");
                    
                    // Extract pack type with enhanced function
                    const packBoosterType = extractPackTypeFromWebhook(message.content);
                    console.log(`📦 Extracted pack type: "${packBoosterType}"`);
                    
                    // Get target channel
                    const targetChannel = await getPackSpecificChannel(packBoosterType);
                    console.log(`🎯 Target channel: ${targetChannel}`);
                    
                    // Extract information for tradeable cards
                    const regexOwnerID = /<@(\d+)>/;
                    const regexFoundBy = /([A-Za-z\s]+) found by (\S+)/i;
                    const regexPackInfo = /\((\d+) packs?, ([^)]+)\)/;
                    const regexAccountID = /\((\d+)\)/g; // Global flag to find all matches
                    
                    const ownerIDMatch = message.content.match(regexOwnerID);
                    const foundByMatch = message.content.match(regexFoundBy);
                    const packInfoMatch = message.content.match(regexPackInfo);
                    const accountIDMatches = [...message.content.matchAll(regexAccountID)]; // Get all parentheses matches
                    
                    console.log("🔍 Regex extraction results:");
                    console.log(`   Owner ID: ${ownerIDMatch ? ownerIDMatch[1] : 'NOT FOUND'}`);
                    console.log(`   Found By: ${foundByMatch ? foundByMatch[0] : 'NOT FOUND'}`);
                    console.log(`   Pack Info: ${packInfoMatch ? packInfoMatch[0] : 'NOT FOUND'}`);
                    console.log(`   All parentheses matches: ${accountIDMatches.map(match => match[0]).join(', ')}`);
                    
                    const ownerID = ownerIDMatch ? ownerIDMatch[1] : "0000000000000000";
                    let cardType = "Tradeable Card"; // Set default for tradeable cards
                    let accountName = "NoAccountName";
                    
                    if (foundByMatch && foundByMatch.length >= 3) {
                        cardType = foundByMatch[1].trim();
                        accountName = foundByMatch[2];
                    }
                    
                    // Smart logic to determine if there's a valid friend ID
                    let accountID = "NOTRADEID"; // Default for tradeable cards
                    
                    // Filter out pack count matches to find potential friend IDs
                    const potentialFriendIDs = accountIDMatches
                        .map(match => match[1])
                        .filter(id => {
                            // Friend IDs are typically 16 digits, pack counts are usually 1-3 digits
                            return id.length >= 10; // Assume friend IDs are at least 10 digits
                        });
                    
                    if (potentialFriendIDs.length > 0) {
                        accountID = potentialFriendIDs[0]; // Take the first valid friend ID
                        console.log(`🆔 Found friend ID: ${accountID}`);
                    } else {
                        console.log("🚫 No friend ID found - this appears to be a tradeable card without friend code");
                    }
                    
                    // Extract pack amount
                    let packAmount = "1";
                    if (packInfoMatch && packInfoMatch.length >= 3) {
                        packAmount = packInfoMatch[1];
                    }
                    
                    console.log(`📊 Final extraction results:`);
                    console.log(`   Card Type: ${cardType}`);
                    console.log(`   Account Name: ${accountName}`);
                    console.log(`   Owner ID: ${ownerID}`);
                    console.log(`   Account ID: ${accountID}`);
                    console.log(`   Pack Amount: ${packAmount}`);
                    console.log(`   Pack Type: ${packBoosterType}`);
                    
                    // Validate required information
                    if (!ownerID || ownerID === "0000000000000000") {
                        console.log("❌ Missing or invalid owner ID, skipping...");
                        return;
                    }
                    
                    if (!accountName || accountName === "NoAccountName") {
                        console.log("❌ Missing account name, skipping...");
                        return;
                    }
                    
                    // Format the title
                    const titleName = `${accountName} [${packAmount}P]`;
                    console.log(`📝 Forum post title: ${titleName}`);
                    
                    // Create the forum post
                    console.log(`🏗️ Creating forum post in channel ${targetChannel}`);
                    await createForumPost(client, message, targetChannel, cardType, titleName, ownerID, accountID, packAmount, packBoosterType);
                    
                    console.log(`✅ Successfully created thread for ${packBoosterType} ${cardType} for ${accountName}`);
                    
                    // Update GP tracking list after a new special card is found
                    await updateGPTrackingList(client);
                } else {
                    console.log(`📝 Thread creation disabled for tradeable cards, logging instead`);
                    
                    // Extract basic info for logging when threads are disabled
                    const packBoosterType = extractPackTypeFromWebhook(message.content);
                    const regexOwnerID = /<@(\d+)>/;
                    const regexFoundBy = /([A-Za-z\s]+) found by (\S+)/i;
                    const regexPackInfo = /\((\d+) packs?, ([^)]+)\)/;
                    
                    const ownerIDMatch = message.content.match(regexOwnerID);
                    const foundByMatch = message.content.match(regexFoundBy);
                    const packInfoMatch = message.content.match(regexPackInfo);
                    
                    const ownerID = ownerIDMatch ? ownerIDMatch[1] : "0000000000000000";
                    let cardType = "Tradeable Card";
                    let accountName = "NoAccountName";
                    
                    if (foundByMatch && foundByMatch.length >= 3) {
                        cardType = foundByMatch[1].trim();
                        accountName = foundByMatch[2];
                    }
                    
                    let packAmount = "1";
                    if (packInfoMatch && packInfoMatch.length >= 3) {
                        packAmount = packInfoMatch[1];
                    }
await logPackFindToChannel(client, message, packBoosterType, cardType, accountName, packAmount, ownerID, "NOTRADEID");
                }
            }
// Handle the old format of Double messages
            else if (message.content.toLowerCase().includes("double")) {
                if(channelID_2StarVerificationForum == ""){return;}

                if (createThreadsForDoubleStars) {
                    var GPInfo = extractDoubleStarInfo(message.content);

                    var ownerID = GPInfo.ownerID;
                    var accountName = GPInfo.accountName;
                    var accountID = GPInfo.accountID;
                    var packAmount = GPInfo.packAmount;

                    var titleName = `${accountName} [${packAmount}P]`;

                    await createForumPost(client, message, channelID_2StarVerificationForum, "Double 2Star", titleName, ownerID, accountID, packAmount);
                    
                    // Update GP tracking list after a new double star is found
                    await updateGPTrackingList(client);
                } else {
                    // Extract basic info for logging
                    var GPInfo = extractDoubleStarInfo(message.content);
                    
                    console.log(`📝 Thread creation disabled for Double Stars, logging instead`);
                    await logPackFindToChannel(client, message, "Double 2Star", "Double 2Star", GPInfo.accountName, GPInfo.packAmount, GPInfo.ownerID, GPInfo.accountID);
                }
            }
            else {
                console.log(`❓ Unrecognized message format: ${message.content.substring(0, 100)}`);
            }
        }
        else if (message.author.bot && message.content.toLowerCase().includes("invalid")) {
            await addServerGP(attrib_ineligibleGP, message);
        }
    }

if (message.channel.id === channelID_Heartbeat)
    {
        const text_WrongHB = localize("Quelqu'un a mal configuré ses paramètres Heartbeat","Heartbeat settings are incorrectly configured.");
        const text_CorrectInput = localize(
            "Veuillez vérifier que vous avez bien entré votre **DiscordID** sur le script AHK dans l'onglet Discord Heartbeat Name, ca devrait ressembler ca : \`\`\`0123456789012345\`\`\` Pour votre PC principal et \`\`\`0123456789012345_YOURPCNAME\`\`\` Pour les autre ordinateurs si vous souhaitez en utiliser plusieurs",
            "Please make sure you've entered your **DiscordID** correctly in the AHK script under the Discord Heartbeat Name. It should look like this for your main PC: \`\`\`0123456789012345\`\`\` And like this for other computers (if using multiple): \`\`\`0123456789012345_YOURPCNAME\`\`\`"
        );

        var heartbeatDatas = message.content.split("\n");
        const firstLine = heartbeatDatas[0];
        const firstLineSplit = firstLine.split("_");
        const userID = firstLineSplit[0];

        // At this time it seems that discordID are 17 to 19 characters in length but it costs nothing to keep a little margin
        if(userID.length < 17 || userID.length > 20 || !isNumbers(userID)){
            return await message.reply(`${text_WrongHB} **( ${userID} )**\n${text_CorrectInput}`);
        }

        const member = await getMemberByID(client, userID);

        // Skip if member does not exist
        if (member == "") {
            console.log(`❗️ Heartbeat from ID ${userID} is not registered on this server`)
            return;
        }

        var userUsername = member.user.username;

        if(firstLineSplit.length <= 1 ) { // If ID does not have underscore

            if(await doesUserProfileExists(userID, userUsername)){

                var instances = 0;
                var timeAndPacks = 0;
                var selectedPacks = "";
                var rollingType = "";

                heartbeatDatas.forEach((heartbeatData) =>{
                    if (heartbeatData.includes("Online:")){
                        instances = extractNumbers(heartbeatData).length;
                    }
                    else if (heartbeatData.includes("Packs:")){
                        timeAndPacks = extractNumbers(heartbeatData);
                    }
                    else if (heartbeatData.includes("Select:") || heartbeatData.includes("Opening:")){
                        selectedPacks = heartbeatData.replace("Select: ","").replace("Opening: ","");

                        if (selectedPacks.endsWith(',')) {
                            selectedPacks = selectedPacks.slice(0, -1);
                        }
                    }
                    else if (heartbeatData.includes("Type:")){
                        rollingType = heartbeatData.replace("Type: ","");
                    }
                });
                
                await setUserAttribValue( userID, userUsername, attrib_SelectedPack, selectedPacks);
                await setUserAttribValue( userID, userUsername, attrib_RollingType, rollingType);

                const time = timeAndPacks[0];
                var packs = parseInt(timeAndPacks[1]);

                var sessionPacks = parseInt(await getUserAttribValue( client, userID, attrib_SessionPacksOpened, 0 ));
                var diffPacks = Math.max(packs-sessionPacks,0);

                var userState = await getUserAttribValue( client, userID, attrib_UserState, 0 );

                if( time == "0" ){
                    var totalTime = await getUserAttribValue( client, userID, attrib_TotalTime, 0 );
                    var sessionTime = await getUserAttribValue( client, userID, attrib_SessionTime, 0 );
                    await setUserAttribValue( userID, userUsername, attrib_TotalTime, parseFloat(totalTime) + parseFloat(sessionTime));

                    var totalPacks = await getUserAttribValue( client, userID, attrib_TotalPacksOpened, 0 );
                    await setUserAttribValue( userID, userUsername, attrib_TotalPacksOpened, parseInt(totalPacks) + sessionPacks);
                }
                else{
                    if(userState == "farm"){
                        var totalTimeFarm = await getUserAttribValue( client, userID, attrib_TotalTimeFarm, 0 );
                        var totalPacksFarm = await getUserAttribValue( client, userID, attrib_TotalPacksFarm, 0 );
                        var sessionTime = await getUserAttribValue( client, userID, attrib_SessionTime, 0 );
                        var diffTime = Math.max( parseFloat(time) - parseFloat(sessionTime), 0 );
                        await setUserAttribValue( userID, userUsername, attrib_TotalTimeFarm, parseFloat(totalTimeFarm) + diffTime);
                        await setUserAttribValue( userID, userUsername, attrib_TotalPacksFarm, parseFloat(totalPacksFarm) + diffPacks);
                    }

                    var totalHBTick = parseInt( await getUserAttribValue( client, userID, attrib_TotalHBTick, 0 ) ) + 1;
                    await setUserAttribValue( userID, userUsername, attrib_TotalHBTick, totalHBTick);

                    var packPerMin = parseFloat( await getUserAttribValue( client, userID, attrib_PacksPerMin, 0 ) );
                    var totalAvgPackPerMin = parseFloat( await getUserAttribValue( client, userID, attrib_TotalAveragePPM, 0 ) );
                    await setUserAttribValue( userID, userUsername, attrib_TotalAveragePPM, updateAverage(totalAvgPackPerMin, totalHBTick, packPerMin));

                    var realInstances = parseFloat( await getUserAttribValue( client, userID, attrib_RealInstances, 0 ) );
                    var totalAvgInstances = parseFloat( await getUserAttribValue( client, userID, attrib_TotalAverageInstances, 0 ) );
                    await setUserAttribValue( userID, userUsername, attrib_TotalAverageInstances, updateAverage(totalAvgInstances, totalHBTick, realInstances));
                }

                const lastHBTime = new Date(await getUserAttribValue( client, userID, attrib_LastHeartbeatTime, 0 ));
                var diffHBTime = (Date.now() - lastHBTime) / 60000;
                await setUserAttribValue( userID, userUsername, attrib_DiffTimeSinceLastHB, diffHBTime);

                await setUserAttribValue( userID, userUsername, attrib_DiffPacksSinceLastHB, diffPacks);
                await setUserAttribValue( userID, userUsername, attrib_SessionTime, time);
                await setUserAttribValue( userID, userUsername, attrib_SessionPacksOpened, packs);
                await setUserAttribValue( userID, userUsername, attrib_HBInstances, instances);
                await setUserAttribValue( userID, userUsername, attrib_LastHeartbeatTime, new Date().toString());

                console.log(`💚 HB ${userUsername}`);
                
                const mainInactive = heartbeatDatas[2].toLowerCase().includes("main");
                
                if(AutoKick){

                    if(mainInactive && inactiveIfMainOffline && !userState == "farm"){
                        await setUserAttribValue( userID, userUsername, attrib_UserState, "inactive");
                        sendIDs(client);
                        // And notify them that they have been kicked
                        const text_haveBeenKicked = localize("a été kick des rerollers actifs car son Main est Offline"," has been kicked out of active rerollers due to Main being Offline");
                        sendChannelMessage(client, channelID_Commands, `<@${userID}> ${text_haveBeenKicked}`)
                        console.log(`✖️ Kicked ${userUsername} - Main was Offline`);
                    }
                }
            }
        }
else{ // If ID has underscore

            const subSystemName = firstLineSplit[1];

            if(await doesUserProfileExists(userID, userUsername)){
            
                var instances = 0;
                var timeAndPacks = 0;
                var selectedPacks = "";
                var rollingType = "";

                heartbeatDatas.forEach((heartbeatData) =>{
                    if (heartbeatData.includes("Online:")){
                        instances = extractNumbers(heartbeatData).length;
                    }
                    else if (heartbeatData.includes("Packs:")){
                        timeAndPacks = extractNumbers(heartbeatData);
                    }
                    else if (heartbeatData.includes("Select:")){
                        selectedPacks = heartbeatData.replace("Select: ","");
                    }
                    else if (heartbeatData.includes("Type:")){
                        rollingType = heartbeatData.replace("Type: ","");
                    }
                });
                
                await setUserSubsystemAttribValue( userID, userUsername, subSystemName, attrib_SelectedPack, selectedPacks);
                await setUserSubsystemAttribValue( userID, userUsername, subSystemName, attrib_RollingType, rollingType);

                const time = timeAndPacks[0];
                var packs = parseInt(timeAndPacks[1]);

                var sessionSubsystemPacks = parseInt(await getUserSubsystemAttribValue( client, userID, subSystemName, attrib_SessionPacksOpened, 0 ));
                var diffPacks = Math.max(packs-sessionSubsystemPacks,0);

                var userState = await getUserAttribValue( client, userID, attrib_UserState, 0 );
                
                if( time == "0" ){
                    var totalPacks = await getUserAttribValue( client, userID, attrib_TotalPacksOpened, 0 );
                    await setUserAttribValue( userID, userUsername, attrib_TotalPacksOpened, parseInt(totalPacks) + parseInt(sessionSubsystemPacks));
                }
                else{
                    if(userState == "farm"){
                        var totalPacksFarm = await getUserAttribValue( client, userID, attrib_TotalPacksFarm, 0 );
                        await setUserAttribValue( userID, userUsername, attrib_TotalPacksFarm, parseFloat(totalPacksFarm) + diffPacks);
                    }
                }

                await setUserSubsystemAttribValue( userID, userUsername, subSystemName, attrib_DiffPacksSinceLastHB, diffPacks);
                await setUserSubsystemAttribValue( userID, userUsername, subSystemName, attrib_SessionTime, time);
                await setUserSubsystemAttribValue( userID, userUsername, subSystemName, attrib_SessionPacksOpened, packs);
                await setUserSubsystemAttribValue( userID, userUsername, subSystemName, attrib_HBInstances, instances);
                await setUserSubsystemAttribValue( userID, userUsername, subSystemName, attrib_LastHeartbeatTime, new Date().toString());
                
                console.log(`🩵 HB ${userUsername} subsystem ${subSystemName}`);

                const mainInactive = heartbeatDatas[2].toLowerCase().includes("main");
                
                if(AutoKick){
                    
                    if(mainInactive && inactiveIfMainOffline && !userState == "farm"){
                        await setUserAttribValue( userID, userUsername, attrib_UserState, "inactive");
                        sendIDs(client);
                        // And notify them that they have been kicked
                        const text_haveBeenKicked = localize("a été kick des rerollers actifs car son Main est Offline"," has been kicked out of active rerollers due to Main being Offline");
                        sendChannelMessage(client, channelID_Commands, `<@${userID}> ${text_haveBeenKicked}`)
                        console.log(`✖️ Kicked ${userUsername} - Main was Offline`);
                    }
                }
            }
        }
    }
});

client.login(token);