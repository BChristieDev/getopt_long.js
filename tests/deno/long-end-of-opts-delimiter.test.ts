/**
 * @file       tests/deno/long-end-of-opts-delimiter.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.ts';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../src/index.ts';

const { test } = Deno;
const { no_argument } = constants;

test('End of options delimiter', () => {
    const args = [ '', '--foo', '--', '--bar' ];
    const longopts: Option[] = [
        { name: 'foo', has_arg: no_argument, flag: null, val: 'f' },
        { name: 'bar', has_arg: no_argument, flag: null, val: 'b' }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, '', longopts, null)) !== -1)
    {
        expect(opt).toBe('f');
        expect(extern.optarg).toBe(null);
    }

    expect(args[extern.optind]).toBe('--bar');
});
