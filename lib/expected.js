'use strict';

const expect = require('chai').expect;
const AssertionError = require('assertion-error');

/**
 * @extends Promise
 */
class Expected {
    constructor() {
        this.promised = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this._done = false;
        this.expectCalls = new Map();
        // default is always setup
        this.atLeast(1);

        // setup wrapper function here so it will have 'this' bound to this object
        const expectWrapper = (val, message, named = 'default') => {
            this.recordExpectCalled(named);
            return expect(val, message);
        };
        // exposed methods
        expectWrapper.atLeast = (min, named) => {
            this.between(min, null, named);
            return expectWrapper;
        };
        expectWrapper.atMost = (max, named) => {
           this.between(null, max, named);
           return expectWrapper;
        };
        expectWrapper.exact = (num, named) => {
           this.between(num, num, named);
           return expectWrapper;
        };
        expectWrapper.between = (min, max, named) => {
            this.between(min, max, named);
            return expectWrapper;
        };
        expectWrapper.done = this.done.bind(this);
        this.expectWrapper = expectWrapper;
    }

    recordExpectCalled(named) {
        if (!this.expectCalls.has(named)) {
            throw new AssertionError(`No expectations set for "${named}" named expect() call`, {
                actual: named,
            }, this.expectWrapper);
        }

        this.expectCalls.get(named).actual = this.expectCalls.get(named).actual + 1;
    }

    assertExpectConstraints() {
        this.expectCalls.forEach((value, key) => {
            if(value.min && value.actual < value.min) {
                const msg = key === 'default'
                    ? `Expected at least ${value.min} expect() calls`
                    : `Expected at least ${value.min} ${key} named expect() calls`;
                throw new AssertionError(msg, {
                    actual: value.actual,
                    expected: value.min,
                    operator: '>=',
                    showDiff: true,
                }, this.done);
            }
            this.done || console.log('foo');
            if(value.max && value.actual > value.max) {
                const msg = key === 'default'
                    ? `Expected at most ${value.max} expect() calls`
                    : `Expected at most ${value.max} ${key} named expect() calls`;
                throw new AssertionError(msg, {
                    actual: value.actual,
                    expected: value.max,
                    operator: '<=',
                    showDiff: true,
                }, this.done);
            }
        });
    }


    done(err) {
        // @TODO figure out if i can throw here. Require promise to be used, unless callback is provided?
        if (err) {
            this.reject(err);
            return;
        }

        this.assertExpectConstraints();
        this.resolve();
    }

    atLeast(min, named = 'default') {
        this._setupNamed(named);
        this.expectCalls.get(named).min = min;
    }

    atMost(max, named = 'default') {
        this._setupNamed(named);
        this.expectCalls.get(named).max = max;
    }

    between(min, max, named = 'default') {
        this.atLeast(min, named);
        this.atMost(max, named);
    }

    _setupNamed(named) {
        if (!this.expectCalls.has(named)) {
            this.expectCalls.set(named, {
                min: 0,
                max: null,
                actual: 0
            });
        }
    }

}
module.exports = Expected;
