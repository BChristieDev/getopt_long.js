/**
 * @file       tests/deno/long-invalid-opt.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../lib/getopt_long.mjs';
import { expect } from '@std/expect';
import { basename } from '@std/path';
import { constants, extern, getopt_long } from '../../lib/getopt_long.mjs';

const { test } = Deno;
const { no_argument } = constants;

test('Invalid option', () => {
    const args = [ basename(import.meta.filename!), '--foo', 'bar' ];
    const longopts: Option[] = [
        { name: '', has_arg: no_argument, flag: 0, val: 0 }
    ];
    let stderr = '';
    let opt: string | number;

    console.error = (...args) => stderr = args.join(' ');

    while ((opt = getopt_long(args.length, args, '', longopts, [ 0 ])) !== -1)
    {
        expect(opt).toBe('?');
        expect(stderr).toBe(`${args[0]}: unrecognized option '--foo'`);
        expect(extern.optarg).toBe(undefined);
    }

    expect(args[extern.optind]).toBe('bar');
});
