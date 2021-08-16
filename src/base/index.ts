global.process = global.process || {
  env: {
    NODE_ENV: "production",
  },
};

import "base/alert";
import "base/timers";
import "base/polyfill";
