<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred!" @close="clearError">
      <p>
        {{ error }}
      </p>
    </base-dialog>
    <section>
      <base-card>
        <header>
          <h2>Requests Received</h2>
        </header>

        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>

        <ul v-else-if="hasRequests && !isLoading">
          <request-item
            v-for="request in receivedRequests"
            :key="request.id"
            :message="request.message"
            :email="request.userEmail"
          ></request-item>
        </ul>

        <h3 v-else>You haven't received any requests yet!</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import RequestItem from '../../components/requests/RequestItem.vue';

export default {
  components: {
    RequestItem,
  },
  data() {
    return {
      isLoading: false,
      error: null,
    };
  },
  computed: {
    ...mapGetters('requests', {
      receivedRequests: 'requests',
      hasRequests: 'hasRequests',
    }),
  },
  methods: {
    ...mapActions('requests', {
      loadRequestsAsync: 'loadRequests',
    }),
    clearError() {
      this.error = null;
    },
    loadRequests() {
      this.clearError();
      this.isLoading = true;
      this.loadRequestsAsync()
        .then()
        .catch((err) => {
          this.error = err.message || 'Something went wrong!';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    this.loadRequests();
  },
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
