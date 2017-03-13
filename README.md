# chai-expect-expected
Small tool to ensure chai.expect() was called expected amount of times. I
expect not to get any more unexpected false green tests.

Provides `expect` wrapper that does `expect()` invocation counting (not that
assertions were actually made!)

Expectaions can be set with:

- `atLeast(count, [namedIdentifierString]) : expectWrapper`
- `atMost(count, [namedIdentifierString]) : expectWrapper`
- `exact(count, [namedIdentifierString]) : expectWrapper`
- `between(min, max, [namedIdentifierString]) : expectWrapper`

You must call `expectWrapper.done()` at the end of test or in async callback

```js
const expected = require('chai-expect-expected');

describe('Expected', () => {
    it('Sync example', () => {
        const expect = expected().exact(2);

        expect(true).to.be.true;
        expect(false).to.be.false;

        expect.done(); // .done() call is required
    });

    it('Async example', (done) => {
        const expect = expected(done).exact(2);

        setImmediate(() => {
            expect(true).to.be.true;
            expect(false).to.be.false;

            expect.done();
        });
    });

    it('Named example', () => {
        const expect = expected()
            .exact(2, 'truism');

        expect(true, null, 'truism').to.be.true;
        expect(true, null, 'truism').not.to.be.false;
        expect(false).to.be.false;

        expect.done();
    });
});
```

Expect safely! ;-)
