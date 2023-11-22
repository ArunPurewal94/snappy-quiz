<template>
  <div class="w-full h-screen bg-[#06549e] flex items-center justify-center">
    <div class="text-center" v-if="store.isLoading">Loading...</div>
    <div
      class="w-full md:w-2/3 bg-white p-5 m-6 h-auto rounded-md shadow-xl flex flex-col items-center justify-evenly transition-all duration-500 space-y-5"
      v-else-if="store.quizQuestions.length === 0"
    >
      <h1 class="text-2xl m-5 font-bold">Welcome to Snappy Quiz</h1>
      <label class="font-bold" for="difficulty">Select Difficulty</label>
      <select
        class="w-full px-3 py-2 rounded border"
        id="difficulty"
        v-model="store.difficulty"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button
        class="py-3 px-6 bg-[#06549e] text-white rounded hover:opacity-80"
        @click="store.fetchQuestions"
      >
        Start Quiz
      </button>
    </div>
    <Question
      v-if="
        store.currentQuestionIndex < store.quizQuestions.length &&
        !store.quizCompleted
      "
      @on-answer-selected="store.selectAnswer"
      @on-next-question="store.nextQuestion"
      :question="store.quizQuestions[store.currentQuestionIndex]"
    />
    <Results v-if="store.quizCompleted" :questions="store.quizQuestions" />
  </div>
</template>

<script setup lang="ts">
import { useQuizStore } from "~/store/quiz";

const store = useQuizStore();
</script>
