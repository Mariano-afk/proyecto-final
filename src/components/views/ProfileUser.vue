<template>
   <template v-if="isLoading">
    <div class="align-self-center mt-5">
      <img v-bind:srcset="loadingIMG" alt="logo cargando" class="img-responsive">
      <p>Cargando...</p>
    </div>
  </template>
  <template v-else>
  

    <div class="jumbotron jumbotron-fluid">
          <div class="container banner p-5">
            
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
              </div>
             </div>
           </div>
        
    <div id="profileConsole"></div>
    <div>
      
        <template v-if="impresoras.length !== 0">
          <div class="jumbotron jumbotron-fluid mt-5">
          <div class="container banner p-5">
            <h2 class="display-4 subtitulo-white">FAVORIT<span>O</span>S</h2>
            <p class="display-5">de: {{ userDataSave.displayName }}</p>
          </div>
        </div>
        </template>
        <template v-else>
          <div class="jumbotron jumbotron-fluid mt-5">
          <div class="container banner p-5">
            <h2 class="display-4">Parece que {{ userDataSave.displayName }} no tiene favoritos</h2>
          </div>
        </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
  
  <script>
  import { ref } from "vue";
  import 'regenerator-runtime/runtime'
  import { collection, doc, getDocs, query, where, getDoc } from 'firebase/firestore';
  import { db } from '../../services/firebase';
  import profile from '../../../public/img/default.png';
  import slide from '../../../public/img/default-slide.png';
  import loadingIMG from "../../../public/img/3Dteca.png"

  
  
  export default {
    name: 'lista_favoritos',
    data() {
      return {
        loadingIMG,
        isLoading: true,
        userMail: ref(''),
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

    async obtenerIdUsuarioPorCorreo(userMail) {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    let userId = null;
    querySnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.email === userMail) {
        userId = doc.id;
      }
    });
    return userId;
  } catch(error) {
    console.log("Error al obtener ID de usuario:", error);
    return null;
  }
},

async obtenerDatosUsuarioPorCorreo(userMail) {
  try {
    const userId = await this.obtenerIdUsuarioPorCorreo(userMail);
    if (!userId) {
      console.log("No se encontró el usuario con el correo electrónico:", userMail);
      return;
    }
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      this.userData = {
        id: docSnap.id,
        email: userData.email,
        displayName: userData.displayName,
        bio: userData.bio,
        foto: userData.foto,
        portada: userData.portada
      };
      this.userDataSave.displayName = this.userData.displayName;
      this.userDataSave.bio = this.userData.bio;
      if (this.userData.foto || this.userData.portada) {
        this.profileDataImg = this.userData.foto;
        this.portadaDataImg = this.userData.portada;
      }
    } else {
      console.log("¡No existe el documento del usuario con el correo electrónico:", userMail);
    }
  } catch(error) {
    console.log("Error al obtener datos del usuario:", error);
  }
  this.isLoading = false;
},

async obtenerDatosImpresorasPorCorreo(userMail) {
  try {
    const userId = await this.obtenerIdUsuarioPorCorreo(userMail);
    if (!userId) {
      console.log("No se encontró el usuario con el correo electrónico:", userMail);
      return;
    }
    const q = query(collection(db, "impresoras"), where("favoritos", "array-contains", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let impresora = doc.data();
      impresora.id = doc.id;
      this.impresoras.push(impresora);
    });
  } catch(error) {
    console.log(error);
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
   },
  
    mounted() {

  const userMail = this.$route.params.email;
  this.obtenerDatosUsuarioPorCorreo(userMail);
  this.obtenerDatosImpresorasPorCorreo(userMail);

    },
  
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
    .profilePicUser { grid-area: 3 / 1 / 5 / 3; }
    .div3 { grid-area: 5 / 1 / 6 / 3; }
    .div4 { grid-area: 5 / 3 / 6 / 5; justify-self: end;  }


    .portada{
        max-height: 440px;
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
    
    .align-self-center{
        text-align: center;
    }
  </style>