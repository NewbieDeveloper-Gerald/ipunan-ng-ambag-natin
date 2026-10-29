const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
// Keep standalone builds stable on machines with limited RAM.
config.maxWorkers = 1;
module.exports = config;
