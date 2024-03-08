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
        <h1 class="display-4 subtitulo-white">FILAMENT<span>O</span>S</h1>
      </div>
    </div>
      <div class="container my-5">
        <div class="row row-cols-1 row-cols-md-4 g-4">
            <div class="col" v-for="(item, index) in filamentos" :key="index">
                <div class="card">
                
                <div class="card-body">
                    <h2 class="card-title"> {{item.nombre}}</h2>
                    <p class="card-text"> {{item.descripcion}}</p>
                    <p class="card-text">Medida:{{item.medida}}</p>
                    <p class="card-text">Peso: {{item.peso}}</p>
                    <p class="card-text">Colores: {{item.color}}</p>
                    <p class="card-text">Precio: {{item.precio + "$"}}</p>
                </div>
                  <img :src= "item.foto" class="card-img-top">
                </div>
            </div>
        </div>
      </div>
  </template>
</template>

<script>
import 'regenerator-runtime/runtime'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import loadingIMG from "../../../public/img/3Dteca.png"

export default {
    name: 'cargar_filamentos',
    data() {
        return {
          loadingIMG,
            isLoading: true,
          filamentos: [],
          filamento: {
            nombre: '',
            descripcion:'',
            medida:'',
            peso:'',
            color: '',
            precio: '',
            foto: ''
          }
        }
    },
    methods:{
    async obtenerDatos () { 
      const querySnapshot = await getDocs(collection(db, "filamentos"));
        querySnapshot.forEach((doc) => {
        let filamento = doc.data()
        filamento.id = doc.id
        this.filamentos.push(filamento)
      });
      this.isLoading = false;
    }
    },
    mounted() {
      this.isLoading = true;

if (localStorage.getItem('filamentos')) {
  this.filamentos = JSON.parse(localStorage.getItem('filamentos'));
  this.isLoading = false;
} else {
  this.obtenerDatos().then(() => {
    localStorage.setItem('filamentos', JSON.stringify(this.filamentos));
    this.isLoading = false;
  });
}
        
    },
}
</script>