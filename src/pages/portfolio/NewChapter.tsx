import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateChapter } from '@/hooks/useChapters';
import ChapterForm, { ChapterFormValues } from '@/components/forms/ChapterForm';

const NewChapter: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createChapter } = useCreateChapter();

  const handleSubmit = (values: Omit<ChapterFormValues, 'themes' | 'linked_locations'> & {
    themes: string[];
    linked_locations: string[];
    cover_image_url: string | null;
  }) => {
    createChapter({ ...values, chapter_number: Number(values.chapter_number) }, {
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
              <CardTitle className="mono-font text-foreground">Create Chapter</CardTitle>
            </CardHeader>
            <CardContent>
              <ChapterForm onSubmit={handleSubmit} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewChapter;
