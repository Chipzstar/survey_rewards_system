import { useDropzone } from '@uploadthing/react';
import React, { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { generateClientDropzoneAccept, generatePermittedFileTypes } from 'uploadthing/client';
import { getRouteConfig, useUploadThing } from '~/lib/uploadthing';
import { Check, CircleCheck, CopyIcon, FileIcon, FileTextIcon, Upload, XCircle } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';

interface Props {
  rewardLink: string;
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

  const clearSelection = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setFiles([]);
      props.setRewardLink('');
    },
    [props]
  );

  const copyRewardLink = useCallback(() => {
    navigator.clipboard.writeText(props.rewardLink);
    toast.success('Reward link copied to clipboard');
  }, [props.rewardLink]);

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {props.rewardLink || files.length > 0 ? (
        <div className='flex w-full flex-col justify-center rounded-lg bg-gray-100 p-3'>
          <div className='flex grow flex-col space-y-1'>
            <div className='flex w-fit items-center space-x-4'>
              <p className='text-sm font-bold'>PDF Reward Link</p>
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
            <div className='flex items-center space-x-4'>
              <span className='text-overflow-ellipsis overflow-hidden truncate whitespace-nowrap text-sm'>
                {files[0] ? `${files[0].name}` : props.rewardLink}
              </span>
              {!files.length && (
                <div className='grow'>
                  <CopyIcon size={20} className='grow text-gray-500 hover:text-gray-700' onClick={copyRewardLink} />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          role='button'
          className='flex min-w-full transform cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dotted border-gray-300 bg-white p-6 shadow-md transition-transform hover:scale-105'
        >
          <div className='mb-2 flex items-center justify-center p-3'>
            <Upload size={30} />
          </div>
          <p className='mb-2 text-lg font-medium text-gray-800'>Drag & drop PDF here to upload</p>
          {isUploading ? <p className='text-sm'>Uploading...</p> : <p className='text-sm'>or click to select files</p>}
        </div>
      )}
    </div>
  );
};
