/**
 * @file       tests/node/short-req-arg-passed-req-arg.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.js';
import { test } from 'node:test';
import { constants, extern, getopt_long } from '../../src/index.js';
import assert from 'node:assert/strict';

const { no_argument } = constants;

test('Expects required argument passed required argument', () => {
    const args = [ '', '', '-a', 'foo', 'bar' ];
    const longopts: Option[] = [
        { name: '', has_arg: no_argument, flag: null, val: 0 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, 'a:', longopts, null)) !== -1)
    {
        assert.equal(opt, 'a');
        assert.equal(extern.optarg, 'foo');
    }

    assert.equal(args[extern.optind], 'bar');
});
