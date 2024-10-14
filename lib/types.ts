export type VacancySource = 'dou' | 'djinni' | 'custom'
export type VacancyStage = 'heap' | 'hr interview' | 'tech interview'

export interface Vacancy {
  id: string
  title: string
  source: VacancySource
  url: string
  description: string
  salary: number
  stage: VacancyStage
  column_id: string
}

export type Column = {
  id: string
  title: string
  vacancies: Vacancy[]
}

export const ItemTypes = {
  VACANCY: "vacancy" as const,
}

export const initialColumns: Column[] = [
  { id: "col1", title: "Heap", vacancies: [] },
  { id: "col2", title: "HR Interview", vacancies: [] },
  { id: "col3", title: "Tech Interview", vacancies: [] },
]