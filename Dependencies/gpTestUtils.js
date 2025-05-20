// gpTestUtils.js - Handle GP test functionality including NoShow logic
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enum for test states
export const TestState = {
    MISS: "MISS",
    NOSHOW: "NOSHOW"
};

// Map to keep DB connections cached
const dbConnections = new Map();

/**
 * Get a database connection for a specific guild
 * @param {string} guildId The guild ID
 * @returns {Promise<sqlite.Database>} The SQLite database connection
 */
async function getDBConnection(guildId) {
    if (dbConnections.has(guildId)) {
        return dbConnections.get(guildId);
    }

    const db = await open({
        filename: path.join(__dirname, '..', `gpp_test.db`),
        driver: sqlite3.Database
    });

    // Create table if it doesn't exist
    const tableName = `gpp_test_${guildId}`;
    await db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
        discord_id INTEGER,
        timestamp TIMESTAMP,
        gp_id INTEGER,
        name TEXT,
        open_slots INTEGER DEFAULT(-1),
        number_friends INTEGER DEFAULT(-1),
        PRIMARY KEY (discord_id, timestamp, gp_id)
    )`);

    dbConnections.set(guildId, db);
    return db;
}

/**
 * Calculate factorial
 * @param {number} n
 * @returns {number}
 */
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * Calculate combinations (n choose k)
 * @param {number} n Total number of items
 * @param {number} k Number of items to choose
 * @returns {number} Number of combinations
 */
function combinations(n, k) {
    // Handle edge cases
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    // Optimize calculation for large numbers
    if (k > n - k) {
        k = n - k;
    }
    
    // Calculate n choose k
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (n - (k - i));
        result /= i;
    }
    
    return Math.round(result);
}

/**
 * Compute the probability that a NoShow counts as a dud
 * @param {number} openSlots Number of open slots
 * @param {number} numberFriends Total number of friends
 * @returns {number} Probability (0.0 - 1.0)
 */
export function computeChanceNoshowAsDud(openSlots, numberFriends) {
    // Ensure minimum value for numberFriends
    if (numberFriends < 6) {
        numberFriends = 6;
    }
    
    // Handle edge cases
    if (openSlots < 0 || numberFriends < 0) {
        return 1.0;
    }
    if (openSlots >= numberFriends) {
        return 1.0;
    }
    if (numberFriends - (4 - openSlots) - 1 < openSlots) {
        return 1.0;
    }
    
    // Main calculation
    try {
        const numerator = combinations(numberFriends - (4 - openSlots) - 1, openSlots);
        const denominator = combinations(numberFriends - (4 - openSlots), openSlots);
        return 1.0 - (numerator / denominator);
    } catch (error) {
        console.error('Error in combinatorial calculation:', error);
        return 1.0; // Safe default
    }
}

/**
 * Calculate probability of godpack being alive based on tests
 * @param {string} guildId The guild ID
 * @param {string} godpackId The godpack ID
 * @returns {Promise<number>} Probability (0-100)
 */
export async function computeProb(guildId, godpackId) {
    const db = await getDBConnection(guildId);
    const tableName = `gpp_test_${guildId}`;
    
    // Get all tests for this godpack
    const allTests = await db.all(
        `SELECT * FROM ${tableName} WHERE gp_id = ?`, 
        godpackId
    );
    
    // Initialize probability calculation
    let probAlive = 1.0;
    const memberBaseChance = {};
    
    // Process each test
    for (const test of allTests) {
        // Initialize base chance if this is the first test for this user
        if (!memberBaseChance[test.discord_id]) {
            // Note: In your original code this uses godpack.pack_number
            // Since we don't have that directly, default to a reasonable value (e.g., 5)
            // You may need to adjust this based on your exact system
            memberBaseChance[test.discord_id] = 5;
        }
        
        // If user's chance is already 0, the whole GP probability is 0
        if (memberBaseChance[test.discord_id] <= 0) {
            return 0.0;
        }
        
        // Determine number of duds based on test type
        let numberDuds;
        if (test.name === TestState.MISS) {
            numberDuds = 1.0;
        } else if (test.name === TestState.NOSHOW) {
            numberDuds = computeChanceNoshowAsDud(test.open_slots, test.number_friends);
        }
        
        // Update probability
        probAlive = probAlive * 
            Math.max(memberBaseChance[test.discord_id] - numberDuds, 0.0) / 
            memberBaseChance[test.discord_id];
            
        // Update member's remaining chance
        memberBaseChance[test.discord_id] = memberBaseChance[test.discord_id] - numberDuds;
    }
    
    console.log(`Computed ${probAlive} chance of being alive with individual probabilities`, memberBaseChance);
    return probAlive * 100.0;
}

/**
 * Add a NoShow test for a godpack
 * @param {string} guildId The guild ID 
 * @param {string} godpackId The godpack ID
 * @param {string} userId The user's Discord ID
 * @param {number} openSlots Number of open slots
 * @param {number} numberFriends Total number of friends
 * @returns {Promise<number>} Updated probability
 */
export async function addNoShow(guildId, godpackId, userId, openSlots, numberFriends) {
    const db = await getDBConnection(guildId);
    const tableName = `gpp_test_${guildId}`;
    const timestamp = new Date().toISOString();
    
    // Insert NoShow record
    await db.run(
        `INSERT OR IGNORE INTO ${tableName} (discord_id, timestamp, gp_id, name, open_slots, number_friends)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, timestamp, godpackId, TestState.NOSHOW, openSlots, numberFriends]
    );
    
    // Compute and return updated probability
    return await computeProb(guildId, godpackId);
}

