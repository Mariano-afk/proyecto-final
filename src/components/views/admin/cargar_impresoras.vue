<template>

<div class="container my-4">

<template v-if="msgValidar === true">
  <div id="msgValidar" class="mensaje mb-3">Por favor verifica todos los campos del formulario</div>
</template>

<template v-if="msgCreate === true">
  <div id="msgCreate" class="mensaje mb-3">Se creo la impresora con éxito</div>
</template>

<template v-if="msgEdit === true">
  <div id="msgEdit" class="mensaje mb-3">Se editó la impresora con éxito</div>
</template>

<template v-if="msgDelete === true">
  <div id="msgDelete" class="mensaje mb-3">Se eliminó la impresora con éxito</div>
</template>

<h1 class="align-self-center my-5">Panel de impresoras</h1>

  <form @submit.prevent="validarYAgregarDato">  

    <div class="input-group mb-3">
      <span class="input-group-text">Nombre</span>
      <input v-model="impresora.nombre" type="text" class="form-control">
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text">Descripción</span>
      <textarea v-model="impresora.descripcion" type="text" class="form-control"></textarea>
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text">Precio</span>
      <input v-model="impresora.precio" type="number" class="form-control">
    </div>

    <div class="input-group my-3">
      <input type="file" @change="buscarImagen($event)">
    </div>

    <div class="mt-4">
      <img class="imgCargada" :src="dataImg">
    </div>

    <div class="progress container mt-4">
      <div class="progress-bar" role="progressbar" :style="{width: progress + '%'}" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    </div>

    <div class="mt-3">  
      <button
        v-show="this.editar === true" 
        @click.prevent="actualizarDato(id)" 
        class="btn btn-primary">
        Actualizar
      </button>
      <button
        v-show="this.editar === false" 
        type="submit" 
        class="btn btn-primary">
        Guardar
      </button>
      <button
        v-show="editar"
        @click.prevent="cancelarEdicion()"
        class="btn btn-danger mx-3">
        Cancelar
      </button> 
    </div>
  </form>
<h2 class="align-self-center my-5">Listado de impresoras</h2>
  <table class="table">
    <thead>
      <tr scope="row">
        <th scope="col">Nombre</th>
        <th scope="col">Precio</th>
        <th scope="col">Foto</th>
        <th scope="col">Editar</th>
        <th scope="col">Eliminar</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in impresoras" :key="index">
        <td>{{item.nombre}}</td>
        <td>{{"$"}}{{item.precio}}</td>
        <td><img class="imgTabla" :src="item.foto"/></td>
        <td>
        <button
          @click.prevent="obtenerDatoID( item.id );this.editar = !this.editar;" 
          class="btn btn-primary">
          Editar
        </button>
        </td>
        <td>
        <button
          @click.prevent="confirmarEliminar(item.id)"
          class="btn btn-danger">
          Eliminar
        </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  <dialog id="modalEliminar">
    <div class="row">
      <h3 class="col-10">¿Seguro que quieres eliminar esta impresora?</h3>
      <div class="col-2">
        <button class="btn btn-secondary" @click.prevent="cerrarModalEliminar()">X</button>
      </div>
      <h4 class="col-10">Esta acción es irreversible</h4>
    </div>
    <form>
      <div class="mt-3">  
        <button @click.prevent="eliminarDato(idAEliminar)" class="btn btn-danger">Eliminar</button>
      </div>
    </form>
  </dialog>

</template>

<script>
import 'regenerator-runtime/runtime'
import { collection, getDocs, addDoc, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storageRef } from '../../../services/firebase';

