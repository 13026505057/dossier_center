<template>
    <div class="homeScreenPage">
        <!-- 顶部消息 -->
        <div class="topShowInfo">
            <a-row :gutter="16" justify="center">
                <a-col class="gutter-row" :span="6" 
                    v-for="(item,index) in newsInfoData" :key="index" @click="todeta(item.path)" style="cursor:pointer;">
                    <div class="gutter-box" :style="{'color':item.bgset}">
                        <div class="leftData">
                            <span class="iconInfo" :style="{'background':item.bgset}">
                                <i :class="item.icon" class="iconfont"></i>
                            </span>
                        </div>
                        <div class="rightData">
                            <p>{{ item.title }}</p>
                            <p>{{ item.number }}</p>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
        <!-- document_content -->
        <div class="contentInfo">
            <!-- tab表格 -->
            <a-table bordered :columns="columns_caseL" :data-source="tableData_caseL" 
                class="tableCaseData" size="middle" :pagination="false" :loading="loading">
                <template slot="operation" slot-scope="record">
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item @click="checkVideo(record)">查看视频</a-menu-item>
                            <a-menu-item @click="deleteCaseItem(record)">删除</a-menu-item>
                        </a-menu>
                        <a> 详情 <a-icon type="down" /> </a>
                    </a-dropdown>
                </template>
            </a-table>
            <!-- 留存视频 -->
            <a-modal :title="'留存视频：'+showModel.videoShowData.video_name"
                centered v-model="showModel.modal2Video" @ok="closeVideos" @cancel="closeVideos">
                <video controls :src="showModel.videoShowData.video_url" 
                    style="width: 100%" autoplay id="videoDate"></video>
            </a-modal>
            <!-- 图表 -->
            <a-row :gutter="16" justify="center">
                <a-col class="gutter-row" :xl="6" :span="12">
                    <div class="gutter-box g2ShowArea">
                        <G2Data :charData="caseData_in" id="caseData_in" :typeGShow="typeGShow_caseIn"></G2Data>
                    </div>
                </a-col>
                <a-col class="gutter-row" :xl="6" :span="12">
                    <div class="gutter-box g2ShowArea">
                        <G2Data :charData="caseData_out" id="caseData_out" :typeGShow="typeGShow_caseOut"></G2Data>
                    </div>
                </a-col>
                <a-col class="gutter-row" :xl="6" :span="12">
                    <div class="gutter-box g2ShowArea">
                        <G2Data :charData="lesortData_dept" id="caseData_dept" :typeGShow="typeGShow_caseDept"></G2Data>
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
    import G2Data from '@/components/G2Data.vue';
    import { mapState } from 'vuex'
    export default {
        components: {
            G2Data
        },
        computed: {
            ...mapState({
                caseData_in: 'lesortData_in',
                caseData_out: 'lesortData_out',
                lesortData_dept: 'lesortData_dept',
            })
        },
        data(){
            return{
                newsInfoData: [
                    { icon: 'icon-tongzhixiaoxi', title: '通知消息', number: 0, bgset: '#7586F7',path:'/myReminder' },
                    { icon: 'icon-tubiao_chukushenpi', title: '出库审批', number: 0, bgset: '#21C1F5',path:'/caseBorrowing' },
                    { icon: 'icon-dairuku', title: '待入库', number: 0, bgset: '#58CDB2',path:'/caseWaiting' },
                    { icon: 'icon-chuku1', title: '出库', number: 0, bgset: '#13D3DA',path:'' },
                ],
                dataInfo: {
                    pageNum: '1',
                    pageSize: '5'
                },
                columns_caseL: [
                    { title: '卷宗名称', dataIndex: 'name', },
                    { title: '借阅人', dataIndex: 'name_borrowing', },
                    { title: '操作类型', dataIndex: 'type', }, 
                    { title: '主办人', dataIndex: 'name_opertion', },
                    { title: '协办人', dataIndex: 'name_join', },
                    { title: '操作结果', dataIndex: 'result', },
                    { title: '操作', key: 'video_id', 
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
                tableData_caseL: [],
                //弹窗
                showModel: {
                    modal2Video: false,
                    videoShowData: {},
                },
                pagination: {
                    pageNum: 1,
                    pageSize: 5
                },
                loading: false,
                typeGShow_caseIn: {
                    type: 'histogram',
                    title: '在库案件数按月统计',
                    widthScroll: (window.screen.width - 240)/4 -16 -22 -20,
                    heightScroll: ((window.screen.width - 240)/4 -16 -22 -20)/2
                },
                typeGShow_caseOut: {
                    type: 'histogram',
                    title: '出库案件数按月统计',
                    widthScroll: (window.screen.width - 240)/4 -16 -22 -20,
                    heightScroll: ((window.screen.width - 240)/4 -16 -22 -20)/2
                },
                typeGShow_caseDept:{
                    type: 'caseData_dept',
                    title: '在库案件按部门统计',
                    widthScroll: (window.screen.width - 240)/4 -16 -22 -20,
                    heightScroll: ((window.screen.width - 240)/4 -16 -22 -20)/2
                },
            }
        },
        mounted() {
            console.log(this.caseData_in,"===---===")
            this.getCaseLogList_Page(this.pagination);
            this.getShowDataInfo();
        },
        methods: {
            todeta(path){
                console.log('2365')
                 this.$router.push({ path:path  })
            },
            closeVideos(){
                this.showModel.modal2Video = false;
                this.showModel.videoShowData = {};
                var video = document.getElementById('videoDate');
                if(video.paused){ //如果已暂停则播放
                    video.play(); //播放控制
                }else{ // 已播放点击则暂停
                    video.pause(); //暂停控制
                }
            },
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getQueryListData({
                    pageNum: pagination.current,
                    pageSize: pagination.pageSize
                });
            },
            async getCaseLogList_Page(dataInfo){
                this.loading = true;
                const queryListData = await this.$api.getCaseLogList_Page(dataInfo);
                // console.log(queryListData);
                const pagination = { ...this.pagination };
                const queryCaseList = queryListData.data.list.slice(0,6);
                const queryData = [];
                queryCaseList.forEach(item=>{
                    queryData.push({
                        key: item.dossier_log_id,
                        number: item.dossier_id,
                        name: item.dossier_name,
                        name_borrowing: item.out_user_name,
                        name_opertion: item.organize_user_name,
                        name_join: item.join_user_name,
                        type: item.operate_type=='inStock'?'入库':'出库',
                        result: item.result,
                        video_id: item.video_id
                    })
                })
                this.tableData_caseL = queryData;
                pagination.total = queryListData.data.total;
                this.pagination = pagination;
                this.loading = false;
                
            },
            async checkVideo(e){
                const videoItem = await this.$api.getVideoList_Page({ video_id: e.video_id });
                if(videoItem){
                    this.showModel.videoShowData = videoItem.data[0];
                    this.showModel['modal2Video'] = true;
                }
            },
            async deleteCaseItem(e){
                const deleteItem = await this.$api.deleteLogData({ dossier_log_id: e.key });
                if(!deleteItem.data){
                    this.getCaseLogList_Page(this.pagination)
                }
            },
            // 获取头部统计数据
            async getShowDataInfo(){
                let returnData = await this.$api.getShowDataInfo();
                console.log(returnData)
                // returnData.data
                let tipsDom = ['Tongzhi','shenpi','dairuku','chuku'];
                tipsDom.forEach((item,index)=>{
                    this.newsInfoData[index].number = returnData.data[item];
                })
            }
        },
    }
</script>

<style lang="less" scope>
    .homeScreenPage{
        width: calc(100vw - 180px);
        padding: 20px;
        height: 100%;
        //顶部展示消息
        .topShowInfo{
            .gutter-box{
                background-color: white;
                display: flex;
                width: 100%;
                align-items: center;
                border-radius: 5px;
                padding: 15px 0;
                .leftData, .rightData{
                    width: 50%;
                    p{
                        margin-bottom: 0;
                    }
                }
                .leftData{
                    span.iconInfo{
                        display: inline-block;
                        width: 35px;
                        color: white;
                        height: 35px;
                        line-height: 35px;
                        border-radius: 50px;
                    }
                }
            }
        }
        .contentInfo{
            border-radius: 5px;
            background-color: white;
            padding: 10px;
            overflow-y: auto;
            margin-top: 10px;
            height: calc(100% - 82px);
            .tableCaseData{
                .ant-table table, .ant-table-thead > tr > th{
                    text-align: center;
                }
            }
            .g2ShowArea{
                padding: 10px;
                margin-top: 15px;
                border: 1px solid #F1F1F1;
                .captionsTitleData{
                    font-size: 18px;
                    padding: 5px 0;
                    border-bottom: 1px solid #F1F1F1;
                }
            }
        }
    }
</style>