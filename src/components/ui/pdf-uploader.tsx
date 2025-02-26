import { useDropzone } from '@uploadthing/react';
import { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { generateClientDropzoneAccept, generatePermittedFileTypes } from 'uploadthing/client';
import { getRouteConfig, useUploadThing } from '~/lib/uploadthing';
import { Upload } from 'lucide-react';

interface Props {
  setRewardLink: (url: string) => void;
}

export const PdfUploader: FC<Props> = props => {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    void startUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(generatePermittedFileTypes(getRouteConfig('pdfUploader')).fileTypes),
    multiple: false,
    maxFiles: 1
  });

  const { startUpload, routeConfig, isUploading } = useUploadThing('pdfUploader', {
    onClientUploadComplete: res => {
      console.log('Files: ', res);
      toast.success('PDF uploaded successfully');
      props.setRewardLink(res[0]!.ufsUrl);
    },
    onUploadError: error => {
      toast.error('Failed to upload PDF');
      console.log(error);
    },
    onUploadBegin: ({ file }) => {
      console.log('Upload has begun for', file);
    }
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div>{files.length > 0 && <button onClick={() => startUpload(files)}>Upload {files.length} files</button>}</div>
      <div
        role='button'
        className='flex flex-col items-center justify-center rounded-lg border-2 border-dotted border-gray-300 p-4'
      >
        <div className='mb-2 flex items-center justify-center p-3'>
          <Upload size={30} />
        </div>
        <p className='mb-2 text-lg font-medium text-gray-700'>
          {files.length > 0 ? `${files.length} file(s) ready to upload` : 'Drag & drop PDF here to upload'}
        </p>
        {isUploading ? (
          <p className='text-sm text-gray-500'>Uploading...</p>
        ) : (
          <p className='text-sm text-gray-500'>or click to select files</p>
        )}
      </div>
    </div>
  );
};
