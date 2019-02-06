<template>
  <v-toolbar
    dense
    floating
    style="position: absolute; top: 10px; left: 200px;"
  >
    <v-autocomplete
      v-model="searchModel"
      :items="products"
      prepend-icon="search"
      single-line
      hide-details
      placeholder="Search term"
      :search-input.sync="search"
      return-object
    />
    <v-select
      hide-details
      single-line
      v-model="radius"
      :items="distances"
      label="Distance"
      style="margin-left: 10px;"
    ></v-select>
    <v-select
      hide-details
      single-line
      v-model="price"
      :items="prices"
      label="Price"
      style="margin-left: 10px;"
    ></v-select>
  </v-toolbar>
</template>

<script>
    export default {
        name: 'Toolbar',
        data: () => ({
            searchModel: null,
            search: null,
            distances: [
            {
                text: '5 miles',
                value: 5,
            },
            {
                text: '10 miles',
                value: 10,
            },
            {
                text: '15 miles',
                value: 15,
            },
            {
                text: '20 miles',
                value: 20,
            },
            ],
            prices: [
            {
                text: '< $3',
                value: 3,
            },
            {
                text: '< $5',
                value: 5,
            },
            {
                text: '< $10',
                value: 10,
            },
            ],
        }),
        computed: {
            products() {
            return this.$store.state.products;
            },
            radius: {
            get() {
                return this.$store.state.radius;
            },
            set(val) {
                this.$store.dispatch('RADIUS_SET', val);
            }
            },
            price: {
            get() {
                return this.$store.state.price;
            },
            set(val) {
                this.$store.dispatch('PRICE_SET', val);
            }
            },
        },
        watch: {
            search(val) {
            this.$store.dispatch('SEARCH_TERM_SET', val);
            },
            
        },
    }
</script>
