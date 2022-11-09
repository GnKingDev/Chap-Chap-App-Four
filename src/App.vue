<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet,useBackButton,useIonRouter,alertController, loadingController, toastController } from '@ionic/vue';
import { defineComponent, onMounted } from 'vue';
import app from "./Firebase"
import {getAuth,onAuthStateChanged} from "firebase/auth"
import {App} from '@capacitor/app'
import { Filesystem,} from '@capacitor/filesystem';
import axios from 'axios';
import store from '@/VerifyUserStore'
import {LocalNotifications} from '@capacitor/local-notifications'
import { doc, getDoc, getFirestore,onSnapshot } from '@firebase/firestore';
export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
 setup(){
   //la notification local
   App.addListener("appStateChange",async(state)=>{
     if(state.isActive==false){
       const db = getFirestore(app)
       const auth = getAuth(app)
       onAuthStateChanged(auth,(user)=>{
           const refuser = doc(db,'FOURNISSEURS',user.uid)
           onSnapshot(refuser,(newData)=>{
             if(newData.exists()){
               let take = newData.data()
               if(!take.Message) return
               take.Message.forEach((element,index) => {
                 element.message.forEach(element1=> {
                   if(element1.type=="client"){
                     if(element1.vue==false){
                       LocalNotifications.schedule({
                         notifications:[
                           {
                             title:`Vous avez une reponse concernant ${element.nomProd} `,
                             body:"cliquez ici pour lire message",
                             id:index,
                             attachments:[{id:"face",url:element.linkPhoto}]
                           }
                         ]
                       })
                     }
                   }
                 });
               });
             }
           })
         
       })
     }
    })
   //fin 
   //debut
   //debut pour la signalisation de la mise en jour
   async function MAG(){
     const db = await getFirestore(app)
     const RefUpdat= await doc(db,"ALLAUTHORISED","UpdateAppFour")
     const UpdateInfo = await getDoc(RefUpdat)
     if(UpdateInfo.exists()){
       let take = UpdateInfo.data()
       if(take.isAvailble==true){
         const alert = await alertController.create({
           header:"Mise en jour disponible",
           subHeader:"Pour une meilleur experience",
           mode:"ios",
           buttons:[{
             text:"Mettre en jour",
             cssClass:"primary",
             handler:()=>{
               window.open(take.link)
             }
           }]
         })
         alert.present()
       }
     }
   }
   setTimeout(()=>{
   MAG()
   },5000)
   
   //fin signalisation de la mise en jnour
   //for FileSysteme
   async function file(){
     let permisFile =  (await Filesystem.checkPermissions())
     if(permisFile=="denied"){
         myalert("Vous devez accepter l'utilisation de vos fichier pour la publication des produits")
         Filesystem.requestPermissions().then((permis)=>{
           if(permis=="denied"){
             App.exitApp()
           }
         })
     }
   }
   file()

   //fin filesysteme 
   //for authentification
   async function auth(){
    const auth = await getAuth(app)
    const db = getFirestore(app)
   await  onAuthStateChanged(auth,async(user)=>{
       if(user){
      const refFour = doc(db,"FOURNISSEURS",user.uid)
      const data = await getDoc(refFour)
      if(data.exists()){
        let take = data.data()
        if(take.Message){
          take.Message.forEach(element => {
               element.message.forEach(async element1 => {
                   if(element1.type=="client"){
                     if(element1.vue==false){
                       const toast = await toastController.create({
                         message:"Vous avez un nouveau message",
                         duration:3000,
                       })
                       toast.present()
                     }
                   }
               });
             });
        }
        if(take.active==false){
          const attendre= await loadingController.create({message:"Vous ete bloque veillez contacter le service client"})
          attendre.present()
        }
      }
       const refuser= doc(db,"FOURNISSEURS",user.uid)
      onSnapshot(refuser,(Newdata)=>{
        if(Newdata.exists()){
          let take = Newdata.data()
           if(!take.Message)return
            take.Message.forEach(element => {
               element.message.forEach(async element1 => {
                   if(element1.type=="client"){
                     if(element1.vue==false){
                       const toast = await toastController.create({
                         message:"Vous avez un nouveau message",
                         duration:3000,
                       })
                       toast.present()
                     }
                   }
               });
             });
           }
       
        
      })
       }else{
         return
       }
     })
  }
  auth()
  //fin function por l'authenfication
  //debut de controle du button retour
  const route = useIonRouter()
  useBackButton(-1,async()=>{
    if(!route.canGoBack()){
      const alert = await alertController.create({
        header:"Voulez Vous sortir dans l'application ?",
        buttons:[{
          text:"oui",
          cssClass:"primary",
          handler:()=>{
            App.exitApp()
          }
        },{
          text:"non",
          cssClass:"primary",
          handler:()=>{
            return
          }
        }]
      })
      alert.present()
    }
  })
  //fin controle du back button
 

//myalert
async function myalert(text){
  const alert = await alertController.create({message:`${text}`})
  alert.present()
}
//debut controle de localisation 

    
     
   


    
 
//fin controle de gestion de la localisation


  return{
    alertController,
    loadingController
  }

 } 
 
});
</script>