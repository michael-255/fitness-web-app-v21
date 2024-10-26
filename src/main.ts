import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import { createPinia } from 'pinia'
import { Dialog, Loading, Meta, Notify, Quasar } from 'quasar'
import quasarIconSet from 'quasar/icon-set/material-symbols-rounded'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// A few examples for animations from Animate.css:
// import @quasar/extras/animate/fadeIn.css
// import @quasar/extras/animate/fadeOut.css
import { symRoundedClose } from '@quasar/extras/material-symbols-rounded'
import 'quasar/dist/quasar.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
    iconSet: quasarIconSet,
    plugins: {
        Meta,
        Dialog,
        Notify,
        Loading,
    },
    config: {
        dark: true,
        brand: {
            primary: '#1976d2', // blue-8 (Primary Brand Color)
            secondary: '#607d8b', // blue-grey (LOG)
            accent: '#673ab7', // deep-purple-6 (DEBUG)
            info: '#0d47a1', // blue-10 (INFO)
            warning: '#ff6f00', // amber-10 (WARN)
            negative: '#C10015', // negative (ERROR)
            positive: '#4caf50', // positive (SUCCESS)
            dark: '#1d1d1d',
            'dark-page': '#121212',
        },
        notify: {
            textColor: 'white',
            position: 'top',
            multiLine: false,
            iconSize: '2rem',
            progress: true,
            actions: [
                {
                    icon: symRoundedClose,
                    round: true,
                    color: 'white',
                },
            ],
        },
        loading: {}, // default set of options for Loading Quasar plugin
        // loadingBar: { ... }, // settings for LoadingBar Quasar plugin
        // ..and many more (check Installation card on each Quasar component/directive/plugin)
    },
})

app.mount('#app')
