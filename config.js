// Your app Token, if you don't know it you can reset it here: https://discord.com/developers/applications > Your App > Bot > Reset Token
const token = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
// With Discord developer mode on, right-click your server and "Copy Server ID"
const guildID = "XXXXXXXXXXXXXXXXXXX";
// For all channelID below, right-click a channel in your Discord server and "Copy Server ID" with developer mode on
// THE ID OF THE DISCORD CHANNEL - Where ID list and AutoKick alerts are sent
const channelID_Commands = "XXXXXXXXXXXXXXXXXXX";
// THE ID OF THE DISCORD CHANNEL - Where statistics of users will be sent
const channelID_UserStats = "XXXXXXXXXXXXXXXXXXX";
// Pack specific forum channels - Each one must be a forum channel
const channelID_MewtwoVerificationForum = "XXXXXXXXXXXXXXXXXXX"; // Add your Mewtwo channel ID here
const channelID_CharizardVerificationForum = "XXXXXXXXXXXXXXXXXXX"; // Add your Charizard channel ID here
const channelID_PikachuVerificationForum = "XXXXXXXXXXXXXXXXXXX"; // Add your Pikachu channel ID here
const channelID_MewVerificationForum = "XXXXXXXXXXXXXXXXXXX"; // Add your Mew channel ID here
const channelID_DialgaVerificationForum = "XXXXXXXXXXXXXXXXXXX"; // Add your Dialga channel ID here
const channelID_PalkiaVerificationForum = "XXXXXXXXXXXXXXXXXXX"; // Add your Palkia channel ID here
const channelID_ArceusVerificationForum = "XXXXXXXXXXXXXXXXXXX"; // Add your Arceus channel ID here
const channelID_ShiningVerificationForum = "XXXXXXXXXXXXXXXXXXX"; // Add your Shining channel ID here
const channelID_SolgaleoVerificationForum = "XXXXXXXXXXXXXXXXXXX"; // Solgaleo channel ID
const channelID_LunalaVerificationForum = "XXXXXXXXXXXXXXXXXXX"; // Lunala channel ID
const channelID_BuzzwoleVerificationForum = "XXXXXXXXXXXXXXXXXXX"; // Buzzwole channel ID
// THE ID OF THE DISCORD CHANNEL - Where Double 2 Star validation threads will be created ⚠️ IT MUST BE A FORUM CHANNEL, look for Discord community server for more info
const channelID_2StarVerificationForum = "XXXXXXXXXXXXXXXXXXX";
// THE ID OF THE DISCORD CHANNEL - Where the Packs Webhooks is linked, better to be a separate channel from heartbeat webhook
const channelID_Webhook = "XXXXXXXXXXXXXXXXXXX"; 
// THE ID OF THE DISCORD CHANNEL - Where the Heartbeat Webhooks is linked, better to be a separate channel from packs webhook
const channelID_Heartbeat = "XXXXXXXXXXXXXXXXXXX";
// THE ID OF THE DISCORD CHANNEL - Where the AntiCheat pseudonyms are sent for analysis
const channelID_AntiCheat = "XXXXXXXXXXXXXXXXXXX";
// THE ID OF THE DISCORD CHANNEL - Where the GP tracking list will be posted
const channelID_GPTrackingList = "XXXXXXXXXXXXXXXXXXX"; // Update this to your desired channel ID
// Create a new fine-grained token for your GitHub account, and make sure to only check to read/write your Gists: https://github.com/settings/tokens
const gitToken = "github_pat_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
// Then, create a GitGist: https://gist.github.com/ and get its ID (the numbers in the URL).
const gitGistID = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
// And the GitGist Name based on the name you gave it
const gitGistGroupName = "DVServerIDFile";
// And the GitGist Name based on the name you gave it
const gitGistGPName = "EligibleGPs";

// =========================================== THREAD CREATION SETTINGS ===========================================
// Control whether threads are automatically created for different pack types
const createThreadsForGodPacks = false; // Set to false to disable thread creation for God Packs
const createThreadsForTradeableCards = false; // Set to false to disable thread creation for tradeable cards (Full Art, Rainbow, etc.)
const createThreadsForDoubleStars = false; // Set to false to disable thread creation for Double 2-Star packs

// If threads are disabled, you can still choose to log the findings to a specific channel
const logPackFindsToChannel = true; // Set to false to completely disable any pack find logging
const packFindsLogChannelID = "XXXXXXXXXXXXXXXXXXX"; // Channel where pack finds will be logged if threads are disabled (can be same as webhook channel)

