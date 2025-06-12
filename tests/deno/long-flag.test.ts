/**
 * @file       tests/deno/long-flag.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../lib/getopt_long.mjs';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../lib/getopt_long.mjs';

const { test } = Deno;
const { no_argument } = constants;

test('Flag', () => {
    const args = [ '', '', '--foo', 'bar' ];
    const foo = [ 0 ];
    const longopts: Option[] = [
        { name: 'foo', has_arg: no_argument, flag: foo, val: 1 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, '', longopts, [ 0 ])) !== -1)
    {
        expect(opt).toBe(0);
        expect(extern.optarg).toBe(undefined);
    }

    expect(foo[0]).toBe(1);
    expect(args[extern.optind]).toBe('bar');
});
