export const processMediaFile = async (
  file: File,
  crop?: { x: number; y: number; width: number; height: number },
  rotation?: number,
  imageRef?: HTMLImageElement | null
): Promise<{ finalBlob: File; metadata: MediaMetadata }> => {
  let finalBlob: File = file;
  
  if ((crop || rotation) && imageRef) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.width = crop ? crop.width : imageRef.width;
      canvas.height = crop ? crop.height : imageRef.height;

      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate((rotation || 0) * Math.PI / 180);
      ctx.translate(-canvas.width/2, -canvas.height/2);

      if (crop) {
        ctx.drawImage(
          imageRef,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
      } else {
        ctx.drawImage(imageRef, 0, 0);
      }

      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/jpeg')
      );
      
      // Convert Blob to File
      finalBlob = new File(
        [blob],
        file.name,
        { type: 'image/jpeg', lastModified: Date.now() }
      );
    }
  }

  const metadata: MediaMetadata = {
    originalName: file.name,
    contentType: file.type,
    size: finalBlob.size,
    dimensions: imageRef ? {
      width: imageRef.naturalWidth,
      height: imageRef.naturalHeight
    } : undefined,
    rotation: rotation || 0,
    crop: crop ? {
      x: crop.x,
      y: crop.y,
      width: crop.width,
      height: crop.height
    } : undefined
  };

  return { finalBlob, metadata };
};

export interface MediaMetadata {
  originalName: string;
  contentType: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  rotation: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}