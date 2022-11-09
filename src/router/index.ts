import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import LoadPage from '../views/LoadPage.vue'
import ConneXion from "../views/ConneXion.vue"
import CreateAcount from "../views/CreateAcount.vue"
import AutrePage from '../views/AutrePage.vue'
import MessaGes from '@/views/MessaGes.vue'
import ConverSation from '@/views/ConverSation.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/LoadPage'
  },
  {
    path: '/LoadPage',
    name: 'LoadPage',
    component: LoadPage
  },
  {
    path: '/ConneXion',
    name: 'ConneXion',
    component: ConneXion
  },
  {
    path: '/CreateAcount',
    name: 'CreateAcount',
    component: CreateAcount
  },
  //a effacer apres
  {
    path: '/AutrePage',
    name: 'AutrePage',
    component:AutrePage
  },
  {
    path: '/ConverSation/:index/:id/:index2',
    name: 'ConverSation',
    component: ConverSation
  },
  {
    path: '/Messages',
    name: 'MessaGes',
    component:MessaGes
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
