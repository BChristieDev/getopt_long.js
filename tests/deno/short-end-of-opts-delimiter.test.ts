/**
 * @file       tests/deno/short-end-of-opts-delimiter.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.ts';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../src/index.ts';

const { test } = Deno;
const { no_argument } = constants;

test('End of options delimiter', () => {
    const args = [ '', '-a', '--', '-b' ];
    const longopts: Option[] = [
        { name: '', has_arg: no_argument, flag: null, val: 0 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, 'ab', longopts, null)) !== -1)
    {
        expect(opt).toBe('a');
        expect(extern.optarg).toBe(null);
    }

    expect(args[extern.optind]).toBe('-b');
});
