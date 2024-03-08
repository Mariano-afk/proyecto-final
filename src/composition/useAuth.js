import {onUnmounted, ref} from "vue";
import {authStateSubscribe} from "../services/auth.js";

/**
  @return {{authUser: ToRef<{displayName: null, email: null, rol: null}>}}
 */
export default () => {
    const authUser = ref({
        id: null,
        email: null,
        displayName: null,
        rol: null,
    });

    const unsubscribe = authStateSubscribe(user => authUser.value = user);

    onUnmounted(() => {
        unsubscribe();
    });

    return {
        authUser,
    };
}
