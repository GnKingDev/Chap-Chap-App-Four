<template>
  <div v-if="succes">
        <div class="Enregistre un client">
         <ion-card>
             <ion-card-header>
                 <ion-card-title>Vos Abonne ou clients</ion-card-title>
                 <ion-card-subtitle>Vous avez <span class="Important" >{{AboneMent}}</span>  Abonnes ou clients dans chap chap </ion-card-subtitle>
             </ion-card-header>
             <ion-card-content>
                 <ion-item>
                     <ion-label>Numero</ion-label>
                     <ion-input type="number" v-model="numero" ></ion-input>
                 </ion-item>
                 <ion-button v-on:click="EnreClient(numero)">
                     Enregistre Le client
                 </ion-button>
             </ion-card-content>
         </ion-card>
     </div>

     <div class="InfoNewProduc">
         <ion-card>
             <ion-card-header>
                 <ion-card-title>Informer vos client de vos nouveaux produits</ion-card-title>
                  <ion-label>
                      Lien: <span>{{LinkshareNew}}</span> 
                      <ion-button v-on:click="Copy(LinkshareNew)" class="copyBtn">
                          Copier le lien
                      </ion-button>
                  </ion-label>
             </ion-card-header>
             <ion-card-content>
                <h3>Nous avons trouver <span class="Important">{{NowProduct}}</span>  nouveaux produits </h3>
                <ion-button v-on:click="Informe()" :disabled="BtnNew">
                    Informe Mes clients
                </ion-button>
             </ion-card-content>
         </ion-card>
     </div>

    

     <div class="PromotionGeneral">
       <ion-card>
           <ion-card-header>
                <ion-card-title>Faite Une Promotion Generale sur tous vos produits</ion-card-title>
               <ion-card-subtitle>Promotion recent: <span class="Important">{{PGPercent}}</span>%  status: <span class="Important">{{PGStatus ? 'En cour' : "pas de promo" }}</span></ion-card-subtitle>
               <ion-label>
                   <h3>lien: {{linkSharePg}}</h3>
                   <ion-button v-on:click="Copy(linkSharePg)" class="copyBtn">
                       Copier le lien
                   </ion-button>
               </ion-label>
           </ion-card-header>
           <ion-card-content>
            <ion-item>
                <ion-label>Pourcentage</ion-label>
                <ion-input type="number" placeholder="ex:50" v-model="PGPercent"></ion-input>
            </ion-item>
            <ion-button v-on:click="Promo()" :disabled="BtnPro">
                Cree et informe mes client
            </ion-button>
            <ion-button v-on:click="Desac()" v-if="BtnPro==true">
                Desactiver
            </ion-button>
           </ion-card-content>
       </ion-card>
     </div>
       
  </div>

   <div class="erreur" v-if="succes==false">
          <img :src="require('../images/erreurImage.png')" alt="">
          <ion-button v-on:click="tryAgain()">
              Reessayer
          </ion-button>
      </div>

</template>

