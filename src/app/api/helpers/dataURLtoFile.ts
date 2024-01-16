export const dataURLtoFile = async (
  dataUrl: string,
  fileName: string,
  fileType: string
): Promise<File> => {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, {type: fileType});
};
