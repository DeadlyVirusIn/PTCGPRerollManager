import {
    token,
    guildID,
    channelID_Commands,
    channelID_UserStats,
    channelID_2StarVerificationForum,
    channelID_Webhook,
    channelID_Heartbeat,
    channelID_AntiCheat,
    channelID_GPTrackingList,
    channelID_MewtwoVerificationForum,
    channelID_CharizardVerificationForum,
    channelID_PikachuVerificationForum,
    channelID_MewVerificationForum,
    channelID_DialgaVerificationForum,
    channelID_PalkiaVerificationForum,
    channelID_ArceusVerificationForum,
    channelID_ShiningVerificationForum,
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
    AutoCloseLivePostTime,
    AutoCloseNotLivePostTime,
    heartbeatRate,
    antiCheatRate,
    delayMsgDeleteState,
    backupUserDatasTime,
    min2Stars,
    groupPacksType,
    canPeopleAddOthers,
    canPeopleRemoveOthers,
    enableRoleBasedFilters,
    canPeopleLeech,
    leechPermGPCount,
    leechPermPackCount,
    resetServerDataFrequently,
    resetServerDataTime,
    safeEligibleIDsFiltering,
    addDoubleStarToVipIdsTxt,
    forceSkipMin2Stars,
    forceSkipMinPacks,
    text_verifiedLogo,
    text_likedLogo,
    text_waitingLogo,
    text_notLikedLogo,
    text_deadLogo,
    leaderboardBestFarm1_CustomEmojiName,
    leaderboardBestFarm2_CustomEmojiName,
    leaderboardBestFarm3_CustomEmojiName,
    leaderboardBestFarmLength,
    leaderboardBestVerifier1_CustomEmojiName,
    leaderboardBestVerifier2_CustomEmojiName,
    leaderboardBestVerifier3_CustomEmojiName,
    leaderboardWorstVerifier1_CustomEmojiName,
    leaderboardWorstVerifier2_CustomEmojiName,
    leaderboardWorstVerifier3_CustomEmojiName,
    GA_Mewtwo_CustomEmojiName,
    GA_Charizard_CustomEmojiName,
    GA_Pikachu_CustomEmojiName,
    MI_Mew_CustomEmojiName,
    STS_Dialga_CustomEmojiName,
    STS_Palkia_CustomEmojiName,
    TL_Arceus_CustomEmojiName,
    SR_Giratina_CustomEmojiName,
    outputUserDataOnGitGist,
} from '../config.js';
import {
    formatMinutesToDays,
    formatNumbertoK,
    sumIntArray, 
    sumFloatArray, 
    roundToOneDecimal,
    roundToTwoDecimals,
    countDigits, 
    extractNumbers, 
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
} from './utils.js';

import {
    lockUsersData,
    lockServerData,
    readFileAsync,
    checkFileExists,
    checkFileExistsOrCreate,
    writeFile,
    doesUserProfileExists, 
    setUserAttribValue, 
    getUserAttribValue, 
    setAllUsersAttribValue,
    setUserSubsystemAttribValue,
    getUserSubsystemAttribValue,
    getUserSubsystems,
    getUserActiveSubsystems,
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
} from './xmlManager.js';
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
    pathUsersData,
    pathServerData,
} from './xmlConfig.js';

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
    findEmoji,
} from './missSentences.js';

import {
    updateGist,
} from './uploadUtils.js';

import fs from 'fs';
import xml2js from 'xml2js';
// Core Functions
async function getGuild(client) {
    return await client.guilds.fetch(guildID);
}

async function getMemberByID(client, id) {
    const guild = await getGuild(client);
    try {
        return await guild.members.fetch(cleanString(id));
    }
    catch {
        return "";
    }
}

