import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ProductDetails } from './product-details/product-details';

export const routes: Routes = [
    {
        path : '',
        component : Home
    },
    {
        path : 'productdetails/:id',
        component : ProductDetails 
    }
];
