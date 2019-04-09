global.process = global.process || {
    env: {
        NODE_ENV: "production"
    }
};

require("./alert");
require("./timers");
require("./polyfill");
