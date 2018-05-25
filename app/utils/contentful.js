import { createClient } from 'contentful';

const client = createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: 'i39s3xee28h4',
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: process.env.CONTENT_PREVIEW
    ? '80aa640b4621315580df92022a75a60a9ff7d9120b5afdf2a730a30197e9d617'
    : 'dcd19ccdbb394bc877ac5c91f7322aa34e8d51c02549f95a7081edb819dc2f65',
  host: process.env.CONTENT_PREVIEW
    ? 'preview.contentful.com'
    : 'cdn.contentful.com',
});

const faqClient = createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: 'je5420y7vc9t',
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken:
    '0ddba41af29a3166e0302b89936aa3bce1b8144b1f9b5ed7238ae092d8d58e74',
});

export { faqClient };

export default client;
