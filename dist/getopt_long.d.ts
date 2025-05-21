/**
 * @file       dist/getopt_long.d.ts
 * @author     Brandon Christie <bchristie.dev@gmail.com>
 */

type Constants = {
    no_argument: number;
    required_argument: number;
    optional_argument: number;
}

type Extern = {
    /** Stores the argument of an option. */
    optarg: string | undefined;
    /** Next index in `argv` array to process; default `2`. */
    optind: number;
    /** Error reporting flag, set to `0` to suppress default error messages; default `1`. */
    opterr: number;
    /** Stores the option that caused an error. */
    optopt: string | number;
};

export type Option = {
    /** Name of the long option. */
    name: string;
    /**
     * `Constants.no_argument` (or 0) if the option does not take an argument;
     * `Constants.required_argument` (or 1) if the option requires an argument; or
     * `Constants.optional_argument` (or 2) if the option takes an optional argument.
     */
    has_arg: number;
    /**
     * Specifies how results are returned for a long option. If `flag` is an array, then `getopt_long`
     * returns `0` and `val` will be assigned to the first index of `flag`, otherwise `getopt_long`
     * returns `val`.
     */
    flag: string[] | number[] | number | null;
    /** Value to return, or be assigned to the first index of `flag`. */
    val: string | number;
};

export const constants: Constants;

export const extern: Extern;

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
 * @param argc Argument count
 * @param argv Argument vector
 * @param shortopts String of characters representing valid short options
 * @param longopts Array of Option objects, each element representing a valid long option
 * @param indexptr Array serving as a pointer to store the zero-based index of a long option in longopts
 */
export function getopt_long(argc: number, argv: string[], shortopts: string, longopts: Option[], indexptr: number[]): string | number;