async function getPackSpecificChannel(packBoosterType) {
    console.log(`Finding channel for pack type: "${packBoosterType}"`);
    
    // Handle empty input
    if (!packBoosterType) {
        console.log("No pack type provided, defaulting to Mewtwo channel");
        return channelID_MewtwoVerificationForum;
    }
    
    // Clean up the input - trim whitespace and convert to uppercase
    const packType = packBoosterType.trim().toUpperCase();
    console.log(`Normalized pack type: "${packType}"`);
    
    // Direct mapping based on includes
    if (packType.includes("MEWTWO")) {
        console.log("Routing to Mewtwo channel");
        return channelID_MewtwoVerificationForum;
    } 
    else if (packType.includes("CHARIZARD")) {
        console.log("Routing to Charizard channel");
        return channelID_CharizardVerificationForum;
    } 
    else if (packType.includes("PIKACHU")) {
        console.log("Routing to Pikachu channel");
        return channelID_PikachuVerificationForum;
    } 
    else if (packType.includes("MEW") && !packType.includes("MEWTWO")) {
        console.log("Routing to Mew channel");
        return channelID_MewVerificationForum;
    } 
    else if (packType.includes("DIALGA")) {
        console.log("Routing to Dialga channel");
        return channelID_DialgaVerificationForum;
    } 
    else if (packType.includes("PALKIA")) {
        console.log("Routing to Palkia channel");
        return channelID_PalkiaVerificationForum;
    } 
    else if (packType.includes("ARCEUS")) {
        console.log("Routing to Arceus channel");
        return channelID_ArceusVerificationForum;
    } 
    else if (packType.includes("SHINING")) {
        console.log("Routing to Shining channel");
        return channelID_ShiningVerificationForum;
    } 
    else {
        console.log(`No specific match for "${packType}", defaulting to Mewtwo channel`);
        return channelID_MewtwoVerificationForum;
    }
}
async function getUsersStats(users, members, isAntiCheatOn) {
    var usersStats = [];

    for (const user of users) {
        var userOutput = `\`\`\`ansi\n`;

        const currentTime = new Date();
        const id = getIDFromUser(user);
        const username = getUsernameFromUser(user);
        var visibleUsername = username;

        // Check for State
        const userState = getAttribValueFromUser(user, attrib_UserState, "inactive");

        // Subsystems stats
        const instancesSubsystems = getAttribValueFromUserSubsystems(user, attrib_HBInstances, 0);
        const sessionTimeSubsystems = getAttribValueFromUserSubsystems(user, attrib_SessionTime, 0);
        const sessionPacksSubsystems = getAttribValueFromUserSubsystems(user, attrib_SessionPacksOpened, 0);
        const lastHBTimeSubsystems = getAttribValueFromUserSubsystems(user, attrib_LastHeartbeatTime, 0);
        const diffPacksSinceLastHBSubsystems = getAttribValueFromUserSubsystems(user, attrib_DiffPacksSinceLastHB, 0);

        var session_PacksSubsystems = 0;
        var total_PacksSinceLastHbSubsystems = 0;
        var total_PacksSubsystems = 0;
        var total_diffPacksSinceLastHBSubsystems = 0;
        var biggerSessionTimeSubsystems = 0;

        for (let i = 0; i < lastHBTimeSubsystems.length; i++) {
            const diffHBSubsystem = (currentTime - new Date(lastHBTimeSubsystems[i])) / 60000;
            
            if (diffHBSubsystem < parseFloat(heartbeatRate+1)) { // If last HB less than Xmn then count instances and session time
                biggerSessionTimeSubsystems = Math.max(biggerSessionTimeSubsystems, sessionTimeSubsystems[i]);
                session_PacksSubsystems += parseFloat(sessionPacksSubsystems[i]);
                total_diffPacksSinceLastHBSubsystems += parseFloat(diffPacksSinceLastHBSubsystems[i]);
            }
            total_PacksSubsystems += parseFloat(sessionPacksSubsystems[i]);
        }
// Activity check
        members.forEach(member => {
            if (username === member.user.username) {
                visibleUsername = member.displayName;
            }
        });

        const userActiveState = await refreshUserActiveState(user);
        const activeState = userActiveState[0];
        var inactiveTime = userActiveState[1];

        var barOffset = 50;
        
        if (userState == "active") {
            if (activeState == "active") {
                userOutput += colorText(visibleUsername, "green");
            }
            else if (activeState == "waiting") {
                userOutput += colorText(visibleUsername, "yellow") + " - started";
            }
            else { // Inactive
                const lastHBTime = getAttribValueFromUser(user, attrib_LastHeartbeatTime);
                if (lastHBTime == "" || lastHBTime == undefined) {
                    userOutput += colorText(visibleUsername, "red") + ` - ${colorText("Heartbeat issue","red")}`;
                }
                else {
                    inactiveTime = Math.round(parseFloat(inactiveTime));
                    userOutput += colorText(visibleUsername, "red") + ` - inactive for ${colorText(inactiveTime,"red")}mn`;
                }
                barOffset += 11; // 11 more because coloring the text adds 11 hidden characters
            }
        }
        else if (userState == "farm") {
            userOutput += colorText(visibleUsername, "cyan");
        }
        else if (userState == "leech") {
            userOutput += colorText(visibleUsername, "pink");
        }

        userOutput = addTextBar(userOutput, barOffset);

        // Instances
        var instances = await refreshUserRealInstances(user, activeState);
        userOutput += colorText(` ${instances} instances\n`, "gray");
// Session stats       
        var sessionTime = getAttribValueFromUser(user, attrib_SessionTime);
        sessionTime = roundToOneDecimal(parseFloat(Math.max(sessionTime, biggerSessionTimeSubsystems)));
        var sessionPackF = parseFloat(getAttribValueFromUser(user, attrib_SessionPacksOpened)) + session_PacksSubsystems;

        const text_Session = colorText("Session:", "gray");
        const text_sessionTime = colorText("running " + sessionTime + "mn", "gray");
        const text_sessionPackF = colorText("w/ " + sessionPackF + " packs", "gray");

        // Calculate packs/mn
        var diffPacksSinceLastHb = parseFloat(getAttribValueFromUser(user, attrib_DiffPacksSinceLastHB)) + total_diffPacksSinceLastHBSubsystems;
        var diffTimeSinceLastHb = parseFloat(getAttribValueFromUser(user, attrib_DiffTimeSinceLastHB, heartbeatRate));
        var avgPackMn = roundToOneDecimal(diffPacksSinceLastHb/diffTimeSinceLastHb);
        avgPackMn = isNaN(avgPackMn) || userState == "leech" ? 0 : avgPackMn;
        await setUserAttribValue(id, username, attrib_PacksPerMin, avgPackMn);
        const text_avgPackMn = colorText(avgPackMn, "blue");

        userOutput += `    ${text_Session}${text_avgPackMn} packs/mn  ${text_sessionTime} ${text_sessionPackF}\n`;

        // Pack stats
        const totalPack = parseInt(getAttribValueFromUser(user, attrib_TotalPacksOpened));
        var sessionPackI = parseInt(getAttribValueFromUser(user, attrib_SessionPacksOpened)) + total_PacksSubsystems;

        const totalGodPack = parseInt(getAttribValueFromUser(user, attrib_GodPackFound));
        const avgGodPack = roundToOneDecimal(totalGodPack >= 1 ? (totalPack+sessionPackI)/totalGodPack : (totalPack+sessionPackI));
        
        const gpLive = parseInt(getAttribValueFromUser(user, attrib_GodPackLive, 0));

        const text_GPAvg = colorText("GP Avg:", "gray");
        const text_Packs = colorText("Packs:", "gray");
        const text_GP = colorText("GP:", "gray");
        const text_Live = showPerPersonLive ? colorText("Live:", "gray") : "";
        const text_TotalPack = colorText(totalPack + sessionPackI, "blue");
        const text_TotalGodPack = colorText(totalGodPack, "blue");
        const text_GPRatio = totalGodPack >= 1 ? '1/' : '0/';
        const text_AvgGodPack = colorText(`${text_GPRatio}${avgGodPack}`, `blue`);
        const text_GPLive = showPerPersonLive ? colorText(`${gpLive}`, `blue`) : "";

        userOutput += `    ${text_Packs}${text_TotalPack} ${text_GP}${text_TotalGodPack} ${text_Live}${text_GPLive} ${text_GPAvg}${text_AvgGodPack}\n`;
if (isAntiCheatOn && userState == "active") {
            const text_AntiCheatPPM = colorText(`PPM:`, "gray");
            const text_AntiCheatCount = colorText(`Accounts:`, "gray");
            const text_inMin = colorText(`in 30mn`, "gray");
            
            var rollingType = getAttribValueFromUser(user, attrib_RollingType, groupPacksType.toString());
            if (rollingType == "") {rollingType = groupPacksType.toString();}
            const packsAmountPerRun = extractNumbers(rollingType)[0];
            const acUserCount = getAttribValueFromUser(user, attrib_AntiCheatUserCount, 0);
            const acPPM = roundToOneDecimal((parseFloat(acUserCount) * packsAmountPerRun)/30); // UserCount * 5 Pack / Pseudonym over 30 minutes sent every 5 minutes
            const diffPPM = Math.abs(avgPackMn - acPPM); // Negative values will mean that AntiCheat values are greater than HB ones so it's fine
            
            const text_acPPM = colorText(acPPM, "gray");
            const text_AC_Count = colorText(acUserCount, "gray");
            
            var text_AntiCheat = "";  
            if (sessionTime == 0) {
                text_AntiCheat = colorText(`Anti-Cheat`, "gray");
            } else if (diffPPM < 1) {
                text_AntiCheat = colorText(`Anti-Cheat`, "green");
            } else if (diffPPM < 2) {
                text_AntiCheat = colorText(`Anti-Cheat`, "yellow");
            } else {
                text_AntiCheat = colorText(`Anti-Cheat`, "red");
            }

            if (acUserCount == "0") {
                userOutput += `    ${text_AntiCheat} not set up`;
            }
            else {
                userOutput += `    ${text_AntiCheat} ${text_AntiCheatPPM}${text_acPPM} ${text_AntiCheatCount}${text_AC_Count} ${text_inMin}`;
            }
        }
        userOutput += `\n\`\`\``;

        usersStats.push(userOutput);
    }
    
    return usersStats;
}
async function sendStats(client) {
    console.log("📝 Updating Stats...");
    
    const guild = await getGuild(client);

    await bulkDeleteMessages(guild.channels.cache.get(channelID_UserStats), 50);

    // CACHE MEMBERS
    const m = await guild.members.fetch();

    var activeUsers = await getActiveUsers(true, true);
    const allUsers = await getAllUsers();
    // Exit if 0 activeUsers
    if (activeUsers == "" || activeUsers.length == 0) {return;}

    var isAntiCheatOn = false;
    var antiCheatVerifier = "";

    if (AntiCheat) {
        const recentAntiCheatMessages = await getLastsAntiCheatMessages(client);
    
        if (recentAntiCheatMessages.messages.length === Math.floor(30/antiCheatRate)) {
            isAntiCheatOn = true;
            const memberAntiCheatVerifier = await getMemberByID(client, recentAntiCheatMessages.prefix);
            
            // Skip if member does not exist
            if (memberAntiCheatVerifier == "") {
                antiCheatVerifier = "Unknown";
                console.log(`❗️ AntiCheat Verifier ID ${userID} is not registered on this server`);
            } else {
                antiCheatVerifier = memberAntiCheatVerifier.displayName;
            }
        }
    }
var activeUsersInfos = await getUsersStats(activeUsers, m, isAntiCheatOn);

    // Send users data message by message otherwise it gets over the 2k words limit
    const text_ServerStats = localize("Stats Serveur", "Server Stats");
    const text_UserStats = localize("Stats Rerollers Actifs", "Active Rerollers Stats");

    // ========================= SERVER STATS =========================

    // Re-update Users (due to some attributes getting updated right before) 
    activeUsers = await getActiveUsers(true, false);
    const activeInstances = getAttribValueFromUsers(activeUsers, attrib_RealInstances, [0]);
    const instancesAmount = sumIntArray(activeInstances);
    const avginstances = roundToOneDecimal(instancesAmount/activeUsers.length);
    
    const globalPacksPerMin = getAttribValueFromUsers(activeUsers, attrib_PacksPerMin, [0]);
    const accumulatedPacksPerMin = sumFloatArray(globalPacksPerMin);
    const avgPacksPerMin = roundToOneDecimal(accumulatedPacksPerMin/activeUsers.length);

    const totalServerPacks = sumIntArray(getAttribValueFromUsers(allUsers, attrib_TotalPacksOpened, [0]));
    const totalServerTime = sumIntArray(getAttribValueFromUsers(allUsers, attrib_TotalTime, [0]));
    
    // Calculate GP stats based on ServerData
    const eligibleGPs = await getServerDataGPs(attrib_eligibleGPs);
    const ineligibleGPs = await getServerDataGPs(attrib_ineligibleGPs);
    const liveGPs = await getServerDataGPs(attrib_liveGPs);

    var eligibleGPCount = 0;
    var ineligibleGPCount = 0;
    var liveGPCount = 0;
    var weekEligibleGPCount = 0;
    var weekLiveGPCount = 0;

    var totalGPCount = 0;
    var potentialLiveGPCount = 0;

    var weekLuck = 0;
    var totalLuck = 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    if (eligibleGPs != undefined) {
        eligibleGPCount = parseInt(eligibleGPs.length);
        
        eligibleGPs.forEach(eligibleGP => {
            if (getTimeFromGP(eligibleGP) > oneWeekAgo) weekEligibleGPCount++;
        });

        if (ineligibleGPs != undefined) {
            ineligibleGPCount = parseInt(ineligibleGPs.length);

            totalGPCount = eligibleGPCount + ineligibleGPCount;

            if (liveGPs != undefined) {
                liveGPCount = parseInt(liveGPs.length);
            
                liveGPs.forEach(liveGP => {
                    if (getTimeFromGP(liveGP) > oneWeekAgo) weekLiveGPCount++;
                });
                
                if (weekLiveGPCount > 0) {
                    weekLuck = roundToOneDecimal(weekLiveGPCount / weekEligibleGPCount * 100);
                }
                if (liveGPCount > 0) {
                    totalLuck = roundToOneDecimal(liveGPCount / eligibleGPCount * 100);
                }
        
                if (!isNaN(totalLuck) && totalLuck > 0 && totalGPCount > 0) {
                    var potentialEligibleGPCount = eligibleGPCount + (ineligibleGPCount * min2Stars * 0.1); // 0.1 = 1 chance out of 10 for an invalid to not be a gold or immersive (for every Min2Stars)
                    potentialLiveGPCount = Math.round(potentialEligibleGPCount * (totalLuck/100));
                }
            }
        }
    }

    const embedUserStats = new EmbedBuilder()
        .setColor('#f02f7e') // Color in hexadecimal
        .setTitle('Summary')
        .addFields(
            { name: `👥 Rerollers :            ‎`, value: `${activeUsers.length}`, inline: true },
            { name: `🔄 Instances :`, value: `${instancesAmount}`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `🔥 PackPerMin :           ‎`, value: `${roundToOneDecimal(accumulatedPacksPerMin)}`, inline: true },
            { name: `🔥 PackPerHour :`, value: `${roundToOneDecimal(accumulatedPacksPerMin*60)}`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `📊 Avg Instance/Ppl :     ‎`, value: `${avginstances}`, inline: true },
            { name: `📊 Avg PPM/Ppl :`, value: `${avgPacksPerMin}`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: `🃏 Total Packs :          ‎`, value: `${formatNumbertoK(totalServerPacks)}`, inline: true },
            { name: `🕓 Total Time :`, value: `${formatMinutesToDays(totalServerTime)}`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `✅ Week Live :            ‎`, value: `${weekLiveGPCount}`, inline: true },
            { name: `🔴 Week Eligibles :       ‎`, value: `${weekEligibleGPCount}`, inline: true },
            { name: `🍀 Week Luck :`, value: `${ weekLuck + " %"}`, inline: true },
            { name: `✅ Total Live :           ‎`, value: `${liveGPCount}`, inline: true },
            { name: `🔴 Total Eligibles :      ‎`, value: `${eligibleGPCount}`, inline: true },
            { name: `🍀 Total Luck :`, value: `${ totalLuck + " %"}`, inline: true },
            { name: `☑️ Potential Live :       ‎`, value: `${potentialLiveGPCount}`, inline: true },
            { name: `📊 Total GP :`, value: `${totalGPCount}`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
        );

    guild.channels.cache.get(channelID_UserStats).send({content:`## ${text_ServerStats} :\n`});
    guild.channels.cache.get(channelID_UserStats).send({ embeds: [embedUserStats] });
    await wait(1.5);
// ========================= SERVER RULES =========================
    var serverState = `\`\`\`ansi\n`;

    if (AntiCheat) {
        serverState += `🛡️ Anti-Cheat : ${isAntiCheatOn == true ? colorText("ON","green") + colorText(` Verified by ${antiCheatVerifier}`, "gray") : colorText("OFF","red")}\n`;
    }
    serverState += `💤 Auto Kick : ${AutoKick == true ? colorText("ON","green") : colorText("OFF","red")}\n`;
    serverState += `🩸 Leeching : ${canPeopleLeech == true ? colorText("ON","green") : colorText("OFF","red")}\n`;

    serverState += `\`\`\``;

    guild.channels.cache.get(channelID_UserStats).send({content:serverState});
    await wait(1.5);

    // ========================= SELECTED PACKS =========================

    var selectedPacksText = await getSelectedPacksEmbedText(client, activeUsers);

    const embedSelectedPacks = new EmbedBuilder()
        .setColor('#f02f7e') // Color in hexadecimal
        .setTitle('Instances / Selected Packs')
        .setDescription(selectedPacksText);

    guild.channels.cache.get(channelID_UserStats).send({ embeds: [embedSelectedPacks] });
    await wait(1.5);

    // ========================= USER STATS =========================

    guild.channels.cache.get(channelID_UserStats).send({content:`## ${text_UserStats} :\n`});
for (var i = 0; i < activeUsersInfos.length; i++) {
        const activeUsersInfo = activeUsersInfos[i];
        guild.channels.cache.get(channelID_UserStats).send({content:activeUsersInfo});
        await wait(1.5);
    }
if (allUsers.length > 5) {
        var missCountArray = [];
        var farmInfoArray = [];

        for (var i = 0; i < allUsers.length; i++) {
            var user = allUsers[i];
            var userID = getIDFromUser(user);
            var userUsername = getUsernameFromUser(user);
            const member = await getMemberByID(client, userID);

            var displayName = "";
            if (member == "") {
                displayName = userUsername;
            }
            else {
                displayName = member.displayName;
            }

            const totalMiss = getAttribValueFromUser(user, attrib_TotalMiss, 0);
            const totalTime = getAttribValueFromUser(user, attrib_TotalTime, 0);
            const sessionTime = getAttribValueFromUser(user, attrib_SessionTime, 0);
            const totalTimeHour = (parseFloat(totalTime) + parseFloat(sessionTime)) / 60;
            var missPer24Hour = roundToOneDecimal((parseFloat(totalMiss) / totalTimeHour) * 24);
            missPer24Hour = isNaN(missPer24Hour) || missPer24Hour == Infinity ? 0 : missPer24Hour;

            missCountArray.push({ user: displayName, value: missPer24Hour });
            
            const totalTimeFarm = getAttribValueFromUser(user, attrib_TotalTimeFarm, 0);
            const totalPacksFarm = getAttribValueFromUser(user, attrib_TotalPacksFarm, 0);
            
            farmInfoArray.push({ user: displayName, packs: totalPacksFarm, time: totalTimeFarm });
        }
if (farmInfoArray.length >= leaderboardBestFarmLength) {
            // Sort by best
            farmInfoArray.sort((a, b) => b.time - a.time);
            
            var bestFarmersText = ``;

            for (let i = 0; i < leaderboardBestFarmLength; i++) {
                var emoji_BestFarm;
                if (i == 0) {
                    emoji_BestFarm = findEmoji(client, leaderboardBestFarm1_CustomEmojiName, "🌟");
                }
                else if (i == 1) {
                    emoji_BestFarm = findEmoji(client, leaderboardBestFarm2_CustomEmojiName, "⭐️");
                }
                else {
                    emoji_BestFarm = findEmoji(client, leaderboardBestFarm3_CustomEmojiName, "✨");
                }

                bestFarmersText += `${emoji_BestFarm} ${farmInfoArray[i].user} - ${roundToOneDecimal(farmInfoArray[i].time/60)}h with ${farmInfoArray[i].packs} packs\n\n`;                
            }

            const embedBestFarmers = new EmbedBuilder()
                .setColor('#39d1bf') // Color in hexadecimal
                .setTitle('Best Farmers')
                .setDescription(bestFarmersText);

            guild.channels.cache.get(channelID_UserStats).send({ embeds: [embedBestFarmers] });
        }
if (missCountArray.length >= 6) {
            const emoji_BestVerifier1 = findEmoji(client, leaderboardBestVerifier1_CustomEmojiName, "🥇");
            const emoji_BestVerifier2 = findEmoji(client, leaderboardBestVerifier2_CustomEmojiName, "🥈");
            const emoji_BestVerifier3 = findEmoji(client, leaderboardBestVerifier3_CustomEmojiName, "🥉");

            const emoji_WorstVerifier1 = findEmoji(client, leaderboardWorstVerifier1_CustomEmojiName, "😈");
            const emoji_WorstVerifier2 = findEmoji(client, leaderboardWorstVerifier2_CustomEmojiName, "👿");
            const emoji_WorstVerifier3 = findEmoji(client, leaderboardWorstVerifier3_CustomEmojiName, "💀");

            // Sort by best first
            missCountArray.sort((a, b) => b.value - a.value);
            var bestMissCountsText = `
${emoji_BestVerifier1} ${missCountArray[0].user} - ${missCountArray[0].value} miss / 24h\n
${emoji_BestVerifier2} ${missCountArray[1].user} - ${missCountArray[1].value} miss / 24h\n
${emoji_BestVerifier3} ${missCountArray[2].user} - ${missCountArray[2].value} miss / 24h
            `; //no tabs to avoid phone weird spacing

            // Sort by worst then
            missCountArray.sort((a, b) => a.value - b.value);
            var worstMissCountsText = `
${emoji_WorstVerifier1} ${missCountArray[2].user} - ${missCountArray[2].value} miss / 24h\n
${emoji_WorstVerifier2} ${missCountArray[1].user} - ${missCountArray[1].value} miss / 24h\n
${emoji_WorstVerifier3} ${missCountArray[0].user} - ${missCountArray[0].value} miss / 24h
            `; //no tabs to avoid phone weird spacing

            const embedBestMissCountStats = new EmbedBuilder()
                .setColor('#5cd139') // Color in hexadecimal
                .setTitle('Best Verifiers')
                .setDescription(bestMissCountsText);

            const embedWorstMissCountStats = new EmbedBuilder()
                .setColor('#d13939') // Color in hexadecimal
                .setTitle('Bottom Verifiers')
                .setDescription(worstMissCountsText);

            guild.channels.cache.get(channelID_UserStats).send({ embeds: [embedBestMissCountStats] });
            guild.channels.cache.get(channelID_UserStats).send({ embeds: [embedWorstMissCountStats] });
        }
    }
    
    console.log("☑️📝 Done updating Stats");
}
async function sendIDs(client, updateServer = true) {
    const activePocketIDs = await getActiveIDs();

    const text_contentOf = localize("Contenu de IDs.txt", "Content of IDs.txt");
    const text_activePocketIDs = `*${text_contentOf} :*\n\`\`\`\n${activePocketIDs}\n\`\`\``;
    // Send instances and IDs    
    sendChannelMessage(client, channelID_Commands, text_activePocketIDs, delayMsgDeleteState);
    
    if (updateServer) {
        updateGist(await getActiveIDs());
    }
}

// GP Tracking List Function 
async function updateGPTrackingList(client) {
    console.log("📝 Updating GP Tracking List...");
    
    const guild = await getGuild(client);
    const trackingChannel = guild.channels.cache.get(channelID_GPTrackingList);
    
    if (!trackingChannel) {
        console.log(`⚠️ Warning: GP Tracking channel ${channelID_GPTrackingList} not found`);
        return;
    }
    
    // Clear previous tracking messages
    await bulkDeleteMessages(trackingChannel, 10);
    
    // Prepare the message
    let trackingMessage = `✅ **Alive Packs** ✅\n`;
    
    // Process each forum channel for GPs
    const packForums = [
        channelID_MewtwoVerificationForum,
        channelID_CharizardVerificationForum,
        channelID_PikachuVerificationForum, 
        channelID_MewVerificationForum,
        channelID_DialgaVerificationForum,
        channelID_PalkiaVerificationForum,
        channelID_ArceusVerificationForum,
        channelID_ShiningVerificationForum
    ];
    
    // Track all GPs
    let aliveGPs = [];
    let testingGPs = [];
    
    // Process all verification forums
    for (const forumId of packForums) {
        if (!forumId) continue;
        
        try {
            const forum = await client.channels.cache.get(forumId);
            if (!forum) continue;
            
            // Fetch active threads
            const activeThreads = await forum.threads.fetchActive();
            
            // Process each thread
            for (let thread of activeThreads.threads.values()) {
                // Skip dead GPs
                if (thread.name.includes(text_deadLogo)) continue;
                
                // Extract thread info - keep original format
                const cleanName = replaceAnyLogoWith(thread.name, "").trim();
                
                // Get pack type from forum name
                let packType = "";
                if (forumId === channelID_MewtwoVerificationForum) packType = "Mewtwo";
                else if (forumId === channelID_CharizardVerificationForum) packType = "Charizard";
                else if (forumId === channelID_PikachuVerificationForum) packType = "Pikachu";
                else if (forumId === channelID_MewVerificationForum) packType = "Mew";
                else if (forumId === channelID_DialgaVerificationForum) packType = "Dialga";
                else if (forumId === channelID_PalkiaVerificationForum) packType = "Palkia";
                else if (forumId === channelID_ArceusVerificationForum) packType = "Arceus";
                else if (forumId === channelID_ShiningVerificationForum) packType = "Shining";
                
                // Format display string - this follows the exact format you specified
                // Example: DV259 [4P][4/5][Palkia][GP]
                // Extract main parts
                const nameParts = cleanName.split(' ');
                const accountName = nameParts[0];
                
                // Extract and format the remaining parts
                const remainingInfo = cleanName.substring(accountName.length).trim();
                
                // Add [PackType] if not already in the name
                let formattedName = `${accountName} ${remainingInfo}`;
                if (!formattedName.includes(`[${packType}]`)) {
                    formattedName = `${accountName} ${remainingInfo}[${packType}]`;
                }
                
                // If the name doesn't end with [GP], add it for god packs
                if (thread.name.toLowerCase().includes("god pack") && !formattedName.endsWith("[GP]")) {
                    formattedName += "[GP]";
                }
                
                // Check if alive or testing
                if (thread.name.includes(text_verifiedLogo)) {
                    aliveGPs.push({
                        name: formattedName,
                        threadId: thread.id
                    });
                } else {
                    testingGPs.push({
                        name: formattedName,
                        threadId: thread.id
                    });
                }
            }
        } catch (error) {
            console.log(`⚠️ Error processing forum ${forumId}: ${error}`);
        }
    }
    
    // Sort alphabetically by account name
    aliveGPs.sort((a, b) => a.name.localeCompare(b.name));
    testingGPs.sort((a, b) => a.name.localeCompare(b.name));
    
    // Format alive GPs
    for (const gp of aliveGPs) {
    	trackingMessage += `**[\`[Alive]\`](https://discord.com/channels/${guildID}/${gp.threadId}) ${gp.name}**\n`;
    }
    
    if (aliveGPs.length === 0) {
        trackingMessage += "No alive GPs currently tracked.\n";
    }
    
    // Add testing packs section
    trackingMessage += `\n🍀 **Testing Packs** 🍀\n`;
    
    // Format testing GPs
    for (const gp of testingGPs) {
    	 trackingMessage += `**[\`[Testing]\`](https://discord.com/channels/${guildID}/${gp.threadId}) ${gp.name}**\n`;
    }

    if (testingGPs.length === 0) {
        trackingMessage += "No testing GPs currently tracked.\n";
    }
    
    // Send the tracking message
    await trackingChannel.send({ content: trackingMessage });
    
    console.log("✅ GP Tracking List updated successfully");
}

async function sendStatusHeader(client) {
    console.log("📝 Updating Status Header...");
    
    const guild = await getGuild(client);
    const channel_IDs = guild.channels.cache.get(channelID_Commands);

    try {
        // Get recent messages
        console.log("🔍 Looking for previous status header messages...");
        const messages = await channel_IDs.messages.fetch({ limit: 10 });
        
        // Filter for bot messages that have our status header characteristics
        const statusMessages = messages.filter(msg => 
            msg.author.id === client.user.id && 
            msg.embeds.length > 0 && 
            msg.embeds[0].data && 
            msg.embeds[0].data.title && 
            msg.embeds[0].data.title.includes("Click to change Status")
        );
        
        if (statusMessages.size > 0) {
            console.log(`🗑️ Found ${statusMessages.size} status messages to delete`);
            
            // Delete each message individually to be safe
            for (const [id, message] of statusMessages) {
                try {
                    await message.delete();
                    console.log(`✅ Deleted status message with ID: ${id}`);
                } catch (error) {
                    console.log(`❌ Failed to delete message ${id}: ${error.message}`);
                }
                // Add a small delay to avoid rate limits
                await wait(0.5);  // Using your existing wait function with 0.5 seconds
            }
        } else {
            console.log("ℹ️ No previous status messages found to delete");
        }
    } catch (error) {
        console.error('❌ Error finding/deleting status messages:', error);
    }
// Now create and send the new status header
    // Rest of the function remains the same...
    const headerDescription = `
\`\`\`ansi
${colorText("Active", "green")} - ✅Friend Requests${AutoKick ? " ✅Auto Kickable" : ""}
${colorText("Inactive", "red")} - ❌Friend Requests
${colorText("Farm / No Main", "cyan")} - ❌Friend Requests${AutoKick ? " ❌Auto Kickable" : ""}
${colorText("Switch to this for others when verifying / playing on Main / Low Instances amount due to high computer usage", "gray")}
${canPeopleLeech ? `${colorText("Leech / Only Main", "pink")} - ✅Friend Requests${AutoKick ? " ❌Auto Kickable" : ""}` : ``}
\`\`\``;

    const embedStatusChange = new EmbedBuilder()
        .setColor('#f02f7e')
        .setTitle(`__**Click to change Status**__ - *Similar to /active /inactive /farm ${canPeopleLeech ? "/leech" : ""}*`)
        .setDescription(headerDescription);

    const buttonActive = new ButtonBuilder()
        .setCustomId('active')
        .setLabel('Active')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success);

    const buttonFarm = new ButtonBuilder()
        .setCustomId('farm')
        .setLabel('Farm')
        .setEmoji('⚡')
        .setStyle(ButtonStyle.Primary);

    const buttonLeech = new ButtonBuilder()
        .setCustomId('leech')
        .setLabel('Leech')
        .setEmoji('🩸')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!canPeopleLeech);
    
    const buttonInactive = new ButtonBuilder()
        .setCustomId('inactive')
        .setLabel('Inactive')
        .setEmoji('💀')
        .setStyle(ButtonStyle.Danger);

    const buttonRefreshStats = new ButtonBuilder()
        .setCustomId('refreshUserStats')
        .setLabel('Refresh Stats')
        .setEmoji('🔄')
        .setStyle(ButtonStyle.Primary);

    const row1 = new ActionRowBuilder().addComponents(buttonActive, buttonInactive, buttonFarm, buttonLeech);
    const row2 = new ActionRowBuilder().addComponents(buttonRefreshStats);

    await channel_IDs.send({ embeds: [embedStatusChange], components: [row1, row2] });
    
    console.log("☑️📝 Done updating Status Header");
}

