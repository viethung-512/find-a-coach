<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred!" @close="clearError">
      <p>
        {{ error }}
      </p>
    </base-dialog>
    <section>
      <coach-filter @change-filter="setFilters"></coach-filter>
    </section>

    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="loadCoaches(true)"
            >Refresh</base-button
          >
          <base-button
            link
            to="/auth?redirect=register"
            v-if="!isAuthenticated"
          >
            Login to Register as Coach
          </base-button>
          <base-button
            link
            to="/register"
            v-if="!isCoach && !isLoading && isAuthenticated"
            >Register as Coach</base-button
          >
        </div>

        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>

        <ul v-else-if="hasCoaches && !isLoading">
          <coach-item
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :firstName="coach.firstName"
            :lastName="coach.lastName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          ></coach-item>
        </ul>
        <h3 v-else>No coaches found.</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';

export default {
  components: {
    CoachItem,
    CoachFilter,
  },
  data() {
    return {
      activeFilters: {
        frontend: true,
        backend: true,
        career: true,
      },
      error: null,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters('coaches', {
      coaches: 'coaches',
      hasCoaches: 'hasCoaches',
      isCoach: 'isCoach',
    }),
    ...mapGetters(['isAuthenticated']),
    filteredCoaches() {
      return this.coaches.filter((c) => {
        if (
          (this.activeFilters.frontend && c.areas.includes('frontend')) ||
          (this.activeFilters.backend && c.areas.includes('backend')) ||
          (this.activeFilters.career && c.areas.includes('career'))
        ) {
          return true;
        }

        return false;
      });
    },
  },
  methods: {
    ...mapActions('coaches', {
      fetchCoachesAsync: 'loadCoaches',
    }),
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    loadCoaches(refresh = false) {
      this.clearError();
      this.isLoading = true;
      this.fetchCoachesAsync({ forceRefresh: refresh })
        .then()
        .catch((err) => {
          this.error = err.message || 'Something went wrong!';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    clearError() {
      this.error = null;
    },
  },
  created() {
    this.loadCoaches();
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