// =========================================== RULES ===========================================
// Choose if you want the AntiCheat to be enabled or not, if yes then fill "channelID_AntiCheat" above
const AntiCheat = true;
// If you want your group to be able to add other people than themselves using /active @user 
const canPeopleAddOthers = true;
// If you want your group to be able to remove other people than themselves using /inactive @user 
const canPeopleRemoveOthers = true;
// If you want to output selected Packs in ids.txt, see Hoytdj patch note: https://github.com/hoytdj/PTCGPB/releases/tag/v1.5.4
const enableRoleBasedFilters = true;

// =========================================== AUTO KICK ===========================================
// Setting this to true will enable auto kick and kick players based on the other factors below
const AutoKick = true;
// Every X minutes divided by 2 it will alternate between sending user stats and checking for inactive people
// Example with a value of 10: 5min:InactivityCheck, 10min:UserStats, 15min:InactivityCheck, 20min:UserStats, etc...
var refreshInterval = 30;
// After how many minutes the user will be considered inactive (keep in mind that heartbeats are sent every 30min by default)
var inactiveTime = 61;
// At which number of instances users will be kicked, for a value of 1, users with 2 instances and above won't be kicked (Main is not counted as an instance)
var inactiveInstanceCount = 1;
// At which number of instances users will be kicked, for a value of 1, users below 1 pack per min will be kicked)
var inactivePackPerMinCount = 1;
// Kick instantly if it detects that Main is On AND Offline ⚠️ At this time there are false positives where Main could be considered offline but it has no issue in reality
var inactiveIfMainOffline = true;

// =========================================== LEECHING ===========================================
// Decide whether or not people can leech
const canPeopleLeech = true;
// Decide after how many GPs found people can be able to leech
const leechPermGPCount = 20;
// Decide after how many packs opened people can be able to leech
const leechPermPackCount = 50000;

// =========================================== GP STATS ===========================================
// Decide if you want your Server's Stats (GP stats) to be reset every 4 hours which could prevent some duplicated stuff in ServerData.xml 
const resetServerDataFrequently = true;
// Decide how frequently you want to Reset GP Stats, default is 4 hours (240min)
const resetServerDataTime = 240;
// 🔴 I highly recommend you leave the next one disabled, it can cause random crashes if running on low-end servers
// Upload UserData.xml to GitGist, "resetServerDataFrequently" also needs to be true for it to work
const outputUserDataOnGitGist = true;

// =========================================== GP TRACKING ===========================================
// How often to update the GP tracking list (in minutes)
const gpTrackingUpdateInterval = 30;
// Determine if updates should use cron schedule or interval-based updates
// true = use node-schedule with cron, false = use setInterval
const gpTrackingUseCronSchedule = true;

// =========================================== ELIGIBLE IDs ===========================================
// If some people in your group are running Min2Stars: 2 and some others 3, that flags all the GPs as 5/5 in the list to avoid auto removal bot from kicking 2/5 for those who are at Min2Stars: 3
const safeEligibleIDsFiltering = true; // true = all flagged as 5/5
const addDoubleStarToVipIdsTxt = true; // true = add double star pack account usernames to vip ids txt for GP Test Mode

// =========================================== FORCE SKIP ===========================================
// Allows you to bypass GP based on Packs Amount, Example: forceSkipMin2Stars 2 & forceSkipMinPacks 2 will 
// - not send to verification forum all GP [3P][2/5] [4P][2/5] [5P][2/5] and below 
// - send to verification forum all GP [1P][2/5] [2P][2/5] and above
const forceSkipMin2Stars = 2;
const forceSkipMinPacks = 2;

// =========================================== OTHER TIME SETTINGS ===========================================

// Decide after how much time you want the verification posts to automatically close, it'll be the time from the post creation, not the last activity
// Age of post before closing the post ⚠️ Closed Posts will be removed from the Eligible GPs / VIP IDs list
const AutoCloseLivePostTime = 96;//hours
const AutoCloseNotLivePostTime = 36;//hours
// No need to modify it except if you specifically changed it in the script
const heartbeatRate = 30;//minutes
// No need to modify it except if you specifically changed it in the script
const antiCheatRate = 3;//minutes
// Decide how frequently you want to Backup UserData, default is 30min
const backupUserDatasTime = 30;//minutes
// Delete some messages after X seconds (/active /inactive /refresh /forcerefresh) 0 = no delete
const delayMsgDeleteState = 10;//seconds

