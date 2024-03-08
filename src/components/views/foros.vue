<template>
  <template v-if="isLoading">
    <div class="align-self-center mt-5">
      <img v-bind:srcset="loadingIMG" alt="logo cargando" class="img-fluid">
      <p>Cargando...</p>
    </div>
  </template>

  <template v-else>
    <div class="jumbotron jumbotron-fluid">
      <img class="img-fluid jumbotron-image pt-4 py-3" v-bind:srcset="favicon_sin_name_white" alt="Imagen de fondo del jumbotron">
      <div class="container banner pb-3">
        <h1 class="display-5 subtitulo-white">FOR<span>O</span>S</h1>
        <p class="lead">Conéctate con los usuarios</p>
      </div>
    </div>

    <div class="container my-4">
      <h2 class="align-self-center my-5">Crear foro</h2>
      <p class="lead align-self-center">Si tienes alguna consulta o algún comentario para ayudar, nos encantaría que lo dejaras abajo. ¡Todo aporta a la comunidad!</p>

      <form class="form-foros align-self-center" @submit.prevent="validarYAgregarDato">  
        <template v-if="msgValidar === true">
          <div id="mensaje" class="mensaje-error mb-3">Para crear un foro debe tener un tema y una descripción</div>
        </template>
    
        <div class="input-group mb-3">
          <span class="input-group-text">Tema</span>
          <input v-model="foro.nombre" type="text" class="form-control">
        </div>

        <div class="input-group mb-3">
          <span class="input-group-text">Descripción</span>
          <textarea v-model="foro.descripcion" type="text" class="form-control"></textarea>
        </div>

        <div class="mt-3">  
          <button class="btn btn-primary">Abrir discusión</button>
        </div>
      </form>

      <h2 class="align-self-center my-5">Listado de foros</h2>

      <div>
        <input type="text" v-model="busqueda" class="form-control mb-3" placeholder="Buscar por nombre...">
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr scope="row">
              <th scope="col">Nombre</th>
              <th scope="col">Descripción</th>
              <th scope="col">Autor</th>
              <th scope="col">Fecha</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in forosPaginados" :key="index">
              <td class="truncate">{{ item.nombre }}</td>
              <td class="truncate">{{ item.descripcion }}</td>
              <td>{{ item.creador }}</td>
              <td>{{ formatDate(item.created_at) }}</td>
              <td>
                <router-link class="btn btn-primary" :to="{ name: 'ForoDetalle', params: { id: item.id }}">Ver</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <!-- Componente de paginación -->
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" v-for="pageNumber in totalPages" :key="pageNumber" :class="{ active: currentPage === pageNumber }">
              <a class="page-link" @click="currentPage = pageNumber">{{ pageNumber }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </template>
</template>


<script>

import { ref } from "vue";
import useAuth from "../../composition/useAuth.js";
import 'regenerator-runtime/runtime'
import { collection, addDoc, getDocs, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import profile from '../../../public/img/default.png';
import favicon_sin_name_white from "../../../public/img/favicon_sin_name_white.png";
import loadingIMG from "../../../public/img/3Dteca.png";

export default {
name: 'foro',
data() {
  return {
    loadingIMG,
    favicon_sin_name_white,
    isLoading: true,
    msgValidar: false,
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
      portada:''
    },
    profile: [
    { img:profile },
    ],
    foros: [],
    busqueda: '',
    currentPage: 1, // Página actual
    pageSize: 6, // Cantidad de registros por página
    foro: {
      id: '',
      nombre: '',
      descripcion: '',
      created_at:'',
      creador:'',
    },
  }
},

computed: {
  forosFiltrados() {
    return this.foros.filter(foro => {
      // Filtrar por coincidencia en el nombre
      return foro.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
    });
  },
  totalPages() {
    return Math.ceil(this.forosFiltrados.length / this.pageSize);
  },

  // Foros de la página actual
  forosPaginados() {
    // Filtrar los foros basados en la búsqueda
    const forosFiltrados = this.foros.filter(foro => {
      return foro.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
    });

    // Calcular el índice de inicio y fin de la página actual
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Devolver los foros para la página actual
    return forosFiltrados.slice(startIndex, endIndex);
  },


},


methods:{

formatDate(timestamp) {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
},

async obtenerDatos() {
  const querySnapshot = await getDocs(query(collection(db, "foros"), orderBy("created_at", "desc")));
  querySnapshot.forEach((doc) => {
    let foro = doc.data();
    foro.id = doc.id;
    this.foros.push(foro);
  });
  this.isLoading = false;
},



async waitForUserData() {
  while (!this.authUser.id) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
},

async validarYAgregarDato() {
if (
    !this.foro.nombre ||
    !this.foro.descripcion
    ) {
  this.msgValidar = true;
  await new Promise(resolve => setTimeout(resolve, 5000));
  this.msgValidar = false;
} else {
  this.agregarForo();
  }
},

async agregarForo() {
  try {
    await addDoc(collection(db, "foros"), {
      nombre: this.foro.nombre,
      descripcion: this.foro.descripcion,
      created_at: Timestamp.now(),
      creador: this.authUser.email,
  });

  this.foro.nombre = '';
    this.foro.descripcion = '';

  } catch (error) {
      console.log(error);
      this.error = 'Error al crear discusion';
  } finally {
      console.log("finally");
      this.foros = [];
      this.obtenerDatos();
  }
},
},

mounted() {
  this.isLoading = true;

      if (localStorage.getItem('foros')) {
        this.foros = JSON.parse(localStorage.getItem('foros'));
        this.isLoading = false;
      } else {
        this.obtenerDatos().then(() => {
          localStorage.setItem('foros', JSON.stringify(this.foros));
          this.isLoading = false;
        });
      }
},

setup() {
  const {authUser} = useAuth();

  const form = ref({
  displayName: "null",
  bio: "null",
  });

  return {
    authUser,
    form,
  };
  }
};

</script>

<style>
  .table {
    width: 100%; /* Ancho máximo de la tabla */
  }

  .table th,
  .table td {
    width: auto;
  }
</style>