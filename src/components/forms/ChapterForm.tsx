import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { SecureFileUpload } from '@/components/security/SecureFileUpload';

export interface ChapterFormValues {
  story_id: string;
  chapter_number: number | string;
  title: string;
  summary?: string;
  content_plain?: string;
  status?: string;
  themes: string;
  linked_characters: string[];
  linked_locations: string;
}

interface ChapterFormProps {
  defaultValues?: Partial<ChapterFormValues> & { cover_image_url?: string | null };
  onSubmit: (values: Omit<ChapterFormValues, 'themes' | 'linked_locations'> & {
    themes: string[];
    linked_locations: string[];
    cover_image_url: string | null;
  }) => void;
}

interface StoryOption {
  id: string;
  title: string;
}

interface CharacterOption {
  id: string;
  full_name: string;
}

export const ChapterForm: React.FC<ChapterFormProps> = ({
  defaultValues,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChapterFormValues>({
    defaultValues: {
      story_id: defaultValues?.story_id || '',
      chapter_number: defaultValues?.chapter_number || '',
      title: defaultValues?.title || '',
      summary: defaultValues?.summary || '',
      content_plain: defaultValues?.content_plain || '',
      status: defaultValues?.status || '',
      themes: Array.isArray(defaultValues?.themes)
        ? (defaultValues?.themes as unknown as string[]).join(', ')
        : (defaultValues?.themes as unknown as string) || '',
      linked_characters: defaultValues?.linked_characters || [],
      linked_locations: Array.isArray(defaultValues?.linked_locations)
        ? (defaultValues?.linked_locations as unknown as string[]).join(', ')
        : (defaultValues?.linked_locations as unknown as string) || '',
    },
  });

  const [stories, setStories] = useState<StoryOption[]>([]);
  const [characters, setCharacters] = useState<CharacterOption[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    defaultValues?.cover_image_url || ''
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data: storiesData } = await supabase
        .from('stories')
        .select('id, title')
        .order('title');
      setStories(storiesData || []);

      const { data: charData } = await supabase
        .from('character_profiles')
        .select('id, full_name')
        .order('full_name');
      setCharacters(charData || []);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (defaultValues?.linked_characters) {
      setValue('linked_characters', defaultValues.linked_characters);
    }
  }, [defaultValues?.linked_characters, setValue]);

  const handleFileUpload = (
    results: Array<{ success: boolean; url?: string }>
  ) => {
    if (results.length > 0 && results[0].success && results[0].url) {
      setCoverImageUrl(results[0].url);
    }
  };

  const submit = handleSubmit((data) => {
    onSubmit({
      story_id: data.story_id,
      chapter_number: Number(data.chapter_number),
      title: data.title,
      summary: data.summary || null,
      content_plain: data.content_plain || null,
      status: data.status || null,
      themes: data.themes
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      linked_characters: data.linked_characters,
      linked_locations: data.linked_locations
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      cover_image_url: coverImageUrl || null,
    });
  });

  const selectedChars = watch('linked_characters');

  const toggleCharacter = (id: string, checked: boolean | 'indeterminate') => {
    const current = selectedChars || [];
    if (checked) {
      if (!current.includes(id)) {
        setValue('linked_characters', [...current, id]);
      }
    } else {
      setValue(
        'linked_characters',
        current.filter((c) => c !== id)
      );
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mono-font block mb-2">
          Story*
        </label>
        <select
          {...register('story_id', { required: true })}
          className="mono-font w-full border rounded-md p-2 bg-background"
        >
          <option value="">Select story</option>
          {stories.map((story) => (
            <option key={story.id} value={story.id}>
              {story.title}
            </option>
          ))}
        </select>
        {errors.story_id && (
          <p className="text-destructive text-sm mt-1">Story is required</p>
        )}
      </div>
      <Input
        {...register('chapter_number', { required: true })}
        type="number"
        placeholder="Chapter Number*"
        className="mono-font"
      />
      <Input
        {...register('title', { required: true })}
        placeholder="Title*"
        className="mono-font"
      />
      <Textarea
        {...register('summary')}
        placeholder="Summary"
        rows={2}
        className="mono-font"
      />
      <Textarea
        {...register('content_plain')}
        placeholder="Content"
        rows={4}
        className="mono-font"
      />
      <Input
        {...register('status')}
        placeholder="Status"
        className="mono-font"
      />
      <Input
        {...register('themes')}
        placeholder="Themes (comma separated)"
        className="mono-font"
      />
      <div>
        <label className="text-sm font-medium text-foreground mono-font block mb-2">
          Linked Characters
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded-md">
          {characters.map((char) => (
            <label key={char.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedChars?.includes(char.id)}
                onCheckedChange={(checked) => toggleCharacter(char.id, checked)}
              />
              <span>{char.full_name}</span>
            </label>
          ))}
        </div>
      </div>
      <Input
        {...register('linked_locations')}
        placeholder="Linked Locations (comma separated)"
        className="mono-font"
      />
      <div>
        <label className="text-sm font-medium text-foreground mono-font block mb-2">
          Cover Image
        </label>
        {!coverImageUrl ? (
          <SecureFileUpload
            accept="image/*"
            maxSize={10 * 1024 * 1024}
            maxFiles={1}
            allowedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
            uploadToStorage
            storageBucket="documents"
            storageFolder="chapter-covers"
            onFilesUploaded={handleFileUpload}
          />
        ) : (
          <div className="space-y-2">
            <img
              src={coverImageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setCoverImageUrl('')}
              className="w-full mono-font"
            >
              Change Image
            </Button>
          </div>
        )}
      </div>
      <Button type="submit" className="mono-font">
        Save Chapter
      </Button>
    </form>
  );
};

export default ChapterForm;
