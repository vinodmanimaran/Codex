const express = require ('express');
const dotenv = require ('dotenv');
const cors = require ('cors');
const {Configuration, OpenAIApi} = require ('openai');
const path = require ('path');

dotenv.config ();

const configuration = new Configuration ({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi (configuration);

const app = express ();
app.use (cors ());
app.use (express.static (path.join (__dirname, '../client/dist')));

app.get ('*', function (_, res) {
  res.sendFile (path.join (__dirname, '../client/dist/index.html'), function (
    err
  ) {
    if (err) {
      res.status (500).send (err);
    }
  });
});

app.use (express.json ());

app.post ('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion ({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status (200).send ({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log (error);
    res.status (500).send (error || 'Something went wrong');
  }
});

app.listen (5000, () =>
  console.log ('Codex server started on http://localhost:5000')
);
