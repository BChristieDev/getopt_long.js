/**
 * @file       tests/deno/long-opt-arg-passed-no-arg.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../lib/getopt_long.mjs';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../lib/getopt_long.mjs';

const { test } = Deno;
const { optional_argument } = constants;

test('Expects optional argument passed no argument', () => {
    const args = [ '', '--foo', 'bar' ];
    const longopts: Option[] = [
        { name: 'foo', has_arg: optional_argument, flag: 0, val: 0 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, '', longopts, [ 0 ])) !== -1)
    {
        expect(opt).toBe(0);
        expect(extern.optarg).toBe(undefined);
    }

    expect(args[extern.optind]).toBe('bar');
});
