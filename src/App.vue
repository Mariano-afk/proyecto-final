<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="navbar-dark bg-dark container-fluid">
            <a 
            links 
            v-for="item in logo"
            :key="item" 
            class="navbar-brand" href="#">
                <img id="logo" v-bind:srcset="item.img"/></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Abrir/cerrar menú de navegación">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-dark bg-dark navbar-collapse" id="navbar">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <template v-if="authUser.email !== null && authUser.rol == 'comun'">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/foro">Foro</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/perfil">Perfil</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/impresoras">Impresoras</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/filamentos">Filamentos</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/configuracion">Configuración</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/diseño3D">Diseños</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/reparacion">Reparación</router-link>
                        </li>
                        <li class="nav-item">
                            <button
                                type="button"
                                class="btn nav-link"
                                @click="doLogout"
                            >Cerrar Sesión ({{ authUser.displayName || authUser.email }})</button>
                        </li>
                    </template>
                    <template v-if="authUser.rol == 'admin'">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/foro">Foro</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/perfil">Perfil</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/admin/impresoras">Panel Impresoras</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/admin/filamentos">Panel Filamentos</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/admin/configuracion">Panel Configuración</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/admin/diseño3D">Panel Diseños</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/admin/reparacion">Panel Reparación</router-link>
                        </li>
                        <!-- <li class="nav-item">
                            <router-link class="nav-link" to="/admin/favoritos">Panel Favoritos</router-link>
                        </li> -->
                        <li class="nav-item">
                            <button
                                type="button"
                                class="btn nav-link"
                                @click="doLogout"
                            >Cerrar Sesión ({{ authUser.displayName || authUser.email }})</button>
                        </li>
                    </template>
                    <template
                        v-if="authUser.email == null">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/iniciar-sesion">Iniciar Sesión</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/registro">Registrarse</router-link>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
    <main >
        <router-view />
    </main>
    <footer class="footer">
        <p class="elianto">Printing...</p>
    </footer>
</template>

<script>
import Logo from '../public/img/Logo.jpg';
import '../public/fonts/Elianto-Regular.ttf'
import {authStateSubscribe, logout} from "./services/auth.js";
// import {ref} from "vue";
import {useRouter} from "vue-router";
import useAuth from "./composition/useAuth.js";

export default {
    name: "App",
     data: () => ({
         logo: [
                {
                img:Logo,
                },
         ]
     }),

     methods:{
        
     },
        setup() {
       
        const {authUser} = useAuth();
        const router = useRouter();

        function doLogout() {
            logout().then(() => {
                router.push({
                    path: '/iniciar-sesion'
                });
            });
        }

        return {
            authUser,
            doLogout,
        };
    },

    mounted() {
    // Este código se ejecutará después de que el componente se haya montado
    const {authUser} = useAuth();
  }

};
</script>
