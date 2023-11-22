<template>
  <div
    class="w-full bg-white p-5 m-6 h-auto rounded-md shadow-xl flex flex-col items-center justify-evenly transition-all duration-500"
  >
    <h3 class="text-lg font-bold mb-3">
      Question {{ store.currentQuestionIndex + 1 }} of
      {{ store.totalQuestions }}
    </h3>
    <h3
      class="text-lg font-semibold animate-bounce"
      :class="{ 'text-red-500': store.timeRemaining <= 10 }"
    >
      Time Remaining: {{ store.timeRemaining }}
    </h3>
    <h3
      class="mb-3 animate-pulse text-lg text-red-600"
      v-if="store.timeRemaining === 0"
    >
      Timeout! Go to next question!
    </h3>
    <h3 class="mb-3 capitalize font-bold">
      Difficulty: {{ store.difficulty }}
    </h3>
    <h3 class="text-xl mb-5 text-center">
      {{ he.decode(store.currentQuestion.question) }}
    </h3>
    <div class="flex flex-col gap-2 w-full">
      <button
        @click="
          () => {
            $emit('onAnswerSelected', answer);
            if (answer === store.currentQuestion.correct_answer) {
              toast.success('Correct answer!', { timeout: 1000 });
            } else {
              toast.error('Incorrect answer.', { timeout: 1000 });
            }
          }
        "
        class="mb-2 w-full py-3 bg-gray-100 px-10 capitalize rounded disabled:cursor-not-allowed disabled:opacity-60"
        :class="[
          {
            'bg-green-500':
              store.currentQuestion.selected_answer != null &&
              answer === store.currentQuestion.correct_answer,
          },
          {
            'bg-red-500':
              store.currentQuestion.selected_answer != null &&
              answer === store.currentQuestion.selected_answer &&
              answer !== store.currentQuestion.correct_answer &&
              store.currentQuestion.incorrectly_answered,
          },
          {
            'hover:bg-gray-300': store.currentQuestion.selected_answer === null,
          },
        ]"
        v-for="answer in store.currentQuestion.shuffled_answers"
        :key="answer"
        :disabled="
          store.timeRemaining <= 0 ||
          store.currentQuestion.selected_answer !== null
        "
      >
        {{ he.decode(answer) }}
      </button>
    </div>
    <button
      @click="$emit('onNextQuestion', store.nextQuestion)"
      v-show="store.currentQuestionIndex < store.totalQuestions"
      class="mt-4 w-full py-3 bg-[#06549e] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="
        store.timeRemaining > 0 &&
        store.currentQuestion.selected_answer === null
      "
    >
      Next Question
    </button>
  </div>
</template>

<script setup lang="ts">
import he from "he";
import { useToast } from "vue-toastification";
import { useQuizStore } from "~/store/quiz";

const store = useQuizStore();
const toast = useToast();

const props = defineProps({
  question: {
    type: Object,
    default: () => ({}),
  },
});

watch(
  () => store.currentQuestion.selected_answer,
  (newAnswer) => {
    props.question.selected_answer = newAnswer;
  }
);

watch(
  () => store.timeRemaining,
  (newTimeRemaining) => {
    if (newTimeRemaining === 0) {
      toast.error("Time has run out!", { timeout: 1000 });
    }
  }
);
</script>
