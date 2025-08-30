import { ResumeData } from '@/types/resume';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase, GraduationCap, Zap } from 'lucide-react';

interface ResumeEditorProps {
  resumeData: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData,
  onDataChange
}) => {
  return (
    <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground">
          Build Your Resume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Work</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Education</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <PersonalInfoForm
              data={resumeData.personalInfo}
              onChange={(personalInfo) => 
                onDataChange({ ...resumeData, personalInfo })
              }
            />
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <ExperienceForm
              data={resumeData.experience}
              onChange={(experience) => 
                onDataChange({ ...resumeData, experience })
              }
            />
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <EducationForm
              data={resumeData.education}
              onChange={(education) => 
                onDataChange({ ...resumeData, education })
              }
            />
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <SkillsForm
              data={resumeData.skills}
              onChange={(skills) => 
                onDataChange({ ...resumeData, skills })
              }
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};