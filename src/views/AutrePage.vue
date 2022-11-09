<template>
  <ion-page>
      <ion-header class="ion-no-border">
          <ion-toolbar mode="ios" >
              <ion-title color="primary">CHAP CHAP Fournisseurs</ion-title>
               </ion-toolbar>
              <ion-toolbar mode="ios">
                  <ion-segment :value="ionsegmentValue" @ionChange="segmentChanged($event)" :scrollable="true" swipe-gesture mode="md" v-if="Succes" >
                  <ion-segment-button value="Moi" >
                      <ion-label>Moi</ion-label>
                  </ion-segment-button>

                   <ion-segment-button value="Ajouter">
                      <ion-label>Ajouter Un Produit</ion-label>
                  </ion-segment-button>

                  <ion-segment-button value="Produit">
                      <ion-label>Mes produit</ion-label>
                  </ion-segment-button>

                   <ion-segment-button value="Achete">
                      <ion-label>Mes Produit Achete</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="Client">
                      <ion-label>Mes Client</ion-label>
                  </ion-segment-button>

                    <ion-segment-button value="Message">
                      <ion-label>Mes Messages</ion-label>
                  </ion-segment-button>

                    <ion-segment-button value="Conacte">
                      <ion-label>Nous Contacte</ion-label>
                  </ion-segment-button>

              </ion-segment>
              </ion-toolbar>
              
      </ion-header>
      <ion-content>
           <LoaderPage v-if="loader" />
           
           <div v-if="Succes">
        <!--debut pour la partie Moi-->
         <div class="Moi" v-if="ionsegmentValue=='Moi'">
          <div class="Userinfo">
              <ion-avatar class="UserPhoto">
                  <img :src="userInfo.Photo.link" />
              </ion-avatar>
              
              <div  class="ChangePhoto" v-if="cacheEdit">
                  <ion-item>
               <ion-label class="button-wrap" >Changer la Photo</ion-label>
                 <ion-input class="button" type="file" accept="image/*" :multiple="false" :disabled="toogleBtn" @change="photo" ></ion-input>
                  </ion-item>
                
              </div>
          </div>

           <div class="MagasinRenseignement">
                 <ion-label>
                  <h4> Nom Magasin :<span > {{userInfo.NomMagasin}}</span> </h4>
                  <h4> Cree : <span> {{userInfo.DateCreation}}</span></h4>
                  <h4>Vous avez vendue: <span> {{userInfo.NombreAchat}} produit </span></h4>
                  <h4>Vous avez eu: <span>{{userInfo.MontantTotalAchat}} GNF</span></h4>
                  <h4>Vous avez Publier :<span> {{userInfo.NombreDEPub}} produit </span> </h4>
                  <h4>Votre status : <span>{{userInfo.active ? 'Active' : 'bloque'}}</span> </h4>
                  <h4 class="ion-margin"> lien de partage : <span> {{userInfo.Linkshare}} </span> </h4>
                  <ion-button v-on:click="Copy(userInfo.Linkshare)" class="copybtn">
                      Copier le lien
                  </ion-button>
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
               <ion-input  type="text" v-model="NomMagasin" :disabled="toogleBtn" ></ion-input>
           </ion-item>
           <ion-item>
               <ion-label position="floating">Numero De Telephone Orange</ion-label>
               <ion-input  type="number" v-model="NumeroPhoneOrange" :disabled="toogleBtn"></ion-input>
           </ion-item>
           <ion-item>
               <ion-label position="floating">Numero De Telephone Mtn</ion-label>
               <ion-input  type="number" v-model="NumeroPhoneMtn" :disabled="toogleBtn"></ion-input>
           </ion-item>
            <ion-item>
               <ion-label position="floating">Mot de Passe CO</ion-label>
               <ion-input  type="text" v-model="CO" :disabled="toogleBtn"></ion-input>
           </ion-item>
            <ion-item>
               <ion-label position="floating">Lieux</ion-label>
               <ion-input  type="text" v-model="Ville" disabled></ion-input>
             </ion-item>
             <div class="btnInput">
              <ion-button v-on:click="MettreEnJour()" shape="round" fill="outline" :disabled="toogleBtn" >
                  Mettre En Jour
              </ion-button>
             </div>
       </div>

       <div class="progresbar">
            <div class="Progressbar" v-if="Progress">
           <ion-label class="Pcolor">telechargement de votre Photo</ion-label>
          <ion-progress-bar :value=" ProgressCompte" ></ion-progress-bar>
       </div>
       </div>
      
      </div>
 <!--fin la partie pour moi-->
 <!--Debut Ajout Produit-->
 <div class="AjoutProduit" v-if="ionsegmentValue=='Ajouter'">
     <h5>Ajouter Des Produits</h5>
    <ion-item class="ChoixDeTypeProduit" v-if="ChoixTProduit=='PasDEchoix'">
         <ion-label>Choix de Type de Produit</ion-label>
        <ion-select   placeholder="Select"  @ionChange="ChoixDeTypeProduit($event)">
            <ion-select-option value="Vetement">Vetement</ion-select-option>
            <ion-select-option value="Autre">Autre</ion-select-option>
        </ion-select>
    </ion-item>
       
        <!--Debut enregistrement Produit vetement-->
        <div v-if="ChoixTProduit=='Vetement'" class="forMouse">
        <ion-item>
            <ion-label>Le Nom</ion-label>
            <ion-input v-model="nomProd"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label position="floating">Nom De Recherche</ion-label>
            <ion-input v-model="nom"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label>Selectioner La Categorie</ion-label>
            <ion-select   placeholder="Select " @ionChange="choixCategorie($event)">
                <ion-select-option value="Homme">Homme</ion-select-option>
                <ion-select-option value="Femme">Femme</ion-select-option>
                <ion-select-option value="HommeFemme">Homme et Femme</ion-select-option>
            </ion-select>
        </ion-item>
        <ion-item>
            <ion-label>Prix</ion-label>
            <ion-input v-model="prix" type="number"></ion-input>
        </ion-item>
        <ion-item>
           <ion-label>La qualite du produit </ion-label>
               <ion-select  placeholder="Choisir" @ionChange="choixcategorie($event)">
                   <ion-select-option value="superieure">superieure</ion-select-option>
                   <ion-select-option value="moyenne">moyenne</ion-select-option>
               </ion-select>
        </ion-item>
        
        
        <ion-item>
            <ion-label position="floating"> les noms des Tailles virgule entre eux</ion-label>
            <ion-input v-model="taille" type="text" :disabled="siTailleCouleur.taille" ></ion-input>
        </ion-item>
        
       
        
        <div>
        <ion-item>
            <ion-label position="floating">Les noms des couleurs virgule entre eux</ion-label>
            <ion-input v-model="couleurs" type="text" :disabled="siTailleCouleur.couleur" ></ion-input>
        </ion-item>
        </div>
         <ion-item>
             <ion-label >Les Photo des produits</ion-label>
            <ion-input  type="file" @change="CouleursPhoto" accept="image/*" :disabled="InputPhoto" class="forMouse"  ></ion-input>
        </ion-item>
        <ion-chip color="primary" mode="ios" outline="true" v-for="(Photo,index) in ProduitImage" :key="index" >
            <ion-label>{{Photo.NameColor}}</ion-label>
        </ion-chip>
        <div class="lesbtn">
        <ion-button v-on:click="Prevoir()">
            Prevoir
        </ion-button>
         <ion-button v-on:click="Revenir()">
            revenir 
        </ion-button>
        </div>
        </div>

        <div class="Autre forMouse " v-if="ChoixTProduit=='Autre'" >
               <ion-item>
            <ion-label>Selectioner La Categorie</ion-label>
            <ion-select   placeholder="Select " @ionChange="choixCategorie($event)">
                <ion-select-option value="Homme">Homme</ion-select-option>
                <ion-select-option value="Femme">Femme</ion-select-option>
                <ion-select-option value="HommeFemme">Homme et Femme</ion-select-option>
                <ion-select-option value="accessoires">Accessoires</ion-select-option>
            </ion-select>
          </ion-item>
               <ion-item>
            <ion-label>Le Nom</ion-label>
            <ion-input v-model="nomProd"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label position="floating">Nom De Recherche</ion-label>
            <ion-input v-model="nom"></ion-input>
        </ion-item>
         <ion-item>
            <ion-label>Prix</ion-label>
            <ion-input v-model="prix" type="number"></ion-input>
        </ion-item>
        <ion-item>
           <ion-item>
               <ion-label>La qualite du produit </ion-label>
               <ion-select  placeholder="Choisir" @ionChange="choixcategorie($event)">
                   <ion-select-option value="superieure">superieure</ion-select-option>
                   <ion-select-option value="moyenne">moyenne</ion-select-option>
               </ion-select>
           </ion-item>
        </ion-item>
         <ion-item>
            <ion-label>La Description</ion-label>
           <ion-textarea v-model="Description"></ion-textarea>
        </ion-item>
        <ion-item class="forMouse" >
            <ion-label position="floating" >Les noms des couleurs virgule entre eux</ion-label>
            <ion-input v-model="couleurs"   type="text" :disabled="siTailleCouleur.couleur"  ></ion-input>
        </ion-item>
         <ion-item>
             <ion-label >Les Photo des produits</ion-label>
            <ion-input  type="file" @change="CouleursPhotoAutre" accept="image/*" :disabled="inputAutre"   ></ion-input>
        </ion-item>
         <ion-chip color="primary" mode="ios" outline="true" v-for="(Photo,index) in ProduitImage" :key="index" >
            <ion-label>{{Photo.NameColor}}::succes</ion-label>
        </ion-chip>
         <div class="lesbtn">
        <ion-button v-on:click="PrevoirAutre()">
            Prevoir
        </ion-button>
         <ion-button v-on:click="Revenir()">
            revenir 
        </ion-button>
        </div>

        </div>

       <canvas id="resized" v-show="false"></canvas>


        <div class="prevoir" v-if="ChoixTProduit=='prevoir'">
      <div  class="container" >
          <div v-for="(t,index) in ProduitImage" :key="index" class="grid">
           <ion-avatar>
               <img :src="t.url "/>
           </ion-avatar>
          <ion-label>{{t.NameColor}}</ion-label>
          </div>
      </div>
           <div>
            <ion-label slot="start" class="lesPrevoir">
 <h5 v-for="(taill,index) in taille " :key="index"> Taille:<span > {{taill}}</span></h5>
                <h5>Nom Du Produit: <span>{{nomProd}}</span></h5>
                <h5>Nom De Recherche: <span>{{nom}}</span></h5>
                <h5>Le Prix :<span> {{prix.toLocaleString('en-US')}} GNF</span></h5>
                <h5>La Qualite: <span>{{qualite}}</span> </h5>
                <h5>Categorie: <span> {{categori}}</span></h5>
                <h5 >Description: <span> {{Description}}</span></h5>
            </ion-label>
            </div>
        <ion-button v-on:click="EnregistreProduit()" :disabled="btnEnregistre">
            Enregistre
        </ion-button>
        <ion-button v-on:click="PublierProduit()" :disabled="btnPublier">
            Publier
        </ion-button>
        <ion-button v-on:click="RevenireAEdition()">
            Revenir a l'edition
        </ion-button>
        </div>

     </div>
   
   <VoirMesProduits v-if="ionsegmentValue=='Produit'" />
   <LesAchats v-if="ionsegmentValue=='Achete'"/>
   <ConTact v-if="ionsegmentValue=='Conacte'" />
    <MesClient v-if="ionsegmentValue=='Client'" />
    <CanChat v-if="ionsegmentValue=='Message'" />
    
 </div>





      
      <div class="erreur" v-if="erreur">
          <img :src="require('../images/erreurImage.png')" alt="">
          <ion-button v-on:click="TryAgain()">
              Reessayer
          </ion-button>
      </div>

      </ion-content>
 </ion-page>
