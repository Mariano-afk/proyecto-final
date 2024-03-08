<template>
    <div class="container my-4">
          <form>  
    <div class="input-group mb-3">
    <span class="input-group-text">Nombre</span>
    <input v-model="impresora.nombre" type="text" class="form-control">
    </div>
    <div class="input-group mb-3">
    <span class="input-group-text">Editar usuarios favoritos</span>
    <input v-model="impresora.favoritos" type="text" class="form-control">
    </div>

    <div class="mt-3">
      <button 
    @click.prevent="agregarDato(impresora)" 
    class="btn btn-primary me-3">
    Agregar
    </button>
    <button 
    @click.prevent="eliminarDato(impresora)" 
    class="btn btn-danger">
    Eliminar
    </button>
  </div>
  </form>
  <table class="table">
    <thead>
      <tr scope="row">
        <th scope="col">Usuario mail</th>
        <th scope="col">Usuario Id</th>
        <th scope="col">Usuario rol</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in users" :key="index">
        <td>{{item.email}}</td>
        <td>{{item.id}}</td>
        <td>{{item.rol}}</td>
      </tr>
    </tbody>
  </table>
  <table class="table">
    <thead>
      <tr scope="row">
        <th scope="col">Usuarios Fav</th>
        <th scope="col">Nombre</th>
        <th scope="col">Precio</th>
        <th scope="col">Foto</th>
        <th scope="col">Editar</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in impresoras" :key="index">
        <td>{{item.favoritos}}</td>
        <td>{{item.nombre}}</td>
        <td>{{item.precio}}{{"$"}}</td>
        <td><img class="imgTabla" :src="item.foto"/></td>
        <td>
          <button @click.prevent="obtenerDatoID( item.id );this.editar = !this.editar;" 
            class="btn btn-primary">Editar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>
import 'regenerator-runtime/runtime'
import { collection, getDocs, doc, arrayRemove, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db, storageRef } from '../../../services/firebase';
import firebase from 'firebase/compat/app';
import routes from '../../../router/router';
export default {
    name: 'todos_favoritos',
    data() {
        return {
          progress: 0,
          file: null,
          dataImg: null,
          users:[],
          user:{
            email:'',
            id:'',
            rol:'',
          },
          impresoras: [],
          impresora: {
            favoritos: {},
            id:'',
            nombre: '',
            descripcion: '',
            precio: '',
            foto: '',
            fav: false
          } 
        }
    },
    methods:{

  async obtenerDatos () { 
      const querySnapshot = await getDocs(collection(db, "impresoras"));
        querySnapshot.forEach((doc) => {
        let impresora = doc.data()
        impresora.id = doc.id
        this.impresoras.push(impresora)
      });
    },
    async obtenerUsers () { 
      const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
        let user = doc.data()
        user.id = doc.id
        this.users.push(user)
      });
    },
    async obtenerDatoID (id){
      const docRef = doc(db, "impresoras", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.impresora = docSnap.data()
        this.impresora.id = docSnap.id
        } 
        else {
        console.log("¡No existe el documento!");
        }
},
      async agregarDato(impresora){
        const rutaFavoritos = doc(db, "impresoras/" + impresora.id);
        await updateDoc(rutaFavoritos, {
        favoritos: arrayUnion(this.impresora.favoritos),
      })
      },

       async eliminarDato(impresora){
        const rutaFavoritos = doc(db, "impresoras/" + impresora.id);
        await updateDoc(rutaFavoritos, {
        favoritos: arrayRemove(this.impresora.favoritos),
      })
      }
    },
    mounted() {
        this.obtenerDatos();
        this.obtenerUsers();
    },
}
</script>