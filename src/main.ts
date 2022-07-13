import { createApp } from "vue";
import { createPinia } from "pinia";
import { createAuth0 } from '@auth0/auth0-vue';
import App from "./App.vue";
import { createRouter } from "./router";
import PrimeVue from "primevue/config";

import Menu from 'primevue/menu';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const app = createApp(App);

const auth0 = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    cacheLocation: import.meta.env.VITE_AUTH0_CACHELOCATION
})

app.use(createPinia());
app.use(auth0);
app.use(createRouter(app));
app.use(PrimeVue);

app.component('Menu', Menu)
app.component('DataTable', DataTable)
app.component('Column', Column)

app.mount("#app");
