# Advanced TypeScript - Part 1

## Generics

in this Section, I'll talk about a big concept in TypeScript,
Generics let you pass Types as a parameter to another block (function, class, interface, ...)

---

### Example

```typescript
type MyFunction<TArgs, TReturn> = (args: TArgs) => TReturn;

const numToString: MyFunction<number, string> = num => num.toString();
//         '---------> take `number` and return `string`
```

so type `MyFunction` now take two generics to describe the args type and the return type.

you can go further then that and type:

```typescript
type MyFunction<TArgs extends { a: unknown }, TReturn = TArgs['a']> = (
  args: TArgs,
) => TReturn;

const numToString: MyFunction<{ a: number }> = obj => obj.a;
//         '-------> return `number`
```

this infer the developer to use a arg that have `(a)` property and the return type will be the same type of this `(a)` property.

not interested yet?

---

## Look Up Type

it's a way in typescript to make it guess the type from the args with out need for type it your self.

### Example

```typescript
const anyToAny = <T>(arg: T) => arg;

// old 🤕
const oldNum = anyToAny<number>(1)

// new 🤩
const num = anyToAny(1)
//     '-------> type of `number`

// new 🤩
const str = anyToAny('pizza')
//     '-------> type of `string`
```

you see...

the typescript guess the type of the parameters without the need to pass
it!!

start to be interested? continue 😉

---

## Conditional Types

Conditional type mean that you depend on a condition to decide the type.

### Example

```typescript
type IsString<T> = T extends string ? true : false;

type PowerLvl1 = IsString<string>
//       '------> typeof `true`

type PowerLvl2 = IsString<number> extends true ? 'YES' : 'NO'
//       '------> typeof `'NO'`
```

you see that typescript guessing the type depending on conditions!

---

I hope you find this examples very helpful,
see you in the next part.
