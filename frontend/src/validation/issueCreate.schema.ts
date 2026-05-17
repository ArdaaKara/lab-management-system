import { z } from 'zod'

export const ISSUE_CATEGORIES = [
  'NO_DISPLAY',
  'NO_INTERNET',
  'NO_POWER',
  'SLOW_PERFORMANCE',
  'PERIPHERAL_FAILURE',
  'OS_ERROR',
  'OTHER',
] as const

export const issueCreateSchema = z.object({
  computerId: z.string().min(1, 'Bilgisayar seçimi zorunludur'),
  category: z.enum(ISSUE_CATEGORIES, { error: 'Kategori seçimi zorunludur' }),
  studentIdReporter: z
    .string()
    .min(1, 'Öğrenci numarası zorunludur')
    .regex(/^\d{6,}$/, 'Öğrenci numarası en az 6 rakam olmalıdır'),
  description: z.string().max(500, 'Açıklama 500 karakteri geçemez').optional(),
})

export type IssueCreateFormValues = z.infer<typeof issueCreateSchema>
