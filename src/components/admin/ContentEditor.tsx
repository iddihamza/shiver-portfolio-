import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Edit3, Save, X, Plus, Trash2, RefreshCw } from 'lucide-react';

interface PageContent {
  id: string;
  page_id: string;
  section_key: string;
  content: string;
  content_type: string;
  created_at: string;
  updated_at: string;
}

export const ContentEditor: React.FC = () => {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newContent, setNewContent] = useState({
    page_id: '',
    section_key: '',
    content: '',
    content_type: 'text'
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const { hasRole } = useAuth();

  const isAdmin = hasRole('admin');

  useEffect(() => {
    if (isAdmin) {
      fetchAllContent();
    }
  }, [isAdmin]);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_id', { ascending: true })
        .order('section_key', { ascending: true });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (id: string, updatedContent: string) => {
    try {
      const { error } = await supabase
        .from('page_content')
        .update({ 
          content: updatedContent,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;

      setContents(prev => prev.map(item => 
        item.id === id ? { ...item, content: updatedContent } : item
      ));
      setEditingId(null);
      toast.success('Content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  };

  const createContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .insert({
          ...newContent,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setContents(prev => [...prev, data]);
      setNewContent({ page_id: '', section_key: '', content: '', content_type: 'text' });
      setShowNewForm(false);
      toast.success('Content created successfully');
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content');
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContents(prev => prev.filter(item => item.id !== id));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            You need admin access to manage content.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            Loading content...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Editor</h2>
          <p className="text-muted-foreground">Manage all editable content across the site</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAllContent} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button onClick={() => setShowNewForm(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Content
          </Button>
        </div>
      </div>

      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Add New Content
              <Button onClick={() => setShowNewForm(false)} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Page ID</label>
                <Input
                  value={newContent.page_id}
                  onChange={(e) => setNewContent(prev => ({ ...prev, page_id: e.target.value }))}
                  placeholder="e.g., index, about, contact"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Section Key</label>
                <Input
                  value={newContent.section_key}
                  onChange={(e) => setNewContent(prev => ({ ...prev, section_key: e.target.value }))}
                  placeholder="e.g., hero-title, description"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={newContent.content}
                onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter content..."
                rows={3}
              />
            </div>
            <Button onClick={createContent} className="w-full">
              Create Content
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {contents.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.page_id}</Badge>
                  <Badge variant="outline">{item.section_key}</Badge>
                  <Badge variant={item.content_type === 'html' ? 'default' : 'secondary'}>
                    {item.content_type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => deleteContent(item.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === item.id ? (
                <div className="space-y-3">
                  <Textarea
                    defaultValue={item.content}
                    placeholder="Enter content..."
                    rows={4}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        updateContent(item.id, e.currentTarget.value);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                        if (textarea) {
                          updateContent(item.id, textarea.value);
                        }
                      }}
                      size="sm"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-muted/50 rounded border">
                    {item.content_type === 'html' ? (
                      <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    ) : (
                      <div className="whitespace-pre-wrap">{item.content}</div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(item.updated_at).toLocaleString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {contents.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No content found. Create your first editable content section!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};