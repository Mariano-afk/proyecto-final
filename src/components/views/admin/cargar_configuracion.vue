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

<h1 class="align-self-center my-5">Panel de configuraciones</h1>

  <form @submit.prevent="validarYAgregarDato"> 

    <div class="input-group mb-3">
      <span class="input-group-text">Nombre</span>
      <input v-model="configuracion.nombre" type="text" class="form-control">
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text">Temperatura de extrusor</span>
      <input v-model="configuracion.tempExt" type="text" class="form-control">
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text">Temperatura de cama</span>
      <input v-model="configuracion.tempCam" type="text" class="form-control">
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text">Velocidad</span>
      <input v-model="configuracion.velocidad" type="text" class="form-control">
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text">Altura de capa</span>
      <input v-model="configuracion.altCap" type="text" class="form-control">
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text">Retracción</span>
      <input v-model="configuracion.retraccion" type="text" class="form-control">
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text">Relleno</span>
      <input v-model="configuracion.relleno" type="text" class="form-control">
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text">Velocidad de capa inicial</span>
      <input v-model="configuracion.velCapIni" type="text" class="form-control">
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text">Velocidad de ventilador</span>
      <input v-model="configuracion.velVent" type="text" class="form-control">
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

<h2 class="align-self-center my-5">Listado de configuraciones</h2>

<table class="table">
  <thead>
    <tr scope="row">
      <th scope="col">Nombre</th>
      <th scope="col">Temperatura de extrusor</th>
      <th scope="col">Temperatura de cama</th>
      <th scope="col">Velocidad</th>
      <th scope="col">Altura de Capa</th>
      <th scope="col">Retracción</th>
      <th scope="col">Relleno</th>
      <th scope="col">Velocidad de capa inicial</th>
      <th scope="col">Velocidad de ventilador</th>
      <th scope="col">Foto</th>
      <th scope="col">Editar</th>
      <th scope="col">Eliminar</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in configuraciones" :key="index">
      <td>{{item.nombre}}</td>
      <td>{{item.tempExt}}</td>
      <td>{{item.tempCam}}</td>
      <td>{{item.velocidad}}</td>
      <td>{{item.altCap}}</td>
      <td>{{item.retraccion}}</td>
      <td>{{item.relleno}}</td>
      <td>{{item.velCapIni}}</td>
      <td>{{item.velVent}}</td>
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
      <button @click.prevent="cerrarModalEliminar()" class="btn btn-secondary">X</button>
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
name: 'cargar_configuraciones',
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
    configuraciones: [],
    configuracion: {
      id:'',
      nombre:'',
      tempExt: '',
      tempCam:'',
      velocidad:'',
      altCap:'',
      retraccion:'',
      relleno:'',
      velCapIni:'',
      velVent:'',
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
},

async validarYAgregarDato() {
if (
  !this.configuracion.nombre ||
  !this.configuracion.tempExt ||
  !this.configuracion.tempCam ||
  !this.configuracion.velocidad ||
  !this.configuracion.altCap ||
  !this.configuracion.retraccion ||
  !this.configuracion.relleno ||
  !this.configuracion.velCapIni ||
  !this.configuracion.velVent ||
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
  await addDoc(collection(db, "configuraciones"), {
    nombre: this.configuracion.nombre,
    tempExt: this.configuracion.tempExt,
    tempCam: this.configuracion.tempCam,
    velocidad: this.configuracion.velocidad,
    altCap: this.configuracion.altCap,
    retraccion: this.configuracion.retraccion,
    relleno: this.configuracion.relleno,
    velCapIni: this.configuracion.velCapIni,
    velVent: this.configuracion.velVent,
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
  this.configuracion = {
    id:'',
    nombre:'',
    tempExt: '',
    tempCam:'',
    velocidad:'',
    altCap:'',
    retraccion:'',
    relleno:'',
    velCapIni:'',
    velVent:'',
    foto: ''
  };
  this.dataImg = null;
  this.file = '';
  this.progress = 0;
  this.configuraciones = [];
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
  const docRef = doc(db, "configuraciones", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
  const configuracionData = docSnap.data();
  this.configuracion = {
    id: docSnap.id,
    nombre: configuracionData.nombre,
    tempExt: configuracionData.tempExt,
    tempCam: configuracionData.tempCam,
    velocidad: configuracionData.velocidad,
    altCap: configuracionData.altCap,
    retraccion: configuracionData.retraccion,
    relleno: configuracionData.relleno,
    velCapIni: configuracionData.velCapIni,
    velVent: configuracionData.velVent,
    foto: configuracionData.foto
  };

  if (this.configuracion.foto) {
    this.dataImg = this.configuracion.foto;
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

async eliminarDato (id){
try{
  await deleteDoc(doc(db, "configuraciones", id ));
  this.cerrarModalEliminar();
} finally {
    this.configuraciones = [];
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
  const elemento = doc(db, "configuraciones", this.configuracion.id);
  await updateDoc(elemento, {
    nombre: this.configuracion.nombre,
    tempExt: this.configuracion.tempExt,
    tempCam: this.configuracion.tempCam,
    velocidad:this.configuracion.velocidad,
    altCap: this.configuracion.altCap,
    retraccion: this.configuracion.retraccion,
    relleno: this.configuracion.relleno,
    velCapIni: this.configuracion.velCapIni,
    velVent: this.configuracion.velVent,
    foto: urlDescarga
  });
  } else {
    const elemento = doc(db, "configuraciones", this.configuracion.id);
    await updateDoc(elemento, {
      nombre: this.configuracion.nombre,
      tempExt: this.configuracion.tempExt,
      tempCam: this.configuracion.tempCam,
      velocidad:this.configuracion.velocidad,
      altCap: this.configuracion.altCap,
      retraccion: this.configuracion.retraccion,
      relleno: this.configuracion.relleno,
      velCapIni: this.configuracion.velCapIni,
      velVent: this.configuracion.velVent,
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
    this.configuracion = {
      id:'',
      nombre:'',
      tempExt: '',
      tempCam:'',
      velocidad:'',
      altCap:'',
      retraccion:'',
      relleno:'',
      velCapIni:'',
      velVent:'',
      foto: ''
    };
    this.editar = false;
    this.dataImg = null;
    this.file = '',
    this.progress = 0;
    this.configuraciones = [];
    this.obtenerDatos();
    this.msgEdit = true;
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.msgEdit = false;
  }
},

cancelarEdicion() {
  this.configuracion = {
    id:'',
    nombre:'',
    tempExt:'',
    tempCam:'',
    velocidad:'',
    altCap:'',
    retraccion:'',
    relleno:'',
    velCapIni:'',
    velVent:'',
    foto:''
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