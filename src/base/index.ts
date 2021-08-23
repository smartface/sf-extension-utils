global.process = global.process || {
  env: {
    NODE_ENV: "production",
  },
};

import "./alert";
import "./timers";
import "./polyfill";
