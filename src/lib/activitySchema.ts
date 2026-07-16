/**
 * Activity Schema System
 * 
 * Defines the structure for mission activities and user responses.
 * This allows missions to be data-driven with dynamic input fields.
 */

export type ActivityInputType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'date';

export interface ActivityInput {
  id: string;
  type: ActivityInputType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface ActivityQuestion {
  id: string;
  question: string;
  inputs: ActivityInput[];
  hint?: string;
}

export interface ActivitySchema {
  id: string;
  title: string;
  description: string;
  questions: ActivityQuestion[];
  estimatedTime: number; // in minutes
}

export interface ActivityResponse {
  questionId: string;
  inputId: string;
  value: string | number | boolean | string[];
}

export interface MissionActivityData {
  missionId: string;
  userId: string;
  responses: ActivityResponse[];
  completedAt: Date;
  xpEarned: number;
  dnaCategory?: string;
}

/**
 * Sample activity schemas for different mission types
 */

export const ACTIVITY_SCHEMAS: Record<string, ActivitySchema> = {
  daily_checkin: {
    id: 'daily_checkin',
    title: 'Daily Check-In',
    description: 'Start your day by checking in and setting your intention',
    estimatedTime: 2,
    questions: [
      {
        id: 'q1',
        question: 'How are you feeling today?',
        inputs: [
          {
            id: 'mood',
            type: 'select',
            label: 'Select your mood',
            required: true,
            options: [
              { value: 'great', label: '😄 Great' },
              { value: 'good', label: '🙂 Good' },
              { value: 'okay', label: '😐 Okay' },
              { value: 'tired', label: '😴 Tired' },
              { value: 'stressed', label: '😰 Stressed' },
            ],
          },
        ],
      },
      {
        id: 'q2',
        question: 'What is one financial goal for today?',
        inputs: [
          {
            id: 'goal',
            type: 'textarea',
            label: 'Describe your goal',
            placeholder: 'e.g., Save $5, learn about budgeting, etc.',
            required: true,
            validation: { minLength: 10, maxLength: 500 },
          },
        ],
      },
    ],
  },

  saving_basics: {
    id: 'saving_basics',
    title: 'Saving Basics',
    description: 'Learn the fundamentals of saving money',
    estimatedTime: 10,
    questions: [
      {
        id: 'q1',
        question: 'What percentage of your allowance/income should you save?',
        inputs: [
          {
            id: 'percentage',
            type: 'number',
            label: 'Percentage (%)',
            required: true,
            validation: { min: 0, max: 100 },
          },
        ],
        hint: 'Financial experts recommend saving 10-20% of your income',
      },
      {
        id: 'q2',
        question: 'Name three places you could save money',
        inputs: [
          {
            id: 'place1',
            type: 'text',
            label: 'First place',
            placeholder: 'e.g., piggy bank, savings account',
            required: true,
          },
          {
            id: 'place2',
            type: 'text',
            label: 'Second place',
            placeholder: 'e.g., investment account',
            required: true,
          },
          {
            id: 'place3',
            type: 'text',
            label: 'Third place',
            placeholder: 'e.g., high-yield savings',
            required: true,
          },
        ],
      },
      {
        id: 'q3',
        question: 'What is compound interest?',
        inputs: [
          {
            id: 'definition',
            type: 'textarea',
            label: 'Explain in your own words',
            placeholder: 'Describe what compound interest means to you',
            required: true,
            validation: { minLength: 20, maxLength: 500 },
          },
        ],
      },
    ],
  },

  set_first_goal: {
    id: 'set_first_goal',
    title: 'Set Your First Goal',
    description: 'Define a financial goal for the next 3 months',
    estimatedTime: 5,
    questions: [
      {
        id: 'q1',
        question: 'What is your financial goal?',
        inputs: [
          {
            id: 'goalName',
            type: 'text',
            label: 'Goal name',
            placeholder: 'e.g., Save for a bike',
            required: true,
            validation: { minLength: 5, maxLength: 100 },
          },
        ],
      },
      {
        id: 'q2',
        question: 'How much money do you need?',
        inputs: [
          {
            id: 'amount',
            type: 'number',
            label: 'Amount ($)',
            required: true,
            validation: { min: 1, max: 10000 },
          },
        ],
      },
      {
        id: 'q3',
        question: 'When do you want to achieve this goal?',
        inputs: [
          {
            id: 'deadline',
            type: 'date',
            label: 'Target date',
            required: true,
          },
        ],
      },
      {
        id: 'q4',
        question: 'How will you save for this goal?',
        inputs: [
          {
            id: 'strategy',
            type: 'textarea',
            label: 'Your saving strategy',
            placeholder: 'Describe how you plan to save',
            required: true,
            validation: { minLength: 20, maxLength: 500 },
          },
        ],
      },
    ],
  },
};

/**
 * Helper function to get activity schema by mission ID
 */
export function getActivitySchema(missionId: string): ActivitySchema | undefined {
  return ACTIVITY_SCHEMAS[missionId];
}

/**
 * Validate activity responses against schema
 */
export function validateActivityResponses(
  schema: ActivitySchema,
  responses: ActivityResponse[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const question of schema.questions) {
    for (const input of question.inputs) {
      const response = responses.find(
        (r) => r.questionId === question.id && r.inputId === input.id
      );

      // Check required fields
      if (input.required && (!response || !response.value)) {
        errors.push(`${input.label} is required`);
        continue;
      }

      if (!response) continue;

      const value = response.value;

      // Validate text length
      if (input.type === 'text' || input.type === 'textarea') {
        const strValue = String(value);
        if (input.validation?.minLength && strValue.length < input.validation.minLength) {
          errors.push(
            `${input.label} must be at least ${input.validation.minLength} characters`
          );
        }
        if (input.validation?.maxLength && strValue.length > input.validation.maxLength) {
          errors.push(
            `${input.label} must be at most ${input.validation.maxLength} characters`
          );
        }
      }

      // Validate numbers
      if (input.type === 'number') {
        const numValue = Number(value);
        if (input.validation?.min !== undefined && numValue < input.validation.min) {
          errors.push(`${input.label} must be at least ${input.validation.min}`);
        }
        if (input.validation?.max !== undefined && numValue > input.validation.max) {
          errors.push(`${input.label} must be at most ${input.validation.max}`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
