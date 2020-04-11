<template>
  <div>
    <Tabs size="small" id="tabs">
      <TabPane label="现存感染" class="markpage">
        <TabOne v-bind:selectedDate="selectedDate" v-on:titleChanged="reDate($event)"></TabOne>
      </TabPane>
      <TabPane label="累计感染" class="markpage">
        <TabTwo v-bind:selectedDate="selectedDate" v-on:titleChanged="reDate($event)"></TabTwo>
      </TabPane>
      <TabPane label="境外输入" class="markpage">
        <TabThree v-bind:selectedDate="selectedDate" v-on:titleChanged="reDate($event)"></TabThree>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import axios from "axios";
import TabOne from './tab1'
import TabTwo from './tab2'
import TabThree from './tab3'
export default {
  name: "chinaMap",
  components: {
      TabOne,
      TabTwo,
      TabThree
  },
  data() {
      return {
          yesterday: new Date(new Date().setDate(new Date().getDate() - 1)),
          selectedDate: "",
      }
  },
  mounted() {
      this.selectedDate = this.yesterday.getFullYear() +
          "-" +
          (this.yesterday.getMonth() > 9
              ? this.yesterday.getMonth() + 1
              : "0" + (this.yesterday.getMonth() + 1)) +
          "-" +
          (this.yesterday.getDate() > 9
              ? this.yesterday.getDate()
              : "0" + this.yesterday.getDate());
  },
  methods: {
      reDate(msg){
          this.selectedDate = msg
      }
  }
};
</script>

<style lang="scss" scoped>
@import "chinaMap";
</style>

<style lang="scss">
  .ivu-tabs-mini .ivu-tabs-tab {
    font-size: 20px;
    position: relative;
  }
  .markpage {
    position: relative;
    top: -14px;
    overflow-y: scroll;
    height: 79vh
  }
  #tabs {
    position: relative;
    margin-top: 10px;
  }
</style>
