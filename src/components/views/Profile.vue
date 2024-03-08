<template>

  <template v-if="msg === true">
    <div id="mensaje" class="mensaje mb-3">Se actualizó el perfil</div>
  </template>

  <template v-if="isLoading">
    <div class="align-self-center mt-5">
      <img v-bind:srcset="loadingIMG" alt="logo cargando" class="img-responsive">
    <p>Cargando...</p>
    </div>
  </template>

  <template v-else>

    <div class="jumbotron jumbotron-fluid">
      <div class="container banner p-5">
        <h1 class="display-4 subtitulo-white">TUS DAT<span>O</span>S</h1>
      </div>
    </div>
    <div class="d-flex justify-content-center align-items-center">
             <div class="card">
              <div class="upper">
                <img :src="userData.portada" class="img-fluid">
                <div class="user text-center">
                  <img :src="userData.foto" class="rounded-circle" width="200">
                </div>
              </div>

              <div class="mt-5 pt-5 text-center align-self-center">
                <h4 class="mb-0 mt-4">{{ userDataSave.displayName }}</h4>
                <span class="text-muted d-block mb-2">{{ userData.email }}</span>
                <span class="text-muted d-block mb-2 bioProfile">{{ userData.bio }}</span>
                <button class="btn btn-secondary mt-3" onclick="window.modal.showModal();">Editar perfil</button>
                <div class="d-flex justify-content-between align-items-center mt-4 px-4">
                </div>
              </div>
             </div>
           </div>
    <div id="app">
  <!-- Botón circular -->
  <button class="floating-button" @click="toggleChats">
    <img v-bind:srcset="chatImg" alt="chat">
  </button>
    <div class="chats-container" :class="{ 'visible': showChats }">
      <h2 class="visually-hidden align-self-center my-5">Tus chats</h2>
      <template v-if="chats.length == 0">
        <p>Para ver tus chats tenes que iniciar alguno, en los foros hay muchos usuarios con los cuales podes entablar conversaciones</p>
      </template>
        <table class="table">
        <!-- <thead>
          <tr scope="row">
            <th scope="col">Usuario</th>
            <th scope="col">Ver perfil</th>
            <th scope="col">Chat</th>
          </tr>
        </thead> -->
        <tbody>
          <tr v-for="(item, index) in chats" :key="index">
            <td>
              {{item.users}}
            </td>
            <td>
              <router-link class="btn btn-primary" :to="{ name: 'profileUser', params: { email: item.users } }">
              Perfil
              </router-link>
            </td>
            <td>
              <router-link 
              class="btn btn-success"
              v-if="userData.email" :to="{ name: 'chatUser', params: { email: item.users } }"
              >Chat
            </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
    </div>

  <dialog id="modal">
    <div class="row">
      <span class="col-10">Editar perfil</span>
      <div class="col-2">
        <button class="btn btn-danger" onclick="window.modal.close();">X</button>
      </div>
    </div>

    <form>

      <div class="mt-4">
        <span class="input-group-text mb-3">Foto de perfil</span>
        <img class="imgCargada" :src="profileDataImg">
      </div>

      <div class="input-group my-3">
        <input type="file" @change="buscarProfilePic($event)">
      </div>

      <div class="mt-4">
        <span class="input-group-text mb-3">Foto de portada</span>
        <img class="imgCargada" :src="portadaDataImg">
      </div>

      <div class="input-group my-3">
        <input type="file" @change="buscarImagenPortada($event)">
      </div>

      <div class="input-group mb-3">
        <span class="input-group-text">Nombre</span>
        <input v-model="userData.displayName" type="text" class="form-control">
      </div>

      <div class="input-group mb-3">
        <span class="input-group-text">Biografia</span>
        <textarea v-model="userData.bio" type="text" class="form-control" maxlength="250"></textarea>
      </div>                

      <div class="mt-3">  
        <button 
          @click.prevent="actualizarDato(id)" 
          class="btn btn-primary">
          Actualizar
        </button>
      </div>
    </form>
  </dialog>


    
      <template v-if="impresoras.length !== 0">
        <div class="jumbotron jumbotron-fluid mt-5">
          <div class="container banner p-5">
            <h2 class="display-4 subtitulo-white">FAVORIT<span>O</span>S</h2>
          </div>
        </div>
      </template>

      <template v-else>
        <p class="align-self-center">Tu perfil parece vacio, date una vuelta por la seccion de impresoras para agregar a favoritos :D</p>
      </template>

      <div class="container my-5">
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <div class="col" v-for="(item, index) in impresoras" :key="index">
          <div class="card">
            <img :src= "item.foto" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title"> {{item.nombre}}</h5>
              <p class="card-text"> {{item.descripcion}}</p>
              <p class="card-text"> {{item.precio + "$"}}</p>
              <div class="mt-3">  
                <button 
                  v-on:click="quitarFav(item)"
                  class="btn btn-danger">
                  Quitar de favoritos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
