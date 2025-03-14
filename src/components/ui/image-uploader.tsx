import { useDropzone } from '@uploadthing/react';
import React, { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { generateClientDropzoneAccept, generatePermittedFileTypes } from 'uploadthing/client';
import { useUploadThing } from '~/lib/uploadthing';
import { Upload, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useLoading } from '~/components/providers/loading-provider';

interface Props {
  thumbnail: string | null;
  setThumbnail: (url: string | null) => void;
}

export const ImageUploader: FC<Props> = props => {
  const [files, setFiles] = useState<File[]>([]);
  const { setLoading } = useLoading();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    void startUpload(acceptedFiles);
    setLoading(true);
  }, []);

  const { startUpload, routeConfig, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: res => {
      console.log('Files: ', res);
      props.setThumbnail(res[0]!.ufsUrl);
      setLoading(false);
    },
    onUploadError: error => {
      toast.error('Failed to upload Image', {
        description: error.message
      });
      console.log(error);
      setLoading(false);
    },
    onUploadBegin: filename => {
      console.log('Upload has begun for', filename);
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(generatePermittedFileTypes(routeConfig).fileTypes),
    multiple: false,
    maxFiles: 1
  });

  const clearSelection = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setFiles([]);
      props.setThumbnail(null);
    },
    [props]
  );

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {props.thumbnail || files[0] ? (
        <div className='flex w-full flex-col justify-center rounded-lg bg-background p-3'>
          <div className='flex grow flex-col space-y-1'>
            <div className='flex w-fit items-center space-x-4'>
              <p className='text-sm font-bold'>Reward Thumbnail</p>
              <div className='flex items-center space-x-4'>
                <button
                  onClick={clearSelection}
                  className='text-red-500 hover:text-red-700'
                  aria-label='Clear Selection'
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
            <div className='flex items-center justify-center space-x-4 pt-2'>
              <Image
                // @ts-ignore
                src={files[0] ? URL.createObjectURL(files[0]) : props.thumbnail}
                alt='thumbnail'
                width={200}
                height={200}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          role='button'
          className='flex min-w-full transform cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dotted border-gray-300 bg-background p-6 shadow-md transition-transform hover:scale-105'
        >
          <div className='mb-2 flex items-center justify-center p-2'>
            <Upload size={30} />
          </div>
          <p className='mb-2 text-lg font-medium'>Drag & drop image here to upload</p>
          {isUploading ? <p className='text-sm'>Uploading...</p> : <p className='text-sm'>or click to select files</p>}
        </div>
      )}
    </div>
  );
};
