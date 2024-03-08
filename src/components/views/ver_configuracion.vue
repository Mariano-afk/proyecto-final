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
        <h1 class="display-4 subtitulo-white">CONFIGURACI<span>O</span>NES</h1>
      </div>
    </div>
        <div class="container my-5">
            <div class="row row-cols-1 row-cols-md-4 g-4">
                <div class="col" v-for="(item, index) in configuraciones" :key="index">
                    <div class="card">
                    
                    <div class="card-body">
                        <h2 class="card-title"> {{item.nombre}}</h2>
                        <p class="card-text"> Temperatura de extrusor: {{item.tempExt}}</p>
                        <p class="card-text"> Temperatura de cama: {{item.tempCam}}</p>
                        <p class="card-text"> Velocidad: {{item.velocidad}}</p>
                        <p class="card-text"> Altura de Capa: {{item.altCap}}</p>
                        <p class="card-text"> Retracción: {{item.retraccion}}</p>
                        <p class="card-text"> Relleno: {{item.relleno}}</p>
                        <p class="card-text"> Velocidad de capa inicial: {{item.velCapIni}}</p>
                        <p class="card-text"> Velocidad de ventilador: {{item.velVent}}</p>
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
    name: 'cargar_configuraciones',
    data() {
        return {
          loadingIMG,
            isLoading: true,
          configuraciones: [],
          configuracion: {
            nombre: '',
            tempExt:'',
            tempCam:'',
            velocidad:'',
            retraccion: '',
            altCap: '',
            relleno: '',
            velCapIni: '',
            velVent: '',
            foto: ''
          }
        }
    },
    methods:{
    async obtenerDatos () { 
      const querySnapshot = await getDocs(collection(db, "configuraciones"));
        querySnapshot.forEach((doc) => {
        let configuracion = doc.data()
        configuracion.id = doc.id
        this.configuraciones.push(configuracion)
      });
      this.isLoading = false;
    }
    },
    mounted() {
      this.isLoading = true;

if (localStorage.getItem('configuraciones')) {
  this.configuraciones = JSON.parse(localStorage.getItem('configuraciones'));
  this.isLoading = false;
} else {
  this.obtenerDatos().then(() => {
    localStorage.setItem('configuraciones', JSON.stringify(this.configuraciones));
    this.isLoading = false;
  });
}
    },
}
</script>