type MyFunction<TArgs, TReturn> = (args: TArgs) => TReturn;

const numToString: MyFunction<number, string> = num => num.toString();
//         '------> take `number` and return `string`
