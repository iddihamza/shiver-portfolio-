import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateLocation } from '@/hooks/useLocations';
import { useStories } from '@/hooks/useStories';

const NewLocation: React.FC = () => {
  const navigate = useNavigate();
  const { data: stories } = useStories();
  const { mutate: createLocation, isPending } = useCreateLocation();
  const [form, setForm] = useState({
    story_id: 'none',
    name: '',
    location_type: '',
    primary_function: '',
    summary: '',
    key_scenes: '',
    story_importance: '',
    visual_mood: '',
    sensory_details: '',
    weather_effects: '',
    cultural_feel: '',
    core_symbolism: '',
    recurring_motifs: '',
    emotional_weight: '',
    notes: '',
    connected_characters: '',
    related_artifacts: '',
    visual_references: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLocation(
      {
        story_id: form.story_id === 'none' ? null : form.story_id,
        name: form.name,
        location_type: form.location_type || null,
        primary_function: form.primary_function || null,
        summary: form.summary || null,
        key_scenes: form.key_scenes
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        story_importance: form.story_importance || null,
        visual_mood: form.visual_mood || null,
        sensory_details: form.sensory_details || null,
        weather_effects: form.weather_effects || null,
        cultural_feel: form.cultural_feel || null,
        core_symbolism: form.core_symbolism || null,
        recurring_motifs: form.recurring_motifs
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        emotional_weight: form.emotional_weight || null,
        notes: form.notes || null,
        connected_characters: form.connected_characters
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        related_artifacts: form.related_artifacts
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        visual_references: form.visual_references
          ? JSON.parse(form.visual_references)
          : null,
      },
      {
        onSuccess: data => {
          navigate(`/location/${data.id}`);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-tech z-50 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link to="/locations" className="mono-font font-bold text-xl tracking-wide text-foreground hover:text-accent transition-colors">
            Locations
          </Link>
        </div>
      </header>
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="mono-font text-foreground">Create Location</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mono-font block mb-2">
                    Story (Optional)
                  </label>
                  <Select value={form.story_id} onValueChange={(value) => setForm(prev => ({ ...prev, story_id: value }))}>
                    <SelectTrigger className="mono-font">
                      <SelectValue placeholder="Select a story" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (General Location)</SelectItem>
                      {stories?.map((story) => (
                        <SelectItem key={story.id} value={story.id}>
                          {story.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name*"
                  className="mono-font"
                  required
                />
                <Input
                  name="location_type"
                  value={form.location_type}
                  onChange={handleChange}
                  placeholder="Location Type"
                  className="mono-font"
                />
                <Input
                  name="primary_function"
                  value={form.primary_function}
                  onChange={handleChange}
                  placeholder="Primary Function"
                  className="mono-font"
                />
                <Textarea
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  placeholder="Summary"
                  rows={2}
                  className="mono-font"
                />
                <Input
                  name="story_importance"
                  value={form.story_importance}
                  onChange={handleChange}
                  placeholder="Story Importance"
                  className="mono-font"
                />
                <Input
                  name="visual_mood"
                  value={form.visual_mood}
                  onChange={handleChange}
                  placeholder="Visual Mood"
                  className="mono-font"
                />
                <Textarea
                  name="sensory_details"
                  value={form.sensory_details}
                  onChange={handleChange}
                  placeholder="Sensory Details"
                  rows={2}
                  className="mono-font"
                />
                <Input
                  name="weather_effects"
                  value={form.weather_effects}
                  onChange={handleChange}
                  placeholder="Weather Effects"
                  className="mono-font"
                />
                <Input
                  name="cultural_feel"
                  value={form.cultural_feel}
                  onChange={handleChange}
                  placeholder="Cultural Feel"
                  className="mono-font"
                />
                <Input
                  name="core_symbolism"
                  value={form.core_symbolism}
                  onChange={handleChange}
                  placeholder="Core Symbolism"
                  className="mono-font"
                />
                <Input
                  name="recurring_motifs"
                  value={form.recurring_motifs}
                  onChange={handleChange}
                  placeholder="Recurring Motifs (comma separated)"
                  className="mono-font"
                />
                <Input
                  name="emotional_weight"
                  value={form.emotional_weight}
                  onChange={handleChange}
                  placeholder="Emotional Weight"
                  className="mono-font"
                />
                <Textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Notes"
                  rows={2}
                  className="mono-font"
                />
                <Input
                  name="key_scenes"
                  value={form.key_scenes}
                  onChange={handleChange}
                  placeholder="Key Scenes (comma separated)"
                  className="mono-font"
                />
                <Input
                  name="connected_characters"
                  value={form.connected_characters}
                  onChange={handleChange}
                  placeholder="Connected Characters (comma separated)"
                  className="mono-font"
                />
                <Input
                  name="related_artifacts"
                  value={form.related_artifacts}
                  onChange={handleChange}
                  placeholder="Related Artifacts (comma separated)"
                  className="mono-font"
                />
                <Textarea
                  name="visual_references"
                  value={form.visual_references}
                  onChange={handleChange}
                  placeholder="Visual References JSON"
                  rows={2}
                  className="mono-font"
                />
                <Button type="submit" className="mono-font" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Location'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewLocation;
