/**
 * GitHub Projects Service - Server-side only
 * Fetches real project data from GitHub repositories
 */

// In-memory cache for projects (5 minutes TTL)
const CACHE_TTL = 5 * 60 * 1000;
const projectsCache = new Map<string, { data: FeaturedProject[]; timestamp: number }>();

export interface GitHubProject {
  id: string;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazersCount: number;
  forksCount: number;
  createdAt: string;
  updatedAt: string;
  readme: string | null;
  imageUrl: string | null;
}

export interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  stars?: number;
  forks?: number;
  language: string | null;
  readme: string | null;
  features: string[];
  techStack: string[];
}

// Danh sách repos nổi bật cần fetch
const FEATURED_REPOS = [
  { owner: "vuong20031591-hub", repo: "RentCarVN" },
  { owner: "vuong20031591-hub", repo: "VoiceToText" },
  { owner: "vuong20031591-hub", repo: "VuongTech" },
  { owner: "vuong20031591-hub", repo: "CoolHome" },
  { owner: "vuong20031591-hub", repo: "scb-agency" },
];

// Project metadata bổ sung (không có trong GitHub API)
const PROJECT_METADATA: Record<string, {
  title: { en: string; vi: string };
  description: { en: string; vi: string };
  image: string;
  liveUrl: string | null;
  features: { en: string[]; vi: string[] };
}> = {
  RentCarVN: {
    title: {
      en: "RentCarVN - Car Rental Platform",
      vi: "RentCarVN - Nền tảng cho thuê xe",
    },
    description: {
      en: "Leading car rental platform in Vietnam, connecting car owners and customers quickly, safely and conveniently.",
      vi: "Nền tảng cho thuê xe ô tô hàng đầu Việt Nam, kết nối chủ xe và khách hàng nhanh chóng, an toàn và tiện lợi.",
    },
    image: "/images/projects/rentcarvn.webp",
    liveUrl: "https://rent-car-vn.vercel.app/",
    features: {
      en: [
        "Search and rent diverse vehicles",
        "Dark mode & 8 theme presets",
        "Responsive design",
        "3D animations with Framer Motion",
        "Google Maps integration",
      ],
      vi: [
        "Tìm kiếm và thuê xe đa dạng",
        "Dark mode & 8 theme presets",
        "Responsive design",
        "3D animations với Framer Motion",
        "Tích hợp Google Maps",
      ],
    },
  },
  VoiceToText: {
    title: {
      en: "VoiceToText - Vietnamese Speech Recognition",
      vi: "VoiceToText - Nhận dạng giọng nói tiếng Việt",
    },
    description: {
      en: "High-speed Vietnamese speech recognition application with AI, featuring hotkey recording and auto paste functionality.",
      vi: "Ứng dụng nhận dạng giọng nói tiếng Việt tốc độ cao với AI, hỗ trợ hotkey recording và auto paste.",
    },
    image: "/images/projects/voicetotext.webp",
    liveUrl: "https://github.com/vuong20031591-hub/VoiceToText?tab=readme-ov-file#demo",
    features: {
      en: [
        "Vietnamese speech recognition with high accuracy",
        "Ultra-fast speed - Results in 0.5-1 second",
        "Multi API keys rotation",
        "Hotkey recording (Ctrl+Alt)",
        "Modern overlay GUI with wave visualization",
      ],
      vi: [
        "Nhận dạng giọng nói tiếng Việt độ chính xác cao",
        "Tốc độ cực nhanh - Kết quả trong 0.5-1 giây",
        "Multi API keys rotation",
        "Hotkey recording (Ctrl+Alt)",
        "Modern overlay GUI với wave visualization",
      ],
    },
  },
  VuongTech: {
    title: {
      en: "VuongTech - Digital Agency",
      vi: "VuongTech - Agency Công nghệ số",
    },
    description: {
      en: "We Design. We Code. You Shine. Digital transformation through intelligent software solutions and user-centric design.",
      vi: "We Design. We Code. You Shine. Chuyển đổi số thông qua giải pháp phần mềm thông minh và thiết kế lấy người dùng làm trung tâm.",
    },
    image: "/images/projects/vuongtech.webp",
    liveUrl: "https://vuongtech.vercel.app/",
    features: {
      en: [
        "Modern Supabase-inspired design",
        "Animated counters with scroll triggers",
        "Logo carousel with marquee animation",
        "Mobile-first responsive design",
      ],
      vi: [
        "Thiết kế hiện đại theo phong cách Supabase",
        "Animated counters với scroll triggers",
        "Logo carousel với marquee animation",
        "Mobile-first responsive design",
      ],
    },
  },
  CoolHome: {
    title: {
      en: "CoolHome - Smart Home Platform",
      vi: "CoolHome - Nền tảng nhà thông minh",
    },
    description: {
      en: "Smart home management platform with modern UI and intuitive controls.",
      vi: "Nền tảng quản lý nhà thông minh với giao diện hiện đại và điều khiển trực quan.",
    },
    image: "/images/projects/coolhome.webp",
    liveUrl: null,
    features: {
      en: [
        "Smart device management",
        "Modern dashboard interface",
        "Real-time monitoring",
      ],
      vi: [
        "Quản lý thiết bị thông minh",
        "Giao diện dashboard hiện đại",
        "Giám sát real-time",
      ],
    },
  },
  "scb-agency": {
    title: {
      en: "SCB Agency - Creative Agency",
      vi: "SCB Agency - Agency Sáng tạo",
    },
    description: {
      en: "A modern creative agency website built with Next.js and cutting-edge web technologies.",
      vi: "Website agency sáng tạo hiện đại được xây dựng với Next.js và công nghệ web tiên tiến.",
    },
    image: "/images/projects/scb-agency.webp",
    liveUrl: null,
    features: {
      en: [
        "Next.js App Router",
        "Modern responsive design",
        "Optimized performance",
      ],
      vi: [
        "Next.js App Router",
        "Thiết kế responsive hiện đại",
        "Hiệu suất tối ưu",
      ],
    },
  },
};

