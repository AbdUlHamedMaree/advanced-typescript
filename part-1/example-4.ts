type IsString<T> = T extends string ? true : false;

type PowerLvl1 = IsString<string>
//       '------> typeof `true`

type PowerLvl2 = IsString<number> extends true ? 'YES' : 'NO'
//       '------> typeof `'NO'`