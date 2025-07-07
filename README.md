<div align="center">
    <h1>getopt_long.js</h1>
    <h4>JavaScript option parser inspired by getopt_long(3)</h4>
    <p>
        <a href="https://github.com/BChristieDev/getopt_long.js/actions/workflows/ci.yml"><img src="https://github.com/BChristieDev/getopt_long.js/actions/workflows/ci.yml/badge.svg"></a>
        <a href="https://www.npmjs.com/package/getopt_long.js"><img src="https://badge.fury.io/js/getopt_long.js.svg"></a>
    </p>
    <p>
        <a href="#install">Install</a> •
        <a href="#examples">Examples</a> •
        <a href="#maintainers">Maintainers</a> •
        <a href="#contributing">Contributing</a> •
        <a href="#license">License</a>
    </p>
</div>

## Install

```sh
$ npm i getopt_long.js
```

## Examples

### Simple

```js
#! /usr/bin/env node

import { constants, extern, getopt_long } from 'getopt_long.js';

const { required_argument } = constants;

const longopts = [
    { name: 'foo', has_arg: required_argument, flag: 0, val: 0 }
];

const longindex = [ 0 ];
let opt;

while ((opt = getopt_long(process.argv.length, process.argv, 'a:', longopts, longindex)) !== -1)
{
    switch (opt)
    {
        case 0:
            console.log(`option '${longopts[longindex[0]].name}' has argument '${extern.optarg}'`);
            break;
        case 'a':
            console.log(`option '${opt}' has argument '${extern.optarg}'`);
            break;
    }
}
```

```sh
$ ./simple --foo bar --foo=baz --foo
option 'foo' has argument 'bar'
option 'foo' has argument 'baz'
option '--foo' requires an argument

$ ./simple -a foo -abar -a
option 'a' has argument 'foo'
option 'a' has argument 'bar'
option requires an argument -- 'a'
```

### Complex

```js
#! /usr/bin/env node

import { constants, extern, getopt_long } from 'getopt_long.js';

const { no_argument, optional_argument, required_argument } = constants;

const frob_state = {
    unset: -1,
    off: 0,
    on: 1
};

const frob_flag = [ frob_state.unset ];

const longopts = [
    { name: 'foo',    has_arg: no_argument,       flag: 0,         val: 'a'            },
    { name: 'bar',    has_arg: optional_argument, flag: 0,         val: 'b'            },
    { name: 'baz',    has_arg: required_argument, flag: 0,         val: 'c'            },
    { name: 'on',     has_arg: no_argument,       flag: frob_flag, val: frob_state.on  },
    { name: 'off',    has_arg: no_argument,       flag: frob_flag, val: frob_state.off },
    { name: 'silent', has_arg: no_argument,       flag: 0,         val: 's'            }
];

const longindex = [ 0 ];
let opt;

while ((opt = getopt_long(process.argv.length, process.argv, 'ab::c:', longopts, longindex)) !== -1)
{
    switch (opt)
    {
        case 0:
            console.log(`option '${longopts[longindex[0]].name}' changed frob state to '${frob_flag[0]}'`);
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
```

```sh
$ ./complex --foo --bar=bar --baz=baz --baz qux -- --quux quux
option 'a' has argument 'undefined'
option 'b' has argument 'bar'
option 'c' has argument 'baz'
option 'c' has argument 'qux'
positional arguments: --quux quux

$ ./complex --aa -bb -cc -c d -- -e e
option 'a' has argument 'undefined'
option 'a' has argument 'undefined'
option 'b' has argument 'b'
option 'c' has argument 'c'
option 'c' has argument 'd'
positional arguments: -e e

$ ./complex --on --off
option 'on' changed frob state to '1'
option 'off' changed frob state to '0'

$ ./complex --silent --foo --qux --bar
option 'a' has argument 'undefined'
option 'b' has argument 'undefined'
```

## Maintainers

[@BChristieDev](https://github.com/BChristieDev)

## Contributing

PRs accepted.

## License

[MIT](LICENSE) © Brandon Christie
