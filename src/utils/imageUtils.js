export const processImageUpload = async (file) => {
  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('Image must be smaller than 10MB');
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Simulate upload delay
      setTimeout(() => resolve(e.target.result), 1000);
    };
    reader.readAsDataURL(file);
  });
};

export const analyzeImageWithAI = async (file, character) => {
  return new Promise((resolve) => {
    // Simulate AI image analysis
    setTimeout(() => {
      const analyses = {
        1: "I see this image shows [description]. It reminds me of the importance of protecting what's precious. 💧",
        2: "Analyzing this image... It appears to depict [description]. This requires further logical assessment. 🎯",
        3: "This image shows [description]. It makes me think about leveling up and becoming stronger. ⚡",
        4: "This image displays [description]. It's all about ego and ambition - just like football! ⚽",
        5: "Looking at this image of [description]. Of course, I'm the strongest at image analysis too! 😎"
      };
      
      resolve(analyses[character.id] || "I've received your image. What would you like to know about it?");
    }, 1500);
  });
};

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return 'Only JPG, JPEG, PNG, GIF, and WEBP images are allowed';
  }

  if (file.size > 10 * 1024 * 1024) {
    return 'Image must be smaller than 10MB';
  }

  return null;
};