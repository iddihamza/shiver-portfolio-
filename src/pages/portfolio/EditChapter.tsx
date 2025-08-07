import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChapter, useUpdateChapter } from '@/hooks/useChapters';
import ChapterForm, { ChapterFormValues } from '@/components/forms/ChapterForm';

const EditChapter: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: chapter } = useChapter(id || '');
  const { mutate: updateChapter } = useUpdateChapter();

  const handleSubmit = (values: Omit<ChapterFormValues, 'themes' | 'linked_locations'> & {
    themes: string[];
    linked_locations: string[];
    cover_image_url: string | null;
  }) => {
    if (!id) return;
    updateChapter({ id, ...values, chapter_number: Number(values.chapter_number) }, {
      onSuccess: (data) => {
        navigate(`/story/${data.id}`);
      },
    });
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
              <CardTitle className="mono-font text-foreground">Edit Chapter</CardTitle>
            </CardHeader>
            <CardContent>
              {chapter && (
                <ChapterForm onSubmit={handleSubmit} defaultValues={{
                  story_id: chapter.story_id,
                  chapter_number: chapter.chapter_number,
                  title: chapter.title,
                  summary: chapter.summary || '',
                  content_plain: chapter.content_plain || '',
                  status: chapter.status || '',
                  themes: Array.isArray(chapter.themes) ? chapter.themes.join(', ') : chapter.themes || '',
                  linked_characters: chapter.linked_characters || [],
                  linked_locations: Array.isArray(chapter.linked_locations) ? chapter.linked_locations.join(', ') : chapter.linked_locations || '',
                  cover_image_url: chapter.cover_image_url || null
                }} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditChapter;
