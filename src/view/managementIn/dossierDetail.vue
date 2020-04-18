<template>
    <div class="dossierDetailPage"> 
        <div class="dossierDetailList">
            <!-- 案卷详情 -->
            <a-tabs :defaultActiveKey="checkedItem" tabPosition="top"
                @change="changeTabItem">
                <a-tab-pane v-for="(item,index) in tabListBtn" :tab="'卷宗'+(index+1)" :key="item.label">
                    <div class="dossierDetail">
                        <div class="left_history">
                            <p class="captionTitle">调阅历史:</p>
                            <a-timeline>
                                <a-timeline-item v-for="itemHistory in historyList" :key="itemHistory.setps">
                                    <div v-if="itemHistory.name_cb!=''">承办人: {{ itemHistory.name_cb }}</div>
                                    <div>操作人：{{ itemHistory.name_cz }}</div>
                                    <div>{{ itemHistory.title }}</div>
                                    <div>{{ itemHistory.time }}</div>
                                </a-timeline-item>
                            </a-timeline>
                        </div>
                        <div class="right_detail">
                            <a-descriptions title="卷宗详情" :column="1">
                                <a-descriptions-item label="卷宗名称">{{ item.title }}</a-descriptions-item>
                                <a-descriptions-item label="卷宗存储位置">{{ item.location }}</a-descriptions-item>
                            </a-descriptions>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                //卷宗详情
                checkedItem: 1,
                //tab标签
                tabListBtn: [],
                //操作记录
                historyList: [],
            }
        },
        methods: {
            // 切换tab标签
            changeTabItem(checkedItem){
                this.getDossierData({
                    pageNum: 1,
                    pageSize: 100,
                    dossier_id: this.tabListBtn[checkedItem-1].key
                })
            },
            // 获取卷宗操作记录
            async getDossierData(dataInfo){
                let returnData_log = await this.$api.getCaseLogList_Page(dataInfo);
                console.log(returnData_log)
                let historyData = [];
                returnData_log.data.list.forEach((item,index)=>{
                    historyData.push({
                        key: item.dossier_log_id,
                        title: item.result,
                        step: index+1,
                        time: item.create_time,
                        name_cz: item.organize_user_name,
                        name_cb: item.operate_user_name
                    })
                })
                this.historyList = historyData;
            },
            // 展示详情
            showCaseDetail(e){
                let dossierData = [];
                e.listData.forEach((item,index)=>{
                    dossierData.push({
                        key: item.dossier_id,
                        label: index+1,
                        title: item.dossier_name,
                        location: ''+this.checkedNull(item.location_name)+' - '+this.checkedNull(item.floor_name)+' - '+
                            this.checkedNull(item.room_name)+' - '+this.checkedNull(item.line_name)+' - '+
                            this.checkedNull(item.shale_name)+' - '+this.checkedNull(item.clock_id),
                    })
                })
                this.getDossierData({
                    pageNum: 1,
                    pageSize: 100,
                    dossier_id: e.listData[0].dossier_id
                })
                this.tabListBtn = dossierData;
                this.modalDetail = true;
            },
            // 检测是否为空
            checkedNull(data){
                let returnData = ' ';
                if(data) returnData = data;
                return returnData;
            }
        },
        mounted() {
            console.log(this.$route.query.detailDom)
            this.showCaseDetail(this.$route.query.detailDom);
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .dossierDetailPage{
        padding: 20px 0;
        .dossierDetailList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
            .dossierDetail{
                text-align: left;
                display: table;
                width: 100%;
                .left_history, .right_detail{
                    display: table-cell;
                    width: 50%;
                    padding: 20px;
                }
                .left_history{
                    .captionTitle{
                        margin-bottom: 20px;
                        color: rgba(0, 0, 0, 0.85);
                        font-weight: bold;
                        font-size: 16px;
                        line-height: 1.5;
                    }
                }
            }
        }
    }
</style>