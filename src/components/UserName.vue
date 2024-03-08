<template>
    <router-link :to="`/perfil/${email}`" class="UserName">{{email}}</router-link>
</template>

<script>

export default {
    name: "UserName",
    props: {
        email: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const email = props.email;

        return {
            email,
        }
    }
};
</script>

<style>
.UserName {
    font-weight: 700;
}
</style>
