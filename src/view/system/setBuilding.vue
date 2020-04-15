<template>
    <div class="setBuildPage"> 
        <div class="setBuildList">
            <div class="addCaseInfo">
                <span @click="addInfo"><i class="iconfont icon-cf-c101"></i>新增</span>
            </div>
            <a-table bordered :columns="columns_location" :pagination="pagination"
                :data-source="tableData_location" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading">
                <template slot="operation" slot-scope="record">
                    <a-button class="editDate" @click="editItem(record)" size="small">修改</a-button>
                    <a-popconfirm title="确定移除?"
                        @confirm="deleteItem(record)" okText="确认" cancelText="取消">
                        <a-button class="editDate" size="small">移除</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
            <!-- 新增楼宇 -->
            <a-modal :title="showModel.captionsTitle"
                centered v-model="showModel.modalFrom" @ok="confirmBtn" @cancel="resetSubmitInfo">
                <div v-for="(item,index) in eachDataInfoList" :key="index"
                    style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        {{ item.captionTitle }}：
                    </span>
                    <a-input :placeholder="item.placeholder" allowClear 
                        v-model="submitDataInfo[item.dom]" style="display:table-cell;width: auto" />
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
                    captionsTitle: '',
                    modalFrom: false,
                    confirmType: true, //提交方式：true：新增 false：修改
                },
                submitDataInfo: {
                    location_name: '',
                    location_tel: '',
                    location_address: '',
                    location_user_name: ''
                },
                eachDataInfoList: [
                    { captionTitle: '楼宇名称',placeholder: '请填写楼宇名称',dom:'location_name' },
                    { captionTitle: '联系人',placeholder: '请填写联系联系人',dom:'location_user_name' },
                    { captionTitle: '联系电话',placeholder: '请填写联系电话',dom:'location_tel' },
                    { captionTitle: '位置',placeholder: '请填写位置',dom:'location_address' },
                ],
                columns_location: [
                    { title: '楼宇名称', dataIndex: 'name', },
                    { title: '联系人', dataIndex: 'userName', },
                    { title: '联系电话', dataIndex: 'tell', },
                    { title: '位置', dataIndex: 'location', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_location: [],
            }
        },
        mounted() {
            this.getLocationList(this.pagination);
        },
        methods: {
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getLocationList({
                    pageNum: pagination.current,
                    pageSize: pagination.pageSize
                });
            },
            //获取楼宇列表
            async getLocationList(dataInfo){
                this.loading = true;
                const locationList = await this.$api.getLocationList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = locationList.data.list;
                const locationData = [];
                queryCaseList.forEach(item=>{
                    locationData.push({
                        key: item.location_id,
                        name: item.location_name,
                        userName: item.location_user_name,
                        tell: item.location_tel,
                        location: item.location_address,
                    })
                })
                this.tableData_location = locationData;
                pagination.total = locationList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            // 移除楼宇
            async deleteItem(e){
                const returnData = await this.$api.deleteLocationData({ location_id: e.key });
                if(returnData){
                    if(returnData.code == '0'){
                        if(((this.pagination.total-1)%(this.pagination.pageSize))==0){
                            this.pagination.pageNum-=1;
                            this.pagination.current-=1;
                        }
                        this.getLocationList(this.pagination);
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
                this.showModel.captionsTitle = '修改楼宇信息';
                this.showModel.confirmType = false;
                const typeData = ['location_id','location_name','location_tel','location_address','location_user_name'];
                const typeData_location = ['key','name','tell','location','userName'];
                typeData.forEach((item,index)=>{
                   this.submitDataInfo[typeData[index]] = e[typeData_location[index]];
                })
                this.showModel.modalFrom = true;
            },
            //确认提交修改
            comfirmEditItem(){
                console.log(this.submitDataInfo);
                this.$api.editLocationData(this.submitDataInfo).then(()=>{
                    this.showModel.modalFrom = false;
                    this.getLocationList(this.pagination);
                    setTimeout(()=>{
                        this.resetSubmitInfo();
                    },500)
                })
            },
            //重置表单
            resetSubmitInfo(){
                delete this.submitDataInfo.location_id;
                this.submitDataInfo['location_name'] = '';
                this.submitDataInfo['location_tel'] = '';
                this.submitDataInfo['location_address'] = '';
                this.submitDataInfo['location_user_name'] = '';
            },
            //添加楼宇
            addInfo(){
                this.showModel.captionsTitle = '新增楼宇信息';
                this.showModel.confirmType = true;
                this.showModel.modalFrom = true;
            },
            async addItem(){
                const returnData = await this.$api.addLocationData(this.submitDataInfo);
                this.showModel.modalFrom = false;
                this.resetSubmitInfo();
                if(returnData){
                    if(returnData.code == '0'){
                        this.getLocationList(this.pagination);
                    }
                }
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setBuildPage{
        padding: 20px 0;
        .setBuildList{
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