import common from './common'

const golbalMethods = {};
golbalMethods.install = (Vue)=>{
    const vue = Vue;
    const commonClass = vue.extend(common);
    const instance = new commonClass();
    instance.$mount(document.createElement('div'));
    document.body.appendChild(instance.$el);

    const methods = {
        alertMessage:instance.alertMessage
    }
    vue.prototype.$message = methods
}
export default golbalMethods;