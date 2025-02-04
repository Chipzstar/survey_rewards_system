import { isMobile } from 'react-device-detect';
import Link from 'next/link';

export function SurveyLink(props: { href: string; surveyLink: string | null }) {
  return (
    <>
      <div className='hidden flex-col flex-wrap items-center md:flex'>
        <h2 className='mb-4 text-2xl font-bold'>Link</h2>
        <Link href={props.href} className='text-wrap break-words text-white underline' target='_blank'>
          {props.surveyLink}
        </Link>
      </div>
    </>
  );
}
