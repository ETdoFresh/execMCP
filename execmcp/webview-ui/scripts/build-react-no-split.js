const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

// Disable code splitting
config.optimization.splitChunks = {
    cacheGroups: {
        default: false,
    },
};

// Disable the runtime chunk
config.optimization.runtimeChunk = false;
