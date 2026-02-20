const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const code = event.queryStringParameters.code;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    }
  );

  const tokenData = await tokenResponse.json();

  return {
    statusCode: 200,
    body: JSON.stringify(tokenData),
    headers: { "Content-Type": "application/json" },
  };
};
