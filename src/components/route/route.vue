<template>
  <div style="height: 65vh">
<!--    <Tabs size="small" id="tabs">-->
<!--      <TabPane label="风险评估" class="markpage">-->
        <Table2></Table2>
<!--      </TabPane>-->
<!--      <TabPane label="批量查询" class="markpage">-->
<!--        <Table></Table>-->
<!--      </TabPane>-->
<!--      <TabPane label="单地查询">-->
<!--        <Choose class="markpage"></Choose>-->
<!--      </TabPane>-->
<!--    </Tabs>-->
  </div>
</template>

<script>
import Table2 from "./routeDisplay.vue";
export default {
  components: {
    Table2
  }
};
</script>
<style lang="scss">
.ivu-tabs-mini .ivu-tabs-tab {
  font-size: 20px;
  position: relative;
}
.markpage {
  position: relative;
  top: -14px;
}
#tabs {
  position: relative;
  margin-top: 10px;
}
</style>
