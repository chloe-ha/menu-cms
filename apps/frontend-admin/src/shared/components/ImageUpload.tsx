import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, X } from 'lucide-react';

export type FileImageItem = { type: 'file'; file: File; };
export type S3ImageItem = { type: 's3'; s3Key: string; isPendingDelete?: boolean; };
export type ImageItem = { id: string; previewUrl: string; } & (FileImageItem | S3ImageItem);

export type ImageUploadProps = {
  id: string;
  value: ImageItem[];
  onChange: (newImages: ImageItem[]) => void;
}

// --- Drag and Drop Logic ---

const ItemType = 'IMAGE_PREVIEW';

interface DraggableImageProps {
  item: ImageItem;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (id: string) => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ item, index, moveImage, onRemove }) => {

  const [, drop] = useDrop({
    accept: ItemType,
    hover(dragItem: { index: number }) {
      const dragIndex = dragItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;
      moveImage(dragIndex, hoverIndex);
      dragItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => ({ id: item.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const combinedRef = useCallback((node: HTMLDivElement | null) => {
    drag(node);
    drop(node);
  }, [drag, drop]);

  const containerClasses = `
    relative w-24 h-24 m-2 rounded-lg overflow-hidden shadow-lg
    cursor-move transition-opacity duration-200 ease-in-out
    ${isDragging ? 'opacity-50 border-2 border-dashed border-indigo-600' : 'opacity-100'}
    ${item.type === 's3' && item.isPendingDelete ? 'border-2 border-red-800' : 'border border-gray-300'}
    ${item.type === 'file' ? 'border-2 border-green-500' : 'border border-gray-300'}
  `;

  return (
    <div ref={combinedRef} className={containerClasses}>
      <img
        src={item.previewUrl}
        alt={item.type === 's3' ? item.s3Key : item.file.name}
        className="w-full h-full object-cover"
      />

      <button
        onClick={() => onRemove(item.id)}
        type="button"
        className="
          absolute top-0 right-0 bg-red-600 bg-opacity-70 text-white
          text-xs font-bold p-1 rounded-bl-lg hover:bg-red-700 transition
        "
        title="Remove Image"
      >
        <X size={16} />
      </button>

      {/* Pending Delete Overlay */}
      {item.type === 's3' && item.isPendingDelete && (
        <span className="absolute bottom-0 left-0 text-xs bg-red-800 text-white px-1 py-0.5 rounded-tr-lg">Supp</span>
      )}

      {/* Overlay indicating New File */}
      {item.type === 'file' && (
        <span className="absolute bottom-0 left-0 text-xs bg-green-500 text-white px-1 py-0.5 rounded-tr-lg">New</span>
      )}
    </div>
  );
};


// --- Main Component ---

const ImageUpload: React.FC<ImageUploadProps> = ({ id, value, onChange }) => {
  const [imageItems, setImageItems] = useState<ImageItem[]>(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageItems(value);
  }, [value]);

  useEffect(() => {
    onChange(imageItems);

    return () => {
      imageItems.forEach(item => {
        if (item.type === 'file' && item.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [imageItems, onChange]);

  const handleFileSelection = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const newImageItems: ImageItem[] = files.map((file) => ({
        id: crypto.randomUUID(),
        type: 'file',
        file: file,
        previewUrl: URL.createObjectURL(file),
    }));

    setImageItems((prevItems) => [...prevItems, ...newImageItems]);

    // Workaround to force the onChange event to fire even when the same file is selected consecutively
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
    setImageItems((prevItems) => {
      const newItems = [...prevItems];
      const draggedItem = newItems[dragIndex];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, draggedItem);
      return newItems;
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setImageItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === id);

      if (!itemToRemove) return prevItems;

      // If it's a new file, remove it completely and revoke the Blob URL
      if (itemToRemove.type === 'file') {
        if (itemToRemove.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(itemToRemove.previewUrl);
        }
        return prevItems.filter(item => item.id !== id);
      }

      // If it's an existing S3 image, mark it for pending deletion
      if (itemToRemove.type === 's3') {
        return prevItems.map(item =>
          item.id === id ? { ...item, isPendingDelete: true } : item
        );
      }

      return prevItems;
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelection}
        className="hidden"
        id={id}
      />
      <label
        htmlFor={id}
        className="
          inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-white
          bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          cursor-pointer transition duration-150 ease-in-out
        "
      >
        <Plus size={20} className="mr-2" />
        Add Images
      </label>

      <div className="flex flex-wrap border border-gray-300 p-4 rounded-lg min-h-30">
        {imageItems.map((item, index) => (
          <DraggableImage
            key={item.id}
            item={item}
            index={index}
            moveImage={moveImage}
            onRemove={handleRemove}
          />
        ))}
        {imageItems.length === 0 && (
          <p className="text-gray-500 italic text-sm m-auto">Click 'Add Images' or drag files here to begin.</p>
        )}
      </div>
    </DndProvider>
  );
};

export default ImageUpload;