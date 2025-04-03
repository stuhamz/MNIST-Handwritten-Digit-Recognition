async function handler({ image }) {
  if (!image) {
    return { error: "No image provided" };
  }

  try {
    const response = await fetch("/integrations/gpt-vision/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "What single digit (0-9) is drawn in this image? Reply with just the digit number.",
              },
              {
                type: "image_url",
                image_url: { url: image },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze image");
    }

    const data = await response.json();
    const prediction = data.choices[0].message.content;

    return { prediction };
  } catch (error) {
    return { error: "Failed to process image" };
  }
}