// =========================================== DISPLAY SETTINGS ===========================================
// Choose language
const EnglishLanguage = true;
// Do you want to show GP Lives per User in Stats
const showPerPersonLive = true;

// =========================================== OTHER SETTINGS ===========================================

// Number of /miss needed before a post is marked as dead, here it means 1pack=4miss, 2packs=6miss, 3packs=8miss, etc...
const missBeforeDead = [4,6,8,10,12];
// Multiply the Miss required when a post is flagged as NotLiked (ex: with a value of 0.5 a post with 8 miss required will switch to 4 miss)
const missNotLikedMultiplier = [0.5,0.5,0.5,0.75,0.85,1]; // Based on two stars Amount, ex: x0.85 for a [4/5]

// The average Min2Stars of the group on Arturo's bot, used to calculate the Potential Lives GP
const min2Stars = 0;//can be a floating number ex: 2.5
//What does your group run, it is used for AntiCheat
const groupPacksType = 5;// 5 for 5 packs, 3 for 3 packs

// =========================================== AESTHETICS ===========================================
// Icons of GP Validation
const text_verifiedLogo = "✅";
const text_likedLogo = "🔥";
const text_waitingLogo = "⌛";
const text_notLikedLogo = "🥶";
const text_deadLogo = "💀";

const leaderboardBestFarm1_CustomEmojiName = "Chadge"; // 🌟 if not found
const leaderboardBestFarm2_CustomEmojiName = "PeepoLove"; // ⭐️ if not found
const leaderboardBestFarm3_CustomEmojiName = "PeepoShy"; // ✨ if not found
const leaderboardBestFarmLength = 6; // Number of People showing in "Best Farmers"

const leaderboardBestVerifier1_CustomEmojiName = "Wicked"; // 🥇 if not found
const leaderboardBestVerifier2_CustomEmojiName = "PeepoSunglasses"; // 🥈 if not found
const leaderboardBestVerifier3_CustomEmojiName = "PeepoHappy"; // 🥉 if not found

const leaderboardWorstVerifier1_CustomEmojiName = "Bedge"; // 😈 if not found
const leaderboardWorstVerifier2_CustomEmojiName = "PeepoClown"; // 👿 if not found
const leaderboardWorstVerifier3_CustomEmojiName = "DinkDonk"; // 💀 if not found /!\ This is the worst one, it should be at the top but that helps for readability 

const GA_Mewtwo_CustomEmojiName = "mewtwo"; // 🧠 if not found, alternative: 🟣
const GA_Charizard_CustomEmojiName = "charizard"; // 🔥 if not found, alternative: 🟠
const GA_Pikachu_CustomEmojiName = "pikachu"; // ⚡️ if not found, alternative: 🟡
const MI_Mew_CustomEmojiName = "mew"; // 🏝️ if not found, alternative: 🟢
const STS_Dialga_CustomEmojiName = "dialga"; // 🕒 if not found, alternative: 🟦
const STS_Palkia_CustomEmojiName = "palkia"; // 🌌 if not found, alternative: 🟪
const TL_Arceus_CustomEmojiName = "arceus"; // 💡 if not found, alternative: 🟨
const SR_Giratina_CustomEmojiName = "lucario_shiny"; // ✨ if not found
const SM_Solgaleo_CustomEmojiName = "solgaleo"; // ☀️ if not found
const SM_Lunala_CustomEmojiName = "lunala"; // 🌙 if not found
const SV_Buzzwole_CustomEmojiName = "buzzwole"; // 💪 if not found

export {
    token,
    guildID,
    channelID_Commands,
    channelID_UserStats,
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
    channelID_2StarVerificationForum,
    channelID_Webhook,
    channelID_Heartbeat,
    channelID_AntiCheat,
    channelID_GPTrackingList,
    gitToken,
    gitGistID,
    gitGistGroupName,
    gitGistGPName,
    createThreadsForGodPacks,
    createThreadsForTradeableCards,
    createThreadsForDoubleStars,
    logPackFindsToChannel,
    packFindsLogChannelID,
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
    SV_Buzzwole_CustomEmojiName,
    outputUserDataOnGitGist,
    gpTrackingUpdateInterval,
    gpTrackingUseCronSchedule,
};