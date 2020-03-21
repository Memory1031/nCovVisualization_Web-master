<template>
  <div>
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
          :disabled="disabled"
        >搜索</Button>
      </div>
    </Row>
    <Row>
      <div id="container"></div>
    </Row>
    <Modal v-model="modal" width="360">
      <p slot="header" style="color:#f60;text-align:center;height:50px">
        <Icon type="ios-information-circle" size="35" style="top:10px;position:relative"></Icon>
        <span style="font-size:35px;top:10px;position:relative">返沪风险指数</span>
      </p>
      <div style="text-align:center">
        <div style="height:270px">
          <p style="text-align:center;margin-top:2px;font-size:25px">您的综合风险评分为</p>
          <p
            style="text-align:center;margin-top:0px;font-size:70px;color:rgb(77, 121, 243);"
          >{{score.final}}</p>
          <p style="text-align:center;margin-bottom:10px;font-size:30px">详细数据</p>
          <Row type="flex" justify="center" class="code-row-bg" style>
            <Col span="5" offset="0">
              <div style=";position:relative;margin-top:0px;">
                <p
                  style="position:relative;font-size:24px;font-weight:bold;color:rgb(77, 121, 243);"
                >{{score.start}}</p>
                <p
                  style="position:relative;font-size:14px;font-weight:normal;color:#000;"
                >{{score.startcity}}</p>
              </div>
            </Col>
            <Divider type="vertical" style="width:1px;height:80px;position:relative;left:20px" />

            <Col span="5" offset="3">
              <div style=";position:relative;margin-top:0px;">
                <p
                  style="position:relative;font-size:24px;font-weight:bold;color:rgb(77, 121, 243);"
                >{{score.train}}</p>
                <p style="position:relative;font-size:14px;font-weight:normal;color:#000;">路途</p>
              </div>
            </Col>
            <Divider type="vertical" style="width:1px;height:80px;position:relative;left:20px" />
            <Col span="5" offset="2">
              <div style=";position:relative;margin-top:0px;">
                <p
                  style="position:relative;font-size:24px;font-weight:bold;color:rgb(77, 121, 243);"
                >{{score.end}}</p>
                <p
                  style="position:relative;font-size:14px;font-weight:normal;color:#000;"
                >{{score.endcity}}</p>
              </div>
            </Col>
          </Row>
        </div>
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
export default {
  name: "route",
  components: { VDistpicker },
  data() {
    return {
      modal: false,
      disabled: true,
      check2: false,
      addressZone: "",
      map: "",
      city: "",
      geocoder: "",
      geocoder2: "",
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
      markersArray: [],
      groundcity: "",
      first: true,
      latLng: "",
      map: "",
      check: false,

      check2: false,
      longZone: 0,
      citypoint: [],
      citys: [],
      allcity: [],
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
        },

        {
          value: 2,
          label: "大巴"
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

          that.loadData2();
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
          if (that.condition.transport == 0) {
            var lineNum = results.getPlan(0).getNumLines();
            for (var i = 0; i < lineNum; i++) {
              var line = results.getPlan(0).getLine(i);
              if (line.type == 3) {
                for (var j = 0; j < line.Tq.length; j++) {
                  var latLng = new qq.maps.LatLng(
                    line.Tq[j].lat,
                    line.Tq[j].lng
                  );
                  that.geocoder2 = new qq.maps.Geocoder({
                    complete: function(result) {
                      if (
                        result.detail.addressComponents.city ==
                        result.detail.addressComponents.province
                      ) {
                        that.citys.push(
                          result.detail.addressComponents.district
                        );
                      } else {
                        that.citys.push(result.detail.addressComponents.city);
                      }
                    }
                  });
                  that.geocoder2.getAddress(latLng);
                }
              }
            }
            setTimeout(function() {
              that.loadData();
            }, 1000);
          }
        },
        intercityPolicy: BMAP_INTERCITY_POLICY_LEAST_TIME,
        // 配置跨城公交的交通方式策略为飞机优先
        transitTypePolicy: BMAP_TRANSIT_TYPE_POLICY_COACH,
        transitPolicy: BMAP_TRANSIT_POLICY_RECOMMEND
      });
    },
    loadData() {
      let URL = `http://epidemic.songcm.cn/api/epidemic/areaCal`;
      if (this.citys.length == 0) {
        this.score.final = (
          (this.score.start * 0.5 + this.score.end * 0.5) * 0.5 +
          this.score.train * 0.2
        ).toFixed(2);
        this.modal = true;
        return;
      }
      axios({
        url: URL,
        method: "post",
        data: {
          areaList: this.citys
        },
        headers: {
          "Content-Type": "application/json" //必须设置传输方式
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            this.score.train = res.data.data.number.toFixed(2);
            this.score.final = (
              (this.score.start * 0.5 + this.score.end * 0.5) * 0.5 +
              this.score.train * 0.2
            ).toFixed(2);
            this.modal = true;
          } else {
            this.$Message.warning(`${res.data.message}`);
          }
        })
        .catch(err => {
          this.$Message.warning(`${err}`);
        });
    },
    loadData2() {
      let URL = `http://epidemic.songcm.cn/api/epidemic/areaCal`;

      axios({
        url: URL,
        method: "post",
        data: {
          areaList: this.citypoint
        },
        headers: {
          "Content-Type": "application/json" //必须设置传输方式
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            if (this.check2) {
              if (res.data.data.areaList.length == 1) {
                this.score.end = res.data.data.areaList[0].sum;
              }
              this.check2 = !this.check2;
            } else {
              if (res.data.data.areaList.length == 1) {
                this.score.start = res.data.data.areaList[0].sum;
              }
              if (this.condition.transport != 0) {
                this.score.final = (
                  this.score.start * 0.25 +
                  this.score.end * 0.25
                ).toFixed(2);
                this.score.train = this.score.start * 2;
                this.modal = true;
              }
              this.check2 = !this.check2;
            }
          } else {
            this.$Message.warning(`${res.data.message}`);
          }
        })
        .catch(err => {
          this.$Message.warning(`${err}`);
        });
    },
    loadData3() {
      let URL = `http://epidemic.songcm.cn/api/epidemic/areaCal`;

      axios({
        url: URL,
        method: "get"
      })
        .then(res => {
          if (res.data.code == 200) {
            this.allcity = res.data.data;
          } else {
            this.$Message.warning(`${res.data.message}`);
          }
        })
        .catch(err => {
          this.$Message.warning(`${err}`);
        });
    },
    codeAddress() {
      this.citys.splice(0, this.citys.length);
      this.citypoint.splice(0, this.citypoint.length);
      this.score.train = 0;
      this.score.final = 0;
      this.score.normal = 0;
      this.check2 = true;
      this.citypoint.push(this.condition.theCampus);
      this.score.endcity = this.condition.theCampus;
      this.addressZone = this.condition.citydata + this.select.address;
      this.geocoder.getLocation(this.addressZone);
      this.loadData2();
      var that = this;
      setTimeout(function() {
        var start = new BMap.Point(that.address.lng, that.address.lat);
        var end = new BMap.Point(121.393402, 31.31601);
        that.transit.setTransitTypePolicy(that.order[that.condition.transport]);
        that.transit.search(start, end);
      }, 2000);
    },
   
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

