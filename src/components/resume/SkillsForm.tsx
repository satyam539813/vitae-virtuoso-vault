import { Skill } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
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

  const skillLevels: Skill['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button onClick={addSkill} size="sm" className="bg-gradient-to-r from-accent to-accent/80">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
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