</template>

<script>

import { defineComponent } from 'vue';
import {IonPage,IonContent,IonHeader,IonToolbar,IonTitle,IonSegment,IonSegmentButton,IonLabel,IonAvatar,IonToggle,IonItem,IonInput,IonButton,IonProgressBar,alertController,IonSelect,IonSelectOption,IonChip,IonTextarea,loadingController} from '@ionic/vue'
import { closeCircleOutline } from 'ionicons/icons';
import LoaderPage from '@/components/LoaderPage.vue'
import LesAchats from '@/components/LesAchats.vue'
import CanChat from '@/components/CanChat.vue'
import VoirMesProduits from '@/components/VoirMesProduits.vue'
import ConTact from '@/components/ConTact.vue'
import MesClient from '@/components/MesClients.vue'
import { Network } from '@capacitor/network';
import { getAuth, onAuthStateChanged, } from '@firebase/auth';
import app from '@/Firebase';
import { Clipboard } from '@capacitor/clipboard'
import {   collection, doc,  getDoc, getFirestore, increment, setDoc, Timestamp, updateDoc } from '@firebase/firestore';
import { getStorage,ref,deleteObject, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
export default defineComponent ({
  name:"AutrePage",
  components:{IonPage,IonContent,IonHeader,IonToolbar,IonTitle,IonSegment,IonSegmentButton,IonLabel,IonAvatar,LoaderPage,IonToggle,IonItem,IonInput,IonButton,IonProgressBar,IonSelect,IonSelectOption,IonChip,IonTextarea,VoirMesProduits,LesAchats,ConTact,MesClient,CanChat},
  data(){
      return{
          closeCircleOutline,
          toogleBtn:true,
          ProgressCompte:0,
          alertController,
          IonProgressBar,
          loadingController,
          //vif 
          loader:true,
          Succes:false,
          erreur:false,
          Progress:false,
          cacheEdit:false,
          ionsegmentValue:"Moi",
          ChoixTProduit:"PasDEchoix",
          siTailleCouleur:{taille:false,couleur:false},
          compteur:"", //le compteur pour input de la photo
          AutreC:0, //le compteur pour les produit de type Autre
          AutreC2:0,
          InputPhoto:false,// pour ajout en cas de vetement
          inputAutre:false,//pour ajout en en cas Autre
          controleCouleurVetement:false,
          controleCouleurAutre:false,
         btnPublier:true,
         btnEnregistre:false,
          //data
          //userInfo pour la partie MOI
          userInfo:{},
          NomMagasin:"",
          Ville:"",
          CO:"",
          NumeroPhoneOrange:"",
          NumeroPhoneMtn:"",
          AncienphotoName:"",
          userUId:"",
          //ajouter des produit
          nomProd:"",
          nom:"",
          prix:"",
          qualite:"",
          taille:"",
          couleurs:"",
          categori:"",
          ProduitImage:[],
          LesCouleurs:[],
          Description:"",
          take:[],//partie publication
          takeLesLienPhoto:[]//partie publication
          //pour Mes produit ajouter
          
      }
  },
  watch:{
couleurs:function(newValue){
  this.couleurs=newValue
},
taille:function(nValue){
    this.taille=nValue
}
  },
 async beforeCreate(){
      if(window.navigator.onLine==false){
          this.loader=false
          this.erreur=true
          return
      }
      try {
          
          //prendre les donne de l'utlisateur
          let User
          const auth = await getAuth(app)
          const db = await getFirestore(app)
          await onAuthStateChanged(auth,(user)=> User=user.uid)
          this.userUId=User
          const refFour = await doc(db,"FOURNISSEURS",`${User}`)
          const DataFour = await getDoc(refFour)
          if(DataFour.exists()){
               this.userInfo=DataFour.data()
               let take= this.userInfo.DateCreation
               let convertdate = new Date(take.seconds*1000)
                this.userInfo.DateCreation= convertdate.toDateString()
                this.NomMagasin=this.userInfo.NomMagasin
                this.Ville=this.userInfo.Ville
                this.CO=this.userInfo.CO
                this.NumeroPhoneOrange=this.userInfo.NumeroPhoneOrange
                this.NumeroPhoneMtn= this.userInfo.NumeroPhoneMtn
                this.AncienphotoName=this.userInfo.Photo.name
               this.loader=false
               this.Succes=true
               this.erreur=false
               
          }
      } catch (e) {
          this.erreur=true
          this.loader=false
          this.Succes=false
          
      }
  },
  
  methods:{
      //pour la qualite
      choixcategorie(event){
          this.qualite=event.detail.value
          console.log(this.qualite)
      },
      //pour le copy
      async Copy(link){
           await Clipboard.write({
               url:link
           }).then(async()=>{
             const alert = await alertController.create({header:"copier avec succes vous pouvez partager maintenant sur Facebook Whatsap et messenger "})
          alert.present()
           })
       },

      //tryAGain
     async TryAgain(){
          if(window.navigator.onLine==false){
              this.myAlert("erreur internet")
          this.loader=false
          this.erreur=true
          return
      }
      try {
          
          //prendre les donne de l'utlisateur
          let User
          const auth = await getAuth(app)
          const db = await getFirestore(app)
          await onAuthStateChanged(auth,(user)=> User=user.uid)
          this.userUId=User
          const refFour = await doc(db,"FOURNISSEURS",`${User}`)
          const DataFour = await getDoc(refFour)
          if(DataFour.exists()){
                this.userInfo=DataFour.data()
               let take= this.userInfo.DateCreation
               let convertdate = new Date(take.seconds*1000)
                this.userInfo.DateCreation= convertdate.toDateString()
                this.NomMagasin=this.userInfo.NomMagasin
                this.Ville=this.userInfo.Ville
                this.CO=this.userInfo.CO
                this.NumeroPhoneOrange=this.userInfo.NumeroPhoneOrange
                this.NumeroPhoneMtn= this.userInfo.NumeroPhoneMtn
                this.AncienphotoName=this.userInfo.Photo.name
               this.loader=false
               this.Succes=true
               this.erreur=false
               
          }
      } catch (e) {
          this.erreur=true
          this.loader=false
          this.Succes=false
          
      }
     },
     //plublication du produit
    async PublierProduit(){
         let Premiun=false
         let like = 0
         let Nvente=0
        const db = await getFirestore(app)
        const refFour = await doc(db,"FOURNISSEURS",this.userUId)
        const Four = await getDoc(refFour)
        if(Four.exists()){
            let take=Four.data()
            if(take.premium==true){
                Premiun=true
                like=10
                Nvente=60
            }
        }
    
        const attendre = await loadingController.create({message:"patientez"})
        attendre.present()
        //convertir le prix en nom
        this.prix=parseInt(this.prix)
        
        try {
            if(this.take){
                if(this.taille){
               //gestion pour la taille
                 //cas premium a gerer
            this.take.forEach(async element => {
              const docRef= await doc(collection(db,"PRODUITS"))
                   await setDoc(docRef,{
                       publier:true,
                      IdFournisseur:this.userUId,
                      Cree:Timestamp.now(),
                      Nvente:Nvente,
                      categori:this.categori,
                      id: docRef.id,
                      LinkPhoto:`${element.lien}`,
                      liked:like,
                      Qualite:this.qualite,
                      nomProd:this.nomProd,
                      nom:`${this.nom} ${element.COuLeur}`,
                      couleur:`${element.COuLeur}`,
                      RenseignementPhoto:`${element.fichierName}`,
                      prix:this.prix,
                      ville:this.userInfo.Ville,
                      slidePhoto:this.takeLesLienPhoto,
                      taille:this.taille,
                      premium:Premiun,
                      views:0,
                      NumeroPhoneOrange:this.NumeroPhoneOrange
                      }).then(async()=>{
                           const refFour = doc(db,"FOURNISSEURS",`${this.userUId}`)
                           await updateDoc(refFour,{
                               NombreDEPub:increment(1)
                           })
                            await updateDoc(docRef,{
                                     linkSahre:`https://chapchap.store/P/${docRef.id}`
                                 })

                           this.btnPublier=true
                           this.btnEnregistre=true
                           this.myAlert("ajouter avec succes")
                      })

            });
            
           
            } else{ 
                  if (this.Description){
                       const docRef= await doc(collection(db,"PRODUITS"))
                //cas une seule couleur avec plusieur photo
               
               
                let i = this.take.findIndex(e=>e.COuLeur!=undefined)
                let colorName = this.take[i].COuLeur
                this.takeLesLienPhoto.forEach(element => {
                    if(element.COuLeur==undefined){
                        element.COuLeur="Meme produit"
                    }
                });
                     let i2= this.take.findIndex(e=>e.COuLeur==undefined)
                 
               let lien = this.take[i].lien
               let fichierName = this.take[i].fichierName
                
                //remplissage des couleurs de poto

                if(i2!=-1){
                
                   await setDoc(docRef,{
                     publier:true,
                      Cree:Timestamp.now(),
                      id:docRef.id,
                      IdFournisseur:this.userUId,
                      Nvente:Nvente,
                      categori:this.categori,
                      LinkPhoto:lien,
                      liked:like,
                      Qualite:this.qualite,
                      nomProd:this.nomProd,
                      nom:this.nom,
                      couleur:colorName,
                      RenseignementPhoto:fichierName,
                      prix:this.prix,
                      description:this.Description,
                      premium:Premiun,
                      slidePhoto:this.takeLesLienPhoto,
                      ville:this.userInfo.Ville,
                      views:0,
                      NumeroPhoneOrange:this.NumeroPhoneOrange
                          }).then(async()=>{
                           const refFour = doc(db,"FOURNISSEURS",`${this.userUId}`)
                           await updateDoc(refFour,{
                               NombreDEPub:increment(1)
                           })
                            await updateDoc(docRef,{
                                     linkSahre:`https://chapchap.store/P/${docRef.id}`
                                 })

                           this.btnPublier=true
                           this.btnEnregistre=true
                           this.myAlert("ajouter avec succes")
                           attendre.dismiss()
                          
                           
                      })
                } else {
                   //cas plusieurs couleurs 
                   this.take.forEach(async element => {
              const docRef= await doc(collection(db,"PRODUITS"))
                   await setDoc(docRef,{
                       publier:true,
                      IdFournisseur:this.userUId,
                      Cree:Timestamp.now(),
                      Nvente:Nvente,
                      categori:this.categori,
                      id:docRef.id,
                      LinkPhoto:`${element.lien}`,
                      liked:like,
                      Qualite:this.qualite,
                      nomProd:this.nomProd,
                      nom:this.nom,
                      couleur:`${element.COuLeur}`,
                      RenseignementPhoto:`${element.fichierName}`,
                      prix:this.prix,
                      slidePhoto:this.takeLesLienPhoto,
                      description:this.Description,
                      premium:Premiun,
                      views:0,
                      NumeroPhoneOrange:this.NumeroPhoneOrange
                      }).then(async ()=>{
                            const refFour = doc(db,"FOURNISSEURS",`${this.userUId}`)
                           await updateDoc(refFour,{
                               NombreDEPub:increment(1)
                           })
                            await updateDoc(docRef,{
                                     linkSahre:`https://chapchap.store/P/${docRef.id}`
                                 })

                           this.btnPublier=true
                           this.btnEnregistre=true
                           this.myAlert("ajouter avec succes")
                      })

            });
                }
            }
            }
            }
             attendre.dismiss()
        } catch (e) {
            attendre.dismiss()
            this.myAlert(`erreur`)
            this.btnPublier=true
            this.btnEnregistre=false
            console.log(e)
            console.log(this.take)
            
        }
            
     },
      //gestion de la publication du produit
     async EnregistreProduit(){
         //verification si le fournisseur est active
         if(this.userInfo.active==false){
             const alert = await alertController.create({header:"Vous ne pouvez pas publier n'y enregistre un produit car votre status est desactive veillez contacte le service"})
             alert.present()
              this.btnPublier=true
            this.btnEnregistre=false
            return
         }
         const attendre = await loadingController.create({message:"patientez s'il vous plait"})
         
        attendre.present()
           const metadata = {
        contentType: 'image/jpeg'
                     };
         try {
                let i=1
              const storage = await getStorage(app)
              /*
             
              */  
              //PARCOUR POUR AJOUTER LES PHOTO DANS LE STORAGE
              this.ProduitImage.forEach(async element => {
                
                    const refFour = await ref(storage,`ProductImg/${this.userInfo.NomMagasin}/`+`${element.fichier.name}`)
                     const upload =   uploadBytesResumable(refFour,element.fichier,metadata) 
                   await  upload.on("state_changed",
                     (resultat)=>{
                         const progress = (resultat.bytesTransferred/resultat.totalBytes)*100
                         console.log(progress)
                     },(e)=>{
                         this.myAlert("erreur de publication reessayer"+e.message)
                         attendre.dismiss()
                         this.btnPublier=true
                         this.btnEnregistre=false
                     },()=>{
                         getDownloadURL(upload.snapshot.ref).then((path)=>{   
                         this.take.push({lien:path,COuLeur:element.NameColor,fichierName:element.fichier.name})
                         this.takeLesLienPhoto.push({lien:path,COuLeur:element.NameColor,Publier:true}) 
                          this.myAlert(` enregistrement ${i} avec succes `)
                          
                          if(i==this.ProduitImage.length){
                              this.btnPublier=false
                            attendre.dismiss()
                            this.btnEnregistre=true
                            console.log(this.take)
                          }
                          i=i+1
                         })
                     })
              });
            
             
              
          
         } catch (e) {
             console.log(e.message)
            this.myAlert("erreur d'enregistrement reessayer")
            this.btnPublier=true
            this.btnEnregistre=false
         }
          
      },
      //gestion button revenir a l'edition
      RevenireAEdition(){
          if(this.Description){
          this.ChoixTProduit="Autre"
             if(this.btnPublier==true && this.btnEnregistre==true){
                  this.categori=""
          this.nom=""
         this.nomProd="",
         this.Description=""
         this.ProduitImage=[]
         this.LesCouleurs=[]
         this.couleurs=""
         this.qualite=""
         this.prix=""
         this.taille=""
        this.compteur=0
        this.AutreC=0
        this.AutreC2=0
        this.inputAutre=false
        this.InputPhoto=false
        this.controleCouleurVetement=false
        this.controleCouleurAutre=false
        this.take=[]
        this.takeLesLienPhoto=[]
             }
          }else {
                this.ChoixTProduit="Vetement"
                  if(this.btnPublier==true && this.btnEnregistre==true){
                  this.categori=""
          this.nom=""
         this.nomProd="",
         this.Description=""
         this.ProduitImage=[]
         this.LesCouleurs=[]
         this.couleurs=""
         this.qualite=""
         this.prix=""
         this.taille=""
        this.compteur=0
        this.AutreC=0
        this.AutreC2=0
        this.inputAutre=false
        this.InputPhoto=false
         this.controleCouleurVetement=false
        this.controleCouleurAutre=false
          this.take=[]
         this.takeLesLienPhoto=[]
             }
          }
              
          
      },
      //gestion button pour revenir au niveau pasdechoix
      Revenir(){
         this.categori=""
         this.nom=""
         this.nomProd="",
         this.Description=""
         this.ProduitImage=[]
         this.LesCouleurs=[]
         this.couleurs=""
         this.qualite=""
         this.prix=""
         this.taille=""
        this.compteur=0
        this.AutreC=0
        this.AutreC2=0
        this.inputAutre=false
        this.InputPhoto=false
        this.ChoixTProduit="PasDEchoix"
        this.controleCouleurVetement=false
        this.controleCouleurAutre=false
         this.take=[]
         this.takeLesLienPhoto=[]

      },
      //gestion prevoir Pour en cas Autre
      PrevoirAutre(){
         if(this.nom && this.prix && this.Description && this.categori && this.qualite!=undefined && this.qualite && this.ProduitImage && this.nom && this.nomProd){
             this.ChoixTProduit="prevoir"
             this.btnPublier=true
             this.btnEnregistre=false
             this.prix=parseInt(this.prix)
             
         }else{
             this.myAlert("veillez bien remplir le formulaire")
         }
      },
      //gestion des couleur en cas Autre
     
     
    async CouleursPhotoAutre(file){
        //gestion des photo en cas ajout de autre
          if(this.controleCouleurAutre==false){
              if(this.couleurs==""){
                  this.myAlert("Veillez rentrer une couleur")
                  return
              } else{
                  if(this.couleurs.includes(',')){
                      this.LesCouleurs=this.couleurs.split(',')
                this.inputAutre=false
                this.AutreC= this.LesCouleurs.length
                this.ProduitImage=[]
                  } else{
                       this.LesCouleurs.push(this.couleurs)
                    this.ProduitImage=[]
                    this.AutreC2=0
                  }
              }
              this.controleCouleurAutre=true
          }
         if(file.target.files[0]){
             
          if(this.AutreC==0 ){
                  //fin
            this.ProduitImage[this.AutreC2]={fichier:file.target.files[0],url:URL.createObjectURL(file.target.files[0]),NameColor:this.LesCouleurs[this.AutreC2]}
            this.AutreC2=this.AutreC2+1
            if(this.AutreC2==5){
                this.myAlert("nombre de photo atteint")
                this.inputAutre=true
               
            }
        } else {
            
             this.ProduitImage[this.AutreC2]={fichier:file.target.files[0],url:URL.createObjectURL(file.target.files[0]),NameColor:this.LesCouleurs[this.AutreC2]}
             this.AutreC2=this.AutreC2+1
             if(this.AutreC2==this.LesCouleurs.length){
                 this.myAlert('nombre de photo atteint')
                 this.inputAutre=true
             }
        }     
       
     }else {
         this.myAlert('image non selectionne')
     }
     },
     
      //debut ajout si vetement
      //le button prevoir
      Prevoir(){
        if(this.nomProd && this.nom && this.qualite && this.categori && this.ProduitImage.length==this.LesCouleurs.length && this.taille){
            this.prix=parseInt(this.prix)
            this.ChoixTProduit="prevoir"
            this.btnEnregistre=false,
            this.btnPublier=true
            
        }else{
            this.myAlert("veillez bien remplir les formulaires")
        }
      },
      //gestion pour la taille
     ControleTaille(){
       if(!this.taille){
          this.myAlert("erreur au niveau de la taille")
       }else{
            let take = this.taille 
           if(take.includes(",")){
               this.taille=take.split(",")
           } else{
           this.taille=[take]
           
       }
       }

     },
      //controle des couleur mis par l'utilisateur
       
      //founction pour mes alert
     async myAlert(texte){
         const alert = await alertController.create({message:`${texte}`})
         alert.present()
         setTimeout(()=>{
             alert.dismiss()
         },4000)
     },
      //chargement des photo des produits
      CouleursPhoto(file){
          //gestion des couleurs
          if(this.controleCouleurVetement==false){
              //pour la taille
              if(this.taille==""){
                   this.myAlert("veillez rentre la taille")
              return
              } else {
                  let take = this.taille
                  if(this.taille.includes(',')){
                    this.taille=take.split(',')
                  } else{
                      this.taille=[take]
                  }
              }
              //fin controle taille
          if(this.couleurs==""){
              this.myAlert("veillez rentre une couleur au moin ou ecrivez pas de couleur")
              return
          } else {
              if (this.couleurs.includes(',')){
                  this.LesCouleurs=this.couleurs.split(',')
                  this.compteur=1
                    this.ProduitImage=[]
              }else{
                  this.LesCouleurs[0]=this.couleurs
                    this.compteur=0
                    this.ProduitImage=[]
              }
          }
          this.controleCouleurVetement=true
          }
          if(file.target.files[0]){

              
        if(this.compteur==0){
            this.ProduitImage[0]={fichier:file.target.files[0],url:URL.createObjectURL(file.target.files[0]),NameColor:this.LesCouleurs[0]}
           this.InputPhoto=true
        } else{
            this.compteur=this.compteur-1
           if(this.compteur<=this.LesCouleurs.length-1){

            this.ProduitImage[this.compteur]={fichier:file.target.files[0],url:URL.createObjectURL(file.target.files[0]),NameColor:this.LesCouleurs[this.compteur]}
            this.compteur=this.compteur+2
           } else {
               this.myAlert("le nombre de photo pour ces couleur est atteint")
               
           }
        }
      } else{
          this.myAlert("fichier non selectionner")
      }
      },
      //si Taille
      Sitaille(){
        if(this.siTailleCouleur.taille==false){
            this.siTailleCouleur.taille=true
        }else{
            this.siTailleCouleur.taille=false
        }
      },
      //si Couleur
      Sicouleur(){
          //desactivation de checkbox
       if(this.siTailleCouleur.couleur==false){
           this.siTailleCouleur.couleur=true
             if(this.ProduitImage){
                 this.ProduitImage=[]
                 this.compteur=0
                 this.couleurs=""
                this.InputPhoto=true
                this.LesCouleurs=[]
             } 
       }else{
           //activation de checkbox
            this.siTailleCouleur.couleur=false
           this.InputPhoto=false
           this.controleCouleurVetement=false

       }
      },
      //fin ajout en cas De vetement
      //choix de categori
      choixCategorie(event){
          this.categori=event.target.value
          console.log(this.categori)
      },
      //choix du ype de produit
      ChoixDeTypeProduit(event){
       this.ChoixTProduit=event.target.value
       
      },
      //debut gestion segment button
      segmentChanged(event){
        this.ionsegmentValue=event.target.value
        console.log(this.ionsegmentValue=event.target.value)
      },
      //fin gestion de segment Button
      //debut des fonction Pour Moi
     async MettreEnJour(){
          if((await Network.getStatus()).connected==false){
              const alert = await alertController.create({message:"erreur internet"})
              alert.present()
              return
          }
          try {
              if(this.NomMagasin==this.userInfo.NomMagasin && this.CO==this.userInfo.CO && this.NumeroPhoneMtn==this.userInfo.NumeroPhoneMtn && this.NumeroPhoneOrange==this.userInfo.NumeroPhoneOrange){
                  const alert = await alertController.create({message:"mise en jour effectue"})
                  alert.present()
                  return
              }
              //controle de CO OU NUMEROPHONE

              this.CO.trim()
              this.NumeroPhoneOrange.trim()
              this.NumeroPhoneMtn.trim()
              if(this.CO.length<4|| this.NumeroPhoneOrange.length!=9 || this.NumeroPhoneOrange.length!=9){
                  const alert = await alertController.create({message:"Le CO doit etre superieur a 4 / le numero Doit etre egale a 9"})
                  alert.present()
                  return
              }
              //la Mise en jour Maitenant
              this.toogleBtn=true
              const db = await getFirestore(app)
              const refFour = await doc(db,"FOURNISSEURS",`${this.userUId}`)
              await updateDoc(refFour,{
                  NomMagasin:this.NomMagasin,
                  CO:this.CO,
                  NumeroPhoneOrange:this.NumeroPhoneOrange,
                  NumeroPhoneMtn:this.NumeroPhoneMtn,
              }).then(async()=>{
                const newData= await getDoc(refFour)
                if(newData.exists()){
                    this.userInfo=newData.data()
                     let take= this.userInfo.DateCreation
                   let convertdate = new Date(take.seconds*1000)
                    this.userInfo.DateCreation= convertdate.toLocaleDateString("fr-Fr")
                    this.toogleBtn=false
                }
              })

          } catch (e) {
              const alert = await alertController.create({message:"erreur de Mise en Jour reessayer"})
                  alert.present()
                  this.toogleBtn=false
          }
      },
      push(event){
         if(event.target.value=="true"){
             this.toogleBtn=false
             this.cacheEdit=true
         } else if (event.target.value=="false") {
             this.toogleBtn=true
             this.cacheEdit=false
         }
          
      },
     async photo(file){
    try {
        this.toogleBtn=true
        const PhotoName= this.userInfo.Photo.name
            let take = file.target.files[0]
        const metadata = {
         contentType: 'image/jpeg'
                };
         this.Progress=true
         const storage = await getStorage(app)
         const refNewImg = await ref(storage,'ImgFour/'+take.name)
         const upload = uploadBytesResumable(refNewImg,take,metadata)
      await   upload.on("state_changed",
         (resultat)=>{
            const progression = (resultat.bytesTransferred/resultat.totalBytes)*100
            this.ProgressCompte=progression/100
         },
        async (e)=>{
             const alert = await alertController.create({message:"erreur de chargement"+e.message})
             alert.present()
             this.Progress=false
             this.toogleBtn=false
             return
         },()=>{
             getDownloadURL(upload.snapshot.ref).then(async(path)=>{
              
               const db = await getFirestore(app)
               const refFour = await doc(db,"FOURNISSEURS",`${this.userUId}`)
             await  updateDoc(refFour,{
                   "Photo.link":path,
                   "Photo.name":take.name,
               }).then(async()=>{
                const newData = await getDoc(refFour)
                if(newData.exists()){
                    this.userInfo=newData.data()
                     let take= this.userInfo.DateCreation
                   let convertdate = new Date(take.seconds*1000)
                    this.userInfo.DateCreation= convertdate.toDateString()
                     this.userInfo.Photo.link=path
                     this.Progress=false
                     this.toogleBtn=false
                }
                
                 
               })
              
             })
         })
         const refAncienImg= await ref(storage,'ImgFour/'+PhotoName)
                await deleteObject(refAncienImg)
    } catch (e) {
         const alert = await alertController.create({message:"erreur de chargement"})
         this.Progress=false
             alert.present()
             this.toogleBtn=false
    }
  }
  //fin des founction pour Moi
  }
})
</script>

<style scoped>

.erreur{
    text-align: center;
    margin-top: 30%;
}
.Userinfo .UserPhoto  {
    margin: auto;
}
.Userinfo .ChangePhoto ion-input{
    margin-left: 20px;
}
.Userinfo .ChangePhoto ion-label{
    margin-left: 26px;
}
.MagasinRenseignement ion-label{
    text-align: center;
    
}
.MagasinRenseignement ion-label h4{
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;  
}
.MagasinRenseignement ion-label h4 span{
    color: #03a61c;
}
.ChoixDeTypeProduit{
    margin-top: 10%;
}
.container{
    display: flex;
    flex-flow: row wrap;
    align-content: space-around;
    justify-content: center;
    
}
.lesPrevoir h5 span{
 color: #03a61c;
}
.lesPrevoir ion-label h5{
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.lesPrevoir {
    text-align: center;
}
.lesPrevoir ion-button{
    text-align: center;
}
h5{
    text-align: center;
   
}
.Vetement ion-item {
    margin: 2px;
}
.lesbtn{
    text-align: center;
    margin: 10px;
}
.forMouse :hover{
 cursor: pointer;
}
.copybtn{
    margin-left: 100px;
}
</style>