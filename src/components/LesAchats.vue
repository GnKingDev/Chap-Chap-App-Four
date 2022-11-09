<template>
<div v-if="leRoute=='succes'">
  <ion-item v-for="(produit,index) in AllAchat" :key="index">
      <ion-thumbnail slot="start">
          <img :src="produit.LinkPhoto" />
      </ion-thumbnail>
      <ion-label>
          <h5>Nom Produit <span>{{produit.nom}}</span></h5>
           <h5>Prix <span>{{produit.prix}}</span></h5>
            <h5>Qualite <span>{{produit.qualite}}</span></h5>
            <h5>Numero <span>{{produit.numero}}</span></h5>
            <h5>Addresse <span>{{produit.adresse}}</span></h5>
             <h5>couleur <span>{{produit.couleur}}</span></h5>
              <h5>taille <span>{{produit.taille}}</span></h5>
               <h5>Nombre de ce Produit <span>{{produit.nombre}}</span></h5>
               <h5>Date Achat <span>{{produit.dateAchat}}</span> </h5>
                <h5>ville <span>{{produit.ville}}</span> </h5>
               
      </ion-label>
  </ion-item>
  </div>

  <div v-if="leRoute=='PasDachat'" class="PasDachat">
     <h2>pas d'achat pour Le moment</h2>
  </div>

  <div v-if="leRoute=='erreur'">
       <img :src="require('../images/erreurImage.png')" alt="">
          <ion-button v-on:click="TryAgain()">
              Reessayer
          </ion-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import{IonLabel,IonItem,IonThumbnail,IonInput,IonButton,loadingController,alertController} from '@ionic/vue'
import { doc, getDoc, getFirestore, updateDoc, } from '@firebase/firestore';
import app from '@/Firebase';
import { getAuth, onAuthStateChanged } from '@firebase/auth';


export default defineComponent ({
 name:"LesAchats",
 components:{IonLabel,IonThumbnail,IonItem,IonButton},
data(){
    return{
     loadingController,
     leRoute:"",
     AllAchat:[],
     Useruid:"",
     VerifyInput:"",
    }
},

async beforeCreate(){
    const attendre = await loadingController.create({message:"patientez"})
    attendre.present()
    try {
        
        const db = await getFirestore(app)
        const auth = await getAuth(app)
        await onAuthStateChanged(auth,(user)=>this.Useruid=user.uid)
        const refFour = await doc(db,'FOURNISSEURS',`${this.Useruid}`)
        const Four = await getDoc(refFour)
        if(Four.exists()){
            let take = Four.data()
           
            //convertir en date
            this.AllAchat=take.HistoriqueAchat
            //fin convertir
            if(!this.AllAchat[0]){
                this.leRoute="PasDachat"
               
            }else{
              this.leRoute="succes"
            }
          attendre.dismiss()  
          
    } 
    } catch (error) {
        attendre.dismiss()
        this.leRoute="erreur"
        console.log(error)
    }
 },
 methods:{
     //my alert
     async myAlert(text){
         const alert = await alertController.create({message:`${text}`})
         alert.present()
         setTimeout(()=>alert.dismiss(),2000)
     },
     //verification si le produit a ete livre 
   async  VeriFierLeStatus(statuscode,idAchat,idUser){
         const attendre = await loadingController.create({message:"pateintez"})
         
         try {
            if(!this.VerifyInput){
         this.myAlert("champ vide")
       }else{
           if(this.VerifyInput==statuscode){
               attendre.present()
               //mise a jour maintenant
               //pour le fournisseurs
               
               const db = await getFirestore(app)
               const refFour = await doc(db,"FOURNISSEURS",`${this.Useruid}`)
               let take = this.AllAchat.filter(e=>e.statuscode==statuscode)
               take[0].status=true
               let i = this.AllAchat.findIndex(e=>e.statuscode==statuscode)
               this.AllAchat[i]=take[0]
               await updateDoc(refFour,{
                   HistoriqueAchat:this.AllAchat
               })
               //debut pour le client
               const refUser = await doc(db,"USERS",`${idUser}`)
                const User = await getDoc(refUser)
                if(User.exists()){
                    let take1=User.data()
                    let take2=take1.Historique
                    let take3= take2.filter(e=>e.statuscode==statuscode)
                    take3[0].status=true
                    let i = take2.findIndex(e=>e.statuscode==statuscode)
                    take2[i]=take3[0]
                    await updateDoc(refUser,{
                        Historique:take2
                    })
                    //pour l'administrateur
                 const refAchatDoc = await doc(db,"ACHETES",`${idAchat}`)
                   await updateDoc(refAchatDoc,{
                       status:true
                   })
                }
                attendre.dismiss()
                this.myAlert("vous avez bien livrer le produit Merci pour votre confiance")
           } else{
               this.myAlert("le code ne verifi pas veillez bien ecrire et respecte les majuscules minijuscules")
           }
       } 
         } catch (error) {
             attendre.dismiss()
             this.myAlert("erreur reessayer")
         }
       
     }
 }
})
</script>
<style scoped>
.PasDachat{
    text-align: center;
    margin-top: 90%;
}
.PasDachat h2 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
 color: #ddd;
}
</style>