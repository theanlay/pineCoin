const cryptoHash = require('./crypto-hash')

describe('cryptoHash()', () =>{
    it('generateds a SHA-256 hahshed output', () =>{
        expect(cryptoHash('foo')).toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b');
    });

    it('produces the same hash with the same input argument in any other', () =>{
        expect(cryptoHash('one', 'two','three')).toEqual(cryptoHash('one', 'two','three'))
    })

    it('produces a uniquess hash when the properties have changed  on input', () =>{
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    })
});