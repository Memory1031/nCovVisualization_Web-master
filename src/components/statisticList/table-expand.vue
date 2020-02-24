<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
  .hr_extend{
    margin-top: 10px;
    margin-bottom: 10px;
    color: #d7dde4;
  }
</style>
<template>
  <div>
    <Card style="font-size: 15px">
      <p>11123</p>
    </Card>
  </div>
</template>
<script>
    import axios from 'axios'

    export default {
        props: {
            row: Object
        },
        data(){
            return{
                conference_info: { },
                picture_exist: false
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){

            }
        }
    };
</script>
