export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
}

/**
 * Utility types which you don't need to understand
 */

// creates an array of keys of the nested object property
export type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>]

// Join the above type with separator
export type Join<
  PathArray extends string[],
  Separator extends string,
> = PathArray extends []
  ? never
  : PathArray extends [infer FirstPathSegment]
    ? FirstPathSegment
    : PathArray extends [infer FirstPathSegment, ...infer RestPathSegments]
      ? FirstPathSegment extends string
        ? `${FirstPathSegment}${Separator}${Join<Extract<RestPathSegments, string[]>, Separator>}`
        : never
      : string

// Utility type to clean translation from "__" keys
export type FilterNotStartingWith<
  Set,
  Needle extends string,
> = Set extends `${Needle}${any}` ? never : Set

// Extract placeholder params like "{name}"
type ExtractPlaceholders<S extends string>
  = S extends `{${infer Param}}${infer Rest}`
    ? Param | ExtractPlaceholders<Rest>
    : never

export type StringToParams<
  S extends string,
  Params = ExtractPlaceholders<S>,
> = Params extends string
  ? {
      [K in Params]: string;
    }
  : void
