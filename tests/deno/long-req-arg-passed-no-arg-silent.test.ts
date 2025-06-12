/**
 * @file       tests/deno/long-req-arg-passed-no-arg-silent.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../lib/getopt_long.mjs';
import { expect } from '@std/expect';
import { constants, extern, getopt_long } from '../../lib/getopt_long.mjs';

const { test } = Deno;
const { required_argument } = constants;

test('Expect required argument passed no argument silent', () => {
    const args = [ '', '', '--foo' ];
    const longopts: Option[] = [
        { name: 'foo', has_arg: required_argument, flag: 0, val: 0 }
    ];
    let opt: string | number;

    extern.opterr = 0;

    while ((opt = getopt_long(args.length, args, '', longopts, [ 0 ])) !== -1)
    {
        expect(opt).toBe(':');
        expect(extern.optarg).toBe(undefined);
    }

    expect(args[extern.optind]).toBe(undefined);
});
