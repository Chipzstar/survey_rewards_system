import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <main className='flex min-h-screen flex-col items-center p-4 md:p-24'>
      <div className='mb-8 flex w-full items-center justify-between'>
        <h1 className='text-3xl font-bold md:text-4xl'>Terms of Service</h1>
        <Link href='/' className='text-primary underline'>
          Home
        </Link>
      </div>
      <div className='max-w-3xl text-gray-700 dark:text-gray-300'>
        <h2 className='mb-4 text-2xl font-semibold'>Acceptance of Terms</h2>
        <p className='mb-4'>
          By accessing or using our survey rewards system, you agree to be bound by these Terms of Service ("Terms"). If
          you do not agree to these Terms, you may not use our services.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>Description of Service</h2>
        <p className='mb-4'>
          Our survey rewards system is a platform that allows event organizers to create surveys and offer rewards to
          participants. Users can participate in surveys and earn rewards based on their participation and referrals.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>User Accounts</h2>
        <p className='mb-4'>
          To use our services, you may be required to create an account. You are responsible for maintaining the
          confidentiality of your account credentials and for all activities that occur under your account. You agree to
          provide accurate and complete information when creating your account.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>User Conduct</h2>
        <p className='mb-4'>You agree to use our services in a lawful and responsible manner. You agree not to:</p>
        <ul className='mb-4 list-disc pl-5'>
          <li>Use our services for any illegal or unauthorized purpose.</li>
          <li>Interfere with or disrupt our services or servers.</li>
          <li>Attempt to gain unauthorized access to our systems or user accounts.</li>
          <li>Engage in any activity that could harm our platform or other users.</li>
          <li>Use automated means to access our platform or collect data.</li>
        </ul>

        <h2 className='mb-4 text-2xl font-semibold'>Rewards and Points</h2>
        <p className='mb-4'>
          Users may earn points by participating in surveys and referring others to our platform. The points earned can
          be redeemed for rewards as specified by the event organizers. We reserve the right to modify or terminate any
          reward program at any time.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>Intellectual Property</h2>
        <p className='mb-4'>
          All content and materials on our platform, including but not limited to text, graphics, logos, and software,
          are owned by us or our licensors and are protected by intellectual property laws. You agree not to copy,
          modify, distribute, or create derivative works based on our content without our prior written consent.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>Disclaimer of Warranties</h2>
        <p className='mb-4'>
          Our services are provided on an "as is" and "as available" basis. We make no warranties, express or implied,
          regarding the operation of our platform or the accuracy of the information provided. We disclaim all
          warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and
          non-infringement.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>Limitation of Liability</h2>
        <p className='mb-4'>
          In no event shall we be liable for any direct, indirect, incidental, special, or consequential damages arising
          out of or in connection with your use of our services. Our liability is limited to the maximum extent
          permitted by law.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>Indemnification</h2>
        <p className='mb-4'>
          You agree to indemnify and hold us harmless from any claims, damages, or expenses arising out of your use of
          our services or your violation of these Terms.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>Changes to These Terms</h2>
        <p className='mb-4'>
          We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on our
          website. Your continued use of our platform after any changes to these Terms constitutes your acceptance of
          the new Terms.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>Governing Law</h2>
        <p className='mb-4'>
          These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction].
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>Contact Us</h2>
        <p className='mb-4'>
          If you have any questions or concerns about these Terms, please contact us at{' '}
          <a href='mailto:chisom@genusnetworks.co.uk' className='text-primary'>
            support@genusnetworks.co.uk
          </a>
          .
        </p>
      </div>
    </main>
  );
}
