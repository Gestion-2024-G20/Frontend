import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { 
        path: 'login', 
        loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
    },
    { 
        path: 'register', 
        loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent)
    },
    { 
        path: 'request/:group_id/:token', 
        loadComponent: () => import('./pages/request/request.component').then((m) => m.RequestComponent)
    },
    { 
        path: 'hello', 
        loadComponent: () => import('./hello/hello.component').then((m) => m.HelloComponent)
    },
    { 
        path: '', 
        loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
        canActivate: [authGuard], 
        children: [
            { 
                path: 'home', 
                loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
            },
            // Acá irian otras rutas que solo se accede autenticado
            {
                path: 'group/:group_id',
                loadComponent: () => import('./pages/group/group.component').then((m) => m.GroupComponent),
            },   
            {
                path: 'group/config/:group_id',
                loadComponent: () => import('./pages/group-config/group-config.component').then((m) => m.GroupConfigComponent),
            },       
        ]

    },
    { 
        path: '**', // cualquier otra ruta que no exista
        redirectTo: 'login'
    }
    
  ];