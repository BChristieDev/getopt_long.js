/**
 * @file       lib/getopt_long.mjs
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

// @ts-check
'use strict';

/**
 * @typedef Constants
 * @type {object}
 * @property {number} no_argument
 * @property {number} required_argument
 * @property {number} optional_argument
 */

/**
 * @typedef Extern
 * @type {object}
 * @property {string|undefined} optarg Stores the argument of an option.
 * @property {number} optind Next index in `argv` array to process; default `2`.
 * @property {number} opterr Error reporting flag, set to `0` to suppress default error messages; default `1`.
 * @property {string|number} optopt Stores the option that caused an error.
 */

/**
 * @typedef Option
 * @type {object}
 * @property {string|number|null} name Name of the long option.
 * @property {number} has_arg `constants.no_argument` (or 0) if the option does not take an argument;
 * `constants.required_argument` (or 1) if the option requires an argument; or `constants.optional_argument`
 * (or 2) if the option takes an optional argument.
 * @property {string[]|number[]|number|null} flag Specifies how results are returned for a long option.
 * If `flag` is an array, then `getopt_long` returns `0` and `val` will be assigned to the first index of
 * `flag`, otherwise `getopt_long` returns `val`.
 * @property {string|number} val Value to return, or be assigned to the first index of `flag`.
 */

/** @type {Constants} */
const constants = {
    no_argument: 0,
    required_argument: 1,
    optional_argument: 2
};

Object.freeze(constants);

/** @type {Extern} */
const extern = {
    optarg: undefined,
    opterr: 1,
    optind: 2,
    optopt: 0
};

let nextchar = 0;

/**
 * @param {number} argc
 * @param {string[]} argv
 * @param {string} shortopts
 * @param {Option[]} longopts
 * @param {number[]} indexptr
 */
function validateParams(argc, argv, shortopts, longopts, indexptr)
{
    if (typeof argc !== 'number')
        throw new TypeError(`expected 'number' but argument is of type '${typeof argc}'`);

    if (Array.isArray(argv))
    {
        argv.forEach(arg => {
            if (typeof arg !== 'string')
                throw new TypeError(`expected 'string' at index '${argv.indexOf(arg)}' but element is of type '${typeof arg}'`);
        });
    }
    else
        throw new TypeError(`expected 'string[]' but argument is of type ${typeof argv}`);

    if (typeof shortopts !== 'string')
        throw new TypeError(`expected 'string' but argument is of type '${typeof shortopts}'`);

    if (Array.isArray(longopts))
    {
        longopts.forEach(longopt => {
            if (typeof longopt !== 'object')
                throw new TypeError(`expected 'object' but element is of type '${typeof longopt}'`);

            if (typeof longopt?.name !== 'string' && longopt?.name !== 0 && typeof longopt?.name !== null)
                throw new TypeError(`expected 'string | null' but element property 'name' is of type '${typeof longopt?.name}'`);

            if (typeof longopt?.has_arg !== 'number')
                throw new TypeError(`expected 'number' but element property 'has_arg' is of type '${typeof longopt?.has_arg}'`);

            if (!Array.isArray(longopt?.flag) && longopt?.flag !== 0 && typeof longopt?.flag !== null)
                throw new TypeError(`expected 'string[] | number[] | null' but element property 'flag' is of type '${longopt?.flag}'`);

            if (typeof longopt?.val !== 'string' && typeof longopt?.val !== 'number')
                throw new TypeError(`expected 'string | number' but element property 'val' is of type '${longopt?.val}'`);
        });
    }
    else
        throw new TypeError(`expected 'Option[]' but argument is of type '${typeof longopts}'`);

    if (!Array.isArray(indexptr))
        throw new TypeError(`expected 'number[]' but argument is of type '${typeof indexptr}'`);

    if (typeof extern.opterr !== 'number')
        throw new TypeError(`'opterr' is not a number (received '${typeof extern.opterr}')`);

    if (typeof extern.optind !== 'number')
        throw new TypeError(`'optind' is not a number (received '${typeof extern.optind}')`);
}

/**
 * @param {string|number} optopt
 * @param {string} errMsg
 */
function errInvalidOpt(optopt, errMsg)
{
    extern.optind++;
    extern.optopt = optopt;
    nextchar = 0;

    if (extern.opterr)
        console.error(errMsg);

    return '?';
}

/**
 * @param {string|number} optopt
 * @param {string} errMsg
 */
function errRequiresArg(optopt, errMsg)
{
    extern.optopt = optopt;

    if (extern.opterr)
    {
        console.error(errMsg);
        return '?'
    }

    return ':';
}

