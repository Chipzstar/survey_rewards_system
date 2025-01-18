import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className='flex min-h-screen flex-col items-center p-4 md:p-24'>
      <div className='mb-8 flex w-full items-center justify-between'>
        <h1 className='text-3xl font-bold md:text-4xl'>Privacy Policy</h1>
        <Link href='/' className='text-primary underline'>
          Home
        </Link>
      </div>
      <div className='max-w-3xl text-gray-700 dark:text-gray-300'>
        <h2 className='mb-4 text-2xl font-semibold'>Introduction</h2>
        <p className='mb-4'>
          This Privacy Policy explains how we collect, use, and protect your personal information when you use our
          survey rewards system. We are committed to protecting your privacy and ensuring that your personal information
          is handled in a safe and responsible manner.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>Information We Collect</h2>
        <p className='mb-4'>We collect the following types of information:</p>
        <ul className='mb-4 list-disc pl-5'>
          <li>
            <strong>Personal Information:</strong> When you register for an account, we collect your name, email
            address, and any other information you provide during the registration process.
          </li>
          <li>
            <strong>Survey Responses:</strong> We collect the responses you provide when participating in surveys.
          </li>
          <li>
            <strong>Referral Information:</strong> If you refer others to our platform, we collect the email addresses
            of those you refer.
          </li>
          <li>
            <strong>Usage Data:</strong> We collect information about how you use our platform, including your IP
            address, browser type, and the pages you visit.
          </li>
        </ul>

        <h2 className='mb-4 text-2xl font-semibold'>How We Use Your Information</h2>
        <p className='mb-4'>We use your information for the following purposes:</p>
        <ul className='mb-4 list-disc pl-5'>
          <li>To provide and maintain our services.</li>
          <li>To personalize your experience on our platform.</li>
          <li>To administer surveys and reward programs.</li>
          <li>To communicate with you about your account and our services.</li>
          <li>To improve our platform and develop new features.</li>
          <li>To prevent fraud and ensure the security of our platform.</li>
        </ul>

        <h2 className='mb-4 text-2xl font-semibold'>How We Share Your Information</h2>
        <p className='mb-4'>We may share your information with the following parties:</p>
        <ul className='mb-4 list-disc pl-5'>
          <li>
            <strong>Service Providers:</strong> We share your information with third-party service providers who help us
            operate our platform, such as hosting providers and email service providers.
          </li>
          <li>
            <strong>Event Organizers:</strong> We share your survey responses with the event organizers who created the
            surveys.
          </li>
          <li>
            <strong>Legal Authorities:</strong> We may disclose your information to legal authorities if required by law
            or in response to a valid legal request.
          </li>
        </ul>

        <h2 className='mb-4 text-2xl font-semibold'>Data Security</h2>
        <p className='mb-4'>
          We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure.
          These measures include encryption, access controls, and regular security assessments.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>Your Rights</h2>
        <p className='mb-4'>You have the following rights regarding your personal information:</p>
        <ul className='mb-4 list-disc pl-5'>
          <li>You have the right to access the personal information we hold about you.</li>
          <li>You have the right to correct any inaccuracies in your personal information.</li>
          <li>You have the right to request the deletion of your personal information.</li>
          <li>You have the right to object to the processing of your personal information.</li>
        </ul>

        <h2 className='mb-4 text-2xl font-semibold'>Changes to This Privacy Policy</h2>
        <p className='mb-4'>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
          policy on our website. Your continued use of our platform after any changes to this policy constitutes your
          acceptance of the new policy.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>Contact Us</h2>
        <p className='mb-4'>
          If you have any questions or concerns about this Privacy Policy, please contact us at{' '}
          <a href='mailto:chisom@genusnetworks.co.uk' className='text-primary'>
            support@genusnetworks.co.uk
          </a>
          .
        </p>
      </div>
    </main>
  );
}