export default {
name: 'cargar_impresoras',
data() {
  return {
    msgValidar: false,
    idAEliminar: null,
    msgCreate: false,
    msgEdit: false,
    msgDelete: false,
    progress: 0,
    editar: false,
    file: null,
    dataImg: null,
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

async validarYAgregarDato() {
if (
    !this.impresora.nombre ||
    !this.impresora.descripcion ||
    !this.impresora.precio ||
    !this.dataImg) {
  this.msgValidar = true;
  await new Promise(resolve => setTimeout(resolve, 5000));
  this.msgValidar = false;
} else {
  this.agregarDato();
}
},

async agregarDato() {
try {
  this.progress = 25;
  await new Promise(resolve => setTimeout(resolve, 500));

  await storageRef.child('imagenes').child(this.file.name).put(this.file);
  this.progress = 50;
  await new Promise(resolve => setTimeout(resolve, 500));

  const urlDescarga = await storageRef.child('imagenes').child(this.file.name).getDownloadURL();
  await addDoc(collection(db, "impresoras"), {
    nombre: this.impresora.nombre,
    descripcion: this.impresora.descripcion,
    precio: this.impresora.precio,
    foto: urlDescarga
  });

  this.progress = 100;
  await new Promise(resolve => setTimeout(resolve, 500));
  this.error = 'Datos agregados correctamente';
  this.file = null;
} catch (error) {
  console.log(error);
  this.error = 'Error al agregar los datos';
} finally {
    this.impresora = {
      id:'',
      nombre: '',
      descripcion: '',
      precio: '',
      foto: ''
    };
    this.dataImg = null;
    this.file = '';
    this.progress = 0;
    this.impresoras = [];
    this.obtenerDatos();
    this.msgCreate = true;
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.msgCreate = false;
  }
},

buscarImagen(event){
const tipoArchivo = event.target.files[0].type;
if(tipoArchivo === 'image/jpeg' || tipoArchivo === 'image/jpg' || tipoArchivo === 'image/png'){
  this.file = event.target.files[0]
  this.error = null
}
else{
  this.error = 'Archivo no válido'
  this.file = null
  return 
}
const reader = new FileReader();
reader.readAsDataURL(this.file);
reader.onload = (e) => {
this.dataImg = e.target.result
}
},

async obtenerDatoID(id) {
const docRef = doc(db, "impresoras", id);
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  const impresoraData = docSnap.data();
    this.impresora = {
      id: docSnap.id,
      nombre: impresoraData.nombre,
      descripcion: impresoraData.descripcion,
      precio: impresoraData.precio,
      foto: impresoraData.foto
    };
  if (this.impresora.foto) {
    this.dataImg = this.impresora.foto;
  }
} else {
  console.log("¡No existe el documento!");
}
},

confirmarEliminar(id) {
  this.idAEliminar = id;
  window.modalEliminar.showModal();
},

cerrarModalEliminar() {
  this.idAEliminar = null;
  window.modalEliminar.close();
},

async eliminarDato() {
  try {
    await deleteDoc(doc(db, "impresoras", this.idAEliminar));
    this.cerrarModalEliminar(); // Cierra la modal después de eliminar
} finally {
    this.impresoras = [];
    this.obtenerDatos();
    this.msgDelete = true;
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.msgDelete = false;
  }
},

async actualizarDato() {
try {
this.progress = 25;
await new Promise(resolve => setTimeout(resolve, 500));

if (this.file) {
  await storageRef.child('imagenes').child(this.file.name).put(this.file);
  this.progress = 50;
  await new Promise(resolve => setTimeout(resolve, 500));

  const urlDescarga = await storageRef.child('imagenes').child(this.file.name).getDownloadURL();
  const elemento = doc(db, "impresoras", this.impresora.id);
  await updateDoc(elemento, {
    nombre: this.impresora.nombre,
    descripcion: this.impresora.descripcion,
    precio: this.impresora.precio,
    foto: urlDescarga
  });
} else {
const elemento = doc(db, "impresoras", this.impresora.id);
await updateDoc(elemento, {
  nombre: this.impresora.nombre,
  descripcion: this.impresora.descripcion,
  precio: this.impresora.precio
});
}

this.progress = 100;
await new Promise(resolve => setTimeout(resolve, 500));
this.error = 'Datos actualizados correctamente';
this.file = null;
} catch (error) {
  console.log(error);
  this.error = 'Error al actualizar los datos';
} finally {
    this.impresora = {
      id:'',
      nombre: '',
      descripcion: '',
      precio: '',
      foto: ''
    };
    this.editar = false;
    this.dataImg = null;
    this.file = '',
    this.progress = 0;
    this.impresoras = [];
    this.obtenerDatos();
    this.msgEdit = true;
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.msgEdit = false;
  }
},

cancelarEdicion() {
  this.impresora = {
    id:'',
    nombre: '',
    descripcion: '',
    precio: '',
    foto: ''
  };
  this.dataImg = null;
  this.editar = false;
}

},
mounted() {
  this.obtenerDatos();
},
}
</script>
<style>
.mensaje {
  background-color: lightgreen;
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

#msgValidar{
  background-color: #dc5656;
}
</style>