import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.googleMapsApiKey,
    libraries: 'places'
  }
});

Vue.use(Vuetify, {
  theme: {
    primary: '#121212',
    accent: colors.grey.darken3,
    secondary: colors.amber.darken3,
    info: colors.teal.lighten1,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3
  }
});
