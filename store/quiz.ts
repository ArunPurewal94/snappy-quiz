import axios from "axios";
import { defineStore } from "pinia";

interface QuizQuestion {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  selected_answer: string | null;
  incorrectly_answered?: boolean;
  shuffled_answers: string[];
}

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    quizQuestions: [] as QuizQuestion[],
    currentQuestionIndex: 0,
    score: 0,
    name: "",
    loading: false,
    timeRemaining: 20,
    intervalId: null as number | null,
    difficulty: "easy",
    quizCompleted: false,
  }),
  getters: {
    currentQuestion(state): QuizQuestion {
      return state.quizQuestions[state.currentQuestionIndex];
    },
    totalQuestions(state) {
      return state.quizQuestions.length;
    },
    isLoading(state) {
      return state.loading;
    },
  },
  actions: {
    async fetchQuestions() {
      this.loading = true; // Set loading to true while fetching
      try {
        const response = await axios.get(
          `https://opentdb.com/api.php?amount=10&difficulty=${this.difficulty}`
        );
        if (response.data && response.data.results) {
          this.quizQuestions = response.data.results.map((question: any) => {
            const allAnswers = [
              ...question.incorrect_answers,
              question.correct_answer.toString(),
            ];
            const shuffledAnswers = this.shuffleArray(allAnswers);
            return {
              ...question,
              correct_answer: question.correct_answer.toString(),
              selected_answer: null,
              shuffled_answers: shuffledAnswers,
            };
          });
        }
        this.startTimer();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false; // Reset loading after fetching
      }
    },

    shuffleArray<T>(array: T[]): T[] {
      const shuffledArray = [...array];
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[randomIndex]] = [
          shuffledArray[randomIndex],
          shuffledArray[i],
        ];
      }
      return shuffledArray;
    },

    selectAnswer(answer: string | null) {
      const currentQuestion = this.quizQuestions[this.currentQuestionIndex];
      currentQuestion.selected_answer = answer;

      if (answer !== currentQuestion.correct_answer) {
        currentQuestion.incorrectly_answered = true;
      }

      if (this.intervalId !== null) {
        window.clearInterval(this.intervalId);
      }

      if (this.currentQuestionIndex === this.totalQuestions - 1) {
        this.quizCompleted = true;
      }
    },
    nextQuestion() {
      if (
        this.currentQuestionIndex < this.quizQuestions.length - 1 ||
        this.timeRemaining <= 0
      ) {
        this.currentQuestionIndex++;
        this.startTimer();
      }
    },
    checkAnswer() {
      if (
        this.quizQuestions[this.currentQuestionIndex].selected_answer ===
        this.currentQuestion.correct_answer
      ) {
        this.score++;
      } else {
        this.selectAnswer(null);
      }
      this.quizQuestions[this.currentQuestionIndex].selected_answer = null;
    },
    changeDifficulty(difficulty: string) {
      this.difficulty = difficulty;
      this.fetchQuestions();
    },
    startTimer() {
      this.timeRemaining = 20;
      if (this.intervalId !== null) {
        window.clearInterval(this.intervalId);
      }
      this.intervalId = window.setInterval(() => {
        if (
          this.timeRemaining > 0 &&
          this.quizQuestions[this.currentQuestionIndex].selected_answer === null
        ) {
          this.timeRemaining--;
        } else {
          if (this.intervalId !== null) {
            window.clearInterval(this.intervalId);
          }
          this.selectAnswer(null);
          this.timeRemaining = 0;
        }
      }, 1000);
    },
  },
});
