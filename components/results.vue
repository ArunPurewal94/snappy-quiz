<template>
  <div
    class="w-full bg-white p-5 m-6 md:h-1/2 h-3/4 rounded-md shadow-xl flex flex-col items-center justify-center"
  >
    <div v-motion="getMessageAnimation" class="text-3xl font-bold mb-8">
      <span v-if="score >= 6">😊 Well done!</span>
      <span v-else>☹️ Unlucky! Try again.</span>
    </div>
    <div class="text-2xl font-bold">
      Correct answers
      {{
        questions.filter(
          (question) => question.correct_answer == question.selected_answer
        ).length
      }}/{{ questions.length }}
    </div>
    <div class="mt-10">
      <button
        class="bg-[#06549e] py-3 px-6 text-center rounded text-white"
        @click="restartQuiz"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuizStore } from "~/store/quiz";

interface Question {
  correct_answer: string;
  selected_answer: string | null;
}

const props = defineProps({
  questions: {
    type: Array as PropType<Question[]>,
    default: () => [],
  },
});

const store = useQuizStore();
const router = useRouter();

const score = computed(
  () =>
    props.questions.filter(
      (question) => question.correct_answer === question.selected_answer
    ).length
);

const getMessageAnimation = computed(() => {
  if (score.value >= 6) {
    return {
      initial: { y: 100, opacity: 0 },
      enter: { y: 0, opacity: 1 },
    };
  } else {
    return {
      initial: { y: 100, opacity: 0 },
      enter: { y: 0, opacity: 1 },
    };
  }
});

const restartQuiz = () => {
  // Reset quiz state
  store.quizCompleted = false;
  store.currentQuestionIndex = 0;
  store.quizQuestions = [];
  router.push("/");
};
</script>
