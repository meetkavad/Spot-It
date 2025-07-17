// Use `.mjs` extension or add "type": "module" in package.json for ESM
const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDE5NTg0YWQ4NTc3YTAzMDM3ZGI0OCIsImlhdCI6MTc1MjY2NTA5NiwiZXhwIjoxNzUzMjY5ODk2fQ.5DAEkCtdeROqX3QDvMBe8WXq3kozSQ1TVhTvwEUJkG4"; // replace with actual token
const API_URL = `http://localhost:5000/v1/userin/createPost`;
const sampleLocations = [
  "Library",
  "Cafeteria",
  "Main Gate",
  "Parking",
  "Lecture Hall",
];
const sampleItems = [
  "Water Bottle",
  "Laptop Charger",
  "Notebook",
  "ID Card",
  "Mobile",
];

const createPost = async (i) => {
  const payload = {
    type: "lost",
    item_name: `${sampleItems[i % sampleItems.length]} ${i + 1}`,
    location: sampleLocations[i % sampleLocations.length],
    description: `Sample description for post ${i + 1}`,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: JWT_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      console.log(`✅ Post ${i + 1} created: ${data.post._id}`);
    } else {
      console.error(`❌ Post ${i + 1} failed:`, data);
    }
  } catch (err) {
    console.error(`❌ Post ${i + 1} error:`, err.message);
  }
};

const createMultiplePosts = async () => {
  for (let i = 0; i < 20; i++) {
    await createPost(i);
  }
};

createMultiplePosts();
