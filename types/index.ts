export type SkinType = "oily" | "dry" | "combination" | "normal" | "sensitive";

export type SkinGoal =
  | "anti-aging"
  | "acne"
  | "brightening"
  | "hydration"
  | "even-tone"
  | "pore-minimizing";

export interface UserData {
  name?: string;
  age?: string;
  skinType?: SkinType;
  sensitivities?: string[];
  goals?: SkinGoal[];
  photoUri?: string;
}

export interface OnboardingData {
  id: number;
  question: string;
  type: "text" | "number" | "select" | "multiselect";
  options?: string[];
  textColor: string;
  backgroundColor: string;
  key: "name" | "age" | "skinType" | "sensitivities" | "goals";
  placeholder?: string;
  validation?: (value: any) => boolean;
}
