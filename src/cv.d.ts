// 布局类型定义
export type PageLayout = 'single' | 'two';

// 数据验证结果接口
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CV {
  analyticsCode?: string;
  pageLayout: PageLayout;
  basics: Basics;
  work?: Array<Work>;
  volunteer?: Array<Volunteer>;
  education?: Array<Education>;
  awards?: Array<Awards>;
  certificates?: Array<Certificates>;
  publications?: Array<Publications>;
  skills?: Array<Skills>;
  languages?: Array<Languages>;
  interests?: Array<Interests>;
  references?: Array<References>;
  projects?: Array<Projects>;
  images?: Images;
}

interface Basics {
  name: string;
  label: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  theme?: string;
  location?: Location;
  profiles?: Array<Profiles>;
  beian?: {
    mint?: string;
    police?: string;
  };
  about?: About;
}

interface About {
  description?: string;
  personalInfo?: Array<{
    emoji: string;
    label: string;
    value: string;
    color: string;
  }>;
  traits?: Array<{
    emoji: string;
    text: string;
    color: string;
  }>;
  highlights?: Array<{
    emoji: string;
    text: string;
    color: string;
  }>;
  quote?: {
    text: string;
    emoji: string;
    values?: Array<{
      emoji: string;
      label: string;
      color: string;
    }>;
  };
  // 保持向后兼容性
  tags?: Array<{
    icon: string;
    text: string;
  }>;
}

interface Location {
  address?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
  region?: string;
}

interface Profiles {
  icon: string,
  network: string;
  username: string;
  url: string;
}

interface Work {
  name: string;
  position: string;
  location_type?: string;
  location?: string;
  url?: string;
  startDate: DateStr;
  endDate: DateStr | null;
  summary?: string;
  highlights?: Highlight;
  responsibilities?: Array<string>;
  achievements?: Array<string>;
  skills?: Record<string, string>;
}

type DateStr = `${string}-${string}-${string}`;

interface Volunteer {
  organization: string;
  position: string;
  url: string;
  startDate: DateStr;
  endDate: DateStr;
  summary: string;
  highlights: Highlight;
}

interface Skills {
  icon: string,
  name: string;
  level: string;
  keywords: Array<string>;
}

interface Awards {
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

interface Certificates {
  name: string;
  date: DateStr;
  issuer: string;
  url: string;
}

interface Publications {
  name: string;
  publisher: string;
  releaseDate: DateStr;
  url: string;
  summary: string;
}

interface Education {
  institution: string;
  url?: string;
  area: string;
  studyType: string;
  startDate: DateStr;
  endDate: DateStr | null;
  score?: string;
  courses?: Array<string>;
}

interface Languages {
  language: Language;
  fluency: string;
}

type Language =
  | "Spanish"
  | "English"
  | "German"
  | "France"
  | "Italian"
  | "Korean"
  | "Portuguese"
  | "Chinese"
  | "Arabic"
  | "Dutch"
  | "Finnish"
  | "Russian"
  | "Turkish"
  | "Hindi"
  | "Bengali"
  | string;

interface Projects {
  name: string;
  isActive?: boolean;
  description: string;
  highlights?: Highlight;
  url?: string;
  github?: string;
  image?: {
    url: string;
    position?: string;
    dark?: string;
  };
}

interface Images {
  intro?: string;
  list?: Array<{
    image: string;
    alt?: string;
    desc?: string;
  }>;
}

interface Interests {
  name: string;
  keywords: Array<string>;
}

interface References {
  name: string;
  reference: string;
}

type Highlight = Array<String>;
