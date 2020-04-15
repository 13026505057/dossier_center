<template>
    <div class="setCameraPage"> 
        <div class="setCameraList">
            <div class="addCaseInfo">
                <span @click="addInfo"><i class="iconfont icon-cf-c101"></i>新增</span>
            </div>
            <a-table bordered :columns="columns_camera" :pagination="pagination"
                :data-source="tableData_camera" class="tableCaseData" size="middle"
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
            <a-modal :title="showModel.captionsTitle"
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
                    captionsTitle: '',
                    modalInput: false,
                    confirmType: true, //提交方式：true：新增 false：修改
                },
                submitDataInfo: {
                    camera_name: '',
                    camera_port: '',
                    camera_road: '',
                    camera_ip: '',
                    camera_username: '',
                    camera_password: '',
                    server_ip: '',
                    server_domain: '',
                    address_name: ''
                },
                eachDataInfoList: [
                    { captionTitle: '名称',placeholder: '请输入摄像头名称',dom:'camera_name' },
                    { captionTitle: '端口号',placeholder: '请输入端口号',dom:'camera_port' },
                    { captionTitle: '通道号',placeholder: '请输入通道号',dom:'camera_road' },
                    { captionTitle: 'IP',placeholder: '请输入IP地址',dom:'camera_ip' },
                    { captionTitle: '截取地址IP',placeholder: '请输入截取地址IP',dom:'server_ip' },
                    { captionTitle: '访问地址',placeholder: '请输入访问地址',dom:'server_domain' },
                    { captionTitle: '防区名',placeholder: '请输入防区名',dom:'address_name' },
                    { captionTitle: '用户名',placeholder: '请输入用户名',dom:'camera_username' },
                    { captionTitle: '密码',placeholder: '请输入密码',dom:'camera_password' },
                ],
                columns_camera: [
                    { title: '名称', dataIndex: 'name', },
                    { title: '端口', dataIndex: 'port', },
                    { title: 'IP', dataIndex: 'ipInfo', },
                    { title: '截取地址IP', dataIndex: 'get_address', },
                    { title: '访问地址', dataIndex: 'visit_address', },
                    { title: '防区名', dataIndex: 'sector_name', },
                    { title: '用户名', dataIndex: 'user_name', },
                    { title: '密码', dataIndex: 'passWord', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_camera: [],
            }
        },
        mounted() {
            this.getCameraList(this.pagination);
        },
        methods: {
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getCameraList({
                    pageNum: pagination.current,
                    pageSize: pagination.pageSize
                });
            },
            //获取摄像头列表
            async getCameraList(dataInfo){
                this.loading = true;
                const CameraList = await this.$api.getCameraList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = CameraList.data.list;
                const CameraData = [];
                queryCaseList.forEach(item=>{
                    CameraData.push({
                        key: item.camera_id,
                        port: item.camera_port,
                        name: item.camera_name,
                        road: item.camera_road,
                        ipInfo: item.camera_ip,
                        get_address: item.server_ip,
                        visit_address: item.server_domain,
                        sector_name: item.address_name,
                        user_name: item.camera_username,
                        passWord: item.camera_password,
                    })
                })
                this.tableData_camera = CameraData;
                pagination.total = CameraList.data.total;
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
                        this.getCameraList(this.pagination,true);
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
            // 修改摄像头
            async editItem(e){
                this.showModel.captionsTitle = '修改摄像头';
                this.showModel.confirmType = false;
                const typeData = ['camera_id','camera_name','camera_port','camera_road','camera_ip','camera_username','camera_password',
                    'server_ip','server_domain','address_name'];
                const typeData_camera = ['key','name','port','road','ipInfo','user_name','passWord','get_address','visit_address','sector_name'];
                typeData.forEach((item,index)=>{
                   this.submitDataInfo[typeData[index]] = e[typeData_camera[index]];
                })
                this.showModel.modalInput = true;
            },
            //确认提交修改
            comfirmEditItem(){
                console.log(this.submitDataInfo);
                this.$api.editCameraData(this.submitDataInfo).then(()=>{
                    this.showModel.modalInput = false;
                    this.getCameraList(this.pagination);
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
                this.showModel.captionsTitle = '新增摄像头';
                this.showModel.confirmType = true;
                this.showModel.modalInput = true;
            },
            async addItem(){
                const returnData = await this.$api.addCameraData(this.submitDataInfo);
                this.showModel.modalInput = false;
                this.resetSubmitInfo();
                if(returnData){
                    if(returnData.code == '0'){
                        this.getCameraList(this.pagination);
                    }
                }
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setCameraPage{
        padding: 20px 0;
        .setCameraList{
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