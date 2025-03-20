
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Gallery, { ImageItem } from '@/components/Gallery';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// For demo purposes, we're creating placeholder images
// In a real implementation, these would come from an API
const generatePlaceholderImages = (count: number, directory: string): ImageItem[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${directory}-${i}`,
    src: `https://picsum.photos/seed/${directory}${i}/400/400`,
    alt: `Image ${i} from ${directory}`,
    directory
  }));
};

const Index = () => {
  const { toast } = useToast();
  const [leftImages, setLeftImages] = useState<ImageItem[]>([]);
  const [rightImages, setRightImages] = useState<ImageItem[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Simulate loading images
  useEffect(() => {
    const timer = setTimeout(() => {
      setLeftImages(generatePlaceholderImages(16, "directory1"));
      setRightImages(generatePlaceholderImages(12, "directory2"));
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSelectImage = (id: string) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imageId => imageId !== id)
        : [...prev, id]
    );
  };
  
  const handleDeleteSelected = () => {
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    // Filter out the selected images from both galleries
    setLeftImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
    setRightImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
    
    // Show success message
    toast({
      title: `${selectedImages.length} ${selectedImages.length === 1 ? 'image' : 'images'} deleted`,
      description: "The selected images have been removed successfully.",
    });
    
    // Reset selected images and close the dialog
    setSelectedImages([]);
    setDeleteDialogOpen(false);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4 md:py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Image Gallery Manager
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Browse and manage images from two different directories side by side.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-6 flex justify-between items-center">
          <div>
            <span className="text-sm text-muted-foreground">
              {selectedImages.length} {selectedImages.length === 1 ? 'image' : 'images'} selected
            </span>
          </div>
          
          <Button
            onClick={handleDeleteSelected}
            variant="destructive"
            size="sm"
            className="gap-2"
            disabled={selectedImages.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 glass-panel p-6"
        >
          <Gallery
            title="Directory 1"
            images={leftImages}
            selectedImages={selectedImages}
            onSelectImage={handleSelectImage}
            isLoading={isLoading}
          />
          
          <Gallery
            title="Directory 2"
            images={rightImages}
            selectedImages={selectedImages}
            onSelectImage={handleSelectImage}
            isLoading={isLoading}
          />
        </motion.div>
      </motion.div>
      
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        selectedCount={selectedImages.length}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default Index;
