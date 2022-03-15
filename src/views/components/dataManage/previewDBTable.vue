<template>
    <main class="content">
        <v-navigation-drawer permanent>
            <template #prepend>数据表</template>
        </v-navigation-drawer>
        <div>
            <v-btn>执行SQL</v-btn>
            <v-textarea solo name="input-7-4" label="Solo textarea"></v-textarea>
            <code>const a = "而是段文件"</code>
        </div>
    </main>
</template>

<script>

export default {
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
.content {
    height: 100vh;
    display: flex;
}
</style>