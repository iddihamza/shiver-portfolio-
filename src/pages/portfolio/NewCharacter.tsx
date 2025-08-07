import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateCharacterProfile } from '@/hooks/useCharacters';
import { useStories } from '@/hooks/useStories';
import { SecureFileUpload } from '@/components/security/SecureFileUpload';
import { supabase } from '@/integrations/supabase/client';
const NewCharacter: React.FC = () => {
  const navigate = useNavigate();
  const { data: stories } = useStories();
  const {
    mutate: createProfile,
    isPending
  } = useCreateCharacterProfile();
  const [form, setForm] = useState({
    story_id: 'none',
    full_name: '',
    title: '',
    aliases_nicknames: '',
    species_race: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    summary_tagline: '',
    core_motivation: '',
    backstory: '',
    role_in_story: '',
    notable_traits: '',
    affiliations: ''
  });
  const [imageUrl, setImageUrl] = useState('');
  const [abilities, setAbilities] = useState([{
    ability_type: 'power',
    name: '',
    description: ''
  }]);
  const [relationships, setRelationships] = useState([{
    relationship_type: 'ally',
    character_name: '',
    description: '',
    related_character_id: '',
    is_bidirectional: false
  }]);
  const [inspirations, setInspirations] = useState([{
    influence_name: '',
    influence_type: '',
    why_they_matter: ''
  }]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAbilityChange = (index: number, field: string, value: string) => {
    setAbilities(prev => prev.map((a, i) => i === index ? {
      ...a,
      [field]: value
    } : a));
  };
  const handleRelationshipChange = (index: number, field: string, value: string | boolean) => {
    setRelationships(prev => prev.map((r, i) => i === index ? {
      ...r,
      [field]: value
    } : r));
  };
  const handleInspirationChange = (index: number, field: string, value: string) => {
    setInspirations(prev => prev.map((ins, i) => i === index ? {
      ...ins,
      [field]: value
    } : ins));
  };
  const handleFileUpload = (results: Array<{
    success: boolean;
    url?: string;
  }>) => {
    if (results.length > 0 && results[0].success && results[0].url) {
      setImageUrl(results[0].url);
    }
  };
  const addAbility = () => setAbilities(prev => [...prev, {
    ability_type: 'power',
    name: '',
    description: ''
  }]);
  const addRelationship = () => setRelationships(prev => [...prev, {
    relationship_type: 'ally',
    character_name: '',
    description: '',
    related_character_id: '',
    is_bidirectional: false
  }]);
  const addInspiration = () => setInspirations(prev => [...prev, {
    influence_name: '',
    influence_type: '',
    why_they_matter: ''
  }]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProfile({
      story_id: form.story_id === 'none' ? null : form.story_id,
      full_name: form.full_name,
      title: form.title || null,
      aliases_nicknames: form.aliases_nicknames || null,
      species_race: form.species_race || null,
      gender: form.gender || null,
      age: form.age || null,
      height: form.height || null,
      weight: form.weight || null,
      summary_tagline: form.summary_tagline || null,
      core_motivation: form.core_motivation || null,
      backstory: form.backstory || null,
      role_in_story: form.role_in_story || null,
      notable_traits_array: form.notable_traits.split(',').map(t => t.trim()).filter(Boolean),
      affiliations_array: form.affiliations.split(',').map(t => t.trim()).filter(Boolean),
      img_url: imageUrl || null
    }, {
      onSuccess: async data => {
        if (abilities.length) {
          await supabase.from('character_abilities').insert(abilities.map(a => ({
            ...a,
            character_id: data.id
          })));
        }
        if (relationships.length) {
          await supabase.from('character_relationships').insert(relationships.map(r => ({
            ...r,
            character_id: data.id
          })));
        }
        if (inspirations.length) {
          await supabase.from('character_inspirations').insert(inspirations.map(i => ({
            ...i,
            character_id: data.id
          })));
        }
        navigate(`/character/${data.id}`);
      }
    });
  };
  return <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-tech z-50 border-b border-border">
        <div className="flex justify-between items-center px-8 py-4">
          <Link to="/characters" className="mono-font font-bold text-xl tracking-wide text-foreground hover:text-accent transition-colors">
            Characters
          </Link>
        </div>
      </header>
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="mono-font text-foreground">Create Character Profile</CardTitle>
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
                      <SelectItem value="none">None (General Character)</SelectItem>
                      {stories?.map((story) => (
                        <SelectItem key={story.id} value={story.id}>
                          {story.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name*" className="mono-font" required />
                <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="mono-font" />
                <Input name="aliases_nicknames" value={form.aliases_nicknames} onChange={handleChange} placeholder="Aliases or Nicknames" className="mono-font" />
                <Input name="species_race" value={form.species_race} onChange={handleChange} placeholder="Species or Race" className="mono-font" />
                <Input name="gender" value={form.gender} onChange={handleChange} placeholder="Gender" className="mono-font" />
                <div className="grid grid-cols-3 gap-2">
                  <Input name="age" value={form.age} onChange={handleChange} placeholder="Age" className="mono-font" />
                  <Input name="height" value={form.height} onChange={handleChange} placeholder="Height" className="mono-font" />
                  <Input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight" className="mono-font" />
                </div>
                <Textarea name="summary_tagline" value={form.summary_tagline} onChange={handleChange} placeholder="Summary or Tagline" rows={2} className="mono-font" />
                <Textarea name="core_motivation" value={form.core_motivation} onChange={handleChange} placeholder="Core Motivation" rows={2} className="mono-font" />
                <Textarea name="backstory" value={form.backstory} onChange={handleChange} placeholder="Backstory" rows={4} className="mono-font" />
                <Textarea name="role_in_story" value={form.role_in_story} onChange={handleChange} placeholder="Role in Story" rows={2} className="mono-font" />
                <Input name="notable_traits" value={form.notable_traits} onChange={handleChange} placeholder="Notable Traits (comma separated)" className="mono-font" />
                <Input name="affiliations" value={form.affiliations} onChange={handleChange} placeholder="Affiliations (comma separated)" className="mono-font" />

                <div className="space-y-2">
                  <h3 className="mono-font font-medium">Abilities</h3>
                  {abilities.map((ability, idx) => <div key={idx} className="grid grid-cols-3 gap-2">
                      <select value={ability.ability_type} onChange={e => handleAbilityChange(idx, 'ability_type', e.target.value)} className="mono-font border rounded p-2 bg-stone-950">
                        <option value="power">Power</option>
                        <option value="skill">Skill</option>
                      </select>
                      <Input value={ability.name} onChange={e => handleAbilityChange(idx, 'name', e.target.value)} placeholder="Name" className="mono-font" />
                      <Input value={ability.description} onChange={e => handleAbilityChange(idx, 'description', e.target.value)} placeholder="Description" className="mono-font" />
                    </div>)}
                  <Button type="button" variant="outline" onClick={addAbility} className="mono-font">Add Ability</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="mono-font font-medium">Relationships</h3>
                  {relationships.map((rel, idx) => <div key={idx} className="grid grid-cols-5 gap-2">
                      <select value={rel.relationship_type} onChange={e => handleRelationshipChange(idx, 'relationship_type', e.target.value)} className="mono-font border rounded p-2 bg-stone-950">
                        <option value="ally">Ally</option>
                        <option value="rival">Rival</option>
                        <option value="antagonist">Antagonist</option>
                        <option value="romantic_connection">Romantic</option>
                        <option value="linked_character">Linked</option>
                      </select>
                      <Input value={rel.character_name} onChange={e => handleRelationshipChange(idx, 'character_name', e.target.value)} placeholder="Character Name" className="mono-font" />
                      <Input value={rel.description} onChange={e => handleRelationshipChange(idx, 'description', e.target.value)} placeholder="Description" className="mono-font" />
                      <Input value={rel.related_character_id} onChange={e => handleRelationshipChange(idx, 'related_character_id', e.target.value)} placeholder="Related ID" className="mono-font" />
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={rel.is_bidirectional} onChange={e => handleRelationshipChange(idx, 'is_bidirectional', e.target.checked)} className="bg-cyan-400 rounded-lg" />
                        <span className="mono-font text-sm">Bidirectional</span>
                      </div>
                    </div>)}
                  <Button type="button" variant="outline" onClick={addRelationship} className="mono-font">Add Relationship</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="mono-font font-medium">Inspirations</h3>
                  {inspirations.map((ins, idx) => <div key={idx} className="grid grid-cols-3 gap-2">
                      <Input value={ins.influence_name} onChange={e => handleInspirationChange(idx, 'influence_name', e.target.value)} placeholder="Name" className="mono-font" />
                      <Input value={ins.influence_type} onChange={e => handleInspirationChange(idx, 'influence_type', e.target.value)} placeholder="Type" className="mono-font" />
                      <Input value={ins.why_they_matter} onChange={e => handleInspirationChange(idx, 'why_they_matter', e.target.value)} placeholder="Why they matter" className="mono-font" />
                    </div>)}
                  <Button type="button" variant="outline" onClick={addInspiration} className="mono-font">Add Inspiration</Button>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mono-font block mb-2">
                    Profile Image
                  </label>
                  {!imageUrl ? <SecureFileUpload accept="image/*" maxSize={10 * 1024 * 1024} maxFiles={1} allowedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']} uploadToStorage storageBucket="documents" storageFolder="character-profiles" onFilesUploaded={handleFileUpload} /> : <div className="space-y-2">
                      <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <Button type="button" variant="outline" onClick={() => setImageUrl('')} className="w-full mono-font">
                        Change Image
                      </Button>
                    </div>}
                </div>
                <Button type="submit" className="mono-font" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Character'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default NewCharacter;