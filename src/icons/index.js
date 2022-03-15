import Vue from 'vue'
import SvgIcon from '@/views/components/svgComp/SvgIcon' // 导入 svg 组件

Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
