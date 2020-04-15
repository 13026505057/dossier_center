<template>
    <div class="setFloorPage"> 
        <div class="setFloorList">
            <div class="addCaseInfo">
                <span @click="addInfo"><i class="iconfont icon-cf-c101"></i>新增</span>
            </div>
            <a-table bordered :columns="columns_location" :pagination="pagination"
                :data-source="tableData_location" class="tableCaseData" size="middle"
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
            <!-- 新增楼层 -->
            <a-modal :title="showModel.captionsTitle"
                centered v-model="showModel.modalFrom" @ok="confirmBtn" @cancel="resetSubmitInfo">
                <div v-for="(item,index) in eachDataInfoList" :key="index"
                    style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        {{ item.captionTitle }}：
                    </span>
                    <a-input :placeholder="item.placeholder" allowClear v-if="index<3"
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
                    location_id: [],
                },
                submitDataInfo: {
                    location_id: '',
                    floor_name: '',
                    floor_user_name: '',
                    floor_tel: '',
                    index: 0
                },
                eachDataInfoList: [
                    { captionTitle: '楼层名称',placeholder: '请填写楼层名称',dom:'floor_name' }, 
                    { captionTitle: '联系人',placeholder: '请填写联系联系人',dom:'floor_user_name' },
                    { captionTitle: '联系电话',placeholder: '请填写联系电话',dom:'floor_tel' },
                    { captionTitle: '选择楼宇',placeholder: '请选择楼宇',dom:'location_id' },
                ],
                columns_location: [
                    { title: '楼宇名称', dataIndex: 'name', },
                    { title: '联系人', dataIndex: 'userName', },
                    { title: '联系电话', dataIndex: 'tell', },
                    { title: '位置', dataIndex: 'location', },
                ],
                innerColumns: [
                    { title: '楼层名称', dataIndex: 'floor_name', },
                    { title: '楼层负责人', dataIndex: 'floor_user_name', },
                    { title: '楼层负责人电话', dataIndex: 'floor_tel', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_location: [],
            }
        },
        mounted() {
            this.getFloorList(this.pagination);
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
                this.getFloorList({
                    pageNum: pagination.current,
                    pageSize: pagination.pageSize
                });
            },
            //选择确认楼宇
            checkedBuild(e){
                this.submitDataInfo['location_id'] = e;
                console.log(this.submitDataInfo)
            },
            //获取楼宇列表
            async getFloorList(dataInfo){
                this.loading = true;
                const locationList = await this.$api.getLocationList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = locationList.data.list;
                const locationData = [];
                queryCaseList.forEach((item,index)=>{
                    locationData.push({
                        key: item.location_id,
                        index: index,
                        name: item.location_name,
                        userName: item.create_user_name,
                        tell: item.location_tel,
                        location: item.location_address,
                        listData: []
                    })
                })
                this.tableData_location = locationData;
                pagination.total = locationList.data.total;
                this.pagination = pagination;
                this.loading = false;

                const operatortList = await this.$api.getBuildAllData();
                const operatortData = [];
                operatortList.data.forEach(item=>{
                    operatortData.push({
                        key: item.location_id,
                        name: item.location_name,
                    })
                })
                this.showModel.location_id = operatortData;
            },
            // 移除楼宇
            async deleteItem(e){
                console.log(e)
                const returnData = await this.$api.deleteFloorData({ floor_id: e.floor_id });
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
            // 修改楼宇信息
            async editItem(e){
                this.submitDataInfo.floor_id = e.floor_id;
                this.showModel.captionsTitle = '修改楼层信息';
                this.showModel.confirmType = false;
                const typeData = ['location_id','floor_name','floor_user_name','floor_tel'];
                const typeData_location = ['location_id','floor_name','floor_user_name','floor_tel'];
                typeData.forEach((item,index)=>{
                   this.submitDataInfo[typeData[index]] = e[typeData_location[index]];
                })
                this.showModel.modalFrom = true;
            },
            //确认提交修改
            comfirmEditItem(){
                console.log(this.submitDataInfo);
                this.$api.editFloorData(this.submitDataInfo).then(()=>{
                    this.showModel.modalFrom = false;
                    console.log(this.showModel.subDom)
                    this.getFloorDataInfo(this.showModel.subDom);
                    setTimeout(()=>{
                        this.resetSubmitInfo();
                    },500)
                })
            },
            //重置表单
            resetSubmitInfo(){
                this.submitDataInfo['floor_id'] = '';
                this.submitDataInfo['location_id'] = '';
                this.submitDataInfo['floor_name'] = '';
                this.submitDataInfo['floor_user_name'] = '';
                this.submitDataInfo['floor_tel'] = '';
            },
            //添加楼宇
            addInfo(){
                this.showModel.captionsTitle = '新增楼层信息';
                this.showModel.confirmType = true;
                this.showModel.modalFrom = true;
            },
            async addItem(){
                const returnData = await this.$api.addFloorData(this.submitDataInfo);
                this.showModel.modalFrom = false;
                if(returnData){
                    if(returnData.code == '0'){
                        this.$router.go(0);
                    }
                }
                
            },
            //获取楼层信息
            async getFloorDataInfo(data){
                const returnData = await this.$api.getFloorData_Page({
                    pageNum:1, pageSize:100,location_id: data.location_id
                })
                let dataInfo = [];
                returnData.data.list.forEach((location,index)=>{
                    location.key = index;
                    dataInfo.push(location)
                })
                this.tableData_location[data.index].listData = dataInfo;
            },
            //展开获取子集
            async expandedRowItem(state,data){
                if(state){
                    this.showModel.subDom = data;
                    const returnData = await this.$api.getFloorData_Page({
                        pageNum:1, pageSize:100,location_id: data.key
                    })
                    let dataInfo = [];
                    returnData.data.list.forEach((location,index)=>{
                        location.key = index;
                        dataInfo.push(location)
                    })
                    this.tableData_location[data.index].listData = dataInfo;
                }
            },
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setFloorPage{
        padding: 20px 0;
        .setFloorList{
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