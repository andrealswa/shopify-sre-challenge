import jwt from 'jsonwebtoken';

// Helper function to check the validity of a token then extract and return its contents.
export const verifyAndDecodeToken = (token) => {
  const decodedToken: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
  if (!decodedToken) {
    // Could write something like this to a log for analytics for the development team.
    console.log('Unauthorized User Detected');
    return;
  }
  return decodedToken;
};
