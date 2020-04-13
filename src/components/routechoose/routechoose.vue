<template>
  <div>
    <Modal v-model="modal1"  width="70vw">
      <city-detail v-bind:factor="cityName"></city-detail>
    </Modal>
    <Row>
      <div class="button">
        <!-- <DatePicker
          type="date"
          size="large"
          :value="selectedDate"
          @on-change="changeDate"
          :options="options"
          placeholder="选择日期"
          style="width: 8vw"
        ></DatePicker>-->
        <Select
          v-model="condition.transport"
          style="width: 10vw;margin-right:5px"
          size="large"
          placeholder="返沪方式"
        >
          <Option v-for="item in vehicle" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select
          v-model="condition.theCampus"
          style="width: 10vw;margin-right:5px"
          size="large"
          placeholder="选择校区"
        >
          <Option v-for="item in campus" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <v-distpicker
          @selected="sel"
          :province="select.province"
          :city="select.city"
          :area="select.area"
        ></v-distpicker>

        <Input
          v-model="select.address"
          placeholder="请输入详细地址"
          size="large"
          style="width: 210px;margin-left:5px;"
        />
        <Button
          size="large"
          type="primary"
          ghost
          style="margin-left:5px;font-size:20px"
          @click="codeAddress()"
        >搜索</Button>
      </div>
    </Row>
    <Row>
      <div id="container" style="height: 75vh"></div>
    </Row>
    <Modal v-model="modal" width="960">
      <p slot="header" style="color:#f60;text-align:center;height:50px">
        <Icon type="ios-information-circle" size="35" style="top:10px;position:relative"></Icon>
        <span style="font-size:35px;top:10px;position:relative">返沪风险指数</span>
      </p>
      <div v-for="(item,index) in doubleLineList" :key="index">

        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="10" style="text-align:center">
            <div style="height:360px">
              <div>
                <p style="text-align:center;margin-top:0px;font-size:55px;font-weight:bold">综合评分</p>
                <p
                  style="text-align:center;margin-top:0px;font-size:90px;color:rgb(77, 121, 243);"
                >{{score.final}}</p>
                 <p style="text-align:center;margin-bottom:-5px;font-size:35px;font-weight:bold">始终点</p>
                <Row type="flex" justify="center" class="code-row-bg">
                  <Col span="8" offset="0">
                    <div style=";position:relative;margin-top:20px;">
                      <p
                        style="position:relative;font-size:14px;font-weight:bold;color:rgb(77, 121, 243);"
                      >{{addressZone}}</p>
                    </div>
                  </Col>
                  <Divider
                    type="vertical"
                    style="width:1px;height:50px;position:relative;left:20px;top:10px"
                  />

                  <Col span="8" offset="2">
                    <div style=";position:relative;margin-top:20px;">
                      <p
                        style="position:relative;font-size:14px;font-weight:bold;color:rgb(77, 121, 243);"
                      >{{condition.theCampus}}</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Divider type="vertical" style="width:1px;height:360px;position:relative;left:-10px" />
          <Col span="13">
            <div>
              <p
                style="font-size:20px;font-weight:bold;position:relative;text-align:center;margin-bottom:0px;top:-5px"
              >旅程分段风险评估</p>

              <div style="height:340px;overflow-y:auto">
                <ul
                  v-for="(sitem,index) in item.line"
                  :key="index"
                  style="list-style-type:none;position:relative;padding-right:10px;width:100%"
                >
                  <li v-if="sitem.type==0">
                    <span class="navtrans-bus-icon bus" style="size:30px"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.公交车</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      路段风险：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:3px"></Divider>
                    <div style="width:100%;position:relative;right:0px">
                      <Table
                        row-key="id"
                        :columns="columns"
                        :data="sitem.line"
                        border
                        :indent-size="0"
                      >
                        <template slot-scope="{ row }" slot="specific">
                          <span>
                            <div v-if="row.specific=='详情'" @mouseenter="mEnter(row.factor)">
                                                            <Button
                                                              type="primary" @click="modal1=true,cityName=row.factor"
                                                            >{{row.specific}}</Button>
                            </div>
                            <div v-else>{{row.specific}}</div>
                          </span>
                        </template>
                      </Table>
                    </div>

                    <Divider style="position:relative;margin-top:5px;margin-bottom:10px"></Divider>
                  </li>
                  <li v-if="sitem.type==1">
                    <span class="navtrans-bus-icon bus" style="size:30px"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.地铁</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      路段风险：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:3px"></Divider>
                    <div style="width:100%;position:relative;right:0px">
                      <Table
                        row-key="id"
                        :columns="columns"
                        :data="sitem.line"
                        border
                        :indent-size="0"
                      >
                       <template slot-scope="{ row }" slot="specific">
                          <span>
                            <div v-if="row.specific=='详情'" @mouseenter="mEnter(row.factor)">
                                                            <Button
                                                              type="primary" @click="modal1=true,cityName=row.factor"
                                                            >{{row.specific}}</Button>
                            </div>
                            <div v-else>{{row.specific}}</div>
                          </span>
                        </template>
                      </Table>
                    </div>

                    <!-- <Divider style="position:relative;margin-top:5px;margin-bottom:10px"></Divider> -->
                  </li>
                  <li v-if="sitem.type==3">
                    <span class="navtrans-bus-icon train" style="size:30px"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.火车</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      路段风险：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:3px"></Divider>
                    <div style="width:100%;position:relative;right:0px">
                      <Table
                        row-key="id"
                        :columns="columns"
                        :data="sitem.line"
                        border
                        :indent-size="0"
                      >
                     <template slot-scope="{ row }" slot="specific">
                          <span>
                            <div v-if="row.specific=='详情'" @mouseenter="mEnter(row.factor)">
                                                            <Button
                                                              type="primary" @click="modal1=true,cityName=row.factor"
                                                            >{{row.specific}}</Button>
                            </div>
                            <div v-else>{{row.specific}}</div>
                          </span>
                        </template>
                      </Table>
                    </div>

                    <!-- <Divider style="position:relative;margin-top:5px;margin-bottom:10px"></Divider> -->
                  </li>
                  <li v-if="sitem.type==4">
                    <span class="navtrans-bus-icon plane" style="size:30px"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.飞机</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      路段风险：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:3px"></Divider>
                    <div style="width:100%;position:relative;right:0px">
                      <Table
                        row-key="id"
                        :columns="columns"
                        :data="sitem.line"
                        border
                        :indent-size="0"
                      >
                      <template slot-scope="{ row }" slot="specific">
                          <span>
                            <div v-if="row.specific=='详情'" @mouseenter="mEnter(row.factor)">
                                                            <Button
                                                              type="primary" @click="modal1=true,cityName=row.factor"
                                                            >{{row.specific}}</Button>
                            </div>
                            <div v-else>{{row.specific}}</div>
                          </span>
                        </template>
                      </Table>
                    </div>

                    <Divider style="position:relative;margin-top:5px;margin-bottom:10px"></Divider>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>

      </div>

      <div slot="footer">
        <Button type="primary" size="large" long @click="modal=false">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
