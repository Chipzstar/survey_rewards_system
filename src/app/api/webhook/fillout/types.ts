type QuestionType =
  | 'MultipleChoice'
  | 'Dropdown'
  | 'ShortAnswer'
  | 'DatePicker'
  | 'Checkboxes'
  | 'StarRating'
  | 'NumberInput'
  | 'Slider';

export interface SliderQuestion {
  type: 'Slider';
  value: number;
}

export interface StarRatingQuestion {
  type: 'StarRating';
  value: number;
}

export interface DatePickerQuestion {
  type: 'DatePicker';
  value: string;
}

export interface MultipleChoiceQuestion {
  type: 'MultipleChoice';
  value: string;
}

export interface CheckboxQuestion {
  type: 'Checkboxes';
  value: string[];
}

export interface DropdownQuestion {
  type: 'Dropdown';
  value: string;
}

export interface ShortAnswerQuestion {
  type: 'ShortAnswer';
  value: string;
}

export interface NumberInputQuestion {
  type: 'NumberInput';
  value: number;
}

export type QuestionTypes =
  | CheckboxQuestion
  | MultipleChoiceQuestion
  | DatePickerQuestion
  | SliderQuestion
  | StarRatingQuestion
  | DropdownQuestion
  | ShortAnswerQuestion
  | NumberInputQuestion;

export type Question = QuestionTypes & {
  id: string;
  name: string;
};

interface Calculation {
  id: string;
  name: string;
  type: string;
  value: number | string;
}

interface UrlParameter {
  id: string;
  name: string;
  value: string;
}

export interface Submission {
  submissionId: string;
  submissionTime: string;
  lastUpdatedAt: string;
  questions: Question[];
  calculations: Calculation[];
  urlParameters: UrlParameter[];
  quiz: Record<string, never>; // or just: quiz: {};
  documents: never[];
  scheduling: never[];
  payments: never[];
}

export interface Submission {
  submissionId: string;
  submissionTime: string;
  lastUpdatedAt: string;
  questions: Question[];
  calculations: Calculation[];
  urlParameters: UrlParameter[];
}

export interface FormEvent {
  formId: string;
  formName: string;
  submission: Submission;
}

export type RatingType =
  | 'overall'
  | 'interview-process'
  | 'diversity'
  | 'team-culture'
  | 'application-process'
  | 'recommendation'
  | 'flexibility'
  | 'authenticity'
  | 'work-life-balance';

export type ReviewType = 'Student' | 'Young professional';
