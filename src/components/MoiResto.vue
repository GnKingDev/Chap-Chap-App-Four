<template>
   <div class="restoRenseignement">
                 <ion-label>
                  <h4> Nom Magasin :<span > {{userInfo.NomMagasin}}</span> </h4>
                  <h4> Cree : <span> {{userInfo.DateCreation}}</span></h4>
                  <h4>Vous avez vendue: <span> {{userInfo.NombreAchat}} produit </span></h4>
                  <h4>Vous avez eu: <span>{{userInfo.MontantTotalAchat}} GNF</span></h4>
                  <h4>Vous avez Publier :<span> {{userInfo.NombreDEPub}} produit </span> </h4>
                 </ion-label>
             </div>
            <div class="editerMesDonne">
      <ion-item>
          <ion-label>Editer</ion-label>
          <ion-toggle slot="end" @ionChange="push($event)"
            :value="toogleBtn" ></ion-toggle>
      </ion-item>
       </div>
       <div class="lesInput" v-if="cacheEdit">
           <ion-item>
               <ion-label position="floating">Nom Magasin</ion-label>
               <ion-input  type="text" v-model="userInfo.NomMagasin" :disabled="toogleBtn" ></ion-input>
           </ion-item>
           <ion-item>
               <ion-label position="floating">Numero De Telephone</ion-label>
               <ion-input  type="number" v-model="userInfo.NumeroPhone" :disabled="toogleBtn"></ion-input>
           </ion-item>
            <ion-item>
               <ion-label position="floating">Mot de Passe CO</ion-label>
               <ion-input  type="text" v-model="userInfo.CO" :disabled="toogleBtn"></ion-input>
           </ion-item>
            <ion-item>
               <ion-label position="floating">Lieux</ion-label>
               <ion-input  type="text" v-model="userInfo.ville" disabled></ion-input>
             </ion-item>
              <ion-item>
               <ion-label position="floating">Lieux</ion-label>
               <ion-input  type="file" @change="Photo" ></ion-input>
             </ion-item>

             <div class="btnInput">
              <ion-button v-on:click="MettreEnJour()" shape="round" fill="outline" :disabled="toogleBtn" >
                  Mettre En Jour
              </ion-button>
             </div>
       </div>
</template>

<script>
import {defineComponent} from 'vue'
import {IonLabel,IonToggle,IonToolbar,IonItem,IonInput} from '@ionic/vue'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
import app from '@/Firebase'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
export default defineComponent ({
   name:"MoiResto",
   components:{IonLabel,IonToggle,IonToolbar,IonItem,IonInput},
   data(){
       return{
           userInfo:{},
       }
   },
 async  beforeCreate(){
     const db = await getFirestore(app)
     const auth = await getAuth(app)
     await onAuthStateChanged(auth,async(user)=>{
         const refFour = await doc(db,"FOURNISSEURS",`${user.uid}`)
         const four = await getDoc(refFour)
         if(four.exists()){
             let take = four.data()
             this.userInfo=take
             this.userInfo.DateCreation= new Date(this.userInfo.DateCreation.second*1000).toDateString()
         }
     })
   }
})
</script>

<style>

</style>