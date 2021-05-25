const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const {cryptoHash} = require('../uill');
const hexToBinary = require('hex-to-binary')
describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'asfasf';
    const hash = '2342';
    const data = '23424';
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({timestamp, lastHash,hash, data, nonce, difficulty});


    it('the block has the timestamp, lasthash, and data ', () =>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);

    });

    describe('genesis()', () =>{
        const genesisBlock = Block.genesis();
        console.log('GenesisBlock',genesisBlock)

        it('return a Block instance', () =>{
            expect(genesisBlock instanceof Block).toBe(true)
        });

        it('returns the genesis data', () =>{
            expect(genesisBlock).toEqual(GENESIS_DATA);

        })
    });

    describe('mineBlock()', () =>{
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const mineBlock = Block.mineBlock({lastBlock, data})

        it('return a Block instance', () =>{
            expect(mineBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastblock', () =>{
            expect(mineBlock.lastHash).toEqual(lastBlock.hash);
        } );

        it('sets the `data`', () =>{
            expect(mineBlock.data).toEqual(data);
        });

        it('sets a `timestamp`', () =>{
            expect(mineBlock.timestamp).not.toEqual(undefined)
        });

        it('creates a SHA-256 `hash` based on the proper inputs', () =>{
            expect(mineBlock.hash).toEqual(cryptoHash(
                mineBlock.timestamp, 
                mineBlock.nonce, 
                mineBlock.difficulty, 
                lastBlock.hash, 
                data));
        });

        it('sets a `hash` that match the difficulty criteria', () =>{
            expect(hexToBinary(mineBlock.hash).substring(0, mineBlock.difficulty)).
            toEqual('0'.repeat(mineBlock.difficulty));
        } )

        it('adjusts the difficulty', () =>{
            const possibleResult = [lastBlock.difficulty+1, lastBlock.difficulty-1]
            expect(possibleResult.includes(mineBlock.difficulty)).toBe(true);
        })


    });

    describe('adjustDifficulty()', () =>{
        it('raise the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp +MINE_RATE - 100
            })).toEqual(block.difficulty+1);
        });
        it('lowers the difficulty for a slowly mined block', () =>{
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp +MINE_RATE +100
            })).toEqual(block.difficulty-1);
        });

        it('has a lower limit of 1', () =>{
            block.difficulty = -1;
            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1)

        })
    })

});