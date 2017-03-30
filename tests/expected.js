'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const expected = require('../index');
const chai = require('chai');

describe('Expected', () => {
    it('Named expect() should throw if no expectations set for it', () => {
        const expect = expected();
        chai.expect(() => {
            expect(null, null, 'foo');
        }).to.throw(chai.AssertionError, /No expectations set/);
    });

    it('Should pass on exact expected expect() calls', () => {
        const expect = expected().exact(2);

        expect(true).to.be.true;
        expect(false).to.be.false;

        expect.done();
    });

    it('Should fail on less than exact expected expect() calls', () => {
        const expect = expected().exact(2);

        expect(true).to.be.true;

        chai.expect(() => {
            expect.done();
        }).to.throw(chai.AssertionError, /at least 2/);
    });

    it('Should fail on more than exact expected expect() calls', () => {
        const expect = expected().exact(2);

        expect(true).to.be.true;
        expect(false).to.be.false;
        expect(null).to.be.null;

        chai.expect(() => {
            expect.done();
        }).to.throw(chai.AssertionError, /at most 2/);
    });

    it('Should fail on less than minimum expected expect() calls', () => {
        const expect = expected().atLeast(2).atMost(3);

        expect(true).to.be.true;

        chai.expect(() => {
            expect.done();
        }).to.throw(chai.AssertionError, /at least 2/);
    });

    it('Should fail on more than maximum expected expect() calls', () => {
        const expect = expected().atMost(2).atLeast(1);

        expect(true).to.be.true;
        expect(false).to.be.false;
        expect(null).to.be.null;

        chai.expect(() => {
            expect.done();
        }).to.throw(chai.AssertionError, /at most 2/);
    });

    it('Should fail when no expect() calls are allowed', () => {
        const expect = expected().exact(0);

        expect(true).to.be.true;

        chai.expect(() => {
            expect.done();
        }).to.throw(chai.AssertionError, /at most 0/);
    });

    it('Should call callback when expectation for expect() calls passed', (done) => {
        let called = false;
        let err;
        const expect = expected((e) => {
            called = true;
            err = e;
        }).exact(2);

        expect(true).to.be.true;
        expect(false).to.be.false;

        expect.done();
        setImmediate(() => {
            chai.expect(called, 'Callback was not called').to.be.true;
            chai.expect(err, 'Callback was called with error').to.be.undefined;
            done();
        });
    });
});