async function inactivityCheck(client) {
    console.log("👀 Checking inactivity...");

    const guild = await getGuild(client);
    
    var inactiveCount = 0;
    
    var activeUsers = await getActiveUsers(); // Get current active users
    // Exit if 0 activeUsers
    if (activeUsers == "" || activeUsers.length == 0) {return;}

    for (var i = 0; i < activeUsers.length; i++) {
        const user = activeUsers[i];

        // Check user active state
        const userActiveState = await refreshUserActiveState(user);
        // Check user instances count
        const userInstances = await refreshUserRealInstances(user, userActiveState[0]);
        // Check user pack per min & sessionTime
        const userPackPerMin = await getAttribValueFromUser(user, attrib_PacksPerMin, 10);
        const sessionTime = await getAttribValueFromUser(user, attrib_SessionTime, 0);
        
        const lastActiveTime = new Date(await getAttribValueFromUser(user, attrib_LastActiveTime, 0));
        const currentTime = Date.now();
        const diffActiveTime = (currentTime - lastActiveTime) / 60000;
        
        // Check if kickable and prevent him if he has been kicked
        var text_haveBeenKicked = "";
        if (userActiveState == "inactive") {
            text_haveBeenKicked = localize(`a été kick des rerollers actifs pour inactivité depuis plus de ${inactiveTime}mn`,` has been kicked out of active rerollers for inactivity for more than ${inactiveTime}mn`);
            console.log(`✖️ Kicked ${getUsernameFromUser(user)} - inactivity for more than ${inactiveTime}mn`);
        }
        else if (parseFloat(diffActiveTime) > parseInt(heartbeatRate)+1 && 
                parseFloat(sessionTime) > parseInt(heartbeatRate)+1) {
            if (userInstances <= parseInt(inactiveInstanceCount)) {
                text_haveBeenKicked = localize(`a été kick des rerollers actifs car il a ${userInstances} instances en cours`,` has been kicked out of active rerollers for inactivity because he had ${userInstances} instances running`);
                console.log(`✖️ Kicked ${getUsernameFromUser(user)} - ${userInstances} instances running`);
            }
            else if (parseFloat(userPackPerMin) < parseFloat(inactivePackPerMinCount) && 
                    parseFloat(userPackPerMin) > 0) {
                text_haveBeenKicked = localize(`a été kick des rerollers actifs pour avoir fait ${userPackPerMin} packs/mn`,` has been kicked out of active rerollers for inactivity because made ${userPackPerMin} packs/mn`);
                console.log(`✖️ Kicked ${getUsernameFromUser(user)} - made ${userPackPerMin} packs/mn`);
            }
            else {
                continue;
            }
        }
        else {
            continue;
        }

        // Then we can kick the user if continue didn't trigger
        await setUserAttribValue(getIDFromUser(user), getUsernameFromUser(user), attrib_UserState, "inactive");
        guild.channels.cache.get(channelID_Commands).send({ content:`<@${getIDFromUser(user)}> ${text_haveBeenKicked}`});
    }

    if (inactiveCount >= 1) {
        sendIDs(client);
    }
}
function extractGPInfo(message) {
    console.log(`----- Extracting GP info from: ${message.substring(0, 100)}... -----`);
    const regexOwnerID = /<@(\d+)>/;
    const regexAccountName = /^(\S+)/m;
    const regexAccountID = /\((\d+)\)/;
    const regexTwoStarRatio = /\[(\d)\/\d\]/;
    const regexPackAmount = /\[(\d+)P\]/;
    const regexPackBoosterType = /\[\d+P\]\s*([^\]]+)\s*\]/;
    
    console.log("Applying regex patterns...");
    const ownerIDMatch = message.match(regexOwnerID);
    const accountNameMatch = message.split('\n')[1].match(regexAccountName);
    const accountIDMatch = message.match(regexAccountID);
    const twoStarRatioMatch = message.match(regexTwoStarRatio);
    const packAmountMatch = message.match(regexPackAmount);
    const packBoosterTypeMatch = message.match(regexPackBoosterType);
    
    console.log("Regex results:");
    console.log(`- Owner ID match: ${ownerIDMatch ? ownerIDMatch[0] : "NO MATCH"}`);
    console.log(`- Account Name match: ${accountNameMatch ? accountNameMatch[0] : "NO MATCH"}`);
    console.log(`- Account ID match: ${accountIDMatch ? accountIDMatch[0] : "NO MATCH"}`);
    console.log(`- Two Star Ratio match: ${twoStarRatioMatch ? twoStarRatioMatch[0] : "NO MATCH"}`);
    console.log(`- Pack Amount match: ${packAmountMatch ? packAmountMatch[0] : "NO MATCH"}`);
    console.log(`- Pack Booster Type match: ${packBoosterTypeMatch ? packBoosterTypeMatch[0] : "NO MATCH"}`);
    
    const ownerID = ownerIDMatch ? ownerIDMatch[1] : "0000000000000000";
    const accountName = accountNameMatch ? accountNameMatch[1] : "NoAccountName";
    const accountID = accountIDMatch ? accountIDMatch[1] : "0000000000000000";
    const twoStarRatio = twoStarRatioMatch ? twoStarRatioMatch[1] : 0;
    const packAmount = packAmountMatch ? packAmountMatch[1] : 0;
    const packBoosterType = packBoosterTypeMatch ? packBoosterTypeMatch[1] : "NoPackBoosterType";
    
    console.log(`----- Extracted GP info - Name: ${accountName}, ID: ${accountID}, Ratio: ${twoStarRatio}, Amount: ${packAmount}, Type: ${packBoosterType} -----`);
    
    return {
        ownerID,
        accountName,
        accountID,
        twoStarRatio,
        packAmount,
        packBoosterType,
    };
}

