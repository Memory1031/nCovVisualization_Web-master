<template>
  <div>
    <Tabs size="small" id="tabs">
      <TabPane label="风险统计" class="markpage">
        <Table></Table>
      </TabPane>
      <TabPane label="风险查询">
        <Choose class="markpage"></Choose>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Choose from "./routechoose.vue";
import Table from "./routetable.vue";
export default {
  components: {
    Choose,
    Table
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
