'use strict';

const Expected = require('./lib/expected');

/**
 * Creates and returns tracker wrapper
 *
 * @param [doneCb] callback to call when expected.done() was called
 * @returns {function}
 */
module.exports = (doneCb) => {
    const expected = new Expected();
    if (doneCb) {
        expected.promised.then(() => doneCb())
            .catch(err => doneCb(err));
    }
    return expected.expectWrapper;
};
