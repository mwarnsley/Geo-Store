<template>
  <div>
    <v-img
      src="/market.png"
      aspect-ratio="1.75"
    />
    <div
      class="store-name"
    >
      {{ activeStore.name}}
    </div>
    <div
      class="store-address"
    >
      <div>{{ activeStore.address.street }}</div>
      <div>{{ activeStore.address.city }}, {{ activeStore.address.postalCode }}</div>
      <div>{{ activeStore.phone }}</div>
    </div>
    <v-data-table
      :headers="headers"
      :items="activeStore.products"
      hide-actions
      style="height: 500px; overflow-y: scroll;"
    >
      <template slot="items" slot-scope="props">
        <td v-html="highlight(props.item)"></td>
        <td class="text-xs-right">{{ props.item.price | money }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
    export default {
        name: 'StoreInfo',
        filters: {
            money: v => `$${v}`,
        },
        data: () => ({
            headers: [
            {
                text: 'Name',
                align: 'left',
                sortable: true,
                value: 'name'
            },
            {
                text: 'Price',
                align: 'left',
                sortable: true,
                value: 'name'
            },
            ],
        }),
        computed: {
            activeStore() {
            return this.$store.state.activeStore || {
                products: [],
                address: {},
            };
            },
        },
        methods: {
            highlight(product) {
            return product.name.replace(
                new RegExp(this.$store.state.searchTerm, "gi"),
                match => `<span class="highlightText">${match}</span>`
            );
            },
        },
    }
</script>

<style>
    .highlightText {
    background: yellow;
    }

    .store-name {
    font-size: x-large;
    font-weight: bold;
    margin-top: 0.5em;
    margin-left: 0.5em;
    }

    .store-address {
    font-size: small;
    text-align: right;
    margin-top: 0.5em;
    margin-right: 2.5em;
    }
</style>

