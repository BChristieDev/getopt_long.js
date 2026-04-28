/**
 * @file       tests/node/short-opt-arg-passed-no-arg.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.js';
import { test } from 'node:test';
import { constants, extern, getopt_long } from '../../src/index.js';
import assert from 'node:assert/strict';

const { no_argument } = constants;

test('Expects optional argument passed no argument', () => {
    const args = [ '', '', '-a', 'foo' ];
    const longopts: Option[] = [
        { name: '', has_arg: no_argument, flag: null, val: 0 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, 'a::', longopts, null)) !== -1)
    {
        assert.equal(opt, 'a');
        assert.equal(extern.optarg, null);
    }

    assert.equal(args[extern.optind], 'foo');
});
