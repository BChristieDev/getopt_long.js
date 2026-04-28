/**
 * @file       tests/deno/long-no-arg-passed-opt-arg.test.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from '../../src/index.ts';
import { expect } from '@std/expect';
import { basename } from '@std/path';
import { constants, extern, getopt_long } from '../../src/index.ts';

const { test } = Deno;
const { no_argument } = constants;

test('Expects no argument passed optional argument', () => {
    const args = [ basename(import.meta.filename!), '--foo=bar', 'baz' ];
    const longopts: Option[] = [
        { name: 'foo', has_arg: no_argument, flag: null, val: 0 }
    ];
    let stderr = '';
    let opt: string | number;

    console.error = (...args) => stderr = args.join(' ');

    while ((opt = getopt_long(args.length, args, '', longopts, null)) !== -1)
    {
        expect(opt).toBe('?');
        expect(stderr).toBe(`${args[0]}: option '--foo' doesn't allow an argument`);
        expect(extern.optarg).toBe(null);
    }

    expect(args[extern.optind]).toBe('baz');
});
