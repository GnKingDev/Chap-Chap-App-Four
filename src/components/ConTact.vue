<template>
  <div class="message">
      <ion-item>
          <ion-label>ecrivez votre message</ion-label>
          <ion-textarea v-model="MessageData"></ion-textarea>
      </ion-item>
      <ion-button v-on:click="sendMessage(MessageData)" :disabled="controleBtn">
          Evoyer
      </ion-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import{IonItem,IonLabel,IonButton,alertController,loadingController,IonTextarea} from '@ionic/vue'
import { arrayUnion,  doc, getDoc, getFirestore, updateDoc } from '@firebase/firestore';
import app from '@/Firebase';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
export default defineComponent ({
 name:"LoaderPage",
 components:{IonItem,IonLabel,IonButton,IonTextarea},
 data(){
     return{
         MessageData:"",
         alertController,
         loadingController,
         
     }
 }, methods:{
    async sendMessage(message){
        const attendre = await loadingController.create({message:"patientez"})
        const alert = await alertController.create({message:"envoyer avec succes"})
        attendre.dismiss()
       if(message){
           try {
               const db = await getFirestore(app)
         const auth  = await getAuth(app)
         await onAuthStateChanged(auth,async(user)=>{
             if(user){
                 const refMessage = await doc(db,"APPINFO","MessageFournisseur")
                 const refFour = await doc(db,"FOURNISSEURS",`${user.uid}`)
                 const four = await getDoc(refFour)
                 if(four.exists()){
                     let take = four.data()
                    await updateDoc(refMessage,{
                     AllMessage:arrayUnion({
                         idFour:user.uid,
                         NomMagasin:take.NomMagasin,
                         ville:take.ville,
                         numeroOrange:take.NumeroPhoneOrange,
                         numeroMtn:take.this.NumeroPhoneMtn,
                         Message:message,
                     })
                 })
                 }
                attendre.dismiss()
                alert.present()
             }
         }) 
           } catch (e) {
               const alert = await alertController.create({message:"erreur d'envoi"})
               alert.present()
               attendre.dismiss()
           }
        
       }
     }
 },
 computed:{
     controleBtn(){
         if(this.MessageData){
           return false
         } else{
             return true
         }
     }
 }
})
</script>
<style scoped>
 .message{
     text-align: center;
     margin-top: 80%;
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
 }
</style>