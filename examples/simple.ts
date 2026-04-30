#! /usr/bin/env -S node --import tsx

/**
 * @file       examples/simple.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import type { Option } from 'getopt_long.js';
import { constants, extern, getopt_long } from 'getopt_long.js';

const { required_argument } = constants;

const longindex: number[] = [];
let opt: string | number;

const longopts: Option[] = [
    { name: 'foo', has_arg: required_argument, flag: null, val: 0 }
];

while ((opt = getopt_long(process.argv.length, process.argv, 'a:', longopts, longindex)) !== -1)
{
    switch (opt)
    {
        case 0:
            console.log(`option '${longopts[longindex[0]!]!.name}' has argument '${extern.optarg}'`);
            break;
        case 'a':
            console.log(`option '${opt}' has argument '${extern.optarg}'`);
            break;
    }
}
