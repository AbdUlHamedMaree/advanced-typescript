const anyToAny = <T>(arg: T) => arg;

// old
const oldNum = anyToAny<number>(1)

// new!
const num = anyToAny(1)
//     '------> typeof `number`

// new!
const str = anyToAny('pizza')
//     '------> typeof `string`