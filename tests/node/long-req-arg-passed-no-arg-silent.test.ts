/**
 * @file       tests/node/long-req-arg-passed-no-arg-silent.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from  '../../src/index.js';
import { test } from 'node:test';
import { constants, extern, getopt_long } from '../../src/index.js';
import assert from 'node:assert/strict';

const { required_argument } = constants;

test('Expect required argument passed no argument silent', () => {
    const args = [ '', '', '--foo' ];
    const longopts: Option[] = [
        { name: 'foo', has_arg: required_argument, flag: null, val: 0 }
    ];
    let stderr = '';
    let opt: string | number;

    console.error = (...args) => stderr = args.join(' ');
    extern.opterr = 0;

    while ((opt = getopt_long(args.length, args, '', longopts, null)) !== -1)
    {
        assert.equal(opt, ':');
        assert.equal(stderr, '');
        assert.equal(extern.optarg, null);
    }

    assert.equal(args[extern.optind - 1], '--foo');
});
