<template>
    <div class="queryCasePage"> 
        <div class="queryCaseList">
            <div class="searchCaseInfo">
                <a-button class="comfirmAdd" @click="changetyp">切换</a-button>
            </div>
            <div v-show="show">
                <a-table bordered :columns="columns"  :pagination="false"
                        :loading="loading" :data-source="tableData_dossier" size="middle"
                    class="tableCaseData" >
                </a-table>
                <a-table bordered :columns="columns_time" :pagination="false"
                    :loading="loading" :data-source="tableData_time" size="middle"
                    class="tableCaseData" >
                </a-table>
                <a-table bordered :columns="columns_status" :pagination="false"
                    :loading="loading" :data-source="tableData_status" size="middle"
                    class="tableCaseData" >
                </a-table>
            </div>
            <div v-show="!show" class="chart">
                    <div id="main" style="width:1000px;height:400px; margin:0 auto"></div>
                    <div id="c2" style="width:1000px;height:400px; margin:0 auto"></div>
                    <div id="c3" style="width:1000px;height:400px; margin:0 auto"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { Chart } from '@antv/g2';
import echarts from 'echarts'
    export default {
        data(){
            return{
                show:true,
                //标题
                columns:[{title:"机构名称",dataIndex: 'org_name',align:'center'},
                      {title:'数量',dataIndex:'quantity',align:'center'}],
                columns_time:[{title:"时间",dataIndex:'nian',align:'center'},
                      {title:'数量',dataIndex:'quantity',align:'center'}],
                columns_status:[{title:"案件状态",dataIndex: 'case_type',align:'center'},
                      {title:'数量',dataIndex:'quantity',align:'center'}],
                tableData_dossier: [],
                tableData_time:[],
                tableData_status:[],
                loading: false,
                //详情信息
                showModel: {
                    modalDetail: false,
                    itemDetail: {},
                    comfirmBtn: false,
                    tableDataCase: []
                }
            }
        },
        mounted() {
            this.getQueryListData(this.pagination);
        },
        methods: {
            changetyp(){
            
                this.show = this.show? false:true;
                this.gettuone()
                this.gettutwo()
                this.gettuthree()
            },
      // 获取卷宗列表信息
            async getQueryListData(dataInfo){
                this.loading = true;
                const queryListData = await this.$api.tjechar(dataInfo);
                const pagination = { ...this.pagination };
                if(queryListData){
                    if(queryListData.code == '0'){   
                        this.tableData_dossier =  queryListData.data.org;
                        this.tableData_time = queryListData.data.time;
                        this.tableData_status = queryListData.data.status;
                        console.log( this.tableData_time)
                        pagination.total = queryListData.data.total;
                        this.pagination = pagination;
                        this.loading = false;
                    }
                }
                
            },
        // 图1
          gettuone(){
              let c1 = []
              let b1 = []
              this.tableData_dossier.map(item=>{
                  c1.push(item.org_name)
                  b1.push(item.quantity)
              })
               var myChart = echarts.init(document.getElementById('main'));
                // 指定图表的配置项和数据
                var option = {
                    color:['#4472C5',],
                    title: {
                        text: '机构'
                    },
                    tooltip: {},
             
                    xAxis: {
                        data: c1
                    },
                    yAxis: {},
                    series: [{
                 
                        type: 'bar',
                        barWidth: 20,
                        data:b1
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
        
      
          },
          gettuthree(){
                let c1 = []
                let b1 = []
              this.tableData_status.map(item=>{
                  c1.push(item.case_type)
                  b1.push(item.quantity)
              })
               var myChart = echarts.init(document.getElementById('c3'));
                // 指定图表的配置项和数据
                var option = {
                    color:['#4472C5',],
                    title: {
                        text: '案件状态'
                    },
                    tooltip: {},
             
                    xAxis: {
                        data: c1
                    },
                    yAxis: {},
                    series: [{
                 
                        type: 'bar',
                        barWidth: 20,
                        data:b1
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
          },
          gettutwo(){
                let c1 = []
                let b1 = []
              this.tableData_time.map(item=>{
                  c1.push(item.nian)
                  b1.push(item.quantity)
              })
               var myChart = echarts.init(document.getElementById('c2'));
                // 指定图表的配置项和数据
                var option = {
                    color:['#4472C5',],
                    title: {
                        text: '时间'
                    },
                    tooltip: {},
             
                    xAxis: {
                        data: c1
                    },
                    yAxis: {},
                    series: [{
                 
                        type: 'bar',
                        barWidth: 20,
                        data:b1
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
          }
        },
     
        
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .chart{
        width:100%;
    }
    .queryCasePage{
        padding: 20px 0;
          background-color: white;
        .queryCaseList{
            padding: 20px 0;
            background-color: white;
            // height: 100%;
            .searchCaseInfo{
                text-align: left;
                padding-left: 20px;
                .enterInputData{
                    width: auto;
                }
                .comfirmAdd{
                    margin: 0 10px;
                    color: white;
                    background-color: @bgBtnColor;
                }
                .refreshBtn{
                    margin-right: 10px;
                }
            }
            .tableCaseData{
                margin-top: 20px;
                .ant-table table, .ant-table-thead > tr > th{
                    text-align: center;
                }
                .editDate{
                    display: inline-block;
                    padding: 0 5px;
                    background-color: @bgBtnColor;
                    color: white;
                    border-radius: 5px;
                }
            }
        }
    }
</style>