// Project không nằm trên GitHub (repo private) - thêm trực tiếp vào danh sách
interface StaticProjectConfig {
  id: string;
  title: { en: string; vi: string };
  description: { en: string; vi: string };
  image: string;
  liveUrl: string;
  language: string;
  techStack: string[];
  features: { en: string[]; vi: string[] };
}

const STATIC_PROJECTS: StaticProjectConfig[] = [
  {
    id: "kdgroup",
    title: {
      en: "KD Group - Industrial Fastener Website",
      vi: "KD Group - Website ốc vít công nghiệp",
    },
    description: {
      en: "Corporate website for an industrial fastener manufacturer: bilingual product catalog, quote request flow and a custom admin panel for products and content.",
      vi: "Website doanh nghiệp cho nhà sản xuất ốc vít công nghiệp: danh mục sản phẩm song ngữ, luồng yêu cầu báo giá và trang quản trị tự viết cho sản phẩm và nội dung.",
    },
    image: "/images/projects/kdgroup.jpg",
    liveUrl: "https://kdgroup.vn",
    language: "TypeScript",
    techStack: ["TanStack Start", "React", "TypeScript", "Tailwind CSS", "Prisma", "Vite"],
    features: {
      en: [
        "Bilingual product catalog (VI/EN)",
        "Quote request flow with form validation",
        "Prisma + SQL database with migrations",
        "Admin panel with rich-text editor (BlockNote)",
        "Server-side rendering with TanStack Start",
      ],
      vi: [
        "Danh mục sản phẩm song ngữ (VI/EN)",
        "Luồng yêu cầu báo giá có validate form",
        "Cơ sở dữ liệu Prisma + SQL với migration",
        "Trang quản trị có trình soạn thảo (BlockNote)",
        "Server-side rendering với TanStack Start",
      ],
    },
  },
  {
    id: "poseidonbike",
    title: {
      en: "PoseidonBike - Bicycle Brand Website",
      vi: "PoseidonBike - Website thương hiệu xe đạp",
    },
    description: {
      en: "Brand website for Poseidon bicycles: product catalog with filters, dealer locator, news section and a custom admin panel for products and content.",
      vi: "Website thương hiệu xe đạp Poseidon: danh mục sản phẩm có bộ lọc, tìm đại lý, tin tức và trang quản trị tự viết cho sản phẩm và nội dung.",
    },
    image: "/images/projects/poseidonbike.jpg",
    liveUrl: "https://poseidonbike.vn",
    language: "TypeScript",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Drizzle ORM"],
    features: {
      en: [
        "Next.js App Router with server rendering",
        "Product catalog with filters and detail pages",
        "Dealer locator and news section",
        "Admin panel with rich-text editor (BlockNote)",
        "Image uploads via Cloudinary, PostgreSQL with Drizzle ORM",
      ],
      vi: [
        "Next.js App Router với server rendering",
        "Danh mục sản phẩm có bộ lọc và trang chi tiết",
        "Trang tìm đại lý và tin tức",
        "Trang quản trị có trình soạn thảo (BlockNote)",
        "Upload ảnh qua Cloudinary, PostgreSQL với Drizzle ORM",
      ],
    },
  },
];

