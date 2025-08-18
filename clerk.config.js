// clerk.config.js
// This file contains placeholder values. Replace with your actual Clerk credentials.
// You can find these values in your Clerk dashboard.

module.exports = {
  // Replace with your actual Clerk API key
  apiKey: process.env.CLERK_SECRET_KEY || 'your-clerk-secret-key-here',
  
  // Replace with your actual Clerk domain
  domain: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'your-clerk-publishable-key-here'
};