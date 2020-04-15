<template>
    <div class="headerPage">
        <a-layout>
            <a-layout-header class="headerData">
                <div class="headerLeft">
                    <img src="../assets/images/logo.png" class="iconLogo"/>
                    <span class="title">卷宗管理系统</span>
                </div>
                <div class="headerRight">
                    <i class="icon-touxiang iconLogo iconfont"></i>
                    <a-dropdown :trigger="['click']">
                        <div class="ant-dropdown-link" @click="e => e.preventDefault()"> {{getUserInfo.userName}} <a-icon type="down" /> </div>
                        <a-menu slot="overlay">
                            <a-menu-item v-for="(item,index) in infoSettingBtn" :key="index" 
                                @click="selectDetail(item.itemIndex)">
                                <span>{{ item.title }}</span>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </div>
            </a-layout-header>
        </a-layout>
        <!-- 新增部门 -->
        <a-modal title="修改个人信息"
            centered v-model="showModel.modalUpdata" @ok="confirmBtn" @cancel="resetSubmitInfo">
            <div v-for="(item,index) in eachDataInfoList" :key="index"
                style="display:table;width: 100%;margin-bottom: 10px">
                <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                    {{ item.captionTitle }}：
                </span>
                <a-input-password :placeholder="item.placeholder" allowClear v-if="index==0"
                    v-model="submitDataInfo[item.dom]" style="display:table-cell;width: auto" />
                <a-input :placeholder="item.placeholder" allowClear v-else
                    v-model="submitDataInfo[item.dom]" style="display:table-cell;width: auto" />
            </div>
        </a-modal>
    </div>
</template>

<script>
    export default {
        data(){
            return{ 
                getUserInfo: {
                    userName: localStorage.getItem('userName')
                },
                infoSettingBtn: [
                    { title: '更改个人资料', itemIndex: 0 },
                    { title: '我的审核', itemIndex: 1  },
                    { title: '退出', itemIndex: 2  },
                ],
                showModel: {
                    modalUpdata: false,
                },
                submitDataInfo: {
                    pass_word: '',
                    user_name: ''
                },
                eachDataInfoList: [
                    { captionTitle: '更改密码',placeholder: '请输入更改后的密码',dom:'pass_word' },
                    { captionTitle: '更改用户名称',placeholder: '请输入更改后的用户名称',dom:'user_name' },
                ]
            }
        },
        methods: {
            selectDetail(itemIndex){
                console.log(itemIndex)
                const selectMap = [
                    { index: 0, fun:'updataUserInfo' },
                    { index: 1, fun:'approveList' },
                    { index: 2, fun:'logout' },
                ];
                selectMap.map((item)=>{
                    if(item.index == itemIndex){
                        this[item['fun']]();
                    }
                })
            },
            //修改个人资料信息
            updataUserInfo(){
                this.showModel.modalUpdata = true;
            },
            //退出
            logout(){
                console.log('退出')
                sessionStorage.removeItem('token');
                this.$router.push('./login');
            },
            approveList(){
                console.log('我的审批记录');
                sessionStorage.setItem('checkedItem','caseStatus');
                let wasOPen = JSON.parse(sessionStorage.getItem('openKeys'));
                wasOPen.push('tab_out');
                sessionStorage.setItem('openKeys',JSON.stringify(wasOPen));
                this.$router.push('./caseStatus');
                // this.$router.go(0);
                
            },
            //确认修改信息
            async confirmBtn(){
                const returnData = await this.$api.upUserDataInfo(this.submitDataInfo)
                if(returnData){
                    if(returnData.code == '0'){
                        localStorage.setItem('userName',returnData.data);
                        this.getUserInfo.userName = returnData.data;
                        this.showModel.modalUpdata = false;
                    }
                }
            },
            // 取消
            resetSubmitInfo(){
                this.submitDataInfo['pass_word'] = '';
                this.submitDataInfo['user_name'] = '';
            }
        },
    }
</script>

<style lang="less" scope>
    @theme: #1F62D1;
    .headerPage{
        width: 100%;
        .headerData{
            background-color: @theme;
            display: table;
            color: white;
            .headerLeft{
                text-align: left;
                letter-spacing: 2px;
                font-size: 20px;
                font-weight: 600;
                img.iconLogo{
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                }
            }
            .headerLeft, .headerRight{
                display: table-cell;
            }
            .headerRight{
                text-align: right;
                .iconLogo{
                    width: 15px;
                    margin-right: 10px;
                }
                .ant-dropdown-link{
                    display: inline-block;
                }
            }
        }
    }
</style>