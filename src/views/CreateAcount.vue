<template>
  <ion-page>
      <ion-content>
          <div v-if="success">
          <div>
          <ion-img class="img"  :src="require('../images/Sign up-cuate.png')"></ion-img>
          </div>
          <div >
       <ion-item>
           <ion-label class="color" position="floating">Nom de Magasin</ion-label>
           <ion-input type="text" v-model="NomMagasin"></ion-input>
       </ion-item>
        <ion-item>
           <ion-label class="color" position="floating">Lieux</ion-label>
           <ion-input type="text" v-model="Ville" disabled></ion-input>
       </ion-item>
       <ion-item>
           <ion-label class="color" position="floating">Numero De contact Orange</ion-label>
           <ion-input type="number" v-model="NumeroPhoneOrange"></ion-input>
       </ion-item>
        <ion-item>
           <ion-label class="color" position="floating">Numero De contact MTN</ion-label>
           <ion-input type="number" v-model="NumeroPhoneMtn"></ion-input>
       </ion-item>
           <ion-item>
           <ion-label class="color" position="floating">Mot De Passe CO</ion-label>
           <ion-input type="password" v-model="CO"></ion-input>
       </ion-item>

       <ion-item>
           <ion-label class="color">Type De Magasin</ion-label>
           <ion-select   placeholder="Selectionne le type" @ionChange="Typemagasin($event)" >
               <ion-select-option value="Homme">Pour Homme</ion-select-option>
               <ion-select-option value="Femme">Pour Femme</ion-select-option>
                <ion-select-option value="Autre">Autre</ion-select-option>
           </ion-select>
       </ion-item>
           <div v-if="FiniUpload">
           <ion-label class="inputFileBtn">Choisir Une Photo</ion-label>
           <ion-input type="file" accept="image/*" :multiple="false" id="MyinputFile" @change="photo"></ion-input>
           </div>
       </div>
       <div class="Btn" v-if="btn">
            <ion-button v-on:click="CreateAccount()" shape="round" :disabled="BtnProgress">
             Cree mon Compte
         </ion-button>
       </div>
       </div>
        <div class="loader" v-if="loading"></div>
      
       <div class="Progressbar" v-if="Progress">
           <ion-label class="Pcolor">telechargement de votre Photo</ion-label>
          <ion-progress-bar :value=" ProgressCompte" ></ion-progress-bar>
       </div>
      </ion-content>
</ion-page>
</template>

