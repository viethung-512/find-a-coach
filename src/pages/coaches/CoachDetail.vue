<template>
  <div>
    <section>
      <base-card>
        <h2>{{ fullName }}</h2>
        <h3>${{ rate }}</h3>
      </base-card>
    </section>

    <section>
      <base-card>
        <header>
          <h2>Interested? Reach out now!</h2>
          <base-button link :to="contactLink">Contact</base-button>
        </header>

        <router-view></router-view>
      </base-card>
    </section>

    <section>
      <base-card>
        <base-badge
          v-for="area in areas"
          :key="area"
          :title="area"
          :type="area"
        ></base-badge>
        <p>{{ description }}</p>
      </base-card>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['id'],
  data() {
    return {
      selectedCoach: null,
    };
  },
  computed: {
    ...mapGetters('coaches', {
      coaches: 'coaches',
    }),
    fullName() {
      return `${this.selectedCoach?.firstName} ${this.selectedCoach?.lastName}`;
    },
    contactLink() {
      return `${this.$route.path}/contact`;
    },
    areas() {
      return this.selectedCoach?.areas;
    },
    rate() {
      return this.selectedCoach?.hourlyRate;
    },
    description() {
      return this.selectedCoach?.description;
    },
  },
  created() {
    this.selectedCoach = this.coaches.find((c) => c.id === this.id);
  },
};
</script>
