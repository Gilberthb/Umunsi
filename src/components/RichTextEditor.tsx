import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image as ImageIcon,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';
import { MediaFile } from '../services/api';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      console.log('🔄 Setting editor content, value length:', value.length);
      editorRef.current.innerHTML = value;
      // Add resize handles to existing images
      setTimeout(() => {
        addImageResizeHandles();
      }, 100);
    }
  }, [value]);

  useEffect(() => {
    // Add resize handles when component mounts
    console.log('🚀 RichTextEditor mounted, editorRef:', editorRef.current);
    setTimeout(() => {
      addImageResizeHandles();
    }, 100);
  }, []);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      console.log('📝 Content changed, new content length:', content.length);
      console.log('📄 Content preview:', content.substring(0, 200) + (content.length > 200 ? '...' : ''));
      onChange(content);
    } else {
      console.error('❌ Editor ref is null in handleContentChange');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            execCommand('redo');
          } else {
            execCommand('undo');
          }
          break;
      }
    }
  };

  const insertImage = (media: MediaFile) => {
    console.log('🖼️ InsertImage called with:', media);
    
    const getServerBaseUrl = () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://motoinvestment2.space/api';
      return apiUrl.replace('/api', '');
    };
    
    const imageUrl = `${getServerBaseUrl()}${media.url}`;
    console.log('🔗 Image URL:', imageUrl);
    
    if (!editorRef.current) {
      console.error('❌ Editor ref is null');
      setShowMediaLibrary(false);
      return;
    }
    
    // Focus the editor first
    editorRef.current.focus();
    
    // Create image element
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = media.originalName;
    img.className = 'resizable-image';
    img.style.cssText = 'max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; display: block;';
    img.setAttribute('data-original-width', '400');
    img.setAttribute('data-original-height', '300');
    
    // Add error handling
    img.onerror = () => {
      console.error('❌ Failed to load image:', imageUrl);
    };
    img.onload = () => {
      console.log('✅ Image loaded successfully:', imageUrl);
    };
    
    // Try multiple insertion methods
    try {
      // Method 1: Use execCommand (most reliable for contentEditable)
      const success = document.execCommand('insertHTML', false, img.outerHTML);
      console.log('📝 execCommand insertHTML result:', success);
      
      if (!success) {
        // Method 2: Use selection and range
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          console.log('🎯 Using selection-based insertion');
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
          range.setStartAfter(img);
          range.setEndAfter(img);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // Method 3: Append to end
          console.log('📌 Using append method');
          editorRef.current.appendChild(img);
        }
      }
      
      // Trigger content change
      console.log('🔄 Triggering content change...');
      handleContentChange();
      
      // Add resize functionality after insertion
      setTimeout(() => {
        console.log('🔧 Adding image resize handles...');
        addImageResizeHandles();
      }, 100);
      
      console.log('✅ Image insertion completed');
      
    } catch (error) {
      console.error('❌ Error during image insertion:', error);
      
      // Fallback: Simple append
      try {
        editorRef.current.insertAdjacentHTML('beforeend', img.outerHTML);
        console.log('📌 Fallback insertion successful');
        handleContentChange();
      } catch (fallbackError) {
        console.error('❌ Fallback insertion failed:', fallbackError);
      }
    }
    
    // Close the media library
    setShowMediaLibrary(false);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const addImageResizeHandles = () => {
    if (!editorRef.current) return;

    const images = editorRef.current.querySelectorAll('.resizable-image');
    images.forEach((img: Element) => {
      const imageElement = img as HTMLImageElement;
      
      // Skip if already has resize handles
      if (imageElement.parentElement?.classList.contains('image-container')) return;

      // Create container
      const container = document.createElement('div');
      container.className = 'image-container';
      container.style.position = 'relative';
      container.style.display = 'inline-block';
      container.style.maxWidth = '100%';

      // Wrap image in container
      imageElement.parentNode?.insertBefore(container, imageElement);
      container.appendChild(imageElement);

      // Add resize handles
      addResizeHandles(container, imageElement);
      
      // Add click handler for selection
      imageElement.addEventListener('click', (e) => {
        e.preventDefault();
        selectImage(container);
      });
    });
  };

  const addResizeHandles = (container: HTMLElement, image: HTMLImageElement) => {
    // Create resize handles
    const handles = ['nw', 'ne', 'sw', 'se'];
    
    handles.forEach(handle => {
      const resizeHandle = document.createElement('div');
      resizeHandle.className = `resize-handle resize-handle-${handle}`;
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.width = '8px';
      resizeHandle.style.height = '8px';
      resizeHandle.style.backgroundColor = '#007cba';
      resizeHandle.style.border = '1px solid #fff';
      resizeHandle.style.cursor = `${handle}-resize`;
      resizeHandle.style.zIndex = '1000';
      resizeHandle.style.opacity = '0';
      resizeHandle.style.transition = 'opacity 0.2s';

      // Position handles
      switch (handle) {
        case 'nw':
          resizeHandle.style.top = '-4px';
          resizeHandle.style.left = '-4px';
          break;
        case 'ne':
          resizeHandle.style.top = '-4px';
          resizeHandle.style.right = '-4px';
          break;
        case 'sw':
          resizeHandle.style.bottom = '-4px';
          resizeHandle.style.left = '-4px';
          break;
        case 'se':
          resizeHandle.style.bottom = '-4px';
          resizeHandle.style.right = '-4px';
          break;
      }

      container.appendChild(resizeHandle);

      // Add resize functionality
      let isResizing = false;
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;

      resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = image.offsetWidth;
        startHeight = image.offsetHeight;

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
      });

      const handleResize = (e: MouseEvent) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        let newWidth = startWidth;
        let newHeight = startHeight;

        // Calculate new dimensions based on handle
        switch (handle) {
          case 'se':
            newWidth = startWidth + deltaX;
            newHeight = startHeight + deltaY;
            break;
          case 'sw':
            newWidth = startWidth - deltaX;
            newHeight = startHeight + deltaY;
            break;
          case 'ne':
            newWidth = startWidth + deltaX;
            newHeight = startHeight - deltaY;
            break;
          case 'nw':
            newWidth = startWidth - deltaX;
            newHeight = startHeight - deltaY;
            break;
        }

        // Maintain aspect ratio and set minimum size
        const minSize = 50;
        const maxSize = 800;
        newWidth = Math.max(minSize, Math.min(maxSize, newWidth));
        newHeight = Math.max(minSize, Math.min(maxSize, newHeight));

        // Apply new dimensions
        image.style.width = `${newWidth}px`;
        image.style.height = `${newHeight}px`;
        image.style.maxWidth = 'none';
      };

      const stopResize = () => {
        isResizing = false;
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
      };
    });

    // Add image controls
    addImageControls(container, image);
  };

  const addImageControls = (container: HTMLElement, image: HTMLImageElement) => {
    // Create controls bar
    const controls = document.createElement('div');
    controls.className = 'image-controls';
    controls.style.position = 'absolute';
    controls.style.top = '-30px';
    controls.style.left = '0';
    controls.style.backgroundColor = '#007cba';
    controls.style.color = 'white';
    controls.style.padding = '4px 8px';
    controls.style.borderRadius = '4px';
    controls.style.fontSize = '12px';
    controls.style.opacity = '0';
    controls.style.transition = 'opacity 0.2s';
    controls.style.zIndex = '1001';
    controls.style.display = 'flex';
    controls.style.gap = '8px';
    controls.style.alignItems = 'center';

    // Add control buttons
    const alignLeft = createControlButton('⬅', 'Align Left', () => alignImage(image, 'left'));
    const alignCenter = createControlButton('⬆', 'Align Center', () => alignImage(image, 'center'));
    const alignRight = createControlButton('➡', 'Align Right', () => alignImage(image, 'right'));
    const deleteBtn = createControlButton('🗑', 'Delete Image', () => deleteImage(container));

    controls.appendChild(alignLeft);
    controls.appendChild(alignCenter);
    controls.appendChild(alignRight);
    controls.appendChild(deleteBtn);

    container.appendChild(controls);
  };

  const createControlButton = (icon: string, title: string, onClick: () => void) => {
    const button = document.createElement('button');
    button.innerHTML = icon;
    button.title = title;
    button.style.background = 'none';
    button.style.border = 'none';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.style.padding = '2px';
    button.style.borderRadius = '2px';
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'rgba(255,255,255,0.2)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'transparent';
    });
    return button;
  };

  const selectImage = (container: HTMLElement) => {
    // Remove selection from other images
    const allContainers = editorRef.current?.querySelectorAll('.image-container');
    allContainers?.forEach(c => {
      c.classList.remove('selected');
      const handles = c.querySelectorAll('.resize-handle');
      const controls = c.querySelector('.image-controls') as HTMLElement;
      handles.forEach(h => (h as HTMLElement).style.opacity = '0');
      if (controls) controls.style.opacity = '0';
    });

    // Select current image
    container.classList.add('selected');
    const handles = container.querySelectorAll('.resize-handle');
    const controls = container.querySelector('.image-controls') as HTMLElement;
    handles.forEach(h => (h as HTMLElement).style.opacity = '1');
    if (controls) controls.style.opacity = '1';
  };

  const alignImage = (image: HTMLImageElement, alignment: string) => {
    const container = image.parentElement;
    if (!container) return;

    // Remove existing alignment classes
    container.classList.remove('align-left', 'align-center', 'align-right');
    
    // Add new alignment
    container.classList.add(`align-${alignment}`);
    
    // Apply alignment styles
    switch (alignment) {
      case 'left':
        container.style.textAlign = 'left';
        break;
      case 'center':
        container.style.textAlign = 'center';
        break;
      case 'right':
        container.style.textAlign = 'right';
        break;
    }
  };

  const deleteImage = (container: HTMLElement) => {
    if (confirm('Are you sure you want to delete this image?')) {
      container.remove();
      handleContentChange();
    }
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
  }> = ({ onClick, icon, title, isActive = false }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:theme-bg-card-hover transition-colors ${
        isActive ? 'theme-bg-tertiary text-[#fcd535]' : 'theme-text-muted hover:theme-text-primary'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className={`rich-text-editor border theme-border-primary rounded-xl theme-bg-tertiary ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b theme-border-primary theme-bg-secondary rounded-t-xl">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r theme-border-primary pr-2">
          <ToolbarButton
            onClick={() => execCommand('bold')}
            icon={<Bold className="w-4 h-4" />}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => execCommand('italic')}
            icon={<Italic className="w-4 h-4" />}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => execCommand('underline')}
            icon={<Underline className="w-4 h-4" />}
            title="Underline (Ctrl+U)"
          />
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r theme-border-primary pr-2">
          <ToolbarButton
            onClick={() => execCommand('insertUnorderedList')}
            icon={<List className="w-4 h-4" />}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => execCommand('insertOrderedList')}
            icon={<ListOrdered className="w-4 h-4" />}
            title="Numbered List"
          />
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r theme-border-primary pr-2">
          <ToolbarButton
            onClick={() => execCommand('justifyLeft')}
            icon={<AlignLeft className="w-4 h-4" />}
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => execCommand('justifyCenter')}
            icon={<AlignCenter className="w-4 h-4" />}
            title="Align Center"
          />
          <ToolbarButton
            onClick={() => execCommand('justifyRight')}
            icon={<AlignRight className="w-4 h-4" />}
            title="Align Right"
          />
        </div>

        {/* Insert */}
        <div className="flex items-center gap-1 border-r theme-border-primary pr-2">
          <ToolbarButton
            onClick={insertLink}
            icon={<Link className="w-4 h-4" />}
            title="Insert Link"
          />
          <ToolbarButton
            onClick={() => {
              console.log('🖼️ Insert Image button clicked');
              setShowMediaLibrary(true);
            }}
            icon={<ImageIcon className="w-4 h-4" />}
            title="Insert Image"
          />
          <ToolbarButton
            onClick={() => execCommand('formatBlock', 'blockquote')}
            icon={<Quote className="w-4 h-4" />}
            title="Quote"
          />
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => execCommand('undo')}
            icon={<Undo className="w-4 h-4" />}
            title="Undo (Ctrl+Z)"
          />
          <ToolbarButton
            onClick={() => execCommand('redo')}
            icon={<Redo className="w-4 h-4" />}
            title="Redo (Ctrl+Shift+Z)"
          />
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[300px] p-4 focus:outline-none theme-text-primary theme-bg-tertiary rounded-b-xl ${
          isFocused ? 'ring-2 ring-[#fcd535]/50' : ''
        }`}
        style={{ minHeight: '300px' }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Placeholder */}
      {!value && (
        <div className="absolute top-16 left-4 theme-text-muted pointer-events-none">
          {placeholder}
        </div>
      )}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={insertImage}
        title="Insert Image"
        mode="select"
        type="image"
      />

    </div>
  );
};

export default RichTextEditor;
