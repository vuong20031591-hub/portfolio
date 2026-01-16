// Supported languages
export type Language = "en" | "vi";

// Translation keys structure
export interface Translations {
  // Navigation
  nav: {
    home: string;
    about: string;
    projects: string;
    contact: string;
    skipToContent: string;
    ariaLabel: string;
    homeAriaLabel: string;
  };
  // Hero section
  hero: {
    greeting: string;
    title: string;
    subtitle: string;
  };
  // Skills section
  skills: {
    title: string;
    subtitle: string;
    frontend: {
      title: string;
      description: string;
    };
    backend: {
      title: string;
      description: string;
    };
    design: {
      title: string;
      description: string;
    };
    architecture: {
      title: string;
      description: string;
    };
  };
  // Experience section
  experience: {
    title: string;
  };
  // Projects section
  projects: {
    title: string;
    subtitle: string;
    viewCase: string;
    viewLive: string;
    code: string;
  };
  // Testimonials/Values section
  testimonials: {
    title: string;
    subtitle: string;
    items: {
      quote: string;
      author: string;
      title: string;
    }[];
  };
  // CTA section
  cta: {
    title: string;
    titleHighlight: string;
    text: string;
    getInTouch: string;
    viewResume: string;
  };
  // Contact form
  contact: {
    title: string;
    subtitle: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    heroTitle: string;
    heroSubtitle: string;
    emailLabel: string;
    facebook: string;
    facebookValue: string;
    telegram: string;
    telegramValue: string;
    github: string;
    githubValue: string;
    formTitle: string;
    formSubtitle: string;
    sendEmail: string;
    successMessage: string;
  };
  // Footer
  footer: {
    copyright: string;
  };
  // GitHub stats
  github: {
    title: string;
    repos: string;
    stars: string;
    forks: string;
    followers: string;
    topLanguages: string;
    topRepos: string;
    viewProfile: string;
    error: string;
    contributions: string;
    less: string;
    more: string;
    noContributions: string;
    contributionGraph: string;
    contributionGrid: string;
    legendLabel: string;
    statsLabel: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
  };
  // About page
  about: {
    title: string;
    text1: string;
    text2: string;
    text3: string;
    skillsTitle: string;
    skills: {
      frontend: {
        title: string;
        description: string;
      };
      design: {
        title: string;
        description: string;
      };
      performance: {
        title: string;
        description: string;
      };
      collaboration: {
        title: string;
        description: string;
      };
    };
  };
  // Projects page
  projectsPage: {
    title: string;
    subtitle: string;
  };
  // Process section
  process: {
    discovery: {
      title: string;
      text: string;
    };
    strategy: {
      title: string;
      text: string;
    };
    creation: {
      title: string;
      text: string;
    };
    refinement: {
      title: string;
      text: string;
    };
  };
  // Home projects
  homeProjects: {
    ecommerce: {
      title: string;
      description: string;
    };
    designSystem: {
      title: string;
      description: string;
    };
    mobileApp: {
      title: string;
      description: string;
    };
  };
  // Home experience
  homeExperience: {
    job1: {
      role: string;
      company: string;
      period: string;
      description: string;
    };
    job2: {
      role: string;
      company: string;
      period: string;
      description: string;
    };
    job3: {
      role: string;
      company: string;
      period: string;
      description: string;
    };
  };
  // Project modal
  projectModal: {
    challenge: string;
    challengeText: string;
    solution: string;
    solutionText: string;
    results: string;
    resultsText: string;
    client: string;
    clientValue: string;
    timeline: string;
    timelineValue: string;
    role: string;
    roleValue: string;
    stack: string;
    visitLive: string;
  };
}

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}
