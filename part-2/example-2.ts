type LaptopModel = {
  name: string;
  price: number;
  old?: boolean;
};

type OldLaptopMap = {
  [Key in 'asus' | 'hp']: LaptopModel;
};

type NewLaptopMap = {
  [Key in 'asus' | 'hp']?: LaptopModel;
};

const laptopMap: NewLaptopMap = {
  asus: {
    name: 'Hot Pizza!',
    price: 100,
    old: false,
  },
};
