const pool = require('../helpers/db.js');

/* record_time is given with format "MM:SS:SSS", 
   so the whole time needs to be converted to milliseconds
   to help sorting the times */
const parseTimeToMilliseconds = (timeString) => {
    // Regular expression to match time in the given format, eg."01:07:23.122" -> 4 groups (hour, min, sec, ms)
    const regex = /^(\d{1,2}:)?(\d{1,2}):(\d{2})[.:](\d{1,3})$/; // accepts either HH:MM:SS.SSS or MM:SS.SSS
    const match = timeString.match(regex); // applaying regex to given parameter to extract time into separate parts
        if (!match) return null; // if input doesn't match
    // converting to integers 
    const hours = match[1] ? parseInt(match[1].replace(':', ''), 10) : 0;       
    const minutes = parseInt(match[2], 10); // takes minutes from the time as first group (substring), base is decimal (10)
    const seconds = parseInt(match[3], 10); // seconds as second group
    const milliseconds = parseInt(match[4], 10); // milliseconds as third group

    // check of correct formats
    if (minutes > 59 || seconds > 59 || milliseconds > 999) return null;

    // calculating everything into milliseconds
    return (hours * 3600000) + (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
}

const formatMillisecondsToTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / 3600000); // calcultaing full hours (1 h has 3 600 000 milliseconds)
    const minutes = Math.floor((milliseconds % 3600000) / 60000); // calculating full minutes (1 min has 60000 seconds)
    const seconds = Math.floor((milliseconds % 60000) / 1000); // remainder from full minutes is calculated by 1000 since i second has 1000 ms
    const ms = milliseconds % 1000; // leftover milliseconds 

    const timeStr = [
        hours > 0 ? String(hours) : null, // add hours only if they are included in the input
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
    ].filter(Boolean).join(':')
    // finally padding milliseconds with leading zeros if needed       
    return `${timeStr}.${String(ms).padStart(3, '0')}`
};

const getWRHistory = async (categoryId) => {
    try {
        const result = await pool.query(
        // combining runner info from the world_records table with linked username from users table
        'SELECT wr.runner_name, wr.record_time, wr.record_date, u.username FROM world_records wr JOIN users u ON wr.user_id = u.user_id WHERE wr.category_id = $1 ORDER BY wr.record_time ASC',  
        [categoryId]
        );
    // loop through each row and transforms new format (if needed)
    // record_time is parsed from string format back to milliseconds and then formatted back to "MM:SS.SSS"
    return result.rows.map(row => ({
        runner_name: row.runner_name,
        record_time: formatMillisecondsToTime(parseTimeToMilliseconds(row.record_time)),
        record_date: row.record_date,
        username: row.username
    }));
    } catch (error) {
        console.error("Error fetching WR history:", error);
        throw new Error("Failed to fetch WR history");
    }
};

module.exports = { getWRHistory, parseTimeToMilliseconds };