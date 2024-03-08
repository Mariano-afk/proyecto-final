<template>
  <template v-if="msg === true">
    <div id="mensaje" class="mensaje mb-3">Se añadió a favoritos</div>
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
        <h1 class="display-4 subtitulo-white">IMPRES<span>O</span>RAS</h1>
      </div>
    </div>
    <div class="container my-5">
        <div class="row row-cols-1 row-cols-md-4 g-4">
          <div class="col" v-for="(impresora, index) in impresoras" :key="index">
            <form>
              <div class="card">
                <div class="card-body">
                  <h2 class="card-title"> {{impresora.nombre}}</h2>
                  <p class="card-text"> {{impresora.descripcion}}</p>
                  <p class="card-text"> {{impresora.precio + "$"}}</p>
                  <div class="mt-3">  
                    <button 
                    v-on:click="agregarFav(impresora)"
                    class="btn btn-primary">
                    Agregar a favoritos
                    </button>  
                  </div>
                </div>
              <img :src= "impresora.foto" class="card-img-top" :alt="impresora.nombre">
              </div>
            </form>
          </div>
        </div>
        </div>
  </template>
        
</template>

<script>
import 'regenerator-runtime/runtime'
import { collection, getDocs, doc, arrayUnion, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import routes from '../../router/router';
import useAuth from "../../composition/useAuth.js";
import loadingIMG from "../../../public/img/3Dteca.png"

export default {
    name: 'cargar_impresoras',
    data() {
        return {
          loadingIMG,
          msg: false,
          isLoading: true,
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
    async obtenerDatos () { 
      const querySnapshot = await getDocs(collection(db, "impresoras",));
        querySnapshot.forEach((doc) => {
        let impresora = doc.data()
        impresora.id = doc.id
        this.impresoras.push(impresora)
      });
      this.isLoading = false;
    },

    async waitForUserData() {
      while (!this.authUser.id) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      },
    
      async agregarFav(impresora){
        try{
        await this.waitForUserData();
        const rutaFavoritos = doc(db, "impresoras/" + impresora.id);
        await updateDoc(rutaFavoritos, {
          favoritos: arrayUnion(this.authUser.id)
      });
      }
            catch (error) {
            console.log(error);
          } 
          finally {
            this.msg = true;
            await new Promise(resolve => setTimeout(resolve, 5000));
            this.msg = false;
          }
      },

    },
    mounted() {
      
      this.isLoading = true;

      if (localStorage.getItem('impresoras')) {
        this.impresoras = JSON.parse(localStorage.getItem('impresoras'));
        this.isLoading = false;
      } else {
        this.obtenerDatos().then(() => {
          localStorage.setItem('impresoras', JSON.stringify(this.impresoras));
          this.isLoading = false;
        });
      }


    },
    setup() {
      const {authUser} = useAuth();

      return {
        authUser,
      };
    }
}
</script>

<style>
.card-img-top {
  height: 200px; /* Establece la altura deseada para las imágenes */
  object-fit: contain; /* Esto asegura que las imágenes se ajusten al contenedor manteniendo su relación de aspecto */
  width: 100%; /* Ajusta la anchura para que las imágenes sean fluidas */
}
</style>