<script>
import { Network } from '@capacitor/network';
import { IonPage,IonContent,IonImg,IonLabel,IonInput,IonSelect,IonSelectOption,IonItem,IonButton,alertController,IonProgressBar, loadingController } from '@ionic/vue';
import { defineComponent } from 'vue';
import {getFirestore,doc,setDoc,Timestamp, collection, updateDoc, } from "firebase/firestore"
import { getAuth,onAuthStateChanged} from 'firebase/auth'
import app from '@/Firebase';
import { getStorage, ref,uploadBytesResumable,getDownloadURL} from "firebase/storage";
import store from '@/VerifyUserStore';
export default defineComponent({
  name: 'CreateAccount',
  components: {
   IonPage,IonContent,
   IonInput,
   IonLabel,
   IonSelect,
   IonSelectOption,
   IonItem,
   IonImg,
   IonButton,
   IonProgressBar,
  },
  data(){
      return{
          loading:false,
          alertController,
          NomMagasin:"",
          Lieux:"",
          NumeroPhoneOrange:"",
          NumeroPhoneMtn:"",
          CO:"",
          TypeMagasin:"",
          Photo:{link:"",name:""},
          Ville:"",
          //FIREBASE 
          user:"",
          Progress:false,
          ProgressCompte:0,
          BtnProgress:false,
          FiniUpload:true,
          //vif
          success:true,
          erreur:false,
          btn:true,
          //localisation
          
      }
      
  },
 
 async mounted(){
        //debut pour la geolocalistion dans le store
        await store.get("Ville").then((value)=>this.Ville=value)
         //fin pour localisat
  },
  methods:{
     async CreateAccount(){
         
         this.loading=true
         this.btn=false
       if(window.navigator.onLine==false){
      const alert = await alertController.create({message:"erreur internet"})
      alert.present()
      this.loading=false
      this.btn=true
        return
       } 
       const attendre = await loadingController.create({message:"patientez"})
       attendre.present()
       try {
           this.loading=true
           //controle fromulaire
         if(!this.NomMagasin || !this.Ville || !this.NumeroPhoneMtn || !this.NumeroPhoneOrange || !this.CO || !this.TypeMagasin || !this.Photo.link){
             const alert = await alertController.create({message:"Veillez Bien Remplir Les Formulaires"})
             alert.present()
             this.loading=false
             this.btn=true
             return
         } else{
             //controle CO et Numero De telePhone
             this.CO.trim()
             this.NumeroPhoneOrange.trim()
              this.NumeroPhoneMtn.trim()
             if(this.CO.length<4 || this.NumeroPhoneOrange.length!=9 || this.NumeroPhoneMtn.length!=9){
                  const alert = await alertController.create({message:"Le mot de passe CO doit etre Superirue a 4 ou veillez entre un numero de telephone valide"})
                  alert.present()
                  this.loading=false
                  this.btn=true
                  return
             }
             //FIN controle  CO et numero de telephone
             
             this.loading=true
            const db = await getFirestore(app)
             const auth = await getAuth(app)
             
             //prendre l'id de l'utilisateur
             await onAuthStateChanged(auth,(User)=>{
                 if(User){
                     this.user=User.uid
                 }
             })
             const refFour = await doc(db,"FOURNISSEURS",`${this.user}`)
             await setDoc(refFour,{
                 id:this.user,
              NomMagasin:this.NomMagasin,
              Ville:this.Ville,
              NumeroPhoneOrange:this.NumeroPhoneOrange,
              NumeroPhoneMtn:this.NumeroPhoneMtn,
              CO:this.CO,
              TypeMagasin:this.TypeMagasin,
              DateCreation:Timestamp.now(),
              MontantTotalAchat:0,
              ToutAchat:[],
              Photo:this.Photo,
              NombreAchat:0,
              NombreDEPub:0,
              HistoriqueAchat:[],
              premium:false,
              active:true,
              AbonementUser:[],
              useClient:false
             }).then(async ()=>{
              await updateDoc(refFour,{
                      Linkshare:`https://www.chapchap.store/F/${this.user}`
                  }).then(()=>{
                       this.loading=false
                this.$router.replace({path:"/AutrePage"})
                  })
             })
             
            attendre.dismiss() 
         }
       } catch (e) {
           const alert = await alertController.create({message:"erreur Reessayer"})
           alert.present()
           this.loading=false
           this.btn=true
           console.log(e)
           attendre.dismiss()
           
       }
      },
      //partie pour choix de type magasin
      Typemagasin(event){
         this.TypeMagasin=event.detail.value
         console.log(this.Typemagasin)
      },
      //partie pour upload photo
    async  photo(file){
        const metadata = {
  contentType: 'image/jpeg'
    };
         let take =file.target.files[0]
         this.Photo.name=take.name
         this.Progress=true
         const storage = await getStorage(app)
            //ajouter la photo dans storage
           const FimgRef = await ref(storage,'ImgFour/'+take.name)
           const upload =   uploadBytesResumable(FimgRef,take,metadata)
           upload.on("state_changed",
             (resultat)=>{
                 const progression= (resultat.bytesTransferred/resultat.totalBytes)*100
                 this.ProgressCompte=progression/100
                 this.BtnProgress=true
                 this.Progress=true
             },
           async  ()=>{
                 const alert = await alertController.create({message:"erreur dans le chargement de la photo reessayer veillez choisir une photo"})
                 alert.present()
                 this.Progress=false
                 
             },
             ()=>{
                 getDownloadURL(upload.snapshot.ref).then(async(path)=>{
                     this.Photo.link=path
                     this.Progress=false
                     this.FiniUpload=false
                     this.BtnProgress=false
                     const alert = await alertController.create({message:"Photo telecharger avec succes"})
                     alert.present()
                     setTimeout(()=>{
                         alert.dismiss()
                     },2000)

                 })
             }
           )
      }
  }
});
</script>
<style scoped>

.color{
    color:#898585 ;
}
#MyinputFile{
    position: absolute;
  max-width: 150px;
  max-height: 32px;
  opacity: 0;
  
}
.inputFileBtn{
    position: relative;
    top: 20px;
    border:1px solid #898585 ;
     color:white ;
     background-color: #03a61c;
}
.Btn{
    margin-top: 50px;
    text-align: center;
}
.img{
    height: 250px;
}.btn{
    position: fixed;
    top: 50%;
    left: 30%;
}
.loader{
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #03a61c; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;  
  position: fixed;
  top: 50%;
  left: 48%;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.Progressbar{
    text-align: center;
}
.Pcolor{
    color: #898585;
}
</style>