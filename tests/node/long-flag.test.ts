/**
 * @file       tests/node/long-flag.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.js';
import { test } from 'node:test';
import { constants, extern, getopt_long } from '../../src/index.js';
import assert from 'node:assert/strict';

const { no_argument } = constants;

test('Flag', () => {
    const args = [ '', '', '--foo', 'bar' ];
    const foo: number[] = [];
    const longopts: Option[] = [
        { name: 'foo', has_arg: no_argument, flag: foo, val: 1 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, '', longopts, null)) !== -1)
    {
        assert.equal(opt, 0);
        assert.equal(extern.optarg, null);
    }

    assert.equal(foo[0], 1);
    assert.equal(args[extern.optind], 'bar');
});
