<template>
  <section>
    <base-card>
      <h2>Register as a coach now!</h2>

      <coach-form @save-data="saveData"></coach-form>
    </base-card>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import CoachForm from '../../components/coaches/CoachForm.vue';

export default {
  components: { CoachForm },
  methods: {
    ...mapActions('coaches', {
      registerCoach: 'registerCoach',
    }),
    saveData(formData) {
      this.registerCoach(formData);
      this.$router.replace('/coaches');
    },
  },
};
</script>
