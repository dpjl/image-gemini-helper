import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';

interface ImageCardProps {
  src: string;
  alt: string;
  selected: boolean;
  onSelect: () => void;
  aspectRatio?: "portrait" | "square" | "video";
  type?: "image" | "video";
}

const ImageCard: React.FC<ImageCardProps> = ({
  src,
  alt,
  selected,
  onSelect,
  aspectRatio = "square",
  type = "image"
}) => {
  const [loaded, setLoaded] = useState(false);
  
  const aspectRatioClass = {
    portrait: "aspect-[3/4]",
    square: "aspect-square",
    video: "aspect-video",
  }[aspectRatio];
  
  const isVideo = type === "video" || src.match(/\.(mp4|webm|ogg|mov)$/i);
  
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "image-card group", 
              aspectRatioClass,
              selected && "selected",
              !loaded && "animate-pulse bg-muted"
            )}
            onClick={onSelect}
          >
            {isVideo ? (
              <video 
                src={src}
                title={alt}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  loaded ? "opacity-100" : "opacity-0"
                )}
                onLoadedData={() => setLoaded(true)}
                muted
                loop
                playsInline
                onMouseOver={(e) => e.currentTarget.play()}
                onMouseOut={(e) => e.currentTarget.pause()}
              />
            ) : (
              <img
                src={src}
                alt={alt}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  loaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setLoaded(true)}
              />
            )}
            <div className="image-overlay" />
            <div className="image-checkbox">
              <Checkbox 
                checked={selected}
                className={cn(
                  "h-5 w-5 border-2",
                  selected ? "border-primary bg-primary" : "border-white bg-white/20",
                  "transition-all duration-200 ease-out",
                  !loaded && "opacity-0"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="center" 
          className="bg-black/80 text-white border-none text-xs p-2 max-w-[300px] break-words"
        >
          {alt}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ImageCard;
