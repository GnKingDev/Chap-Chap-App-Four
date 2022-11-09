<template>
<ion-page>
    <ion-header class="ion-no-border" >
       <main v-if="M.succes==true">
        <div class="header-section">
            <div class="left-arrow">
           
                <ion-back-button default-href="/AutrePage" mode="md" class="b" color="light" ></ion-back-button>
           
            </div>
            <div class="message-title">
                <h3>Messages</h3>
            </div>
            <div class="buttons">
            <ion-icon :icon="chatbubble" ></ion-icon>
            </div>
        </div>
    </main>
    </ion-header>
<ion-content>
    <div v-if="M.succes==true" class="itemMessage" >
<ion-item v-for="(message,index) in M.Messages" :key="index" @click="Conversation(index,message.idUser,message.idProduit,message.idFour)" :button="true" >
    <ion-avatar slot="start">
        <img :src="message.linkPhoto" />
    </ion-avatar>
    <ion-label>
        <h6> concernant {{message.nomProd}}</h6>
        <p> {{M.coute[index].showNewMessage}}</p>
    </ion-label>
    <ion-badge color="primary" mode="ios" slot="end" v-if="M.coute[index].vue==false">.</ion-badge>
</ion-item>
</div>
</ion-content>
</ion-page>
</template>

<script>
import { defineComponent,  reactive } from "@vue/runtime-core";
import {IonHeader,IonBackButton,IonContent,IonItem,IonLabel,IonBadge,IonAvatar,IonPage,IonIcon, loadingController, alertController, onIonViewWillEnter,} from '@ionic/vue'
import {chatbubble} from 'ionicons/icons'
import router from "@/router";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import app from "@/Firebase";
import { doc, getDoc, getFirestore, onSnapshot } from "@firebase/firestore";
export default defineComponent( {
name:"MessaGes",
components:{
    IonHeader,
    IonBackButton,
    IonContent,
    IonPage,
    IonIcon,
    IonItem,
    IonLabel,
    IonAvatar,
    IonBadge
},
setup(){
   
    //prendre tous les message de l'utilisateur
    let M = reactive({Messages:[],coute:[],succes:false})
  onIonViewWillEnter(async()=>{
      const attendre = await loadingController.create({message:"patientez s'il vous plait"})
       attendre.present()
       try {
           
       
       const auth = await getAuth(app)
       const db = await getFirestore(app)
     onAuthStateChanged(auth,async(user)=>{
         const refuser = await doc(db,"FOURNISSEURS",user.uid)
         const data = await getDoc(refuser)
         if(data.exists()){
         let take = data.data()
         let msg=take.Message
          msg.forEach(element => {
              if(element.message[0]){
                  M.Messages.push(element)
              }
          });
         M.Messages.forEach((element,index) => {
              element.message.forEach(element1 => {
                  if(element1.vue==false){
                      M.coute[index]={showNewMessage:element1.message,vue:element1.vue}
                  }else{
                      M.coute[index]={showNewMessage:element1.message,vue:element1.vue}
                  }
              });
         });
         attendre.dismiss()
         M.succes=true
         }
         onSnapshot(refuser,(newData)=>{
             if(newData.exists()){
                 M.Messages=[]
                 let take = newData.data()
                 let msg = take.Message
                  msg.forEach(element => {
              if(element.message[0]){
                  M.Messages.push(element)
              }
          });
           M.Messages.forEach((element,index) => {
              element.message.forEach(element1 => {
                  if(element1.vue==false){
                      M.coute[index]={showNewMessage:element1.message,vue:element1.vue}
                  }else{
                      M.coute[index]={showNewMessage:element1.message,vue:element1.vue}
                  }
              });
         });


             }
         })
     })
    } catch (error) {
         attendre.dismiss()
        const alert = await alertController.create({message:"erreur du serveur"})
        alert.present()
         router.replace({path:"tabs/tab1"})
       }
  })
    
    const Conversation =async (index,idUser,idProuct,idFour)=>{
       const attendre = await loadingController.create({message:"patientez s'il vous plait"})
        attendre.present()
        try {
             const db = await getFirestore(app)
             const refFour = await doc(db,"USERS",idUser)
             const take = await getDoc(refFour)
             if(take.exists()){
                 let data = take.data()
              let i= data.Message.findIndex(e=>e.idProduit==idProuct && e.idUser==idUser)
              router.push({name:"ConverSation",params:{index:index,id:idFour,index2:i}})
              attendre.dismiss()
             }
        } catch (error) {
            const alert = await alertController.create({message:"erreur du serveur"})
            alert.present()
            attendre.dismiss()
        }

       
    }
    return{
        chatbubble,
        Conversation,
        M
    }
}
})
</script>

<style lang="scss" scoped>
.itemMessage{
    margin-top: 100px;
}
ion-content .inbox-section{
     position: relative;
        top: 4.5em;
        z-index: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: auto;
        flex-direction: column;
}

ion-content .inbox-section .message{
     position: relative;
            width: 95%;
            height: 3em;
            display: flex;
            margin-bottom: 1em;
}

ion-content .inbox-section .message:first-of-type {
margin-top: 2em;
}
ion-content .inbox-section .message .picture-section{
           position: relative;
                width: 20%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
}
ion-content .inbox-section .message .picture-section img{
                    width: 3.6em;
                    height: 3.6em;
                    object-fit: cover;
                    border-radius: 50%;
}
ion-content .inbox-section .message .content-section{
               position: relative;
                width: calc(60% - .5em);
                padding: 0 .5em;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
}
ion-content .inbox-section .message .content-section .name{
font-size: 22px;
}
ion-content .inbox-section .message .content-section .message-content{
                   font-size: 17px;
                  color: rgb(167, 167, 167);
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
}
ion-content .inbox-section .message .date_time-section{
                    position: relative;
                    width: 20%;
                    height: 100%;
                    display: flex;
                    justify-content: space-evenly;
                    flex-direction: column;
}
ion-content .inbox-section .message .date_time-section .date_time{
                     font-size: 17px;
                        color:rgb(167, 167, 167);
                        display: flex;
                        justify-content: center;
}
ion-content .inbox-section .message .date_time-section .num{
                         font-size: 15px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #03A61c;
                        width: fit-content;
                        width: 1em;
                        height: 1em;
                        padding: .25em;
                        border-radius: 50%;
                        color: #fff;
                        position: relative;
                        left: 50%;
                        transform: translateX(-50%);
}



ion-header{
    main{
        position: relative;
        width: auto;
       height: auto;
       .header-section{
           position: fixed;
           width: 100%;
           height: 3.5rem;
           background-color:#03A61c;
           display: flex;
           justify-content: space-between;
           align-items: center;
           border-bottom-left-radius: 40px;
           border-bottom-right-radius: 40px;
             z-index: 2;
           .left-aarow{
               position: relative;
               width: 20%;
               height: 100%;
               display: flex;
               justify-content: center;
               align-items: center;
           }
           .message-title{
               position: relative;
               width: 60%;
               height: 100%;
               display: flex;
               justify-content: center;
               align-items: center;
              h3{
                   color: #fff;
               font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
               text-transform: capitalize;
              }
           }
           .buttons{
               position: relative;
               width: 20%;
               display: flex;
               justify-content: space-evenly;
               align-items: center;
               ion-icon{
                   font-size: 30px;
                   color: #fff;
               }
           }
       }
    }
}

</style>