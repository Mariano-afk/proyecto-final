import {createRouter, createWebHashHistory} from "vue-router";
import Home from "./../components/views/Home.vue";
import Login from "./../components/views/Login.vue";
import Register from "./../components/views/Register.vue";
import Profile from "./../components/views/Profile.vue";
import ProfileUser from "./../components/views/ProfileUser.vue";
import {authStateSubscribe} from "../services/auth.js";
import cargar_impresoras from "../components/views/admin/cargar_impresoras.vue";
import ver_impresoras from "../components/views/ver_impresoras.vue";
import cargar_filamentos from "../components/views/admin/cargar_filamentos.vue";
import ver_filamentos from "../components/views/ver_filamentos.vue";
import cargar_configuracion from "../components/views/admin/cargar_configuracion.vue";
import ver_configuracion from "../components/views/ver_configuracion.vue";
import cargar_diseño from "../components/views/admin/cargar_diseño.vue";
import ver_diseño from "../components/views/ver_diseño.vue";
import cargar_reparacion from "../components/views/admin/cargar_reparacion.vue";
import ver_reparacion from "../components/views/ver_reparacion.vue";
// import todos_favoritos from "../components/views/admin/todos_favoritos.vue";
import foros from "../components/views/foros.vue";
import ForoDetalle from '../components/views/ForoDetalle.vue';
import PrivateChat from '../components/views/PrivateChat.vue';

import { listenForAuthChanges } from "../services/auth.js";
import useAuth from "../composition/useAuth.js";


const routes = [
    {
        name: 'home',
        component: Home,
        path: '/',
    },
    {
        name: 'login',
        component: Login,
        path: '/iniciar-sesion',
    },
    {
        name: 'register',
        component: Register,
        path: '/registro',
    },
    {
        name: 'profile',
        component: Profile,
        path: '/perfil',
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: 'cargar-impresoras',
        component: cargar_impresoras,
        path: '/admin/impresoras',
        meta: {
            requiresAuth: true,
            requiresAdmin:true,
        }
    },
    {
        name: 'ver-impresoras',
        component: ver_impresoras,
        path: '/impresoras',
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: 'cargar-filamentos',
        component: cargar_filamentos,
        path: '/admin/filamentos',
        meta: {
            requiresAuth: true,
            requiresAdmin:true,
        }
    },
    {
        name: 'ver-filamentos',
        component: ver_filamentos,
        path: '/filamentos',
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: 'cargar-configuracion',
        component: cargar_configuracion,
        path: '/admin/configuracion',
        meta: {
            requiresAuth: true,
            requiresAdmin:true,
        }
    },
    {
        name: 'ver-configuracion',
        component: ver_configuracion,
        path: '/configuracion',
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: 'cargar-diseño',
        component: cargar_diseño,
        path: '/admin/diseño3D',
        meta: {
            requiresAuth: true,
            requiresAdmin:true,
        }
    },
    {
        name: 'ver-diseño',
        component: ver_diseño,
        path: '/diseño3D',
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: 'cargar-reparacion',
        component: cargar_reparacion,
        path: '/admin/reparacion',
        meta: {
            requiresAuth: true,
            requiresAdmin:true,
        }
    },
    {
        name: 'ver-reparacion',
        component: ver_reparacion,
        path: '/reparacion',
        meta: {
            requiresAuth: true,
        }
    },
    // {
    //     name: 'todos-favoritos',
    //     component: todos_favoritos,
    //     path: '/admin/favoritos',
    //     meta: {
    //         requiresAuth: true,
    //         requiresAdmin:true,
    //     }
    // },
    {
        name: 'foro',
        component: foros,
        path: '/foro',
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: 'ForoDetalle',
        component: ForoDetalle,
        path: '/foro/:id',
        props: true,
        meta: {
            requiresAdmin:true,
        }
    },
    {
        name: 'profileUser',
        component: ProfileUser,
        path: '/perfil/:email',
        props: true,
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: 'chatUser',
        component: PrivateChat,
        path: '/chat/:email',
        props: true,
        meta: {
            requiresAuth: true,
        }
      },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

/*
 |--------------------------------------------------------------------------
 | Manejo del acceso a rutas que requieran autenticación.
 |--------------------------------------------------------------------------
 */


let isAuthenticated = false;
let currentUser = null;

// Observamos el estado de autenticación.
authStateSubscribe(user => {
    currentUser = user;
    isAuthenticated = !!user;
});


//listenForAuthChanges(user => isAuthenticated = user.email !== null);

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/iniciar-sesion');
    } else if (to.meta.requiresAuth && to.meta.requiresAdmin && currentUser.rol != 'admin') {
        next('/');
    } else {
        next();
    }
});


export default router;