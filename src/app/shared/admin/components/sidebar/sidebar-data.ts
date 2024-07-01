import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/',
  },
  {
    navCap: 'Productos',
  },
  {
    displayName: 'Productos',
    iconName: 'burger',
    route: '/foods',
  },
  {
    displayName: 'Categorías',
    iconName: 'category',
    route: '/categories',
  },
  {
    navCap: 'Usuarios',
  },
  {
    displayName: 'Usuarios',
    iconName: 'users',
    route: '/users',
  },
  {
    displayName: 'Órdenes',
    iconName: 'checklist',
    route: '/orders',
  },
/*  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'lock',
    route: '/auth',
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    route: 'openUserDialog()"',
  },*/
];
