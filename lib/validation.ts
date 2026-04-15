import { z } from 'zod';

// Zod schema for form validation
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  company: z.string()
    .max(200, 'Company name must be less than 200 characters')
    .trim()
    .optional(),
  inquiry: z.string()
    .min(10, 'Inquiry must be at least 10 characters')
    .max(5000, 'Inquiry must be less than 5000 characters')
    .trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResultSuccess {
  success: true;
  data: ContactFormData;
}

export interface ValidationResultError {
  success: false;
  errors: ValidationError[];
}

export type ValidationResult = ValidationResultSuccess | ValidationResultError;

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate and sanitize form data
export function validateFormData(data: unknown): ValidationResult {
  const result = contactFormSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    };
  }

  const validated = result.data;
  return {
    success: true,
    data: {
      ...validated,
      name: sanitizeInput(validated.name),
      email: sanitizeInput(validated.email),
      company: validated.company ? sanitizeInput(validated.company) : '',
      inquiry: sanitizeInput(validated.inquiry),
    },
  };
}
