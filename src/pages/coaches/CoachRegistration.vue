<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred!" @close="clearError">
      <p>
        {{ error }}
      </p>
    </base-dialog>
    <section>
      <base-card>
        <h2>Register as a coach now!</h2>

        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <coach-form @save-data="saveData" v-else></coach-form>
      </base-card>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CoachForm from '../../components/coaches/CoachForm.vue';

export default {
  components: { CoachForm },
  data() {
    return {
      isLoading: false,
      error: null,
    };
  },
  methods: {
    ...mapActions('coaches', {
      registerCoach: 'registerCoach',
    }),
    saveData(formData) {
      this.clearError();
      this.isLoading = true;
      this.registerCoach(formData)
        .then(() => {
          this.$router.replace('/coaches');
        })
        .catch((err) => {
          this.error = err.message || 'Something went wrong';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    clearError() {
      this.error = null;
    },
  },
};
</script>
