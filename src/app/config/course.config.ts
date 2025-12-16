import { CourseStructure } from '../models/course-structure';
import { WrongExampleComponent } from '../components/ai-ux-foundations/human-centered-ai-principles/wrong-example/wrong-example';
import { RightExampleComponent } from '../components/ai-ux-foundations/human-centered-ai-principles/right-example/right-example';
import { RecruitmentWrongComponent } from '../components/ai-ux-foundations/human-centered-ai-principles/recruitment-wrong/recruitment-wrong';
import { RecruitmentRightComponent } from '../components/ai-ux-foundations/human-centered-ai-principles/recruitment-right/recruitment-right';
import { SupportWrongComponent } from '../components/ai-ux-foundations/human-centered-ai-principles/support-wrong/support-wrong';
import { SupportRightComponent } from '../components/ai-ux-foundations/human-centered-ai-principles/support-right/support-right';

export const COURSE_CONFIG: CourseStructure = {
  title: 'AI Fundamentals for UX',
  chapters: [
    {
      id: 'ai-ux-foundations',
      title: 'AI & UX Foundations',
      subchapters: [
        {
          id: 'human-centered-ai-principles',
          title: 'Human-Centered AI Principles',
          examples: [
            {
              id: 'mindset',
              title: 'Human-Centered Mindset',
              wrongComponent: WrongExampleComponent,
              rightComponent: RightExampleComponent,
            },
            {
              id: 'recruitment',
              title: 'Value Alignment in AI Design',
              wrongComponent: RecruitmentWrongComponent,
              rightComponent: RecruitmentRightComponent,
            },
            {
              id: 'support',
              title: 'AI Augmentation: Humans + AI',
              wrongComponent: SupportWrongComponent,
              rightComponent: SupportRightComponent,
            },
          ],
        },
      ],
    },
    {
      id: 'user-expectations-value',
      title: 'User Expectations & Value',
      subchapters: [],
    },
  ],
};
