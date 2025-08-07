import React from 'react';
import { Button } from '@/components/ui/button';
import { useCharacterProfiles } from '@/hooks/useCharacters';
import { useStories } from '@/hooks/useStories';

const ChapterForm: React.FC = () => {
  const {
    data: characters = [],
    isLoading: charactersLoading,
    error: charactersError,
  } = useCharacterProfiles();
  const {
    data: stories = [],
    isLoading: storiesLoading,
    error: storiesError,
  } = useStories();

  if (charactersLoading || storiesLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
        <p className="text-muted-foreground mt-4">Loading form data...</p>
      </div>
    );
  }

  if (charactersError || storiesError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Error loading form data. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="story" className="mono-font block mb-2">
          Story
        </label>
        <select id="story" name="story" className="mono-font bg-stone-950 border rounded w-full p-2">
          {stories.map((story) => (
            <option key={story.id} value={story.id}>
              {story.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="characters" className="mono-font block mb-2">
          Characters
        </label>
        <select
          id="characters"
          name="characters"
          multiple
          className="mono-font bg-stone-950 border rounded w-full p-2"
        >
          {characters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </select>
      </div>

      {/* Additional form fields would go here */}
    </form>
  );
};

export default ChapterForm;
