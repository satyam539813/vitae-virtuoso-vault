import { useState } from 'react';
import { ResumeEditor } from '@/components/resume/ResumeEditor';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { ResumeData, PersonalInfo, Experience, Education, Skill } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

const initialPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  summary: ''
};

const Index = () => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: initialPersonalInfo,
    experience: [],
    education: [],
    skills: []
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent-light/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
                <p className="text-muted-foreground text-sm">Create your professional resume</p>
              </div>
            </div>
            <Button 
              onClick={handlePrint}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <ResumeEditor 
                resumeData={resumeData}
                onDataChange={setResumeData}
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl shadow-elegant p-8 print:shadow-none print:p-0">
              <ResumePreview resumeData={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;