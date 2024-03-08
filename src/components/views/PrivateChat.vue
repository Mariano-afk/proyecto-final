<template>
  <template v-if="isLoading">
    <div class="align-self-center mt-5">
      <img v-bind:srcset="loadingIMG" alt="logo cargando" class="img-responsive">
      <p>Cargando...</p>
    </div>
  </template>
  <template v-else>
    <div class="container my-4">
      <h1>Chat con: {{ profileUserMail }}</h1>

      <div class="chat mb-5" :style="{ backgroundImage: 'url(' + loadingIMG + ')' }">
        <div v-for="(mensaje, index) in mensajes.slice().reverse()" :key="index">
          <div :class="mensaje.id_autor === currentUser.id ? 'msgU1' : 'msgU2'">
            <div class="message-box">
              <p class="texto">{{ mensaje.texto }}</p>
              <p class="fecha">{{ mensaje.created_at }}</p>
            </div>
            
          </div>
        </div>
        <div ref="ultimoMensaje"></div>
      </div>

      <form @submit.prevent="enviarMensaje">
      <div class="chat-send-grid mt-5">
      <div class="divInputMsg">
        <label for="mensaje" class="d-none" >Mensaje:</label>
        <input type="text" class="form-control" id="mensaje" v-model="nuevoMensaje">
      </div>
      <div class="divButtonMsg d-flex justify-content-end">
        <button type="submit" class="btn btn-success send">
          <img v-bind:srcset="sendIMG" alt="Enviar" class="send-button-icon">
        </button>
      </div>
      </div>
      </form>


    </div>
  </template>
</template>
<script>

import { addDoc, collection, Timestamp, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import {authStateSubscribe} from "../../services/auth.js";
import loadingIMG from "../../../public/img/3Dteca.png"
import sendIMG from "../../../public/img/send-white.png"

export default {
name: 'PrivateChat',
data() {
  return {
    sendIMG,
    loadingIMG,
    isLoading: true,
    chatId:'',
    profileUserMail: '',
    currentUserMail: '',
    currentUser:'',
    nuevoMensaje: '',
    mensajes: [],
    authUser: null,
    chatId:'',
  };
},

async mounted() {

authStateSubscribe(user => {
  this.currentUser = user;
  this.currentUserMail = this.currentUser.email;
});
  this.profileUserMail = this.$route.params.email;
  await this.obtenerChatId();
  this.obtenerMensajes();
},


methods: {

async obtenerChatId() {
  const users = [this.currentUserMail, this.profileUserMail].sort();
  const q = query(collection(db, "usersPrivateChat"), where("users", "==", users));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    this.chatId = doc.id;
  } else {
      await this.crearChat();
  }
},

async crearChat() {
try {
  const chatData = {
    created_at: Timestamp.now(),
    users: [this.currentUserMail, this.profileUserMail]
  };
  const docRef = await addDoc(collection(db, "usersPrivateChat"), chatData);
  this.chatId = docRef.id;
} catch (error) {
    console.error("Error al crear el chat:", error);
  }
},

async obtenerMensajes() {
try {
  const mensajesRef = collection(db, `usersPrivateChat/${this.chatId}/mensajes`);
  onSnapshot(query(mensajesRef, orderBy('created_at', 'desc')), (snapshot) => {
  this.mensajes = [];
    snapshot.forEach((doc) => {
    this.mensajes.push(doc.data());
    });
    this.mensajes.forEach(mensaje => {

      const fecha = new Date(mensaje.created_at);
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1;
      const año = fecha.getFullYear();
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes();

      mensaje.created_at = `${dia}/${mes}/${año} ${hora}:${minutos}`;
    });
  });
} catch (error) {
    console.error('Error al obtener los mensajes:', error);
}
this.isLoading = false;
},

async enviarMensaje() {
  try {
  if (this.nuevoMensaje.trim() === '') return;

  const mensajesRef = collection(db, `usersPrivateChat/${this.chatId}/mensajes`);
  const mensajeData = {
    id_autor: this.currentUser.id,
    autor_mail: this.currentUser.email,
    texto: this.nuevoMensaje,
    created_at: new Date().toISOString()
  };
  await addDoc(mensajesRef, mensajeData);

  this.nuevoMensaje = '';
  } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }
}
};
</script>

<style>

.chat {
  width: 100%;
  height: 500px;
  overflow: auto;
  padding: 2%;
  border: 1px solid #ccc;
}

.chat::-webkit-scrollbar {
  width: 8px; /* Ancho de la barra de desplazamiento */
}

.chat::-webkit-scrollbar-thumb {
  background-color: darkslategrey; /* Color de la barra de desplazamiento */
  border-radius: 4px; /* Bordes redondeados */
}

.message-box p{
  margin-bottom: 0!important;
}

</style>
