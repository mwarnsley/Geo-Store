<template>
  <GmapMap
    ref="mapRef"
    :center="position"
    :zoom="11"
    map-type-id="roadmap"
    style="width: 100%; height: 100vh"
  >
    <GmapMarker
      v-for="m in markers"
      v-bind:key="m.id"
      :position="m.position"
      :clickable="true"
      @click="showStore(m)"
    />
  </GmapMap>  
</template>

<script>
  export default {
    name: 'Map',
    computed: {
      markers() {
        return this.$store.state.locations;
      },
      position() {
        return this.$store.state.position;
      },
    },
    watch: {
      position() {
        this.$refs.mapRef.$mapPromise.then((map) => {
          map.panTo(this.position);
          map.setZoom(11);
        });
      },
    },
    mounted() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.$store.dispatch('POSITION_SET', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    },
    methods: {
      showStore(store) {
        this.$store.commit('ACTIVE_STORE_SET', store);
        this.$emit('click', store);
      },
    },
  }
</script>