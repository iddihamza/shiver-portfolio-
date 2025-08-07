import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFileUpload } from '@/hooks/useFileUpload';
import { usePageImage } from '@/hooks/usePageImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Move, RotateCcw, Trash2, Upload, Save, Edit3 } from 'lucide-react';

interface AdminImageEditorProps {
  pageId: string;
  sectionKey: string;
  defaultUrl?: string;
  className?: string;
}

export const AdminImageEditor: React.FC<AdminImageEditorProps> = ({
  pageId,
  sectionKey,
  defaultUrl,
  className = ''
}) => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin');
  const { uploadFile, uploading } = useFileUpload();
  const { imageUrl, width, height, posX, posY, saving, saveImage } = usePageImage(pageId, sectionKey);
  
  const [isEditing, setIsEditing] = useState(false);
  const [localWidth, setLocalWidth] = useState(width || 200);
  const [localHeight, setLocalHeight] = useState(height || 200);
  const [localPosX, setLocalPosX] = useState(posX || 0);
  const [localPosY, setLocalPosY] = useState(posY || 0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const { success, url } = await uploadFile(file);
    if (success) {
      await saveImage({ imageUrl: url });
      toast.success('Image uploaded successfully');
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEditing) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - localPosX,
      y: e.clientY - localPosY
    });
  }, [isEditing, localPosX, localPosY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !isEditing) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setLocalPosX(newX);
    setLocalPosY(newY);
  }, [isDragging, isEditing, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSave = async () => {
    const success = await saveImage({
      width: localWidth,
      height: localHeight,
      posX: localPosX,
      posY: localPosY
    });
    
    if (success) {
      setIsEditing(false);
      toast.success('Image settings saved');
    }
  };

  const handleReset = () => {
    setLocalWidth(width || 200);
    setLocalHeight(height || 200);
    setLocalPosX(posX || 0);
    setLocalPosY(posY || 0);
  };

  const handleDelete = async () => {
    const success = await saveImage({ imageUrl: null });
    if (success) {
      toast.success('Image removed');
    }
  };

  if (!isAdmin) {
    return (
      <div className={`relative ${className}`}>
        {(imageUrl || defaultUrl) && (
          <img 
            src={imageUrl || defaultUrl} 
            alt="" 
            className="max-w-full h-auto"
            style={{
              width: width || 'auto',
              height: height || 'auto'
            }}
          />
        )}
      </div>
    );
  }

  const currentImageUrl = imageUrl || defaultUrl;

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef}
        className="relative overflow-hidden border border-tech-border rounded-lg min-h-[200px] bg-card/20"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {currentImageUrl && (
          <img
            ref={imageRef}
            src={currentImageUrl}
            alt=""
            className={`absolute cursor-${isEditing ? 'move' : 'default'} transition-opacity ${isDragging ? 'opacity-80' : 'opacity-100'}`}
            style={{
              left: isEditing ? localPosX : (posX || 0),
              top: isEditing ? localPosY : (posY || 0),
              width: isEditing ? localWidth : (width || 'auto'),
              height: isEditing ? localHeight : (height || 'auto'),
              userSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
            draggable={false}
          />
        )}
        
        {!currentImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <Upload className="w-8 h-8 mb-2" />
            <span>No image uploaded</span>
          </div>
        )}
      </div>

      {/* Admin Controls */}
      <Card className="mt-4 p-4 space-y-4 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="tech-glow"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? 'Editing' : 'Edit'}
          </Button>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`file-${pageId}-${sectionKey}`}
            disabled={uploading || saving}
          />
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={uploading || saving}
          >
            <label htmlFor={`file-${pageId}-${sectionKey}`} className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </label>
          </Button>

          {currentImageUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={saving}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>

        {isEditing && currentImageUrl && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Width</label>
                <Input
                  type="number"
                  value={localWidth}
                  onChange={(e) => setLocalWidth(Number(e.target.value))}
                  className="h-8 text-xs"
                  min="10"
                  max="1000"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Height</label>
                <Input
                  type="number"
                  value={localHeight}
                  onChange={(e) => setLocalHeight(Number(e.target.value))}
                  className="h-8 text-xs"
                  min="10"
                  max="1000"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">X Position</label>
                <Input
                  type="number"
                  value={localPosX}
                  onChange={(e) => setLocalPosX(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Y Position</label>
                <Input
                  type="number"
                  value={localPosY}
                  onChange={(e) => setLocalPosY(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="hero-button"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Drag the image to reposition, or use the controls above for precise adjustments
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};