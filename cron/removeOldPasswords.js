const {CronJob} = require('cron');
const dayjs = require('dayjs');
const OAuth = require('../dataBase/OAuth')
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

module.exports = new CronJob(
    '0,20,40 * * * * *',
    async function () {
        try{
            console.log(dayjs('11.11.2020').utc().toISOString())
            console.log('Start removing passwords')
            const yearAgo = dayjs().utc().subtract(1, 'year');
            await OAuth.deleteMany({createAt: { $lte: yearAgo}});
            console.log('End removing passwords')
        }catch (e) {
            console.log(e);
        }
    },
);