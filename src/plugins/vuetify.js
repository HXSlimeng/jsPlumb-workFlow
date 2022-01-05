import Vue from 'vue';
import Vuetify, { VApp,VCard,VBtn,VDialog,VList,VListItem,VSelect,VForm } from 'vuetify/lib';

Vue.use(Vuetify, {
    components:{ VApp,VCard,VBtn,VDialog,VList,VListItem,VSelect,VForm }
});
const opts = {}

export default new Vuetify(opts);