function buildStaticProject(id: string, language: "en" | "vi"): FeaturedProject {
  const config = STATIC_PROJECTS.find((project) => project.id === id)!;
  return {
    id: config.id,
    title: config.title[language],
    description: config.description[language],
    image: config.image,
    tags: config.techStack,
    githubUrl: null,
    liveUrl: config.liveUrl,
    language: config.language,
    readme: null,
    features: config.features[language],
    techStack: config.techStack,
  };
}


// Default images cho các project
const DEFAULT_PROJECT_IMAGES: Record<string, string> = {
  RentCarVN: "/images/projects/rent-car-vn.webp",
  VoiceToText: "/images/projects/voicetotext.webp",
  VuongTech: "/images/projects/vuongtech.webp",
  CoolHome: "/images/projects/coolhome.webp",
  "scb-agency": "/images/projects/scb-agency.webp",
};

/**
 * Fetch repository info from GitHub API
 */
async function fetchRepoInfo(
  owner: string,
  repo: string,
  token?: string
): Promise<GitHubProject | null> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-App/1.0", // Required by GitHub API
    };
    if (token) {
      // GitHub Personal Access Tokens use "token" prefix, not "Bearer"
      headers.Authorization = `token ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    if (!response.ok) {
      console.error(`Failed to fetch repo ${owner}/${repo}: ${response.status}`);
      return null;
    }

    const data = await response.json() as {
      id: number;
      name: string;
      full_name: string;
      description: string | null;
      html_url: string;
      homepage: string | null;
      language: string | null;
      topics: string[];
      stargazers_count: number;
      forks_count: number;
      created_at: string;
      updated_at: string;
    };

    return {
      id: data.id.toString(),
      name: data.name,
      fullName: data.full_name,
      description: data.description || "",
      htmlUrl: data.html_url,
      homepage: data.homepage || null,
      language: data.language,
      topics: data.topics || [],
      stargazersCount: data.stargazers_count,
      forksCount: data.forks_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      readme: null,
      imageUrl: null,
    };
  } catch (error) {
    console.error(`Error fetching repo ${owner}/${repo}:`, error);
    return null;
  }
}

/**
 * Fetch README content from GitHub
 */
async function fetchReadme(
  owner: string,
  repo: string,
  token?: string
): Promise<string | null> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3.raw",
      "User-Agent": "Portfolio-App/1.0", // Required by GitHub API
    };
    if (token) {
      // GitHub Personal Access Tokens use "token" prefix, not "Bearer"
      headers.Authorization = `token ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers }
    );

    if (!response.ok) return null;

    return await response.text();
  } catch {
    return null;
  }
}

/**
 * Extract tech stack from README or repo data
 */
function extractTechStack(
  readme: string | null,
  language: string | null,
  topics: string[]
): string[] {
  const techStack: Set<string> = new Set();

  // Add primary language
  if (language) {
    techStack.add(language);
  }

  // Add from topics
  const techTopics = [
    "react", "nextjs", "typescript", "javascript", "python",
    "tailwindcss", "nodejs", "mongodb", "firebase", "vercel",
    "vite", "framer-motion", "shadcn-ui", "supabase"
  ];
  
  topics.forEach((topic) => {
    const normalized = topic.toLowerCase();
    if (techTopics.includes(normalized)) {
      techStack.add(formatTechName(topic));
    }
  });

  // Extract from README if available
  if (readme) {
    const techPatterns = [
      /React/gi, /Next\.?js/gi, /TypeScript/gi, /JavaScript/gi,
      /Tailwind\s?CSS/gi, /Node\.?js/gi, /MongoDB/gi, /Firebase/gi,
      /Vite/gi, /Framer\s?Motion/gi, /shadcn/gi, /Supabase/gi,
      /Python/gi, /PyAudio/gi, /CustomTkinter/gi
    ];

    techPatterns.forEach((pattern) => {
      const match = readme.match(pattern);
      if (match) {
        techStack.add(formatTechName(match[0]));
      }
    });
  }

  return Array.from(techStack).slice(0, 6);
}

/**
 * Format tech name for display
 */
