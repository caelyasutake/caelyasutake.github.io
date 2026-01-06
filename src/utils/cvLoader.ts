import type { CV, PageLayout } from '@/cv.d.ts';
import { validateCV } from '@/utils/cvValidator';

/**
 * CV数据加载器
 * 提供健壮的数据加载、验证和默认值处理
 */
export class CVDataLoader {
  private static instance: CVDataLoader;
  private cachedData: CV | null = null;
  private isLoaded = false;

  static getInstance(): CVDataLoader {
    if (!CVDataLoader.instance) {
      CVDataLoader.instance = new CVDataLoader();
    }
    return CVDataLoader.instance;
  }

  /**
   * 加载和验证CV数据
   */
  async loadCV(): Promise<CV> {
    if (this.isLoaded && this.cachedData) {
      return this.cachedData;
    }

    try {
      // 动态导入cv.json数据
      const rawData = await this.loadRawData();

      // 数据验证
      const validationResult = validateCV(rawData);

      if (!validationResult.isValid) {
        console.error('CV数据验证失败:', validationResult.errors);
        // 在开发环境显示详细错误信息
        if (import.meta.env.DEV) {
          console.warn('CV数据警告:', validationResult.warnings);
        }
      } else if (validationResult.warnings.length > 0 && import.meta.env.DEV) {
        console.warn('CV数据警告:', validationResult.warnings);
      }

      // 应用默认值和规范化数据
      const normalizedData = this.normalizeData(rawData);

      this.cachedData = normalizedData;
      this.isLoaded = true;

      return normalizedData;
    } catch (error) {
      console.error('加载CV数据时出错:', error);
      return this.getDefaultCV();
    }
  }

  /**
   * 加载原始数据
   */
  private async loadRawData(): Promise<any> {
    try {
      // 使用Astro的JSON导入功能
      const module = await import('../../cv.json');
      return module.default || module;
    } catch (error) {
      throw new Error(`无法加载cv.json文件: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 规范化数据，应用默认值
   */
  private normalizeData(rawData: any): CV {
    const normalized: CV = {
      analyticsCode: rawData.analyticsCode || '',
      pageLayout: this.normalizePageLayout(rawData.pageLayout),
      basics: this.normalizeBasics(rawData.basics),
      work: Array.isArray(rawData.work) ? rawData.work : [],
      volunteer: Array.isArray(rawData.volunteer) ? rawData.volunteer : [],
      education: Array.isArray(rawData.education) ? rawData.education : [],
      awards: Array.isArray(rawData.awards) ? rawData.awards : [],
      certificates: Array.isArray(rawData.certificates) ? rawData.certificates : [],
      publications: Array.isArray(rawData.publications) ? rawData.publications : [],
      skills: Array.isArray(rawData.skills) ? rawData.skills : [],
      languages: Array.isArray(rawData.languages) ? rawData.languages : [],
      interests: Array.isArray(rawData.interests) ? rawData.interests : [],
      references: Array.isArray(rawData.references) ? rawData.references : [],
      projects: Array.isArray(rawData.projects) ? rawData.projects : [],
      images: rawData.images || undefined
    };

    return normalized;
  }

  /**
   * 规范化页面布局
   */
  private normalizePageLayout(layout: any): PageLayout {
    // 处理旧版本布局名称的兼容性
    if (layout === 'two-column' || layout === 'two_column') {
      return 'two';
    }
    if (layout === 'single-column' || layout === 'single_column') {
      return 'single';
    }

    // 验证新布局名称
    if (layout === 'single' || layout === 'two') {
      return layout;
    }

    // 默认布局
    return 'two';
  }

  /**
   * 规范化基本信息
   */
  private normalizeBasics(basics: any): CV['basics'] {
    if (!basics || typeof basics !== 'object') {
      throw new Error('basics字段是必需的且必须是对象');
    }

    return {
      name: basics.name || '未知姓名',
      label: basics.label || '未指定职位',
      image: basics.image,
      email: basics.email,
      phone: basics.phone,
      url: basics.url,
      summary: basics.summary,
      theme: basics.theme,
      location: basics.location,
      profiles: Array.isArray(basics.profiles) ? basics.profiles : [],
      beian: basics.beian,
      about: basics.about
    };
  }

  /**
   * 获取默认CV数据（用于错误恢复）
   */
  private getDefaultCV(): CV {
    return {
      analyticsCode: '',
      pageLayout: 'two',
      basics: {
        name: '数据加载失败',
        label: '请检查cv.json文件',
        profiles: []
      },
      work: [],
      volunteer: [],
      education: [],
      awards: [],
      certificates: [],
      publications: [],
      skills: [],
      languages: [],
      interests: [],
      references: [],
      projects: []
    };
  }

  /**
   * 清除缓存（用于开发时热重载）
   */
  clearCache(): void {
    this.cachedData = null;
    this.isLoaded = false;
  }
}

// 导出单例实例
export const cvLoader = CVDataLoader.getInstance();

/**
 * 便捷函数：加载CV数据
 */
export async function loadCV(): Promise<CV> {
  return cvLoader.loadCV();
}

/**
 * 便捷函数：获取基本信息
 */
export async function getBasics() {
  const cv = await loadCV();
  return cv.basics;
}
