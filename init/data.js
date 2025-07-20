const data = [
  {
    type: "lost",
    title: "Black Leather Wallet",
    description: "Lost near the campus library. Contains ID and some cash.",
    location: "MGPI College Library",
    dateLost: new Date("2025-06-10"),
    category: "Bagpack",
    image: {
      url: "https://res.cloudinary.com/djqojrzli/image/upload/v1751218651/samples/ecommerce/leather-bag-gray.jpg",
      filename: "wallet_sample.jpg"
    },
    status: "open",
    claimCount: 0,
    owner: "685f7b1e9c0a4f3b8d26a4f2",
    createdAt: new Date()
  },
  {
    type: "lost",
    title: "Glazed Donuts",
    description: "Silver phone with a black case. Screen cracked at top left.",
    location: "Food court area",
    dateLost: new Date("2025-06-08"),
    category: "Electronics",
    image: {
      url: "https://res.cloudinary.com/djqojrzli/image/upload/v1751218659/samples/dessert-on-a-plate.jpg",
      filename: "samsung_phone_sample.jpg"
    },
    status: "open",
    claimCount: 0,
    owner: "685f7b1e9c0a4f3b8d26a4f2",
    createdAt: new Date("2025-06-09T14:20:00")
  },
  {
    type: "lost",
    title: "White cute stuff toy",
    description: "One key has a red tag labeled 'Room 204'.",
    location: "Near parking lot B",
    dateLost: new Date("2025-06-12"),
    category: "Keys",
    image: {
      url: "https://res.cloudinary.com/djqojrzli/image/upload/v1751218649/samples/animals/cat.jpg",
      filename: "keychain_sample.jpg"
    },
    status: "claimed",
    claimCount: 1,
    owner: "685f7b1e9c0a4f3b8d26a4f2",
    createdAt: new Date("2025-06-12T09:00:00")
  },
  {
    type: "lost",
    title: "white Nike Water shoes",
    description: "Has name 'Arisha' written on the side in black marker.",
    location: "Gym area",
    dateLost: new Date("2025-06-14"),
    category: "Bottles",
    image: {
      url: "https://res.cloudinary.com/djqojrzli/image/upload/v1751218660/cld-sample-5.jpg",
      filename: "water_bottle_sample.jpg"
    },
    status: "open",
    claimCount: 0,
    owner: "685f7b1e9c0a4f3b8d26a4f2",
    createdAt: new Date("2025-06-14T18:45:00")
  },
  {
    type: "lost",
    title: "Brown belt watch",
    description: "Small stuffed toy, sentimental value, last seen in the playground.",
    location: "Children's playground",
    dateLost: new Date("2025-06-05"),
    category: "jewelry",
    image: {
      url: "https://res.cloudinary.com/djqojrzli/image/upload/v1751218649/samples/ecommerce/analog-classic.jpg",
      filename: "teddy_bear_sample.jpg"
    },
    status: "claimed",
    claimCount: 1,
    owner: "685f7b1e9c0a4f3b8d26a4f2",
    createdAt: new Date("2025-06-06T11:15:00")
  }
];

module.exports = { sampleLostData: data };
