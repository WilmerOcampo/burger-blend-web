import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/admin',
  },
  {
    navCap: 'Productos',
  },
  {
    displayName: 'Productos',
    iconName: 'burger',
    route: '/admin/foods',
  },
  {
    displayName: 'Categorías',
    iconName: 'category',
    route: '/admin/categories',
  },
  {
    navCap: 'Usuarios',
  },
  {
    displayName: 'Usuarios',
    iconName: 'users',
    route: '/admin/users',
  },
  {
    displayName: 'Órdenes',
    iconName: 'checklist',
    route: '/admin/orders',
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
