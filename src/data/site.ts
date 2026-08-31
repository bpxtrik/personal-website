/**
 * Single source of truth for every piece of content on the site.
 * Both the static pages and the interactive shell read from here, so
 * updating your CV means editing this one file.
 */

export const profile = {
  name: 'Patrik Barsi',
  handle: 'patrik',
  host: 'barsi.xyz',
  role: 'Software Engineer',
  location: 'Trondheim, Norway',
  email: 'p.barsi04@gmail.com',
  tagline: 'Backend & cloud-focused software engineer. Java / Go / TypeScript.',
  summary:
    "Software engineer with a BSc in Software Engineering from the Faculty of Technical " +
    "Sciences in Novi Sad, now pursuing an MSc at NTNU in Trondheim. I build production " +
    "backends and cloud infrastructure — REST APIs, relational data models, caching layers, " +
    "containers, and AWS deployments — and I ship the full stack when a project needs it.",
  socials: {
    github: 'https://github.com/bpxtrik',
    // TODO: replace with your real LinkedIn URL.
    linkedin: 'https://www.linkedin.com/in/patrik-barsi',
  },
} as const;

export type Social = keyof typeof profile.socials;

export const education = [
  {
    // TODO: add your MSc specialisation/programme name when you want it shown.
    degree: 'Master of Science',
    school: 'Norwegian University of Science and Technology (NTNU)',
    where: 'Trondheim, Norway',
    start: '2026',
    end: 'Present',
    coursework: [],
  },
  {
    degree: 'Bachelor of Software Engineering',
    school: 'Faculty of Technical Sciences',
    where: 'Novi Sad, Serbia',
    start: '2022',
    end: '2026',
    coursework: [
      'Object-Oriented Programming',
      'Data Structures',
      'Algorithms',
      'Databases',
      'Web Development',
    ],
  },
] as const;

export const experience = [
  {
    role: 'Software Engineering Intern',
    company: 'EPAM Systems',
    start: '2026',
    end: 'Present',
    location: 'Novi Sad, Serbia',
    highlights: [
      'Worked on AWS cloud architecture and implementation, focusing on scalable and secure backend infrastructure.',
      'Designed and integrated cloud components including AWS Lambda, API Gateway, and RDS for backend services.',
      'Applied cloud security best practices: access control, secure API communication, and resource protection.',
      'Collaborated with engineers on production-oriented software development and cloud deployment workflows.',
    ],
    stack: ['AWS Lambda', 'API Gateway', 'RDS', 'IAM', 'CI/CD'],
  },
] as const;

export const skills = [
  { group: 'Languages', items: ['Java', 'Python', 'Go', 'TypeScript / JavaScript', 'SQL'] },
  {
    group: 'Backend',
    items: [
      'Spring Boot',
      'NestJS',
      'FastAPI',
      'REST APIs',
      'PostgreSQL',
      'MongoDB',
      'Redis',
    ],
  },
  { group: 'Frontend', items: ['Angular', 'HTML', 'CSS'] },
  {
    group: 'Cloud / Dev Tools',
    items: ['AWS', 'Docker', 'Git / GitHub', 'CI/CD', 'Linux', 'Postman', 'Neovim'],
  },
] as const;

export type Project = {
  slug: string;
  name: string;
  kind: string;
  stack: string[];
  summary: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: 'sports-club-management-system',
    name: 'Sports Club Management System',
    kind: 'Deployed full-stack application',
    stack: ['NestJS', 'PostgreSQL', 'Angular', 'JWT', 'CI/CD'],
    summary:
      'A production web platform used by a sports club for member management, scheduling, ' +
      'and performance tracking.',
    highlights: [
      'Built and deployed a production platform actively used by a sports club.',
      'Developed backend services in NestJS and PostgreSQL with JWT authentication and role-based access control.',
      'Created the Angular interfaces and automated deployment workflows with Git/GitHub and CI/CD.',
    ],
  },
  {
    slug: 'data-intensive-web-application',
    name: 'Data-Intensive Web Application',
    kind: 'FastAPI + Angular + Docker',
    stack: ['FastAPI', 'Angular', 'Docker', 'Redis', 'PostgreSQL'],
    summary:
      'A data-heavy application handling 100k+ records with optimized queries, indexing, ' +
      'and search.',
    highlights: [
      'Handled 100k+ records with optimized queries, indexing, and search functionality.',
      'Improved performance with Redis caching, pagination strategies, and database tuning.',
      'Containerized the application with Docker for reproducible deployment environments.',
    ],
  },
  {
    slug: 'event-planner-platform',
    name: 'Event Planner Platform',
    kind: 'Spring Boot + Angular',
    stack: ['Spring Boot', 'Angular', 'PostgreSQL', 'REST'],
    summary: 'A full-stack event management platform supporting multiple user roles and permissions.',
    highlights: [
      'Designed a full-stack event management platform with multiple user roles and permissions.',
      'Built REST APIs, authentication flows, and analytics features with Spring Boot and PostgreSQL.',
    ],
  },
];

/** Small facts used by `neofetch` and the footer. */
export const system = {
  os: 'barsi.xyz 1.0.0',
  shell: 'psh 5.0',
  editor: 'nvim',
  uptime: 'since 2022',
  cpu: 'coffee-driven',
} as const;
