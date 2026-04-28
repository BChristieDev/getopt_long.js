/**
 * @file       tests/deno/short-req-arg-passed-no-arg-silent.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.ts';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../src/index.ts';

const { test } = Deno;
const { no_argument } = constants;

test('Expects required argument passed no argument silent', () => {
    const args = [ '', '-a' ];
    const longopts: Option[] = [
        { name: '', has_arg: no_argument, flag: null, val: 0 }
    ];
    let stderr = '';
    let opt: string | number;

    console.error = (...args) => stderr = args.join(' ');

    while ((opt = getopt_long(args.length, args, ':a:', longopts, null)) !== -1)
    {
        expect(opt).toBe(':');
        expect(stderr).toBe('');
        expect(extern.optarg).toBe(null);
    }

    expect(args[extern.optind - 1]).toBe('-a');
});