function extractDoubleStarInfo(message) {
    try {
        const regexOwnerID = /<@(\d+)>/;
        const regexAccountName = /found by (\S+)/;
        const regexAccountID = /\((\d+)\)/;
        const regexPackAmount = /\((\d+) packs/;
    
        const ownerIDMatch = message.match(regexOwnerID);
        const accountNameMatch = message.match(regexAccountName);
        const accountIDMatch = message.match(regexAccountID);
        const packAmountMatch = message.match(regexPackAmount);
    
        const ownerID = ownerIDMatch ? ownerIDMatch[1] : "0000000000000000";
        const accountName = accountNameMatch ? accountNameMatch[1] : "NoAccountName";
        const accountID = accountIDMatch ? accountIDMatch[1] : "0000000000000000";
        const packAmount = packAmountMatch ? packAmountMatch[1] : 0;
    
        console.log(`Extracted info - OwnerID: ${ownerID}, AccountName: ${accountName}, AccountID: ${accountID}, PackAmount: ${packAmount}`);
    
        return {
            ownerID,
            accountName,
            accountID,
            packAmount
        };        
    } catch (error) {
        console.log(`❌ ERROR - Failed to extract double star info for message: ${message}` + error);
    }
}

async function createForumPost(client, message, channelID, packName, titleName, ownerID, accountID, packAmount, packBoosterType = "") {
    try {
        console.log(`Creating forum post for ${packName} (${packBoosterType}) in channel ${channelID}`);
        const guild = await getGuild(client);

        // Verify channel exists
        const forum = client.channels.cache.get(channelID);
        if (!forum) {
            console.log(`Error: Channel ${channelID} not found!`);
            return;
        }
        console.log(`Found forum channel: ${forum.name}`);

        const text_verificationRedirect = localize("Verification ici :","Verification link here :");
        const text_foundBy = localize(`${packName} trouvé par`,`${packName} found by`);
        const text_commandTooltip = localize(
            "Écrivez **/miss** si un autre est apparu ou que vous ne l'avez pas\n**/verified** ou **/dead** pour changer l'état du post",
            "Write **/miss** if another one appeared or you didn't see it\n**/verified** or **/dead** to change post state");
        const text_eligible = localize("**Éligibles :**","**Eligible :**");
        
        const member = await getMemberByID(client, ownerID);
        if (member == "") {
            console.log(`Error: Member with ID ${ownerID} not found on server`);
            return;
        }
        var ownerUsername = member.user.username;
            
        // Only increment God Pack counter for actual God Packs
        if (packName == "GodPack") {
            const godPackFound = await getUserAttribValue(client, ownerID, attrib_GodPackFound, 0);
            await setUserAttribValue(ownerID, ownerUsername, attrib_GodPackFound, parseInt(godPackFound) + 1);
        }
            
        var imageUrl = message.attachments.first().url;

        var activeUsersID = getIDFromUsers(await getActiveUsers(false, true));
        var tagActiveUsernames = "";
        activeUsersID.forEach((id) => {
            tagActiveUsernames += `<@${id}>`;
        });
        
        console.log(`Creating webhook thread for ${packName}`);
        // Create thread in Webhook channel
        try {
            const thread = await message.startThread({
                name: text_verificationRedirect,
            });
            
            // First line - who found it
            const text_foundbyLine = `${text_foundBy} **<@${ownerID}>**\n`;
            
            // Normalize pack amount
            packAmount = extractNumbers(packAmount);
            packAmount = Math.max(Math.min(packAmount, 5), 1);
            
            // Second line - miss counter (only for GodPacks)
            let text_missLine = "";
            if (packName == "GodPack") {
                const text_miss = `## [ 0 miss / ${missBeforeDead[packAmount-1]} ]`;
                text_missLine = `${text_miss}\n\n`;
            }
            
            // Third line - eligible users
            const text_eligibleLine = `${text_eligible} ${tagActiveUsernames}\n\n`;
            
            // Fourth line - metadata
            const text_metadataLine = `Source: ${message.url}\nID:${accountID}\n${imageUrl}\n\n`;

            // Create appropriate title based on pack type - MODIFIED PART
            let postName;
            // Now ALL pack types get the waiting logo
            postName = `${text_waitingLogo} ${titleName}`;
            
            // For non-GodPack types, still append the pack type in brackets
            if (packName !== "GodPack") {
                postName += ` [${packName}]`;
            }
            
            console.log(`Creating forum thread with name: ${postName}`);
            
            try {
                const forumPost = await forum.threads.create({
                    name: postName,
                    message: {
                        content: text_foundbyLine + text_missLine + text_eligibleLine + text_metadataLine + text_commandTooltip,
                    },
                });
                
                console.log(`Forum thread created successfully with ID: ${forumPost.id}`);
                
                // Post forum link in webhook thread and lock it
                await thread.send(text_verificationRedirect + ` ${forumPost}`);
                await thread.setLocked(true);

                // Post the account ID message
                await guild.channels.cache.get(forumPost.id).send({
                    content: `${accountID} is the id of the account\n-# You can copy paste this message in PocketTCG to look for this account`
                });

                // Check if account ID is valid
                if (accountID == "0000000000000000") {
                    const text_incorrectID = localize("L'ID du compte est incorrect :\n- Injecter le compte pour retrouver l'ID\n- Reposter le GP dans le webhook avec l'ID entre parenthèse\n- Faites /removegpfound @LaPersonneQuiLaDrop\n- Supprimer ce post","The account ID is incorrect:\n- Inject the account to find the ID\n- Repost the GP in the webhook with the ID in parentheses\n- Do /removegpfound @UserThatDroppedIt\n- Delete this post");
                    await guild.channels.cache.get(forumPost.id).send({content: `# ⚠️ ${text_incorrectID}`});
                }
                
                await wait(1);
                
                // Only update eligible IDs for GodPacks
                if (packName == "GodPack") {
                    await updateEligibleIDs(client);
                    await addServerGP(attrib_eligibleGP, forumPost);
                }
                
                // Update GP tracking list after creating a new forum post
                await updateGPTrackingList(client);
                
                console.log(`Forum post creation completed successfully`);
            } catch (error) {
                console.log(`Error creating forum thread: ${error.message}`);
                console.error(error);
            }
        } catch (error) {
            console.log(`Error creating webhook thread: ${error.message}`);
            console.error(error);
        }
    }
    catch (error) {
        console.log(`Critical error creating ${packName} forum post: ${error.message}`);
        console.error(`Failed to create ${packName} Forum Thread for Account ${accountID} owned by <@${ownerID}>`, error);
    }
}

async function markAsDead(client, interaction, optionalText = "") {
    const text_markAsDead = localize("Godpack marqué comme mort","Godpack marked as dud");
    const text_alreadyDead = localize("Il est déjà mort et enterré... tu veux vraiment en remettre une couche ?","It's already dead and buried...");
    
    const thread = client.channels.cache.get(interaction.channelId);

    if (thread.name.includes(text_deadLogo)) {
        await sendReceivedMessage(client, `${text_alreadyDead}`, interaction);
    }
    else {
        const newThreadName = replaceAnyLogoWith(thread.name, text_deadLogo);
    
        await thread.edit({ name: `${newThreadName}` });
    
        await sendReceivedMessage(client, optionalText + text_deadLogo + ` ` + text_markAsDead, interaction);
    
        await updateEligibleIDs(client);
        
        // Update GP tracking list after marking as dead
        await updateGPTrackingList(client);
    }
}

async function updateEligibleIDs(client) {
    const text_Start = `📜 Updating Eligible IDs...`;
    const text_Done = `☑️📜 Finished updating Eligible IDs`;
    console.log(text_Start);

    // Get all pack-specific forums
    const packForums = [
        channelID_MewtwoVerificationForum,
        channelID_CharizardVerificationForum,
        channelID_PikachuVerificationForum, 
        channelID_MewVerificationForum,
        channelID_DialgaVerificationForum,
        channelID_PalkiaVerificationForum,
        channelID_ArceusVerificationForum,
        channelID_ShiningVerificationForum
    ];

    let idList = "";

    // Process each forum channel
    for (const forumId of packForums) {
        if (!forumId) continue; // Skip empty channel IDs
        
        try {
            const forum = await client.channels.cache.get(forumId);
            if (!forum) {
                console.log(`⚠️ Warning: Forum channel ${forumId} not found`);
                continue;
            }
            
            const activeThreads = await forum.threads.fetchActive();
            
            for (let thread of activeThreads.threads) {
                const nestedThread = thread[1];
                
                // Check if post contains any validation logo, otherwise skip
                if (nestedThread.name.includes(text_notLikedLogo) || 
                   nestedThread.name.includes(text_waitingLogo) || 
                   nestedThread.name.includes(text_likedLogo) || 
                   nestedThread.name.includes(text_verifiedLogo)) {
                    
                    const initialMessage = await getOldestMessage(nestedThread);
                    if (!initialMessage || !initialMessage.content) continue;
                    
                    const contentSplit = initialMessage.content.split('\n');
                    
                    var cleanThreadName = replaceAnyLogoWith(nestedThread.name, "");
                    var gpPocketName = cleanThreadName.split(" ")[1];
                    
                    var gpTwoStarCount = "5/5"; // Consider as a 5/5 in case it's not found to avoid filtering it 
                    if (!safeEligibleIDsFiltering) { // except if safe filtering is off
                        var gpTwoStarCountArray = cleanThreadName.match(/\[(\d+\/\d+)\]/);
                        gpTwoStarCount = gpTwoStarCountArray && gpTwoStarCountArray.length > 1 ? gpTwoStarCountArray[1] : "5/5";
                    }
                    
                    const gpPocketID = contentSplit.find(line => line.includes('ID:'));
                    
                    if (gpPocketID != undefined) {
                        idList += `${gpPocketID.replace("ID:","")} | ${gpPocketName} | ${gpTwoStarCount}\n`;
                    }
                }
            }
            
            // Also check archived threads
            try {
                const archivedThreads = await forum.threads.fetchArchived();
                
                for (let thread of archivedThreads.threads) {
                    const nestedThread = thread[1];
                    
                    // Check if post contains verified logo, since we only care about archived verified threads
                    if (nestedThread.name.includes(text_verifiedLogo)) {
                        
                        const initialMessage = await getOldestMessage(nestedThread);
                        if (!initialMessage || !initialMessage.content) continue;
                        
                        const contentSplit = initialMessage.content.split('\n');
                        
                        var cleanThreadName = replaceAnyLogoWith(nestedThread.name, "");
                        var gpPocketName = cleanThreadName.split(" ")[1];
                        
                        var gpTwoStarCount = "5/5"; // Consider as a 5/5 in case it's not found to avoid filtering it 
                        if (!safeEligibleIDsFiltering) { // except if safe filtering is off
                            var gpTwoStarCountArray = cleanThreadName.match(/\[(\d+\/\d+)\]/);
                            gpTwoStarCount = gpTwoStarCountArray && gpTwoStarCountArray.length > 1 ? gpTwoStarCountArray[1] : "5/5";
                        }
                        
                        const gpPocketID = contentSplit.find(line => line.includes('ID:'));
                        
                        if (gpPocketID != undefined) {
                            idList += `${gpPocketID.replace("ID:","")} | ${gpPocketName} | ${gpTwoStarCount}\n`;
                        }
                    }
                }
            } catch (error) {
                console.log(`⚠️ Warning: Error fetching archived threads from ${forumId}: ${error}`);
            }
        } catch (error) {
            console.log(`⚠️ Warning: Error processing forum ${forumId}: ${error}`);
        }
    }
// Process double star threads as well
    if (channelID_2StarVerificationForum && addDoubleStarToVipIdsTxt) {
        try {
            const doubleStarForum = await client.channels.cache.get(channelID_2StarVerificationForum);
            if (doubleStarForum) {
                const doubleStarThreads = await doubleStarForum.threads.fetchActive();
        
                for (let thread of doubleStarThreads.threads) {
                    const nestedThread = thread[1];
            
                    // Check if post contains any validation logo
                    if (nestedThread.name.includes(text_notLikedLogo) || 
                        nestedThread.name.includes(text_waitingLogo) || 
                        nestedThread.name.includes(text_likedLogo) || 
                        nestedThread.name.includes(text_verifiedLogo)) {
            
                        const initialMessage = await getOldestMessage(nestedThread);
                        if (!initialMessage || !initialMessage.content) continue;
                        
                        const contentSplit = initialMessage.content.split('\n');
            
                        const cleanDoubleStarThreadName = replaceAnyLogoWith(nestedThread.name, "");
                        const doubleStarPocketName = cleanDoubleStarThreadName.split(" ")[1];
                        var doubleStarCount = "5/5";
            
                        if (!safeEligibleIDsFiltering) { // except if safe filtering is off
                            var gpTwoStarCountArray = cleanDoubleStarThreadName.match(/\[(\d+\/\d+)\]/);
                            doubleStarCount = gpTwoStarCountArray && gpTwoStarCountArray.length > 1 ? gpTwoStarCountArray[1] : "5/5";
                        }
            
                        const doubleStarPocketID = contentSplit.find(line => line.includes('ID:'));
                        
                        if (doubleStarPocketID != undefined) {
                            idList += `${doubleStarPocketID.replace("ID:","")} | ${doubleStarPocketName} | ${doubleStarCount}\n`;
                        }
                    }
                }
            }
        } catch (error) {
            console.log(`⚠️ Warning: Error processing double star forum: ${error}`);
        }
    }

    console.log(text_Done);
    
    // Update the gist with the compiled list
    await updateGist(idList, gitGistGPName);
}

async function updateInactiveGPs(client) {
    const text_Start = `🔍 Checking Inactive GPs...`;
    const text_Done = `☑️🔍 Finished checking Inactive GPs`;
    console.log(text_Start);
    
    // Get all pack-specific forums
    const packForums = [
        channelID_MewtwoVerificationForum,
        channelID_CharizardVerificationForum,
        channelID_PikachuVerificationForum, 
        channelID_MewVerificationForum,
        channelID_DialgaVerificationForum,
        channelID_PalkiaVerificationForum,
        channelID_ArceusVerificationForum,
        channelID_ShiningVerificationForum
    ];

    let removedThreadCount = 0;

    // Process each forum channel
    for (const forumId of packForums) {
        if (!forumId) continue; // Skip empty channel IDs
        
        try {
            const forum = await client.channels.cache.get(forumId);
            if (!forum) {
                console.log(`⚠️ Warning: Forum channel ${forumId} not found`);
                continue;
            }
            
            const activeThreads = await forum.threads.fetchActive();
            
            for (let [threadId, thread] of activeThreads.threads) {
                // Calculate the age of the thread in hours
                const threadAgeHours = (Date.now() - thread.createdTimestamp) / (1000 * 60 * 60);

                // Check if the thread is older than AutoCloseLivePostTime or AutoCloseNotLivePostTime
                if (
                    (threadAgeHours > AutoCloseLivePostTime && thread.name.includes(text_verifiedLogo)) || 
                    (threadAgeHours > AutoCloseNotLivePostTime && !thread.name.includes(text_verifiedLogo)) || 
                    thread.name.includes(text_deadLogo)
                ) {
                    // Mark as dead if not already dead or verified
                    if (!thread.name.includes(text_deadLogo) && !thread.name.includes(text_verifiedLogo)) {
                        const newThreadName = replaceAnyLogoWith(thread.name, text_deadLogo);
                        await thread.edit({ name: `${newThreadName}` });
                        await wait(1);
                    }
                    // Close the thread
                    await thread.setArchived(true);
                    console.log(`🔒 Closed thread: ${thread.name} (ID: ${threadId})`);

                    removedThreadCount++;
                }
            }
        } catch (error) {
            console.log(`⚠️ Warning: Error processing forum ${forumId}: ${error}`);
        }
    }
// Also check double star forum
    if (channelID_2StarVerificationForum) {
        try {
            const forum = await client.channels.cache.get(channelID_2StarVerificationForum);
            if (forum) {
                const activeThreads = await forum.threads.fetchActive();
                
                for (let [threadId, thread] of activeThreads.threads) {
                    // Calculate the age of the thread in hours
                    const threadAgeHours = (Date.now() - thread.createdTimestamp) / (1000 * 60 * 60);

                    // Check if the thread is older than AutoCloseLivePostTime or AutoCloseNotLivePostTime
                    if (
                        (threadAgeHours > AutoCloseLivePostTime && thread.name.includes(text_verifiedLogo)) || 
                        (threadAgeHours > AutoCloseNotLivePostTime && !thread.name.includes(text_verifiedLogo)) || 
                        thread.name.includes(text_deadLogo)
                    ) {
                        // Mark as dead if not already dead or verified
                        if (!thread.name.includes(text_deadLogo) && !thread.name.includes(text_verifiedLogo)) {
                            const newThreadName = replaceAnyLogoWith(thread.name, text_deadLogo);
                            await thread.edit({ name: `${newThreadName}` });
                            await wait(1);
                        }
                        // Close the thread
                        await thread.setArchived(true);
                        console.log(`🔒 Closed thread: ${thread.name} (ID: ${threadId})`);

                        removedThreadCount++;
                    }
                }
            }
        } catch (error) {
            console.log(`⚠️ Warning: Error processing double star forum: ${error}`);
        }
    }

    console.log(text_Done);

    if (removedThreadCount > 0) {
        await updateEligibleIDs(client);
        // Update GP tracking list after archiving inactive GPs
        await updateGPTrackingList(client);
    }
}
async function setUserState(client, user, state, interaction = undefined) {
    const text_missingFriendCode = localize("Le Player ID est nécéssaire avant quoi que ce soit","The Player ID is needed before anything");
    
    const userID = user.id;
    const userUsername = user.username;
    const userDisplayName = user.displayName;

    if (await doesUserProfileExists(userID, userUsername)) {
        if (await getUserAttribValue(client, userID, attrib_PocketID) == undefined) {
            return await sendReceivedMessage(client, text_missingFriendCode, interaction, delayMsgDeleteState);
        }
    }
    else {
        return await sendReceivedMessage(client, text_missingFriendCode, interaction, delayMsgDeleteState);
    }
    
    var isPlayerActive = await getUserAttribValue(client, userID, attrib_UserState);

    if (state == "active") {
        const text_alreadyIn = localize("est déjà présent dans la liste des rerollers actifs","is already in the active rerollers pool");
        
        // Skip if player already active
        if (isPlayerActive != "active") {
            console.log(`➕ Added ${userUsername}`);
            await setUserAttribValue(userID, userUsername, attrib_UserState, "active");
            await setUserAttribValue(userID, userUsername, attrib_LastActiveTime, new Date().toString());
            await sendReceivedMessage(client, `\`\`\`ansi\n${colorText("+ " + userDisplayName, "green")} as active\n\`\`\``, interaction, 0);
            // Send the list of IDs to an URL and who is Active is the IDs channel
            sendIDs(client);
            return;
        }
        else {
            await sendReceivedMessage(client, `**<@${userID}>** ` + text_alreadyIn, interaction, delayMsgDeleteState);
            return;
        }
    }
    else if (state == "inactive") {
        const text_alreadyOut = localize("est déjà absent de la liste des rerollers actifs","is already out of the active rerollers pool");
    
        if (isPlayerActive != "inactive") {
            console.log(`➖ Removed ${userUsername}`);
            await setUserAttribValue(userID, userUsername, attrib_UserState, "inactive");
            await sendReceivedMessage(client, `\`\`\`ansi\n${colorText("- " + userDisplayName, "red")} as inactive\n\`\`\``, interaction, 0);
            // Send the list of IDs to an URL and who is Active is the IDs channel
            sendIDs(client);
            return;
        }
        else {
            await sendReceivedMessage(client, `**<@${userID}>** ` + text_alreadyOut, interaction, delayMsgDeleteState);
            return;
        }
    }
    else if (state == "farm") {
        const text_alreadyOut = localize("est déjà listé comme farmer","is already listed as farmer");
    
        if (isPlayerActive != "farm") {
            console.log(`⚡️ Farm ${userUsername}`);
            await setUserAttribValue(userID, userUsername, attrib_UserState, "farm");
            await sendReceivedMessage(client, `\`\`\`ansi\n${colorText("+ " + userDisplayName, "cyan")} as farmer\n\`\`\``, interaction, 0);
            // Send the list of IDs to an URL and who is Active is the IDs channel
            sendIDs(client);
            return;
        }
        else {
            await sendReceivedMessage(client, `**<@${userID}>** ` + text_alreadyOut, interaction, delayMsgDeleteState);
            return;
        }
    }
else if (state == "leech") {
        if (!canPeopleLeech) {
            const text_noLeech = localize("Le leech est désactivé sur ce serveur","Leeching is disabled on this server");
            await sendReceivedMessage(client, `${text_noLeech}`, interaction, delayMsgDeleteState);
            return;
        }

        const text_noReqGP = localize("ne peut pas leech car il a moins de","can't leech because he got less than");
        const text_noReqPacks = localize("et moins de","and less than");
        const gpGPCount = await getUserAttribValue(client, userID, attrib_GodPackFound, 0);
        const gpPackCount = await getUserAttribValue(client, userID, attrib_TotalPacksOpened, 0);
        
        if (gpGPCount < leechPermGPCount && gpPackCount < leechPermPackCount) {
            await sendReceivedMessage(client, `**<@${userID}>** ${text_noReqGP} ${leechPermGPCount}gp ${text_noReqPacks} ${leechPermPackCount}packs`, interaction, delayMsgDeleteState);
            return;
        }

        const text_alreadyOut = localize("est déjà listé comme leecher","is already listed as leecher");
    
        if (isPlayerActive != "leech") {
            console.log(`🩸 Leech ${userUsername}`);
            await setUserAttribValue(userID, userUsername, attrib_UserState, "leech");
            await sendReceivedMessage(client, `\`\`\`ansi\n${colorText("+ " + userDisplayName, "pink")} as leecher\n\`\`\``, interaction, 0);
            // Send the list of IDs to an URL and who is Active is the IDs channel
            sendIDs(client);
            return;
        }
        else {
            await sendReceivedMessage(client, `**<@${userID}>** ` + text_alreadyOut, interaction, delayMsgDeleteState);
            return;
        }
    }
    else {
        await sendReceivedMessage(client, `Failed to update the state of user **<@${userID}>** to ${state}`, interaction, delayMsgDeleteState);
        return;
    }
}
async function updateServerData(client, startup = false) {
    const serverDataExist = checkFileExists(pathServerData);

    // Only check if file is <4h at startup, otherwise skip every 4h, otherwise it'll never reset because it's being modified by new GP appearing
    if (serverDataExist && startup) {
        const { mtime } = fs.statSync(pathServerData);
        const fileModificationDate = mtime;
        const dateLimit = new Date(Date.now() - resetServerDataTime * 60000);

        // If file modified less than X minutes ago, return
        if (fileModificationDate > dateLimit) {
            const text_Skipping = `⏭️ Skipping GP stats reset, already fresh`;
            console.log(text_Skipping);
            return;
        }
    }

    if (!serverDataExist || resetServerDataFrequently) {
        const text_Start = `🔄 Analyze & Reset all GP stats to ServerData.xml...`;
        const text_Done = `☑️🔄 Finished Analyze & Reset all GP stats`;
        console.log(text_Start);

        // Default XML Structure
        const data = {
            root: {
              [attrib_liveGPs]: [{
                [attrib_liveGP]: []
              }],
              [attrib_eligibleGPs]: [{
                [attrib_eligibleGP]: []
              }],
              [attrib_ineligibleGPs]: [{
                [attrib_ineligibleGP]: []
              }]
            }
        };
        
        // Get all pack-specific forums
        const packForums = [
            channelID_MewtwoVerificationForum,
            channelID_CharizardVerificationForum,
            channelID_PikachuVerificationForum, 
            channelID_MewVerificationForum,
            channelID_DialgaVerificationForum,
            channelID_PalkiaVerificationForum,
            channelID_ArceusVerificationForum,
            channelID_ShiningVerificationForum
        ];
        
        // Process each forum channel
        for (const forumId of packForums) {
            if (!forumId) continue; // Skip empty channel IDs
            
            try {
                const forum_channel = await client.channels.cache.get(forumId);
                if (!forum_channel) {
                    console.log(`⚠️ Warning: Forum channel ${forumId} not found`);
                    continue;
                }
                
                const activeThreads = await forum_channel.threads.fetchActive();
                var archivedThreads = [];

                var before = undefined;
                var hasMore = true;

                // Fetch all archived threads
                while (hasMore) {
                    try {
                        const fetched = await forum_channel.threads.fetchArchived({ limit: 100, before });
                        archivedThreads = archivedThreads.concat(Array.from(fetched.threads.values()));
                        hasMore = fetched.threads.size === 100;
                        if (hasMore) {
                            before = fetched.threads.last().id;
                        }
                    } catch (error) {
                        console.log(`⚠️ Warning: Error fetching archived threads from ${forumId}: ${error}`);
                        hasMore = false;
                    }
                }

                const allThreads = [
                    ...activeThreads.threads.values(),
                    ...archivedThreads
                ];
// Process all threads in this forum
                for (let thread of allThreads) {
                    // Check if post name contains no logo, in that case skip post
                    if (!thread.name.includes(text_verifiedLogo) && 
                       !thread.name.includes(text_notLikedLogo) && 
                       !thread.name.includes(text_waitingLogo) && 
                       !thread.name.includes(text_likedLogo) && 
                       !thread.name.includes(text_deadLogo)) {
                        continue;
                    }

                    data.root[attrib_eligibleGPs][0][attrib_eligibleGP].push({
                        $: { 
                            time: new Date(thread.createdTimestamp), 
                            name: thread.name,
                        },
                        _: thread.id,
                    });

                    if (thread.name.includes(text_verifiedLogo)) {
                        data.root[attrib_liveGPs][0][attrib_liveGP].push({
                            $: { 
                                time: new Date(thread.createdTimestamp), 
                                name: thread.name,
                            },
                            _: thread.id,
                        });
                    }
                }
            } catch (error) {
                console.log(`⚠️ Warning: Error processing forum ${forumId}: ${error}`);
            }
        }
        
        // Also check double star forum
        if (channelID_2StarVerificationForum) {
            try {
                const forum_channel = await client.channels.cache.get(channelID_2StarVerificationForum);
                if (forum_channel) {
                    const activeThreads = await forum_channel.threads.fetchActive();
                    var archivedThreads = [];
    
                    var before = undefined;
                    var hasMore = true;
    
                    while (hasMore) {
                        try {
                            const fetched = await forum_channel.threads.fetchArchived({ limit: 100, before });
                            archivedThreads = archivedThreads.concat(Array.from(fetched.threads.values()));
                            hasMore = fetched.threads.size === 100;
                            if (hasMore) {
                                before = fetched.threads.last().id;
                            }
                        } catch (error) {
                            console.log(`⚠️ Warning: Error fetching archived threads from 2Star forum: ${error}`);
                            hasMore = false;
                        }
                    }
    
                    const allThreads = [
                        ...activeThreads.threads.values(),
                        ...archivedThreads
                    ];
    
                    for (let thread of allThreads) {
                        // Check if post name contains no logo, in that case skip post
                        if (!thread.name.includes(text_verifiedLogo) && 
                           !thread.name.includes(text_notLikedLogo) && 
                           !thread.name.includes(text_waitingLogo) && 
                           !thread.name.includes(text_likedLogo) && 
                           !thread.name.includes(text_deadLogo)) {
                            continue;
                        }
    
                        data.root[attrib_eligibleGPs][0][attrib_eligibleGP].push({
                            $: { 
                                time: new Date(thread.createdTimestamp), 
                                name: thread.name,
                            },
                            _: thread.id,
                        });
    
                        if (thread.name.includes(text_verifiedLogo)) {
                            data.root[attrib_liveGPs][0][attrib_liveGP].push({
                                $: { 
                                    time: new Date(thread.createdTimestamp), 
                                    name: thread.name,
                                },
                                _: thread.id,
                            });
                        }
                    }
                }
            } catch (error) {
                console.log(`⚠️ Warning: Error processing 2Star forum: ${error}`);
            }
        }
// Get all ineligible posts in Webhook channel and add them
        try {
            const webhook_channel = await client.channels.cache.get(channelID_Webhook);
              
            let lastMessageID;
            let fetchMore = true;
          
            while (fetchMore) {
                const options = { limit: 100 };
                if (lastMessageID) {
                    options.before = lastMessageID;
                }
          
                const messages = await webhook_channel.messages.fetch(options);
          
                if (messages.size === 0) {
                    break;
                }
          
                messages.forEach(message => {
                    if (message.author.bot && message.content.toLowerCase().includes("invalid")) {
                        data.root[attrib_ineligibleGPs][0][attrib_ineligibleGP].push({
                            $: { 
                                time: new Date(message.createdTimestamp), 
                                name: message.content,
                            },
                            _: message.id,
                        });
                    }
                });
          
                // Update the last message ID to fetch the next batch
                lastMessageID = messages.last().id;
          
                // Stop fetching if fewer than 100 messages are returned
                if (messages.size < 100) {
                    fetchMore = false;
                }
            }
        } catch (error) {
            console.log(`⚠️ Warning: Error processing webhook channel: ${error}`);
        }

        const builder = new xml2js.Builder();
        const xmlOutput = builder.buildObject(data);
        writeFile(pathServerData, xmlOutput);

        console.log(text_Done);

        // Send Users Data on the GitGist
        if (outputUserDataOnGitGist) {
            try {
                const data = fs.readFileSync(pathUsersData, 'utf8');
                await updateGist(data, "UsersData");
            } catch (error) {
                console.log(`❌ ERROR trying to read file at ${pathUsersData}`);
            }            
        }

        await updateUserDataGPLive(client);
        
        // Update GP tracking list after updating server data
        await updateGPTrackingList(client);
    }
}

async function updateAntiCheat(client) {
    try {
        const recentAntiCheatMessages = (await getLastsAntiCheatMessages(client)).messages;

        if (recentAntiCheatMessages.length === Math.floor(30/antiCheatRate)) {
            const text_Start = `🛡️ AntiCheat Analyzing...`;
            const text_Done = `☑️🛡️ Finished AntiCheat Analyzing`;
            console.log(text_Start);

            var arrayUsernames = recentAntiCheatMessages.map(msg => msg.content).join(' ').split(",");

            const allUsers = await getActiveUsers();
            for (var i = 0; i < allUsers.length; i++) {
                var user = allUsers[i];
                var userID = getIDFromUser(user);
                const member = await getMemberByID(client, userID);

                // Skip if member does not exist
                if (member == "") {
                    console.log(`❗️ User ${userID} is not registered on this server`);
                    continue;
                }

                var userUsername = member.user.username;
                var userPrefix = await getUserAttribValue(client, userID, attrib_Prefix, "NoPrefixFound");
                var antiCheat_UserCount = 0;
                var antiCheat_UserNames = [];

                arrayUsernames.forEach(username => {
                    const normalizedUserPrefix = normalizeOCR(userPrefix).toUpperCase();
                    const normalizedUsername = normalizeOCR(username).toUpperCase();

                    if (normalizedUsername.startsWith(normalizedUserPrefix)) {
                        antiCheat_UserCount++;
                        antiCheat_UserNames.push(username);
                    }
                });

                await setUserAttribValue(userID, userUsername, attrib_AntiCheatUserCount, antiCheat_UserCount);
                // Debug Usernames
                // if(antiCheat_UserNames.length > 0){
                //     sendChannelMessage(client, "XXXXXXXXXXXXXXXXXXX", userUsername + "\n" + antiCheat_UserNames.join(', '));
                // }
            }

            console.log(text_Done);
        } 
        else {
            console.log(`🛡️🚫 AntiCheat is OFF`);
        }
    } catch (error) {
        console.log('❌ ERROR - Trying to Analyze for AntiCheat:\n' + error);
    }
}

async function updateUserDataGPLive(client) {
    const text_Start = `🟢 Updating GPLive UserData...`;
    const text_Done = `☑️🟢 Finished updating GPLive UserData`;
    console.log(text_Start);

    // Reset all user GP live counts
    setAllUsersAttribValue(attrib_GodPackLive, 0);

    try {
        var liveGPs = await getServerDataGPs(attrib_liveGPs);
        liveGPs = Array.isArray(liveGPs) ? liveGPs : [liveGPs];

        const liveGPArray = liveGPs.map(liveGP => ({
            time: liveGP.$.time,
            name: liveGP.$.name,
            id: liveGP._
        }));
    
        // Get all pack-specific forums
        const packForums = [
            channelID_MewtwoVerificationForum,
            channelID_CharizardVerificationForum,
            channelID_PikachuVerificationForum, 
            channelID_MewVerificationForum,
            channelID_DialgaVerificationForum,
            channelID_PalkiaVerificationForum,
            channelID_ArceusVerificationForum,
            channelID_ShiningVerificationForum,
            channelID_2StarVerificationForum
        ];

        // Process each live GP
        for (let i = 0; i < liveGPArray.length; i++) {
            const liveGP = liveGPArray[i];
            
            // Try to find this thread in any of the forums
            let threadFound = false;
            
            for (const forumId of packForums) {
                if (!forumId) continue;
                
                try {
                    const verificationChannel = await client.channels.cache.get(forumId);
                    if (!verificationChannel) continue;
                    
                    try {
                        const thread = await verificationChannel.threads.fetch(liveGP.id);
                        if (thread) {
                            // Found the thread, update user's GPLive count
                            await addUserDataGPLive(client, thread);
                            threadFound = true;
                            break;
                        }
                    } catch (error) {
                        // Thread not in this forum, continue searching
                    }
                } catch (error) {
                    console.log(`⚠️ Warning: Error accessing forum ${forumId}: ${error}`);
                }
            }
            
            if (!threadFound) {
                console.log(`⚠️ Warning: Could not find thread ${liveGP.id} in any forum channel`);
            }
        }

        console.log(text_Done);
    } catch (error) {
        console.log(`❌ ERROR - Failed to update UserData GPLive\n` + error);
    }
}
async function addUserDataGPLive(client, thread) {
    const initialMessage = await getOldestMessage(thread);
    var ownerID = splitMulti(initialMessage.content,['<@','>'])[1];
    
    const member = await getMemberByID(client, ownerID);
    if (member == "") {
        console.log(`❗️ Failed to update UserData GPLive of thread ID : ${thread.id}\nFor more info, check the ID in ServerData.xml`);
        return;
    }
    
    var GPLive = parseInt(await getUserAttribValue(client, ownerID, attrib_GodPackLive, 0));
    await setUserAttribValue(ownerID, member.user.username, attrib_GodPackLive, GPLive+1);
}

function incrementSelectedPacks(packCounter, selectedPacks, instanceCount) {
    const differentPacksAmount = selectedPacks.includes(",") ? Math.max(selectedPacks.split(",").length - 1, 0) : 1;
    const differentPacksUnit = instanceCount/differentPacksAmount;

    if (selectedPacks.toUpperCase().includes("MEWTWO")) {
        packCounter["GA_Mewtwo"] += differentPacksUnit;
    }
    if (selectedPacks.toUpperCase().includes("CHARIZARD")) {
        packCounter["GA_Charizard"] += differentPacksUnit;
    }
    if (selectedPacks.toUpperCase().includes("PIKACHU")) {
        packCounter["GA_Pikachu"] += differentPacksUnit;
    }
    if (selectedPacks.toUpperCase().includes("MEW")) {
        packCounter["MI_Mew"] += differentPacksUnit;
    }
    if (selectedPacks.toUpperCase().includes("DIALGA")) {
        packCounter["STS_Dialga"] += differentPacksUnit;
    }
    if (selectedPacks.toUpperCase().includes("PALKIA")) {
        packCounter["STS_Palkia"] += differentPacksUnit;
    }
    if (selectedPacks.toUpperCase().includes("ARCEUS")) {
        packCounter["TL_Arceus"] += differentPacksUnit;
    }
    if (selectedPacks.toUpperCase().includes("SHINING")) {
        packCounter["SR_Giratina"] += differentPacksUnit;
    }
}

async function getSelectedPacksEmbedText(client, activeUsers) {
    var packCounter = {
        GA_Mewtwo: 0,
        GA_Charizard: 0,
        GA_Pikachu: 0,
        MI_Mew: 0,
        STS_Dialga: 0,
        STS_Palkia: 0,
        TL_Arceus: 0,
        SR_Giratina: 0
    };

    for (var i = 0; i < activeUsers.length; i++) {
        var user = activeUsers[i];
        var userID = getIDFromUser(user);
        var userUsername = getUsernameFromUser(user);

        const selectedPacks = getAttribValueFromUser(user, attrib_SelectedPack, "");
        const hbInstances = getAttribValueFromUser(user, attrib_HBInstances, 0);
        incrementSelectedPacks(packCounter, selectedPacks, hbInstances);

        const userActiveSubsystems = await getUserActiveSubsystems(user);
        if (userActiveSubsystems != "") {
            for (let i = 0; i < userActiveSubsystems.length; i++) {
                const userActiveSubsystem = userActiveSubsystems[i];

                const selectedPacksSubsystems = getAttribValueFromUser(userActiveSubsystem, attrib_SelectedPack, "");
                const hbInstancesSubsystems = getAttribValueFromUser(userActiveSubsystem, attrib_HBInstances, 0);
                incrementSelectedPacks(packCounter, selectedPacksSubsystems, hbInstancesSubsystems);
            }
        }
    }

    for (var key in packCounter) {
        if (packCounter.hasOwnProperty(key)) {
            packCounter[key] = roundToOneDecimal(packCounter[key]);
        }
    }

    const emoji_GA_Mewtwo = findEmoji(client, GA_Mewtwo_CustomEmojiName, "🧠");
    const emoji_GA_Charizard = findEmoji(client, GA_Charizard_CustomEmojiName, "🔥");
    const emoji_GA_Pikachu = findEmoji(client, GA_Pikachu_CustomEmojiName, "⚡️");
    const emoji_MI_Mew = findEmoji(client, MI_Mew_CustomEmojiName, "🏝️");
    const emoji_STS_Dialga = findEmoji(client, STS_Dialga_CustomEmojiName, "🕒");
    const emoji_STS_Palkia = findEmoji(client, STS_Palkia_CustomEmojiName, "🌌");
    const emoji_TL_Arceus = findEmoji(client, TL_Arceus_CustomEmojiName, "💡");
    const emoji_SR_Giratina = findEmoji(client, SR_Giratina_CustomEmojiName, "✨");
    
    const text_mewtwo = `${packCounter["GA_Mewtwo"] > 0 ? `${emoji_GA_Mewtwo} ${formatNumberWithSpaces(packCounter["GA_Mewtwo"], 4)}` : "" }`;
    const text_charizard = `${packCounter["GA_Charizard"] > 0 ? `${emoji_GA_Charizard} ${formatNumberWithSpaces(packCounter["GA_Charizard"], 4)}` : "" }`;
    const text_pikachu = `${packCounter["GA_Pikachu"] > 0 ? `${emoji_GA_Pikachu} ${formatNumberWithSpaces(packCounter["GA_Pikachu"], 4)}` : "" }`;
    const text_mew = `${packCounter["MI_Mew"] > 0 ? `${emoji_MI_Mew} ${packCounter["MI_Mew"]}` : "" }`;
    const text_spaceSet1 = `${packCounter["GA_Mewtwo"] > 0 || packCounter["GA_Charizard"] > 0 || packCounter["GA_Pikachu"] > 0 || packCounter["MI_Mew"] > 0 ? `\n# ` : "" }`;
    const text_dialga = `${packCounter["STS_Dialga"] > 0 ? `${emoji_STS_Dialga} ${formatNumberWithSpaces(packCounter["STS_Dialga"], 4)}` : "" }`;
    const text_palkia = `${packCounter["STS_Palkia"] > 0 ? `${emoji_STS_Palkia} ${formatNumberWithSpaces(packCounter["STS_Palkia"], 4)}` : "" }`;
    const text_arceus = `${packCounter["TL_Arceus"] > 0 ? `${emoji_TL_Arceus} ${formatNumberWithSpaces(packCounter["TL_Arceus"], 4)}` : "" }`;
    const text_giratina = `${packCounter["SR_Giratina"] > 0 ? `${emoji_SR_Giratina} ${packCounter["SR_Giratina"]}` : "" }`;
    
    return `# ${text_mewtwo+text_charizard+text_pikachu+text_mew}${text_spaceSet1}${text_dialga+text_palkia+text_arceus+text_giratina}`;
}

export { 
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
    getSelectedPacksEmbedText,
    updateGPTrackingList  // Add this new export
};