import VDistpicker from "v-distpicker";
import CityDetail from '@/assets/citydetail.vue';
export default {
  name: "route",
  components: { VDistpicker,
      "city-detail": CityDetail},
  data() {
    return {
       modal1: false,
       cityName: '',
       columns: [
        {
          title: "风险因素",
          key: "factor",
          tree: true,
          align: "center",
          className: "demo-table-info-column"
        },
        {
          title: "具体信息",
          slot: "specific",
          align: "center",
          className: "demo-table-info-column2"
        },
        {
          title: "评估分数",
          key: "number",
          width: 140,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.number <= 30
                ? "success"
                : row.number <= 60
                ? "warning"
                : "error";
            if (row.factor == "初始站:终点站") {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      // fontSize: "25px",
                      position: "relative",
                      fontWeight: "bold"
                    }
                  },
                  row.number
                )
              ]);
            } else {
              return h("div", [
                h(
                  "Tag",
                  {
                    class: "tagtext",
                    props: {
                      type: "dot",
                      color: color
                    },
                    style: {
                      fontSize: "25px",
                      position: "relative"
                      // marginTop:"3px",
                    }
                  },
                  row.number
                )
              ]);
            }
          }
        }
      ],


      doubleLineList: [],
      demo: [
        {
          type: 0,
          time: "3小时42分",
          start: "北京颐和园",
          end: "上海交通大学",
          title: "G32公交车",
          city: [
            {
              cityname: "北京市",
              cityscore: 39
            }
          ],
          finalscore: 3
        },
        {
          type: 1,
          time: "3小时42分",
          start: "北京颐和园",
          end: "上海交通大学",
          title: "地铁11号线",
          city: [
            {
              cityname: "北京市",
              cityscore: 39
            }
          ],
          finalscore: 2.8
        },
        {
          type: 3,
          time: "3小时42分",
          start: "北京颐和园",
          end: "上海交通大学",
          title: "G32列车",
          city: [
            {
              cityname: "南京市",
              cityscore: 36
            },
            {
              cityname: "北京市",
              cityscore: 61
            },
            {
              cityname: "东京市",
              cityscore: 86
            },
            {
              cityname: "西京市",
              cityscore: 6
            }
          ],
          finalscore: 3.2
        },
        {
          type: 4,
          time: "3小时42分",
          start: "北京颐和园",
          end: "上海交通大学",
          title: "G32航班",
          city: [
            {
              cityname: "南京市",
              cityscore: 36
            },
            {
              cityname: "北京市",
              cityscore: 61
            }
          ],
          finalscore: 4.5
        }
      ],
      routeData: [],
      description: "",
      modal: false,
      disabled: true,
      check2: false,
      addressZone: "",
      map: "",
      city: "",
      geocoder: "",
      geocoder1: "",
      geocoder2: "",
      geocoder3: "",
      select: {
        province: "",
        city: "",
        area: "",
        address: ""
      },

      location: {
        latitude: "",
        longitude: ""
      },
      address: {
        lng: "",
        lat: ""
      },
      score: {
        normal: 0,
        train: 0,
        final: 0,
        start: 0,
        end: 0,
        startcity: "",
        endcity: ""
      },
      province: "",
      latLng: "",
      map: "",
      citypoint: [],
      citys1: [],
      citys2: [],
      citys3: [],

      order: [
        BMAP_TRANSIT_TYPE_POLICY_TRAIN,
        BMAP_TRANSIT_TYPE_POLICY_AIRPLANE,
        BMAP_TRANSIT_TYPE_POLICY_COACH
      ],
      transit: "",
      condition: {
        theCampus: "",

        citydata: "",
        transport: ""
      },
      vehicle: [
        {
          value: 0,
          label: "火车"
        },
        {
          value: 1,
          label: "飞机"
        }
      ],
      campus: [
        {
          value: "宝山区",
          label: "宝山校区"
        },
        {
          value: "静安区",
          label: "延长校区"
        },
        {
          value: "嘉定区",
          label: "嘉定校区"
        }
      ],
      distance: {
        train: 0,
        plane: 0,
        ssubway: 0,
        esubway: 0,
        sbus: 0,
        ebus: 0
      },
      lines: [],
      demos: [
        {
          citys: ["嘉兴市", "嘉兴市", "徐汇区"],
          distance: 156275.66086498625,
          end: "上海南站",
          start: "杭州东站",
          title: "K753/K752",
          type: 3
        }
      ]
    };
  },
  methods: {
    sel: function(data) {
      this.condition.citydata =
        data.province.value + data.city.value + data.area.value;
      this.province = data.province.value;
      var patt = /城区/;
      if (patt.test(data.city.value)) {
        this.score.startcity = data.area.value;
      } else {
        this.score.startcity = data.city.value;
      }
    },
    init() {
      var that = this;
      //调用地址解析类
      this.geocoder = new qq.maps.Geocoder({
        complete: function(result) {
          that.address.lat = result.detail.location.lat;
          that.address.lng = result.detail.location.lng;
          if (result.detail.addressComponents.province == "") {
            that.citypoint.pop();
            that.citypoint.push(result.detail.addressComponents.district);
          } else {
            that.citypoint.pop();
            that.citypoint.push(result.detail.addressComponents.city);
          }
        }
      });

      this.map = new BMap.Map("container");
      this.map.setMapStyle({
        style: "grayscale"
      });
      this.map.centerAndZoom(new BMap.Point(121.393402, 31.31601), 8);
      this.transit = new BMap.TransitRoute(this.map, {
        renderOptions: {
          map: this.map,
          autoViewport: true
        },
        onSearchComplete: function(results) {
          if (results.Gu == undefined) {
            that.$Message.warning("无法查询此路径");
            that.modal = false;
            return;
          }
          var description = results.getPlan(0).getDescription();

          if (that.condition.transport == 0) {
            var half = false;
            var lineNum = results.getPlan(0).getNumLines();
            let traindistance = 0;
            var trainlinenum = 0;
            var trainlinecheck = 0;
            for (let i = 0; i < lineNum; i++) {
              var line = results.getPlan(0).getLine(i);

              if (line.type == 3) {
                trainlinenum++;
              }
            }
            for (var i = 0; i < lineNum; i++) {
              var line = results.getPlan(0).getLine(i);

              if (line.type == 3) {
                trainlinecheck++;
                half = true;
                var temp = [];
                var check = {};
                for (let j = 0; j < line.Tq.length; j++) {
                  if (!check[line.Tq[j].lat]) {
                    temp.push(line.Tq[j]);
                    check[line.Tq[j].lat] = true;
                  }
                }
                for (let j = 0; j < temp.length; j++) {
                  var latLng = new qq.maps.LatLng(temp[j].lat, temp[j].lng);

                  if (j != 0) {
                    let lastlat = temp[j - 1].lat;
                    let lastlng = temp[j - 1].lng;
                    let pointA = new BMap.Point(lastlng, lastlat);
                    let pointB = new BMap.Point(temp[j].lng, temp[j].lat);
                    traindistance += that.map.getDistance(pointA, pointB);
                  }
                  that.geocoder1 = new qq.maps.Geocoder({
                    complete: function(result) {
                      if (
                        result.detail.addressComponents.city ==
                        result.detail.addressComponents.province
                      ) {
                        that.citys1.push(
                          result.detail.addressComponents.district
                        );
                      } else {
                        that.citys1.push(result.detail.addressComponents.city);
                      }
                    }
                  });

                  if (trainlinenum > 1) {
                    that.geocoder2 = new qq.maps.Geocoder({
                      complete: function(result) {
                        if (
                          result.detail.addressComponents.city ==
                          result.detail.addressComponents.province
                        ) {
                          that.citys2.push(
                            result.detail.addressComponents.district
                          );
                        } else {
                          that.citys2.push(
                            result.detail.addressComponents.city
                          );
                        }
                      }
                    });
                    if (trainlinenum > 2) {
                      that.geocoder3 = new qq.maps.Geocoder({
                        complete: function(result) {
                          if (
                            result.detail.addressComponents.city ==
                            result.detail.addressComponents.province
                          ) {
                            that.citys3.push(
                              result.detail.addressComponents.district
                            );
                          } else {
                            that.citys3.push(
                              result.detail.addressComponents.city
                            );
                          }
                        }
                      });
                    }
                  }
                  if (trainlinecheck == 1) {
                    that.geocoder1.getAddress(latLng);
                  } else if (trainlinecheck == 2) {
                    that.geocoder2.getAddress(latLng);
                  } else if (trainlinecheck == 3) {
                    that.geocoder3.getAddress(latLng);
                  }
                }
                var tempcitys = [];
                if (trainlinecheck == 1) {
                  tempcitys = that.citys1;
                } else if (trainlinecheck == 2) {
                  tempcitys = that.citys2;
                } else if (trainlinecheck == 3) {
                  tempcitys = that.citys3;
                }
                var theLine = {
                  citys: tempcitys,
                  type: line.type,
                  distance: traindistance,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.addressZone
                };
                that.lines.push(theLine);
              } else if (line.type == 0) {
                var theCity = half
                  ? that.condition.theCampus
                  : that.citypoint[0];
                var distance = line.bg;
                let tempcity = [];
                tempcity.push(theCity);
                var theLine = {
                  citys: tempcity,
                  distance: distance,
                  type: line.type,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.addressZone
                };
                that.lines.push(theLine);
              } else if (line.type == 1) {
                var theCity = half
                  ? that.condition.theCampus
                  : that.citypoint[0];
                var distance = line.bg;
                let tempcity = [];
                tempcity.push(theCity);
                var theLine = {
                  citys: tempcity,
                  distance: distance,
                  type: line.type,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.addressZone
                };
                that.lines.push(theLine);
              }
            }
          } else if (that.condition.transport == 1) {
            var half = false;
            var lineNum = results.getPlan(0).getNumLines();
            for (var i = 0; i < lineNum; i++) {
              var line = results.getPlan(0).getLine(i);
              if (line.type == 0) {
                var theCity = half
                  ? that.condition.theCampus
                  : that.citypoint[0];
                var distance = line.bg;
                let tempcity = [];
                tempcity.push(theCity);
                var theLine = {
                  citys: tempcity,
                  distance: distance,
                  type: line.type,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.addressZone
                };
                that.lines.push(theLine);
              } else if (line.type == 1) {
                var theCity = half
                  ? that.condition.theCampus
                  : that.citypoint[0];
                var distance = line.bg;
                let tempcity = [];
                tempcity.push(theCity);
                var theLine = {
                  citys: tempcity,
                  distance: distance,
                  type: line.type,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.addressZone
                };
                that.lines.push(theLine);
              } else if (line.type == 4) {
                let tempcity = [];
                tempcity.push(that.condition.theCampus);
                tempcity.push(that.citypoint[0]);
                var theLine = {
                  citys: tempcity,
                  distance: line.bg,
                  type: line.type,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.addressZone
                };
                that.lines.push(theLine);
                half = true;
              }
            }
          }
          setTimeout(function() {
            that.loadData();
          }, 1000);
        },
        intercityPolicy: BMAP_INTERCITY_POLICY_LEAST_TIME,
        transitPolicy: BMAP_TRANSIT_POLICY_FIRST_SUBWAYS
      });
    },
    loadData() {
      let URL = `http://epidemic.songcm.cn/api/epidemic/routeCal`;
      console.log(this.lines);
      axios({
        url: URL,
        method: "post",
        data: {
          routeCalRequestList: this.lines
        },
        headers: {
          "Content-Type": "application/json" //必须设置传输方式
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            // console.log(res);
            // this.routeData = res.data.data.resultList;
            for (let i = 0; i < this.routeData.length; i++) {
              this.routeData.finalscore = parseFloat(
                this.routeData.finalscore
              );
            }
            this.score.final = res.data.data.sumScore;

            this.construct(res.data.data)
            this.modal = true;
          } else {
            this.$Message.warning(`${res.data.message}`);
          }
        })
        .catch(err => {
          this.$Message.warning(`${err}`);
        });
    },
    codeAddress() {
      this.clear();
      this.citypoint.push(this.condition.theCampus);
      this.score.endcity = this.condition.theCampus;
      this.addressZone = this.condition.citydata + this.select.address;
      this.geocoder.getLocation(this.addressZone);
      var that = this;
      setTimeout(function() {
        var start = new BMap.Point(that.address.lng, that.address.lat);
        var end;
        if (that.condition.theCampus == "宝山区") {
          end = new BMap.Point(121.389028, 31.32062);
        } else if (that.condition.theCampus == "嘉定区") {
          end = new BMap.Point(121.252, 31.37671);
        } else {
          end = new BMap.Point(121.457785, 31.276666);
        }
        that.transit.setTransitTypePolicy(that.order[that.condition.transport]);
        that.transit.search(start, end);
      }, 2000);
    },
    clear() {
      this.citys1.splice(0, this.citys1.length);
      this.citys2.splice(0, this.citys2.length);
      this.citys3.splice(0, this.citys3.length);
      this.citypoint.splice(0, this.citypoint.length);
      this.lines.splice(0, this.lines.length);
      this.score.train = 0;
      this.score.final = 0;
      this.score.normal = 0;
      this.check2 = true;
    },
    construct(data) {
      this.doubleLineList = [];
     console.log(data)

        let lineList = [];
        for (let j = 0; j < data.resultList.length; j++) {
          let theTemplate = [
            {
              id: 1,
              factor: "路程时间",
              specific: "",
              number: 0
            },
            {
              id: 2,
              factor: "交通工具",
              specific: "",
              number: 0,
              children: [
                {
                  id: 3,
                  factor: "初始站:终点站",
                  specific: "",
                  number: ""
                }
              ]
            },

            {
              id: 4,
              factor: "途径城市",
              specific: "",
              number: 0,
              children: []
            }
          ];
          let nums = 10;
          let lineTemp = data.resultList[j];
          lineTemp.timeScore = parseInt(lineTemp.timeScore).toFixed(0);
          lineTemp.transportScore = parseInt(lineTemp.transportScore).toFixed(
            0
          );
          theTemplate[0].specific = lineTemp.time;
          theTemplate[0].number = lineTemp.timeScore;
          theTemplate[1].specific = lineTemp.title;
          theTemplate[1].number = lineTemp.transportScore;
          theTemplate[1].children[0].specific = lineTemp.start;
          theTemplate[1].children[0].number = lineTemp.end;

          theTemplate[2].specific = `经过${lineTemp.city.length}个城市`;
          let theCityScore = 0;
          for (let k = 0; k < lineTemp.city.length; k++) {
            let cityTemp = {
              id: k + 10,
              factor: lineTemp.city[k].cityname,
              number: lineTemp.city[k].cityscore,
              specific: "详情"
            };
            theTemplate[2].children.push(cityTemp);
            theCityScore += lineTemp.city[k].cityscore;
          }
          theCityScore /= lineTemp.city.length;
          theTemplate[2].number = theCityScore.toFixed(0);
          console.log(theTemplate)
          console.log(1111111)
          let big = {
            type: lineTemp.type,
            finalscore: lineTemp.finalscore,
            line: theTemplate
          };
          lineList.push(big);
        }

        let bigs = {
          type: data.type,
          sumScore: data.sumScore,
          line: lineList
        };
        console.log(bigs)
        this.doubleLineList.push(bigs);

      // console.log(this.doubleLineList)

    },
    mEnter(city){
      console.log(city)
    }
  },
  mounted() {
    this.init();

  },
  watch: {
    condition: {
      handler(val, old) {
        var patt = /市区/;
        if (
          val.transport !== "" &&
          val.theCampus !== "" &&
          val.citydata !== ""
        ) {
          this.disabled = false;
        }
        if (patt.test(val.citydata)) {
          this.disabled = true;
        }
      },
      deep: true
    },
    "condition.transport": {
      handler(val, oldval) {
        if (val != oldval && this.score.final != 0) {
          // this.$router.go(0);
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "route";
</style>
<style>
.ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-first,
.ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-second {
  color: rgb(245, 10, 10);
}
</style>
