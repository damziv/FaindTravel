# Travelio

<img width="1356" alt="Screenshot 2023-01-30 at 11 56 19 AM" src="https://user-images.githubusercontent.com/315504/215542961-18d570b5-31df-4867-bc34-302788be1074.png">

## How it works
This project uses the <a href="https://openai.com/api/" rel="nofollow">OpenAI GPT-3 API</a> (specifically, _text-davinci-003_) and <a href="https://vercel.com/docs/concepts/functions/edge-functions" rel="nofollow">Vercel Edge functions</a> with streaming. It constructs a prompt based on the form and user input, sends it to the GPT-3 API via a Vercel Edge function, then streams the response back to the application.