function formatTechName(name: string): string {
  const formatMap: Record<string, string> = {
    nextjs: "Next.js",
    nodejs: "Node.js",
    tailwindcss: "Tailwind CSS",
    typescript: "TypeScript",
    javascript: "JavaScript",
    mongodb: "MongoDB",
    firebase: "Firebase",
    react: "React",
    vite: "Vite",
    "framer-motion": "Framer Motion",
    "shadcn-ui": "shadcn/ui",
    supabase: "Supabase",
    python: "Python",
  };

  const lower = name.toLowerCase().replace(/\s+/g, "");
  return formatMap[lower] || name;
}

/**
 * Fetch all featured projects - Parallel fetching with caching
 */
export async function fetchFeaturedProjects(
  language: "en" | "vi" = "en",
  env?: Record<string, unknown>
): Promise<FeaturedProject[]> {
  const cacheKey = `projects_${language}`;
  
  // Check cache first
  const cached = projectsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const { getEnv } = await import("~/lib/env.server");
  const token = getEnv("GITHUB_TOKEN", env);

  if (!token) {
    console.error("GITHUB_TOKEN not configured");
    return STATIC_PROJECTS.map((project) => buildStaticProject(project.id, language));
  }

  // Fetch all repos in parallel
  const projectPromises = FEATURED_REPOS.map(async ({ owner, repo }) => {
    const [repoInfo, readme] = await Promise.all([
      fetchRepoInfo(owner, repo, token),
      fetchReadme(owner, repo, token),
    ]);

    if (!repoInfo) return null;

    const metadata = PROJECT_METADATA[repo];
    const techStack = extractTechStack(readme, repoInfo.language, repoInfo.topics);

    return {
      repo,
      project: {
        id: repoInfo.id,
        title: metadata?.title[language] || repoInfo.name,
        description: metadata?.description[language] || repoInfo.description,
        image: DEFAULT_PROJECT_IMAGES[repo] || 
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
        tags: techStack.length > 0 ? techStack : ["Web Development"],
        githubUrl: repoInfo.htmlUrl,
        liveUrl: metadata?.liveUrl || repoInfo.homepage,
        stars: repoInfo.stargazersCount,
        forks: repoInfo.forksCount,
        language: repoInfo.language,
        readme,
        features: metadata?.features[language] || [],
        techStack,
      } as FeaturedProject,
    };
  });

  const fetched = await Promise.all(projectPromises);
  const byRepo = new Map(
    fetched.filter((entry): entry is { repo: string; project: FeaturedProject } => entry !== null)
      .map((entry) => [entry.repo, entry.project])
  );

  // Thứ tự hiển thị: KD Group và PoseidonBike (repo private) thay cho SmartGym và VeXe24h cũ
  const ordered: Array<FeaturedProject | undefined> = [
    byRepo.get("RentCarVN"),
    byRepo.get("VoiceToText"),
    byRepo.get("VuongTech"),
    buildStaticProject("kdgroup", language),
    byRepo.get("CoolHome"),
    byRepo.get("scb-agency"),
    buildStaticProject("poseidonbike", language),
  ];
  const projects = ordered.filter((project): project is FeaturedProject => Boolean(project));
  
  // Store in cache
  projectsCache.set(cacheKey, { data: projects, timestamp: Date.now() });

  return projects;
}

/**
 * Get a single project by repo name
 */
export async function getProjectByName(
  repoName: string,
  language: "en" | "vi" = "en",
  env?: Record<string, unknown>
): Promise<FeaturedProject | null> {
  if (STATIC_PROJECTS.some((project) => project.id === repoName)) {
    return buildStaticProject(repoName, language);
  }

  const repoConfig = FEATURED_REPOS.find((r) => r.repo === repoName);
  if (!repoConfig) return null;

  const { getEnv } = await import("~/lib/env.server");
  const token = getEnv("GITHUB_TOKEN", env);
  const repoInfo = await fetchRepoInfo(repoConfig.owner, repoConfig.repo, token);
  if (!repoInfo) return null;

  const readme = await fetchReadme(repoConfig.owner, repoConfig.repo, token);
  const metadata = PROJECT_METADATA[repoName];
  const techStack = extractTechStack(readme, repoInfo.language, repoInfo.topics);

  return {
    id: repoInfo.id,
    title: metadata?.title[language] || repoInfo.name,
    description: metadata?.description[language] || repoInfo.description,
    image: DEFAULT_PROJECT_IMAGES[repoName] ||
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    tags: techStack.length > 0 ? techStack : ["Web Development"],
    githubUrl: repoInfo.htmlUrl,
    liveUrl: metadata?.liveUrl || repoInfo.homepage,
    stars: repoInfo.stargazersCount,
    forks: repoInfo.forksCount,
    language: repoInfo.language,
    readme,
    features: metadata?.features[language] || [],
    techStack,
  };
}
