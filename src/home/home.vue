<template>
  <div class="layout">
    <Layout style="height: 100vh;">
      <Sider :width="250">
        <div >
          <img src="../assets/img/logo.jpg" style="width:250px" >
        </div>
        <Menu :active-name="activeName"
              width="251px"
              @on-select="push">
          <MenuItem name="statisticList">
            <span>统计数据</span>
          </MenuItem>
          <MenuItem name="chinaMap">
            <span>地图数据</span>
          </MenuItem>
          <MenuItem name="riskAssess">
            <span>城市风险评估</span>
          </MenuItem>
          <MenuItem name="route">
            <span>返校风险评估</span>
          </MenuItem>
          <MenuItem name="routetable">
            <span>批量风险评估</span>
          </MenuItem>
          <MenuItem name="routechoose">
            <span>返校路径选择</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff', height: '80px',boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}"
                class="layout-header-bar">
          <div class="layout-header-title"
               id="layout-header-title">
            上海大学 nCoV-2019 风险评估平台
          </div>
        </Header>
        <Content :style="{margin: '20px', background: '#fff', minHeight: '220px'}" style="height:100vh; overflow-y: scroll">
          <!--          <Scroll :height="contentHeight">-->
          <router-view></router-view>
          <!--          </Scroll>-->

        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
    export default {
        name: 'home',
        data () {
            return {
                contentHeight: 450,
                isCollapsed: false,
                activeName: "",
            };
        },
        watch: {
            $route() {
                this.$nextTick(() => {
                    this.initMenuActive();
                });
            }
        },
        mounted(){
            this.contentHeight = document.body.offsetHeight - 130;
            this.initMenuActive();
        },
        methods: {
            initMenuActive() {
                this.activeName = this.$route.name;
            },
            push(name) {
                this.$router.push(name);
            }
        }
    }
</script>

<style lang="scss">
  @import "home";
</style>
<style scoped>
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }

  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

</style>
