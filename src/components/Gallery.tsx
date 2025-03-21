import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ImageCard from './ImageCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export interface ImageItem {
  id: string;
  src: string;
  alt: string;
  directory: string;
  createdAt?: string; // Date de création ou prise de vue
}

interface GalleryProps {
  title: string;
  images: ImageItem[];
  selectedImages: string[];
  onSelectImage: (id: string) => void;
  isLoading?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({
  title,
  images,
  selectedImages,
  onSelectImage,
  isLoading = false
}) => {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  
  const videoCount = images.filter(img => img.alt.match(/\.(mp4|webm|ogg|mov)$/i)).length;
  const imageCount = images.length - videoCount;
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const handleItemInView = (id: string) => {
    setVisibleItems(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };
  
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-lg font-medium mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={`skeleton-${i}`} 
              className="aspect-square rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          Media Gallery ({imageCount} images, {videoCount} videos)
        </h2>
        <div className="text-sm text-muted-foreground">
          {selectedImages.filter(id => images.some(img => img.id === id)).length} selected
        </div>
      </div>
      
      {images.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No media found</p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-4 flex-1 content-start",
          "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        )}>
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                custom={index}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <ImageCard
                  src={image.src}
                  alt={image.alt}
                  selected={selectedImages.includes(image.id)}
                  onSelect={() => onSelectImage(image.id)}
                  aspectRatio={index % 5 === 0 ? "portrait" : index % 4 === 0 ? "video" : "square"}
                  type={image.alt.match(/\.(mp4|webm|ogg|mov)$/i) ? "video" : "image"}
                  onInView={() => handleItemInView(image.id)}
                  createdAt={image.createdAt}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Gallery;