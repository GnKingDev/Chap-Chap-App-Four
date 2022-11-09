<template>
  <ion-page>
      <ion-content>
        <ion-img :src="require('../images/fournisseurs.png')"></ion-img>
        <div class="ForInput">
             <div class="textWrap color" >
           <p>Veillez Vous Connecte a l'appli Fournisseurs de CHAP CHAP</p>
        </div>
       <ion-item>
           <ion-label position="floating" class="color" > Email </ion-label>
           <ion-input inputmode="email" v-model="Email" ></ion-input>
       </ion-item>
        <ion-item>
           <ion-label position="floating" class="color"> Mot De Passe </ion-label>
           <ion-input type="password" v-model="PassWord" ></ion-input>
       </ion-item>
        </div>

        <div class="btn">
         <ion-button v-on:click="SignIn()" shape="round" fill="outline">
             Me Connecte
         </ion-button>
        </div>

        <div class="footer color">
            <p>si Vous n'avez pas un Compte Contacte ce numero 629821308</p>
        </div>

         <div class="loader" v-if="loading"></div>
      </ion-content>
</ion-page>
</template>

<script>
import { IonPage,IonContent,IonImg,IonItem,IonInput,IonLabel,IonButton,alertController } from '@ionic/vue';
import { defineComponent } from 'vue';
import {Network} from '@capacitor/network'
import { getAuth,signInWithEmailAndPassword} from 'firebase/auth'
import {getFirestore,doc,getDoc,} from "firebase/firestore"
import app from '@/Firebase';
export default defineComponent({
  name: 'ConneXion',
  components: {
   IonPage,IonContent,
   IonItem,
   IonInput,
   IonLabel,
   IonButton,
   IonImg
  },
  data(){
      return{
          alertController,
          Email:"",
          PassWord:"",
          loading:false
      }
  },
  methods:{
     async SignIn(){
         //controle connexion
         
         if(window.navigator.onLine==false){
           return  
         }
         try {
             //controle des input
              if(!this.Email || !this.PassWord){
             const alert = await alertController.create({
                 message:"veillez Bien remplir le Formulaire",
                 mode:"ios"
             })
             alert.present()
          } else{
              this.loading=true
              //controle de email
            
               const auth = await getAuth(app)
               const db =await getFirestore(app)
               const UserFour= await signInWithEmailAndPassword(auth,this.Email,this.PassWord)
               const refFour = await doc(db,"FOURNISSEURS",`${UserFour.user.uid}`)
               const FourData = await getDoc(refFour)
               if(FourData.exists()){
                   this.$router.replace({path:"/Home"})
               }else{
                    this.$router.replace({path:"/CreateAcount"})
               }
           
              
          }
         } catch (e) {
             const alert = await alertController.create({message:"erreur ou mot de passe incorrecte"})
             alert.present()
             this.loading=false
         }
      }
  }
});
</script>
<style scoped>
.color{
    color: #898585;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.text1{
    text-align: center;
}
.textWrap{
    text-align: center;
    
}
.ForInput{
    
}
.btn{
    text-align: center;
    margin-top: 19px;
}
.footer{
    text-align: center;
    padding: 3px;
    margin-top: 50px;
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
</style>