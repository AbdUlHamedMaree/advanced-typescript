import { deepCall } from './deep-call';

const obj = {
  animals: {
    dog: {
      sound: 'WOFF!',
      maxAge: 12,
      canClimb: false,
      someFunc: (param: boolean) => `${param}`,
    },
    cat: {
      sound: 'MEOW!',
      maxAge: 8,
      canClimb: true,
      someFunc: (param: number) => (param > 0 ? '+' : '-'),
    },
  },
};

const get = deepCall(obj);

const catSound = get('animals.cat.sound');
//       '------> I want this to be of type `string`

const dogMaxAge = get('animals.dog.maxAge');
//        '------> I want this to be of type `number`

const func = get('animals.dog.someFunc');
//      '------> I want this to be of type `(param: boolean) => string`

const never = get('zxcvbn');
//                   '------> I want typescript to complain about this key!
