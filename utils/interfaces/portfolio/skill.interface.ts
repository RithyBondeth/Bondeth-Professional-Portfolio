/**
 * Proficiency level, shown as a filled-dot meter:
 * 3 = Expert, 2 = Proficient, 1 = Familiar.
 */
export type TSkillLevel = 1 | 2 | 3;

export interface ISkill {
  name: string;
  icon: string;
  /** Brand colour. Used as-is in dark mode, and in light mode unless
   *  {@link ISkill.colorLight} overrides it. */
  color: string;
  /**
   * Light-mode override for brands whose colour is white or near-white, which
   * would otherwise vanish against a light card. Only set it where needed —
   * everything else reads fine on both grounds.
   */
  colorLight?: string;
  level: TSkillLevel;
}

export interface ISkillGroup {
  category: string;
  skills: ISkill[];
}
