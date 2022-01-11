<template>
  <!-- 全局工具 -->
    <v-snackbar
      absolute
      style="z-index:10000"
      v-model="snackbar"
      centered
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="rgba(255,82,82)"
          plain
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
export default {
    data(){
        return{
            snackbarText:'',
            snackbar:false
        }
    },
    methods: {
        alertMessage(val){
            this.snackbarText = val;
            this.snackbar = true;
        }
    }
}
</script>

<style>

</style>