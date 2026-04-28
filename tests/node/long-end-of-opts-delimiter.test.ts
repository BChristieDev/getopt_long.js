/**
 * @file       tests/node/long-end-of-opts-delimiter.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.js';
import { test } from 'node:test';
import { constants, extern, getopt_long } from '../../src/index.js';
import assert from 'node:assert/strict';

const { no_argument } = constants;

test('End of options delimiter', () => {
    const args = [ '', '', '--foo', '--', '--bar' ];
    const longopts: Option[] = [
        { name: 'foo', has_arg: no_argument, flag: null, val: 'f' },
        { name: 'bar', has_arg: no_argument, flag: null, val: 'b' }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, '', longopts, null)) !== -1)
    {
        assert.equal(opt, 'f');
        assert.equal(extern.optarg, null);
    }

    assert.equal(args[extern.optind], '--bar');
});
