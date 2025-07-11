#thise file is not neccesary for the chrome extension to function, it is just for testing purposes
# it is used to test the Together API

from together import Together
import os

client = Together(api_key="")



response = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-V3",
    messages=[
      { 
        "role": "user",
        "content": "How many tokens does it take for you to you to summaraize a 5000 word article ito 50 words?"
      }
    ]
)
print(response.choices[0].message.content)