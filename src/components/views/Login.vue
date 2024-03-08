<template>
    <div class="container">
    <template v-if="msgError === true">
        <div id="mensaje" class="mensaje-error mb-3">Credenciales incorrectas, intente de nuevo o registrese</div>
    </template>
    
    

    
    <h1>Iniciar Sesión</h1>

    <form action="#" method="post" @submit.prevent="handleLogin()">
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
            type="email"
            name="email"
            id="email"
            class="form-control"
            v-model="user.email">
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
            type="password"
            name="password"
            id="password"
            class="form-control"
            v-model="user.password">
        </div>
        <button type="submit" class="btn btn-primary w-100">Ingresar</button>
    </form>
</div>
</template>

<script>
import {login} from "../../services/auth.js";

export default {
name: "Login",
    data: () => ({
    msgError: false,
    user: {
        email: '',
        password: '',
    },
}),

methods: {

handleLogin() {
    login(this.user.email, this.user.password)
    .then(() => {                
        this.$router.push('/');
    })
    .catch(async error => {
        this.msgError = true;
        await new Promise(resolve => setTimeout(resolve, 5000));
        this.msgError = false;
    });
}
}
};
</script>

<style>
.mensaje-error {
    background-color: #dc5656;
    color: white;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
}
</style>