<script>
import {defineComponent} from 'vue'
import {IonButton,loadingController,alertController,IonCard,IonCardTitle,IonCardSubtitle,IonItem,IonInput,IonLabel,IonCardContent,IonCardHeader} from '@ionic/vue'
import { getAuth,  onAuthStateChanged } from '@firebase/auth'
import app from '@/Firebase'
import { arrayUnion, collection, deleteDoc, deleteField, doc, getDoc, getDocs, getFirestore, query, setDoc, Timestamp, updateDoc, where } from '@firebase/firestore'
import axios from 'axios'
import {Clipboard} from '@capacitor/clipboard'
import { Network } from '@capacitor/network'
export default defineComponent ({
name:"MesAchats",
components:{IonButton,IonCard,IonCardContent,IonCardTitle,IonCardSubtitle,IonItem,IonInput,IonLabel,IonCardHeader},
data(){
    return{
        NowProduct:0,
        AboneMent:0,
        BtnNew:false,
        BtnCPI:false,
        BtnCP:false,
        BtnPro:false,
        BtnEnre:false,
        succes:undefined,
        FourInfo:{},
        //les variable pour enregistrement numero
        numero:"",
        //les variables pour New Product
        LinkshareNew:"indisponible",
        //les variable pour le code promo
        percent:0,
        ExpireCodePromo:0,
        PromoCodeStatus:false,
        codePromo:"pas",
        Nday:0,
        //les variables pour la promotion generale
         PGPercent:0,
        PGStatus:false,
        PGNday:0,
        linkSharePg:"indisponible"
    }
},
async beforeCreate(){
    if(window.navigator.onLine==false){
        const alert = await alertController.create({message:"erreur internet"})
        alert.present()
       this.succes=false
       return
    }
const attendre = await loadingController.create({message:"patientez s'il vous plait"})
attendre.present()

try {
    const auth = await getAuth(app)
    const db = await getFirestore(app)
    await onAuthStateChanged(auth,async(user)=>{
       const refFour = await doc(db,"FOURNISSEURS",user.uid)
       const Four = await getDoc(refFour)
       let take 
       if(Four.exists()){
        take=Four.data()
        this.FourInfo=Four.data()
          if(take.AbonementUser.length){
             this.AboneMent=take.AbonementUser.length
          }
        //prendre les nouveau produit
        if(this.FourInfo.newProuct) this.LinkshareNew=this.FourInfo.newProuct.LinkshareNew
        const Allproduct = query(collection(db,"PRODUITS"),where("IdFournisseur","==",user.uid))
        const Allpro = await getDocs(Allproduct)
        let Allproduit =[]
        Allpro.forEach((element)=>Allproduit.push(element.data()))
        Allproduit.forEach(async(element)=>{
            let timestam = Timestamp.now()
            let producTdate = new Date(element.Cree.seconds*1000)
            let DateNow = new Date(timestam.seconds*1000)
            let timeDiff = DateNow.getTime()-producTdate.getTime()
            let resultat = timeDiff/(1000 * 3600 * 24)
            if(resultat<=7){
                this.NowProduct=this.NowProduct+1
            }
        })
        //fin prendre les nouveaux produit
       
        //debut promo general
        if(take.promo){
           if(take.promo.status==true){
               this.BtnPro=true
               this.PGPercent=take.promo.percent
               this.PGStatus=true
           }
        }
        //fin Pomo general
       
        //gestions si le fournisseur est desactiver
        if(take.active==false){
            const alert = await alertController.create({header:"vous ne pouvez utiliser ce service car vous ete desactiver parmi les Fournisseur veillez contacte le service"})
            alert.present()
            this.BtnNew=true
         this.BtnCPI=true
         this.BtnPro=true
         this.BtnCP=true
         this.BtnEnre=true
        }
       }
       attendre.dismiss()
       this.succes=true
       
    })
} catch (error) {
    this.succes=false
    attendre.dismiss()
    console.log(error.message)
}
},
methods:{
   async myAlert(text){
    const alert = await alertController.create({header:text})
    alert.present()
    },
    //debut enregistrement du numero
   async EnreClient(numero){
       if(numero=="" || !numero){
           this.myAlert("veillez saisir un numero correct")
           return
       }
       let regexNumber = /^(\+\d{3}\s?)?\(?6\d{2}\)?[\s-]*\d{2}[\s-]*\d{2}[\s-]*\d{2}$/
       if(regexNumber.test(numero)==false){
           this.myAlert("numero incorrecte")
           return
       }
      if(this.FourInfo.AbonementUser.includes(numero)){
          this.myAlert("ce numero de telephone existe deja")
          return
      }
      const attendre = await loadingController.create({message:"patientez"})
      attendre.present()
      try {
    const db = await getFirestore(app)
      const refFour = await doc(db,"FOURNISSEURS",this.FourInfo.id)
      await updateDoc(refFour,{
          AbonementUser:arrayUnion(numero)
      }).then(()=>{
          this.AboneMent=this.AboneMent+1
          this.FourInfo.AbonementUser.push(numero)
      })
     attendre.dismiss()
     this.myAlert("ajouter avec succes")
      } catch (error) {
          this.myAlert("erreur reessayer")
          attendre.dismiss()
          console.log(error)
      }
    },
    //fin enregistrement du numero de telephone 
    // informer mes client pour les nouveaux produit 
   async Informe(){
       if(this.FourInfo.useClient==false){
           this.myAlert("Conctatez nous pour vous activer a ce service ")
           return
       }
       if(this.NowProduct==0){
           this.myAlert("vous n'avez pas de nouveau produit")
           return
       }
       if(this.AboneMent==0){
           this.myAlert("vous n'avez pas d'abonner ou de client vous devez avoir pour utiliser ce service")
           return
       }
        const attendre = await loadingController.create({message:"patientez"})
        attendre.present()
        try {
        const db = await getFirestore(app)
        const refFour = await doc(db,"FOURNISSEURS",this.FourInfo.id)
        const F = await getDoc(refFour)
        if(F.exists()){
            this.FourInfo=F.data()
        }
        const refT = await doc(db,"APPINFO","C2wx6jemz99AmWyPw6eA")
        const t = await getDoc(refT)
        if(t.exists()){
            let take = t.data()
        if(this.FourInfo.newProuct){
          let timestam = Timestamp.now()
          let DateNow = new Date(timestam.seconds*1000)
          let promoDate = new Date(this.FourInfo.newProuct.newTimestam.seconds*1000)
          let timeDiff = DateNow.getTime()-promoDate.getTime()
          let resultat = timeDiff/(1000 * 3600 * 24)
          if(resultat>30){
            //envoi des message directe
            this.FourInfo.AbonementUser.forEach(async element => {
                 await axios.post(
    'https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests',

    {
        'outboundSMSMessageRequest': {
            'address': `tel:+224${element}`,
            'senderAddress': 'tel:+2240000',
            'senderName':'Chap-Chap',
            'outboundSMSTextMessage': {
              'message': `Bonjour Mr/Mme \n La boutique ${this.FourInfo.NomMagasin} a des nouvelles arrivages de toute suite\n cliquer sur le lien  pour voir ces nouveaux/nouvelles 👇 \n ${this.FourInfo.newProuct.LinkshareNew}`
            }
        }
    },
    {
        headers: {
            'Authorization': `Bearer ${take.CurrenTokenSms}`,
            'Content-Type': 'application/json'
        }
    }
)
            });
            await updateDoc(refFour,{
                'newProuct.newTimestam':Timestamp.now()
            })
        this.BtnNew=true
          }else{
              this.myAlert("vous devez attendre au moin un mois pour utiliser encore ce service")
              attendre.dismiss()
          }
        }else{
            //cas ou il na jamis utiliser ce service
               
           this.LinkshareNew=`https://chapchap.store/PNF/${this.FourInfo.id}`
               await updateDoc(refFour,{
                   newProuct:{newTimestam:Timestamp.now(),LinkshareNew:this.LinkshareNew,}
               })
               //envoi des message
               this.FourInfo.AbonementUser.forEach(async element => {
                     await axios.post(
    'https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests',

    {
        'outboundSMSMessageRequest': {
            'address': `tel:+224${element}`,
            'senderAddress': 'tel:+2240000',
            'senderName':'Chap-Chap',
            'outboundSMSTextMessage': {
              'message': `Bonjour Mr/Mme \n La boutique ${this.FourInfo.NomMagasin} a des nouvelles arrivages de toute suite\n cliquer sur le lien 👇 pour voir ces nouveaux/nouvelles \n ${this.LinkshareNew}`
            }
        }
    },
    {
        headers: {
            'Authorization': `Bearer ${take.CurrenTokenSms}`,
            'Content-Type': 'application/json'
        }
    }
)
               });
               
             
             this.BtnNew=true
        }
        attendre.dismiss()
        }
       } catch (error) {
           const db = await getFirestore(app)
           const reff = await doc(db,"FOURNISSEURS",this.FourInfo.id)
             const f = await getDoc(reff)
             if(f.exists()){
                 let take = f.data()
                 if(take.newProuct){
                   await updateDoc(reff,{
                     newProuct:deleteField()
                 })
                 }
                 
                 
             }
             this.LinkshareNew=""
            this.myAlert("erreur reessayer")
            attendre.dismiss()
        }
    },
  
  async Promo(){
       if(this.FourInfo.useClient==false){
           this.myAlert("Conctatez nous pour vous activer a ce service ")
           return
       }
      this.PGPercent=parseInt(this.PGPercent)
    if(this.PGPercent%5!=0){
        this.myAlert("erreur au niveau du pourcentage pourcentage")
        return
    }

    if(this.AboneMent==0){
        this.myAlert("Vous devez avoir d'abonner pour utiliser ce service")
        return
    }
    
    const attendre = await loadingController.create({message:"patientez"})
    attendre.present()
    let takeshareId = ""
    try {
    const db = await getFirestore(app)
        const refProduit = await query(collection(db,"PRODUITS"),where("IdFournisseur","==",this.FourInfo.id))
        const refFour = await doc(db,"FOURNISSEURS",this.FourInfo.id)
        const reft = await doc(db,"APPINFO","C2wx6jemz99AmWyPw6eA")
        const t = await getDoc(reft)
        let take ={}
        const F = await getDoc(refFour)
        if(F.exists()){
            this.FourInfo=F.data()
        if(t.exists()){
         take = t.data()
        let data=[]
        let AllproFour = await getDocs(refProduit)
        AllproFour.forEach((element)=>{
            data.push(element.data())
        })
       
        //determination de la date
         let timestam =Timestamp.now()
         let CurentDate = new Date(timestam.seconds*1000)
         let formatDate=CurentDate.toLocaleDateString("fr-FR")
    if(this.FourInfo.promo){
         //application du pourcentage sur le produit
         data.forEach(async element => {
             //mise en jour des produits
             let realPrice = element.prix
             let p=element.prix*this.PGPercent/100
             element.prix=element.prix-p
             const refProduit = await doc(db,"PRODUITS",`${element.id}`)
             await updateDoc(refProduit,{
                 prix:element.prix,
                 realPrice:realPrice,
             })

        });
        //la mise en jour des prix des produits
        //Mise en jour du fournisseurs
         const refShare = await doc(db,"SHARE",this.FourInfo.promo.idShare)
         takeshareId=refShare.id
        await updateDoc(refFour,{
      promo:{percent:this.PGPercent,idShare:this.FourInfo.promo.idShare,LinkSharePg:this.FourInfo.promo.LinkSharePg,status:true}
        })
        //convertissons la date du promo
        //mise en jour de share
         await updateDoc(refShare,{
            LinkPhoto:this.FourInfo.Photo.link,
            NomMagasin:this.FourInfo.NomMagasin,
             idShare:refShare.id,
             percent:this.PGPercent
         })
         
         
         //informons maintenan les abonne par sms directe
         this.FourInfo.AbonementUser.forEach(async element => {
               axios.post(
    'https://chachap.herokuapp.com/https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests',

    {
        'outboundSMSMessageRequest': {
            'address': `tel:+224${element}`,
            'senderAddress': 'tel:+2240000',
            'senderName':'Chap-Chap',
            'outboundSMSTextMessage': {
              'message': `Bonjour Mr/Mme \n La boutique ${this.FourInfo.NomMagasin} a fait une reduction de ${this.PGPercent}% sur le prix de tous ces produits \n cliquer sur le lien pour profiter vite 👇  \n https://www.chapchap.store/PF/${this.FourInfo.id}/${this.FourInfo.promo.idShare}`
            }
        }
    },
    {
        headers: {
            'Authorization': `Bearer ${take.CurrenTokenSms}`,
            'Content-Type': 'application/json'
        }
    }
)
         });
         this.BtnPro=true
         attendre.dismiss()
    this.myAlert("effectue avec succes")
        
    }else{
         //application du pourcentage sur le produit
         data.forEach(async element => {
             //mise en jour des produits
             let realPrice = element.prix
             let p=element.prix*this.PGPercent/100
             element.prix = element.prix-p
             const refProduit = await doc(db,"PRODUITS",`${element.id}`)
             await updateDoc(refProduit,{
                 prix:element.prix,
                 realPrice:realPrice,
             })
        });
     //au cas ou il n'a jamais utilise ce service 
     //mise en jour du fournisseur
     await updateDoc(refFour,{
         promo:{percent:this.PGPercent,LinkSharePg:`https://chapchap.store/PF/${this.FourInfo.id}`,status:true}
     })
     //on donne le link
     this.linkSharePg=`https://chapchap.store/PF/${this.FourInfo.id}`
     //envoi des message
        this.FourInfo.AbonementUser.forEach(async element => {
            axios.post(
    'https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests',

    {
        'outboundSMSMessageRequest': {
            'address': `tel:+224${element}`,
            'senderAddress': 'tel:+2240000',
            'senderName':'Chap-Chap',
            'outboundSMSTextMessage': {
              'message': `Bonjour Mr/Mme \n La boutique ${this.FourInfo.NomMagasin} a fait une reduction de ${this.PGPercent}% sur le prix de tous ces produits \n cliquer sur le lien pour profiter vite 👇  \n https://chapchap.store/PF/${this.FourInfo.id}`
            }
        }
    },
    {
        headers: {
            'Authorization': `Bearer ${take.CurrenTokenSms}`,
            'Content-Type': 'application/json'
        }
    }
)
         });
         this.BtnPro=true
         this.PGStatus=true
       attendre.dismiss()
    this.myAlert("effectue avec succes")
    }
    
    }
    }
    }catch (error) {
        const db = await getFirestore(app)
        const refour = await doc(db,"FOURNISSEURS",`${this.FourInfo.id}`)
        const Four = await getDoc(refour)
        if(Four.exists()){
            let take = Four.data()
            if(take.promo){
                await updateDoc(refour,{
                    promo:deleteField()
                })
               
            }
        }
        this.myAlert("erreur reessayer")
        this.linkSharePg=""
        attendre.dismiss()
        console.log(error)
    }
    
   },
  async Copy(link){
    await Clipboard.write({
        url:link
    }).then(()=>this.myAlert("copie avec succes"))
  },
  async tryAgain(){
      if(window.navigator.onLine==false){
        const alert = await alertController.create({message:"erreur internet"})
        alert.present()
       this.succes=false
       return
    }
const attendre = await loadingController.create({message:"patientez s'il vous plait"})
attendre.present()

try {
    const auth = await getAuth(app)
    const db = await getFirestore(app)
    await onAuthStateChanged(auth,async(user)=>{
       const refFour = await doc(db,"FOURNISSEURS",user.uid)
       const Four = await getDoc(refFour)
       let take 
       if(Four.exists()){
        take=Four.data()
        this.FourInfo=Four.data()
          if(take.AbonementUser.length){
             this.AboneMent=take.AbonementUser.length
          }
        //prendre les nouveau produit
        if(this.FourInfo.newProuct) this.LinkshareNew=this.FourInfo.newProuct.LinkshareNew
        const Allproduct = query(collection(db,"PRODUITS"),where("IdFournisseur","==",user.uid))
        const Allpro = await getDocs(Allproduct)
        let Allproduit =[]
        Allpro.forEach((element)=>Allproduit.push(element.data()))
        Allproduit.forEach(async(element)=>{
            let timestam = Timestamp.now()
            let producTdate = new Date(element.Cree.seconds*1000)
            let DateNow = new Date(timestam.seconds*1000)
            let timeDiff = DateNow.getTime()-producTdate.getTime()
            let resultat = timeDiff/(1000 * 3600 * 24)
            if(resultat<=7){
                this.NowProduct=this.NowProduct+1
            }
        })
        //fin prendre les nouveaux produit
       
        //debut promo general
        if(take.promo){
           if(take.promo.status==true){
               this.BtnPro=true
               this.PGPercent=take.promo.percent
               this.PGStatus=true
           }
        }
        //fin Pomo general
       
        //gestions si le fournisseur est desactiver
        if(take.active==false){
            const alert = await alertController.create({header:"vous ne pouvez utiliser ce service car vous ete desactiver parmi les Fournisseur veillez contacte le service"})
            alert.present()
            this.BtnNew=true
         this.BtnCPI=true
         this.BtnPro=true
         this.BtnCP=true
         this.BtnEnre=true
        }
       }
       attendre.dismiss()
       this.succes=true
       
    })
} catch (error) {
    this.succes=false
    attendre.dismiss()
    console.log(error.message)
}
  },
 async Desac(){
    
        if(!this.FourInfo.promo){
           this.myAlert("vous n'avez pas de promo pour le moment")
           return
        }
        const attendre = await loadingController.create({message:"patientez"})
        attendre.present()
        try {
            
        const db = await getFirestore(app)
        const AllP = query(collection(db,"PRODUITS"),where("IdFournisseur","==",this.FourInfo.id))
        let data = []
        const Products = await getDocs(AllP)
        Products.forEach((element)=>{
        data.push(element.data())
        })
    //mettre le prix nomarl des produits
    data.forEach(async element => {
    const refP = await doc(db,"PRODUITS",element.id)
    const realPrice = await getDoc(refP)
    if(realPrice.exists()){
        let take = realPrice.data()
         await updateDoc(refP,{
          prix:take.realPrice
    })

    }
   
    });
    await updateDoc(doc(db,"FOURNISSEURS",this.FourInfo.id),{
        'promo.status':false
    })
  this.BtnPro=false
    this.myAlert("Promo desactiver avec succes")
        attendre.dismiss()
      }  catch (error) {
            this.myAlert("erreur reessayer")
            attendre.dismiss()
        }

    
  }
}
})
</script>

<style>
ion-card-title{
    font-size: 20px;
    margin: 4px;
}
.Important{
    color: #03a61c;
    font-size: 20px;
}
.copyBtn{
    font-size: 10px;
}
</style>