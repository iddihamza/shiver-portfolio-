import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EditableContent } from '@/components/EditableContent';

interface AutoEditableWrapperProps {
  children: React.ReactNode;
}

export const AutoEditableWrapper: React.FC<AutoEditableWrapperProps> = ({ children }) => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin');

  // Recursively walk React nodes to auto-wrap annotated elements
  function wrapNodes(nodes: React.ReactNode): React.ReactNode {
    return React.Children.map(nodes, (node) => {
      if (!React.isValidElement(node)) {
        return node;
      }

      // If element has a data-content-id and admin, wrap it
      const contentId = node.props['data-content-id'];
      if (contentId && isAdmin) {
        // Extract fallback text
        const fallback = typeof node.props.children === 'string'
          ? node.props.children
          : undefined;
        
        return (
          <EditableContent
            pageId={node.props['data-page-id'] || 'default'}
            sectionKey={contentId}
            defaultContent={fallback}
          >
            {node.props.children}
          </EditableContent>
        );
      }

      // Recursively wrap children
      return React.cloneElement(node, {
        ...node.props,
        children: wrapNodes(node.props.children),
      });
    });
  }

  return <>{wrapNodes(children)}</>;
};