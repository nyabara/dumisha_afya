const { db } = require('@vercel/postgres');
const cron = require('node-cron');
const moment = require('moment-timezone');

async function updateJobStatuses() {
    const client = await db.connect();
    try {
        // Create the query with type cast
        const updateQuery = await client.sql`
            UPDATE jobs
            SET status = CASE
                WHEN endDate::date < CURRENT_DATE THEN 'Closed'
                ELSE 'Open'
            END;`;
        console.log(`Updated "jobs" status`);
        return {
            updateQuery
        };
    } catch (error) {
        console.error('Error updating status', error);
        throw error;
    } finally {
        await client.end();
    }
}

// Get the current time and add 2 minutes to it in Nairobi timezone
const now = moment().tz("Africa/Nairobi");
const futureTime = now.clone().add(30, 'seconds');
const minute = futureTime.second();
const hour = futureTime.hour();

console.log(`Current time: ${now.format('YYYY-MM-DD HH:mm:ss')}`);
console.log(`Scheduled time: ${futureTime.format('YYYY-MM-DD HH:mm:ss')}`);

// Create the cron expression for 2 minutes from now
const cronExpression = `${minute} ${hour} * * *`;
console.log(`Cron expression: ${cronExpression}`);

// Schedule the task to run 2 minutes from now
const scheduledTask = cron.schedule(cronExpression, async () => {
    console.log(`Executing cron job at ${moment().tz("Africa/Nairobi").format('YYYY-MM-DD HH:mm:ss')}`);
    try {
        await updateJobStatuses();
    } catch (error) {
        console.error('Error executing cron job', error);
    }
}, {
    scheduled: true,
    timezone: "Africa/Nairobi"
});

if (scheduledTask) {
    console.log('Cron job successfully scheduled.');
} else {
    console.log('Failed to schedule cron job.');
}

// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log(`Executing daily cron job at ${moment().tz("Africa/Nairobi").format('YYYY-MM-DD HH:mm:ss')}`);
    try {
        await updateJobStatuses();
    } catch (error) {
        console.error('Error executing daily cron job', error);
    }
}, {
    scheduled: true,
    timezone: "Africa/Nairobi" // e.g., "Africa/Nairobi"
});

async function main() {
    try {
        await updateJobStatuses();
    } catch (err) {
        console.error(
            'An error occurred while attempting to update the status:',
            err
        );
    }
}

main().catch((err) => {
    console.error(
        'An error occurred in the main function:',
        err
    );
});
