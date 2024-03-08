<template>
  <template v-if="isLoading">
    <div class="align-self-center mt-5">
      <img v-bind:srcset="loadingIMG" alt="logo cargando" class="img-responsive">
      <p>Cargando...</p>
    </div>
  </template>
  <template v-else>

    <div class="jumbotron jumbotron-fluid">
      <img class="img-fluid jumbotron-image pt-4 py-3" v-bind:srcset="favicon_sin_name_white" alt="logo de 3Dteca">
      <div class="container banner pb-3">
        <h1 class="display-5 subtitulo-white">Bienvenido a 3DTE<span>C</span>A</h1>
        <p class="lead">La web más completa sobre el mundo 3D</p>
      </div>
    </div>

      <source v-bind:srcset="IMG">
      <section id="ofertas">
        <div class="container-fluid">
          <div class="row">
           
            <div class=" col-12 text-wrap align-self-center mx-auto mb-5 d-flex justify-content-center">
              <h2 class="subtitulo">INFORMACI<span>Ó</span>N</h2>  
            </div>
            
            <div class=" col-md-12 col-lg-6 col-xl text-wrap align-self-center mx-auto mb-5 d-flex justify-content-center">
              <router-link :to="fotos[0].path">
              <picture class="d-flex justify-content-center categoria" >
                <img class="obs" v-bind:srcset="fotos[0].img" /> 
                <div class="oferta-titulos">
                  <h3>IMPRES<span>O</span>RAS</h3>
                </div>
              </picture>
            </router-link>
            </div>
          

          
            <div class=" col-md-12 col-lg-6 col-xl text-wrap align-self-center mx-auto mb-5 d-flex justify-content-center">
              <router-link :to="fotos[1].path">
              <picture class="d-flex justify-content-center categoria" >
                <img class="obs" v-bind:srcset="fotos[1].img" /> 
                <div class="oferta-titulos">
                  <h3>FILAMENT<span>O</span>S</h3>
                </div>
              </picture>
            </router-link>
            </div>
          

            
            <div class=" col-md-12 col-lg-6 col-xl text-wrap align-self-center mx-auto mb-5 d-flex justify-content-center">
              <router-link :to="fotos[2].path">
              <picture class="d-flex justify-content-center categoria" >
                <img class="obs" v-bind:srcset="fotos[2].img" /> 
                <div class="oferta-titulos">
                  <h3>CONFIGURACI<span>Ó</span>N</h3>
                </div>
              </picture>
            </router-link>
            </div>
          

            
            <div class=" col-md-12 col-lg-6 col-xl text-wrap align-self-center mx-auto mb-5 d-flex justify-content-center">
              <router-link :to="fotos[3].path">
              <picture class="d-flex justify-content-center categoria" >
                <img class="obs" v-bind:srcset="fotos[3].img" /> 
                <div class="oferta-titulos">
                  <h3>DISEÑ<span>O</span> 3D</h3>
                </div>
              </picture>
            </router-link>
            </div>

            
            <div class=" col-md-12 col-lg-6 col-xl text-wrap align-self-center mx-auto mb-5 d-flex justify-content-center">
              <router-link :to="fotos[4].path">
              <picture class="d-flex justify-content-center categoria" >
                <img class="obs" v-bind:srcset="fotos[4].img" /> 
                <div class="oferta-titulos">
                  <h3>REPARACI<span>Ó</span>N</h3>
                </div>
              </picture>
            </router-link>
            </div>

          </div>
        </div>
      </section>
  </template>
</template>

<script>

import impresoras from "../../../public/img/impresoras.jpg"
import filamentos from "../../../public/img/filamentos.jpg"
import configuracion from "../../../public/img/configuracion.jpg"
import diseño3D from "../../../public/img/diseño3D.jpg"
import reparacion from "../../../public/img/reparacion.jpg"
import IMG from "../../../public/img/logo-vertical.png"
import favicon_sin_name_white from "../../../public/img/favicon_sin_name_white.png"
import loadingIMG from "../../../public/img/3Dteca.png"

export default {
data: () => ({
  loadingIMG,
  isLoading: true,
  IMG,
  favicon_sin_name_white,
  fotos: [
  {
    titulo:'IMPRESORAS',
    img: impresoras,
    path: '/impresoras'
  },
  {
    titulo: 'FILAMENTOS',
    img: filamentos,
    path: '/filamentos'
  },
  {
    titulo: 'CONFIGURACIÓN',
    img: configuracion,
    path: '/configuracion'
  },
  {
    titulo: 'DISEÑO 3D',
    img: diseño3D,
    path: '/diseño3D'
  },
  {
    titulo: 'REPARACIÓN',
    img: reparacion,
    path: '/reparacion'
  }
  ]
}),

mounted() {
  setTimeout(() => {
    this.isLoading = false;
  }, 1500);
}
};

</script>


 <!-- <router-link
              links 
              v-for="item in fotos"
              :key="item"
              :to="item.path"
              class="col-12 col-md-6 align-self-center mx-auto mb-5 d-flex justify-content-center">
              <picture class="d-flex justify-content-center categoria" >
                <source v-bind:srcset="item.img">
                <img class="obs" v-bind:alt="item.titulo" /> 
                <div class="oferta-titulos">
                  <h3>{{item.titulo}}</h3>
                </div>
              </picture>
            </router-link> -->