/**
 * @param {number} argc
 * @param {string[]} argv
 * @param {boolean} isOptional
 * @param {boolean} isRequired
 * @param {string|number} opt
 * @param {number} optargind
 * @param {string} errMsg
 */
function parseArg(argc, argv, isOptional, isRequired, opt, optargind, errMsg)
{
    if ((isOptional && optargind > 0) || isRequired)
    {
        if (isRequired && optargind <= 0 && extern.optind >= argc)
            return errRequiresArg(opt, errMsg);

        extern.optarg = argv[extern.optind].substring(optargind);
        extern.optind++;
        nextchar = 0;
    }
    else
        extern.optarg = undefined;
}

/**
 * @param {number} argc
 * @param {string[]} argv
 * @param {Option[]} longopts
 * @param {number[]} indexptr
 * @returns {string|number}
 */
function parseLongOpt(argc, argv, longopts, indexptr)
{
    const eq = argv[extern.optind].indexOf('=', 3);
    const opt = argv[extern.optind].substring(2, eq === -1 ? argv[extern.optind].length : eq);
    const optarrIndex = longopts.findIndex(longopt => longopt.name === opt);

    if (optarrIndex === -1)
        return errInvalidOpt(0, `unrecognized option '--${opt}'`);

    if (longopts[optarrIndex].has_arg <= constants.no_argument || longopts[optarrIndex].has_arg > constants.optional_argument || eq === -1)
        extern.optind++;

    indexptr[0] = optarrIndex;

    const isOptional = longopts[optarrIndex].has_arg === constants.optional_argument;
    const isRequired = longopts[optarrIndex].has_arg === constants.required_argument;

    const err = parseArg(argc, argv, isOptional, isRequired, 0, eq + 1, `option '--${opt}' requires an argument`);

    if (err)
        return err;

    if (longopts[optarrIndex].flag === null || longopts[optarrIndex].flag === 0)
        return longopts[optarrIndex].val;

    if (Array.isArray(longopts[optarrIndex].flag))
        longopts[optarrIndex].flag[0] = longopts[optarrIndex].val;

    return 0;
}

/**
 * @param {number} argc
 * @param {string[]} argv
 * @param {string} shortopts
 * @returns {string}
 */
function parseShortOpt(argc, argv, shortopts)
{
    const opt = argv[extern.optind][nextchar];
    const optstrIndex = shortopts.indexOf(opt);

    if (optstrIndex === -1)
        return errInvalidOpt(opt, `invalid option -- ${opt}`);

    if (++nextchar === argv[extern.optind].length)
    {
        extern.optind++;
        nextchar = 0;
    }

    const isOptional = shortopts[optstrIndex + 1] === ':' && shortopts[optstrIndex + 2] === ':';
    const isRequired = shortopts[optstrIndex + 1] === ':' && shortopts[optstrIndex + 2] !== ':';

    const err = parseArg(argc, argv, isOptional, isRequired, opt, nextchar, `option requires an argument -- ${opt}`);

    if (err)
        return err;

    return opt;
}

/**
 * If a short option is recognized the option character is returned. If a long option is recognized
 * `val` is returned if `flag` is `null`, otherwise `0` is returned and the first index of `flag` is
 * assigned to `val`.
 *
 * If an unrecognized option is encountered `?` is returned. If an option with a missing argument is
 * encountered `?` is returned if `extern.opterr` is non-zero, otherwise `:` is returned.
 *
 * If all options are parsed `-1` is returned.
 *
 * @param {number} argc Argument count
 * @param {string[]} argv Argument vector
 * @param {string} shortopts String of characters representing valid short options
 * @param {Option[]} longopts Array of Option objects, each element representing a valid long option
 * @param {number[]} indexptr Array serving as a pointer to store the zero-based index of a long option in longopts
 * @returns {string|number}
 */
function getopt_long(argc, argv, shortopts, longopts, indexptr)
{
    validateParams(argc, argv, shortopts, longopts, indexptr);

    if (extern.optind >= argc)
        return -1;

    if (shortopts[0] === ':')
        extern.opterr = 0;

    if (nextchar === 0)
    {
        if (argv[extern.optind][0] !== '-' || argv[extern.optind] === '-')
            return -1;

        if (argv[extern.optind] === '--')
        {
            extern.optind++;
            return -1;
        }

        if (argv[extern.optind][1] === '-')
            return parseLongOpt(argc, argv, longopts, indexptr);

        nextchar++;
    }

    return parseShortOpt(argc, argv, shortopts);
}

export {
    constants,
    extern,
    getopt_long
}
