/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const { error, info, refresh, warn } = require('./client-log');

const { apply, check, status } = module.hot;
let latest = true;

const hmr = {
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted(data) {
    warn('Change in unaccepted module(s):');
    warn(data);
  },
  onDeclined(data) {
    warn('Change in declined module(s):');
    warn(data);
  },
  onErrored(data) {
    error('Error in module(s):');
    error(data);
  }
};

const replace = async (hash) => {
  if (hash) {
    // eslint-disable-next-line no-undef
    latest = hash.includes(__webpack_hash__);
  }

  if (!latest) {
    const hmrStatus = status();

    if (hmrStatus === 'abort' || hmrStatus === 'fail') {
      warn(`An HMR update was trigger, but ${hmrStatus}ed. ${refresh}`);
      return;
    }

    let modules = await check();

    if (!modules) {
      warn(`No modules found for replacement. ${refresh}`);
      return;
    }

    modules = await apply(hmr);

    if (modules) {
      latest = true;
      info('Modules replaced:');
      info(modules);
    }
  }
};

module.exports = { replace };