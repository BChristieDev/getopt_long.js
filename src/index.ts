/**
 * @file       src/index.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

import { basename } from 'node:path';

interface IConstants
{
    /** No argument to the option is expected. */
    no_argument: number;
    /** An argument to the option is required. */
    required_argument: number;
    /** An argument to the option may be presented. */
    optional_argument: number;
}

interface IExtern
{
    /** Stores the argument of an option. */
    optarg: string | null;
    /** Next index in `argv` array to process; default `2`. */
    optind: number;
    /** Error reporting flag, set to `0` to suppress default error messages; default `1`. */
    opterr: number;
    /** Stores the option that caused an error. */
    optopt: string | number;
    /** Resets parser's internal state */
    optreset: number;
}

interface IOption<T extends string | number | null>
{
    /** Name of the long option. */
    name: string;
    /**
     * `constants.no_argument` (or 0) if the option does not take an argument;
     * `constants.required_argument` (or 1) if the option requires an argument; or
     * `constants.optional_argument` (or 2) if the option takes an optional argument.
     */
    has_arg: number;
    /**
     * Specifies how results are returned for a long option. If `flag` is not `null` then `getopt_long`
     * returns `0` and `val` will be assigned to the first index of `flag`, otherwise `getopt_long`
     * returns `val`.
     */
    flag: T extends null ? null : T[];
    /** Value to return, or be assigned to the first index of `flag`. */
    val: T extends null ? (string | number) : T;
}

export type Option = IOption<string> | IOption<number> | IOption<null>;

// @ts-ignore
const isDeno = typeof Deno !== 'undefined' ? true : false;
let nextchar = 0;

const constants: IConstants = Object.freeze({
    no_argument: 0,
    required_argument: 1,
    optional_argument: 2
} as const);

const extern: IExtern = {
    optarg: null,
    opterr: 1,
    optind: isDeno ? 1 : 2,
    optopt: 0,
    optreset: 0
};

function errInvalidOpt(msg: string, colon?: number): string
{
    if (!extern.opterr)
    {
        if (colon)
            return ':';

        return '?';
    }

    console.error(msg);

    return '?';
}

function parseArg(argv: string[], hasArg: number, optargind: number)
{
    if (
        hasArg === constants.required_argument || (
            hasArg === constants.optional_argument && optargind > 0
        )
    )
    {
        extern.optarg = argv[extern.optind]!.substring(optargind);
        extern.optind++;
        nextchar = 0;
    }
    else
    {
        extern.optarg = null;
    }
}

function parseLongOpt(
    argc: number,
    argv: string[],
    longopts: Option[],
    indexptr: number[] | null
): string | number
{
    const progname = basename(argv[isDeno ? 0 : 1]!);
    const eq = argv[extern.optind]!.indexOf('=', 3);
    const opt = argv[extern.optind]!.substring(2, eq === -1 ? argv[extern.optind]!.length : eq);
    const optarrind = longopts.findIndex(longopt => longopt.name === opt);

    if (optarrind === -1)
    {
        extern.optopt = 0;
        extern.optind++;

        return errInvalidOpt(`${progname}: unrecognized option '--${opt}'`);
    }

    if (indexptr !== null)
        indexptr[0] = optarrind;

    if (eq >= 0)
    {
        if (
            longopts[optarrind]!.has_arg <= constants.no_argument ||
            longopts[optarrind]!.has_arg > constants.optional_argument
        )
        {
            extern.optopt = 0;
            extern.optind++;

            return errInvalidOpt(`${progname}: option '--${opt}' doesn't allow an argument`);
        }
    }
    else
    {
        extern.optind++;
    }

    if (longopts[optarrind]!.has_arg === constants.required_argument && extern.optind >= argc)
    {
        extern.optopt = 0;

        return errInvalidOpt(`${progname}: option '--${opt}' requires an argument`, 1);
    }

    parseArg(argv, longopts[optarrind]!.has_arg, eq + 1);

    if (longopts[optarrind]!.flag !== null)
    {
        extern.optopt = 0;
        longopts[optarrind]!.flag[0] = longopts[optarrind]!.val;

        return 0;
    }

    return longopts[optarrind]!.val;
}

function parseShortOpt(argc: number, argv: string[], shortopts: string): string
{
    const progname = basename(argv[isDeno ? 0 : 1]!);
    const opt = argv[extern.optind]![nextchar]!;
    const optstrind = shortopts.indexOf(opt);
    let hasArg = constants.no_argument;

    if (optstrind === -1)
    {
        extern.optopt = opt;
        extern.optind++;
        nextchar = 0;

        return errInvalidOpt(`${progname}: invalid option -- '${opt}'`);
    }

    if (++nextchar === argv[extern.optind]!.length)
    {
        extern.optind++;
        nextchar = 0;
    }

    if (shortopts.charAt(optstrind + 1) === ':' && shortopts.charAt(optstrind + 2) === ':')
        hasArg = constants.optional_argument;
    else if (shortopts.charAt(optstrind + 1) === ':' && shortopts.charAt(optstrind + 2) !== ':')
        hasArg = constants.required_argument;

    if (hasArg === constants.required_argument && extern.optind >= argc)
    {
        extern.optopt = 0;

        return errInvalidOpt(`${progname}: option requires an argument -- '${opt}'`, 1);
    }

    parseArg(argv, hasArg, nextchar);

    return opt;
}

/**
 * If a short option is recognized the option character is returned. If a long option is recognized
 * `val` is returned if `flag` is `null`, otherwise `0` is returned and `val` is assigned to the first
 * index of `flag`. If `indexptr` is not `null`, then the index of the long option in `longopts` is
 * assigned to the first index of `indexptr`.
 * 
 * If an unrecognized option is encountered `?` is returned. If an option with a missing argument is
 * encountered `?` is returned if `opterr` is non-zero, otherwise `:` is returned.
 * 
 * If all options are parsed `-1` is returned.
 * 
 * @param argc Argument count
 * @param argv Argument vector
 * @param shortopts String of characters representing valid short options
 * @param longopts Array of `Option` objects representing valid long options
 * @param indexptr Array that stores the index of a long options in `longopts`
 */
function getopt_long(
    argc: number,
    argv: string[],
    shortopts: string,
    longopts: Option[],
    indexptr: number[] | null
): string | number
{
    if (extern.optind >= argc)
        return -1;

    if (!extern.optind)
    {
        extern.optind = isDeno ? 1 : 2;
        extern.optreset = 1;
    }

    if (extern.optreset)
    {
        extern.optreset = 0;
        nextchar = 0;
    }

    if (shortopts.charAt(0) === ':')
        extern.opterr = 0;

    if (!nextchar)
    {
        if (argv[extern.optind]!.charAt(0) !== '-' || argv[extern.optind]! === '-')
            return -1;

        if (argv[extern.optind]! === '--')
        {
            extern.optind++;

            return -1;
        }

        if (argv[extern.optind]!.charAt(1) === '-')
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
