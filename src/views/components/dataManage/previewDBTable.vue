<template>
    <main class="content">
        <v-navigation-drawer permanent>
            <template #prepend>
                <div class="titleComp py-3">数据表</div>
            </template>
            <v-divider></v-divider>
            <v-text-field
                class="rounded-0"
                elevation="0"
                solo
                dense
                hide-details
                placeholder="请输入"
                append-icon="mdi-magnify"
                @click:append="search"
            ></v-text-field>
            <v-list dense>
                <div>数据名</div>
                <v-list-item-group v-model="selectedDataTable" color="primary">
                    <v-list-item v-for="item in dataTable" :key="item.text">
                        <v-list-item-content>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
        <div class="px-5 pt-3 dataMain">
            <div class="mb-3 d-flex justify-space-between">
                <v-btn>执行SQL</v-btn>
                <v-btn color="primary" outlined class="absolute" @click="$router.go(-1)">返回</v-btn>
            </div>
            <v-textarea solo name="input-7-4" label="请输入SQL语句"></v-textarea>
        </div>
    </main>
</template>

<script>

export default {
    data() {
        return {
            selectedDataTable: 1,
            dataTable: [
                {
                    text: '表1'
                },
                {
                    text: '表2'
                },
                {
                    text: '表3'
                },
                {
                    text: '表4'
                },
            ],
            searchVal: ''
        }
    },
    methods: {
        search() {

        }
    }
}
</script>

<style lang="less" scoped>
.content {
    height: 100vh;
    display: flex;
}
.dataMain {
    width: 100%;
}
</style>