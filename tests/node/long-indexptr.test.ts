/**
 * @file       tests/node/long-indexptr.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.js';
import { test } from 'node:test';
import { constants, extern, getopt_long } from '../../src/index.js';
import assert from 'node:assert/strict';

const { no_argument } = constants;

test('Index pointer', () => {
    const args = [ '', '', '--bar', 'qux' ];
    const indexptr: number[] = [];
    const longopts: Option[] = [
        { name: 'foo', has_arg: no_argument, flag: null, val: 0 },
        { name: 'bar', has_arg: no_argument, flag: null, val: 0 },
        { name: 'baz', has_arg: no_argument, flag: null, val: 0 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, '', longopts, indexptr)) !== -1)
    {
        assert.equal(opt, 0);
        assert.equal(longopts[indexptr[0]!]!.name, 'bar');
        assert.equal(extern.optarg, null);
    }

    assert.equal(args[extern.optind], 'qux');
});
