import Vuex from 'vuex';
import axios from 'axios';

// Supplying the location query for graphql
const LOCATION_QUERY = `query ($lat: Float!, $lng: Float!, $radius: Float!, $search: String, $price: Float) {
    locations(
      lat: $lat,
      lng: $lng,
      radius: $radius,
      search: $search,
      price: $price
    ) {
      id
      position {
        lat
        lng
      }
      name
      address {
        city
        street
        postCode
      }
      phone
      products {
        name
        price
      }
    }	
  }`;

// Supplying the products query for graphql
const PRODUCTS_QUERY = `{
    products
}`;

// State that is supplied to the application
const state = {
  products: [],
  position: {
    lat: 45.4356958,
    lng: -122.5305477
  },
  radius: 5,
  searchTerm: '',
  price: 10,
  activeStore: null,
  locations: []
};

/**
 * Function to create the store
 * Mutations for updating the data in the store
 * Actions for responding to changes or events from the customer
 * Dispatching at the end to get the products when firing up
 * Dispatching at the end to get the starting position for the search when firing up
 */
const createStore = () => {
  const store = new Vuex.Store({
    state,
    mutations: {
      LOCATIONS_SET(state, locations) {
        state.locations = locations;
      },
      PRODUCTS_SET(state, products) {
        state.products = products;
      },
      POSITION_SET(state, pos) {
        state.position = pos;
        state.activeStore = null;
      },
      PRICE_SET(state, price) {
        state.price = price;
        state.activeStore = null;
      },
      RADIUS_SET(state, radius) {
        state.radius = radius;
        state.activeStore = null;
      },
      SEARCH_TERM_SET(state, searchTerm) {
        state.searchTerm = searchTerm;
        state.activeStore = null;
      },
      ACTIVE_STORE_SET(state, activeStore) {
        state.activeStore = activeStore;
      }
    },
    actions: {
      POSITION_SET({ commit, dispatch }, pos) {
        commit('POSITION_SET', pos);
        return dispatch('SEARCH_RUN');
      },
      PRICE_SET({ commit, dispatch }, price) {
        commit('PRICE_SET', price);
        return dispatch('SEARCH_RUN');
      },
      RADIUS_SET({ commit, dispatch }, radius) {
        commit('RADIUS_SET', radius);
        return dispatch('SEARCH_RUN');
      },
      SEARCH_TERM_SET({ commit, dispatch }, searchTerm) {
        commit('SEARCH_TERM_SET', searchTerm);
        return dispatch('SEARCH_RUN');
      },
      PRODUCTS_GET({ commit }) {
        return axios
          .post('/graphql', {
            query: PRODUCTS_QUERY
          })
          .then(data => {
            commit('PRODUCTS_SET', data.data.data.products);
          });
      },
      SEARCH_RUN({ commit, state }) {
        return axios
          .post('/graphql', {
            query: LOCATION_QUERY,
            variables: {
              lat: state.position.lat,
              lng: state.position.lng,
              search: state.searchTerm,
              radius: state.radius,
              price: state.price
            }
          })
          .then(data => {
            commit('LOCATIONS_SET', data.data.data.locations);
          });
      }
    }
  });

  store.dispatch('PRODUCTS_GET');
  store.dispatch('SEARCH_RUN');

  return store;
};

export default createStore;
