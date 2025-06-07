from together import Together
import os

client = Together(api_key="e338fa9f9a17065ad19317716e44a1d73d4a2e0283a13cfece8b7f037e92c7c8")



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