/**
 * Reset all tests for a user on a specific godpack
 * @param {string} guildId The guild ID
 * @param {string} godpackId The godpack ID
 * @param {string} userId The user's Discord ID
 * @returns {Promise<number>} Updated probability
 */
export async function resetTest(guildId, godpackId, userId) {
    const db = await getDBConnection(guildId);
    const tableName = `gpp_test_${guildId}`;
    
    // Delete all tests for this user and godpack
    await db.run(
        `DELETE FROM ${tableName} WHERE gp_id = ? AND discord_id = ?`,
        [godpackId, userId]
    );
    
    // Compute and return updated probability
    return await computeProb(guildId, godpackId);
}

/**
 * Add a Miss test for a godpack
 * @param {string} guildId The guild ID
 * @param {string} godpackId The godpack ID
 * @param {string} userId The user's Discord ID
 * @returns {Promise<number>} Updated probability
 */
export async function addMiss(guildId, godpackId, userId) {
    const db = await getDBConnection(guildId);
    const tableName = `gpp_test_${guildId}`;
    const timestamp = new Date().toISOString();
    
    // Insert Miss record
    await db.run(
        `INSERT OR IGNORE INTO ${tableName} (discord_id, timestamp, gp_id, name)
         VALUES (?, ?, ?, ?)`,
        [userId, timestamp, godpackId, TestState.MISS]
    );
    
    // Compute and return updated probability
    return await computeProb(guildId, godpackId);
}

/**
 * Get all tests for a specific godpack
 * @param {string} guildId The guild ID
 * @param {string} godpackId The godpack ID
 * @returns {Promise<Array>} Array of test objects
 */
export async function getTestsForGodpack(guildId, godpackId) {
    const db = await getDBConnection(guildId);
    const tableName = `gpp_test_${guildId}`;
    
    return await db.all(
        `SELECT * FROM ${tableName} WHERE gp_id = ?`,
        godpackId
    );
}

/**
 * Get a human-readable summary of tests for a godpack
 * @param {string} guildId The guild ID
 * @param {string} godpackId The godpack ID
 * @returns {Promise<string>} Formatted test summary
 */
export async function getTestSummary(guildId, godpackId) {
    const tests = await getTestsForGodpack(guildId, godpackId);
    
    if (tests.length === 0) {
        return "No tests recorded for this godpack.";
    }
    
    let summary = `**Test Summary for GodPack ${godpackId}:**\n\n`;
    
    // Group tests by user
    const testsByUser = {};
    for (const test of tests) {
        if (!testsByUser[test.discord_id]) {
            testsByUser[test.discord_id] = [];
        }
        testsByUser[test.discord_id].push(test);
    }
    
    // Generate summary for each user
    for (const userId in testsByUser) {
        summary += `**User <@${userId}>:**\n`;
        for (const test of testsByUser[userId]) {
            const timestamp = new Date(test.timestamp).toLocaleString();
            
            if (test.name === TestState.MISS) {
                summary += `  - MISS at ${timestamp}\n`;
            } else if (test.name === TestState.NOSHOW) {
                const dudChance = computeChanceNoshowAsDud(test.open_slots, test.number_friends);
                summary += `  - NOSHOW at ${timestamp} (Slots: ${test.open_slots}, Friends: ${test.number_friends}, Dud Chance: ${(dudChance * 100).toFixed(1)}%)\n`;
            }
        }
        summary += '\n';
    }
    
    // Calculate and add overall probability
    const prob = await computeProb(guildId, godpackId);
    summary += `\n**Overall probability: ${prob.toFixed(1)}%**`;
    
    return summary;
}

/**
 * Extract godpack ID from a message
 * @param {Object} message The Discord message
 * @returns {string|null} The godpack ID or null if not found
 */
export function extractGodpackIdFromMessage(message) {
    if (!message || !message.content) return null;
    
    // Try to find a pattern like "ID: 123456789" in the message
    const match = message.content.match(/ID:?\s*(\d+)/i);
    if (match && match[1]) {
        return match[1];
    }
    
    // If not found in the specific format, try using thread name
    if (message.channel && message.channel.isThread()) {
        // Look for numbers in brackets like [123456789]
        const threadNameMatch = message.channel.name.match(/\[(\d+)\]/);
        if (threadNameMatch && threadNameMatch[1]) {
            return threadNameMatch[1];
        }
    }
    
    // If nothing else works, use the message ID as a fallback
    return message.id;
}