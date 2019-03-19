const moment = require('moment-timezone');

let convertUtcToRegionTime = (datetime, region, format) => {
    const result = (moment(datetime).tz(region)).format(format);
    return result;
}

module.exports = {
    convertUtcToRegionTime
}