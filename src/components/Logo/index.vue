<template>
  <div class="logo">
      <img :src="logoPath">
  </div>
</template>

<script>
export default {
    name:'Logo',
    data(){
        return{
            logoPath:'/images/logo.svg'
        }
    }
}
</script>

<style>
.logo{
    position: relative;
    margin: 0px 10px;   
    margin-left: 0px;
}
</style>