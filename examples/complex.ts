#! /usr/bin/env -S node --import tsx

/**
 * @file       examples/complex.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from 'getopt_long.js';
import { constants, extern, getopt_long } from 'getopt_long.js';

const { no_argument, required_argument, optional_argument } = constants;

const frob_state = {
    unset: -1,
    off: 0,
    on: 1
};

const frob_flag = [ frob_state.unset ];
const longindex: number[] = [];
let opt: string | number;

const longopts: Option[] = [
    { name: 'foo',    has_arg: no_argument,       flag: null,      val: 'a'            },
    { name: 'bar',    has_arg: optional_argument, flag: null,      val: 'b'            },
    { name: 'baz',    has_arg: required_argument, flag: null,      val: 'c'            },
    { name: 'on',     has_arg: no_argument,       flag: frob_flag, val: frob_state.on  },
    { name: 'off',    has_arg: no_argument,       flag: frob_flag, val: frob_state.off },
    { name: 'silent', has_arg: no_argument,       flag: null,      val: 's'            }
];

while ((opt = getopt_long(process.argv.length, process.argv, 'ab::c:s', longopts, longindex)) !== -1)
{
    switch (opt)
    {
        case 0:
            console.log(`option '${longopts[longindex[0]!]!.name}' changed frob state to '${frob_flag[0]}'`);
            break;
        case 'a':
        case 'b':
        case 'c':
            console.log(`option '${opt}' has argument '${extern.optarg}'`);
            break;
        case 's':
            extern.opterr = 0;
            break;
    }
}

if (extern.optind < process.argv.length)
{
    process.stdout.write('positional arguments: ');

    while (extern.optind < process.argv.length)
        process.stdout.write(`${process.argv[extern.optind++]} `);

    process.stdout.write('\n');
}
