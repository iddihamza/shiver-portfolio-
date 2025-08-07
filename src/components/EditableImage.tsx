import React from 'react';
import { AdminImageEditor } from '@/components/AdminImageEditor';

interface EditableImageProps {
  pageId: string;
  sectionKey: string;
  defaultUrl?: string;
  className?: string;
}

export const EditableImage: React.FC<EditableImageProps> = (props) => {
  return <AdminImageEditor {...props} />;
};
