import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ProductDetails } from './product-details/product-details';
import { SignUp } from './sign-up/sign-up';
import { Login } from './login/login';
import { Cart } from './cart/cart';
export const routes: Routes = [
    {
        path: 'signup',
        component: SignUp
    },
    {
        path: 'productdetails/:id',
        component: ProductDetails
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Home
    },
    {
        path:'cart',
        component: Cart
    }
];
