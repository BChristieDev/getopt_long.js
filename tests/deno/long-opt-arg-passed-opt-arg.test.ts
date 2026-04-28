/**
 * @file       tests/deno/long-opt-arg-passed-opt-arg.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.ts';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../src/index.ts';

const { test } = Deno;
const { optional_argument } = constants;

test('Expect optional argument passed optional argument', () => {
    const args = [ '', '--foo=bar', 'baz' ];
    const longopts: Option[] = [
        { name: 'foo', has_arg: optional_argument, flag: null, val: 0 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, '', longopts, null)) !== -1)
    {
        expect(opt).toBe(0);
        expect(extern.optarg).toBe('bar');
    }

    expect(args[extern.optind]).toBe('baz');
});
