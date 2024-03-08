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
        <h1 class="display-4 subtitulo-white">REPARACI<span>O</span>NES</h1>
      </div>
    </div>
    <div class="container my-5">
    <div class="row row-cols-1 row-cols-md-4 g-4">
        <div class="col" v-for="(item, index) in reparaciones" :key="index">
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">{{item.problema}}</h2>
                    <p class="card-text">Posible causa: {{item.causa}}</p>
                    <p class="card-text">Posible solución: {{item.solucion}}</p>
                </div>
                <img :src="item.foto" class="card-img-top">
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
    name: 'cargar_reparacion',
    data() {
        return {
          loadingIMG,
            isLoading: true,
          reparaciones: [],
          reparacion: {
            problma: '',
            causa: '',
            solucion: '',
            foto: ''
          }
        }
    },
    methods:{
    async obtenerDatos () { 
      const querySnapshot = await getDocs(collection(db, "reparaciones"));
        querySnapshot.forEach((doc) => {
        let reparacion = doc.data()
        reparacion.id = doc.id
        this.reparaciones.push(reparacion)
      });
      this.isLoading = false;
    }
    },
    
    mounted() {
      this.isLoading = true;

if (localStorage.getItem('reparaciones')) {
  this.reparaciones = JSON.parse(localStorage.getItem('reparaciones'));
  this.isLoading = false;
} else {
  this.obtenerDatos().then(() => {
    localStorage.setItem('reparaciones', JSON.stringify(this.reparaciones));
    this.isLoading = false;
  });
}
    },
}
</script>

<style>
.card {
    display: flex;
    flex-direction: column;
}

.card-body {
    order: 2;
}

.card-img-top {
    order: 1;
}
</style>