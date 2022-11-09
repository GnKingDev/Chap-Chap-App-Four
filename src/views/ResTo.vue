<template>
  <ion-page>
      <ion-header class="ion-no-border">
          <ion-toolbar mode="ios" >
              <ion-title color="primary">CHAP CHAP Fournisseurs</ion-title>
               </ion-toolbar>
              <ion-toolbar mode="ios">
                  <ion-segment :value="ionsegmentValue" @ionChange="segmentChanged($event)" scrollable mode="md" v-if="Succes" >
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

                    <ion-segment-button value="Conacte">
                      <ion-label>Nous Contacte</ion-label>
                  </ion-segment-button>

              </ion-segment>
              </ion-toolbar>
              
      </ion-header>
  </ion-page>
</template>

<script>
import {IonPage,IonHeader,IonToolbar,IonTitle,IonSegment,IonSegmentButton,IonLabel} from '@ionic/vue'
import {defineComponent} from "vue"
export default defineComponent({
 name:"ResTo",
 components:{IonPage,IonHeader,IonToolbar,IonTitle,IonSegment,IonSegmentButton,IonLabel},
 data(){
     return{
         LeRoute:"Moi"
     }
 }
})
</script>

<style>

</style>