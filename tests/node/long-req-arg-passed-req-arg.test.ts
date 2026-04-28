/**
 * @file       tests/node/long-req-arg-passed-req-arg.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.js';
import { test } from 'node:test';
import { constants, extern, getopt_long } from '../../src/index.js';
import assert from 'node:assert/strict';

const { required_argument } = constants;

test('Expects required argument passed required argument', () => {
    const args = [ '', '', '--foo', 'bar', 'baz' ];
    const longopts: Option[] = [
        { name: 'foo', has_arg: required_argument, flag: null, val: 0 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, '', longopts, null)) !== -1)
    {
        assert.equal(opt, 0);
        assert.equal(extern.optarg, 'bar');
    }

    assert.equal(args[extern.optind], 'baz');
});
