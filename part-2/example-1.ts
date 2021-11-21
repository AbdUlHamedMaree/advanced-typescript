type FoodModel = {
  name: string;
  price: number;
  hot?: boolean;
};

type FoodMap = {
  [Key: string]: FoodModel;
};
// OR in better way
// type FoodMap = Record<string, FoodModel>;;

const foodMap: FoodMap = {
  pizza: {
    name: 'Hot Pizza!',
    price: 100,
    hot: true,
  },
  // anyString: {...},
};
