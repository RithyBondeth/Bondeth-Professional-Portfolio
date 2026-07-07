export interface ISkill {
  name: string;
  icon: string;
  color: string;
}

export interface ISkillGroup {
  category: string;
  skills: ISkill[];
}
