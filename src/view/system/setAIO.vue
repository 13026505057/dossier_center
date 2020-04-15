<template>
    <div class="setAIOPage"> 
        <div class="setAIOList">
            <div class="addCaseInfo">
                <span @click="addInfo"><i class="iconfont icon-cf-c101"></i>新增</span>
            </div>
            <a-table bordered :columns="columns_setAIO" :pagination="pagination"
                :data-source="tableData_setAIO" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading">
                <template slot="operation" slot-scope="record">
                    <a-button class="editDate" @click="editItem(record)" size="small">修改</a-button>
                    <a-popconfirm title="确定移除?"
                        @confirm="deleteItem(record)" okText="确认" cancelText="取消">
                        <a-button class="editDate" size="small">移除</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
            <!-- 新增部门 -->
            <a-modal title="新增部门"
                centered v-model="showModel.modalInput" @ok="confirmBtn" @cancel="resetSubmitInfo">
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
                    modalInput: false,
                    confirmType: true, //提交方式：true：新增 false：修改
                },
                submitDataInfo: {
                    camera_name: '',
                },
                eachDataInfoList: [
                    { captionTitle: '名称',placeholder: '请输入摄像头名称',dom:'camera_name' },
                ],
                columns_setAIO: [
                    { title: '一体机名称', dataIndex: 'name', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_setAIO: [],
            }
        },
        mounted() {
            this.getSetAIOList(this.pagination);
        },
        methods: {
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getSetAIOList({
                    pageNum: pagination.current,
                    pageSize: pagination.pageSize
                });
            },
            //获取摄像头列表
            async getSetAIOList(dataInfo){
                this.loading = true;
                const setAIOList = await this.$api.getCameraList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = setAIOList.data.list;
                const setAIOData = [];
                queryCaseList.forEach(item=>{
                    setAIOData.push({
                        key: item.camera_id,
                        port: item.camera_port,
                        name: item.camera_name,
                        ipInfo: item.camera_ip,
                        get_address: item.server_ip,
                        visit_address: item.server_domain,
                        sector_name: item.address_name,
                        user_name: item.camera_username,
                        passWord: item.camera_password,
                    })
                })
                this.tableData_setAIO = setAIOData;
                pagination.total = setAIOList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            // 移除摄像头
            async deleteItem(e){
                const returnData = await this.$api.deleteCameraData({ camera_id: e.key });
                if(returnData){
                    if(returnData.code == '0'){
                        if(((this.pagination.total-1)%(this.pagination.pageSize))==0){
                            this.pagination.pageNum-=1;
                            this.pagination.current-=1;
                        }
                        this.getSetAIOList(this.pagination);
                    }
                }
                
            },
            //确定按钮
            confirmBtn(){
                if(this.showModel.confirmType){
                    this.addItem();
                }else{
                    this.comfirmEditItem();
                }
            },
            // 修改摄像头
            async editItem(e){
                this.showModel.confirmType = false;
                const dataInfo = {
                    pageNum: this.pagination['pageNum'],
                    pageSize: this.pagination['pageSize'],
                    camera_id: e.key
                }
                const cameraList = await this.$api.getCameraList_Page(dataInfo);
                const typeData = ['camera_id','camera_name','camera_port','camera_road','camera_ip','camera_username','camera_password',
                    'server_ip','server_domain','address_name'];
                typeData.forEach(item=>{
                   this.submitDataInfo[item] = cameraList.data.list[0][item];
                })
                this.showModel.modalInput = true;
            },
            //确认提交修改
            comfirmEditItem(){
                console.log(this.submitDataInfo);
                this.$api.editCameraData(this.submitDataInfo).then(()=>{
                    this.showModel.modalInput = false;
                    this.getSetAIOList(this.pagination);
                    setTimeout(()=>{
                        this.resetSubmitInfo();
                    },500)
                })
            },
            //重置表单
            resetSubmitInfo(){
                delete this.submitDataInfo.camera_id;
                this.submitDataInfo['camera_name'] = '';
                this.submitDataInfo['camera_port'] = '';
                this.submitDataInfo['camera_road'] = '';
                this.submitDataInfo['camera_ip'] = '';
                this.submitDataInfo['camera_username'] = '';
                this.submitDataInfo['camera_password'] = '';
                this.submitDataInfo['server_ip'] = '';
                this.submitDataInfo['server_domain'] = '';
                this.submitDataInfo['address_name'] = '';
            },
            //添加摄像头
            addInfo(){
                this.showModel.confirmType = true;
                this.showModel.modalInput = true;
            },
            async addItem(){
                const returnData = await this.$api.addSetAIOData(this.submitDataInfo);
                this.showModel.modalInput = false;
                this.resetSubmitInfo();
                if(returnData){
                    if(returnData.code == '0'){
                        this.getSetAIOList(this.pagination);
                    }
                }
                
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setAIOPage{
        padding: 20px 0;
        .setAIOList{
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