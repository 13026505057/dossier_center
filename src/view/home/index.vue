<template>
    <div class="homeIndex">
        <headerTop></headerTop>
        <div class="tabListInfo">
            <tabListInfo></tabListInfo>
            <router-view  class="routerShowData"/>
        </div>
    </div>
</template>

<script>
    import headerTop from '../../components/header'
    import tabListInfo from '../../components/tabList'

    export default {
        name: 'homeIndex',
        components:{
            headerTop,tabListInfo
        },
        data(){
            return{

            }
        },
        methods: {
            
        },
        mounted() {
            
        },
    }
</script>

<style lang="less" scope>
    @bgPages: #EAECF2;
    .homeIndex{
        .tabListInfo{
            display: flex;
            height: calc(100vh - 66px);
            .tabListPage, .routerShowData{
                overflow-x: hidden;
                &::-webkit-scrollbar{
                    width: 2px;
                    height: 2px;
                }
                &::-webkit-scrollbar-thumb{
                    border-radius: 5px;
                    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,.2);
                    background-color: rgba(0,0,0,.2);
                }
                &::-webkit-scrollbar-track{
                    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,.2);
                    background-color: rgba(0,0,0,.1);
                    border-radius: 0;
                }
            }
            .tabListPage{
                border-right: 1px solid #eee;
            }
            .routerShowData{
                height: calc(100vh - 66px);
                width: calc(100vw - 180px);
                padding: 20px;
                background-color: @bgPages;
            }
        }
    }
</style>