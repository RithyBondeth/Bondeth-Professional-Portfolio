/**
 * Proficiency level, shown as a filled-dot meter:
 * 3 = Expert, 2 = Proficient, 1 = Familiar.
 */
export type TSkillLevel = 1 | 2 | 3;

export interface ISkill {
  name: string;
  icon: string;
  color: string;
  level: TSkillLevel;
}

export interface ISkillGroup {
  category: string;
  skills: ISkill[];
}
