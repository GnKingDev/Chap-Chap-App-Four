<template>

       <LoaderPage v-if="Affichage=='loader'" />
       <div v-if="Affichage=='succes'">
           <div class="AffichageProduit" v-if="leRoute=='AffichageProduit'">
        <div class="recherche">
        <ion-searchbar mode="ios" v-model="searche"></ion-searchbar>
        </div>
         <div class="container">
             <div class="grid" v-for="(produit,index) in   recherche" :key="index">
                <ion-card button @click="Gotodetail(produit.id,produit.couleur)">
           <img :src="produit.LinkPhoto" />
           <ion-card-content>
                <h2> {{produit.nomProd}}</h2>
               <h2>{{produit.prix.toLocaleString('en-US')}}GNF</h2>
           </ion-card-content>
           </ion-card>
             </div>
     </div>
     </div>
     <div class="detailProduit" v-if="leRoute=='detailProduit'">
         <div class="img">
             <img :src="ProduitInfo.LinkPhoto" class="image" />
         </div>
         <div class="detail">
           <ion-label class="detail-Affichage">
               <h3>Prix: <span>{{ProduitInfo.prix.toLocaleString('en-US')}} GNF</span></h3>
               <h3>Nom: <span> {{ProduitInfo.nomProd}}</span></h3>
                <h3>Couleur: <span> {{ProduitInfo.couleur}}</span></h3>
               <h3>qualite: <span> {{ProduitInfo.Qualite}}</span></h3>
                <h3>Achete: <span> {{ProduitInfo.Nvente}}</span></h3>
               <h3>categori: <span> {{ProduitInfo.categori}}</span></h3>
               <h3>date de publication: <span> {{ProduitInfo.Cree}}</span></h3>
               <h3 v-for="(t,index) in ProduitInfo.taille" :key="index">taille: <span> {{t}}</span> </h3>
               <h3>Description <span> {{ProduitInfo.description}} </span> </h3>
               <h3>Partage sur les reseaux sociaux <span>{{ProduitInfo.linkSahre}}</span></h3>
               <ion-button v-on:click="Copy(ProduitInfo.linkSahre)">
                 Cpoie le lien
               </ion-button>
               
           </ion-label>
         </div>
         <div class="Editer">
          <ion-toolbar>
            <ion-title>Editer</ion-title>
          </ion-toolbar>
          <ion-item>
            <ion-label>Changer le prix</ion-label>
            <ion-input type="number" v-model="ProduitInfo.prix"></ion-input>
          </ion-item>
          <ion-button v-on:click="MAJ(ProduitInfo.nomProd,ProduitInfo.id)">
            Mettre en jour
          </ion-button>
          <ion-button v-on:click="Stock()">
            {{ DesaActiProd}}
          </ion-button>
         </div>
         <div class="btn"> 
        <ion-button v-on:click="leRoute='AffichageProduit'" fill="outline">
                  retour
              </ion-button>
         </div>
       
     </div>
       </div>
        <div class="pasDesProduit" v-if="Affichage=='pasDeproduit'">
            <h1>vous n'avez pas publier de produit d'abord</h1>
        </div> 

      <div class="erreur" v-if="Affichage=='erreur'">
          <img :src="require('../images/erreurImage.png')" alt="">
          <ion-button v-on:click="TryAgain()">
              Reessayer
          </ion-button>
      </div>
</template>

