// table-expand.vue

<template>
  <div>
    <Card :bordered="false">
      <p style="color:#f60;text-align:center;height:50px">
        <Icon type="ios-information-circle" size="35" style="top:10px;position:relative"></Icon>
        <span style="font-size:35px;top:10px;position:relative">返沪风险指数</span>
      </p>
      <Divider></Divider>

      <div v-for="(item,index) in row.sumCalResponseList" :key="index">

        <Tag
          color="volcano"
          style="position:absolute;left:50px"
          size="large"
          class="tags"
        >{{item.type}}</Tag>
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="10" style="text-align:center">
            <div style="height:280px">
              <div>
                <p style="text-align:center;margin-left:20px;font-size:35px;font-weight:bold">综合评分</p>
                <p
                  style="text-align:center;margin-top:0px;font-size:70px;color:rgb(77, 121, 243);"
                >{{row.sumCalResponseList[index].sumScore}}</p>
                <p style="text-align:center;margin-bottom:10px;font-size:25px;font-weight:bold">起始点</p>
                <Row type="flex" justify="center" class="code-row-bg" style>
                  <Col span="8" offset="0">
                    <div style=";position:relative;margin-top:20px;">
                      <p
                        style="position:relative;font-size:14px;font-weight:bold;color:rgb(77, 121, 243);"
                      >{{row.start}}</p>
                    </div>
                  </Col>
                  <Divider
                    type="vertical"
                    style="width:1px;height:80px;position:relative;left:20px"
                  />

                  <Col span="8" offset="2">
                    <div style=";position:relative;margin-top:20px;">
                      <p
                        style="position:relative;font-size:14px;font-weight:bold;color:rgb(77, 121, 243);"
                      >{{row.end}}</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Divider type="vertical" style="width:1px;height:270px;position:relative;left:-10px" />
          <Col span="13">
            <div>
              <p
                style="font-size:25px;font-weight:bold;position:relative;text-align:center;margin-bottom:10px"
              >详细数据</p>

              <div style="height:230px;overflow-y:scroll">
                <ul v-for="(sitem,index) in item.resultList" :key="index" style="list-style-type:none;">
                  <li v-if="sitem.type==0">
                    <span class="navtrans-bus-icon bus" style="size:30px"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.公交车</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      评分：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:10px"></Divider>
                    <Row type="flex" justify="space-between" class="code-row-bg">
                      <Col span="10">
                        <span class="title">班次:</span>
                        <span class="navtrans-busstation">{{sitem.title}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">时间:</span>
                        <span class="navtrans-busstation">{{sitem.time}}</span>
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-between" class="code-row-bg">
                      <Col span="10">
                        <span class="title">初始站:</span>
                        <span class="navtrans-busstation">{{sitem.start}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">终点站:</span>
                        <span class="navtrans-busstation">{{sitem.end}}</span>
                      </Col>
                    </Row>
                   <Row
                      type="flex"
                      justify="space-between"
                      class="code-row-bg"
                      v-for="(ssitem,index) in sitem.city"
                      :key="index"
                    >
                      <Col span="10">
                        <span class="title">途径城市:</span>
                        <span class="navtrans-busstation">{{ssitem.cityname}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">城市分数:</span>
                        <span class="navtrans-busstation">{{ssitem.cityscore}}</span>
                      </Col>
                    </Row>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:10px"></Divider>
                  </li>
                  <li v-if="sitem.type==1">
                    <span class="navtrans-bus-icon bus" style="size:30px"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.地铁</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      评分：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:10px"></Divider>
                    <Row type="flex" justify="space-between" class="code-row-bg">
                      <Col span="10">
                        <span class="title">线路:</span>
                        <span class="navtrans-busstation">{{sitem.title}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">时间:</span>
                        <span class="navtrans-busstation">{{sitem.time}}</span>
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-between" class="code-row-bg">
                      <Col span="10">
                        <span class="title">初始站:</span>
                        <span class="navtrans-busstation">{{sitem.start}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">终点站:</span>
                        <span class="navtrans-busstation">{{sitem.end}}</span>
                      </Col>
                    </Row>
                   <Row
                      type="flex"
                      justify="space-between"
                      class="code-row-bg"
                      v-for="(ssitem,index) in sitem.city"
                      :key="index"
                    >
                      <Col span="10">
                        <span class="title">途径城市:</span>
                        <span class="navtrans-busstation">{{ssitem.cityname}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">城市分数:</span>
                        <span class="navtrans-busstation">{{ssitem.cityscore}}</span>
                      </Col>
                    </Row>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:10px"></Divider>
                  </li>
                  <li v-if="sitem.type==3">
                    <span class="navtrans-cross-city-icon train"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.火车</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      评分：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:10px"></Divider>
                    <Row type="flex" justify="space-between" class="code-row-bg">
                      <Col span="10">
                        <span class="title">序列:</span>
                        <span class="navtrans-busstation">{{sitem.title}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">时间:</span>
                        <span class="navtrans-busstation">{{sitem.time}}</span>
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-between" class="code-row-bg">
                      <Col span="10">
                        <span class="title">初始站:</span>
                        <span class="navtrans-busstation">{{sitem.start}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">终点站:</span>
                        <span class="navtrans-busstation">{{sitem.end}}</span>
                      </Col>
                    </Row>

                    <Row
                      type="flex"
                      justify="space-between"
                      class="code-row-bg"
                      v-for="(ssitem,index) in sitem.city"
                      :key="index"
                    >
                      <Col span="10">
                        <span class="title">途径城市:</span>
                        <span class="navtrans-busstation">{{ssitem.cityname}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">城市分数:</span>
                        <span class="navtrans-busstation">{{ssitem.cityscore}}</span>
                      </Col>
                    </Row>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:10px"></Divider>
                  </li>
                  <li v-if="sitem.type==4">
                    <span class="navtrans-cross-city-icon airplane"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.飞机</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      评分：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:10px"></Divider>
                    <Row type="flex" justify="space-between" class="code-row-bg">
                      <Col span="10">
                        <span class="title">航班:</span>
                        <span class="navtrans-busstation">{{sitem.title}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">时间:</span>
                        <span class="navtrans-busstation">{{sitem.time}}</span>
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-between" class="code-row-bg">
                      <Col span="10">
                        <span class="title">初始站:</span>
                        <span class="navtrans-busstation">{{sitem.start}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">终点站:</span>
                        <span class="navtrans-busstation">{{sitem.end}}</span>
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-between" class="code-row-bg">
                      <Col span="10">
                        <span class="title">起点城市:</span>
                        <span class="navtrans-busstation">{{sitem.city[0].cityname}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">城市分数:</span>
                        <span class="navtrans-busstation">{{sitem.city[0].cityscore}}</span>
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-between" class="code-row-bg">
                      <Col span="10">
                        <span class="title">终点城市:</span>
                        <span class="navtrans-busstation">{{sitem.city[1].cityname}}</span>
                      </Col>
                      <Col span="10">
                        <span class="title">城市分数:</span>
                        <span class="navtrans-busstation">{{sitem.city[1].cityscore}}</span>
                      </Col>
                    </Row>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:10px"></Divider>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
        <Divider></Divider>
      </div>
    </Card>
  </div>
</template>
<script>
export default {
  props: {
    row: Object
  },
  mounted() {
    console.log(this.row);
  }
};
</script>

<style scoped>
.expand-row {
  margin-bottom: 16px;
}
.tags {
  z-index: 999;
}
</style>
<style>
.ivu-tag-size-large {
  height: 52px;
  line-height: 40px;
  padding: 0 12px;
}
.ivu-tag {
  display: inline-block;
  height: 43px;
  line-height: 20px;
  margin: 2px 4px 2px 0;
  padding: 6px 8px;
  border: 1px solid #e8eaec;
  border-radius: 3px;
  /* background: #130d0d; */
  font-size: 36px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
}
</style>
