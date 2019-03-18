var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test')
{
    var config = require('./config.json'); // Will automatically config into object file
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {   // Get all the keys and set the process env with the values by the key
        process.env[key] = envConfig[key];
    });
}
