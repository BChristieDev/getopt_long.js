/**
 * @file       tests/deno/long-req-arg-passed-opt-arg.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../lib/getopt_long.mjs';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../lib/getopt_long.mjs';

const { test } = Deno;
const { required_argument } = constants;

test('Expects required argument passed optional argument', () => {
    const args = [ '', '', '--foo=bar', 'baz' ];
    const longopts: Option[] = [
        { name: 'foo', has_arg: required_argument, flag: 0, val: 0 }
    ];
    let opt: string | number;

    while ((opt = getopt_long(args.length, args, '', longopts, [ 0 ])) !== -1)
    {
        expect(opt).toBe(0);
        expect(extern.optarg).toBe('bar');
    }

    expect(args[extern.optind]).toBe('baz');
});