<script>

import { updateUserProfile } from "../../services/auth.js";
import { ref } from "vue";
import useAuth from "../../composition/useAuth.js";
import 'regenerator-runtime/runtime'
import { collection, updateDoc, doc, getDocs, query, where, arrayRemove, getDoc } from 'firebase/firestore';
import { db, storageRef } from '../../services/firebase';
import routes from '../../router/router';
import profile from '../../../public/img/default.png';
import slide from '../../../public/img/default-slide.png';
import loadingIMG from "../../../public/img/3Dteca.png"
import chatImg from "../../../public/img/chats-white.png"


export default {
name: 'lista_favoritos',
data() {
  return {
    chatImg,
    loadingIMG,
    showChats: false,
    isLoading: true,
    chats:[],
    msg: false,
    profileDataImg: null,
    portadaDataImg: null,
    profileFile: null,
    portadaFile: null,
    userDataSave: {
      displayName: '',
      bio: '',
    },
    userData: {
      displayName: '',
      bio: '',
      foto:'',
      portada:'',
      email:'',
    },
    profile: [
    { img:profile },
    ],
    slide: [
    { img:slide },
    ],
    impresoras: [],
    impresora: {
    favoritos: {},
      id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      foto: '',
    },
  }
},
methods:{

  toggleChats() {
      this.showChats = !this.showChats;
    },


async obtenerDatos() { 
try {
  await this.waitForUserData();
  const q = query(collection(db, "impresoras"), where("favoritos", "array-contains", this.authUser.id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let impresora = doc.data()
    impresora.id = doc.id
    this.impresoras.push(impresora)
  });
} catch(error){
    console.log(error);
  }
},

async obtenerPrivateChatsPorUsuario() {
try {
  await this.obtenerDatoID();
  const q = query(collection(db, 'usersPrivateChat'), where('users', 'array-contains', this.userData.email));
  const querySnapshot = await getDocs(q);

  let privateChatUser = '';

  querySnapshot.forEach((doc) => {
  let chat = doc.data();
  chat.id = doc.id;

  const filteredUsers = chat.users.filter(user => user !== this.authUser.email);

  if (filteredUsers.length > 0) {
    const emails = filteredUsers.join(', ');
    privateChatUser += `${emails}, `;
  }

  privateChatUser = privateChatUser.slice(0, -2);

  chat.users = privateChatUser;
  this.chats.push(chat);

  });

} catch (error) {
    console.error('Error al obtener los chats privados del usuario:', error);
    return privateChatUser;
  }
},

buscarProfilePic(event){
const tipoArchivo = event.target.files[0].type;
if(tipoArchivo === 'image/jpeg' || tipoArchivo === 'image/jpg' || tipoArchivo === 'image/png'){
  this.profileFile = event.target.files[0]
  this.error = null
}
else{
  this.error = 'Archivo no válido'
  this.profileFile = null
  return 
}
const reader = new FileReader();
reader.readAsDataURL(this.profileFile);
reader.onload = (e) => {
  this.profileDataImg = e.target.result
}
},

buscarImagenPortada(event){
const tipoArchivo = event.target.files[0].type;
if(tipoArchivo === 'image/jpeg' || tipoArchivo === 'image/jpg' || tipoArchivo === 'image/png'){
  this.portadaFile = event.target.files[0]
  this.error = null
}
else{
  this.error = 'Archivo no válido'
  this.portadaFile = null
  return 
}
const reader = new FileReader();
reader.readAsDataURL(this.portadaFile);
reader.onload = (e) => {
  this.portadaDataImg = e.target.result
  }
},

async quitarFav(item){
try{
  const rutaFavoritos = doc(db, "impresoras/" + item.id);
  await updateDoc(rutaFavoritos, {
  favoritos: arrayRemove(this.authUser.id)
  });
} finally {
    this.obtenerDatos();
    routes.push('/perfil');
  }
},

abrirModal() {
  this.obtenerDatoID();
  window.modal.showModal();
},
cerrarModal() {
  window.modal.close();
},

async waitForUserData() {
while (!this.authUser.id) {
  await new Promise(resolve => setTimeout(resolve, 500));
  }
},

async obtenerDatoID() {

try {
  await this.waitForUserData();
  const docRef = doc(db, "users", this.authUser.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const userData = docSnap.data();
    this.userData = {
      id: docSnap.id,
      displayName: userData.displayName,
      bio: userData.bio,
      foto: userData.foto,
      portada: userData.portada,
      email: userData.email,
    };
    this.userDataSave.displayName = this.userData.displayName;
    this.userDataSave.bio = this.userData.bio;
    if (this.userData.foto || this.userData.portada) {
      this.profileDataImg = this.userData.foto;
      this.portadaDataImg = this.userData.portada;
    }
  } else {
      console.log("¡No existe el documento!");
    }
} catch {
    console.error("Error al obtener datos del usuario:", error);
  }
this.isLoading = false;
},

async actualizarDato() {
try {
  if (this.profileFile && this.portadaFile) {
    const profileBlob = await this.resizeAndCrop(this.profileFile, 250, 250);
    await storageRef.child('imagenes').child(this.profileFile.name).put(profileBlob);

    await storageRef.child('imagenes').child(this.portadaFile.name).put(this.portadaFile);
    const urlProfile = await storageRef.child('imagenes').child(this.profileFile.name).getDownloadURL();
    const urlPortada = await storageRef.child('imagenes').child(this.portadaFile.name).getDownloadURL();
    const elemento = doc(db, "users", this.userData.id);
    await updateDoc(elemento, {
        displayName: this.userData.displayName,
        bio: this.userData.bio,
        foto: urlProfile,
        portada: urlPortada
    });
  } else if(this.profileFile) {
    const profileBlob = await this.resizeAndCrop(this.profileFile, 250, 250);
    await storageRef.child('imagenes').child(this.profileFile.name).put(profileBlob);

    const urlProfile = await storageRef.child('imagenes').child(this.profileFile.name).getDownloadURL();
    const elemento = doc(db, "users", this.userData.id);
    await updateDoc(elemento, {
        displayName: this.userData.displayName,
        bio: this.userData.bio,
        foto: urlProfile,
    });
  } else if(this.portadaFile) {
    await storageRef.child('imagenes').child(this.portadaFile.name).put(this.portadaFile);
    const urlPortada = await storageRef.child('imagenes').child(this.portadaFile.name).getDownloadURL();
    const elemento = doc(db, "users", this.userData.id);
    await updateDoc(elemento, {
        displayName: this.userData.displayName,
        bio: this.userData.bio,
        portada: urlPortada
    });
  } else {
    const elemento = doc(db, "users", this.userData.id);
    await updateDoc(elemento, {
        displayName: this.userData.displayName,
        bio: this.userData.bio,
    });
  }

  this.error = 'Datos actualizados correctamente';
  this.file = null;
} catch (error) {
    console.log(error);
    this.error = 'Error al actualizar los datos';
} finally {
    this.cerrarModal();
    this.obtenerDatoID();
    this.msg = true;
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.msg = false;
  }
},

resizeAndCrop(imageFile, width, height) {
return new Promise((resolve, reject) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const image = new Image();

  image.onload = () => {
  const aspectRatio = image.width / image.height;

  let cropWidth, cropHeight, cropX, cropY;
  if (aspectRatio > width / height) {
    cropWidth = image.height * (width / height);
    cropHeight = image.height;
    cropX = (image.width - cropWidth) / 2;
    cropY = 0;
  } else {
    cropWidth = image.width;
    cropHeight = image.width * (height / width);
    cropX = 0;
    cropY = (image.height - cropHeight) / 2;
  }

  canvas.width = width;
  canvas.height = height;

  context.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height);

  canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9);
  };
  image.onerror = () => reject(new Error('Error al cargar la imagen'));
  image.src = URL.createObjectURL(imageFile);
});
},
},

