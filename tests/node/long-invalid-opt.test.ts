/**
 * @file       tests/node/long-invalid-opt.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.js';
import { test } from 'node:test';
import { basename } from 'node:path';
import { constants, extern, getopt_long } from '../../src/index.js';
import assert from 'node:assert/strict';

const { no_argument } = constants;

test('Invalid option', () => {
    const args = [ '', basename(import.meta.filename!), '--foo', 'bar' ];
    const longopts: Option[] = [
        { name: '', has_arg: no_argument, flag: null, val: 0 }
    ];
    let stderr = '';
    let opt: string | number;

    console.error = (...args) => stderr = args.join(' ');

    while ((opt = getopt_long(args.length, args, '', longopts, null)) !== -1)
    {
        assert.equal(opt, '?');
        assert.equal(stderr, `${args[1]}: unrecognized option '--foo'`);
        assert.equal(extern.optarg, null);
    }

    assert.equal(args[extern.optind], 'bar');
});
