<template>
  <ion-page>
      <ion-content>
       <ion-img :src="require('../images/RICHE.jpg')"></ion-img>

       <div class="loader" v-if="loader"></div>
       <ion-button v-on:click="tryAgain()" shape="round" v-if="erreur" class="btn">
         Reesayer
       </ion-button>
       
       <div class="footer">
         <span> Un Produit de TECH GN made in Guinea</span>
       </div>
   
     

      </ion-content>
</ion-page>
</template>

<script>
import { IonPage,IonContent,IonImg,alertController,IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';
import {getAuth,onAuthStateChanged} from "firebase/auth"
import {getFirestore,doc,getDoc} from "firebase/firestore"
import app from '@/Firebase';
import {Geolocation} from '@capacitor/geolocation'
import axios from 'axios';
import store from '@/VerifyUserStore';
import { App } from '@capacitor/app';
export default defineComponent({
  name: 'LoadPage',
  components: {
   IonPage,IonContent,IonImg,IonButton
  },
  data(){
    return{
      alertController,
      //CO CONTROLE A CHAQUE OUVERTURE
      CO:"",
      erreurCO:"",
      //v if 
      erreur:false,
      Succes:true,
      loader:true
    }
  },
  ionViewDidEnter(){
     Geolocation.getCurrentPosition({enableHighAccuracy:true}).then(async(localisation)=>{
            await axios.get(`https://geocode.maps.co/reverse?lat=${localisation.coords.latitude}&lon=${localisation.coords.longitude}`).then(async(data)=>{
      let take = data.data
      if(take.address.city) await store.set("Ville",take.address.city) 
      else{
        if(take.address.town) await store.set("Ville",take.address.town) 
        else {
          setInterval(()=>App.exitApp(),3000)
        }
      }
    })
       })
  },
 
 async mounted(){

    if(window.navigator.onLine==false){
      const alert  = await   alertController.create({message:"erreur internet"})
   alert.present()
    this.erreur=true
    this.loader=false
         return
    }
     try {
       this.loader=true
       this.erreur=false
       const auth = await getAuth(app)
       await onAuthStateChanged(auth,async(user)=>{
         if(user){
           const db = await getFirestore(app)
           const refFour= await doc(db,"FOURNISSEURS",`${user.uid}`)
           const Four = await getDoc(refFour)
           if(Four.exists()){
             let take = Four.data()
             if(take.CO){
               this.CO=take.CO
                const ControOuverture = await alertController.create({
                 message:"",
                 header:"Entre Votre CO",
                 backdropDismiss:false,
                 inputs:[
                   {
              name: 'name2',
              id: 'name2-id',
              placeholder: 'Entre Votre CO',
              value:""
               },
                 ],
                 buttons:[
                    {
                      text:"verifier",
                      role:"verifier",
                      handler:async(data)=>{
                        //controle de co
                       if(data.name2==this.CO){
                         this.$router.replace({path:"/AutrePage"})
                       } else{
                         const alert = await alertController.create({message:"CO Incorrece reessayer"})
                         alert.present()
                         this.loader=false
                         this.erreur=true
                       }
                       //fin controle co
                      }
                    }
                 ]
                 
               })
               ControOuverture.present()
              
             }
           }else{
             setTimeout(()=>this.$router.replace({path:"/CreateAcount"}),10000)
              this.loader=false

              
           }
           
            
         } else{
           setTimeout(()=>this.$router.replace({path:"/ConneXion"}),2000)
             
          
         }
       })
       
     } catch (e) {
       this.loader=false
       this.erreur=true
     }
    
  },
  methods:{
  
  async tryAgain(){
    if(window.navigator.onLine==false){
      const alert  = await   alertController.create({message:"erreur internet"})
   alert.present()
    this.erreur=true
    this.loader=false
         return
    }
   
     try {
       this.loader=true
       this.erreur=false
       const auth = await getAuth(app)
       await onAuthStateChanged(auth,async(user)=>{
         if(user){
           const db = await getFirestore(app)
           const refFour= await doc(db,"FOURNISSEURS",`${user.uid}`)
           const Four = await getDoc(refFour)
           if(Four.exists()){
             let take = Four.data()
             if(take.CO){
               this.CO=take.CO
                const ControOuverture = await alertController.create({
                 message:"",
                 header:"Entre Votre CO",
                 backdropDismiss:false,
                 inputs:[
                   {
              name: 'name2',
              id: 'name2-id',
              placeholder: 'Entre Votre CO',
              value:""
               },
                 ],
                 buttons:[
                    {
                      text:"verifier",
                      role:"verifier",
                      handler:async(data)=>{
                        //controle de co
                       if(data.name2==this.CO){
                         this.$router.replace({path:"/AutrePage"})
                       } else{
                         const alert = await alertController.create({message:"CO Incorrece reessayer"})
                         alert.present()
                         this.loader=false
                         this.erreur=true
                       }
                       //fin controle co
                      }
                    }
                 ]
                 
               })
               ControOuverture.present()
              
             }
           }else{
              this.loader=false
              this.$router.replace({path:"/CreateAcount"})
           }
           
            
         } else{
          
           this.$router.replace({path:"/ConneXion"})
         }
       })
       
     } catch (e) {
       this.loader=false
       this.erreur=true
     }
   }
  }
});
</script>
<style scoped >
.footer{
  text-align: center;
  color:#898585 ;
  margin-top: 50%;
}
ion-img{
  margin-top: 25%;
}
.loader{
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #03a61c; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;  
  margin: auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.color{
  color: #898585;
}
.red{
  color: red;
}
.btn{
text-align: center;
}

</style>