<script>
import {IonCard,IonCardContent,IonSearchbar,IonLabel,IonButton,alertController,loadingController,IonToolbar,IonItem,IonInput,IonTitle} from '@ionic/vue'
import { defineComponent} from 'vue';
import LoaderPage from '@/components/LoaderPage.vue'
import {  collection,  doc, getDoc, getDocs, getFirestore, query, setDoc,  Timestamp, updateDoc, where } from '@firebase/firestore';
import app from '@/Firebase';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { Network } from '@capacitor/network';
import axios from 'axios';
import { Clipboard } from '@capacitor/clipboard'
export default defineComponent ({
 name:"VoirMesProduits",
 components:{IonCard,IonCardContent,IonSearchbar,LoaderPage,IonLabel,IonButton,IonToolbar,IonInput,IonItem,IonTitle},
 data(){
     return{
         alertController,
         loadingController,
         //v if
        Affichage:"",
         leRoute:"AffichageProduit",
         Edit:false,
         inputPhoto:false,
         descrpition:false,//pour la desactivation de input si le produit est non vetement
         descrpitionPhoto:true,
         searche:"",
         BoostBtn:true,
         //datad
         AllProduit:[],
         userUid:"",
         ProduitInfo:{},
         FourInfo:{},
         nomCouleur:"",
         DesaActiProd:"",//pour la desactivation ou l'activation du produit
         suppr:0,//pour la suprression,
         PriceForBosst:0,
        BoostValideDate:0,
        boostLink:"",
     }
 },
async beforeCreate(){
     const attendre = await loadingController.create({message:"patientez"})
       attendre.present()
 try {
        
      this.leRoute="AffichageProduit"
       const db = await getFirestore(app)
   const auth = await getAuth(app)
    await onAuthStateChanged(auth,(user)=>this.userUid=user.uid)
    //getFour Info
    const refFour = await doc(db,"FOURNISSEURS",`${this.userUid}`)
    const four = await getDoc(refFour)
      if(four.exists()){
          this.FourInfo=four.data()
      }
    //get Produits
    const RefProduit = await query(collection(db,"PRODUITS"),where("IdFournisseur","==",`${this.userUid}`))
    const lesProduits = await getDocs(RefProduit)
    lesProduits.forEach((element)=>this.AllProduit.push(element.data()))
    this.AllProduit.forEach(element => {
      element.prix = parseInt(element.prix)
    });
    if(this.AllProduit.length==0){
        this.Affichage='pasDeproduit'
       attendre.dismiss()
    }else{
      this.Affichage='succes'
       attendre.dismiss()
    }
   
  } catch (e) {
     this.Affichage='erreur'
     attendre.dismiss()
  }
 },
 computed:{
     recherche(){
       if(this.searche){
            return this.AllProduit.filter(item=>{
              return this.searche
              .toLowerCase()
              .split('')
              .every(v=>item.nom.toLowerCase().includes(v))
            })
       }else{
           return this.AllProduit
       }
     },
    
 },
 methods:{
   //copi
  async Copy(link){
    if(!link || link==undefined){
      return
    }
   await Clipboard.write({
     url:link
   }).then(async ()=>{
     const alert = await alertController.create({header:"copied avec succes vous pouvez partager maintenant sur Facebook Whatsap et messenger "})
     alert.present()
   })
   },
   //boos
   
  async MAJ(nomProd,id){
    const attendre = await loadingController.create({message:"patientez s'il vous plait"})
    attendre.present()
    try {
      this.ProduitInfo.prix = parseInt(this.ProduitInfo.prix)
      const db = await getFirestore(app)
    const RefProduit = await query(collection(db,"PRODUITS"),where("IdFournisseur","==",`${this.userUid}`))
    const Product = await getDocs(RefProduit)
    let take =[]
    Product.forEach((element)=>{
     take.push(element.data())
    })
    let take1 = take.filter(e=>e.nomProd==nomProd)
     take1.forEach(async element => {
       const  refproduit = await doc(db,"PRODUITS",`${element.id}`)
       await updateDoc(refproduit,{
         prix:this.ProduitInfo.prix
       })
     });
     const refCurrentP = await doc (db,"PRODUITS",id)
     const p = await getDoc(refCurrentP)
     if(p.exists){
       this.ProduitInfo=p.data()
        const take =this.ProduitInfo.Cree
        this.ProduitInfo.Cree= new Date(take.seconds*1000).toDateString()
        this.ProduitInfo.prix = parseInt(this.ProduitInfo.prix)
     }
     attendre.dismiss()
    } catch (error) {
      const alert = await alertController.create({header:"erreur de changement veillez reessayer"})
      attendre.dismiss()
      alert.present()
    }
    
   },
     //try Again
     async TryAgain(){
         const attendre = await loadingController.create({message:"patientez"})
       attendre.present()
 try {
        
      this.leRoute="AffichageProduit"
       const db = await getFirestore(app)
   const auth = await getAuth(app)
    await onAuthStateChanged(auth,(user)=>this.userUid=user.uid)
    //getFour Info
    const refFour = await doc(db,"FOURNISSEURS",`${this.userUid}`)
    const four = await getDoc(refFour)
      if(four.exists()){
          this.FourInfo=four.data()
      }
    //get Produits
    const RefProduit = await query(collection(db,"PRODUITS"),where("IdFournisseur","==",`${this.userUid}`))
    const lesProduits = await getDocs(RefProduit)
    lesProduits.forEach((element)=>this.AllProduit.push(element.data()))
    if(this.AllProduit.length==0){
        this.Affichage='pasDeproduit'
       attendre.dismiss()
    }else{
      this.Affichage='succes'
       attendre.dismiss()
    }
   
  } catch (e) {
     this.Affichage='erreur'
     attendre.dismiss()
  }
     },
   
     //gestion de stock desactivation et activation produit
        async Stock(){
             const attendre = await loadingController.create({message:"patientez"})
              attendre.present()
            try {
                const db = await getFirestore(app)
            const refproduit= await doc(db,"PRODUITS",`${this.ProduitInfo.id}`)
           let take1 = this.AllProduit.filter(e=>e.nomProd==this.ProduitInfo.nomProd)
             let take2=take1.filter(e=>e.couleur!=this.ProduitInfo.couleur)
               let take3 = this.ProduitInfo.slidePhoto
               let i = take3.findIndex(e=>e.COuLeur==this.ProduitInfo.couleur)
               take3[i]={lien:this.ProduitInfo.LinkPhoto,COuleur:this.nomCouleur,Publier:false}
                  if(this.DesaActiProd=="Desactiver le Produit"){
                      if(take1.length==1){
                await updateDoc(refproduit,{
                  publier:false,
                  dateDesactivation:Timestamp.now()
              })
              this.myalert("Produit desactiver avec succes ")
              attendre.dismiss()
               this.DesaActiProd="Activer le Produit"
                 } else{
                     if(take2[0]){
                      await updateDoc(refproduit,{
                  publier:false,
                  dateDesactivation:Timestamp.now()
                  }).then(async()=>{
                      take2.forEach(async element => {
                          if(element.COuleur!=this.nomCouleur){
                            const refproduit = await doc (db,"PRODUITS",`${element.id}`)
                            await updateDoc(refproduit,{
                              slidePhoto:take3
                            })
                          }
                      });
                  })
                 }
                  this.myalert("Produit desactiver avec succes ")
                 attendre.dismiss()
                 this.DesaActiProd="Activer le Produit"
                 
                 }
             }else{
                 if(this.DesaActiProd=="Activer le Produit"){
                 take3[i]={lien:this.ProduitInfo.LinkPhoto,COuleur:this.nomCouleur,Publier:true}
                       if(take1.length==1){
                await updateDoc(refproduit,{
                  publier:true
              })
              this.myalert("Produit Activer avec succes")
               this.DesaActiProd='Desactiver le Produit'
              attendre.dismiss()
                 } else{
                     if(take2[0]){
                      await updateDoc(refproduit,{
                  publier:true
                  }).then(async()=>{
                      take2.forEach(async element => {
                          if(element.COuleur!=this.nomCouleur){
                            const refproduit = await doc (db,"PRODUITS",`${element.id}`)
                            await updateDoc(refproduit,{
                              slidePhoto:take3
                            })
                          }
                      });
                  })
                 }
                 this.myalert("Produit Activer avec succes")
              attendre.dismiss()
              this.DesaActiProd='Desactiver le Produit'
                 }
                 }
             }
            } catch (error) {
              this.myalert("erreur reessayer")  
              attendre.dismiss()
              console.log(error)
            }
           
        },
    
  
     //active Edite
     ActiveEdit(){
       if(this.Edit==false){
           this.Edit=true
       }else{
           this.Edit=false
       }
     },
     //myalert
    async myalert(text){
       const alert = await alertController.create({message:`${text}`})
       alert.present()
       setTimeout(()=>alert.dismiss(),3000)
     },
     //go to one produit detaill
    async Gotodetail(id,NameColor){
        if(window.navigator.onLine==false){
            this.myalert('erreur internet')
            return
        }
       
        try {
            
            this.Affichage='loader'
            this.nomCouleur=NameColor
            this.succes=false
            this.erreur=false
            this.loader=true
        const db = await getFirestore(app)
         const RefProduit = await doc(db,"PRODUITS",`${id}`)
         const Produit = await getDoc(RefProduit)
         if(Produit.exists()){
             this.ProduitInfo=Produit.data()
             //gestion du boost
             //fin gestion du boost
             this.ProduitInfo.prix=parseInt(this.ProduitInfo.prix)
             this.PriceForBosst=this.ProduitInfo.prix
             //gestion desactivation et activation produit
             if(this.ProduitInfo.publier==true){
                  this.DesaActiProd='Desactiver le Produit'
             }else{
                 this.DesaActiProd="Activer le Produit"
                 this.BoostBtn=true
             }
             //fin de cette gestion
             const take =this.ProduitInfo.Cree
             this.ProduitInfo.Cree= new Date(take.seconds*1000).toLocaleDateString("fr-Fr")
             if(this.ProduitInfo.descrpition){
                 this.descrpition=true
                 this.descrpitionPhoto=false
                
             }
             this.Affichage='succes'
             this.leRoute="detailProduit"
         }
         
        } catch (error) {
           this.Affichage='erreur'
            
        }
     },
    
 }
})
</script>
<style scoped>
.container{
display: flex;
flex-flow: row wrap;
justify-content: space-around;
}
.grid{
    width: 45%;   
}
.grid ion-card img {
  width: 180px;
  height: 180px;
  object-fit: fill;
}
.pasDesProduit{
 text-align: center;
margin-top: 90%;
}
.pasDesProduit h1{
 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
 color: #ddd;


}
.detail-Affichage{
   
}
.detail-Affichage h3{
  font-size: 19px;
   margin-left: 10px;
}
.detail-Affichage h3 span{
  color: #03a61c;
}
.IonChip{
    background-color: #03a61c;
    color: white;
}
.image{
  width: 300px;
  height: 300px;
  object-fit: contain;
}
</style>