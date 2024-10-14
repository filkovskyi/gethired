export type VacancySource = "dou" | "djinni" | "custom";
export type VacancyStage = "heap" | "hr interview" | "tech interview";

export interface Vacancy {
  id: string;
  title: string;
  source: VacancySource;
  url: string;
  description: string;
  salary: number;
  stage: VacancyStage;
}

export type Column = {
  id: string;
  title: string;
  vacancies: Vacancy[];
};

export const ItemTypes = {
  VACANCY: "vacancy" as const,
};

export const initialColumnVariants = {
  simple: [
    {
      id: "col1",
      title: "Heap",
      vacancies: [
        {
          id: "col1-vacancy-0",
          title: "Frontend Developer",
          source: "dou",
          url: "https://jobs.dou.ua/companies/example/vacancies/123456",
          description: "We are looking for an experienced Frontend developer.",
          salary: 3000,
          stage: "heap",
        },
        {
          id: "col1-vacancy-1",
          title: "Backend Developer",
          source: "djinni",
          url: "https://djinni.co/jobs/123456-backend-developer",
          description: "Seeking a skilled Backend developer for our team.",
          salary: 3500,
          stage: "heap",
        },
      ],
    },
    { id: "col2", title: "HR Interview", vacancies: [] },
    { id: "col3", title: "Tech Interview", vacancies: [] },
  ],
  advanced: [
    {
      id: "col1",
      title: "Heap",
      vacancies: [
        {
          id: "col1-vacancy-0",
          title: "Senior React Developer",
          source: "custom",
          url: "https://example.com/jobs/senior-react-developer",
          description:
            "Looking for a senior React developer to lead our frontend team.",
          salary: 5000,
          stage: "heap",
        },
        {
          id: "col1-vacancy-1",
          title: "DevOps Engineer",
          source: "dou",
          url: "https://jobs.dou.ua/companies/example/vacancies/234567",
          description:
            "Seeking an experienced DevOps engineer to improve our infrastructure.",
          salary: 4500,
          stage: "heap",
        },
      ],
    },
    { id: "col2", title: "HR Screening", vacancies: [] },
    { id: "col3", title: "Tech Screening", vacancies: [] },
    { id: "col4", title: "Final Interview", vacancies: [] },
    { id: "col5", title: "Offer", vacancies: [] },
  ],
  custom: [] as Column[],
};
