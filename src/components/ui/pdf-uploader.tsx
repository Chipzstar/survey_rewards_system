import { useDropzone } from '@uploadthing/react';
import React, { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { generateClientDropzoneAccept, generatePermittedFileTypes } from 'uploadthing/client';
import { useUploadThing } from '~/lib/uploadthing';
import { CopyIcon, Upload, XCircle } from 'lucide-react';
import { useLoading } from '~/components/providers/loading-provider';

interface Props {
  rewardLink: string;
  setRewardLink: (url: string) => void;
}

export const PdfUploader: FC<Props> = props => {
  const [files, setFiles] = useState<File[]>([]);
  const { loading, setLoading } = useLoading();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    void startUpload(acceptedFiles);
  }, []);

  const { startUpload, routeConfig, isUploading } = useUploadThing('pdfUploader', {
    onClientUploadComplete: res => {
      console.log('Files: ', res);
      props.setRewardLink(res[0]!.ufsUrl);
      setLoading(false);
    },
    onUploadError: error => {
      toast.error('Failed to upload PDF');
      console.log(error);
      setLoading(false);
    },
    onUploadBegin: file => {
      console.log('Upload has begun for', file);
      setLoading(true);
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
      props.setRewardLink('');
    },
    [props]
  );

  const copyRewardLink = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      navigator.clipboard.writeText(props.rewardLink);
      toast.success('Reward link copied to clipboard');
    },
    [props.rewardLink]
  );

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {props.rewardLink || files.length > 0 ? (
        <div className='flex w-full flex-col justify-center rounded-lg bg-background p-3'>
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
          className='flex min-w-full transform cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dotted border-gray-300 bg-background p-6 shadow-md transition-transform hover:scale-105'
        >
          <div className='mb-2 flex items-center justify-center p-2'>
            <Upload size={30} />
          </div>
          <p className='mb-2 text-lg font-medium'>Drag & drop PDF here to upload</p>
          {isUploading ? <p className='text-sm'>Uploading...</p> : <p className='text-sm'>or click to select files</p>}
        </div>
      )}
    </div>
  );
};
