import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateStory } from '@/hooks/useStories';

const NewStory: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createStory, isPending } = useCreateStory();
  const [form, setForm] = useState({
    title: '',
    summary: '',
    status: '',
    genre: '',
    target_audience: '',
    word_count: '',
    target_word_count: '',
    themes: '',
    tags: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStory(
      {
        title: form.title,
        summary: form.summary || null,
        status: form.status || null,
        genre: form.genre || null,
        target_audience: form.target_audience || null,
        word_count: form.word_count ? Number(form.word_count) : null,
        target_word_count: form.target_word_count
          ? Number(form.target_word_count)
          : null,
        themes: form.themes
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        tags: form.tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
      },
      {
        onSuccess: () => {
          navigate('/portfolio/stories');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-tech z-50 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link
            to="/portfolio/stories"
            className="mono-font font-bold text-xl tracking-wide text-foreground hover:text-accent transition-colors"
          >
            Stories
          </Link>
        </div>
      </header>
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="mono-font text-foreground">
                Create Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="mono-font"
                  required
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
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  placeholder="Status"
                  className="mono-font"
                />
                <Input
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  placeholder="Genre"
                  className="mono-font"
                />
                <Input
                  name="target_audience"
                  value={form.target_audience}
                  onChange={handleChange}
                  placeholder="Target Audience"
                  className="mono-font"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    name="word_count"
                    type="number"
                    value={form.word_count}
                    onChange={handleChange}
                    placeholder="Word Count"
                    className="mono-font"
                  />
                  <Input
                    name="target_word_count"
                    type="number"
                    value={form.target_word_count}
                    onChange={handleChange}
                    placeholder="Target Word Count"
                    className="mono-font"
                  />
                </div>
                <Input
                  name="themes"
                  value={form.themes}
                  onChange={handleChange}
                  placeholder="Themes (comma separated)"
                  className="mono-font"
                />
                <Input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="Tags (comma separated)"
                  className="mono-font"
                />
                <Button type="submit" className="mono-font" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Story'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewStory;
