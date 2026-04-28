/**
 * @file       tests/node/short-invalid-opt-silent.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.js';
import { test } from 'node:test';
import { constants, extern, getopt_long } from '../../src/index.js';
import assert from 'node:assert/strict';

const { no_argument } = constants;

test('Invalid option silent', () => {
    const args = [ '', '', '-a', 'foo' ];
    const longopts: Option[] = [
        { name: '', has_arg: no_argument, flag: null, val: 0 }
    ];
    let stderr = '';
    let opt: string | number;

    console.error = (...args) => stderr = args.join(' ');

    while ((opt = getopt_long(args.length, args, ':', longopts, null)) !== -1)
    {
        assert.equal(opt, '?');
        assert.equal(stderr, '');
        assert.equal(extern.optarg, null);
    }

    assert.equal(args[extern.optind], 'foo');
});
