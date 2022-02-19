<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred!" @close="clearError">
      <p>
        {{ error }}
      </p>
    </base-dialog>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <form @submit.prevent="submitForm" v-else>
      <div class="form-control">
        <label for="email">Your Email</label>
        <input type="email" name="email" id="email" v-model.trim="email" />
      </div>
      <div class="form-control">
        <label for="message">Message</label>
        <textarea
          type="text"
          name="message"
          id="message"
          rows="5"
          v-model.trim="message"
        ></textarea>
      </div>

      <p class="errors" v-if="!formIsValid">
        Please enter a valid email and no-empty message.
      </p>

      <div class="actions">
        <base-button>Send Message</base-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['id'],
  data() {
    return {
      email: '',
      message: '',
      formIsValid: true,
      isLoading: false,
      error: null,
    };
  },
  methods: {
    ...mapActions('requests', {
      addRequestAsync: 'addRequest',
    }),
    validateForm() {
      this.formIsValid = true;
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.message === ''
      ) {
        this.formIsValid = false;
      }
    },
    submitForm() {
      this.validateForm();
      if (!this.formIsValid) {
        return;
      }

      this.clearError();
      this.isLoading = true;

      this.addRequestAsync({
        email: this.email,
        message: this.message,
        coachId: this.id,
      })
        .then(() => {
          this.$router.replace(`/coaches`);
        })
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
};
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>
