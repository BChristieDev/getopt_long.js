/**
 * @file       tests/deno/short-no-arg.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.ts';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../src/index.ts';

const { test } = Deno;
const { no_argument } = constants;

test('Expects no argument', () => {
    const args = [ '', '-abc', 'foo' ];
    const optstring = 'abc';
    const longopts: Option[] = [
        { name: '', has_arg: no_argument, flag: null, val: 0 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, optstring, longopts, null)) !== -1)
    {
        expect(optstring.includes(opt as string)).toBe(true);
        expect(extern.optarg).toBe(null);
    }

    expect(args[extern.optind]).toBe('foo');
});
