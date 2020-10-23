<template>
    <div class="setDevicePage"> 
        <div class="setDeviceList">
            <!-- <div class="addCaseInfo">
                <span @click="addInfo"><i class="iconfont icon-cf-c101"></i>新增</span>
            </div> -->
            <a-table bordered :columns="columns_device" :pagination="pagination"
                :data-source="tableData_device" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading">
                <template slot="operation" slot-scope="record">
                    <a-button class="editDate" @click="editItem(record)" size="small">修改</a-button>
                </template>
            </a-table>
                <a-modal
                    title="修改信息"
                    :visible="visible"
                    :confirm-loading="confirmLoading"
                    @ok="handleOk"
                    @cancel="handleCancel"
                    >
                    <el-form ref="form" :model="form" label-position="left" label-width="120px" >
                        <el-form-item label="机构名称"> 
                            <el-select v-model="form.org_id" filterable placeholder="请选择">
                                <el-option     
                                v-for="item in options"
                                :key="item.org_id"
                                :label="item.org_name"
                                :value="item.org_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="类型"> 
                            <el-select v-model="form.case_type_id" filterable placeholder="请选择">
                                <el-option     
                                v-for="item in optiont"
                                :key="item.case_type_id"
                                :label="item.case_type_name"
                                :value="item.case_type_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </a-modal>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                form:{
                    org_id:'',
                    case_type_id:'',
                    cell_id:''
                },
                options:[],
                optiont:[],
                visible:false,
                pagination: {
                    pageNum: 1,
                    pageSize: 10
                },
                loading: false,
                showModel: {
                    captionsTitle: '',
                    modalInput: false,
                    confirmType: true, //提交方式：true：新增 false：修改
                    buildList: [],  //楼层结构
                },
                submitDataInfo: {
                    shale_id: '',
                    lockerName: '',
                    bindArea: [],
                    lockDetail_row: '',
                    lockDetail_col: '',
                    lockPlateIp: '',
                    bindMachine: '',
                    bindCamera: '',
                    bindType: '',
                },
                //table列表
                columns_device: [
                    { title: '柜名', dataIndex: 'lockerName', },
                    { title: '格子位置', dataIndex: 'cell_name', },
                    { title: '房间名', dataIndex: 'room_name', },
                    { title: '机构', dataIndex: 'org_name', },
                    { title: '类型', dataIndex: 'case_type_name', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_device: [],
                //提交数据信息及列表
                inputDataInfoList: [
                    { captionTitle: '暂存区',placeholder: '请输入储物柜名',dom:'lockerName' },
                    { captionTitle: '机构',placeholder: '请输入锁号范围',dom:'lockDetail' },
                    { captionTitle: '类型',placeholder: '请输入锁板IP',dom:'lockPlateIp' },
                    { captionTitle: '格',placeholder: '请输入锁板IP',dom:'lockPlateIp' },
                ],
            }
        },
        mounted() {
            this.getGuiziList(this.pagination);
            this.getTypeListData();
        },
        methods: {
            //选择
            checkedDepartment(value){
                console.log(value)
            },
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getGuiziList(this.pagination);
            },
            //获取存储设备列表
            async getGuiziList(dataInfo){
                this.loading = true;
                const deviceList = await this.$api.Guizilist(dataInfo);
                const pagination = { ...this.pagination };
                const queryCaseList = deviceList.data.list;
                const deviceData = [];
                queryCaseList.forEach(item=>{
                    deviceData.push({
                        key: item.shale_id,
                        lockerName: item.shale_name,
                        bindArea: [item.room_id,item.line_id],
                        lockPlateIp: item.shale_lock_ip,
                        lockDetail_row: item.hang,
                        lockDetail_col: item.lie,
                        cell_id:item.cell_id,
                        cell_name:item.cell_name,
                        org_name:item.org_name,
                        org_id:item.org_id,
                        case_type_id:item.case_type_id,
                        case_type_name:item.case_type_name,
                        bindType: item.shale_type,
                        bindCamera: item.camera_id,
                        bindMachine: item.imac_id,
                        room_name: item.room_name
                    })
                })
                this.tableData_device = deviceData;
                pagination.total = deviceList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            // 获取所需参数(放假/类型、一体机、摄像头、储物柜类型)
            async getTypeListData(){
                // 房间
                const returnData_room = await this.$api.getRoomListData();
                let roomData = returnData_room.data;
                // let roomSelect = {};
                roomData.forEach(item=>{
                    let areaList = [];
                    if(item.lineList != []){
                        item.lineList.forEach(item=>{
                            areaList.push({
                                name: item.line_name,
                                code: item.line_id
                            })
                        })
                    }
                    let roomSelect = {
                        name: item.room_name,
                        code: item.room_id,
                        items: areaList
                    }
                    this.selectDataInfo['bindRoom'].push({...roomSelect});
                })
                // 一体机  待更新
                const returnData_machine = await this.$api.getRoomListData();
                let machineData = returnData_machine.data;
                let machineSelect = [];
                machineData.forEach(item=>{
                    machineSelect.push({
                        key: item.room_id,
                        name: item.room_name
                    })
                })
                this.selectDataInfo['bindMachine'] = machineSelect;
                // 摄像头
                const returnData_camera = await this.$api.getCameraListData();
                let cameraData = returnData_camera.data;
                let cameraSelect = [];
                cameraData.forEach(item=>{
                    cameraSelect.push({
                        key: item.camera_id,
                        name: item.camera_name
                    })
                })
                this.selectDataInfo['bindCamera'] = cameraSelect;
                // 储物柜类型
                const returnData_type = await this.$api.getShaleTypeListData();
                let typeData = returnData_type.data;
                let typeSelect = [];
                typeData.forEach(item=>{
                    typeSelect.push({
                        key: item.shale_type_id,
                        name: item.shale_type_name
                    })
                })
                this.selectDataInfo['bindType'] = typeSelect;
            },
            // 修改物品保全室
            editItem(e){
                console.log(e)
                this.visible = true
                this.form.org_id = e.org_id
                this.form.case_type_id = e.case_type_id?Number( e.case_type_id):''  //转换数据类型 
                this.form.cell_id = e.cell_id
                let dataInfo = {   pageNum: 1, pageSize: 9999}
                this.$api.Guiziorg( dataInfo).then(res=>{
                     this.options = res.data.list
                })
                this.$api.Guizicase(dataInfo).then(res=>{
                     this.optiont = res.data.list
                })
            },
            // 取消修改
            handleCancel(){
                this.visible = false
                this.form.org_id = ''
                this.case_type_id = ''
            },
            handleOk(){
                this.$api.Guiziupdate(this.form).then(res=>{
                       if(res.code == 0){
                            this.$message.info('修改成功');
                            this.visible = false
                            this.form.org_id = ''
                            this.case_type_id = ''
                            this.getGuiziList(this.pagination);
                       }
                })
            },
            //确认提交修改
            comfirmEditItem(){
                this.$api.editShaleData({
                    shale_id: this.submitDataInfo['shale_id'],
                    shale_name: this.submitDataInfo['lockerName'],
                    room_id: this.submitDataInfo['bindArea'][0],
                    line_id: this.submitDataInfo['bindArea'][1],
                    shale_type: this.submitDataInfo['bindType'],
                    shale_lock_ip: this.submitDataInfo['lockPlateIp'],
                    imac_id: this.submitDataInfo['bindMachine'],
                    camera_id: this.submitDataInfo['bindCamera'],
                    hang: this.submitDataInfo['lockDetail_row'],
                    lie: this.submitDataInfo['lockDetail_col'],
                }).then(()=>{
                    this.showModel.modalInput = false;
                    this.getGuiziList(this.pagination);
                    setTimeout(()=>{
                        this.resetSubmitInfo();
                    },500)
                })
            },
            //重置表单
            resetSubmitInfo(){
                delete this.submitDataInfo.shale_id;
                this.submitDataInfo['lockerName'] = '';
                this.submitDataInfo['bindArea'] = [];
                this.submitDataInfo['lockDetail_row'] = '';
                this.submitDataInfo['lockDetail_col'] = '';
                this.submitDataInfo['lockPlateIp'] = '';
                this.submitDataInfo['bindMachine'] = '';
                this.submitDataInfo['bindCamera'] = '';
                this.submitDataInfo['bindType'] = '';
            },
            //新增物品保全室
            addInfo(){
                this.showModel.captionsTitle = '新增智能存储柜';
                this.showModel.confirmType = true;
                this.showModel.modalInput = true;
            },
            async addItem(){
                const returnData = await this.$api.addShaleData({
                    shale_name: this.submitDataInfo['lockerName'],
                    room_id: this.submitDataInfo['bindArea'][0],
                    line_id: this.submitDataInfo['bindArea'][1],
                    shale_type: this.submitDataInfo['bindType'],
                    shale_lock_ip: this.submitDataInfo['lockPlateIp'],
                    imac_id: this.submitDataInfo['bindMachine'],
                    camera_id: this.submitDataInfo['bindCamera'],
                    hang: this.submitDataInfo['lockDetail_row'],
                    lie: this.submitDataInfo['lockDetail_col'],
                });
                this.showModel.modalInput = false;
                this.resetSubmitInfo();
                if(returnData){
                    if(returnData.code == '0'){
                        this.getGuiziList(this.pagination);
                    }
                }
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setDevicePage{
        padding: 20px 0;
        .setDeviceList{
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