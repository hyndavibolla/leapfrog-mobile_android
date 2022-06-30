/* istanbul ignore file */
// Ignoring for coverage: most types are native so do not require testing.
export const blobToBase64 = blob => {
  const reader = new FileReader();
  const resolved = new Promise(resolve => {
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(',')[1]);
    };
  });
  reader.readAsDataURL(blob);
  return resolved;
};
