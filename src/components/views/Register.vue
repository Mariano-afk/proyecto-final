<template>
    <div class="container">
    <h1>Registro</h1>

    <form @submit.prevent="handleSubmit">
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
                type="email"
                id="email"
                class="form-control"
                v-model="form.email">
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
                type="password"
                id="password"
                class="form-control"
                v-model="form.password">
        </div>
        <button type="submit" class="btn btn-primary">Registrarse</button>
    </form>
</div>
</template>

<script>
import {ref} from "vue";
import {register} from "../../services/auth.js";
import routes from '../../router/router';

export default {
    name: "Register",
    setup() {
        const form = ref({
            email: '',
            password: '',
        });

        const handleSubmit = () => {
            try{
            register(form.value.email, form.value.password)
                .then(() => {
                    form.value = {
                        email: '',
                        password: '',
                    }
                });
                }
            catch (error) {
            console.log(error);
          } 
          finally {
            routes.push('/')
          }
        }
        

        return {
            form,
            handleSubmit,
        }
    }
};
</script>

<style>

</style>
