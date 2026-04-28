/**
 * @file       tests/deno/short-invalid-opt-silent.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.ts';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../src/index.ts';

const { test } = Deno;
const { no_argument } = constants;

test('Invalid option silent', () => {
    const args = [ '', '-a', 'foo' ];
    const longopts: Option[] = [
        { name: '', has_arg: no_argument, flag: null, val: 0 }
    ];
    let stderr = '';
    let opt: string | number;

    console.error = (...args) => stderr = args.join(' ');

    while ((opt = getopt_long(args.length, args, ':', longopts, null)) !== -1)
    {
        expect(opt).toBe('?');
        expect(stderr).toBe('');
        expect(extern.optarg).toBe(null);
    }

    expect(args[extern.optind]).toBe('foo');
});
