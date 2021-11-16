type MyFunction<TArgs extends { a: unknown }, TReturn = TArgs['a']> = (
  args: TArgs,
) => TReturn;

const numToString: MyFunction<{ a: number }> = obj => obj.a;
//          '------> return `number`
