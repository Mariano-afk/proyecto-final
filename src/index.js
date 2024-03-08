import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './styles/main.css';
import '../public/fonts/Elianto-Regular.ttf';
import './services/firebase.js';
import 'regenerator-runtime/runtime';
import {createApp} from "vue";
import router from "./router/router.js";
import App from './App.vue';

createApp(App)
    .use(router)
    .mount('#root');