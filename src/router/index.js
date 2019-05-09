import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Version from '@/components/Version/Version'
import login from '@/components/login/login'
import nursemain from '@/components/nursemain/nursemain'
import usermsg from '@/components/usermsg/usermsg'
import patientmsg from '@/components/patientmsg/patientmsg'
import relativemain from '@/components/relativemain/relativemain'
import relativepmsg from '@/components/relativepmsg/relativepmsg'
import password from '@/components/password/password'
import forgetpsw from '@/components/forgetpsw/forgetpsw'
import registe from '@/components/registe/registe'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Version',
      component: Version
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/nursemain',
      name: 'nursemain',
      component: nursemain
    },
    {
      path: '/usermsg',
      name: 'usermsg',
      component: usermsg
    },{
      path: '/patientmsg',
      name: 'patientmsg',
      component: patientmsg
    },
    {
      path: '/relativemain',
      name: 'relativemain',
      component: relativemain
    },
    {
      path: '/relativepmsg',
      name: 'relativepmsg',
      component: relativepmsg
    },
    {
      path: '/password',
      name: 'password',
      component: password
    },
    {
      path: '/forgetpsw',
      name: 'forgetpsw',
      component: forgetpsw
    },
    {
      path: '/registe',
      name: 'registe',
      component: registe
    },
  ]
})
