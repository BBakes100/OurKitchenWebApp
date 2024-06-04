import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { fa } from 'vuetify/iconsets/fa'

const myCustomTheme = {
    dark: false,
    colors: {
      background: '#A1887F',
      surface: '#6D4C41',
      primary: '#6D4C41',
      'primary-darken-1': '#3700B3',
      secondary: '#03DAC6',
      'secondary-darken-1': '#018786',
      error: '#BBDEFB',
      info: '#FFCA28',
      success: '#4CAF50',
      warning: '#FB8C00',
    },
  }

export const vuetify = createVuetify({ 
    icons: {
        defaultSet: 'mdi', 
        aliases,
        sets: {
            mdi,
            fa
        }
    },
    theme: {
        defaultTheme: 'myCustomTheme',
         themes: {
             myCustomTheme,
           },
       },
    components, 
    directives 
})