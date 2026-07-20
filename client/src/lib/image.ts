/**
 * Downscale + square-crop an uploaded image to a small JPEG data URI so it
 * can be stored directly on the user row (no file storage needed).
 */
export function fileToAvatarDataUri(file: File, size = 128): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas unavailable.");

        // Cover-crop the centre square.
        const s = Math.min(img.width, img.height);
        ctx.drawImage(
          img,
          (img.width - s) / 2,
          (img.height - s) / 2,
          s,
          s,
          0,
          0,
          size,
          size
        );
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      } catch (e) {
        reject(e);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image."));
    };

    img.src = url;
  });
}
