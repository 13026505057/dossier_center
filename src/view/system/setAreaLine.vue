<template>
    <div class="setAreaLinePage"> 
        <div class="setAreaLineList">
            <div class="addCaseInfo">
                <span @click="addInfo"><i class="iconfont icon-cf-c101"></i>新增</span>
            </div>
            <a-table bordered :columns="columns_area" :pagination="pagination"
                :data-source="tableData_area" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading" @expand="expandedRowItem">
                <a-table slot="expandedRowRender" :columns="innerColumns" slot-scope="record"
                    :dataSource="record.listData" :pagination="false" size="middle">
                    <template slot="operation" slot-scope="text,record">
                        <a-button class="editDate" @click="editItem(record)" size="small">修改</a-button>
                        <a-popconfirm title="确定移除?"
                            @confirm="deleteItem(record)" okText="确认" cancelText="取消">
                            <a-button class="editDate" size="small">移除</a-button>
                        </a-popconfirm>
                    </template>
                </a-table>
            </a-table>
            <!-- 新增房间区域 -->
            <a-modal :title="showModel.captionsTitle"
                centered v-model="showModel.modalFrom" @ok="confirmBtn" @cancel="resetSubmitInfo">
                <div v-for="(item,index) in eachDataInfoList" :key="index"
                    style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        {{ item.captionTitle }}：
                    </span>
                    <a-input :placeholder="item.placeholder" allowClear v-if="index==0"
                        v-model="submitDataInfo[item.dom]" style="display:table-cell;width: auto" />
                    <a-select showSearch :placeholder="item.placeholder" optionFilterProp="children" v-else
                        style="margin-top: 10px;width: 100%" @change="checkedBuild" :filterOption="filterOption"
                        :value="submitDataInfo[item.dom]">
                        <a-select-option :value="item.key" :label="item.name"  
                            v-for="item in showModel[item.dom]" :key="item.key">{{ item.name }}
                        </a-select-option>
                    </a-select>
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                pagination: {
                    pageNum: 1,
                    pageSize: 10
                },
                loading: false,
                showModel: {
                    subDom: {},
                    captionsTitle: '',
                    modalFrom: false,
                    confirmType: true, //提交方式：true：新增 false：修改
                    room_id: [],
                },
                submitDataInfo: {
                    room_id: '',
                    line_id: '',
                    line_name: '',
                    index: 0
                },
                eachDataInfoList: [
                    { captionTitle: '区域名称',placeholder: '请填写区域名称',dom:'line_name' }, 
                    { captionTitle: '选择房间',placeholder: '请选择房间',dom:'room_id' },
                ],
                columns_area: [
                    { title: '房间名称', dataIndex: 'name', },
                    { title: '联系人', dataIndex: 'userName', },
                    { title: '联系电话', dataIndex: 'tell', },
                    { title: '门锁IP', dataIndex: 'doorIp', },
                ],
                innerColumns: [
                    { title: '区域名称', dataIndex: 'line_name', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_area: [],
            }
        },
        mounted() {
            this.getRoomList(this.pagination);
        },
        methods: {
            //选项框
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getRoomList({
                    pageNum: pagination.current,
                    pageSize: pagination.pageSize
                });
            },
            //选择确认房间
            checkedBuild(e){
                this.submitDataInfo['room_id'] = e;
                console.log(this.submitDataInfo)
            },
            //获取房间列表
            async getRoomList(dataInfo){
                this.loading = true;
                const areaList = await this.$api.getRoomList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = areaList.data.list;
                const areaData = [];
                queryCaseList.forEach((item,index)=>{
                    areaData.push({
                        key: item.room_id,
                        index: index,
                        name: item.room_name,
                        userName: item.create_user_name,
                        tell: item.room_tel,
                        doorIp: item.door_ip,
                        listData: []
                    })
                })
                this.tableData_area = areaData;
                pagination.total = areaList.data.total;
                this.pagination = pagination;
                this.loading = false;

                const operatortList = await this.$api.getRoomListData();
                const operatortData = [];
                operatortList.data.forEach(item=>{
                    operatortData.push({
                        key: item.room_id,
                        name: item.room_name,
                    })
                })
                this.showModel.room_id = operatortData;
            },
            // 移除区域
            async deleteItem(e){
                console.log(e)
                const returnData = await this.$api.deleteAreaLineData({ line_id: e.line_id });
                if(returnData){
                    if(returnData.code == '0'){
                        this.getFloorDataInfo(this.showModel.subDom);
                    }
                }
            },
            confirmBtn(){
                if(this.showModel.confirmType){
                    this.addItem();
                }else{
                    this.comfirmEditItem();
                }
            },
            // 修改区域信息
            async editItem(e){
                console.log(e)
                this.submitDataInfo.room_id = e.room_id;
                this.showModel.captionsTitle = '修改区域信息';
                this.showModel.confirmType = false;
                const typeData = ['line_name','line_id'];
                const typeData_area = ['line_name','line_id'];
                typeData.forEach((item,index)=>{
                   this.submitDataInfo[typeData[index]] = e[typeData_area[index]];
                })
                this.showModel.modalFrom = true;
            },
            //确认提交修改
            comfirmEditItem(){
                console.log(this.submitDataInfo);
                this.$api.editAreaLineData(this.submitDataInfo).then(()=>{
                    this.showModel.modalFrom = false;
                    console.log(this.showModel.subDom)
                    this.getAreaDataInfo(this.showModel.subDom);
                    setTimeout(()=>{
                        this.resetSubmitInfo();
                    },500)
                })
            },
            //重置表单
            resetSubmitInfo(){
                this.submitDataInfo['room_id'] = '';
                this.submitDataInfo['line_name'] = '';
                this.submitDataInfo['line_id'] = '';
                this.submitDataInfo['index'] = 0;
            },
            //添加区域
            addInfo(){
                this.showModel.captionsTitle = '新增区域信息';
                this.showModel.confirmType = true;
                this.showModel.modalFrom = true;
            },
            async addItem(){
                const returnData = await this.$api.addAreaLineData(this.submitDataInfo);
                this.showModel.modalFrom = false;
                if(returnData){
                    if(returnData.code == '0'){
                        this.$router.go(0);
                    }
                }
            },
            //获取区域列表信息
            async getAreaDataInfo(data){
                const returnData = await this.$api.getAreaLineData({
                    pageNum:1, pageSize:100,room_id: data.key
                })
                let dataInfo = [];
                returnData.data.forEach((area,index)=>{
                    area.key = index;
                    dataInfo.push(area)
                })
                this.tableData_area[data.index].listData = dataInfo;
            },
            //展开获取子集
            async expandedRowItem(state,data){
                if(state){
                    this.showModel.subDom = data;
                    const returnData = await this.$api.getAreaLineData_Page({
                        pageNum:1, pageSize:100,room_id: data.key
                    })
                    let dataInfo = [];
                    returnData.data.list.forEach((location,index)=>{
                        location.key = index;
                        dataInfo.push(location)
                    })
                    this.tableData_area[data.index].listData = dataInfo;
                }
            },
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setAreaLinePage{
        padding: 20px 0;
        .setAreaLineList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
            overflow: auto;
            .addCaseInfo{
                text-align: left;
                padding-left: 20px; 
                color: white;
                span{
                    display: inline-block;
                    padding: 5px 20px;
                    background-color: @bgBtnColor;
                    border-radius: 5px;
                    i{
                        margin-right: 5px;
                    }
                }
            }
            .tableCaseData{
                margin-top: 20px;
                .ant-table table, .ant-table-thead > tr > th{
                    text-align: center;
                }
                .editDate{
                    color: white;
                    background-color: @bgBtnColor;
                    border-radius: 5px;
                }
            }
        }
    }
</style>