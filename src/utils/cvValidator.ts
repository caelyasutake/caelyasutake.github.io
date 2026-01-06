import type { ValidationResult, PageLayout } from "@/cv.d.ts";

/**
 * CV数据验证器
 * 用于验证cv.json文件的数据结构和完整性
 */
export class CVValidator {
  private errors: string[] = [];
  private warnings: string[] = [];

  /**
   * 验证CV数据
   */
  validate(data: any): ValidationResult {
    this.errors = [];
    this.warnings = [];

    try {
      this.validateBasicStructure(data);
      this.validatePageLayout(data.pageLayout);
      this.validateBasics(data.basics);
      this.validateOptionalArrays(data);
      this.validateImages(data.images);
    } catch (error) {
      this.errors.push(
        `验证过程中出现错误: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  /**
   * 验证基本结构
   */
  private validateBasicStructure(data: any): void {
    if (!data || typeof data !== "object") {
      throw new Error("CV数据必须是一个对象");
    }

    if (!data.basics) {
      this.errors.push("缺少必需的 basics 字段");
    }
  }

  /**
   * 验证页面布局
   */
  private validatePageLayout(pageLayout: any): void {
    const validLayouts: PageLayout[] = ["single", "two"];

    if (!pageLayout) {
      this.warnings.push('未指定 pageLayout，将使用默认值 "two"');
      return;
    }

    if (!validLayouts.includes(pageLayout)) {
      this.errors.push(
        `无效的页面布局: ${pageLayout}。有效值为: ${validLayouts.join(", ")}`,
      );
    }
  }

  /**
   * 验证基本信息
   */
  private validateBasics(basics: any): void {
    if (!basics) return;

    if (!basics.name || typeof basics.name !== "string") {
      this.errors.push("basics.name 是必需的字符串字段");
    }

    if (!basics.label || typeof basics.label !== "string") {
      this.errors.push("basics.label 是必需的字符串字段");
    }

    // 验证可选字段的类型
    if (basics.email && typeof basics.email !== "string") {
      this.errors.push("basics.email 必须是字符串");
    }

    if (basics.url && typeof basics.url !== "string") {
      this.errors.push("basics.url 必须是字符串");
    }

    if (basics.theme && typeof basics.theme !== "string") {
      this.errors.push("basics.theme 必须是字符串");
    }

    // 验证profiles数组
    if (basics.profiles && Array.isArray(basics.profiles)) {
      basics.profiles.forEach((profile: any, index: number) => {
        if (!profile.network || !profile.username) {
          this.warnings.push(
            `profiles[${index}] 缺少 network 或 username 字段`,
          );
        }
      });
    }

    // 验证about字段
    if (basics.about) {
      this.validateAbout(basics.about);
    }
  }

  /**
   * 验证about字段
   */
  private validateAbout(about: any): void {
    if (!about || typeof about !== "object") {
      this.errors.push("basics.about 必须是对象类型");
      return;
    }

    // 验证personalInfo数组
    if (about.personalInfo && Array.isArray(about.personalInfo)) {
      about.personalInfo.forEach((info: any, index: number) => {
        if (!info.emoji || !info.label || !info.value) {
          this.errors.push(
            `about.personalInfo[${index}] 缺少必需字段: emoji, label, value`,
          );
        }
        if (info.color && typeof info.color !== "string") {
          this.warnings.push(
            `about.personalInfo[${index}].color 应该是字符串类型`,
          );
        }
      });
    }

    // 验证traits数组
    if (about.traits && Array.isArray(about.traits)) {
      about.traits.forEach((trait: any, index: number) => {
        if (!trait.emoji || !trait.text) {
          this.errors.push(`about.traits[${index}] 缺少必需字段: emoji, text`);
        }
        if (trait.color && typeof trait.color !== "string") {
          this.warnings.push(`about.traits[${index}].color 应该是字符串类型`);
        }
      });
    }

    // 验证highlights数组
    if (about.highlights && Array.isArray(about.highlights)) {
      about.highlights.forEach((highlight: any, index: number) => {
        if (!highlight.emoji || !highlight.text) {
          this.errors.push(
            `about.highlights[${index}] 缺少必需字段: emoji, text`,
          );
        }
        if (highlight.color && typeof highlight.color !== "string") {
          this.warnings.push(
            `about.highlights[${index}].color 应该是字符串类型`,
          );
        }
      });
    }

    // 验证quote对象
    if (about.quote) {
      if (!about.quote.text || typeof about.quote.text !== "string") {
        this.errors.push("about.quote.text 是必需的字符串字段");
      }

      if (about.quote.values && Array.isArray(about.quote.values)) {
        about.quote.values.forEach((value: any, index: number) => {
          if (!value.emoji || !value.label) {
            this.errors.push(
              `about.quote.values[${index}] 缺少必需字段: emoji, label`,
            );
          }
          if (value.color && typeof value.color !== "string") {
            this.warnings.push(
              `about.quote.values[${index}].color 应该是字符串类型`,
            );
          }
        });
      }
    }

    // 验证向后兼容的tags数组
    if (about.tags && Array.isArray(about.tags)) {
      about.tags.forEach((tag: any, index: number) => {
        if (!tag.icon || !tag.text) {
          this.warnings.push(
            `about.tags[${index}] 缺少字段: icon, text (建议迁移到新的数据结构)`,
          );
        }
      });
    }
  }

  /**
   * 验证可选数组字段
   */
  private validateOptionalArrays(data: any): void {
    const arrayFields = [
      "work",
      "education",
      "skills",
      "projects",
      "certificates",
      "languages",
    ];

    arrayFields.forEach((field) => {
      if (data[field] && !Array.isArray(data[field])) {
        this.errors.push(`${field} 必须是数组类型`);
      }
    });

    // 验证work数组
    if (data.work && Array.isArray(data.work)) {
      data.work.forEach((job: any, index: number) => {
        if (!job.name || !job.position || !job.startDate) {
          this.errors.push(
            `work[${index}] 缺少必需字段: name, position, startDate`,
          );
        }
      });
    }

    // 验证education数组
    if (data.education && Array.isArray(data.education)) {
      data.education.forEach((edu: any, index: number) => {
        if (!edu.institution || !edu.area || !edu.studyType) {
          this.errors.push(
            `education[${index}] 缺少必需字段: institution, area, studyType`,
          );
        }
      });
    }

    // 验证skills数组
    if (data.skills && Array.isArray(data.skills)) {
      data.skills.forEach((skill: any, index: number) => {
        if (!skill.name) {
          this.errors.push(`skills[${index}] 缺少必需字段: name`);
        }
      });
    }

    // 验证projects数组
    if (data.projects && Array.isArray(data.projects)) {
      data.projects.forEach((project: any, index: number) => {
        if (!project.name || !project.description) {
          this.errors.push(
            `projects[${index}] 缺少必需字段: name, description`,
          );
        }
      });
    }
  }

  /**
   * 验证图片配置
   */
  private validateImages(images: any): void {
    if (!images) return;

    if (images.list && Array.isArray(images.list)) {
      images.list.forEach((img: any, index: number) => {
        if (!img.image) {
          this.errors.push(`images.list[${index}] 缺少必需字段: image`);
        }
      });
    }
  }
}

/**
 * 快捷验证函数
 */
export function validateCV(data: any): ValidationResult {
  const validator = new CVValidator();
  return validator.validate(data);
}
