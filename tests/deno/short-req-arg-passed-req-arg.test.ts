/**
 * @file       tests/deno/short-req-arg-passed-req-arg.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../lib/getopt_long.mjs';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../lib/getopt_long.mjs';

const { test } = Deno;
const { no_argument } = constants;

test('Expects required argument passed required argument', () => {
    const args = [ '', '', '-a', 'foo', 'bar' ];
    const longopts: Option[] = [
        { name: '', has_arg: no_argument, flag: 0, val: 0 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, 'a:', longopts, [ 0 ])) !== -1)
    {
        expect(opt).toBe('a');
        expect(extern.optarg).toBe('foo');
    }

    expect(args[extern.optind]).toBe('bar');
});
