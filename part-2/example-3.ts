type Temp = 'Cold' | 'Hot';
type Drink = 'Tea' | 'Coffee';

type RestaurantMenu = `${Temp} ${Drink}`;
//        '------> type of 'Cold Tea' | 'Cold Coffee' | 'Hot Tea' | 'Hot Coffee'