mounted() {
  this.obtenerDatos();
  this.obtenerDatoID();
  this.obtenerPrivateChatsPorUsuario();
},

setup() {
  const {authUser} = useAuth();

  const form = ref({
  displayName: "null",
  bio: "null",
});

form.value.displayName = authUser.value.displayName;
form.value.bio = authUser.value.bio;

function updateProfile() {
  updateUserProfile(form.value, authUser._rawValue.id);
}

return {
  authUser,
  form,
  updateProfile,
};
}
};
</script>

<style>
.parent {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.div1 { grid-area: 1 / 1 / 5 / 5; }
.profilePicAuthUser { grid-area: 3 / 1 / 5 / 3; }
.div3 { grid-area: 5 / 1 / 6 / 3; }
.div4 { grid-area: 5 / 3 / 6 / 5; justify-self: end;  }


.portada{
  max-height: 400px;
  width: auto;
  max-width: 100%;
}

.profile{
  max-height: 200px;
  width: auto;
  max-width: 100%;
}

.imgCircular {
  border-radius: 50%;
}

.mensaje {
  background-color: lightgreen;
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.align-self-center{
  text-align: center;
}

.imgCircular {
        border-radius: 50%;
    }

    .floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: #fff;
  border: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
}

/* Estilos del contenedor de los chats */
.chats-container {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 500px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  display: none;
  z-index: 999;
}

/* Estilos para mostrar el contenedor de los chats */
.chats-container.visible {
  display: block;
}

.floating-button img {
  width: 20px;
  height: 20px;
}

.bioProfile{
  max-width: 550px;
}

.upper {
  position: relative;
}

.user img {
  position: absolute;
  top: 65%; /* Ubica la foto de perfil a un 50% de su altura desde arriba */
  left: 50%;
  transform: translateX(-50%); /* Centra la foto de perfil horizontalmente */
}

.background-card{
  background-color: #D17A35;
}
</style>