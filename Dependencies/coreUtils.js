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
    SM_Solgaleo_CustomEmojiName,
    SM_Lunala_CustomEmojiName,
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
    else if (packType.includes("SOLGALEO")) { // Added for Solgaleo
        console.log("Routing to Solgaleo channel");
        return channelID_SolgaleoVerificationForum;
    }
    else if (packType.includes("LUNALA")) { // Added for Lunala
        console.log("Routing to Lunala channel");
        return channelID_LunalaVerificationForum;
    }
    else if (packType.includes("BUZZWOLE")) {
        console.log("Routing to Buzzwole channel");
        return channelID_BuzzwoleVerificationForum;
    }
    else {
        console.log(`No specific match for "${packType}", defaulting to Mewtwo channel`);
        return channelID_MewtwoVerificationForum;
    }
}
// This is an enhanced version of getUsersStats to create the format you want
async function getUsersStats(users, members, isAntiCheatOn) {
    const currentTime = new Date();
    var usersStats = [];

    // First collect all data to allow for sorting and additional calculations
    const userDataArray = [];
    
    for (const user of users) {
        try {
            const id = getIDFromUser(user);
            const username = getUsernameFromUser(user);
            let visibleUsername = username;
            
            // Match Discord display name
            const member = members.find(member => member.user.username === username);
            if (member) {
                visibleUsername = member.displayName;
            }
            
            // Gather basic user data
            const userState = getAttribValueFromUser(user, attrib_UserState, "inactive");
            const userActiveState = await refreshUserActiveState(user);
            const activeState = userActiveState[0];
            const inactiveTime = userActiveState[1];
            
            // Gather system stats
            const instancesSubsystems = getAttribValueFromUserSubsystems(user, attrib_HBInstances, 0);
            const sessionTimeSubsystems = getAttribValueFromUserSubsystems(user, attrib_SessionTime, 0);
            const sessionPacksSubsystems = getAttribValueFromUserSubsystems(user, attrib_SessionPacksOpened, 0);
            const lastHBTimeSubsystems = getAttribValueFromUserSubsystems(user, attrib_LastHeartbeatTime, 0);
            const diffPacksSinceLastHBSubsystems = getAttribValueFromUserSubsystems(user, attrib_DiffPacksSinceLastHB, 0);
            
            // Calculate aggregated stats
            var session_PacksSubsystems = 0;
            var total_PacksSinceLastHbSubsystems = 0;
            var total_PacksSubsystems = 0;
            var total_diffPacksSinceLastHBSubsystems = 0;
            var biggerSessionTimeSubsystems = 0;
            var activeSubsystemsCount = 0;
            
            for (let i = 0; i < lastHBTimeSubsystems.length; i++) {
                const diffHBSubsystem = (currentTime - new Date(lastHBTimeSubsystems[i])) / 60000;
                
                if (diffHBSubsystem < parseFloat(heartbeatRate+1)) { // If last HB less than Xmn then count instances and session time
                    biggerSessionTimeSubsystems = Math.max(biggerSessionTimeSubsystems, sessionTimeSubsystems[i]);
                    session_PacksSubsystems += parseFloat(sessionPacksSubsystems[i]);
                    total_diffPacksSinceLastHBSubsystems += parseFloat(diffPacksSinceLastHBSubsystems[i]);
                    activeSubsystemsCount++;
                }
                total_PacksSubsystems += parseFloat(sessionPacksSubsystems[i]);
            }
            
            // Get or calculate additional user stats
            let instances = await refreshUserRealInstances(user, activeState);
            let sessionTime = getAttribValueFromUser(user, attrib_SessionTime);
            sessionTime = roundToOneDecimal(parseFloat(Math.max(sessionTime, biggerSessionTimeSubsystems)));
            let sessionPackF = parseFloat(getAttribValueFromUser(user, attrib_SessionPacksOpened)) + session_PacksSubsystems;
            
            // Calculate packs/mn and packs/hour
            let diffPacksSinceLastHb = parseFloat(getAttribValueFromUser(user, attrib_DiffPacksSinceLastHB)) + total_diffPacksSinceLastHBSubsystems;
            let diffTimeSinceLastHb = parseFloat(getAttribValueFromUser(user, attrib_DiffTimeSinceLastHB, heartbeatRate));
            let avgPackMn = roundToOneDecimal(diffPacksSinceLastHb/diffTimeSinceLastHb);
            avgPackMn = isNaN(avgPackMn) || userState == "leech" ? 0 : avgPackMn;
            let avgPackHour = roundToOneDecimal(avgPackMn * 60);
            
            // Update packsPerMin in user data
            await setUserAttribValue(id, username, attrib_PacksPerMin, avgPackMn);
            
            // Get GP stats
            const totalPack = parseInt(getAttribValueFromUser(user, attrib_TotalPacksOpened));
            const sessionPackI = parseInt(getAttribValueFromUser(user, attrib_SessionPacksOpened)) + total_PacksSubsystems;
            const totalGodPack = parseInt(getAttribValueFromUser(user, attrib_GodPackFound));
            const avgGodPack = roundToOneDecimal(totalGodPack >= 1 ? (totalPack+sessionPackI)/totalGodPack : (totalPack+sessionPackI));
            const gpLive = parseInt(getAttribValueFromUser(user, attrib_GodPackLive, 0));
            
            // Get miss stats
            const totalMiss = parseInt(getAttribValueFromUser(user, attrib_TotalMiss, 0));
            const totalTime = parseFloat(getAttribValueFromUser(user, attrib_TotalTime, 0));
            const missPer24Hour = roundToOneDecimal((parseFloat(totalMiss) / (totalTime/60)) * 24);
            
            // Calculate time since last GP (if any)
            let timeSinceLastGP = null;
            if (totalGodPack > 0) {
                // This is a placeholder - you'd need to implement logic to actually track when GPs are found
                // For now I'll just use a random number of days
                const daysSinceLastGP = Math.floor(Math.random() * 30); // Replace with actual tracking
                timeSinceLastGP = `${daysSinceLastGP}d`;
            }
            
            // Get NoShow test data (placeholder - replace with actual implementation)
            const idNoShowTests = 0; // Replace with actual implementation
            const allNoShowTests = 0; // Replace with actual implementation
            const allMissTests = 0;   // Replace with actual implementation 
            
            // Last HB time calculation
            const lastHBTime = new Date(getAttribValueFromUser(user, attrib_LastHeartbeatTime, 0));
            const minutesSinceLastHB = roundToOneDecimal((currentTime - lastHBTime) / 60000);
            
            // Selected packs
            const selectedPacks = getAttribValueFromUser(user, attrib_SelectedPack, "");
            
            // Store all user data for sorting and display
            userDataArray.push({
                id,
                username,
                visibleUsername,
                userState,
                activeState,
                inactiveTime,
                instances,
                sessionTime,
                sessionPackF,
                avgPackMn,
                avgPackHour,
                totalPack,
                sessionPackI,
                totalGodPack,
                avgGodPack,
                gpLive,
                totalMiss,
                totalTime,
                missPer24Hour,
                minutesSinceLastHB,
                activeSubsystemsCount,
                selectedPacks,
                idNoShowTests,
                allNoShowTests,
                allMissTests,
                timeSinceLastGP
            });
        } catch (error) {
            console.error(`Error processing stats for user: ${getIDFromUser(user)}`, error);
        }
    }
// Sort users by active state and then by packs per minute
    userDataArray.sort((a, b) => {
        // First sort by active state
        if (a.activeState === "active" && b.activeState !== "active") return -1;
        if (a.activeState !== "active" && b.activeState === "active") return 1;
        
        // Then sort by user state (active, farm, leech, inactive)
        const stateOrder = { "active": 0, "farm": 1, "leech": 2, "inactive": 3 };
        if (stateOrder[a.userState] !== stateOrder[b.userState]) {
            return stateOrder[a.userState] - stateOrder[b.userState];
        }
        
        // Then sort by packs per minute (highest first)
        return b.avgPackMn - a.avgPackMn;
    });
    
    // Format each user's stats in a way similar to the screenshot
    for (const userData of userDataArray) {
        var userOutput = `\`\`\`ansi\n`;
        
        // Format username with status color and add timestamp if active
        let usernameWithTime = userData.visibleUsername;
        if (userData.activeState === "active") {
            const lastHBHours = Math.floor(userData.minutesSinceLastHB / 60);
            const lastHBMinutes = Math.floor(userData.minutesSinceLastHB % 60);
            if (lastHBHours > 0 || lastHBMinutes > 0) {
                usernameWithTime += `[${lastHBHours}h${lastHBMinutes}m]`;
            }
        }
        
        if (userData.userState == "active") {
            if (userData.activeState == "active") {
                userOutput += colorText(usernameWithTime, "green");
            }
            else if (userData.activeState == "waiting") {
                userOutput += colorText(usernameWithTime, "yellow") + " - started";
            }
            else { // Inactive
                if (userData.minutesSinceLastHB === 0 || isNaN(userData.minutesSinceLastHB)) {
                    userOutput += colorText(usernameWithTime, "red") + ` - ${colorText("Heartbeat issue","red")}`;
                }
                else {
                    const inactiveTimeRounded = Math.round(parseFloat(userData.inactiveTime));
                    userOutput += colorText(usernameWithTime, "red") + ` - inactive for ${colorText(inactiveTimeRounded,"red")}mn`;
                }
            }
        }
        else if (userData.userState == "farm") {
            userOutput += colorText(usernameWithTime, "cyan");
        }
        else if (userData.userState == "leech") {
            userOutput += colorText(usernameWithTime, "pink");
        }
        
        // Display instances
        const subsystemText = userData.activeSubsystemsCount > 0 ? `(${userData.instances}/${userData.activeSubsystemsCount})` : '';
        userOutput += ` | ${colorText(`${userData.instances} ${subsystemText} Instances`, "gray")}\n`;
        
        // Session stats with packs per hour       
        userOutput += `Session: ${colorText(userData.sessionTime, "cyan")}(${colorText(userData.avgPackHour, "cyan")}) pph`;
        userOutput += ` running ${colorText(userData.sessionTime + "m", "gray")} w/ ${colorText(userData.sessionPackF + " packs", "gray")} in last ${colorText("24H", "gray")}\n`;

        // Miss tests stats
        userOutput += `ID Miss Tests: ${colorText(userData.idNoShowTests, "cyan")} ID Noshow Tests: ${colorText(userData.allNoShowTests, "cyan")} All Miss Tests: ${colorText(userData.allMissTests, "cyan")}\n`;
        
        // Pack stats
        userOutput += `Packs: ${colorText(userData.totalPack, "cyan")} GP: ${colorText(userData.totalGodPack, "cyan")} Alive GP: ${colorText(userData.gpLive, "cyan")}\n`;
        
        // Time since last GP
        if (userData.timeSinceLastGP) {
            userOutput += `Time since last GP: ${colorText(userData.timeSinceLastGP, "cyan")}\n`;
        }
        
        userOutput += `\`\`\``;
        usersStats.push(userOutput);
    }
    
    return usersStats;
}
// Update the createEnhancedStatsEmbed function in coreUtils.js
async function createEnhancedStatsEmbed(activeUsers, allUsers) {
    const currentTime = new Date();
    
    // Calculate active users statistics
    activeUsers = await getActiveUsers(true, false); // Refresh users to get updated attributes
    const activeInstances = getAttribValueFromUsers(activeUsers, attrib_RealInstances, [0]);
    const instancesAmount = sumIntArray(activeInstances);
    const avginstances = roundToOneDecimal(instancesAmount / activeUsers.length);
    
    const globalPacksPerMin = getAttribValueFromUsers(activeUsers, attrib_PacksPerMin, [0]);
    const accumulatedPacksPerMin = sumFloatArray(globalPacksPerMin);
    const avgPacksPerMin = roundToOneDecimal(accumulatedPacksPerMin / activeUsers.length);
    
    // Calculate packs per hour for display
    const totalPacksPerHour = roundToOneDecimal(accumulatedPacksPerMin * 60);
    
    // Calculate session times
    const sessionTimes = getAttribValueFromUsers(activeUsers, attrib_SessionTime, [0]);
    const totalSessionTime = sumIntArray(sessionTimes);
    const avgSessionTime = roundToOneDecimal(totalSessionTime / activeUsers.length);
    
    // Calculate total time online over past 24h
    const last24Hours = new Date(currentTime.getTime() - (24 * 60 * 60 * 1000));
    let totalOnlineTime = 0;
    let totalPacksLast24h = 0;
    
    for (const user of activeUsers) {
        const lastHBTime = new Date(getAttribValueFromUser(user, attrib_LastHeartbeatTime, 0));
        if (lastHBTime > last24Hours) {
            const sessionTime = parseFloat(getAttribValueFromUser(user, attrib_SessionTime, 0));
            totalOnlineTime += sessionTime;
            
            // Count packs in last 24h
            const diffPacks = parseFloat(getAttribValueFromUser(user, attrib_DiffPacksSinceLastHB, 0));
            totalPacksLast24h += diffPacks;
        }
    }
    
    // Convert minutes to hours for better readability
    const totalOnlineHours = roundToOneDecimal(totalOnlineTime / 60);
    
    // Total server stats
    const totalServerPacks = sumIntArray(getAttribValueFromUsers(allUsers, attrib_TotalPacksOpened, [0]));
    const totalServerTime = sumIntArray(getAttribValueFromUsers(allUsers, attrib_TotalTime, [0]));
    
    // Calculate GP statistics
    const eligibleGPs = await getServerDataGPs(attrib_eligibleGPs);
    const ineligibleGPs = await getServerDataGPs(attrib_ineligibleGPs);
    const liveGPs = await getServerDataGPs(attrib_liveGPs);
    
    let eligibleGPCount = 0;
    let ineligibleGPCount = 0;
    let liveGPCount = 0;
    let weekEligibleGPCount = 0;
    let weekLiveGPCount = 0;
    let todayEligibleGPCount = 0;
    let todayLiveGPCount = 0;
    
    let totalGPCount = 0;
    let potentialLiveGPCount = 0;
    
    let weekLuck = 0;
    let totalLuck = 0;
    let todayLuck = 0;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    if (eligibleGPs != undefined) {
        eligibleGPCount = parseInt(eligibleGPs.length);
        
        eligibleGPs.forEach(eligibleGP => {
            const gpTime = getTimeFromGP(eligibleGP);
            if (gpTime > oneWeekAgo) weekEligibleGPCount++;
            if (gpTime > todayStart) todayEligibleGPCount++;
        });
        
        if (ineligibleGPs != undefined) {
            ineligibleGPCount = parseInt(ineligibleGPs.length);
            totalGPCount = eligibleGPCount + ineligibleGPCount;
            
            if (liveGPs != undefined) {
                liveGPCount = parseInt(liveGPs.length);
                
                liveGPs.forEach(liveGP => {
                    const gpTime = getTimeFromGP(liveGP);
                    if (gpTime > oneWeekAgo) weekLiveGPCount++;
                    if (gpTime > todayStart) todayLiveGPCount++;
                });
                
                if (weekEligibleGPCount > 0) {
                    weekLuck = roundToOneDecimal(weekLiveGPCount / weekEligibleGPCount * 100);
                }
                
                if (todayEligibleGPCount > 0) {
                    todayLuck = roundToOneDecimal(todayLiveGPCount / todayEligibleGPCount * 100);
                }
                
                if (liveGPCount > 0) {
                    totalLuck = roundToOneDecimal(liveGPCount / eligibleGPCount * 100);
                }
                
                if (!isNaN(totalLuck) && totalLuck > 0 && totalGPCount > 0) {
                    const potentialEligibleGPCount = eligibleGPCount + (ineligibleGPCount * min2Stars * 0.1);
                    potentialLiveGPCount = Math.round(potentialEligibleGPCount * (totalLuck/100));
                }
            }
        }
    }
    
    // Split into two embeds to avoid the 25 field limit
    // First embed with basic stats
    const statsEmbed1 = new EmbedBuilder()
        .setColor('#f02f7e')
        .setTitle('Summary')
        .addFields(
            // First row
            { name: '👥 Rerollers', value: `${activeUsers.length}`, inline: true },
            { name: '🔄 Instances', value: `${instancesAmount}`, inline: true },
            { name: '📊 Avg Inst/User', value: `${avginstances}`, inline: true },
            
            // Second row
            { name: '🔥 Pack/Min', value: `${roundToOneDecimal(accumulatedPacksPerMin)}`, inline: true },
            { name: '🔥 Pack/Hour', value: `${totalPacksPerHour}`, inline: true },
            { name: '📊 Avg PPM/User', value: `${avgPacksPerMin}`, inline: true },
            
            // Third row
            { name: '📊 Avg Session', value: `${avgSessionTime}mn`, inline: true },
            { name: '🕒 Online 24h', value: `${totalOnlineHours}h`, inline: true },
            { name: '📦 Packs 24h', value: `${formatNumbertoK(totalPacksLast24h)}`, inline: true },
            
            // Fourth row
            { name: '🃏 Total Packs', value: `${formatNumbertoK(totalServerPacks)}`, inline: true },
            { name: '🕓 Total Time', value: `${formatMinutesToDays(totalServerTime)}`, inline: true }
        );
    
// Second embed with godpack stats
    const statsEmbed2 = new EmbedBuilder()
        .setColor('#f02f7e')
        .setTitle('GodPack Stats')
        .addFields(
            // First row
            { name: '✅ Today Live', value: `${todayLiveGPCount}/${todayEligibleGPCount}`, inline: true },
            { name: '🍀 Today Luck', value: `${todayLuck}%`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            
            // Second row
            { name: '✅ Week Live', value: `${weekLiveGPCount}/${weekEligibleGPCount}`, inline: true },
            { name: '🍀 Week Luck', value: `${weekLuck}%`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            
            // Third row
            { name: '✅ Total Live', value: `${liveGPCount}/${eligibleGPCount}`, inline: true },
            { name: '🍀 Total Luck', value: `${totalLuck}%`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            
            // Fourth row
            { name: '☑️ Potential Live', value: `${potentialLiveGPCount}`, inline: true },
            { name: '📊 Total GP', value: `${totalGPCount}`, inline: true }
        );
    
    return [statsEmbed1, statsEmbed2];
}
async function getEnhancedSelectedPacksEmbedText(client, activeUsers) {
    var packCounter = {
        GA_Mewtwo: 0,
        GA_Charizard: 0,
        GA_Pikachu: 0,
        MI_Mew: 0,
        STS_Dialga: 0,
        STS_Palkia: 0,
        TL_Arceus: 0,
        SR_Giratina: 0,
        SM_Solgaleo: 0,
        SM_Lunala: 0,
        SV_Buzzwole: 0
    };
    
    // Track which users are rolling each pack type
    var packRollers = {
        GA_Mewtwo: [],
        GA_Charizard: [],
        GA_Pikachu: [],
        MI_Mew: [],
        STS_Dialga: [],
        STS_Palkia: [],
        TL_Arceus: [],
        SR_Giratina: [],
        SM_Solgaleo: [],
        SM_Lunala: [],
        SV_Buzzwole: [] 
    };

    // Process each user's pack selection
    for (var i = 0; i < activeUsers.length; i++) {
        var user = activeUsers[i];
        var userID = getIDFromUser(user);
        var userUsername = getUsernameFromUser(user);
        
        // Get display name from member if available
        const member = await getMemberByID(client, userID);
        const displayName = member ? member.displayName : userUsername;
        
        // Function to add user and instances to pack counters
        const addUserToPack = (packType, instances, userName) => {
            packCounter[packType] += instances;
            packRollers[packType].push({
                name: userName,
                instances: instances
            });
        };

        // Process main user packs
        const selectedPacks = getAttribValueFromUser(user, attrib_SelectedPack, "");
        const hbInstances = getAttribValueFromUser(user, attrib_HBInstances, 0);
        
        // Calculate instances per pack type
        const differentPacksAmount = selectedPacks.includes(",") ? Math.max(selectedPacks.split(",").length, 1) : 1;
        const instancesPerPack = hbInstances / differentPacksAmount;
        
        if (selectedPacks.toUpperCase().includes("MEWTWO")) {
            addUserToPack("GA_Mewtwo", instancesPerPack, displayName);
        }
        if (selectedPacks.toUpperCase().includes("CHARIZARD")) {
            addUserToPack("GA_Charizard", instancesPerPack, displayName);
        }
        if (selectedPacks.toUpperCase().includes("PIKACHU")) {
            addUserToPack("GA_Pikachu", instancesPerPack, displayName);
        }
        if (selectedPacks.toUpperCase().includes("MEW")) {
            addUserToPack("MI_Mew", instancesPerPack, displayName);
        }
        if (selectedPacks.toUpperCase().includes("DIALGA")) {
            addUserToPack("STS_Dialga", instancesPerPack, displayName);
        }
        if (selectedPacks.toUpperCase().includes("PALKIA")) {
            addUserToPack("STS_Palkia", instancesPerPack, displayName);
        }
        if (selectedPacks.toUpperCase().includes("ARCEUS")) {
            addUserToPack("TL_Arceus", instancesPerPack, displayName);
        }
        if (selectedPacks.toUpperCase().includes("SHINING")) {
            addUserToPack("SR_Giratina", instancesPerPack, displayName);
        }
        // Add checks for new packs
        if (selectedPacks.toUpperCase().includes("SOLGALEO")) {
            addUserToPack("SM_Solgaleo", instancesPerPack, displayName);
        }
        if (selectedPacks.toUpperCase().includes("LUNALA")) {
            addUserToPack("SM_Lunala", instancesPerPack, displayName);
        }
        if (selectedPacks.toUpperCase().includes("BUZZWOLE")) {
            addUserToPack("SV_Buzzwole", instancesPerPack, displayName);
        }

        // Process subsystems
        const userActiveSubsystems = await getUserActiveSubsystems(user);
        if (userActiveSubsystems != "") {
            for (let i = 0; i < userActiveSubsystems.length; i++) {
                const userActiveSubsystem = userActiveSubsystems[i];

                const selectedPacksSubsystems = getAttribValueFromUser(userActiveSubsystem, attrib_SelectedPack, "");
                const hbInstancesSubsystems = getAttribValueFromUser(userActiveSubsystem, attrib_HBInstances, 0);
                
                // Calculate instances per pack type for subsystem
                const differentPacksAmountSub = selectedPacksSubsystems.includes(",") ? 
                    Math.max(selectedPacksSubsystems.split(",").length, 1) : 1;
                const instancesPerPackSub = hbInstancesSubsystems / differentPacksAmountSub;
                
                if (selectedPacksSubsystems.toUpperCase().includes("MEWTWO")) {
                    addUserToPack("GA_Mewtwo", instancesPerPackSub, `${displayName} (sub)`);
                }
                if (selectedPacksSubsystems.toUpperCase().includes("CHARIZARD")) {
                    addUserToPack("GA_Charizard", instancesPerPackSub, `${displayName} (sub)`);
                }
                if (selectedPacksSubsystems.toUpperCase().includes("PIKACHU")) {
                    addUserToPack("GA_Pikachu", instancesPerPackSub, `${displayName} (sub)`);
                }
                if (selectedPacksSubsystems.toUpperCase().includes("MEW")) {
                    addUserToPack("MI_Mew", instancesPerPackSub, `${displayName} (sub)`);
                }
                if (selectedPacksSubsystems.toUpperCase().includes("DIALGA")) {
                    addUserToPack("STS_Dialga", instancesPerPackSub, `${displayName} (sub)`);
                }
                if (selectedPacksSubsystems.toUpperCase().includes("PALKIA")) {
                    addUserToPack("STS_Palkia", instancesPerPackSub, `${displayName} (sub)`);
                }
                if (selectedPacksSubsystems.toUpperCase().includes("ARCEUS")) {
                    addUserToPack("TL_Arceus", instancesPerPackSub, `${displayName} (sub)`);
                }
                if (selectedPacksSubsystems.toUpperCase().includes("SHINING")) {
                    addUserToPack("SR_Giratina", instancesPerPackSub, `${displayName} (sub)`);
                }
                // Add subsystem checks for new packs
                if (selectedPacksSubsystems.toUpperCase().includes("SOLGALEO")) {
                    addUserToPack("SM_Solgaleo", instancesPerPackSub, `${displayName} (sub)`);
                }
                if (selectedPacksSubsystems.toUpperCase().includes("LUNALA")) {
                    addUserToPack("SM_Lunala", instancesPerPackSub, `${displayName} (sub)`);
                }
                if (selectedPacksSubsystems.toUpperCase().includes("BUZZWOLE")) {
                    addUserToPack("SV_Buzzwole", instancesPerPackSub, `${displayName} (sub)`);
                }
            }
        }
    }

// Round all pack counts to one decimal place
    for (var key in packCounter) {
        if (packCounter.hasOwnProperty(key)) {
            packCounter[key] = roundToOneDecimal(packCounter[key]);
        }
    }

    // Sort each pack's rollers by number of instances (highest first)
    for (var key in packRollers) {
        if (packRollers.hasOwnProperty(key)) {
            packRollers[key].sort((a, b) => b.instances - a.instances);
        }
    }

    // Get emojis for each pack type
    const emoji_GA_Mewtwo = findEmoji(client, GA_Mewtwo_CustomEmojiName, "🧠");
    const emoji_GA_Charizard = findEmoji(client, GA_Charizard_CustomEmojiName, "🔥");
    const emoji_GA_Pikachu = findEmoji(client, GA_Pikachu_CustomEmojiName, "⚡️");
    const emoji_MI_Mew = findEmoji(client, MI_Mew_CustomEmojiName, "🏝️");
    const emoji_STS_Dialga = findEmoji(client, STS_Dialga_CustomEmojiName, "🕒");
    const emoji_STS_Palkia = findEmoji(client, STS_Palkia_CustomEmojiName, "🌌");
    const emoji_TL_Arceus = findEmoji(client, TL_Arceus_CustomEmojiName, "💡");
    const emoji_SR_Giratina = findEmoji(client, SR_Giratina_CustomEmojiName, "✨");
    const emoji_SM_Solgaleo = findEmoji(client, SM_Solgaleo_CustomEmojiName, "☀️");
    const emoji_SM_Lunala = findEmoji(client, SM_Lunala_CustomEmojiName, "🌙");
    const emoji_SV_Buzzwole = findEmoji(client, SV_Buzzwole_CustomEmojiName, "💪");
    
    // Create detailed description for each pack type
    let packDetails = "";
    
    // First generation packs (Mewtwo, Charizard, Pikachu, Mew)
    if (packCounter["GA_Mewtwo"] > 0) {
        packDetails += `${emoji_GA_Mewtwo} **Mewtwo:** ${packCounter["GA_Mewtwo"]} instances\n`;
        // Add top 3 rollers if there are any
        if (packRollers["GA_Mewtwo"].length > 0) {
            const topRollers = packRollers["GA_Mewtwo"].slice(0, 3);
            const rollerText = topRollers.map(roller => 
                `  • ${roller.name}: ${roundToOneDecimal(roller.instances)}`).join("\n");
            packDetails += `${rollerText}\n\n`;
        } else {
            packDetails += "\n";
        }
    }
    
    if (packCounter["GA_Charizard"] > 0) {
        packDetails += `${emoji_GA_Charizard} **Charizard:** ${packCounter["GA_Charizard"]} instances\n`;
        if (packRollers["GA_Charizard"].length > 0) {
            const topRollers = packRollers["GA_Charizard"].slice(0, 3);
            const rollerText = topRollers.map(roller => 
                `  • ${roller.name}: ${roundToOneDecimal(roller.instances)}`).join("\n");
            packDetails += `${rollerText}\n\n`;
        } else {
            packDetails += "\n";
        }
    }
    
    if (packCounter["GA_Pikachu"] > 0) {
        packDetails += `${emoji_GA_Pikachu} **Pikachu:** ${packCounter["GA_Pikachu"]} instances\n`;
        if (packRollers["GA_Pikachu"].length > 0) {
            const topRollers = packRollers["GA_Pikachu"].slice(0, 3);
            const rollerText = topRollers.map(roller => 
                `  • ${roller.name}: ${roundToOneDecimal(roller.instances)}`).join("\n");
            packDetails += `${rollerText}\n\n`;
        } else {
            packDetails += "\n";
        }
    }
    
    if (packCounter["MI_Mew"] > 0) {
        packDetails += `${emoji_MI_Mew} **Mew:** ${packCounter["MI_Mew"]} instances\n`;
        if (packRollers["MI_Mew"].length > 0) {
            const topRollers = packRollers["MI_Mew"].slice(0, 3);
            const rollerText = topRollers.map(roller => 
                `  • ${roller.name}: ${roundToOneDecimal(roller.instances)}`).join("\n");
            packDetails += `${rollerText}\n\n`;
        } else {
            packDetails += "\n";
        }
    }
    
    // Second generation packs (Dialga, Palkia, Arceus, Shining)
    if (packCounter["STS_Dialga"] > 0) {
        packDetails += `${emoji_STS_Dialga} **Dialga:** ${packCounter["STS_Dialga"]} instances\n`;
        if (packRollers["STS_Dialga"].length > 0) {
            const topRollers = packRollers["STS_Dialga"].slice(0, 3);
            const rollerText = topRollers.map(roller => 
                `  • ${roller.name}: ${roundToOneDecimal(roller.instances)}`).join("\n");
            packDetails += `${rollerText}\n\n`;
        } else {
            packDetails += "\n";
        }
    }
    
    if (packCounter["STS_Palkia"] > 0) {
        packDetails += `${emoji_STS_Palkia} **Palkia:** ${packCounter["STS_Palkia"]} instances\n`;
        if (packRollers["STS_Palkia"].length > 0) {
            const topRollers = packRollers["STS_Palkia"].slice(0, 3);
            const rollerText = topRollers.map(roller => 
                `  • ${roller.name}: ${roundToOneDecimal(roller.instances)}`).join("\n");
            packDetails += `${rollerText}\n\n`;
        } else {
            packDetails += "\n";
        }
    }
    
    if (packCounter["TL_Arceus"] > 0) {
        packDetails += `${emoji_TL_Arceus} **Arceus:** ${packCounter["TL_Arceus"]} instances\n`;
        if (packRollers["TL_Arceus"].length > 0) {
            const topRollers = packRollers["TL_Arceus"].slice(0, 3);
            const rollerText = topRollers.map(roller => 
                `  • ${roller.name}: ${roundToOneDecimal(roller.instances)}`).join("\n");
            packDetails += `${rollerText}\n\n`;
        } else {
            packDetails += "\n";
        }
    }
    
    if (packCounter["SR_Giratina"] > 0) {
        packDetails += `${emoji_SR_Giratina} **Shining:** ${packCounter["SR_Giratina"]} instances\n`;
        if (packRollers["SR_Giratina"].length > 0) {
            const topRollers = packRollers["SR_Giratina"].slice(0, 3);
            const rollerText = topRollers.map(roller => 
                `  • ${roller.name}: ${roundToOneDecimal(roller.instances)}`).join("\n");
            packDetails += `${rollerText}\n\n`;
        } else {
            packDetails += "\n";
        }
    }
    
    if (packCounter["SM_Solgaleo"] > 0) {
        packDetails += `${emoji_SM_Solgaleo} **Solgaleo:** ${packCounter["SM_Solgaleo"]} instances\n`;
        if (packRollers["SM_Solgaleo"].length > 0) {
            const topRollers = packRollers["SM_Solgaleo"].slice(0, 3);
            const rollerText = topRollers.map(roller => 
                `  • ${roller.name}: ${roundToOneDecimal(roller.instances)}`).join("\n");
            packDetails += `${rollerText}\n\n`;
        } else {
            packDetails += "\n";
        }
    }
    
    if (packCounter["SM_Lunala"] > 0) {
        packDetails += `${emoji_SM_Lunala} **Lunala:** ${packCounter["SM_Lunala"]} instances\n`;
        if (packRollers["SM_Lunala"].length > 0) {
            const topRollers = packRollers["SM_Lunala"].slice(0, 3);
            const rollerText = topRollers.map(roller => 
                `  • ${roller.name}: ${roundToOneDecimal(roller.instances)}`).join("\n");
            packDetails += `${rollerText}\n\n`;
        } else {
            packDetails += "\n";
        }
    }

    if (packCounter["SV_Buzzwole"] > 0) {
        packDetails += `${emoji_SV_Buzzwole} **Buzzwole:** ${packCounter["SV_Buzzwole"]} instances\n`;
        if (packRollers["SV_Buzzwole"].length > 0) {
            const topRollers = packRollers["SV_Buzzwole"].slice(0, 3);
            const rollerText = topRollers.map(roller => 
                `  • ${roller.name}: ${roundToOneDecimal(roller.instances)}`).join("\n");
            packDetails += `${rollerText}\n\n`;
        } else {
            packDetails += "\n";
        }
     }
    
    // If no packs are selected, provide a message
    if (packDetails === "") {
        packDetails = "No packs currently selected by any active users.";
    }
    
    return packDetails;
}
// Helper function to get heartbeat history for a specific attribute
// This needs to be implemented in your system - this is a placeholder
function getAttribValueFromUserHeartbeatHistory(user, attribute, defaultValue = []) {
    // In a real implementation, you would retrieve this from your storage
    // For now, we'll return a placeholder value
    const history = getAttribValueFromUser(user, attribute, defaultValue);
    return Array.isArray(history) ? history : [history];
}

// Add this function to create timeline stats for heartbeat data
async function createTimelineStats(client, days = 7) {
    // Calculate the date range
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Prepare data structure for daily stats
    const dailyStats = {};
    for (let i = 0; i <= days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        dailyStats[dateKey] = {
            activeUsers: 0,
            totalInstances: 0,
            totalPacks: 0,
            gpsFound: 0
        };
    }
    
    // Get all users to analyze their heartbeat data
    const allUsers = await getAllUsers();
    
    // Process each user's data
    for (const user of allUsers) {
        const userID = getIDFromUser(user);
        const sessionPacksHistory = getAttribValueFromUserHeartbeatHistory(user, attrib_SessionPacksOpened, []);
        const heartbeatTimesHistory = getAttribValueFromUserHeartbeatHistory(user, attrib_LastHeartbeatTime, []);
        const instancesHistory = getAttribValueFromUserHeartbeatHistory(user, attrib_HBInstances, []);
        
        // Skip users with no heartbeat history
        if (heartbeatTimesHistory.length === 0) continue;
        
        // Process each heartbeat entry
        for (let i = 0; i < heartbeatTimesHistory.length; i++) {
            const heartbeatTime = new Date(heartbeatTimesHistory[i]);
            
            // Skip entries outside our date range
            if (heartbeatTime < startDate || heartbeatTime > currentDate) continue;
            
            const dateKey = heartbeatTime.toISOString().split('T')[0];
            
            // Skip if date not in our range (shouldn't happen but just in case)
            if (!dailyStats[dateKey]) continue;
            
            // Update the stats for this day
            dailyStats[dateKey].activeUsers += 1;
            dailyStats[dateKey].totalInstances += parseInt(instancesHistory[i] || 0);
            
            // If this is the first heartbeat of the day for this user, count packs from session
            if (i === 0 || new Date(heartbeatTimesHistory[i-1]).toISOString().split('T')[0] !== dateKey) {
                dailyStats[dateKey].totalPacks += parseInt(sessionPacksHistory[i] || 0);
            }
            // Otherwise, only count pack difference
            else {
                const packDiff = Math.max(
                    parseInt(sessionPacksHistory[i] || 0) - parseInt(sessionPacksHistory[i-1] || 0), 
                    0
                );
                dailyStats[dateKey].totalPacks += packDiff;
            }
        }
    }
    
    // Get godpack data from server data
    const liveGPs = await getServerDataGPs(attrib_liveGPs);
    
    // Count GPs by date
    if (liveGPs && liveGPs.length) {
        for (const gp of liveGPs) {
            const gpTime = getTimeFromGP(gp);
            if (gpTime >= startDate && gpTime <= currentDate) {
                const dateKey = gpTime.toISOString().split('T')[0];
                if (dailyStats[dateKey]) {
                    dailyStats[dateKey].gpsFound += 1;
                }
            }
        }
    }
    
    // Create the embed with timeline stats
    const timelineEmbed = new EmbedBuilder()
        .setColor('#4b7bec')
        .setTitle(`Activity Timeline (Last ${days} Days)`)
        .setDescription('Daily activity statistics for the server');
    
    // Format the stats for each day
    let daysArray = Object.keys(dailyStats).sort(); // Sort dates chronologically
    
    // Group stats by time period
    let timelineText = '';
    const daysToShow = Math.min(days, 7); // Limit to 7 days to avoid too long messages
    
    for (let i = daysArray.length - daysToShow; i < daysArray.length; i++) {
        const dateKey = daysArray[i];
        const stats = dailyStats[dateKey];
        
        // Format date to be more readable
        const date = new Date(dateKey);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
        });
        
        // Create activity indicators based on stats
        const userIndicator = '👥'.repeat(Math.min(Math.floor(stats.activeUsers / 5) + 1, 5));
        const instanceIndicator = '🖥️'.repeat(Math.min(Math.floor(stats.totalInstances / 20) + 1, 5));
        const packIndicator = '📦'.repeat(Math.min(Math.floor(stats.totalPacks / 5000) + 1, 5));
        const gpIndicator = stats.gpsFound > 0 ? '✨'.repeat(Math.min(stats.gpsFound, 5)) : '❌';
        
        timelineText += `**${formattedDate}**\n`;
        timelineText += `Users: ${stats.activeUsers} ${userIndicator}\n`;
        timelineText += `Instances: ${stats.totalInstances} ${instanceIndicator}\n`;
        timelineText += `Packs: ${formatNumbertoK(stats.totalPacks)} ${packIndicator}\n`;
        timelineText += `GPs: ${stats.gpsFound} ${gpIndicator}\n\n`;
    }
    
    // Add fields for weekly summary
    let totalWeeklyUsers = 0;
    let totalWeeklyInstances = 0;
    let totalWeeklyPacks = 0;
    let totalWeeklyGPs = 0;
    
    for (const dateKey of daysArray) {
        totalWeeklyUsers = Math.max(totalWeeklyUsers, dailyStats[dateKey].activeUsers);
        totalWeeklyInstances += dailyStats[dateKey].totalInstances;
        totalWeeklyPacks += dailyStats[dateKey].totalPacks;
        totalWeeklyGPs += dailyStats[dateKey].gpsFound;
    }
    
    // Calculate averages
    const avgDailyInstances = roundToOneDecimal(totalWeeklyInstances / days);
    const avgDailyPacks = roundToOneDecimal(totalWeeklyPacks / days);
    
    timelineEmbed.setDescription(timelineText);
    timelineEmbed.addFields(
        { name: '📊 Period Summary', value: `${days} Days` },
        { name: '👥 Max Users', value: `${totalWeeklyUsers}`, inline: true },
        { name: '🖥️ Avg Instances/Day', value: `${avgDailyInstances}`, inline: true },
        { name: '📦 Avg Packs/Day', value: `${formatNumbertoK(avgDailyPacks)}`, inline: true },
        { name: '✨ Total GPs Found', value: `${totalWeeklyGPs}`, inline: true }
    );
    
    return timelineEmbed;
}
async function sendStats(client) {
    console.log("📝 Updating Stats...");
    
    const guild = await getGuild(client);

    // Clear previous messages in stats channel
    await bulkDeleteMessages(guild.channels.cache.get(channelID_UserStats), 50);

    // Fetch guild members
    const members = await guild.members.fetch();

    // Get active and all users
    var activeUsers = await getActiveUsers(true, true);
    const allUsers = await getAllUsers();
    
    // Exit if no active users
    if (activeUsers.length === 0) {
        guild.channels.cache.get(channelID_UserStats).send({
            content: "No active rerollers found. Use `/active` to add yourself to the list."
        });
        return;
    }

    // Check AntiCheat status
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
                console.log(`❗️ AntiCheat Verifier ID ${recentAntiCheatMessages.prefix} is not registered on this server`);
            } else {
                antiCheatVerifier = memberAntiCheatVerifier.displayName;
            }
        }
    }

    // Get stats for active users
    var activeUsersInfos = await getUsersStats(activeUsers, members, isAntiCheatOn);

    // Send channel headers
    const text_ServerStats = localize("Stats Serveur", "Server Stats");
    const text_UserStats = localize("Stats Rerollers Actifs", "Active Rerollers Stats");

    // ========================= SERVER STATS =========================
    const serverStatsHeader = `## ${text_ServerStats}:`;
    await guild.channels.cache.get(channelID_UserStats).send({ content: serverStatsHeader });
    
    // Create and send the enhanced stats embeds (now multiple)
    const statsEmbeds = await createEnhancedStatsEmbed(activeUsers, allUsers);
    
    // Send each embed separately
    for (const embed of statsEmbeds) {
        await guild.channels.cache.get(channelID_UserStats).send({ embeds: [embed] });
        await wait(1.5);
    }

    // ========================= SERVER RULES =========================
    var serverState = `\`\`\`ansi\n`;

    if (AntiCheat) {
        serverState += `🛡️ Anti-Cheat : ${isAntiCheatOn == true ? 
            colorText("ON","green") + colorText(` Verified by ${antiCheatVerifier}`, "gray") : colorText("OFF","red")}\n`;
    }
    serverState += `💤 Auto Kick : ${AutoKick == true ? colorText("ON","green") : colorText("OFF","red")}\n`;
    serverState += `🩸 Leeching : ${canPeopleLeech == true ? colorText("ON","green") : colorText("OFF","red")}\n`;

    serverState += `\`\`\``;

    await guild.channels.cache.get(channelID_UserStats).send({ content: serverState });
    await wait(1.5);

    // ========================= SELECTED PACKS =========================
    const packDetailsText = await getEnhancedSelectedPacksEmbedText(client, activeUsers);
    
    const embedSelectedPacks = new EmbedBuilder()
        .setColor('#f02f7e')
        .setTitle('Instances / Selected Packs')
        .setDescription(packDetailsText);

    await guild.channels.cache.get(channelID_UserStats).send({ embeds: [embedSelectedPacks] });
    await wait(1.5);

