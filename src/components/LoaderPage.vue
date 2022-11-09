<template>
  <div class="loader"></div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent ({
 name:"LoaderPage"
})
</script>

<style scoped >
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
</style>