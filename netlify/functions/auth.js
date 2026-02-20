export default async (req, context) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${req.url}/callback`;

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;

  return Response.redirect(url, 302);
};