// ========================= USER STATS =========================
    await guild.channels.cache.get(channelID_UserStats).send({ content: `## ${text_UserStats}:` });
    
    // Send user stats in batches with delays to avoid rate limiting
    for (var i = 0; i < activeUsersInfos.length; i++) {
        const activeUsersInfo = activeUsersInfos[i];
        await guild.channels.cache.get(channelID_UserStats).send({ content: activeUsersInfo });
        await wait(1.5);
    }

    // ========================= LEADERBOARDS =========================
    // Only show leaderboards if there are enough users
    if (allUsers.length > 5) {
        // Create and send miss rate and farming leaderboards
        const [missLeaderboard, farmLeaderboard] = await createLeaderboards(client, allUsers);
        
        if (missLeaderboard) {
            const [bestMissEmbed, worstMissEmbed] = missLeaderboard;
            await guild.channels.cache.get(channelID_UserStats).send({ embeds: [bestMissEmbed] });
            await guild.channels.cache.get(channelID_UserStats).send({ embeds: [worstMissEmbed] });
        }
        
        if (farmLeaderboard) {
            await guild.channels.cache.get(channelID_UserStats).send({ embeds: [farmLeaderboard] });
        }
    }
    
    console.log("☑️📝 Done updating Stats");
}
// Helper function to create leaderboards
async function createLeaderboards(client, allUsers) {
    try {
        // Prepare arrays for miss rate and farming stats
        var missCountArray = [];
        var farmInfoArray = [];

        // Process all users to calculate their stats
        for (var i = 0; i < allUsers.length; i++) {
            var user = allUsers[i];
            var userID = getIDFromUser(user);
            var userUsername = getUsernameFromUser(user);
            const member = await getMemberByID(client, userID);

            var displayName = member ? member.displayName : userUsername;

            // Process miss rate stats
            const totalMiss = getAttribValueFromUser(user, attrib_TotalMiss, 0);
            const totalTime = getAttribValueFromUser(user, attrib_TotalTime, 0);
            const sessionTime = getAttribValueFromUser(user, attrib_SessionTime, 0);
            const totalTimeHour = (parseFloat(totalTime) + parseFloat(sessionTime)) / 60;
            var missPer24Hour = roundToOneDecimal((parseFloat(totalMiss) / totalTimeHour) * 24);
            missPer24Hour = isNaN(missPer24Hour) || missPer24Hour == Infinity ? 0 : missPer24Hour;

            // Only include users with miss data
            if (totalMiss > 0 && totalTime > 0) {
                missCountArray.push({ user: displayName, value: missPer24Hour });
            }
            
            // Process farming stats
            const totalTimeFarm = getAttribValueFromUser(user, attrib_TotalTimeFarm, 0);
            const totalPacksFarm = getAttribValueFromUser(user, attrib_TotalPacksFarm, 0);
            
            // Only include users with farming data
            if (totalTimeFarm > 0) {
                farmInfoArray.push({ 
                    user: displayName, 
                    packs: totalPacksFarm, 
                    time: totalTimeFarm,
                    ppm: roundToOneDecimal(totalPacksFarm / totalTimeFarm)
                });
            }
        }

        let bestMissEmbed = null;
        let worstMissEmbed = null;
        let farmEmbed = null;

        // Create farming leaderboard if there are enough entries
        if (farmInfoArray.length >= leaderboardBestFarmLength) {
            // Sort by farming time (highest first)
            farmInfoArray.sort((a, b) => b.time - a.time);
            
            var bestFarmersText = ``;

            for (let i = 0; i < Math.min(leaderboardBestFarmLength, farmInfoArray.length); i++) {
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

                const farmer = farmInfoArray[i];
                bestFarmersText += `${emoji_BestFarm} **${farmer.user}** - ${roundToOneDecimal(farmer.time/60)}h with ${farmer.packs} packs (${farmer.ppm} ppm)\n\n`;
            }

            farmEmbed = new EmbedBuilder()
                .setColor('#39d1bf') 
                .setTitle('Best Farmers')
                .setDescription(bestFarmersText);
        }

        // Create miss rate leaderboards if there are enough entries
        if (missCountArray.length >= 6) {
            const emoji_BestVerifier1 = findEmoji(client, leaderboardBestVerifier1_CustomEmojiName, "🥇");
            const emoji_BestVerifier2 = findEmoji(client, leaderboardBestVerifier2_CustomEmojiName, "🥈");
            const emoji_BestVerifier3 = findEmoji(client, leaderboardBestVerifier3_CustomEmojiName, "🥉");

            const emoji_WorstVerifier1 = findEmoji(client, leaderboardWorstVerifier1_CustomEmojiName, "😈");
            const emoji_WorstVerifier2 = findEmoji(client, leaderboardWorstVerifier2_CustomEmojiName, "👿");
            const emoji_WorstVerifier3 = findEmoji(client, leaderboardWorstVerifier3_CustomEmojiName, "💀");

            // Sort by highest miss rate first (worst verifiers)
            missCountArray.sort((a, b) => b.value - a.value);
            var worstMissCountsText = `
${emoji_WorstVerifier3} **${missCountArray[0].user}** - ${missCountArray[0].value} miss / 24h\n\n
${emoji_WorstVerifier2} **${missCountArray[1].user}** - ${missCountArray[1].value} miss / 24h\n\n
${emoji_WorstVerifier1} **${missCountArray[2].user}** - ${missCountArray[2].value} miss / 24h
            `; //no tabs to avoid phone weird spacing

            // Sort by lowest miss rate first (best verifiers)
            missCountArray.sort((a, b) => a.value - b.value);
            var bestMissCountsText = `
${emoji_BestVerifier1} **${missCountArray[0].user}** - ${missCountArray[0].value} miss / 24h\n\n
${emoji_BestVerifier2} **${missCountArray[1].user}** - ${missCountArray[1].value} miss / 24h\n\n
${emoji_BestVerifier3} **${missCountArray[2].user}** - ${missCountArray[2].value} miss / 24h
            `; //no tabs to avoid phone weird spacing

            bestMissEmbed = new EmbedBuilder()
                .setColor('#5cd139')
                .setTitle('Best Verifiers')
                .setDescription(bestMissCountsText);

            worstMissEmbed = new EmbedBuilder()
                .setColor('#d13939')
                .setTitle('Bottom Verifiers')
                .setDescription(worstMissCountsText);
        }

        return [
            bestMissEmbed && worstMissEmbed ? [bestMissEmbed, worstMissEmbed] : null,
            farmEmbed
        ];
    } catch (error) {
        console.error('Error creating leaderboards:', error);
        return [null, null];
    }
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

// GP Tracking List Function (Updated for Solgaleo and Lunala)
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
        channelID_ShiningVerificationForum,
        channelID_SolgaleoVerificationForum,
        channelID_LunalaVerificationForum,
        channelID_BuzzwoleVerificationForum
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
                else if (forumId === channelID_SolgaleoVerificationForum) packType = "Solgaleo";
                else if (forumId === channelID_LunalaVerificationForum) packType = "Lunala";
                else if (forumId === channelID_BuzzwoleVerificationForum) packType = "Buzzwole";
                
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
async function updateInactiveGPs(client) {
    const text_Start = `🔍 Checking Inactive GPs...`;
    const text_Done = `☑️🔍 Finished checking Inactive GPs`;
    console.log(text_Start);
    
    // Get all pack-specific forums - add the new channels here
    const packForums = [
        channelID_MewtwoVerificationForum,
        channelID_CharizardVerificationForum,
        channelID_PikachuVerificationForum, 
        channelID_MewVerificationForum,
        channelID_DialgaVerificationForum,
        channelID_PalkiaVerificationForum,
        channelID_ArceusVerificationForum,
        channelID_ShiningVerificationForum,
        channelID_SolgaleoVerificationForum, // Added for Solgaleo
        channelID_LunalaVerificationForum    // Added for Lunala
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
async function updateEligibleIDs(client) {
    const text_Start = `📜 Updating Eligible IDs...`;
    const text_Done = `☑️📜 Finished updating Eligible IDs`;
    console.log(text_Start);

    // Get all pack-specific forums - add the new channels here
    const packForums = [
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
            channelID_ShiningVerificationForum,
            channelID_SolgaleoVerificationForum,
            channelID_LunalaVerificationForum,
            channelID_BuzzwoleVerificationForum
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
            channelID_SolgaleoVerificationForum,
            channelID_LunalaVerificationForum,
            channelID_BuzzwoleVerificationForum,
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
// Create forum post and manage tags
async function createForumPost(client, message, channelID, gpType, titleName, userID, accountID, packAmount, packType) {
    try {
        const guild = client.guilds.cache.first();
        const channel = guild.channels.cache.get(channelID);

        if (!channel) {
            console.log(`❌ Channel ${channelID} not found`);
            return;
        }

        console.log(`📝 Creating forum post in channel: ${channel.name}`);

        // Get image URL from webhook message
        let imageUrl = "";
        if (message.attachments && message.attachments.size > 0) {
            imageUrl = message.attachments.first().url;
        } else if (message.embeds && message.embeds.length > 0 && message.embeds[0].image) {
            imageUrl = message.embeds[0].image.url;
        }

        // Backup database before operations
        await backupFile(pathUsersData);

        // Get active users for tag management
        const activeUsers = await getActiveUsers(false, true);
        const activeUserIDs = getIDFromUsers(activeUsers);

        console.log(`👥 Found ${activeUserIDs.length} active users`);

        // Determine tags based on user state and pack type
        let availableTags = [];
        let autoApplyTags = [];

        if (channel.availableTags && channel.availableTags.length > 0) {
            availableTags = channel.availableTags;
            console.log(`🏷️ Available tags: ${availableTags.map(tag => tag.name).join(', ')}`);

            // Auto-apply pack type tag if it exists
            const packTypeTag = availableTags.find(tag => 
                tag.name.toLowerCase().includes(packType.toLowerCase())
            );
            if (packTypeTag) {
                autoApplyTags.push(packTypeTag.id);
                console.log(`🏷️ Auto-applying pack type tag: ${packTypeTag.name}`);
            }

            // Check if user is active and apply appropriate tags
            if (activeUserIDs.includes(userID)) {
                console.log(`✅ User ${userID} is active`);
                
                // Find "Active" tag
                const activeTag = availableTags.find(tag => 
                    tag.name.toLowerCase() === 'active' || 
                    tag.name.toLowerCase() === 'actif'
                );
                if (activeTag) {
                    autoApplyTags.push(activeTag.id);
                    console.log(`🏷️ Auto-applying active tag: ${activeTag.name}`);
                }
            } else {
                console.log(`❌ User ${userID} is not active`);
                
                // Find "Inactive" tag
                const inactiveTag = availableTags.find(tag => 
                    tag.name.toLowerCase() === 'inactive' || 
                    tag.name.toLowerCase() === 'inactif'
                );
                if (inactiveTag) {
                    autoApplyTags.push(inactiveTag.id);
                    console.log(`🏷️ Auto-applying inactive tag: ${inactiveTag.name}`);
                }
            }
        }

        // Create metadata line with proper handling for tradeable cards
        // Keep metadata short to avoid Discord's 2000 character limit
        let baseContent;
        if (accountID === "NOTRADEID") {
            baseContent = `Source: ${message.url}\nTradeable Card - No Friend ID\n\n`;
        } else {
            baseContent = `Source: ${message.url}\nID:${accountID}\n\n`;
        }
        
        // Only add image URL if the total length stays under 1800 chars (leaving buffer)
        const text_metadataLine = baseContent.length + imageUrl.length < 1800 
            ? baseContent.replace('\n\n', `\n${imageUrl}\n\n`)
            : baseContent;

        // Create the forum post
        const forumPost = await channel.threads.create({
            name: titleName,
            message: {
                content: text_metadataLine
            },
            appliedTags: autoApplyTags.length > 0 ? autoApplyTags : undefined
        });

        console.log(`✅ Created forum post: ${forumPost.name} (ID: ${forumPost.id})`);

        // Wait a moment for the thread to be fully created
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Post appropriate message based on account ID type
        if (accountID == "0000000000000000" || accountID == "NOTRADEID") {
            if (accountID == "NOTRADEID") {
                // For tradeable cards, this is expected
                const text_tradeableCard = localize(
                    "🎴 **Carte échangeable** - Aucun ID d'ami requis pour ce type de carte",
                    "🎴 **Tradeable Card** - No friend ID required for this card type"
                );
                await guild.channels.cache.get(forumPost.id).send({
                    content: text_tradeableCard
                });
            } else {
                // For God Packs with missing ID
                const text_incorrectID = localize(
                    "L'ID du compte est incorrect :\n- Injecter le compte pour retrouver l'ID\n- Reposter le GP dans le webhook avec l'ID entre parenthèse\n- Faites /removegpfound @LaPersonneQuiLaDrop\n- Supprimer ce post",
                    "The account ID is incorrect:\n- Inject the account to find the ID\n- Repost the GP in the webhook with the ID in parentheses\n- Do /removegpfound @UserThatDroppedIt\n- Delete this post"
                );
                await guild.channels.cache.get(forumPost.id).send({
                    content: `# ⚠️ ${text_incorrectID}`
                });
            }
        } else {
            // For valid account IDs, post the normal account ID message
            await guild.channels.cache.get(forumPost.id).send({
                content: `${accountID} is the id of the account\n-# You can copy paste this message in PocketTCG to look for this account`
            });
        }

        // Update user stats if not a tradeable card
        if (accountID !== "NOTRADEID") {
            try {
                // Increment user's total God Pack count
                const currentGPCount = await getUserAttribValue(client, userID, attrib_GodPackFound, 0);
                const newGPCount = parseInt(currentGPCount) + 1;
                
                await setUserAttribValue(userID, (await client.users.fetch(userID)).username, attrib_GodPackFound, newGPCount);
                console.log(`📊 Updated GP count for user ${userID}: ${newGPCount}`);

                // Add to server data tracking
                await addServerGP(attrib_eligibleGP, forumPost);
                console.log(`📊 Added GP to server tracking`);

            } catch (error) {
                console.error("❌ Error updating user stats:", error);
            }
        } else {
            console.log(`📊 Skipping stats update for tradeable card`);
        }

        // Send notification if notifications are enabled
        if (notificationsEnabled) {
            try {
                const user = await client.users.fetch(userID);
                const userMention = `<@${userID}>`;
                
                let notificationContent;
                if (accountID === "NOTRADEID") {
                    const text_notificationTradeable = localize(
                        `🎉 ${userMention} a trouvé une carte échangeable ${gpType} dans ${packAmount} pack(s) !`,
                        `🎉 ${userMention} found a tradeable ${gpType} card in ${packAmount} pack(s)!`
                    );
                    notificationContent = `${text_notificationTradeable}\n📍 ${forumPost.url}`;
                } else {
                    const text_notification = localize(
                        `🎉 ${userMention} a trouvé un God Pack ${gpType} dans ${packAmount} pack(s) !`,
                        `🎉 ${userMention} found a ${gpType} God Pack in ${packAmount} pack(s)!`
                    );
                    notificationContent = `${text_notification}\n📍 ${forumPost.url}`;
                }

                const notificationChannel = guild.channels.cache.get(notificationChannelID);
                if (notificationChannel) {
                    await notificationChannel.send({
                        content: notificationContent
                    });
                    console.log(`📢 Sent notification to ${notificationChannel.name}`);
                } else {
                    console.log(`❌ Notification channel ${notificationChannelID} not found`);
                }
            } catch (error) {
                console.error("❌ Error sending notification:", error);
            }
        }

        return forumPost;

    } catch (error) {
        console.error("❌ Error creating forum post:", error);
        throw error;
    }
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
// Now export all the functions for use in other modules
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
    updateGPTrackingList,
    createEnhancedStatsEmbed,
    getEnhancedSelectedPacksEmbedText,
    createTimelineStats,
    createLeaderboards
};