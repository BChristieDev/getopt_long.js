/**
 * @file       tests/deno/short-opt-arg-passed-no-arg.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../lib/getopt_long.mjs';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../lib/getopt_long.mjs';

const { test } = Deno;
const { no_argument } = constants;

test('Expects optional argument passed no argument', () => {
    const args = [ '', '-a', 'foo' ];
    const longopts: Option[] = [
        { name: '', has_arg: no_argument, flag: 0, val: 0 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, 'a::', longopts, [ 0 ])) !== -1)
    {
        expect(opt).toBe('a');
        expect(extern.optarg).toBe(undefined);
    }

    expect(args[extern.optind]).toBe('foo');
});
