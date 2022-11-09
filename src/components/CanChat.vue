<template>
<div align="center" class="ion-padding">
<ion-button v-on:click="CanChat()" >
          Mes Messages
      </ion-button>
</div>
      
</template>

<script>
import {IonButton, loadingController, alertController} from '@ionic/vue'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import app from '@/Firebase'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
export default {
name:"CanChat",
components:{IonButton},
methods:{
 async CanChat(){
   const attendre = await loadingController.create({message:"patientez"})
   attendre.present()
   try {
    const auth = getAuth(app)
    const db = getFirestore(app)
    onAuthStateChanged(auth,async(user)=>{
        const refuser = doc(db,"FOURNISSEURS",user.uid)
        const data = await getDoc(refuser)
        if(data.exists()){
            let take = data.data()
            if(take.Message){
             this.$router.push({path:"/Messages"})
             attendre.dismiss()
            }else{
              const alert = await alertController.create({message:"Vous n'avez pas de message pour le moment"})
              alert.present()
              attendre.dismiss()
            }
        } 
    })
   } catch (error) {
     attendre.dismiss()
     const alert = await alertController.create({message:"erreur du serveur"})
      alert.present()
   }
   
  }
}
}
</script>

<style>

</style>