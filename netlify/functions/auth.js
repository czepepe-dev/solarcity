exports.handler = async (event, context) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${event.headers.origin}/api/auth-callback`;

  return {
    statusCode: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`,
    },
  };
};

