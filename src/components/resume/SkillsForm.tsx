import { Skill } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [profession, setProfession] = useState('');
  const { toast } = useToast();
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate'
    };
    onChange([...data, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    onChange(data.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const removeSkill = (id: string) => {
    onChange(data.filter(skill => skill.id !== id));
  };

  const generateSkills = async () => {
    if (!profession.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your profession or industry first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-resume-content', {
        body: { 
          type: 'skills', 
          prompt: profession
        }
      });

      if (error) throw error;
      
      const skillNames = result.content.split(',').map((s: string) => s.trim());
      const newSkills = skillNames.map((name: string) => ({
        id: crypto.randomUUID(),
        name,
        level: 'Intermediate' as const
      }));
      
      onChange([...data, ...newSkills]);
      setProfession('');
      toast({
        title: "Skills Generated",
        description: `Added ${newSkills.length} relevant skills.`
      });
    } catch (error) {
      console.error('Error generating skills:', error);
      toast({
        title: "Error",
        description: "Failed to generate skills. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const skillLevels: Skill['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter your profession/industry (e.g., Software Developer, Marketing Manager)"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={generateSkills}
            disabled={isGenerating}
            variant="outline"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            AI Generate
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Skills</h3>
          <Button onClick={addSkill} size="sm" className="bg-gradient-to-r from-accent to-accent/80">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((skill) => (
          <div key={skill.id} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg bg-card/50">
            <div className="flex-1">
              <Input
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                placeholder="JavaScript"
                className="border-none bg-transparent p-0 focus-visible:ring-0"
              />
            </div>
            <div className="w-32">
              <Select
                value={skill.level}
                onValueChange={(value) => updateSkill(skill.id, 'level', value as Skill['level'])}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => removeSkill(skill.id)}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {data.length > 0 && (
        <div className="mt-4">
          <Label className="text-sm text-muted-foreground">Preview:</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.filter(skill => skill.name.trim()).map((skill) => (
              <Badge key={skill.id} variant="secondary" className="text-xs">
                {skill.name} - {skill.level}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No skills added yet. Click "Add Skill" to get started.</p>
        </div>
      )}
    </div>
  );
};