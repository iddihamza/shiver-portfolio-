import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { usePageContent } from '@/hooks/usePageContent';
import { Edit3, Save, X, Loader2 } from 'lucide-react';

interface EditableContentProps {
  pageId: string;
  sectionKey: string;
  defaultContent?: string;
  className?: string;
  contentType?: 'html' | 'text' | 'markdown';
  placeholder?: string;
  children?: React.ReactNode;
}

export const EditableContent: React.FC<EditableContentProps> = ({
  pageId,
  sectionKey,
  defaultContent = '',
  className = '',
  contentType = 'html',
  placeholder = 'Enter content here...',
  children
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { hasRole } = useAuth();
  const { content, loading, saving, saveContent } = usePageContent(pageId, sectionKey, defaultContent);

  const isAdmin = hasRole('admin');

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editing]);

  const handleEdit = () => {
    setDraft(content || defaultContent);
    setEditing(true);
  };

  const handleSave = async () => {
    const success = await saveContent(draft);
    if (success) {
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setDraft('');
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  const renderContent = () => {
    const displayContent = content || defaultContent;
    
    if (!displayContent && !children) {
      return (
        <div className="text-muted-foreground italic py-4">
          {placeholder}
        </div>
      );
    }

    if (children) {
      return children;
    }

    switch (contentType) {
      case 'html':
        return (
          <div 
            dangerouslySetInnerHTML={{ __html: displayContent }} 
            className="prose prose-sm max-w-none"
          />
        );
      case 'markdown':
        // For now, render as plain text. You could add a markdown parser here
        return <div className="whitespace-pre-wrap">{displayContent}</div>;
      default:
        return <div className="whitespace-pre-wrap">{displayContent}</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading content...</span>
      </div>
    );
  }

  if (editing) {
    return (
      <Card className="p-4 space-y-3">
        <Textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[100px] resize-none"
          disabled={saving}
        />
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSave} 
            size="sm" 
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3 w-3" />
                Save
              </>
            )}
          </Button>
          <Button 
            onClick={handleCancel} 
            variant="outline" 
            size="sm"
            disabled={saving}
            className="flex items-center gap-2"
          >
            <X className="h-3 w-3" />
            Cancel
          </Button>
          <span className="text-xs text-muted-foreground ml-auto">
            Ctrl+Enter to save, Esc to cancel
          </span>
        </div>
      </Card>
    );
  }

  return (
    <div className={`group relative ${className}`}>
      {renderContent()}
      {isAdmin && (
        <Button
          onClick={handleEdit}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
        >
          <Edit3 className="h-3 w-3" />
          Edit
        </Button>
      )}
    </div>
  );
};