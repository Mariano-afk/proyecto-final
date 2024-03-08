<template>

  <template v-if="isLoading">
    <div class="align-self-center mt-5">
      <img v-bind:srcset="loadingIMG" alt="logo cargando" class="img-responsive">
      <p>Cargando...</p>
    </div>
  </template>

  <template v-else>

  <div class="container my-4">

    <div class="dataforo row align-self-center mb-5">
      <h1 class="col-12 mb-5">Título: {{ foro.nombre }}</h1>
      <p class="blockquote col-12 mb-5">Descripción: {{ foro.descripcion }}</p>
      <p class="blockquote col-6">Foro abierto el: {{ formatDate }}</p>
      <p class="blockquote col-6">Creado por: {{ foro.creador }}</p>
    </div>

  <div class="chat-container">
        <div class="chat" :style="{ backgroundImage: 'url(' + loadingIMG + ')' }">
          <template v-for="(mensaje, index) in mensajes">
      <template v-if="mensaje.id_autor == authUser.id">
        <div class="msgU1">
          <div class="text-right message-box">
            <p :key="index" class="texto">
          {{ mensaje.texto }}
          </p>
          <p :key="index" class="fecha">
            {{ mensaje.fecha }}
          </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="msgU2">
          <router-link class="autor" v-if="mensaje.autor_mail" :to="{ name: 'profileUser', params: { email: mensaje.autor_mail } }">
            <p class="mb-0">{{ mensaje.autor_mail }}</p>
          </router-link>
          <div class="text-left colorUser2 message-box">
            <p :key="index" class="texto">
            {{ mensaje.texto }}
          </p>
          <p :key="index" class="fecha">
            {{ mensaje.fecha }}
          </p>
          </div>
          
        </div>
      </template>
    </template>
    <div ref="ultimoMensaje"></div>
        </div>
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

import { doc, collection, addDoc, getDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import useAuth from "../../composition/useAuth.js";
import loadingIMG from "../../../public/img/3Dteca.png";
import sendIMG from "../../../public/img/send-white.png"

export default {
name: 'ForoDetalle',
data() {
  return {
    sendIMG,
    loadingIMG,
    isLoading: true,
    formatDate:'',
    foro: {},
    nuevoMensaje: '',
    mensajes: [],
    authUser: null,
    lastAutor: null
  };
},
watch: {
mensajes: {
  handler(newValue) {
    if (newValue.length > 0) {
      this.lastAuthor = newValue[0].autor;
    }
  },
  deep: true
}
},
async mounted() {

const idForo = this.$route.params.id;
this.foro = await this.obtenerForoPorId(idForo);
this.obtenerMensajes(idForo);

const {authUser} = useAuth();
this.authUser = authUser;

const date = new Date(this.foro.created_at.seconds * 1000 + this.foro.created_at.nanoseconds / 1000000);
this.formatDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;    

},

methods: {

  async waitForUserData() {
    while (!this.authUser.id) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  },

  async obtenerForoPorId(idForo) {
    const foroDoc = await getDoc(doc(db, 'foros', idForo));
    return foroDoc.exists() ? { ...foroDoc.data(), id: foroDoc.id } : null;
    },

    async obtenerMensajes(idForo) {
  const mensajesRef = collection(db, `foros/${idForo}/mensajes`);
  const mensajesQuery = query(mensajesRef, orderBy('fecha', 'asc'));
  onSnapshot(mensajesQuery, (snapshot) => {
    this.mensajes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.isLoading = false;

    console.log(this.mensajes);

    this.$nextTick(() => {
      if (this.$refs.ultimoMensaje) {
        this.$refs.ultimoMensaje.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });

    let last_autor = '';
    this.mensajes.forEach(mensaje => {

      const fecha = new Date(mensaje.fecha);
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1;
      const año = fecha.getFullYear();
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes();

      mensaje.fecha = `${dia}/${mes}/${año} ${hora}:${minutos}`;


      if (mensaje.autor_mail !== last_autor) {
        last_autor = mensaje.autor_mail;
      } else {
        mensaje.autor_mail = '';
      }
    });
  });
},



  async enviarMensaje() {
    if (this.nuevoMensaje.trim() === '') return;

    try {
      const idForo = this.$route.params.id;
      const mensajeData = {
      id_autor: this.authUser.id,
      autor_name: this.authUser.displayName,
      autor_mail: this.authUser.email,
      texto: this.nuevoMensaje,
      fecha: new Date().toISOString()
    };
      await addDoc(collection(db, `foros/${idForo}/mensajes`), mensajeData);
      this.nuevoMensaje = '';
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
      }
    }
  }
};

</script>

<style>
.text-right{
  text-align: right;
}

.sameAutor strong {
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color:white;
}

.message-box {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 20px;
  margin: 5px 0;
}

.msgU1 {
  text-align: right;
}

.msgU1 .message-box {
  background-color: #DCF8C6;
}

.msgU2 .message-box {
  background-color: #E2E2E2;
}

.autor {
  text-decoration: none;
  font-weight: bold;
  color: darkslategrey
}

.texto{
  margin-bottom: 0!important;
}

.fecha{
  margin-bottom: 0!important;
  font-size: smaller;
  text-align: end;
}

.send {
  background-color: rgb(87, 183, 87); /* Color de fondo verde */
  border: none; /* Quitar borde */
  border-radius: 50%; /* Hacer el botón redondo */
  padding: 10px; /* Ajustar el padding según sea necesario */
}

.send-button-icon {
  width: 24px; /* Ajusta el ancho de la imagen según sea necesario */
  height: 24px; /* Ajusta el alto de la imagen según sea necesario */
}

.chat-send-grid {
  display: grid;
  grid-template-columns: 9fr 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  align-items: center;
}

.divInputMsg { grid-area: 1 / 1 / 2 / 2; }
.divButtonMsg { grid-area: 1 / 2 / 2 / 3; }

.dataforo{
  border: 1px solid #ccc;
  margin: 0;
  padding: 3%;
}

.chat{
  background-size: contain; /* Ajusta el tamaño para cubrir todo el contenedor */
  background-position: center; /* Centra la imagen de fondo */
  background-repeat: no-repeat;
}
</style>
