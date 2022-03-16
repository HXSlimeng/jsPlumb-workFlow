import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vuetify, { VApp, VCard, VBtn, VDialog, VList, VListItem, VSelect, VForm } from 'vuetify/lib'

Vue.use(Vuetify, {
  // components:{ VApp,VCard,VBtn,VDialog,VList,VListItem,VSelect,VForm },
  icons: {
    iconfont: 'mdi' // 默认值 - 仅用于展示目的
  }
})
const opts = {
  theme: {
    themes: {
      light: {
        primary: '#009D89'
      },
      dark: {
        primary: '#009D89'
      }
    }
  }
}

export default new Vuetify(opts)
