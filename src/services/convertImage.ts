import heic2any from "heic2any";

export const convertAndCompressToPng = async (
  file: File,
  maxSizeKB = 800,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.9,
  onProgress?: (msg: string) => void // 👈 progress callback
): Promise<File> => {
  let workingFile = file;

  onProgress?.("Checking file type...");

  // 🔹 Step 1: Convert HEIC → JPEG first
  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  ) {
    onProgress?.("Converting HEIC → JPEG...");
    const convertedBlob = (await heic2any({
      blob: file,
      toType: "image/jpeg", // browsers decode JPEG fine
      quality,
    })) as Blob;

    workingFile = new File(
      [convertedBlob],
      file.name.replace(/\.\w+$/, ".jpg"),
      { type: "image/jpeg" }
    );
  }

  onProgress?.("Compressing image...");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        let { width, height } = img;

        let scale = 1;
        let pngFile: File | null = null;

        while (true) {
          const targetWidth = Math.round(width * scale);
          const targetHeight = Math.round(height * scale);

          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas not supported");

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // ✅ Always PNG output
          const blob: Blob | null = await new Promise((res) =>
            canvas.toBlob((b) => res(b), "image/png")
          );

          if (!blob) return reject("Failed to create PNG");

          pngFile = new File(
            [blob],
            workingFile.name.replace(/\.\w+$/, ".png"),
            { type: "image/png" }
          );

          const sizeKB = pngFile.size / 1024;
          onProgress?.(`Compressing... ${Math.round(sizeKB)} KB`);

          // Stop if size is ok OR if scale too small
          if (sizeKB <= maxSizeKB || scale <= 0.3) {
            onProgress?.("");
            break;
          }

          // Only way to shrink PNG is resizing (quality param doesn’t apply)
          scale *= 0.9;
        }

        resolve(pngFile!);
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.onerror = () => reject("Error reading file");
    reader.readAsDataURL(workingFile);
  });
};
