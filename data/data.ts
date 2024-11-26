import { OnboardingData, SkinType, SkinGoal } from "../types";

const data: OnboardingData[] = [
  {
    id: 1,
    question: "What's your first name?",
    type: "text",
    textColor: "#005b4f",
    backgroundColor: "#FCFBF4",
    key: "name",
    placeholder: "Enter your name",
    validation: (value) => value.length > 0,
  },
  {
    id: 2,
    question: "How old are you?",
    type: "select",
    options: ["13-17", "18-24", "25-34", "35-44", "45-54", "55+"],
    textColor: "#005b4f",
    backgroundColor: "#FCFBF4",
    key: "age",
  },
  {
    id: 3,
    question: "What's your skin type?",
    type: "select",
    options: ["Oily", "Dry", "Combination", "Normal", "Sensitive"],
    textColor: "#005b4f",
    backgroundColor: "#FCFBF4",
    key: "skinType",
  },
  {
    id: 4,
    question: "Have you experienced reactions to certain products in the past?",
    type: "multiselect",
    options: ["Fragrances", "Oils", "Alcohols", "Preservatives", "None"],
    textColor: "#005b4f",
    backgroundColor: "#FCFBF4",
    key: "sensitivities",
  },
  {
    id: 5,
    question: "What are your primary goals for your skin?",
    type: "multiselect",
    options: [
      "Anti-aging",
      "Acne control",
      "Brightening",
      "Hydration",
      "Even tone",
      "Minimize pores",
    ],
    textColor: "#005b4f",
    backgroundColor: "#FCFBF4",
    key: "goals",
  },
];

export default data;
